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
  greenPale: "#EAF8F8",
  amberPale: "#FFF7ED",
  rosePale: "#FFF1F2",
  text: "#0B1628",
  muted: "#45556B",
};

const techHeaders = [
  "tech_id",
  "level1",
  "level2",
  "level3",
  "level4",
  "기술명_약칭",
  "대표기술명",
  "핵심기술_태그",
  "research_group",
  "team",
  "owner",
  "research_group_2",
  "team_2",
  "owner_2",
  "research_group_3",
  "team_3",
  "owner_3",
  "research_stage",
  "sort_order",
  "active_yn",
  "notes",
];

const coreHeaders = [
  "core_id",
  "core_level",
  "level1",
  "level2",
  "level3",
  "level4",
  "core_tech_name",
  "core_tags",
  "growth_category",
  "research_stage",
  "research_group",
  "team",
  "owner",
  "selection_reason",
  "priority",
  "notes",
];

const ownerHeaders = [
  "tech_id",
  "level1",
  "level2",
  "level3",
  "level4",
  "research_group",
  "team",
  "owner",
  "role",
  "is_primary",
  "notes",
];

const exportHeaders = [
  "level1",
  "level2",
  "level3",
  "level4",
  "대표기술명",
  "핵심기술",
  "is_core",
  "core_level",
  "research_group",
  "team",
  "owner",
  "카테고리",
  "research_stage",
  "sort_order",
];

const sampleTechRows = [
  ["T-0001", "산업군", "에너지 산업", "수소/극저온 소재", "LNG용 고Mn강 설계", "고Mn강", "고Mn 합금설계", "극저온, 합금설계", "후판연구그룹", "소재설계팀", "홍길동", "재료해석그룹", "인성평가팀", "김민수", "", "", "", "전략기술", 10, "Y", "Level 3 Core의 구성기술 예시"],
  ["T-0002", "산업군", "에너지 산업", "수소/극저온 소재", "극저온 인성 예측 모델", "인성예측", "저온 파괴모델", "시뮬레이션, 인성", "재료해석그룹", "모델링팀", "이서연", "후판연구그룹", "시험평가팀", "박준호", "", "", "", "전략기술", 20, "Y", ""],
  ["T-0003", "산업군", "에너지 산업", "배터리 소재", "열처리 생략형 Ni-X 도금", "Ni-X 도금", "Ni-X 조성 제어", "도금, 열처리", "도금연구그룹", "표면처리팀", "정다은", "공정설비그룹", "연속공정팀", "최현우", "", "", "", "차세대기술", 30, "Y", "Level 4 Core 예시"],
  ["T-0004", "산업군", "모빌리티 산업", "자동차 경량화", "1.5GPa급 냉연강", "냉연강", "고강도-연성 밸런스", "경량화, 냉연", "자동차소재연구그룹", "강재개발팀", "오지훈", "재료설계그룹", "합금설계팀", "강하늘", "", "", "", "전략기술", 40, "Y", "Level 3 Core의 구성기술 예시"],
  ["T-0005", "산업군", "모빌리티 산업", "전기차 구동소재", "고효율 전기강판", "전기강판", "철손 저감", "전기강판, 효율", "전기강판연구그룹", "자성재료팀", "장서윤", "", "", "", "", "", "", "수익기술", 50, "Y", "Level 4 Core 예시"],
  ["T-0006", "제품군", "고급강 제품", "고강도/고성형 강재", "상변태 제어 모델", "상변태", "TRIP/TWIP 거동 예측", "고성형, 모델", "재료설계그룹", "상변태팀", "문지호", "", "", "", "", "", "", "비전기술", 60, "Y", "Level 3 Core의 구성기술 예시"],
  ["T-0007", "제품군", "고급강 제품", "고내식 표면처리", "Zn-Al-Mg 도금조직 제어", "Zn-Al-Mg", "삼원계 도금조직", "도금, 내식", "도금연구그룹", "표면기술팀", "배유진", "", "", "", "", "", "", "수익기술", 70, "Y", "Level 4 Core 예시"],
  ["T-0008", "공정군", "AI/DT 공정", "공정 예측/자동제어", "품질 이상탐지 모델", "이상탐지", "AI 이상탐지", "AI, 품질", "AI공정그룹", "데이터모델팀", "신예린", "", "", "", "", "", "", "차세대기술", 80, "Y", "Level 4 Core 예시"],
];

