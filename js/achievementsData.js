const ACHIEVEMENT_CATEGORIES = [
  { key: "all", label: "전체" },
  { key: "common", label: "공통" },
  { key: "database", label: "데이터베이스" },
  { key: "os", label: "운영체제" },
  { key: "graphics", label: "컴퓨터그래픽스" },
  { key: "algorithm", label: "알고리즘" }
];

const ACHIEVEMENT_TYPE_FILTERS = [
  { key: "all", label: "전체" },
  { key: "question", label: "질문" },
  { key: "session", label: "세션" },
  { key: "other", label: "기타" }
];

const SUBJECT_ACHIEVEMENT_CONFIG = {
  database: {
    label: "데이터베이스",
    questionTitles: ["첫 JOIN", "관계 맺기", "테이블 정복", "질의 선수", "쿼리 에이스", "DB 챔피언"],
    sessionTitles: ["첫 훈련", "5회 완주", "데이터 체력 상승", "꾸준한 출석", "DB 마라토너", "데이터베이스 철인"]
  },
  os: {
    label: "운영체제",
    questionTitles: ["첫 호출", "Context Switch", "스케줄링 중", "시스템 콜 중독", "커널 친화적 인간", "운영체제와 동기화 완료"],
    sessionTitles: ["첫 프로세스", "Ready Queue 단골", "CPU 점유 중", "장기 스케줄러 승인", "커널 거주자", "Deadlock조차 갈라놓을 수 없음"]
  },
  graphics: {
    label: "컴퓨터그래픽스",
    questionTitles: ["첫 렌더", "셰이더 입문", "렌더링 수강생", "그래픽스 연구생", "실시간 렌더러", "그래픽스 마스터"],
    sessionTitles: ["첫 프레임", "연속 렌더링", "프레임 안정화", "장시간 렌더링", "렌더 파이프라인 상주", "프레임을 지배하는 자"]
  },
  algorithm: {
    label: "알고리즘",
    questionTitles: ["첫 정렬", "Big-O 입문", "탐색 수강생", "점화식 추적자", "DP 연구생", "알고리즘 마스터"],
    sessionTitles: ["첫 풀이", "브루트 포스 졸업", "그리디 감별사", "그래프 순례자", "최적해 추적자", "시간복잡도를 지배하는 자"]
  }
};

const QUESTION_STEPS = [1, 10, 25, 30, 50, 100];
const SESSION_STEPS = [1, 5, 10, 25, 50, 100];

function createSubjectQuestionAchievements() {
  return Object.entries(SUBJECT_ACHIEVEMENT_CONFIG).flatMap(([subject, config]) => {
    return QUESTION_STEPS.map((value, index) => ({
      id: subject === "os" && value === 10 ? "osBeginner" : `${subject}_question_${value}`,
      subject,
      category: "question",
      icon: value >= 100 ? "🏆" : "🎓",
      title: config.questionTitles[index],
      description: `${config.label} 과목 질문 ${value}회`,
      condition: {
        type: "subjectQuestionCount",
        subject,
        value
      }
    }));
  });
}

function createSubjectSessionAchievements() {
  return Object.entries(SUBJECT_ACHIEVEMENT_CONFIG).flatMap(([subject, config]) => {
    return SESSION_STEPS.map((value, index) => ({
      id: `${subject}_session_${value}`,
      subject,
      category: "session",
      icon: value >= 100 ? "🏅" : "📚",
      title: config.sessionTitles[index],
      description: `${config.label} 집중 세션 ${value}회 완료`,
      condition: {
        type: "subjectSessionCount",
        subject,
        value
      }
    }));
  });
}

const COMMON_ACHIEVEMENTS = [
  {
    id: "firstQuestion",
    subject: "common",
    category: "question",
    icon: "🥉",
    title: "첫 질문",
    description: "AI 질문 1회",
    condition: {
      type: "totalQuestionCount",
      value: 1
    }
  },
  {
    id: "firstFocus",
    subject: "common",
    category: "session",
    icon: "🥈",
    title: "첫 집중",
    description: "25분 집중 완료",
    condition: {
      type: "totalFocusSessionCount",
      value: 1
    }
  },
  {
    id: "firstLessonSave",
    subject: "common",
    category: "other",
    icon: "🥇",
    title: "첫 수업 저장",
    description: "수업 보관함 저장",
    condition: {
      type: "savedLessonCount",
      value: 1
    }
  },
  {
    id: "question50",
    subject: "common",
    category: "question",
    icon: "🏅",
    title: "질문 50회",
    description: "누적 질문 50회",
    condition: {
      type: "totalQuestionCount",
      value: 50
    }
  }
];

const ACHIEVEMENTS_DATA = [
  ...COMMON_ACHIEVEMENTS,
  ...createSubjectQuestionAchievements(),
  ...createSubjectSessionAchievements()
];
