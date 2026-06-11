# PTRS Core Tech Map

`Core Technology 2026`은 Level 1 → Level 2 → 기술(Level 3) 구조에서 Core 기술, 성장 단계, 연구단계, 수행 조직과 담당자를 한 화면에서 보는 단일 HTML 대시보드입니다.

## 바로 쓰는 방법

1. `PTRS_Core_Tech_Map.html`을 브라우저에서 엽니다.
   - 배포 없이 `file:///.../PTRS_Core_Tech_Map.html`로 열어도 기본 기능을 사용할 수 있습니다.
   - 서버로 열면 `data/core-tech-data.json`도 자동 fallback 데이터로 읽습니다.
2. `데이터` 영역에서 파일을 올립니다.
   - `XLSX 가져오기`: 한 시트 템플릿을 채운 뒤 즉시 화면에 반영합니다.
   - `XLSX 내보내기`: 현재 화면 데이터를 같은 한 시트 템플릿으로 저장합니다.
   - `JSON 가져오기/내보내기`: HTML용 JSON 데이터를 저장하거나 다시 불러옵니다.
3. 기술 항목을 클릭하면 클릭 위치 옆에 상세 팝오버가 열립니다.
   - Core 여부, 성장 단계, 연구단계, 태그, 요약, 수행 조직과 담당자를 확인합니다.
   - 팝오버에서 기술명, 성장 단계, 연구단계, 태그, 요약, 수행 조직과 담당자를 바로 수정할 수 있습니다.
   - `JSON` 옆의 `삭제`로 기술 카드를 삭제할 수 있고, 삭제 후 토스트에서 되돌릴 수 있습니다.
4. `구조 편집`을 켜면 기술 구조를 바꿀 수 있습니다.
   - `기술 추가`: 현재 필터/데이터 기준 안에 새 Core 기술 카드를 추가합니다.
   - 기술 카드 드래그: 작은 핸들을 잡아 다른 Level 2로 이동합니다.
   - Level 2 블록 드래그: Level 2 전체를 다른 Level 1로 이동합니다. 같은 Level 2명이 있으면 자연스럽게 합쳐집니다.
   - 이동 후 토스트에서 되돌릴 수 있습니다.
5. `조직 목록 편집`에서 연구그룹과 Team 기준 목록을 수정합니다.
   - 목록에 없는 조직명도 XLSX 업로드나 상세 편집에서 그대로 사용할 수 있습니다.
   - 자주 쓰는 신규 조직은 목록에 추가하면 필터에 항상 표시됩니다.
6. 업로드하거나 편집한 데이터는 브라우저 localStorage에 우선 저장됩니다.
   - 같은 브라우저에서 다시 열면 마지막 데이터가 먼저 보입니다.
   - 다른 사람에게 전달하려면 `JSON 내보내기`를 눌러 데이터와 조직 목록을 함께 저장합니다.
   - `XLSX 내보내기`는 한 시트 데이터 교환용이며, 조직 목록 자체는 JSON에 포함됩니다.

## 데이터 템플릿

입력 템플릿:

`outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx`

템플릿은 `01_Core_Tech_Data` 시트 1개만 사용합니다.

- 1행 = 기술(Level 3) 1개
- `level1`: 제품 / 공정 / 솔루션 / AX
- `level2`: Level 1별 하위 분류
- `level3`: 실제 기술명
- `핵심기술_태그`: 기술별 태그. 쉼표로 여러 개 입력
- `is_core`: TRUE/FALSE
- `growth_stage`: 기술진화 / 기술성숙 / 신시장/미래 / 빈칸
- `research_stage`: 비전기술 / 차세대기술 / 전략기술 / 수익기술 / 빈칸
- `org_1_type`, `org_1_name`, `org_1_owner`, `org_1_role`부터 `org_5_*`까지 복수 조직과 담당자를 입력

조직은 연구그룹 아래 팀이 있는 계층이 아니라, 연구그룹/팀/TF팀/PJ팀 모두 독립 수행 조직으로 입력합니다.
조직명은 기본 목록에 없어도 직접 입력할 수 있습니다. HTML의 `조직 목록 편집`에서 기준 목록으로 추가하면 이후 필터에 항상 표시됩니다.

## 배치 변환

브라우저 버튼 대신 XLSX를 JSON으로 미리 변환할 때 사용합니다.

```sh
/Users/seulgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/convert_excel_to_core_data.py outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx
```

기본 출력 위치:

`data/core-tech-data.json`

## 화면 구성

- 기술 관점: Level 1 → Level 2 → 기술(Level 3) 트리
- 조직 관점: 연구그룹/팀별 담당 Core 기술과 담당자 수
- 필터: 관점, Level 1, 성장 단계, 연구단계, 연구그룹, 팀명, 태그를 중복 선택할 수 있습니다.
- 접힌 필터: 필터를 접어도 `기술 / 조직` 관점 전환은 유지됩니다.
- Core Tech 통계: Level 1 도넛, Level 2 막대 분포, 성장 단계, 연구단계, Level 1 × 성장 단계, 조직별 Core 분포

성장 단계와 연구단계는 비워둘 수 있으며, HTML에서는 `미지정`으로 처리합니다.