const sampleCoreRows = [
  ["C-0001", "Level 3 Core", "산업군", "에너지 산업", "수소/극저온 소재", "", "수소/극저온 소재", "극저온, 수소, LNG", "미래성장", "전략기술", "후판연구그룹; 재료해석그룹", "소재설계팀; 인성평가팀", "홍길동; 김민수", "Level 3 자체를 Core로 지정. 하위 Level 4는 구성기술", 1, ""],
  ["C-0002", "Level 4 Core", "산업군", "에너지 산업", "배터리 소재", "열처리 생략형 Ni-X 도금", "열처리 생략형 Ni-X 도금", "도금, 공정생략", "기술성장", "차세대기술", "도금연구그룹; 공정설비그룹", "표면처리팀; 연속공정팀", "정다은; 최현우", "Level 4 세부기술 자체를 Core로 지정", 2, ""],
  ["C-0003", "Level 3 Core", "산업군", "모빌리티 산업", "자동차 경량화", "", "자동차 경량화", "경량화, 강도", "시장성장", "전략기술", "자동차소재연구그룹; 재료설계그룹", "강재개발팀; 합금설계팀", "오지훈; 강하늘", "Level 3 자체를 Core로 지정", 3, ""],
  ["C-0004", "Level 4 Core", "산업군", "모빌리티 산업", "전기차 구동소재", "고효율 전기강판", "고효율 전기강판", "전기강판, 효율", "시장성장", "수익기술", "전기강판연구그룹", "자성재료팀", "장서윤", "Level 4 세부기술 자체를 Core로 지정", 4, ""],
  ["C-0005", "Level 4 Core", "공정군", "AI/DT 공정", "공정 예측/자동제어", "품질 이상탐지 모델", "품질 이상탐지 모델", "AI, 이상탐지", "기술성장", "차세대기술", "AI공정그룹", "데이터모델팀", "신예린", "Level 4 세부기술 자체를 Core로 지정", 5, ""],
];

const sampleOwnerRows = [
  ["T-0001", "산업군", "에너지 산업", "수소/극저온 소재", "LNG용 고Mn강 설계", "후판연구그룹", "소재설계팀", "홍길동", "주관", "Y", ""],
  ["T-0001", "산업군", "에너지 산업", "수소/극저온 소재", "LNG용 고Mn강 설계", "재료해석그룹", "인성평가팀", "김민수", "협업", "N", ""],
  ["T-0003", "산업군", "에너지 산업", "배터리 소재", "열처리 생략형 Ni-X 도금", "도금연구그룹", "표면처리팀", "정다은", "주관", "Y", ""],
  ["T-0003", "산업군", "에너지 산업", "배터리 소재", "열처리 생략형 Ni-X 도금", "공정설비그룹", "연속공정팀", "최현우", "협업", "N", ""],
];

function rangeFor(sheet, row, col, rows, cols) {
  return sheet.getRangeByIndexes(row - 1, col - 1, rows, cols);
}

function writeBlock(sheet, startRow, startCol, rows) {
  rangeFor(sheet, startRow, startCol, rows.length, rows[0].length).values = rows;
}

function styleTitle(range) {
  range.format.fill = { color: colors.navy };
  range.format.font = { bold: true, color: "#FFFFFF", size: 16 };
  range.format.borders = { preset: "outside", style: "thin", color: colors.navy };
}

function styleHeader(range, fill = colors.header) {
  range.format.fill = { color: fill };
  range.format.font = { bold: true, color: colors.navy, size: 10 };
  range.format.borders = { preset: "all", style: "thin", color: colors.line };
  range.format.wrapText = true;
}

function styleBody(range) {
  range.format.font = { color: colors.text, size: 10 };
  range.format.borders = { preset: "all", style: "thin", color: "#E3EBF4" };
  range.format.wrapText = true;
}

function setWidths(sheet, widths) {
  widths.forEach((width, i) => {
    sheet.getRangeByIndexes(0, i, 1, 1).format.columnWidthPx = width;
  });
}

function addValidation(sheet, range, values) {
  sheet.getRange(range).dataValidation = {
    rule: { type: "list", values },
  };
}

function addTable(sheet, range, name) {
  const table = sheet.tables.add(range, true, name);
  table.style = "TableStyleMedium2";
  table.showFilterButton = true;
  return table;
}

const workbook = Workbook.create();
const readme = workbook.worksheets.add("00_README");
const master = workbook.worksheets.add("01_Tech_Master");
const core = workbook.worksheets.add("02_Core_Definition");
const owners = workbook.worksheets.add("03_Owner_Link");
const lists = workbook.worksheets.add("04_Codebook_Lists");
const examples = workbook.worksheets.add("05_Examples");
const mapping = workbook.worksheets.add("06_HTML_Mapping");
const qa = workbook.worksheets.add("07_QA_Checks");

