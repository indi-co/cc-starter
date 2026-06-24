---
name: spa-reader
description: JavaScript 렌더링이 필요한 SPA(Single Page Application) 웹페이지의 콘텐츠를 읽는 스킬. WebFetch가 빈 페이지를 반환하거나 "JavaScript is not available" 에러가 나올 때 사용. X(Twitter), React/Vue/Angular SPA, 동적 렌더링 페이지 등에서 콘텐츠를 추출할 때 트리거.
---

# SPA Reader

Playwright 헤드리스 브라우저로 SPA 페이지를 렌더링하고 콘텐츠를 마크다운으로 추출한다.

## Setup (최초 1회)

Playwright와 Chromium이 설치되어 있지 않으면 먼저 설치:

```bash
cd .claude/skills/spa-reader/scripts && npm install playwright && npx playwright install chromium
```

## Usage

```bash
node .claude/skills/spa-reader/scripts/fetch_spa.js <url> [options]
```

### Options

| Flag | Default | Description |
|------|---------|-------------|
| `--wait=<ms>` | 3000 | JS 렌더링 대기 시간 |
| `--selector=<css>` | body | 이 셀렉터가 나타날 때까지 대기 |
| `--scroll` | off | 스크롤하여 lazy-load 콘텐츠 로드 |
| `--screenshot=<path>` | off | 디버깅용 스크린샷 저장 |

### Site-specific tips

- **X(Twitter)**: `--wait=5000 --selector="article"` — 트윗 article 요소 대기
- **Lazy-load 사이트**: `--scroll` 추가
- **로그인 필요 사이트**: 지원 안 됨. 스크린샷 공유 안내

### Example

```bash
node .claude/skills/spa-reader/scripts/fetch_spa.js "https://x.com/noahzweben/status/123" --wait=5000 --selector="article"
```

## Output

stdout로 마크다운 형식 텍스트 출력. Bash tool 결과로 바로 읽을 수 있음.
