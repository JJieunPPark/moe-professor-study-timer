# Professor Study Timer

> 교수님이 버추얼 미소녀라면 얼마나 좋을까

**Professor Study Timer**는 교수 캐릭터와 함께 공부하는 인터랙티브 웹 스터디 타이머입니다.

단순히 시간을 측정하는 타이머를 넘어, 공부 중 사용자의 행동에 캐릭터가 반응하고 말을 걸거나 방해하기도 하며, AI Q&A를 통해 실제 교수와 함께 공부하는 듯한 경험을 만드는 것을 목표로 제작했습니다.

**PC 웹 환경에 최적화되어 있습니다.**

---

## Demo

🌐 **Web Demo:** [[Professor Study Timer](VERCEL_URL)](https://moe-professor-study-timer-wine.vercel.app/)

🎬 **PV:** 준비 중

> 권장 환경: PC / Desktop Browser

---

## Professors

### 아카기 시스타무 / 赤城シスタム
**Operating Systems**

운영체제를 담당하는 교수 캐릭터입니다.

### 그라피쿠 이로하 / グラピク・イロハ
**Computer Graphics**

컴퓨터그래픽스를 담당하는 교수 캐릭터입니다.

### 아루고 리즈무 / アルゴ・リズム
**Algorithms**

알고리즘을 담당하는 Live2D 교수 캐릭터입니다.

마우스와 사용자의 입력에 실시간으로 반응하며, 공부하지 않고 가만히 있으면 웹사이트의 UI에 직접 간섭하기도 합니다.

---

## Features

### Study Timer

- 집중 / 휴식 타이머
- 공부 세션 저장
- 오늘 완료한 세션 수 기록
- 오늘 공부 시간 기록
- 전체 누적 공부 시간 기록
- 과목별 교수 선택

### Interactive Professor Characters

교수 캐릭터는 단순한 장식이 아니라 사용자의 공부 행동에 반응합니다.

- 상황별 교수 대사
- 캐릭터 애니메이션
- 교수별 음성
- Q&A 이후 이해 여부에 따른 반응
- 공부 상태 및 화면 전환에 따른 캐릭터 상태 변화

### Live2D Interaction

알고리즘 교수 **아루고 리즈무**는 Live2D로 구현되어 있습니다.

- 마우스 커서 추적
- 캐릭터 영역별 터치 반응
- 터치에 따른 표정 및 음성 변화
- Live2D Parameter Inspector
- 사용자의 입력이 없을 때 발생하는 캐릭터 행동
- Progress UI를 잡고 움직이는 장난
- BREAK 조작 방해
- 장시간 공부를 시작하지 않을 경우 집중 모드 유도

캐릭터가 UI와 분리된 존재가 아니라 웹페이지 안에서 직접 행동하는 것처럼 느껴지도록 구현했습니다.

### AI Q&A

공부 중 이해되지 않는 내용을 선택한 교수에게 질문할 수 있습니다.

- 선택한 교수의 성격을 반영한 AI 답변
- 답변 이후 이해 여부 확인
- 이해 여부에 따른 캐릭터 반응
- 교수 음성 출력
- API 사용량 초과 및 요청 제한 오류 처리

AI API Key는 클라이언트에 포함하지 않고 서버 환경 변수에서 관리합니다.

---

## Tech Stack

### Frontend

- HTML5
- CSS3
- Vanilla JavaScript
- PixiJS
- Live2D Cubism

### Backend

- Node.js
- Express

### AI

- 국민대학교 AI Gateway
- OpenAI-compatible API

AI 요청은 브라우저에서 API Key를 직접 사용하는 방식이 아니라 서버의 `/api/chat` endpoint를 통해 처리됩니다.

### Voice

- VOICEVOX

### Deployment / Development

- Vercel
- Git
- GitHub
- npm

---

## Architecture

```text
Browser
   │
   ├── Study Timer
   ├── Professor UI
   ├── Live2D Interaction
   └── AI Question
            │
            ▼
        /api/chat
            │
            ▼
    Node.js / Express
            │
            ▼
  국민대학교 AI Gateway
            │
            ▼
     Professor Response
```

API Key는 서버의 환경 변수에서만 관리하며 프론트엔드 bundle에는 포함하지 않습니다.

---

## Local Development

### 1. Install

```bash
npm ci
```

### 2. Environment Variables

`.env.example`을 참고하여 `.env` 파일을 생성합니다.

```env
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=
```

실제 API Key는 Git에 커밋하지 않습니다.

### 3. Development Server

```bash
npm run dev
```

기본 개발 서버:

```text
http://localhost:3000
```

### 4. Production Build

```bash
npm run build
```

### 5. Production Preview

```bash
npm run preview
```

기본 preview 주소:

```text
http://localhost:4173
```

---

## Deployment

Vercel을 통해 배포합니다.

Vercel 프로젝트에는 다음 환경 변수를 서버 환경 변수로 등록합니다.

```text
OPENAI_API_KEY
OPENAI_BASE_URL
OPENAI_MODEL
```

현재 production 설정:

```text
Framework Preset : Other
Build Command    : npm run build
Output Directory : dist
Install Command  : npm ci
```

`main` branch에 push하면 Vercel production deployment가 자동으로 실행됩니다.

---

## Credits

### Planning / Programming / Illustration / Live2D

**박지은**

### Voice

Generated with **VOICEVOX**

- VOICEVOX:冥鳴ひまり
- VOICEVOX:春日部つむぎ
- VOICEVOX:暁記ミタマ

### Music

- BGM: **[곡명 / 제작자 입력]**

### AI

- 국민대학교 AI Gateway

### Technology

- Live2D Cubism
- PixiJS
- Node.js
- Express
- Vercel

---

## Notes

- 본 프로젝트는 PC 웹 환경을 기준으로 제작되었습니다.
- 캐릭터와 교수 설정은 본 프로젝트를 위해 제작된 창작 캐릭터입니다.
- 외부 음성, 음악 및 라이브러리는 각 서비스 및 저작권자의 이용 규정을 따릅니다.