for (const sheet of [readme, master, core, owners, lists, examples, mapping, qa]) {
  sheet.showGridLines = false;
}

writeBlock(readme, 1, 1, [["PTRS ↔ Core Tech 데이터 입력 템플릿"]]);
readme.getRange("A1:H1").merge();
styleTitle(readme.getRange("A1:H1"));
writeBlock(readme, 3, 1, [
  ["목적", "Level 1~4 기술 체계, Core 지정 범위, 담당 연구그룹/팀/담당자를 HTML Tech Tree로 시각화하기 위한 입력 양식입니다."],
  ["입력 순서", "1) 01_Tech_Master에 Level 4 기준 전체 기술을 입력합니다. 2) 02_Core_Definition에 Core로 선정된 Level 3 또는 Level 4만 입력합니다. 3) 담당 조직이 2개 이상이면 03_Owner_Link를 함께 사용합니다."],
  ["중요 규칙", "Level 3가 Core이면 같은 Level 3 아래 Level 4를 Core로 중복 지정하지 않습니다. Level 4가 Core이면 부모 Level 3는 Core로 지정하지 않습니다."],
  ["권장 행 기준", "01_Tech_Master는 Level 4 기술 1개 = 1행입니다. 약 300개 기술까지 바로 입력할 수 있도록 300행 범위에 검증 목록을 걸어두었습니다."],
  ["대표기술명", "Level 4 기술명 옆에 작은 스티커로 표시할 1개 기술명입니다. 너무 길지 않게 1개만 입력하는 것을 권장합니다."],
  ["성장 카테고리", "Core 기술에만 입력합니다. 시장성장 / 기술성장 / 미래성장 중 하나를 사용합니다."],
  ["연구단계 구분", "비전기술 / 차세대기술 / 전략기술 / 수익기술 중 하나를 사용합니다. 해당 없음은 '-'로 입력합니다."],
]);
styleBody(readme.getRange("A3:B9"));
readme.getRange("A3:A9").format.fill = { color: colors.header };
readme.getRange("A3:A9").format.font = { bold: true, color: colors.navy };
setWidths(readme, [130, 860]);

const maxMasterRows = 300;
const masterRows = [techHeaders, ...sampleTechRows];
while (masterRows.length < maxMasterRows + 1) masterRows.push(Array(techHeaders.length).fill(null));
writeBlock(master, 1, 1, masterRows);
styleHeader(master.getRange("A1:U1"));
styleBody(master.getRange(`A2:U${maxMasterRows + 1}`));
addTable(master, `A1:U${maxMasterRows + 1}`, "TechMasterTable");
master.freezePanes.freezeRows(1);
setWidths(master, [90, 90, 140, 160, 190, 100, 140, 160, 150, 120, 90, 150, 120, 90, 150, 120, 90, 110, 80, 80, 220]);

const maxCoreRows = 120;
const coreRows = [coreHeaders, ...sampleCoreRows];
while (coreRows.length < maxCoreRows + 1) coreRows.push(Array(coreHeaders.length).fill(null));
writeBlock(core, 1, 1, coreRows);
styleHeader(core.getRange("A1:P1"), colors.greenPale);
styleBody(core.getRange(`A2:P${maxCoreRows + 1}`));
addTable(core, `A1:P${maxCoreRows + 1}`, "CoreDefinitionTable");
core.freezePanes.freezeRows(1);
setWidths(core, [85, 110, 90, 140, 160, 190, 190, 160, 110, 110, 170, 140, 100, 260, 80, 220]);

const maxOwnerRows = 400;
const ownerRows = [ownerHeaders, ...sampleOwnerRows];
while (ownerRows.length < maxOwnerRows + 1) ownerRows.push(Array(ownerHeaders.length).fill(null));
writeBlock(owners, 1, 1, ownerRows);
styleHeader(owners.getRange("A1:K1"), colors.amberPale);
styleBody(owners.getRange(`A2:K${maxOwnerRows + 1}`));
addTable(owners, `A1:K${maxOwnerRows + 1}`, "OwnerLinkTable");
owners.freezePanes.freezeRows(1);
setWidths(owners, [90, 90, 140, 160, 190, 160, 130, 100, 90, 80, 220]);

