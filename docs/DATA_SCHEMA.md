# Data Schema

이 문서는 `PTRS ↔ Core Tech` HTML이 기대하는 데이터 구조와 엑셀 입력 규칙을 정리합니다.

## HTML JSON 구조

HTML은 아래 JSON 구조를 읽습니다.

```json
{
  "schemaVersion": 1,
  "source": "input file name",
  "updatedAt": "2026-06-11T00:00:00.000Z",
  "rows": [
    {
      "l1": "산업군",
      "l2": "에너지 산업",
      "l3": "수소/극저온 소재",
      "l4": "LNG용 고Mn강 설계",
      "coreLevel": 3,
      "category": "미래성장",
      "group": "후판연구그룹",
      "team": "에너지강재팀",
      "research_stage": "전략기술",
      "rep": "고Mn 합금설계",
      "tags": "극저온, 합금설계",
      "owners": [
        { "group": "후판연구그룹", "team": "에너지강재팀", "owner": "홍길동" }
      ]
    }
  ]
}
```

## 필드 설명

| JSON 필드 | 의미 | 입력 원천 |
|---|---|---|
| `l1` | Level 1 구분 | `01_Tech_Master.level1` |
| `l2` | Level 2 기술군 | `01_Tech_Master.level2` |
| `l3` | Level 3 기술군 | `01_Tech_Master.level3` |
| `l4` | Level 4 세부기술 | `01_Tech_Master.level4` |
| `coreLevel` | `0`, `3`, `4` | `02_Core_Definition.core_level` |
| `category` | 시장성장/기술성장/미래성장 | Core 행의 `growth_category` |
| `group` | 대표 연구그룹 | 첫 번째 owner |
| `team` | 대표 팀 | 첫 번째 owner |
| `research_stage` | 연구단계 구분: 비전/차세대/전략/수익기술 | Core 우선, 없으면 Master |
| `rep` | Level 4 옆 스티커 | `대표기술명` |
| `tags` | Core 태그 또는 기술 태그 | `core_tags` 또는 `핵심기술_태그` |
| `owners` | 복수 연구그룹/팀/담당자 | `03_Owner_Link` 또는 Master owner 컬럼 |

## Excel 입력 규칙

### 01_Tech_Master

Level 4 기술 1개를 1행으로 입력합니다. 약 300개 Level 4 기술을 넣어도 화면에서 필터와 접기로 볼 수 있도록 설계했습니다.

필수 컬럼:

- `tech_id`
- `level1`
- `level2`
- `level3`
- `level4`
- `대표기술명`
- `research_group`
- `team`
- `research_stage`
- `active_yn`

담당 조직이 2~3개 정도면 `research_group_2`, `team_2`, `owner_2` 형식으로 바로 넣을 수 있습니다. 그 이상이거나 관리가 필요하면 `03_Owner_Link`를 사용합니다.

### 02_Core_Definition

Core로 선정한 기술만 입력합니다.

- Level 3 Core: `core_level = Level 3 Core`, `level4`는 비워둡니다.
- Level 4 Core: `core_level = Level 4 Core`, `level4`까지 정확히 입력합니다.
- 같은 Level 3 아래에서 Level 3 Core와 Level 4 Core를 동시에 지정하지 않습니다.
- `growth_category`는 Core 기술에만 입력합니다.
- `research_stage`는 연구단계 구분이며 비전기술 / 차세대기술 / 전략기술 / 수익기술 / `-` 중 하나를 입력합니다.

HTML에서는 Level 3 Core를 표시하기 위해 해당 Level 3의 첫 번째 Level 4 행에 `coreLevel: 3` 마커를 둡니다. 이 마커는 Level 4가 Core라는 뜻이 아니라, 부모 Level 3 전체가 Core라는 뜻입니다.

기존 파일과의 호환을 위해 HTML은 과거 컬럼명 `related_program`과 JSON 필드 `program`도 읽을 수 있지만, 새 템플릿과 내보내기 파일은 `research_stage`를 사용합니다.

### 03_Owner_Link

복수 연구그룹/팀/담당자를 표현할 때 사용합니다.

- `tech_id`로 `01_Tech_Master`와 연결합니다.
- `is_primary = Y`인 행을 대표 조직으로 봅니다.
- HTML에서는 여러 연구그룹을 하나의 pill 안에 `그룹A · 그룹B`처럼 표시합니다.

## 화면 동작 규칙

- `Core만` 필터에서 Level 3 Core는 부모 Level 3만 보여주고 하위 Level 4 전체는 펼치지 않습니다.
- `일반기술만` 필터에서 Level 3 Core의 첫 하위 Level 4는 구조 유지를 위해 표시됩니다. 이는 Level 4 Core가 아니라 Level 3 Core의 구성기술입니다.
- `L4 Core` 필터는 `coreLevel = 4`인 행만 보여줍니다.
- 성장 카테고리 그래프는 Core 기술만 기준으로 계산합니다.
