const STORAGE_KEY = "professorStudyTimerState";
const LESSON_ARCHIVE_KEY = "professorStudyTimerLessons";
const GAME_PROGRESS_KEY = "professorStudyTimerProgress";
const ACHIEVEMENTS_KEY = "professorStudyTimerAchievements";
const STUDY_STATS_KEY = "professorStudyTimerStats";
const STUDENT_PROFILE_KEY = "professorTimerAdmissionYear";
const STUDENT_INTRO_KEY = "professorTimerAdmissionIntroShown";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createDefaultStudyState() {
  return {
    date: getTodayKey(),
    todayStudyMinutes: 0,
    todaySessions: 0,
    totalStudyMinutes: 0,
    royalUnlocked: false
  };
}

function loadStudyState() {
  const savedText = localStorage.getItem(STORAGE_KEY);
  let state = createDefaultStudyState();

  if (savedText) {
    try {
      state = { ...state, ...JSON.parse(savedText) };
    } catch (error) {
      console.warn("저장 데이터를 읽을 수 없어 초기화합니다.", error);
    }
  }

  if (state.date !== getTodayKey()) {
    state.date = getTodayKey();
    state.todayStudyMinutes = 0;
    state.todaySessions = 0;
  }

  state.royalUnlocked = state.totalStudyMinutes >= 1200 || state.royalUnlocked;
  saveStudyState(state);
  return state;
}

function saveStudyState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function addCompletedFocusSession(state, minutes) {
  const nextState = {
    ...state,
    todayStudyMinutes: state.todayStudyMinutes + minutes,
    todaySessions: state.todaySessions + 1,
    totalStudyMinutes: state.totalStudyMinutes + minutes
  };

  nextState.royalUnlocked = nextState.totalStudyMinutes >= 1200 || nextState.royalUnlocked;
  saveStudyState(nextState);
  return nextState;
}

function loadLessonArchive() {
  const savedText = localStorage.getItem(LESSON_ARCHIVE_KEY);

  if (!savedText) {
    return [];
  }

  try {
    const lessons = JSON.parse(savedText);
    if (!Array.isArray(lessons)) {
      return [];
    }

    const migratedLessons = lessons.map(migrateLegacyLesson);
    saveLessonArchive(migratedLessons);
    return migratedLessons;
  } catch (error) {
    console.warn("수업 보관함 데이터를 읽지 못해 초기화합니다.", error);
    return [];
  }
}

function migrateLegacyLesson(lesson) {
  if (!lesson || typeof lesson !== "object") {
    return lesson;
  }

  const professorKey = lesson.professorKey || lesson.professor?.key || lesson.subject?.key || "";
  const legacySnapshot = {
    professorKey,
    professorName: lesson.professorName || lesson.professor?.name || "",
    subjectLabel: lesson.subjectLabel || lesson.subject?.label || ""
  };

  if (professorKey === "programming") {
    return {
      ...lesson,
      legacyProfessor: lesson.legacyProfessor || legacySnapshot,
      title: normalizeLegacyLessonTitle(lesson.title, "알고리즘"),
      professorKey: "algorithm",
      professorName: "아루고 리즈무",
      subjectLabel: "알고리즘",
      professor: {
        ...(lesson.professor || {}),
        key: "algorithm",
        name: "아루고 리즈무"
      },
      subject: {
        ...(lesson.subject || {}),
        key: "algorithm",
        label: "알고리즘"
      }
    };
  }

  if (professorKey === "other") {
    return {
      ...lesson,
      legacyProfessor: lesson.legacyProfessor || legacySnapshot,
      title: normalizeLegacyLessonTitle(lesson.title, "데이터베이스"),
      professorKey: "database",
      professorName: "시라토리 데에타",
      subjectLabel: "데이터베이스",
      professor: {
        ...(lesson.professor || {}),
        key: "database",
        name: "시라토리 데에타"
      },
      subject: {
        ...(lesson.subject || {}),
        key: "database",
        label: "데이터베이스"
      }
    };
  }

  return lesson;
}

function normalizeLegacyLessonTitle(title, subjectLabel) {
  if (!title) {
    return title;
  }

  return String(title)
    .replace(/^프로그래밍\s*-/, `${subjectLabel} -`)
    .replace(/^기타\s*-/, `${subjectLabel} -`);
}

function saveLessonArchive(lessons) {
  localStorage.setItem(LESSON_ARCHIVE_KEY, JSON.stringify(lessons));
}

function addLessonToArchive(lesson) {
  const lessons = loadLessonArchive();
  const nextLessons = [lesson, ...lessons];
  saveLessonArchive(nextLessons);
  return nextLessons;
}

function loadGameProgress() {
  const savedText = localStorage.getItem(GAME_PROGRESS_KEY);
  const progress = {
    royalProgressPercent: 0
  };

  if (savedText) {
    try {
      Object.assign(progress, JSON.parse(savedText));
    } catch (error) {
      console.warn("Royal Progress 데이터를 읽지 못해 초기화합니다.", error);
    }
  }

  progress.royalProgressPercent = Math.min(Math.max(Number(progress.royalProgressPercent) || 0, 0), 100);
  saveGameProgress(progress);
  return progress;
}

function saveGameProgress(progress) {
  localStorage.setItem(GAME_PROGRESS_KEY, JSON.stringify(progress));
}

function addRoyalProgress(progress, amount) {
  const nextProgress = {
    ...progress,
    royalProgressPercent: Math.min(100, progress.royalProgressPercent + amount)
  };
  saveGameProgress(nextProgress);
  return nextProgress;
}

