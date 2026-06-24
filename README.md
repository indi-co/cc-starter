# cc-starter

Claude Code 초기 셋업 템플릿.

## 포함된 것

| 종류 | 이름 | 용도 |
|---|---|---|
| 메타 스킬 | `skill-creator` | 나만의 스킬 만들기 |
| 메타 스킬 | `slash-command-creator` | 슬래시 커맨드 만들기 |
| 메타 스킬 | `subagent-creator` | 서브에이전트 만들기 |
| 메타 스킬 | `hook-creator` | 훅 설정하기 |
| 범용 스킬 | `spa-reader` | JS 렌더링 웹페이지 읽기 |
| 규칙 | `git-workflow` | 커밋/PR 규칙 |
| 규칙 | `security` | 시크릿 관리 기본 원칙 |

## 설치

```bash
git clone https://github.com/[owner]/cc-starter.git [내 프로젝트명]
cd [내 프로젝트명]
```

기존 파일이 있다면 이 폴더 안으로 이동:
```bash
mv ~/기존경로/폴더명 ./
```

## 시작하는 법

1. `CLAUDE.md` 열어서 프로젝트 정보 채우기
2. Claude Code에서 이 폴더 열기
3. `/skill-creator` 로 첫 번째 스킬 만들기

## spa-reader 초기 설정 (최초 1회)

```bash
cd .claude/skills/spa-reader/scripts
npm install playwright
npx playwright install chromium
```
