# HANDOFF

## Current State

현재 대표 HTML은 프로젝트 루트의 아래 파일입니다.

`PTRS_Core_Tech_Map.html`

이 브랜치(`simple`)의 화면은 Level 1 → Level 2 → 기술(Level 3) 구조로 재정리되어 있습니다. Level 4는 별도 계층으로 쓰지 않고, 세부 기술도 Level 3 기술 1건으로 입력합니다.

## Data Loading Priority

HTML 데이터 로딩 우선순위는 다음과 같습니다.

1. 브라우저 localStorage에 저장된 업로드/편집 데이터
2. 같은 폴더 기준 `data/core-tech-data.json`
3. HTML 내부 `FALLBACK_ROWS` 데모 데이터

HTML 파일 하나만 전달해도 데모 화면은 열립니다. 사용자가 `XLSX 가져오기` 또는 `JSON 가져오기`를 사용하면 업로드 데이터가 우선 적용됩니다.

현재 JSON schema는 `schemaVersion: 3`입니다. `rows`에는 기술 데이터가 들어가고, `orgMaster`에는 필터 기준으로 쓰는 연구그룹/Team 목록이 들어갑니다. JSON 내보내기는 `rows`와 `orgMaster`를 함께 저장하므로 다른 사람이 불러와도 같은 조직 기준 목록을 유지할 수 있습니다.

## XLSX Template

템플릿 파일:

`outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx`

새 템플릿은 `01_Core_Tech_Data` 시트 1개만 사용합니다.

- 1행 = 기술(Level 3) 1개
- Core 여부, 성장 단계, 연구단계, 조직/담당자까지 같은 행에 입력
- 조직은 `org_1_type/name/owner/role`부터 `org_5_*`까지 입력
- 조직은 계층이 아니라 독립 수행 조직입니다. 연구그룹, 팀, TF팀, PJ팀 모두 같은 수준의 조직으로 처리합니다.
- 조직명은 템플릿의 고정 선택지가 아니며, 목록에 없는 새 조직명도 직접 입력할 수 있습니다.

## Organization Master List

HTML에는 기본 연구그룹 14개와 Team 18개가 내장되어 있습니다.

- 연구그룹: 수소환원제철, 차세대철강, 제선, 제강, 엔지니어링, 로봇AI, 열연선재후판, 냉연도금, STS연구, 자동차소재, 표면, 자동차소재솔루션, 강재솔루션, 강건재솔루션
- Team: `[C]용선온도하락방지`, `[C]Inocast`, `[C]수소환원`, `[C]ESF연구`, `[C]미래연원료`, `[8대]에너지용후판`, `[8대]고Mn강`, `[C]K방산제품`, `[8대]신재생에너지PosMAC`, `[C]신도금`, `[8대]HyperNO`, `[8대]전력용전기강판`, `[C]원자력재료`, `[8대]차세대성장시장용STS`, `[8대]GigaSteel`, `[8대]전기로고급강`, `[C]강구조아파트`, `[C]제품AX`

필터 패널의 `조직 목록 편집` 버튼으로 연구그룹/Team 목록을 한 줄에 하나씩 수정할 수 있습니다. 저장된 목록은 브라우저 localStorage에 보관되고, JSON 내보내기에는 `orgMaster`로 포함됩니다. 데이터 안에 목록 밖 조직이 들어오면 HTML은 값을 보존하고 필터에도 표시합니다. 자주 쓰는 신규 조직은 `조직 목록 편집`에서 기준 목록에 추가하면 됩니다.

## UI Behavior

- 기술 관점: Level 1 → Level 2 → 기술(Level 3) 트리
- 조직 관점: 조직별 담당 기술, Core 기술, 담당자 수
- 필터는 중복 선택 방식입니다. Level 1, 성장 단계, 연구단계, 연구그룹, 팀명, 태그를 여러 개 동시에 선택할 수 있습니다.
- 필터 패널을 접어도 `기술 / 조직` 관점 전환은 남습니다.
- 상세 팝오버: 기술을 클릭한 위치 옆에 열리고, 기술명/성장 단계/연구단계/태그/요약/조직/담당자 정보를 바로 수정할 수 있습니다.
- 상세 팝오버의 `삭제`는 기술 1건을 삭제하고, 토스트 `되돌리기`로 복구할 수 있습니다.
- `구조 편집` 모드:
  - `기술 추가`로 새 Core 기술 카드를 추가합니다.
  - 기술 카드 핸들을 다른 Level 2 영역에 드롭하면 해당 기술의 `l1`, `l2`가 갱신됩니다.
  - Level 2 블록 핸들을 다른 Level 1 영역에 드롭하면 그 안의 모든 기술이 새 Level 1로 이동합니다.
  - 같은 Level 2명이 이미 있으면 별도 병합 UI 없이 같은 그룹으로 합쳐져 렌더링됩니다.
  - 이동과 추가/삭제는 localStorage에 저장되고, JSON/XLSX 내보내기에 반영됩니다.
- Core Tech 통계:
  - Level 1 도넛 분포
  - Level 2 막대 분포
  - 성장 단계
  - 연구단계 구분
  - Level 1 × 성장 단계
  - 조직별 Core 분포

## Important Files

- HTML: `PTRS_Core_Tech_Map.html`
- Current JSON data: `data/core-tech-data.json`
- Excel template: `outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx`
- Excel template builder: `scripts/build-core-tech-template.mjs`
- Batch converter: `scripts/convert_excel_to_core_data.py`
- Schema docs: `docs/DATA_SCHEMA.md`

## Verification Commands

```sh
/Users/seulgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node -e "const fs=require('fs'); const html=fs.readFileSync('PTRS_Core_Tech_Map.html','utf8'); const m=html.match(/<script>([\\s\\S]*)<\\/script>/); new Function(m[1]); console.log('script ok');"
```

```sh
/Users/seulgi/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/convert_excel_to_core_data.py outputs/core-tech-tree-template/PTRS_Core_Tech_Data_Template.xlsx --output /private/tmp/core-tech-test.json
```

브라우저 검증은 Playwright로 `조직 목록 편집` 팝오버를 열고 신규 연구그룹/Team을 저장한 뒤 필터 반영을 확인했습니다. macOS 권한 때문에 headless Chromium 실행에는 sandbox escalation이 필요할 수 있습니다.

최근 UI 검증은 상세 팝오버의 수정/삭제, 구조 편집 모드의 기술 추가, 기술 카드 이동, Level 2 블록 이동, 필터 접힘 상태의 관점 전환 유지까지 확인하는 방식으로 이어가면 됩니다.

## Design Notes

- 화면은 밝고 단순한 POSCO 계열 톤을 유지합니다.
- Level과 Core는 색상 의미를 분리합니다.
- 성장 단계 색상은 기술 의미 기준입니다.
  - 기술진화: orange
  - 기술성숙: teal
  - 신시장/미래: rose
- 화면 복잡도를 줄이기 위해 엑셀 템플릿도 한 시트 구조를 기본으로 유지합니다.
- 기술체계맵은 Core 기술 중심입니다. 일반 기술은 데이터에는 남길 수 있지만, 주요 트리와 통계는 Core 기준으로 해석합니다.
- 조직 관점은 연구그룹/팀명과 기술명의 타이포 위계를 분리합니다. 조직명은 더 선명하게, 하위 기술명과 pill은 한 단계 낮은 굵기로 유지합니다.