function loadAchievements() {
  const savedText = localStorage.getItem(ACHIEVEMENTS_KEY);

  if (!savedText) {
    return {};
  }

  try {
    const achievements = JSON.parse(savedText);
    return achievements && typeof achievements === "object" ? achievements : {};
  } catch (error) {
    console.warn("업적 데이터를 읽지 못해 초기화합니다.", error);
    return {};
  }
}

function saveAchievements(achievements) {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

function createDefaultStudyStats() {
  return {
    totalQuestions: 0,
    focusCompletions: 0,
    savedLessons: 0,
    subjectQuestions: {
      database: 0,
      os: 0,
      graphics: 0,
      algorithm: 0
    },
    subjectSessions: {
      database: 0,
      os: 0,
      graphics: 0,
      algorithm: 0
    }
  };
}

function migrateSubjectStats(savedSubjectStats = {}) {
  const defaults = createDefaultStudyStats().subjectQuestions;
  const migrated = {
    ...defaults,
    ...(savedSubjectStats || {})
  };
  const legacy = {};

  if (Number.isFinite(Number(savedSubjectStats.programming))) {
    migrated.algorithm = (Number(migrated.algorithm) || 0) + Number(savedSubjectStats.programming);
    legacy.programming = Number(savedSubjectStats.programming);
  }

  if (Number.isFinite(Number(savedSubjectStats.other))) {
    legacy.other = Number(savedSubjectStats.other);
  }

  delete migrated.programming;
  delete migrated.other;

  return {
    active: migrated,
    legacy
  };
}

function loadStudyStats() {
  const savedText = localStorage.getItem(STUDY_STATS_KEY);
  const stats = createDefaultStudyStats();

  if (savedText) {
    try {
      const savedStats = JSON.parse(savedText);
      Object.assign(stats, savedStats);
      const migratedQuestions = migrateSubjectStats(savedStats.subjectQuestions);
      const migratedSessions = migrateSubjectStats(savedStats.subjectSessions);

      stats.subjectQuestions = migratedQuestions.active;
      stats.subjectSessions = migratedSessions.active;
      stats.legacySubjectStats = {
        ...(savedStats.legacySubjectStats || {}),
        questions: {
          ...(savedStats.legacySubjectStats?.questions || {}),
          ...migratedQuestions.legacy
        },
        sessions: {
          ...(savedStats.legacySubjectStats?.sessions || {}),
          ...migratedSessions.legacy
        }
      };
    } catch (error) {
      console.warn("공부 통계 데이터를 읽지 못해 초기화합니다.", error);
    }
  }

  saveStudyStats(stats);
  return stats;
}

function saveStudyStats(stats) {
  localStorage.setItem(STUDY_STATS_KEY, JSON.stringify(stats));
}

function normalizeAdmissionYear(value, currentYear = new Date().getFullYear()) {
  const trimmedValue = String(value || "").trim();

  if (!/^\d+$/.test(trimmedValue)) {
    return {
      admissionYear: null,
      error: "입학 연도는 숫자만 입력해 주세요."
    };
  }

  if (trimmedValue.length !== 2 && trimmedValue.length !== 4) {
    return {
      admissionYear: null,
      error: "학번은 24 또는 2024처럼 두 자리나 네 자리로 입력해 주세요."
    };
  }

  const admissionYear = trimmedValue.length === 2
    ? 2000 + Number(trimmedValue)
    : Number(trimmedValue);

  if (admissionYear > currentYear) {
    return {
      admissionYear: null,
      error: "미래의 입학 연도는 사용할 수 없습니다."
    };
  }

  if (admissionYear < currentYear - 30) {
    return {
      admissionYear: null,
      error: "입학 연도가 너무 오래되었습니다. 다시 확인해 주세요."
    };
  }

  return {
    admissionYear,
    error: ""
  };
}

function getStudentLevel(admissionYear, currentYear = new Date().getFullYear()) {
  const yearsSinceAdmission = currentYear - admissionYear;

  if (yearsSinceAdmission >= 4) {
    return "graduationEmergency";
  }

  if (yearsSinceAdmission >= 2) {
    return "upperclassman";
  }

  return "underclassman";
}

function getStudentLevelLabel(level) {
  const labels = {
    underclassman: "저학년",
    upperclassman: "고학년",
    graduationEmergency: "졸업 비상 모드"
  };

  return labels[level] || "저학년";
}

function createStudentProfile(admissionYear, currentYear = new Date().getFullYear()) {
  const yearsSinceAdmission = currentYear - admissionYear;
  const level = getStudentLevel(admissionYear, currentYear);

  return {
    admissionYear,
    currentYear,
    yearsSinceAdmission,
    level,
    levelLabel: getStudentLevelLabel(level)
  };
}

function loadStudentProfile() {
  const savedYear = Number(localStorage.getItem(STUDENT_PROFILE_KEY));

  if (!Number.isInteger(savedYear)) {
    return null;
  }

  const normalized = normalizeAdmissionYear(String(savedYear));
  if (normalized.error) {
    localStorage.removeItem(STUDENT_PROFILE_KEY);
    return null;
  }

  return createStudentProfile(normalized.admissionYear);
}

function saveStudentAdmissionYear(admissionYear) {
  localStorage.setItem(STUDENT_PROFILE_KEY, String(admissionYear));
  localStorage.removeItem(STUDENT_INTRO_KEY);
  return createStudentProfile(admissionYear);
}

function clearStudentProfile() {
  localStorage.removeItem(STUDENT_PROFILE_KEY);
  localStorage.removeItem(STUDENT_INTRO_KEY);
}

function hasShownStudentIntro(profile) {
  const savedKey = localStorage.getItem(STUDENT_INTRO_KEY);
  return savedKey === `${profile.admissionYear}:${profile.level}`;
}

function markStudentIntroShown(profile) {
  localStorage.setItem(STUDENT_INTRO_KEY, `${profile.admissionYear}:${profile.level}`);
}
