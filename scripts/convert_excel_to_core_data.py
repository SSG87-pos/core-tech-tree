#!/usr/bin/env python3
"""Convert PTRS Core Tech Excel template into HTML-ready JSON data.

Usage:
  python3 scripts/convert_excel_to_core_data.py \
    outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx

The default output is:
  data/core-tech-data.json
"""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from openpyxl import load_workbook


DEFAULT_OUTPUT = Path("data/core-tech-data.json")


def clean(value: Any) -> str:
    if value is None:
        return ""
    return str(value).strip()


def split_multi(value: Any) -> list[str]:
    text = clean(value)
    if not text:
        return []
    return [part.strip() for part in text.replace(";", ",").split(",") if part.strip()]


def table_rows(sheet) -> list[dict[str, Any]]:
    headers = [clean(cell.value) for cell in next(sheet.iter_rows(min_row=1, max_row=1))]
    rows: list[dict[str, Any]] = []
    for row in sheet.iter_rows(min_row=2, values_only=True):
        item = {headers[i]: row[i] if i < len(row) else None for i in range(len(headers))}
        if any(clean(value) for value in item.values()):
            rows.append(item)
    return rows


def first_non_empty(*values: Any) -> str:
    for value in values:
        text = clean(value)
        if text:
            return text
    return ""


def owner_rows_from_master(row: dict[str, Any]) -> list[dict[str, str]]:
    owners: list[dict[str, str]] = []
    for suffix in ["", "_2", "_3"]:
        group = clean(row.get(f"research_group{suffix}"))
        team = clean(row.get(f"team{suffix}"))
        owner = clean(row.get(f"owner{suffix}"))
        if group or team or owner:
            owners.append({"group": group, "team": team, "owner": owner})
    if not owners:
        owners.append({"group": "", "team": "", "owner": ""})
    return owners


def build_owner_index(owner_rows: list[dict[str, Any]]) -> dict[str, list[dict[str, str]]]:
    index: dict[str, list[dict[str, str]]] = {}
    for row in owner_rows:
        tech_id = clean(row.get("tech_id"))
        if not tech_id:
            continue
        index.setdefault(tech_id, []).append(
            {
                "group": clean(row.get("research_group")),
                "team": clean(row.get("team")),
                "owner": clean(row.get("owner")),
                "role": clean(row.get("role")),
                "isPrimary": clean(row.get("is_primary")),
            }
        )
    return index


def core_indexes(core_rows: list[dict[str, Any]]):
    level3: dict[tuple[str, str, str], dict[str, Any]] = {}
    level4: dict[tuple[str, str, str, str], dict[str, Any]] = {}
    for row in core_rows:
        core_level = clean(row.get("core_level"))
        key3 = (clean(row.get("level1")), clean(row.get("level2")), clean(row.get("level3")))
        key4 = (*key3, clean(row.get("level4")))
        if core_level == "Level 3 Core":
            level3[key3] = row
        elif core_level == "Level 4 Core":
            level4[key4] = row
    return level3, level4


def convert(workbook_path: Path, output_path: Path) -> dict[str, Any]:
    wb = load_workbook(workbook_path, data_only=True)
    tech_rows = table_rows(wb["01_Tech_Master"])
    core_rows = table_rows(wb["02_Core_Definition"])
    owner_rows = table_rows(wb["03_Owner_Link"]) if "03_Owner_Link" in wb.sheetnames else []

    owner_index = build_owner_index(owner_rows)
    l3_cores, l4_cores = core_indexes(core_rows)
    l3_core_used: set[tuple[str, str, str]] = set()

    output_rows: list[dict[str, Any]] = []
    for row in tech_rows:
        if clean(row.get("active_yn")).upper() == "N":
            continue
        l1 = clean(row.get("level1"))
        l2 = clean(row.get("level2"))
        l3 = clean(row.get("level3"))
        l4 = clean(row.get("level4"))
        if not all([l1, l2, l3, l4]):
            continue

        key3 = (l1, l2, l3)
        key4 = (l1, l2, l3, l4)
        core_level = 0
        core = None
        if key3 in l3_cores and key3 not in l3_core_used:
            core_level = 3
            core = l3_cores[key3]
            l3_core_used.add(key3)
        elif key4 in l4_cores:
            core_level = 4
            core = l4_cores[key4]

        owners = owner_index.get(clean(row.get("tech_id"))) or owner_rows_from_master(row)
        primary = owners[0] if owners else {"group": "", "team": "", "owner": ""}
        category = clean(core.get("growth_category")) if core else ""
        program = first_non_empty(
            core.get("research_stage") if core else "",
            core.get("related_program") if core else "",
            row.get("research_stage"),
            row.get("related_program"),
            "-",
        )
        rep = clean(row.get("대표기술명"))
        tags = first_non_empty(core.get("core_tags") if core else "", row.get("핵심기술_태그"))

        output_rows.append(
            {
                "l1": l1,
                "l2": l2,
                "l3": l3,
                "l4": l4,
                "coreLevel": core_level,
                "category": category,
                "group": primary.get("group", ""),
                "team": primary.get("team", ""),
                "research_stage": program or "-",
                "rep": rep,
                "tags": tags,
                "owners": [
                    {
                        "group": clean(owner.get("group")),
                        "team": clean(owner.get("team")),
                        "owner": clean(owner.get("owner")),
                    }
                    for owner in owners
                    if clean(owner.get("group")) or clean(owner.get("team")) or clean(owner.get("owner"))
                ],
            }
        )

    payload = {
        "schemaVersion": 1,
        "source": str(workbook_path),
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "rows": output_rows,
    }
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return payload


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert Core Tech Excel template to HTML JSON.")
    parser.add_argument("workbook", type=Path, help="Path to PTRS Core Tech Excel workbook")
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output JSON path. Default: {DEFAULT_OUTPUT}",
    )
    args = parser.parse_args()
    payload = convert(args.workbook, args.output)
    print(f"saved: {args.output}")
    print(f"rows: {len(payload['rows'])}")


if __name__ == "__main__":
    main()
