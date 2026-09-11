# Professor Study Timer

교수 캐릭터들이 공부를 감시하고 응원해주는 뽀모도로 기반 개인용 공부 웹앱 MVP입니다.
HTML, CSS, JavaScript 기반 프론트엔드와 `/api/chat`을 제공하는 Node.js 서버로 실행할 수 있습니다.

## 주요 기능

- 데스크톱 기준 좌측 교수 캐릭터, 우측 타이머 UI의 2단 레이아웃
- LLM 질문 입력창 UI
- 25분 집중, 5분 휴식, 15분 긴 휴식 타이머
- 데이터베이스, 운영체제, 컴퓨터그래픽스, 알고리즘 과목 선택
- 과목별 창작 교수 캐릭터 카드와 상황별 대사
- 오늘 세션 수, 오늘 공부 시간, 전체 누적 공부 시간 저장
- 전체 누적 20시간 이상 공부 시 Royal Mode 해금

## 실행 방법

```bash
npm install
```

`.env.example`을 참고해 `.env` 파일을 만들고 `OPENAI_API_KEY`를 입력합니다.

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속합니다.

## 파일 구조

```text
project/
├── index.html
├── package.json
├── server.js
├── .env.example
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── ai.js
│   ├── timer.js
│   ├── storage.js
│   └── professors.js
└── README.md
```

## AI 연결 구조

- 하단 질문 입력창은 `/api/chat` 서버로 POST 요청을 보냅니다.
- 서버는 OpenAI Responses API를 사용해 교수 캐릭터 답변을 생성합니다.
- 서버가 없거나 연결에 실패하면 프론트엔드 mock 답변을 말풍선에 표시합니다.
- 프론트엔드에는 API KEY를 절대 작성하지 않습니다.
- API KEY는 서버의 `.env` 파일에 있는 `OPENAI_API_KEY`에서만 읽습니다.

## 향후 추가할 기능

- AI 교수 챗봇 서버 연결
- BGM 기능
- 교수 호감도 시스템
- 과목별 공부 통계
- 공부 완료 컷인
- 시험 D-Day 기능
- 모바일 최적화
- Royal 이후 추가 해금 요소
