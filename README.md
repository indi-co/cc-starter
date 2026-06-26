# cc-starter

Claude Code 초기 셋업 템플릿. 클론해서 바로 쓰는 1인/소규모 사업자용 작업 환경.

## 포함된 것

| 종류 | 이름 | 용도 |
|---|---|---|
| 온보딩 커맨드 | `/init-persona` | 인터뷰 + 내 데이터로 **PERSONA.md**(판단·반응 패턴) 생성 |
| 온보딩 스킬 | `persona-builder` | `/init-persona`의 4단계 워크플로우 |
| 템플릿 | `business-ssot-template.md` | 사업 SSOT(서비스·가격·규칙) 한 장 골격 |
| 메타 스킬 | `skill-creator` | 나만의 스킬 만들기 |
| 메타 스킬 | `slash-command-creator` | 슬래시 커맨드 만들기 |
| 메타 스킬 | `subagent-creator` | 서브에이전트 만들기 |
| 메타 스킬 | `hook-creator` | 훅 설정하기 |
| 범용 스킬 | `spa-reader` | JS 렌더링 웹페이지 읽기 |
| 규칙 | `git-workflow` | 커밋/PR 규칙 |
| 규칙 | `security` | 시크릿 관리 기본 원칙 |

---

## 셋업 — 상황에 맞게 하나 고르기

> 공통 전제: **GitHub 개인 계정** + **빈 private repo 1개** 미리 생성. (고객 실명·통화 데이터가 들어가므로 반드시 **private**.) Node ≥ 20.

### 경우 ① — 새로 시작 (기존 작업 폴더 없음)

```bash
git clone https://github.com/indi-co/cc-starter.git [내-작업폴더명]
cd [내-작업폴더명]
git remote set-url origin https://github.com/<내계정>/<내-private-repo>.git   # ⭐ cc-starter와 분리
```

### 경우 ② — 이미 작업 폴더가 있다 (예: `INDICO-WORK`)

기존 폴더를 **버리지 말고**, cc-starter의 도구(`.claude/`)만 위에 입힌다. 폴더 구조가 이미 비슷하면 그대로 두면 된다.

```bash
# 1) cc-starter를 임시로 받아서
git clone https://github.com/indi-co/cc-starter.git /tmp/cc-starter

# 2) 도구만 기존 폴더로 복사 (.claude, templates)
cp -r /tmp/cc-starter/.claude   ~/INDICO-WORK/
cp -r /tmp/cc-starter/templates ~/INDICO-WORK/
cp /tmp/cc-starter/CLAUDE.md    ~/INDICO-WORK/CLAUDE.starter.md   # 기존 CLAUDE.md와 병합용

# 3) 기존 폴더를 git으로 + 내 private repo 연결
cd ~/INDICO-WORK
git init
git remote add origin https://github.com/<내계정>/<내-private-repo>.git
```
> 3)의 git 설정과 `CLAUDE.starter.md` 병합은 **`claude` 실행 후 Claude에게 시켜도 된다** ("이 두 CLAUDE.md 합쳐줘", "커밋하고 내 repo에 올려줘").

복사 후 권장 구조 (`INDICO-WORK` 예시 — 기존 한글 폴더 그대로 OK):

```
INDICO-WORK/
├── .claude/              ← cc-starter에서 복사 (스킬·커맨드·규칙)   [NEW]
├── CLAUDE.md             ← 기존 + 템플릿 병합                       [수정]
├── templates/            ← cc-starter에서 복사                     [NEW]
├── BUSINESS.md           ← /init-persona 후 템플릿으로 채움         [NEW]
├── PERSONA.md            ← /init-persona가 생성·자동연결            [NEW]
├── _공통/                ← 기존 그대로 (공통 자료)
└── 고객사/
    └── 텔타/
        ├── _context/     ← 텔타_규약.md = 이 고객의 SSOT
        ├── 기획안/
        ├── 데이터/
        └── 사전미팅/
```

---

## 셋업 이후 (①·② 공통)

### 1. Claude Code 실행
```bash
claude
```

### 2. 연동 도구 설치 (필요한 것만 — Claude에게 시키면 됨)

**PLAUD (통화 녹취 — 페르소나 핵심) = CLI**
```bash
npm i -g @plaud-ai/cli && plaud login
```

**Notion · Slack = MCP** (대화 중 읽고/쓰기 → MCP가 적합. 개인 토큰(PAT) 기반 권장 — 데이터 통제·권한 범위를 내가 쥔다)

> ⚠️ **토큰을 repo에 커밋하지 말 것.** 아래 `claude mcp add`는 기본 `local` 스코프(내 PC 설정에만 저장, repo 미포함)로 들어간다. 프로젝트 공유용 `.mcp.json`을 쓸 땐 토큰을 직접 넣지 말고 환경변수 참조만.

**Notion**
1. <https://www.notion.so/my-integrations> 에서 internal integration 생성 → 토큰(`ntn_...`) 복사
2. 봇이 읽을 페이지/DB를 그 integration에 **공유**(Connections 추가)
3. 등록:
```bash
claude mcp add notion -e NOTION_TOKEN=ntn_xxx -- npx -y @notionhq/notion-mcp-server
```

**Slack**
1. <https://api.slack.com/apps> 에서 앱 생성 → Bot Token Scopes 부여(`channels:read`, `channels:history`, `chat:write` 등) → 워크스페이스에 Install → Bot 토큰(`xoxb-...`) + Team ID(`T...`) 확보
2. 등록:
```bash
claude mcp add slack -e SLACK_BOT_TOKEN=xoxb-xxx -e SLACK_TEAM_ID=Txxx -- npx -y @modelcontextprotocol/server-slack
```

> 패키지명·환경변수명은 각 MCP 서버 README에서 최신 버전 확인. 등록 후 Claude Code에서 **`/mcp`**로 연결 상태 확인.
> (claude.ai OAuth 커넥터로도 붙일 수 있지만, 사업·고객 데이터는 토큰을 내가 쥐는 PAT 방식을 권장.)

> 페르소나 생성에 최소로 필요한 건 **PLAUD (+선택 Notion)**. Slack·gws는 이후 업무 자동화용.

### 3. 페르소나 생성
```
/init-persona
```
인터뷰에 충실히 답하면 통화·문서·세션·노션을 분석해 `PERSONA.md`를 만들고 **CLAUDE.md에 자동 연결**(매 세션 적용). 통화 원본(PII)은 repo 밖 임시폴더에만 저장하고, PERSONA.md엔 익명화한다.

### 4. (권장) 사업 SSOT 채우기
`templates/business-ssot-template.md`를 복사해 `BUSINESS.md`로 채운다. 서비스·가격·규칙의 단일 정본. 고객별 SSOT는 `고객사/{고객}/_context/{고객}_규약.md`로.

### 5. 커밋·푸시
Claude에게 "커밋하고 내 repo에 올려줘" — 메시지는 Claude가 생성. git을 몰라도 됨.

## spa-reader 초기 설정 (최초 1회, 필요 시)
```bash
cd .claude/skills/spa-reader/scripts
npm install playwright
npx playwright install chromium
```
