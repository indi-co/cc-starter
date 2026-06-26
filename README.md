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

## 셋업 순서

### 1. 클론
```bash
git clone https://github.com/indi-co/cc-starter.git [내-작업폴더명]
cd [내-작업폴더명]
```
> 이미 작업 중인 폴더가 있으면, 그 안의 파일을 이 폴더로 옮겨온다(구조는 아래 CLAUDE.md 컨벤션 참고). VS Code는 `Cmd/Ctrl+Shift+P → Git: Clone`으로도 클론 가능.

### 2. Claude Code 실행
```bash
claude
```

### 3. 연동 도구 설치 (필요한 것만)
페르소나/지식 생성에 쓸 소스 도구. Claude에게 설치를 도와달라고 하면 된다.
- **PLAUD CLI** (통화 녹취 — 페르소나 핵심 소스): `npm i -g @plaud-ai/cli` → `plaud login`
- **Notion MCP** (문서/CRM): 개인 토큰 기반 연결
- **Slack MCP** (대화 맥락): 워크스페이스 연결
- **gws CLI** (Google Workspace): 시트·드라이브 접근

> 페르소나 생성에 **최소로 필요한 건 PLAUD + (선택)Notion**. 나머지는 이후 업무 자동화용.

### 4. 페르소나 생성
```
/init-persona
```
인터뷰 질문에 충실히 답하면, 내 통화·문서·세션·노션을 분석해 `PERSONA.md`를 만들고 **CLAUDE.md에 자동 연결**한다(매 세션 적용).

### 5. (권장) 사업 SSOT 채우기
`templates/business-ssot-template.md`를 복사해 `BUSINESS.md`로 채운다. 서비스·가격·규칙의 단일 정본.

## spa-reader 초기 설정 (최초 1회, 필요 시)
```bash
cd .claude/skills/spa-reader/scripts
npm install playwright
npx playwright install chromium
```
