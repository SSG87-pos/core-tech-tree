# HANDOFF

## Current State

현재 대표 HTML은 프로젝트 루트의 아래 파일입니다.

`PTRS_Core_Tech_Map.html`

이 화면은 `PTRS ↔ Core Tech` 제목, Level 구조 KPI, Core 지정 KPI, 필터, 트리형 기술 체계 맵, 클릭 위치 옆 상세 팝오버, Core Tech 통계를 포함합니다.

## Data Loading Priority

HTML 데이터 로딩 우선순위는 다음과 같습니다.

1. 브라우저 localStorage에 저장된 업로드 데이터
2. 같은 폴더 기준 `data/core-tech-data.json`
3. HTML 내부 `FALLBACK_ROWS` 데모 데이터

따라서 HTML 파일 하나만 전달해도 데모 화면은 열리고, 사용자가 `XLSX 가져오기` 또는 `JSON 가져오기`로 자기 데이터를 올리면 즉시 화면에 반영됩니다. 배포는 필수가 아닙니다.

## Data Buttons

왼쪽 필터 패널의 `데이터` 섹션:

- `XLSX 가져오기`: 템플릿 구조의 `.xlsx`를 읽어 화면에 반영하고 localStorage에 저장합니다.
- `XLSX 내보내기`: 현재 화면 데이터를 간단한 템플릿 구조의 `.xlsx`로 내려받습니다.
- `JSON 가져오기`: HTML용 JSON을 읽어 화면에 반영하고 localStorage에 저장합니다.
- `JSON 내보내기`: 현재 화면 데이터를 `ptrs-core-tech-data.json`으로 내려받습니다.

브라우저 내 XLSX 파서는 외부 CDN 없이 동작하도록 HTML 내부에 들어 있습니다. 범용 엑셀 파서가 아니라 현재 템플릿 구조 읽기/쓰기 목적입니다.

## Tree Editing

트리에서 Level 3 또는 Level 4 항목을 클릭하면 왼쪽 `트리 편집` 패널이 열립니다.

- Level 3 편집: Level 3명, Level 3 Core 지정/해제, 성장 카테고리, 연구단계 구분을 수정합니다.
- Level 4 편집: Level 4명, Level 4 Core 지정/해제, 성장 카테고리, 연구단계 구분, 기술 스티커, 연구그룹/팀/담당자를 수정합니다.
- 저장하면 localStorage에 즉시 반영되고 KPI, 트리, 그래프가 다시 계산됩니다.
- Level 3를 Core로 저장하면 같은 Level 3 아래 Level 4 Core는 자동 해제됩니다.
- Level 4를 Core로 저장하면 부모 Level 3 Core는 자동 해제됩니다.
- 수정 후 사용자는 `JSON 내보내기` 또는 `XLSX 내보내기`로 파일을 저장해야 다른 사람에게 전달할 수 있습니다.

## Detail Popover

트리에서 Level 3 또는 Level 4 항목을 클릭하면 클릭한 항목 옆에 `상세` 팝오버가 열립니다.

- Level 3 상세: 경로, Core 범위, 성장 카테고리, 연구단계 구분, 하위 Level 4, 기술 스티커, 관련 조직을 보여줍니다.
- Level 4 상세: 경로, Core 범위, 성장 카테고리, 연구단계 구분, 기술 스티커, 관련 조직을 보여줍니다.
- 관련 조직은 계층 구조가 아니라 독립된 수행 주체 목록으로 표시합니다.
- 팝오버는 고정 사이드바가 아니며, 선택 항목의 위치를 기준으로 화면 안에 들어오도록 좌우/상하 배치를 조정합니다.

## Important Files

- HTML: `PTRS_Core_Tech_Map.html`
- Current JSON data: `data/core-tech-data.json`
- Excel template: `outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx`
- Excel template builder: `scripts/build-core-tech-template.mjs`
- Batch converter: `scripts/convert_excel_to_core_data.py`
- Schema docs: `docs/DATA_SCHEMA.md`

## Verified Behaviors

- HTML script syntax passes.
- `core-tech-data.json` is valid JSON.
- Python converter reads the provided Excel template and writes 8 rows to a test JSON.
- Browser fallback works when `data/core-tech-data.json` is not served by localhost.
- `일반기술만` filter keeps the first child technology under Level 3 Core, so the hierarchy does not disappear.
- XLSX import reads `PTRS_Core_Tech_Data_Template.xlsx` and updates the screen to 8 sample rows.
- Tree edit panel can change a Level 4 item to Core and persists the edited rows in localStorage.

## UI Decisions To Preserve

- Title text is only `PTRS ↔ Core Tech`.
- UI should remain light, compact, and POSCO-like rather than dark or decorative.
- Level and Core should use separate visual systems.
- Core count pills use `Core N개`.
- Growth category star colors:
  - 시장성장: amber
  - 기술성장: purple
  - 미래성장: rose
- Non-core Level 4 rows share one neutral background.
- Representative technology is shown as a small sticker next to the Level 4 title.
- Research groups are combined into one compact pill when multiple groups exist.
- Charts support hover tooltips that list relevant technologies.

## Continue From Here

When continuing work:

1. Start by opening `PTRS_Core_Tech_Map.html`.
2. Preserve the data loading priority unless the user asks for a different deployment model.
3. If changing the Excel structure, update both:
   - browser XLSX import/export logic inside the HTML
   - `scripts/convert_excel_to_core_data.py`
4. Update `docs/DATA_SCHEMA.md` after any schema change.
5. Re-verify with browser automation after UI or import/export changes.

## Useful Verification Commands

```sh
/Users/seulgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "const fs=require('fs'); const html=fs.readFileSync('PTRS_Core_Tech_Map.html','utf8'); const m=html.match(/<script>([\\s\\S]*)<\\/script>/); new Function(m[1]); console.log('script ok');"
```

```sh
/Users/seulgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/convert_excel_to_core_data.py outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx --output /private/tmp/core-tech-test.json
```
