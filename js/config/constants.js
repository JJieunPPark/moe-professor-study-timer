const SCREEN_HOME = "home";
const SCREEN_QUESTION = "question";
const SCREEN_FOCUS = "focus";
const SCREEN_RECORD = "record";
const MAIN_MODES = {
  lobby: "lobby",
  question: "question"
};

const PROFESSOR_EXPRESSION_IDLE = "idle";
const PROFESSOR_EXPRESSION_SMILE = "smile";
const PROFESSOR_EXPRESSION_TROUBLED = "troubled";

const QUESTION_MODES = [
  { key: "concept", label: "개념을 모르겠어요" },
  { key: "problem", label: "문제를 못 풀겠어요" },
  { key: "code", label: "코드가 이해되지 않아요" },
  { key: "general", label: "그냥 질문할게요" }
];

window.ProfessorStudyConstants = {
  SCREEN_HOME,
  SCREEN_QUESTION,
  SCREEN_FOCUS,
  SCREEN_RECORD,
  MAIN_MODES,
  PROFESSOR_EXPRESSION_IDLE,
  PROFESSOR_EXPRESSION_SMILE,
  PROFESSOR_EXPRESSION_TROUBLED,
  QUESTION_MODES
};