const listRows = [
  ["level1", "core_level", "growth_category", "research_stage", "active_yn", "is_primary", "research_group_sample", "html_color"],
  ["산업군", "Level 3 Core", "시장성장", "비전기술", "Y", "Y", "후판연구그룹", "#F97316"],
  ["제품군", "Level 4 Core", "기술성장", "차세대기술", "N", "N", "재료해석그룹", "#7C3AED"],
  ["공정군", "", "미래성장", "전략기술", "", "", "도금연구그룹", "#E11D48"],
  ["", "", "", "수익기술", "", "", "AI공정그룹", ""],
  ["", "", "", "-", "", "", "전기강판연구그룹", ""],
];
writeBlock(lists, 1, 1, listRows);
styleHeader(lists.getRange("A1:H1"));
styleBody(lists.getRange("A2:H6"));
addTable(lists, "A1:H6", "ValidationListsTable");
setWidths(lists, [110, 130, 130, 130, 90, 90, 180, 100]);

writeBlock(examples, 1, 1, [["01_Tech_Master 예시"]]);
examples.getRange("A1:U1").merge();
styleTitle(examples.getRange("A1:U1"));
writeBlock(examples, 3, 1, [techHeaders, ...sampleTechRows]);
styleHeader(examples.getRange("A3:U3"));
styleBody(examples.getRange(`A4:U${sampleTechRows.length + 3}`));
writeBlock(examples, sampleTechRows.length + 6, 1, [["02_Core_Definition 예시"]]);
examples.getRangeByIndexes(sampleTechRows.length + 5, 0, 1, coreHeaders.length).merge();
styleTitle(examples.getRangeByIndexes(sampleTechRows.length + 5, 0, 1, coreHeaders.length));
writeBlock(examples, sampleTechRows.length + 8, 1, [coreHeaders, ...sampleCoreRows]);
styleHeader(examples.getRangeByIndexes(sampleTechRows.length + 7, 0, 1, coreHeaders.length));
styleBody(examples.getRangeByIndexes(sampleTechRows.length + 8, 0, sampleCoreRows.length, coreHeaders.length));
setWidths(examples, [90, 110, 90, 140, 160, 190, 160, 140, 110, 110, 160, 130, 100, 240, 80, 180, 120, 120, 80, 80, 180]);
examples.freezePanes.freezeRows(3);

const mappingRows = [
  ["HTML 필드", "엑셀 원천", "입력/변환 규칙"],
  ["level1", "01_Tech_Master.level1", "산업군 / 제품군 / 공정군"],
  ["level2", "01_Tech_Master.level2", "Level 1 아래 2단계 분류명"],
  ["level3", "01_Tech_Master.level3", "Core가 Level 3일 수 있는 단위"],
  ["level4", "01_Tech_Master.level4", "한 행당 1개 Level 4 기술"],
  ["대표기술명", "01_Tech_Master.대표기술명", "Level 4 기술명 옆 작은 스티커. 1개만 입력 권장"],
  ["is_core", "02_Core_Definition 존재 여부", "Core_Definition에 Level 3 또는 Level 4로 등록되면 TRUE"],
  ["core_level", "02_Core_Definition.core_level", "Level 3 Core 또는 Level 4 Core"],
  ["카테고리", "02_Core_Definition.growth_category", "시장성장 / 기술성장 / 미래성장. Core에만 입력"],
  ["research_stage", "02_Core_Definition.research_stage 또는 01_Tech_Master.research_stage", "비전기술 / 차세대기술 / 전략기술 / 수익기술 / -"],
  ["research_group/team/owner", "01_Tech_Master 또는 03_Owner_Link", "1개 조직이면 Tech_Master, 2개 이상이면 Owner_Link 사용 권장"],
  ["Level 3 Core 처리", "02_Core_Definition.core_level='Level 3 Core'", "level4는 비워둡니다. 하위 Level 4는 구성기술로 표시합니다."],
  ["Level 4 Core 처리", "02_Core_Definition.core_level='Level 4 Core'", "level4를 반드시 입력합니다. 부모 Level 3는 Core가 아닙니다."],
];
writeBlock(mapping, 1, 1, mappingRows);
styleHeader(mapping.getRange("A1:C1"));
styleBody(mapping.getRange(`A2:C${mappingRows.length}`));
addTable(mapping, `A1:C${mappingRows.length}`, "HtmlMappingTable");
setWidths(mapping, [180, 280, 520]);

