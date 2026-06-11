import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "outputs/core-tech-tree-template";
const outputPath = `${outputDir}/PTRS_Core_Tech_Data_Template.xlsx`;

const colors = {
  navy: "#001B44",
  blue: "#005BAC",
  teal: "#008C95",
  line: "#CBD8E8",
  pale: "#F4F7FB",
  header: "#EAF3FF",
  text: "#0B1628",
};

const headers = [
  "tech_id",
  "level1",
  "level2",
  "level3",
  "기술요약",
  "핵심기술_태그",
  "is_core",
  "growth_stage",
  "research_stage",
  "sort_order",
  "active_yn",
  "notes",
];

for (let i = 1; i <= 5; i += 1) {
  headers.push(`org_${i}_type`, `org_${i}_name`, `org_${i}_owner`, `org_${i}_role`);
}

const rows = [
  [
    "P-001",
    "제품",
    "후판",
    "LNG용 고Mn강",
    "극저온 후판의 합금 설계와 인성 확보",
    "극저온, LNG, 후판",
    "TRUE",
    "신시장/미래",
    "전략기술",
    10,
    "Y",
    "Core 기술 예시",
    "연구그룹",
    "열연선재후판",
    "홍길동",
    "주관",
    "연구그룹",
    "차세대철강",
    "김민수",
    "협업",
  ],
  [
    "P-003",
    "제품",
    "냉연",
    "1.5GPa급 냉연강",
    "차체 경량화를 위한 냉연 고강도강",
    "자동차, 냉연",
    "TRUE",
    "기술성숙",
    "전략기술",
    20,
    "Y",
    "연구그룹과 TF가 동시에 수행하는 예시",
    "연구그룹",
    "자동차소재",
    "오지훈",
    "주관",
    "Team",
    "[8대]GigaSteel",
    "강하늘",
    "협업",
  ],
  [
    "PR-004",
    "공정",
    "DX",
    "품질 이상탐지 모델",
    "라인 품질 조기경보와 원인 탐색",
    "AI, DX, 품질",
    "TRUE",
    "기술진화",
    "차세대기술",
    30,
    "Y",
    "",
    "연구그룹",
    "로봇AI",
    "신예린",
    "주관",
    "Team",
    "[C]제품AX",
    "재원",
    "협업",
  ],
  [
    "S-004",
    "솔루션",
    "가전",
    "프리미엄 외판 표면품질",
    "가전 외판용 표면 품질 편차 저감",
    "표면품질, 고객",
    "FALSE",
    "",
    "수익기술",
    40,
    "Y",
    "Core 제외 예시",
    "Team",
    "[C]제품AX",
    "나윤",
    "담당",
  ],
  [
    "AX-001",
    "AX",
    "A1-Steel Brain",
    "AI 합금-공정 추천",
    "합금 설계와 공정 조건 추천",
    "AI, 합금설계",
    "TRUE",
    "기술진화",
    "차세대기술",
    50,
    "Y",
    "",
    "연구그룹",
    "로봇AI",
    "세아",
    "주관",
    "Team",
    "[C]제품AX",
    "강하늘",
    "협업",
  ],
];

function rangeFor(sheet, row, col, rowCount, colCount) {
  return sheet.getRangeByIndexes(row - 1, col - 1, rowCount, colCount);
}

function writeBlock(sheet, startRow, startCol, values) {
  rangeFor(sheet, startRow, startCol, values.length, values[0].length).values = values;
}

function setWidths(sheet, widths) {
  widths.forEach((width, i) => {
    sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidthPx = width;
  });
}

function styleHeader(range) {
  range.format.fill = { color: colors.header };
  range.format.font = { bold: true, color: colors.navy, size: 10 };
  range.format.borders = { preset: "all", style: "thin", color: colors.line };
  range.format.wrapText = true;
}

function styleBody(range) {
  range.format.font = { color: colors.text, size: 10 };
  range.format.borders = { preset: "all", style: "thin", color: "#E3EBF4" };
  range.format.wrapText = true;
}

function addValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = { rule: { type: "list", values } };
}

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("01_Core_Tech_Data");
sheet.showGridLines = false;

const maxRows = 150;
const table = [headers, ...rows];
while (table.length < maxRows + 1) table.push(Array(headers.length).fill(null));

writeBlock(sheet, 1, 1, table);
styleHeader(sheet.getRangeByIndexes(0, 0, 1, headers.length));
styleBody(sheet.getRangeByIndexes(1, 0, maxRows, headers.length));
sheet.tables.add(`A1:AF${maxRows + 1}`, true, "CoreTechDataTable").style = "TableStyleMedium2";
sheet.freezePanes.freezeRows(1);

setWidths(sheet, [
  90, 90, 140, 210, 280, 190, 80, 115, 110, 80, 80, 220,
  95, 170, 90, 90, 95, 170, 90, 90, 95, 170, 90, 90, 95, 170, 90, 90,
  95, 170, 90, 90,
]);

addValidation(sheet, "B2:B151", ["제품", "공정", "솔루션", "AX"]);
addValidation(sheet, "G2:G151", ["TRUE", "FALSE"]);
addValidation(sheet, "H2:H151", ["기술진화", "기술성숙", "신시장/미래", ""]);
addValidation(sheet, "I2:I151", ["비전기술", "차세대기술", "전략기술", "수익기술", ""]);
for (const col of ["M", "Q", "U", "Y", "AC"]) {
  addValidation(sheet, `${col}2:${col}151`, ["연구그룹", "Team", "팀", "TF팀", "PJ팀", ""]);
}
addValidation(sheet, "K2:K151", ["Y", "N"]);

sheet.getRange("A1:AF1").format.rowHeightPx = 42;
sheet.getRange("A2:AF151").format.rowHeightPx = 34;
sheet.getRange("A1:AF1").format.horizontalAlignment = "center";

await fs.mkdir(outputDir, { recursive: true });
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`created: ${outputPath}`);
