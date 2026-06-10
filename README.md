# PTRS Core Tech Map

`PTRS ↔ Core Tech`는 Level 1~4 기술 체계 안에서 Core 기술의 위치, 성장 카테고리, 담당 연구그룹을 한 화면에서 확인하는 HTML 데모입니다.

## 바로 쓰는 방법

1. HTML을 브라우저에서 엽니다.
   - 최종 전달 파일: `PTRS_Core_Tech_Map.html`
   - localhost 서버가 있으면 `http://localhost:59733/`에서 확인할 수 있습니다.
   - 배포하지 않고 HTML 파일만 전달해도 사용할 수 있습니다.
2. 화면 왼쪽 `데이터` 영역에서 파일을 올립니다.
   - `XLSX 가져오기`: 제공 템플릿을 채운 뒤 바로 화면에 반영합니다.
   - `JSON 가져오기`: 변환된 `core-tech-data.json`을 바로 화면에 반영합니다.
   - `XLSX 내보내기`: 현재 화면 데이터를 다시 입력 템플릿 형태로 내려받습니다.
   - `JSON 내보내기`: 현재 화면 데이터를 HTML용 JSON으로 내려받습니다.
3. 트리에서 Level 3 또는 Level 4 기술을 클릭하면 클릭한 항목 옆의 `상세` 팝오버에서 보기 전용 정보가 표시되고, 왼쪽 `트리 편집`에서 바로 수정할 수 있습니다.
   - 상세 팝오버: 기술 경로, Core 범위, 성장 카테고리, 연구단계 구분, 기술 스티커, 관련 조직
   - Level 3: Level 3명, Level 3 Core 지정/해제, 성장 카테고리, 연구단계 구분
   - Level 4: Level 4명, Level 4 Core 지정/해제, 성장 카테고리, 연구단계 구분, 기술 스티커, 연구그룹/팀/담당자
   - 수정 후 `JSON 내보내기` 또는 `XLSX 내보내기`로 결과를 저장합니다.
4. 업로드하거나 편집한 데이터는 브라우저 저장소에 우선 저장됩니다.
   - 같은 브라우저에서 다시 열면 마지막 업로드 데이터가 먼저 보입니다.
   - 저장 데이터가 없고 `data/core-tech-data.json`이 접근 가능하면 외부 JSON을 읽습니다.
   - 둘 다 없으면 HTML 내부 데모 데이터가 fallback으로 표시됩니다.

## 엑셀 템플릿

입력 템플릿:

`outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx`

주요 시트:

- `01_Tech_Master`: Level 4 기준 전체 기술 목록입니다. 1행은 Level 4 기술 1개입니다.
- `02_Core_Definition`: Core로 선정한 Level 3 또는 Level 4만 입력합니다.
- `03_Owner_Link`: 담당 연구그룹/팀/담당자가 2개 이상일 때 사용합니다.
- `04_Codebook_Lists`: 입력값 표준 목록입니다.
- `05_Examples`: 샘플 입력입니다.
- `06_HTML_Mapping`: HTML 화면 필드와 엑셀 컬럼의 매핑입니다.
- `07_QA_Checks`: 입력 전 확인할 규칙입니다.

## 배치 변환

브라우저 버튼 대신 파일을 JSON으로 미리 변환할 때 사용합니다.

```sh
/Users/seulgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/convert_excel_to_core_data.py outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx
```

기본 출력 위치:

`data/core-tech-data.json`

## Core 지정 규칙

- Level 3가 Core이면 같은 Level 3 하위의 Level 4는 Core로 중복 지정하지 않습니다.
- Level 4가 Core이면 부모 Level 3는 Core로 지정하지 않습니다.
- HTML의 트리 편집도 위 규칙을 자동 적용합니다.
- 성장 카테고리(`시장성장`, `기술성장`, `미래성장`)는 Core 기술에만 입력합니다.
- 대표기술명은 Level 4 기술명 옆의 작은 스티커로 표시되므로 1개만 짧게 입력하는 것을 권장합니다.
