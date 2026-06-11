# Data Schema

이 문서는 `Core Technology 2026` HTML이 기대하는 데이터 구조와 한 시트 XLSX 입력 규칙을 정리합니다.

## JSON 구조

```json
{
  "schemaVersion": 3,
  "source": "input file name",
  "updatedAt": "2026-06-11T00:00:00.000Z",
  "orgMaster": {
    "groups": ["수소환원제철", "차세대철강"],
    "teams": ["[C]수소환원", "[8대]고Mn강"]
  },
  "rows": [
    {
      "id": "P-001",
      "l1": "제품",
      "l2": "후판",
      "l3": "LNG용 고Mn강",
      "sticker": "고Mn 합금설계",
      "summary": "극저온 후판의 합금 설계와 인성 확보",
      "isCore": true,
      "growthStage": "신시장/미래",
      "researchStage": "전략기술",
      "tags": "극저온, LNG, 후판",
      "orgs": [
        { "type": "연구그룹", "name": "후판연구그룹", "owner": "홍길동", "role": "주관" }
      ]
    }
  ]
}
```

## Level 정의

Level 4는 더 이상 별도 계층으로 쓰지 않습니다. 기존 Level 4에 가까운 세부기술도 새 구조에서는 `level3` 기술 1건으로 입력합니다.

| Level | 의미 |
|---|---|
| Level 1 | 제품 / 공정 / 솔루션 / AX |
| Level 2 | Level 1별 기술군 |
| Level 3 | 실제 기술 단위. 약 100개 입력 예상 |

## Level 2 표준 목록

| Level 1 | Level 2 |
|---|---|
| 제품 | 열연, 후판, 선재, 냉연, 도금, 전기강판, STS, 자동차 |
| 공정 | 제선, 제강, 열연, 냉연, 도금, 전기강판, STS, 탄소중립, DX, 유틸리티, 환경에너지 |
| 솔루션 | 조선에너지, 가전, 산업기계, 건설, 방산, 제철소, 자동차 |
| AX | A1-Steel Brain, A2 |

## XLSX 입력 규칙

템플릿은 `01_Core_Tech_Data` 시트 1개만 사용합니다.

필수 또는 권장 컬럼:

| 컬럼 | 설명 |
|---|---|
| `tech_id` | 기술 고유 ID |
| `level1` | 제품 / 공정 / 솔루션 / AX |
| `level2` | Level 2 표준 목록 중 하나 |
| `level3` | 기술명 |
| `기술요약` | 상세 팝오버에 표시할 한 줄 설명 |
| `핵심기술_태그` | 검색/분류용 기술 태그. 쉼표로 여러 개 입력 |
| `is_core` | TRUE/FALSE |
| `growth_stage` | 기술진화 / 기술성숙 / 신시장/미래 / 빈칸 |
| `research_stage` | 비전기술 / 차세대기술 / 전략기술 / 수익기술 / 빈칸 |
| `sort_order` | 표시 순서 |
| `active_yn` | Y/N. N이면 변환기에서 제외 |
| `org_1_type` ~ `org_5_type` | 연구그룹 / 팀 / TF팀 / PJ팀 등 |
| `org_1_name` ~ `org_5_name` | 수행 조직명 |
| `org_1_owner` ~ `org_5_owner` | 담당자 |
| `org_1_role` ~ `org_5_role` | 주관 / 협업 / 담당 등 |

조직명은 기본 목록에 없어도 입력할 수 있습니다. HTML은 업로드된 조직명을 보존하고 필터에도 표시합니다.
자주 사용하는 신규 조직은 HTML의 `조직 목록 편집`에서 연구그룹 또는 Team 목록에 추가합니다.
JSON 내보내기는 `orgMaster`를 함께 저장하므로 다른 사람이 불러와도 같은 기준 목록을 유지할 수 있습니다.

## 통계 처리

- Core 총계는 `is_core = TRUE`인 기술 수입니다.
- 성장 단계 그래프는 Core 기술만 기준으로 계산합니다.
- 성장 단계와 연구단계가 비어 있으면 `미지정`으로 처리합니다.
- 조직별 분포는 `orgMaster.groups`, `orgMaster.teams`, `org_*_type` 기준으로 연구그룹과 Team을 나누어 계산합니다.
- 담당자 수는 `조직명 + 담당자` 조합의 고유 개수로 계산합니다.
- 하나의 기술에 여러 조직이 연결되면 각 조직의 기술 분포에 모두 반영됩니다.

## 호환성

HTML은 이전 JSON 필드 일부도 읽을 수 있습니다.

- `coreLevel > 0` → `isCore = true`
- `category` → `growthStage`
- `program` 또는 `research_stage` → `researchStage`
- `owners` → `orgs`
