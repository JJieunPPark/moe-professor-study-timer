const MOCK_SERVER_CLOSED_MESSAGE = "아직 교수님 연구실 서버가 열리지 않았습니다. mock 답변을 표시합니다.";
const MOCK_REPLY_DELAY_MIN = 500;
const MOCK_REPLY_DELAY_MAX = 1200;

const mockReplies = {
  graphics: [
    "좋은 질문입니다. 화면을 그리듯이 핵심부터 같이 잡아볼게요.",
    "조금만 더 생각해볼까요? 지금 방향은 나쁘지 않습니다.",
    "맞아요. 그렇게 이해하면 됩니다.",
    "다시 한번 설명해드릴게요. 먼저 보이는 현상부터 정리해봅시다.",
    "좋습니다. 이 부분은 컴퓨터그래픽스에서 중요한 감각이에요."
  ],
  database: [
    "좋은 질문입니다. 관계부터 차근차근 정리해볼게요.",
    "맞아요. 그렇게 이해하면 됩니다.",
    "조금만 더 생각해볼까요? 조건을 하나씩 나누면 보여요.",
    "다시 한번 설명해드릴게요. 핵심은 데이터가 어떻게 연결되는지입니다.",
    "좋습니다. 지금 질문은 아주 실전적인 포인트예요."
  ],
  os: [
    "좋은 질문이야. 중요한 부분부터 딱 잡아줄게.",
    "맞아. 그렇게 이해하면 돼.",
    "조금만 더 생각해볼까? 지금 거의 다 왔어.",
    "다시 한번 설명해줄게. 헷갈려도 괜찮아.",
    "좋아. 이 부분은 운영체제에서 중요한 개념이야."
  ],
  algorithm: [
    "좋은 질문입니다. 일단 브루트 포스로 이해하고, 그다음 예쁘게 줄여봅시다.",
    "맞아요. 그렇게 이해하면 됩니다. 오늘은 컴퓨터에게 조금 덜 미안하겠네요.",
    "조금만 더 생각해볼까요? 조건을 나누면 경로가 보입니다.",
    "다시 한번 설명해드릴게요. 핵심은 어떤 선택을 언제 버릴지입니다.",
    "좋습니다. 지금 질문은 시간복잡도 감각을 키우기 좋아요."
  ]
};

function createMockProfessorAnswer(professor, question) {
  const trimmedQuestion = question.trim();
  return `${MOCK_SERVER_CLOSED_MESSAGE}\n\n${professor.name}: "${trimmedQuestion}"에 대한 임시 답변입니다.`;
}

function waitForMockReplyDelay() {
  const delay = MOCK_REPLY_DELAY_MIN + Math.floor(Math.random() * (MOCK_REPLY_DELAY_MAX - MOCK_REPLY_DELAY_MIN + 1));
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function createDeveloperMockAnswer(professorKey) {
  const replies = mockReplies[professorKey] || mockReplies.database;
  const index = Math.floor(Math.random() * replies.length);
  return replies[index];
}

async function replyProvider({ professorKey, professor, question, studentProfile, questionMode = "general", mockMode = false }) {
  if (mockMode) {
    await waitForMockReplyDelay();
    return createDeveloperMockAnswer(professorKey);
  }

  return requestOpenAiProfessorReply({ professorKey, professor, question, studentProfile, questionMode });
}

async function requestOpenAiProfessorReply({ professorKey, professor, question, studentProfile, questionMode }) {
  const payload = {
    professorKey,
    professorName: professor.name,
    subjectLabel: professor.subjectLabel,
    question
  };

  if (studentProfile) {
    payload.studentProfile = studentProfile;
  }

  if (questionMode) {
    payload.questionMode = questionMode;
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let errorMessage = "";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || "";
      } catch (parseError) {
        errorMessage = "";
      }

      throw new Error(errorMessage || `Chat server returned ${response.status}`);
    }

    const data = await response.json();
    return data.answer || createMockProfessorAnswer(professor, question);
  } catch (error) {
    console.warn("AI chat fallback:", error);
    return createMockProfessorAnswer(professor, question);
  }
}

async function askProfessor(request) {
  return replyProvider(request);
}

// TODO: 실제 OpenAI 프롬프트 구성과 API 호출은 server.js에서 관리합니다.
// API key는 프론트엔드에 저장하지 않고 서버 환경 변수로만 관리합니다.