writeBlock(qa, 1, 1, [["Core Tech 입력 점검"]]);
qa.getRange("A1:D1").merge();
styleTitle(qa.getRange("A1:D1"));
writeBlock(qa, 3, 1, [
  ["항목", "값", "기준", "확인"],
  ["Level 4 기술 수", null, "01_Tech_Master tech_id 입력 행", "=COUNTA('01_Tech_Master'!A2:A301)"],
  ["Core 총 개수", null, "02_Core_Definition core_id 입력 행", "=COUNTA('02_Core_Definition'!A2:A121)"],
  ["Level 3 Core", null, "core_level = Level 3 Core", "=COUNTIF('02_Core_Definition'!B2:B121,\"Level 3 Core\")"],
  ["Level 4 Core", null, "core_level = Level 4 Core", "=COUNTIF('02_Core_Definition'!B2:B121,\"Level 4 Core\")"],
  ["입력 규칙", null, "Level 3 Core와 같은 Level 3 아래 Level 4 Core를 중복 지정하지 않기", "수동 확인"],
  ["조직 규칙", null, "담당 연구그룹/팀이 2개 이상이면 03_Owner_Link에 행 추가", "수동 확인"],
]);
qa.getRange("A3:D9").format.borders = { preset: "all", style: "thin", color: colors.line };
qa.getRange("A3:D3").format.fill = { color: colors.header };
qa.getRange("A3:D3").format.font = { bold: true, color: colors.navy };
qa.getRange("D4:D7").formulas = [
  ["=COUNTA('01_Tech_Master'!A2:A301)"],
  ["=COUNTA('02_Core_Definition'!A2:A121)"],
  ["=COUNTIF('02_Core_Definition'!B2:B121,\"Level 3 Core\")"],
  ["=COUNTIF('02_Core_Definition'!B2:B121,\"Level 4 Core\")"],
];
styleBody(qa.getRange("A4:D9"));
setWidths(qa, [180, 90, 420, 130]);

addValidation(master, "B2:B301", ["산업군", "제품군", "공정군"]);
addValidation(master, "R2:R301", ["비전기술", "차세대기술", "전략기술", "수익기술", "-"]);
addValidation(master, "T2:T301", ["Y", "N"]);
addValidation(core, "B2:B121", ["Level 3 Core", "Level 4 Core"]);
addValidation(core, "C2:C121", ["산업군", "제품군", "공정군"]);
addValidation(core, "I2:I121", ["시장성장", "기술성장", "미래성장"]);
addValidation(core, "J2:J121", ["비전기술", "차세대기술", "전략기술", "수익기술", "-"]);
addValidation(owners, "B2:B401", ["산업군", "제품군", "공정군"]);
addValidation(owners, "J2:J401", ["Y", "N"]);

master.getRange("B2:B301").conditionalFormats.add("containsText", {
  text: "산업군",
  format: { fill: { color: "#EAF3FF" } },
});
core.getRange("B2:B121").conditionalFormats.add("containsText", {
  text: "Level 3 Core",
  format: { fill: { color: "#EAF3FF" }, font: { bold: true, color: colors.blue } },
});
core.getRange("B2:B121").conditionalFormats.add("containsText", {
  text: "Level 4 Core",
  format: { fill: { color: "#EAF8F8" }, font: { bold: true, color: colors.teal } },
});
core.getRange("I2:I121").conditionalFormats.add("containsText", {
  text: "시장성장",
  format: { fill: { color: "#FFF7ED" }, font: { bold: true, color: "#C2410C" } },
});
core.getRange("I2:I121").conditionalFormats.add("containsText", {
  text: "기술성장",
  format: { fill: { color: "#F5F3FF" }, font: { bold: true, color: "#6D28D9" } },
});
core.getRange("I2:I121").conditionalFormats.add("containsText", {
  text: "미래성장",
  format: { fill: { color: "#FFF1F2" }, font: { bold: true, color: "#BE123C" } },
});

for (const sheet of [master, core, owners, lists, examples, mapping, qa, readme]) {
  const used = sheet.getUsedRange();
  used.format.autofitRows();
}

await fs.mkdir(outputDir, { recursive: true });

const overview = await workbook.inspect({
  kind: "sheet,table",
  maxChars: 4000,
  tableMaxRows: 3,
  tableMaxCols: 6,
});
console.log(overview.ndjson);

const formulaErrors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "formula error scan",
});
console.log(formulaErrors.ndjson);

for (const sheetName of ["00_README", "01_Tech_Master", "02_Core_Definition", "06_HTML_Mapping", "07_QA_Checks"]) {
  await workbook.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
}

const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`saved:${outputPath}`);
