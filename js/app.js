const elements = {
  royalBadge: document.getElementById("royalBadge"),
  royalProgressText: document.getElementById("royalProgressText"),
  royalProgressFill: document.getElementById("royalProgressFill"),
  themeToggleButton: document.getElementById("themeToggleButton"),
  professorModeButton: document.getElementById("professorModeButton"),
  enterQuestionButton: document.getElementById("enterQuestionButton"),
  enterFocusRoomButton: document.getElementById("enterFocusRoomButton"),
  enterRecordRoomButton: document.getElementById("enterRecordRoomButton"),
  modeWheel: document.getElementById("modeWheel"),
  wheelLobbyButton: document.getElementById("wheelLobbyButton"),
  wheelQuestionButton: document.getElementById("wheelQuestionButton"),
  modeEnterButton: document.getElementById("modeEnterButton"),
  homeSceneWorld: document.getElementById("homeSceneWorld"),
  professorDecorationArt: document.getElementById("professorDecorationArt"),
  operatorAssistant: document.getElementById("operatorAssistant"),
  bgmAudio: document.querySelector("#global-bgm"),
  bgmToggleButton: document.getElementById("bgmToggleButton"),
  bgmVolumeSlider: document.getElementById("bgmVolumeSlider"),
  mockModeToggle: document.getElementById("mockModeToggle"),
  testQuestionButton: document.getElementById("testQuestionButton"),
  musicInfoButton: document.getElementById("musicInfoButton"),
  musicInfoPopover: document.getElementById("musicInfoPopover"),
  closeMusicInfoButton: document.getElementById("closeMusicInfoButton"),
  admissionSettingsButton: document.getElementById("admissionSettingsButton"),
  studentProfileModal: document.getElementById("studentProfileModal"),
  studentProfileForm: document.getElementById("studentProfileForm"),
  admissionYearInput: document.getElementById("admissionYearInput"),
  admissionYearError: document.getElementById("admissionYearError"),
  resetAdmissionYearButton: document.getElementById("resetAdmissionYearButton"),
  topTotalStudyTime: document.getElementById("topTotalStudyTime"),
  subjectButtons: document.getElementById("subjectButtons"),
  professorCard: document.getElementById("professorCard"),
  professorSubject: document.getElementById("professorSubject"),
  professorName: document.getElementById("professorName"),
  professorPersonality: document.getElementById("professorPersonality"),
  professorQuote: document.getElementById("professorQuote"),
  characterInitial: document.getElementById("characterInitial"),
  characterName: document.getElementById("characterName"),
  characterSubject: document.getElementById("characterSubject"),
  mascotStage: document.getElementById("mascotStage"),
  mascotImage: document.getElementById("mascotImage"),
  mascotPlaceholder: document.getElementById("mascotPlaceholder"),
  mascotSubject: document.getElementById("mascotSubject"),
  mascotName: document.getElementById("mascotName"),
  llmForm: document.getElementById("llmForm"),
  llmInput: document.getElementById("llmInput"),
  llmSubmitButton: document.getElementById("llmSubmitButton"),
  lessonArchiveButton: document.getElementById("lessonArchiveButton"),
  achievementButton: document.getElementById("achievementButton"),
  totalStudyMinutesStat: document.getElementById("totalStudyMinutesStat"),
  totalQuestionCount: document.getElementById("totalQuestionCount"),
  subjectQuestionStats: document.getElementById("subjectQuestionStats"),
  focusMode: document.getElementById("focusMode"),
  focusBackButton: document.getElementById("focusBackButton"),
  focusCharacterInitial: document.getElementById("focusCharacterInitial"),
  focusCharacterName: document.getElementById("focusCharacterName"),
  focusCharacterSubject: document.getElementById("focusCharacterSubject"),
  focusNameCutin: document.getElementById("focusNameCutin"),
  focusKanjiName: document.getElementById("focusKanjiName"),
  focusKoreanName: document.getElementById("focusKoreanName"),
  focusProfessorName: document.getElementById("focusProfessorName"),
  focusSubjectChip: document.getElementById("focusSubjectChip"),
  questionModeChoices: document.getElementById("questionModeChoices"),
  focusChatMessages: document.getElementById("focusChatMessages"),
  focusChatForm: document.getElementById("focusChatForm"),
  focusChatInput: document.getElementById("focusChatInput"),
  focusChatSubmitButton: document.getElementById("focusChatSubmitButton"),
  focusUnderstandingCheckHost: document.getElementById("focusUnderstandingCheckHost"),
  focusRoom: document.getElementById("focusRoom"),
  focusRoomBackButton: document.getElementById("focusRoomBackButton"),
  focusRoomProfessorGif: document.getElementById("focusRoomProfessorGif"),
  focusRoomKanjiName: document.getElementById("focusRoomKanjiName"),
  focusRoomKoreanName: document.getElementById("focusRoomKoreanName"),
  focusRoomProfessorName: document.getElementById("focusRoomProfessorName"),
  focusRoomSubjectChip: document.getElementById("focusRoomSubjectChip"),
  focusRoomTimerDisplay: document.getElementById("focusRoomTimerDisplay"),
  focusRoomTimerTitle: document.getElementById("focusRoomTimerTitle"),
  focusRoomStartButton: document.getElementById("focusRoomStartButton"),
  focusRoomPauseButton: document.getElementById("focusRoomPauseButton"),
  focusRoomResetButton: document.getElementById("focusRoomResetButton"),
  focusRoomModeToggleButton: document.getElementById("focusRoomModeToggleButton"),
  recordRoom: document.getElementById("recordRoom"),
  recordRoomBackButton: document.getElementById("recordRoomBackButton"),
  recordTodayMinutes: document.getElementById("recordTodayMinutes"),
  recordTodaySessions: document.getElementById("recordTodaySessions"),
  recordTotalQuestions: document.getElementById("recordTotalQuestions"),
  recordRoyalProgress: document.getElementById("recordRoyalProgress"),
  recordOpenArchiveButton: document.getElementById("recordOpenArchiveButton"),
  recordOpenAchievementsButton: document.getElementById("recordOpenAchievementsButton"),
  timerTitle: document.getElementById("timerTitle"),
  timerDisplay: document.getElementById("timerDisplay"),
  modeToggleButton: document.getElementById("modeToggleButton"),
  startButton: document.getElementById("startButton"),
  pauseButton: document.getElementById("pauseButton"),
  resetButton: document.getElementById("resetButton"),
  todaySessions: document.getElementById("todaySessions"),
  todayMinutes: document.getElementById("todayMinutes"),
  totalMinutes: document.getElementById("totalMinutes"),
  dialogueBubble: document.getElementById("dialogueBubble"),
  dialogueTitle: document.getElementById("dialogueTitle"),
  dialogueText: document.getElementById("dialogueText"),
  unlockMessage: document.getElementById("unlockMessage"),
  successEffect: document.getElementById("successEffect"),
  lessonSaveModal: document.getElementById("lessonSaveModal"),
  lessonSaveProfessor: document.getElementById("lessonSaveProfessor"),
  lessonSaveSubject: document.getElementById("lessonSaveSubject"),
  lessonSaveMinutes: document.getElementById("lessonSaveMinutes"),
  lessonSaveQuestions: document.getElementById("lessonSaveQuestions"),
  saveLessonButton: document.getElementById("saveLessonButton"),
  discardLessonButton: document.getElementById("discardLessonButton"),
  cancelLessonSaveButton: document.getElementById("cancelLessonSaveButton"),
  lessonArchivePanel: document.getElementById("lessonArchivePanel"),
  lessonArchiveList: document.getElementById("lessonArchiveList"),
  lessonArchiveDetail: document.getElementById("lessonArchiveDetail"),
  closeLessonArchiveButton: document.getElementById("closeLessonArchiveButton"),
  achievementModal: document.getElementById("achievementModal"),
  achievementTabs: document.getElementById("achievementTabs"),
  achievementTypeTabs: document.getElementById("achievementTypeTabs"),
  achievementList: document.getElementById("achievementList"),
  closeAchievementButton: document.getElementById("closeAchievementButton"),
  achievementToast: document.getElementById("achievementToast")
};

const THEME_STORAGE_KEY = "professorStudyTimerTheme";
const THEME_ORDER = ["red", "blue", "pink", "yellow", "green"];
const BGM_ENABLED_KEY = "bgmEnabled";
const BGM_VOLUME_KEY = "bgmVolume";
const BGM_CURRENT_TIME_KEY = "bgmCurrentTime";
const MOCK_MODE_STORAGE_KEY = "mockAnswerMode";
const TEST_QUESTIONS = [
  "운영체제에서 뮤텍스가 무엇인가요?",
  "데드락은 왜 발생하나요?",
  "SQL의 JOIN을 설명해주세요.",
  "포인터가 무엇인가요?",
  "OpenGL에서 셰이더의 역할은 무엇인가요?"
];
const LEGACY_PROFESSOR_NAMES = {
  "Professor Join": "시라토리 데에타",
  "Professor Mutex": "아카기 시스타무",
  "Professor Vector": "그라피쿠 이로하",
  "Professor Debug": "아루고 리즈무",
  "Professor Memo": "교수",
  Professor: "교수"
};
const ACHIEVEMENT_DEFINITIONS = typeof ACHIEVEMENTS_DATA !== "undefined" ? ACHIEVEMENTS_DATA : [];
const ACHIEVEMENT_TAB_DEFINITIONS = typeof ACHIEVEMENT_CATEGORIES !== "undefined"
  ? ACHIEVEMENT_CATEGORIES
  : [{ key: "all", label: "전체" }];
const ACHIEVEMENT_TYPE_TAB_DEFINITIONS = typeof ACHIEVEMENT_TYPE_FILTERS !== "undefined"
  ? ACHIEVEMENT_TYPE_FILTERS
  : [{ key: "all", label: "전체" }];
const PROFESSOR_IDLE_LINE_INTERVAL_MS = 60 * 1000;
const DEV_ALWAYS_SHOW_LIVE2D = false;
const DEV_USE_PROFESSOR_GIF = true;

let studyState = loadStudyState();
let gameProgress = loadGameProgress();
let achievementState = loadAchievements();
let studyStats = loadStudyStats();
let studentProfile = loadStudentProfile();
let currentProfessorKey = "database";
let currentTheme = loadTheme();
let currentProfessorMode = loadProfessorMode(gameProgress);
let isMockAnswerMode = loadMockAnswerMode();
let currentLessonSession = createEmptyLessonSession();
let activeRequestId = 0;
let royalProgressAnimationFrame = null;
let displayedRoyalProgress = gameProgress.royalProgressPercent;
let achievementToastTimer = null;
let expressionResetTimer = null;
let understandingExpressionResetTimer = null;
let understandingCheckSequence = 0;
let activeAchievementCategory = "all";
let activeAchievementType = "all";
let idleDialogueTimerId = null;
let idleDialogueRemainingMs = PROFESSOR_IDLE_LINE_INTERVAL_MS;
let idleDialogueStartedAt = 0;
let activeLive2DRenderKey = null;
let activeLive2DRenderTargetId = null;
let currentScreen = "home";
let currentMainMode = "lobby";
let wheelSelection = "lobby";
let rouletteNavigationTimer = null;
let currentQuestionMode = "general";
let homeSceneCamera = null;
const lastIdleLineByProfessor = {};

const timer = new StudyTimer({
  onStart: (mode) => {
    setProfessorActive(true);
    updateDialogue(mode === "focus" ? "start" : "break");
    resumeIdleLineTimer();
    updateButtons();
  },
  onPause: () => {
    setProfessorActive(false);
    updateDialogue("pause");
    pauseIdleLineTimer();
    updateButtons();
  },
  onReset: (mode, remainingSeconds) => {
    setProfessorActive(false);
    updateTimerDisplay(remainingSeconds);
    updateModeText(mode);
    updateDialogue("reset");
    clearIdleLineTimer();
    updateButtons();
  },
  onModeChange: (mode, remainingSeconds, reason) => {
    setProfessorActive(false);
    updateTimerDisplay(remainingSeconds);
    updateModeText(mode);
    if (reason !== "autoAfterFocus") {
      updateDialogue(mode === "focus" ? "select" : "break");
    }
    clearIdleLineTimer();
    updateButtons();
  },
  onTick: updateTimerDisplay,
  onFocusComplete: (minutes) => {
    const wasRoyalUnlocked = studyState.royalUnlocked;
    studyState = addCompletedFocusSession(studyState, minutes);
    studyStats.focusCompletions += 1;
    studyStats.subjectSessions[currentProfessorKey] = (studyStats.subjectSessions[currentProfessorKey] || 0) + 1;
    saveStudyStats(studyStats);
    increaseRoyalProgress(5);
    checkAchievements();
    updateStats();
    updateRoyalMode(!wasRoyalUnlocked && studyState.royalUnlocked);
    updateDialogue("complete");
    clearIdleLineTimer();
    showSuccessEffect();
  }
});

function initializeApp() {
  ensureOperationalUi();
  renderConfiguredArtSlots();
  initializeBgm();
  applyTheme(currentTheme);
  renderSubjectButtons();
  renderQuestionModeChoices();
  selectProfessor(currentProfessorKey);
  homeSceneCamera = window.SceneCamera?.create?.(elements.homeSceneWorld) || null;
  updateTimerDisplay(timer.remainingSeconds);
  updateModeText(timer.mode);
  updateStats();
  updateRoyalMode(false);
  checkAchievements();
  updateButtons();
  setWheelSelection("lobby");
  setMainMode("lobby");

  elements.startButton.addEventListener("click", () => timer.start());
  elements.pauseButton.addEventListener("click", () => timer.pause());
  elements.resetButton.addEventListener("click", () => timer.reset());
  elements.modeToggleButton.addEventListener("click", () => timer.toggleMode());
  elements.enterQuestionButton?.addEventListener("click", openQuestionRoom);
  elements.enterFocusRoomButton?.addEventListener("click", openFocusRoom);
  elements.enterRecordRoomButton?.addEventListener("click", openRecordRoom);
  elements.wheelLobbyButton?.addEventListener("click", () => navigateModeRoulette("lobby"));
  elements.wheelQuestionButton?.addEventListener("click", () => navigateModeRoulette("question"));
  elements.modeWheel?.setAttribute("tabindex", "0");
  elements.modeWheel?.addEventListener("wheel", handleModeWheelScroll, { passive: false });
  elements.modeWheel?.addEventListener("keydown", handleModeWheelKeydown);
  elements.focusRoomBackButton?.addEventListener("click", closeFocusRoom);
  elements.focusRoomStartButton?.addEventListener("click", () => timer.start());
  elements.focusRoomPauseButton?.addEventListener("click", () => timer.pause());
  elements.focusRoomResetButton?.addEventListener("click", () => timer.reset());
  elements.focusRoomModeToggleButton?.addEventListener("click", () => timer.toggleMode());
  elements.recordRoomBackButton?.addEventListener("click", closeRecordRoom);
  elements.recordOpenArchiveButton?.addEventListener("click", openLessonArchive);
  elements.recordOpenAchievementsButton?.addEventListener("click", openAchievementModal);
  elements.llmForm.addEventListener("submit", handleLlmSubmit);
  elements.focusChatForm.addEventListener("submit", handleFocusChatSubmit);
  elements.focusBackButton.addEventListener("click", requestCloseFocusMode);
  elements.focusChatInput.addEventListener("keydown", handleFocusInputKeydown);
  elements.focusChatInput.addEventListener("input", resizeFocusInput);
  elements.themeToggleButton.addEventListener("click", cycleTheme);
  elements.professorModeButton.addEventListener("click", toggleProfessorMode);
  elements.bgmToggleButton.addEventListener("click", toggleBgm);
  elements.bgmVolumeSlider.addEventListener("input", handleBgmVolumeChange);
  elements.mockModeToggle.addEventListener("change", handleMockModeChange);
  elements.testQuestionButton.addEventListener("click", handleTestQuestionClick);
  elements.musicInfoButton.addEventListener("click", toggleMusicInfoPopover);
  elements.closeMusicInfoButton.addEventListener("click", closeMusicInfoPopover);
  document.addEventListener("click", handleMusicInfoOutsideClick);
  elements.admissionSettingsButton.addEventListener("click", openStudentProfileModal);
  elements.studentProfileForm.addEventListener("submit", handleStudentProfileSubmit);
  elements.resetAdmissionYearButton.addEventListener("click", resetStudentProfile);
  elements.saveLessonButton.addEventListener("click", saveCurrentLessonAndReturn);
  elements.discardLessonButton.addEventListener("click", discardCurrentLessonAndReturn);
  elements.cancelLessonSaveButton.addEventListener("click", cancelLessonSave);
  elements.lessonArchiveButton.addEventListener("click", openLessonArchive);
  elements.closeLessonArchiveButton.addEventListener("click", closeLessonArchive);
  elements.achievementButton.addEventListener("click", openAchievementModal);
  elements.closeAchievementButton.addEventListener("click", closeAchievementModal);
  initializeIdleLineDebugTools();
  window.ProfessorInteractionController?.initialize?.({ target: document.getElementById("professorGifStage") });
  window.ProfessorScreenManager?.setScreen?.("home");

  if (!studentProfile) {
    openStudentProfileModal();
  } else {
    updateAdmissionSettingsButton();
    showStudentProfileIntroIfNeeded();
  }
}

function renderConfiguredArtSlots() {
  document.querySelectorAll("[data-art-slot]").forEach((element) => {
    const slot = element.dataset.artSlot;
    const src = window.UI_ART_ASSETS?.[slot] || "";
    if (!src) {
      return;
    }
    element.setAttribute("src", src);
  });
}

function ensureOperationalUi() {
  const firstNavAction = document.querySelector(".bottom-command-row .nav-action");
  if (!elements.achievementButton && firstNavAction) {
    elements.achievementButton = firstNavAction;
    elements.achievementButton.id = "achievementButton";
  }
  if (elements.achievementButton) {
    elements.achievementButton.textContent = "업적";
  }

  ensureMockModeToggle();
  ensureTestQuestionButton();

  const statsGrid = document.querySelector(".stats-grid");
  if (statsGrid) {
    elements.totalStudyMinutesStat = elements.totalStudyMinutesStat || createStatCard(statsGrid, "누적 공부 시간", "totalStudyMinutesStat", "0분");
    elements.totalQuestionCount = elements.totalQuestionCount || createStatCard(statsGrid, "누적 질문 수", "totalQuestionCount", "0");

    if (!elements.subjectQuestionStats) {
      const card = document.createElement("article");
      card.className = "stat-card game-card subject-stat-card";

      const label = document.createElement("span");
      label.textContent = "과목별 질문 수";

      const stats = document.createElement("div");
      stats.id = "subjectQuestionStats";
      stats.className = "subject-question-stats";

      card.appendChild(label);
      card.appendChild(stats);
      statsGrid.appendChild(card);
      elements.subjectQuestionStats = stats;
    }
  }

  ensureAchievementModal();
  ensureAchievementToast();
}

function ensureMockModeToggle() {
  if (elements.mockModeToggle) {
    elements.mockModeToggle.checked = isMockAnswerMode;
    return;
  }

  const commandRow = document.querySelector(".bottom-command-row");
  const llmForm = elements.llmForm;
  if (!commandRow || !llmForm) {
    return;
  }

  const label = document.createElement("label");
  label.className = "mock-mode-toggle";
  label.setAttribute("for", "mockModeToggle");

  const checkbox = document.createElement("input");
  checkbox.id = "mockModeToggle";
  checkbox.type = "checkbox";
  checkbox.checked = isMockAnswerMode;

  const text = document.createElement("span");
  text.textContent = "Mock Answer Mode";

  label.appendChild(checkbox);
  label.appendChild(text);
  commandRow.insertBefore(label, llmForm);
  elements.mockModeToggle = checkbox;
}

function ensureTestQuestionButton() {
  if (elements.testQuestionButton) {
    return;
  }

  const commandRow = document.querySelector(".bottom-command-row");
  const llmForm = elements.llmForm;
  if (!commandRow || !llmForm) {
    return;
  }

  const button = document.createElement("button");
  button.id = "testQuestionButton";
  button.className = "nav-action test-question-button";
  button.type = "button";
  button.textContent = "테스트 질문";

  commandRow.insertBefore(button, llmForm);
  elements.testQuestionButton = button;
}

function createStatCard(statsGrid, labelText, id, initialText) {
  const card = document.createElement("article");
  card.className = "stat-card game-card";

  const label = document.createElement("span");
  label.textContent = labelText;

  const value = document.createElement("strong");
  value.id = id;
  value.textContent = initialText;

  card.appendChild(label);
  card.appendChild(value);
  statsGrid.appendChild(card);
  return value;
}

function ensureAchievementModal() {
  if (elements.achievementModal && elements.achievementList && elements.closeAchievementButton) {
    return;
  }

  const modal = document.createElement("section");
  modal.id = "achievementModal";
  modal.className = "achievement-modal";
  modal.setAttribute("aria-label", "업적");
  modal.setAttribute("aria-hidden", "true");

  const panel = document.createElement("div");
  panel.className = "achievement-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", "achievementTitle");

  const header = document.createElement("header");
  header.className = "achievement-header";

  const titleGroup = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "eyebrow";
  eyebrow.textContent = "Achievements";
  const title = document.createElement("h2");
  title.id = "achievementTitle";
  title.textContent = "업적";
  titleGroup.appendChild(eyebrow);
  titleGroup.appendChild(title);

  const closeButton = document.createElement("button");
  closeButton.id = "closeAchievementButton";
  closeButton.type = "button";
  closeButton.textContent = "닫기";

  const tabs = document.createElement("div");
  tabs.id = "achievementTabs";
  tabs.className = "achievement-tabs";
  tabs.setAttribute("role", "tablist");
  tabs.setAttribute("aria-label", "업적 카테고리");

  const typeTabs = document.createElement("div");
  typeTabs.id = "achievementTypeTabs";
  typeTabs.className = "achievement-tabs achievement-type-tabs";
  typeTabs.setAttribute("role", "tablist");
  typeTabs.setAttribute("aria-label", "업적 유형");

  const scrollArea = document.createElement("div");
  scrollArea.className = "achievement-scroll-area";

  const list = document.createElement("div");
  list.id = "achievementList";
  list.className = "achievement-list";

  header.appendChild(titleGroup);
  header.appendChild(closeButton);
  panel.appendChild(header);
  panel.appendChild(tabs);
  panel.appendChild(typeTabs);
  scrollArea.appendChild(list);
  panel.appendChild(scrollArea);
  modal.appendChild(panel);
  document.body.appendChild(modal);

  elements.achievementModal = modal;
  elements.achievementTabs = tabs;
  elements.achievementTypeTabs = typeTabs;
  elements.achievementList = list;
  elements.closeAchievementButton = closeButton;
}

function ensureAchievementToast() {
  if (elements.achievementToast) {
    return;
  }

  const toast = document.createElement("div");
  toast.id = "achievementToast";
  toast.className = "achievement-toast";
  toast.setAttribute("aria-hidden", "true");
  toast.textContent = "🏆 업적 획득!";
  document.body.appendChild(toast);
  elements.achievementToast = toast;
}

function initializeBgm() {
  if (!elements.bgmAudio || !elements.bgmToggleButton || !elements.bgmVolumeSlider) {
    return;
  }

  const savedVolume = Number(localStorage.getItem(BGM_VOLUME_KEY));
  const volumePercent = Number.isFinite(savedVolume) ? Math.min(Math.max(savedVolume, 0), 100) : 25;
  const savedTime = Number(localStorage.getItem(BGM_CURRENT_TIME_KEY));

  elements.bgmAudio.volume = volumePercent / 100;
  elements.bgmVolumeSlider.value = String(volumePercent);

  if (Number.isFinite(savedTime) && savedTime > 0) {
    try {
      elements.bgmAudio.currentTime = savedTime;
    } catch (error) {
      // Some browsers reject seeking before metadata is ready.
    }
  }

  updateBgmButton();
  if (isBgmEnabled()) {
    tryPlayBgm();
  }

  ["pointerdown", "keydown", "click"].forEach((eventName) => {
    document.addEventListener(eventName, tryPlayBgmAfterUserGesture, { once: true, capture: true });
  });

  window.addEventListener("beforeunload", saveBgmCurrentTime);
}

function isBgmEnabled() {
  return localStorage.getItem(BGM_ENABLED_KEY) !== "false";
}

function setBgmEnabled(enabled) {
  localStorage.setItem(BGM_ENABLED_KEY, String(enabled));
  updateBgmButton();
}

function updateBgmButton() {
  if (!elements.bgmToggleButton) {
    return;
  }

  elements.bgmToggleButton.textContent = isBgmEnabled() ? "BGM ON" : "BGM OFF";
  elements.bgmToggleButton.classList.toggle("is-off", !isBgmEnabled());
}

function tryPlayBgm() {
  if (!elements.bgmAudio || !isBgmEnabled()) {
    return;
  }

  elements.bgmAudio.play().catch(() => {
    // Browser autoplay policies and missing audio files should not interrupt the app.
  });
}

function tryPlayBgmAfterUserGesture() {
  tryPlayBgm();
}

function toggleBgm() {
  if (!elements.bgmAudio) {
    return;
  }

  const nextEnabled = !isBgmEnabled();
  setBgmEnabled(nextEnabled);

  if (nextEnabled) {
    tryPlayBgm();
    return;
  }

  elements.bgmAudio.pause();
  saveBgmCurrentTime();
}

function handleBgmVolumeChange() {
  if (!elements.bgmAudio) {
    return;
  }

  const volumePercent = Math.min(Math.max(Number(elements.bgmVolumeSlider.value) || 0, 0), 100);
  elements.bgmAudio.volume = volumePercent / 100;
  localStorage.setItem(BGM_VOLUME_KEY, String(volumePercent));
}

function saveBgmCurrentTime() {
  if (!elements.bgmAudio || !Number.isFinite(elements.bgmAudio.currentTime)) {
    return;
  }

  localStorage.setItem(BGM_CURRENT_TIME_KEY, String(elements.bgmAudio.currentTime));
}

function toggleMusicInfoPopover(event) {
  event.stopPropagation();
  const isOpen = elements.musicInfoPopover.getAttribute("aria-hidden") === "false";
  elements.musicInfoPopover.setAttribute("aria-hidden", isOpen ? "true" : "false");
}

function closeMusicInfoPopover(event) {
  if (event) {
    event.stopPropagation();
  }

  elements.musicInfoPopover.setAttribute("aria-hidden", "true");
}

function handleMusicInfoOutsideClick(event) {
  if (elements.musicInfoPopover.getAttribute("aria-hidden") === "true") {
    return;
  }

  if (elements.musicInfoPopover.contains(event.target) || elements.musicInfoButton.contains(event.target)) {
    return;
  }

  closeMusicInfoPopover();
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_ORDER.includes(savedTheme) ? savedTheme : "blue";
}

function loadMockAnswerMode() {
  return localStorage.getItem(MOCK_MODE_STORAGE_KEY) === "true";
}

function handleMockModeChange() {
  isMockAnswerMode = Boolean(elements.mockModeToggle?.checked);
  localStorage.setItem(MOCK_MODE_STORAGE_KEY, String(isMockAnswerMode));
}

function handleTestQuestionClick() {
  const question = getRandomTestQuestion();
  if (!document.body.classList.contains("focus-mode-active")) {
    openFocusMode();
  }

  elements.focusChatInput.value = question;
  resizeFocusInput();
  elements.focusChatForm.requestSubmit();
}

function getRandomTestQuestion() {
  const index = Math.floor(Math.random() * TEST_QUESTIONS.length);
  return TEST_QUESTIONS[index];
}

function applyTheme(theme) {
  THEME_ORDER.forEach((themeName) => {
    document.body.classList.remove(`theme-${themeName}`);
  });
  document.body.classList.add(`theme-${theme}`);
  elements.themeToggleButton.textContent = `색상 변경: ${theme}`;
}

function cycleTheme() {
  const currentIndex = THEME_ORDER.indexOf(currentTheme);
  currentTheme = THEME_ORDER[(currentIndex + 1) % THEME_ORDER.length];
  localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  applyTheme(currentTheme);
}

function renderSubjectButtons() {
  SUBJECTS.forEach((subject) => {
    const option = document.createElement("option");
    option.value = subject.key;
    option.textContent = subject.label;
    elements.subjectButtons.appendChild(option);
  });

  elements.subjectButtons.addEventListener("change", (event) => {
    selectProfessor(event.target.value);
  });
}

function renderQuestionModeChoices() {
  if (!elements.questionModeChoices) {
    return;
  }

  const modes = window.ProfessorStudyConstants?.QUESTION_MODES || [];
  elements.questionModeChoices.innerHTML = "";

  modes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "question-mode-choice";
    button.dataset.questionMode = mode.key;
    button.textContent = mode.label;
    button.setAttribute("aria-pressed", String(mode.key === currentQuestionMode));
    button.addEventListener("click", () => setQuestionMode(mode.key));
    elements.questionModeChoices.appendChild(button);
  });
}

function setQuestionMode(mode) {
  currentQuestionMode = mode || "general";
  window.ProfessorStudyStore?.setQuestionMode?.(currentQuestionMode);

  document.querySelectorAll(".question-mode-choice").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.questionMode === currentQuestionMode));
  });
}

function setWheelSelection(mode) {
  wheelSelection = mode === "question" ? "question" : "lobby";
  document.body.classList.toggle("wheel-selection-question", wheelSelection === "question");
  document.body.classList.toggle("wheel-selection-lobby", wheelSelection === "lobby");
  document.body.style.setProperty("--mode-roulette-rotation", wheelSelection === "question" ? "180deg" : "0deg");

  [
    elements.wheelLobbyButton,
    elements.wheelQuestionButton
  ].forEach((button) => {
    if (!button) {
      return;
    }

    const isSelected = button.dataset.mode === wheelSelection;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function handleModeWheelScroll(event) {
  event.preventDefault();
  setWheelSelection(wheelSelection === "lobby" ? "question" : "lobby");
}

function handleModeWheelKeydown(event) {
  if (event.target?.classList?.contains("mode-wheel-item")) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    enterSelectedMode();
    return;
  }

  if (event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    setWheelSelection(wheelSelection === "lobby" ? "question" : "lobby");
  }
}

function enterSelectedMode() {
  if (wheelSelection === "question") {
    navigateModeRoulette("question");
    return;
  }

  navigateModeRoulette("lobby");
}

function navigateModeRoulette(mode) {
  const nextMode = mode === "question" ? "question" : "lobby";
  clearTimeout(rouletteNavigationTimer);
  setWheelSelection(nextMode);
  document.body.classList.add("mode-roulette-spinning");

  rouletteNavigationTimer = setTimeout(() => {
    document.body.classList.remove("mode-roulette-spinning");

    if (nextMode === "question") {
      if (!document.body.classList.contains("focus-mode-active")) {
        openQuestionRoom();
      }
      return;
    }

    if (document.body.classList.contains("focus-mode-active")) {
      requestCloseFocusMode();
      return;
    }

    enterLobbyModeFromWheel();
  }, 420);
}

function enterLobbyModeFromWheel() {
  setWheelSelection("lobby");
  setMainMode("lobby");
  if (document.body.classList.contains("focus-mode-active")) {
    closeFocusMode();
  }
}

function setMainMode(mode) {
  currentMainMode = mode === "question" ? "question" : "lobby";
  document.body.classList.toggle("main-mode-question", currentMainMode === "question");
  document.body.classList.toggle("main-mode-lobby", currentMainMode === "lobby");
}

function selectProfessor(key) {
  clearUnderstandingCheck();
  resetUnderstandingExpression();
  const normalizedKey = normalizeProfessorSelectionKey(key);
  currentProfessorKey = normalizedKey;
  window.currentProfessorKey = normalizedKey;
  window.ProfessorStudyStore?.setProfessor?.(normalizedKey);
  const professor = PROFESSORS[normalizedKey];

  elements.professorSubject.textContent = professor.subjectLabel;
  elements.professorName.textContent = professor.name;
  elements.professorPersonality.textContent = professor.personality;
  elements.professorQuote.textContent = `"${professor.quote}"`;
  elements.characterInitial.textContent = getProfessorFallbackSymbol(professor);
  elements.characterName.textContent = professor.name;
  elements.characterSubject.textContent = professor.subjectLabel;
  renderMascot(professor);
  renderProfessorArt(normalizedKey);
  elements.dialogueTitle.textContent = professor.name;
  syncFocusProfessor(professor);
  syncFocusRoomProfessor(professor);

  elements.subjectButtons.value = normalizedKey;

  updateDialogue("select");
  applyProfessorMode();
  restartIdleLineTimerForProfessor();

  setProfessorGif("idle");
  window.InfoPopups?.maybeShowProfessorIntro?.(normalizedKey);
}

function renderProfessorArt(professorKey) {
  const decoration = window.getProfessorArtAsset?.(professorKey, "decoration") || "";
  if (elements.professorDecorationArt && decoration) {
    elements.professorDecorationArt.src = decoration;
  }

  if (elements.operatorAssistant) {
    const operator = window.getProfessorArtAsset?.(professorKey, "operator") || "";
    elements.operatorAssistant.hidden = !operator;
    if (operator) {
      elements.operatorAssistant.src = operator;
    }
  }
}

function normalizeProfessorSelectionKey(key) {
  if (PROFESSORS[key]) {
    return key;
  }

  if (key === "programming") {
    return "algorithm";
  }

  return "database";
}

function renderMascot(professor) {
  if (!elements.mascotStage) {
    return;
  }

  const mascot = getProfessorMascot(professor);
  const hasImage = Boolean(mascot.image);

  if (elements.mascotImage) {
    elements.mascotImage.hidden = !hasImage;
    elements.mascotImage.alt = hasImage ? `${professor.name} 마스코트` : "";
    if (hasImage && elements.mascotImage.getAttribute("src") !== mascot.image) {
      elements.mascotImage.src = mascot.image;
    } else if (!hasImage) {
      elements.mascotImage.removeAttribute("src");
    }
  }

  if (elements.mascotPlaceholder) {
    elements.mascotPlaceholder.hidden = hasImage;
  }
  if (elements.mascotSubject) {
    elements.mascotSubject.textContent = professor.subjectLabel;
  }
  if (elements.mascotName) {
    elements.mascotName.textContent = professor.name;
  }
}

function getProfessorFallbackSymbol(professor) {
  return professor?.royal?.fallbackSymbol || professor?.initial || "?";
}

function toggleProfessorMode() {
  if (!isRoyalProgressUnlocked(gameProgress)) {
    currentProfessorMode = saveProfessorMode(PROFESSOR_MODE_NORMAL);
    applyProfessorMode();
    return;
  }

  currentProfessorMode = saveProfessorMode(
    currentProfessorMode === PROFESSOR_MODE_ROYAL ? PROFESSOR_MODE_NORMAL : PROFESSOR_MODE_ROYAL
  );
  applyProfessorMode();
}

function applyProfessorMode(preferredTargetId = "") {
  const isUnlocked = isRoyalProgressUnlocked(gameProgress);
  if (!isUnlocked && currentProfessorMode !== PROFESSOR_MODE_NORMAL) {
    currentProfessorMode = saveProfessorMode(PROFESSOR_MODE_NORMAL);
  }

  const isRoyalMode = isUnlocked && currentProfessorMode === PROFESSOR_MODE_ROYAL;
  document.body.classList.toggle("dev-always-live2d", DEV_ALWAYS_SHOW_LIVE2D);
  document.body.classList.toggle("professor-mode-royal", isRoyalMode);
  document.body.classList.toggle("professor-mode-normal", !isRoyalMode);

  if (elements.professorModeButton) {
    elements.professorModeButton.hidden = !isUnlocked;
    elements.professorModeButton.textContent = isRoyalMode ? "일반 모드로 돌아가기" : "Royal Mode 진입";
    elements.professorModeButton.setAttribute("aria-pressed", String(isRoyalMode));
  }

  const professor = PROFESSORS[currentProfessorKey];
  renderMascot(professor);

  const live2dKey = shouldRenderProfessorLive2D(professor, isRoyalMode) ? currentProfessorKey : "";
  syncProfessorLive2D(live2dKey, preferredTargetId);
}

function syncProfessorLive2D(professorKey, preferredTargetId = "") {
  const targetId = preferredTargetId || (document.body.classList.contains("focus-mode-active") ? "focus" : "lobby");

  if (activeLive2DRenderKey === professorKey && activeLive2DRenderTargetId === targetId) {
    return;
  }

  activeLive2DRenderKey = professorKey;
  activeLive2DRenderTargetId = targetId;

  if (typeof window.loadProfessorLive2D === "function") {
    window.loadProfessorLive2D(professorKey, targetId);
    return;
  }

  if (typeof syncLive2DProfessor === "function") {
    syncLive2DProfessor(professorKey, targetId);
  }
}

function shouldRenderProfessorLive2D(professor, isRoyalMode) {
  if (DEV_USE_PROFESSOR_GIF) {
    return false;
  }

  if (!getProfessorLive2DModel(professor)) {
    return false;
  }

  return DEV_ALWAYS_SHOW_LIVE2D || isRoyalMode;
}

async function handleLlmSubmit(event) {
  event.preventDefault();
  const question = elements.llmInput.value.trim();

  if (!question) {
    return;
  }

  openFocusMode();
  elements.llmInput.value = "";
  await sendMessage(question, elements.llmSubmitButton);
}

async function handleFocusChatSubmit(event) {
  event.preventDefault();
  const question = elements.focusChatInput.value.trim();

  if (!question) {
    return;
  }

  elements.focusChatInput.value = "";
  resizeFocusInput();
  await sendMessage(question, elements.focusChatSubmitButton);
}

function handleFocusInputKeydown(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    elements.focusChatForm.requestSubmit();
  }
}

function openStudentProfileModal() {
  if (!elements.studentProfileModal) {
    return;
  }

  elements.admissionYearInput.value = studentProfile?.admissionYear || "";
  elements.admissionYearError.textContent = "";
  elements.studentProfileModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("student-profile-open");
  requestAnimationFrame(() => elements.admissionYearInput.focus());
}

function closeStudentProfileModal() {
  elements.studentProfileModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("student-profile-open");
}

function handleStudentProfileSubmit(event) {
  event.preventDefault();
  const normalized = normalizeAdmissionYear(elements.admissionYearInput.value);

  if (normalized.error) {
    elements.admissionYearError.textContent = normalized.error;
    return;
  }

  studentProfile = saveStudentAdmissionYear(normalized.admissionYear);
  updateAdmissionSettingsButton();
  closeStudentProfileModal();
  showStudentProfileIntroIfNeeded(true);
}

function resetStudentProfile() {
  clearStudentProfile();
  studentProfile = null;
  elements.admissionYearInput.value = "";
  elements.admissionYearError.textContent = "학번 정보를 초기화했습니다. 새 학번을 입력해 주세요.";
  updateAdmissionSettingsButton();
}

function updateAdmissionSettingsButton() {
  if (!elements.admissionSettingsButton) {
    return;
  }

  elements.admissionSettingsButton.textContent = studentProfile
    ? `${studentProfile.admissionYear}학번`
    : "학번 설정";
}

function showStudentProfileIntroIfNeeded(force = false) {
  if (!studentProfile || (!force && hasShownStudentIntro(studentProfile))) {
    return;
  }

  const professor = PROFESSORS[currentProfessorKey];
  setDialogueText(createStudentProfileIntroDialogue(professor, studentProfile));
  markStudentIntroShown(studentProfile);
}

function createStudentProfileIntroDialogue(professor, profile) {
  const levelText = profile.levelLabel;
  const prefix = `${profile.admissionYear}학번, ${levelText}으로 볼게.`;
  const messages = {
    underclassman: {
      graphics: "처음 보는 개념도 괜찮아. 천천히, 보이는 것부터 잡아보자.",
      database: "좋아! 기초부터 같이 뛰면 돼. 질문하는 것부터 이미 좋은 출발이야!",
      os: "아직 모르는 게 자연스러운 시기야. 내가 순서대로 잡아줄게.",
      algorithm: "기초 개념부터 차근차근 보자. Big-O가 겁줘도 실제론 친절한 표기야. 대체로."
    },
    upperclassman: {
      graphics: "이제는 네가 어디까지 알고 있는지부터 보자. 필요한 부분만 정확히 짚을게.",
      database: "좋아, 이제 기본기는 어느 정도 있다고 보고 갈게! 막히는 지점부터 말해줘.",
      os: "고학년이면 조금 더 빠르게 갈게. 그래도 헷갈리는 부분은 내가 바로 잡아줄 거야.",
      algorithm: "기본기는 있다고 보고, 풀이 전략과 복잡도부터 보자. 물론 허세는 금지입니다."
    },
    graduationEmergency: {
      graphics: "졸업 비상 모드네. 겁주려는 건 아니고, 필요한 것부터 선명하게 정리하자.",
      database: "좋아, 비상 루틴 들어가자! 졸업에 필요한 부분부터 우선순위 잡아줄게.",
      os: "잠깐, 졸업 쪽도 같이 봐야겠는데. 그래도 지금 질문부터 확실히 처리하자.",
      algorithm: "졸업 비상이라면 완전탐색할 시간이 없겠네요. 필요한 알고리즘부터 최단 경로로 갑시다."
    }
  };

  return `${prefix} ${messages[profile.level]?.[currentProfessorKey] || messages[profile.level].database}`;
}

function resizeFocusInput() {
  elements.focusChatInput.style.height = "auto";
  elements.focusChatInput.style.height = `${Math.min(elements.focusChatInput.scrollHeight, 140)}px`;
}

async function sendMessage(question, submitButton) {
  const professor = PROFESSORS[currentProfessorKey];
  const originalButtonText = submitButton.textContent;
  const requestId = activeRequestId + 1;
  activeRequestId = requestId;
  clearUnderstandingCheck();
  resetUnderstandingExpression();
  setProfessorGif("idle");
  ensureLessonSession();
  recordQuestionStats();
  increaseRoyalProgress(1);
  checkAchievements();
  updateStats();
  recordLessonMessage("student", question);
  appendChatMessage("student", question);
  appendChatMessage("professor", "답변을 정리하는 중입니다...", true);
  setProfessorVisualExpression("thinking");
  submitButton.textContent = "답변 중...";
  submitButton.disabled = true;

  try {
    const answer = await askProfessor({
      professorKey: currentProfessorKey,
      professor,
      question,
      studentProfile,
      questionMode: currentQuestionMode,
      mockMode: isMockAnswerMode
    });
    if (requestId !== activeRequestId) {
      return;
    }
    const professorMessage = replacePendingProfessorMessage(answer);
    recordLessonMessage("professor", answer);
    setDialogueText(answer);
    resetIdleLineTimer();
    setProfessorVisualExpression("happy");
    showUnderstandingCheck(professorMessage);
    playProfessorVoice(currentProfessorKey);
  } catch (error) {
    if (requestId !== activeRequestId) {
      return;
    }
    console.warn("Question handling failed:", error);
    const fallbackMessage = "아직 교수님 연구실 서버가 열리지 않았습니다. mock 답변을 표시합니다.";
    replacePendingProfessorMessage(fallbackMessage);
    recordLessonMessage("professor", fallbackMessage);
    setDialogueText(fallbackMessage);
    setProfessorVisualExpression("idle");
  } finally {
    if (requestId !== activeRequestId) {
      return;
    }
    submitButton.textContent = originalButtonText;
    submitButton.disabled = false;
    elements.focusChatInput.focus();
  }
}

function recordQuestionStats() {
  studyStats.totalQuestions += 1;
  studyStats.subjectQuestions[currentProfessorKey] = (studyStats.subjectQuestions[currentProfessorKey] || 0) + 1;
  saveStudyStats(studyStats);
}

function setProfessorVisualExpression(expression) {
  const expressions = ["idle", "thinking", "happy", "troubled"];
  const nextExpression = expressions.includes(expression) ? expression : "idle";
  window.ProfessorStudyStore?.setProfessorExpression?.(nextExpression);
  const targets = [
    document.querySelector(".character-placeholder"),
    elements.focusMode.querySelector(".focus-professor-sprite")
  ];

  targets.forEach((target) => {
    if (!target) {
      return;
    }

    expressions.forEach((name) => target.classList.remove(`expression-${name}`));
    target.classList.add(`expression-${nextExpression}`);
  });

  clearTimeout(expressionResetTimer);
  if (nextExpression === "happy") {
    expressionResetTimer = setTimeout(() => setProfessorVisualExpression("idle"), 1500);
  }
}

function showUnderstandingCheck(messageElement) {
  const host = elements.focusUnderstandingCheckHost;

  if (!messageElement || !elements.focusChatMessages.contains(messageElement) || !host) {
    return;
  }

  host.innerHTML = "";

  const check = document.createElement("div");
  check.className = "understanding-check";
  check.dataset.sequence = String(++understandingCheckSequence);

  const label = document.createElement("span");
  label.textContent = "이해하셨습니까?";

  const yesButton = document.createElement("button");
  yesButton.type = "button";
  yesButton.textContent = "예";
  yesButton.addEventListener("click", () => handleUnderstandingCheck(true, check));

  const noButton = document.createElement("button");
  noButton.type = "button";
  noButton.textContent = "아니오";
  noButton.addEventListener("click", () => handleUnderstandingCheck(false, check));

  check.append(label, yesButton, noButton);
  host.appendChild(check);
  scrollFocusChatToBottom();
}

function handleUnderstandingCheck(understood, checkElement) {
  if (!checkElement || !elements.focusUnderstandingCheckHost?.contains(checkElement)) {
    return;
  }

  checkElement.remove();
  const professor = PROFESSORS[currentProfessorKey];
  const line = professor.understandingCheck?.[understood ? "yes" : "no"]
    || (understood ? "좋습니다. 다음으로 넘어가도 되겠군요." : "괜찮습니다. 어느 부분이 어려웠는지 다시 말해주세요.");
  const expression = understood ? "happy" : "troubled";
  const gifState = understood ? "smile" : "troubled";

  setProfessorGif(gifState);
  setProfessorVisualExpression(expression);
  applyLive2DUnderstandingExpression(expression, understood);
  appendChatMessage("professor", line);
  recordLessonMessage("professor", line);
  setDialogueText(line);
}

function clearUnderstandingCheck() {
  understandingCheckSequence += 1;
  document.querySelectorAll(".understanding-check").forEach((check) => check.remove());
  if (elements.focusUnderstandingCheckHost) {
    elements.focusUnderstandingCheckHost.innerHTML = "";
  }
}

function applyLive2DUnderstandingExpression(expression, shouldReset) {
  clearTimeout(understandingExpressionResetTimer);
  understandingExpressionResetTimer = null;

  if (typeof window.setProfessorExpression === "function") {
    window.setProfessorExpression(expression);
  }

  if (!shouldReset) {
    return;
  }

  const sequence = understandingCheckSequence;
  understandingExpressionResetTimer = setTimeout(() => {
    if (sequence !== understandingCheckSequence) {
      return;
    }
    resetUnderstandingExpression();
  }, 2500);
}

function resetUnderstandingExpression() {
  understandingCheckSequence += 1;
  clearTimeout(understandingExpressionResetTimer);
  understandingExpressionResetTimer = null;
  if (typeof window.resetProfessorExpression === "function") {
    window.resetProfessorExpression();
  }
  setProfessorVisualExpression("idle");
}

function openFocusMode() {
  tryPlayBgm();
  syncFocusProfessor(PROFESSORS[currentProfessorKey]);
  setProfessorGif("idle");
  ensureLessonSession();
  elements.focusMode.setAttribute("aria-hidden", "false");
  document.body.classList.add("focus-mode-active");
  setMainMode("question");
  setWheelSelection("question");
  pauseIdleLineTimer();
  setActiveScreen("question");
  applyProfessorMode("focus");
  appendQuestionIntroMessage();
  requestAnimationFrame(() => {
    elements.focusChatInput.focus();
  });
}

function closeFocusMode() {
  document.body.classList.remove("focus-mode-active");
  elements.focusMode.setAttribute("aria-hidden", "true");
  setMainMode("lobby");
  setWheelSelection("lobby");
  setActiveScreen("home");
  applyProfessorMode("lobby");
  resumeIdleLineTimer();
}

function openQuestionRoom() {
  openFocusMode();
}

function openFocusRoom() {
  tryPlayBgm();
  syncFocusRoomProfessor(PROFESSORS[currentProfessorKey]);
  setProfessorGif("idle");
  elements.focusRoom.setAttribute("aria-hidden", "false");
  document.body.classList.add("focus-room-active");
  setActiveScreen("focus");
  pauseIdleLineTimer();
  applyProfessorMode("lobby");
}

function closeFocusRoom() {
  elements.focusRoom.setAttribute("aria-hidden", "true");
  document.body.classList.remove("focus-room-active");
  setActiveScreen("home");
  resumeIdleLineTimer();
}

function openRecordRoom() {
  renderRecordRoom();
  elements.recordRoom.setAttribute("aria-hidden", "false");
  document.body.classList.add("record-room-active");
  setActiveScreen("record");
  pauseIdleLineTimer();
}

function closeRecordRoom() {
  elements.recordRoom.setAttribute("aria-hidden", "true");
  document.body.classList.remove("record-room-active");
  setActiveScreen("home");
  resumeIdleLineTimer();
}

function setActiveScreen(screen) {
  currentScreen = screen || "home";
  window.ProfessorScreenManager?.setScreen?.(currentScreen);
}

function requestCloseFocusMode() {
  if (getCurrentLessonQuestionCount() === 0 && currentLessonSession.messages.length === 0) {
    finishFocusModeExit();
    return;
  }

  updateLessonSaveSummary();
  elements.lessonSaveModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("lesson-modal-open");
}

function createEmptyLessonSession() {
  return {
    id: "",
    startedAt: "",
    professorKey: "",
    professorName: "",
    subjectLabel: "",
    messages: [],
    aiAnswers: []
  };
}

function ensureLessonSession() {
  if (currentLessonSession.startedAt) {
    return;
  }

  const professor = PROFESSORS[currentProfessorKey];
  currentLessonSession = {
    ...createEmptyLessonSession(),
    id: `lesson-${Date.now()}`,
    startedAt: new Date().toISOString(),
    professorKey: currentProfessorKey,
    professorName: professor.name,
    subjectLabel: professor.subjectLabel
  };
}

function recordLessonMessage(role, text) {
  currentLessonSession.messages.push({
    id: `message-${Date.now()}-${currentLessonSession.messages.length}`,
    role,
    text,
    createdAt: new Date().toISOString()
  });

  if (role === "professor") {
    currentLessonSession.aiAnswers.push(text);
  }
}

function getCurrentLessonMinutes() {
  if (!currentLessonSession.startedAt) {
    return 0;
  }

  const elapsedMs = Date.now() - new Date(currentLessonSession.startedAt).getTime();
  const elapsedMinutes = Math.ceil(Math.max(elapsedMs, 0) / 60000);
  return currentLessonSession.messages.length > 0 ? Math.max(elapsedMinutes, 1) : elapsedMinutes;
}

function getCurrentLessonQuestionCount() {
  return currentLessonSession.messages.filter((message) => message.role === "student").length;
}

function updateLessonSaveSummary() {
  ensureLessonSession();
  elements.lessonSaveProfessor.textContent = currentLessonSession.professorName;
  elements.lessonSaveSubject.textContent = currentLessonSession.subjectLabel;
  elements.lessonSaveMinutes.textContent = `${getCurrentLessonMinutes()}분`;
  elements.lessonSaveQuestions.textContent = `${getCurrentLessonQuestionCount()}개`;
}

function saveCurrentLessonAndReturn() {
  const lesson = buildCurrentLessonSnapshot();
  addLessonToArchive(lesson);
  studyStats.savedLessons += 1;
  saveStudyStats(studyStats);
  increaseRoyalProgress(10);
  checkAchievements();
  updateStats();
  renderLessonArchive();
  finishFocusModeExit();
}

function discardCurrentLessonAndReturn() {
  finishFocusModeExit();
}

function cancelLessonSave() {
  hideLessonSaveModal();
}

function buildCurrentLessonSnapshot() {
  ensureLessonSession();
  const endedAt = new Date().toISOString();
  const createdAt = currentLessonSession.startedAt || endedAt;
  const sessionId = currentLessonSession.id || `lesson-${Date.now()}`;
  const studyDuration = getCurrentLessonMinutes();
  const questionCount = getCurrentLessonQuestionCount();
  const messages = currentLessonSession.messages.map((message) => ({ ...message }));

  return {
    id: sessionId,
    sessionId,
    title: `${currentLessonSession.subjectLabel} - ${formatLessonDateTime(createdAt)}`,
    createdAt,
    updatedAt: endedAt,
    savedAt: endedAt,
    professorKey: currentLessonSession.professorKey,
    professorName: currentLessonSession.professorName,
    subjectLabel: currentLessonSession.subjectLabel,
    studyDuration,
    questionCount,
    messages,
    professor: {
      key: currentLessonSession.professorKey,
      name: currentLessonSession.professorName
    },
    subject: {
      label: currentLessonSession.subjectLabel
    },
    metrics: {
      studyMinutes: studyDuration,
      questionCount
    },
    aiAnswers: [...currentLessonSession.aiAnswers],
    metadata: {
      titleSource: "temporary",
      schemaVersion: 1
    }
  };
}

function finishFocusModeExit() {
  hideLessonSaveModal();
  resetFocusModeSession();
  closeFocusMode();
}

function hideLessonSaveModal() {
  elements.lessonSaveModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lesson-modal-open");
}

function resetFocusModeSession() {
  activeRequestId += 1;
  clearUnderstandingCheck();
  resetUnderstandingExpression();
  setProfessorGif("idle");
  currentLessonSession = createEmptyLessonSession();
  elements.focusChatMessages.innerHTML = "";
  elements.focusChatMessages.scrollTop = 0;
  elements.focusChatInput.value = "";
  resizeFocusInput();
  elements.focusChatSubmitButton.disabled = false;
  elements.focusChatSubmitButton.textContent = "전송";
  elements.llmSubmitButton.disabled = false;
  elements.llmSubmitButton.textContent = "질문하기";
  updateDialogue("select");
}

function openLessonArchive() {
  renderLessonArchive();
  elements.lessonArchivePanel.setAttribute("aria-hidden", "false");
  document.body.classList.add("lesson-archive-open");
}

function closeLessonArchive() {
  elements.lessonArchivePanel.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lesson-archive-open");
}

function renderLessonArchive() {
  const lessons = loadLessonArchive();
  elements.lessonArchiveList.innerHTML = "";

  if (lessons.length === 0) {
    const empty = document.createElement("p");
    empty.className = "archive-empty";
    empty.textContent = "아직 저장된 수업이 없습니다.";
    elements.lessonArchiveList.appendChild(empty);
    renderLessonArchiveDetail(null);
    return;
  }

  lessons.forEach((lesson) => {
    const card = document.createElement("button");
    card.className = "lesson-card";
    card.type = "button";

    const title = document.createElement("strong");
    title.textContent = lesson.title || `${getLessonSubjectLabel(lesson)} - ${formatLessonDateTime(getLessonSavedAt(lesson))}`;

    const professor = document.createElement("span");
    professor.textContent = getLessonProfessorName(lesson);

    const date = document.createElement("small");
    date.textContent = formatLessonDate(getLessonSavedAt(lesson));

    const meta = document.createElement("em");
    meta.textContent = `${getLessonStudyDuration(lesson)}분 · 질문 ${getLessonQuestionCount(lesson)}개`;

    card.appendChild(title);
    card.appendChild(professor);
    card.appendChild(date);
    card.appendChild(meta);
    card.addEventListener("click", () => renderLessonArchiveDetail(lesson));
    elements.lessonArchiveList.appendChild(card);
  });

  renderLessonArchiveDetail(lessons[0]);
}

function renderLessonArchiveDetail(lesson) {
  elements.lessonArchiveDetail.innerHTML = "";

  if (!lesson) {
    const empty = document.createElement("p");
    empty.className = "archive-empty";
    empty.textContent = "저장된 수업 카드를 선택하면 전체 대화를 다시 볼 수 있습니다.";
    elements.lessonArchiveDetail.appendChild(empty);
    return;
  }

  const heading = document.createElement("header");
  heading.className = "archive-detail-heading";

  const title = document.createElement("h3");
  title.textContent = lesson.title || `${getLessonSubjectLabel(lesson)} - ${formatLessonDateTime(getLessonSavedAt(lesson))}`;

  const meta = document.createElement("p");
  meta.textContent = `${getLessonProfessorName(lesson)} · ${getLessonSubjectLabel(lesson)} · ${getLessonStudyDuration(lesson)}분 · 질문 ${getLessonQuestionCount(lesson)}개`;

  heading.appendChild(title);
  heading.appendChild(meta);
  elements.lessonArchiveDetail.appendChild(heading);

  const messages = document.createElement("div");
  messages.className = "archive-message-list";

  lesson.messages.forEach((message) => {
    const item = document.createElement("article");
    item.className = `archive-message ${message.role}`;

    const speaker = document.createElement("span");
    speaker.textContent = message.role === "student" ? "학생 질문" : "교수 답변";

    const text = document.createElement("p");
    text.textContent = message.text;

    item.appendChild(speaker);
    item.appendChild(text);
    messages.appendChild(item);
  });

  elements.lessonArchiveDetail.appendChild(messages);
}

function getLessonSavedAt(lesson) {
  return lesson.savedAt || lesson.updatedAt || lesson.createdAt || new Date().toISOString();
}

function getLessonProfessorName(lesson) {
  const name = lesson.professorName || lesson.professor?.name || "교수";
  return normalizeProfessorDisplayName(name);
}

function normalizeProfessorDisplayName(name) {
  return LEGACY_PROFESSOR_NAMES[name] || name;
}

function getLessonSubjectLabel(lesson) {
  return lesson.subjectLabel || lesson.subject?.label || "데이터베이스";
}

function getLessonStudyDuration(lesson) {
  return lesson.studyDuration ?? lesson.metrics?.studyMinutes ?? 0;
}

function getLessonQuestionCount(lesson) {
  return lesson.questionCount ?? lesson.metrics?.questionCount ?? 0;
}

function formatLessonDateTime(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatLessonDate(value) {
  return formatLessonDateTime(value).slice(0, 10);
}

function syncFocusProfessor(professor) {
  elements.focusCharacterInitial.textContent = getProfessorFallbackSymbol(professor);
  elements.focusCharacterName.textContent = professor.name;
  elements.focusCharacterSubject.textContent = professor.subjectLabel;
  elements.focusKanjiName.textContent = professor.kanjiName;
  elements.focusKoreanName.textContent = professor.name;
  elements.focusProfessorName.textContent = professor.name;
  elements.focusSubjectChip.textContent = professor.subjectLabel;
  replayFocusNameCutin();
}

function syncFocusRoomProfessor(professor) {
  if (!elements.focusRoom) {
    return;
  }

  elements.focusRoomKanjiName.textContent = professor.kanjiName;
  elements.focusRoomKoreanName.textContent = professor.name;
  elements.focusRoomProfessorName.textContent = professor.name;
  elements.focusRoomSubjectChip.textContent = professor.subjectLabel;
}

function replayFocusNameCutin() {
  if (!elements.focusNameCutin) {
    return;
  }

  elements.focusNameCutin.classList.remove("is-entering");
  void elements.focusNameCutin.offsetWidth;
  elements.focusNameCutin.classList.add("is-entering");
}

function appendChatMessage(role, text, pending = false) {
  const message = document.createElement("article");
  message.classList.add("chat-message", role);
  if (pending) {
    message.classList.add("pending");
  }
  message.dataset.pending = pending ? "true" : "false";

  const speaker = document.createElement("span");
  speaker.classList.add("chat-speaker");
  speaker.textContent = role === "student" ? "Student" : PROFESSORS[currentProfessorKey].name;

  const bubble = document.createElement("p");
  bubble.textContent = text;

  message.appendChild(speaker);
  message.appendChild(bubble);
  elements.focusChatMessages.appendChild(message);
  scrollFocusChatToBottom();
  return message;
}

function appendQuestionIntroMessage() {
  if (!elements.focusChatMessages || elements.focusChatMessages.children.length > 0) {
    return;
  }

  const professor = PROFESSORS[currentProfessorKey];
  const lines = professor.questionIntro || [professor.dialogues?.select || professor.quote];
  const introLine = lines[Math.floor(Math.random() * lines.length)];
  const message = appendChatMessage("professor", introLine);
  message.classList.add("question-intro-message");
  setDialogueText(introLine);
}

function replacePendingProfessorMessage(text) {
  const pendingMessage = elements.focusChatMessages.querySelector(".chat-message.professor.pending");

  if (!pendingMessage) {
    return appendChatMessage("professor", text);
  }

  pendingMessage.classList.remove("pending");
  pendingMessage.dataset.pending = "false";
  pendingMessage.querySelector("p").textContent = text;
  scrollFocusChatToBottom();
  return pendingMessage;
}

function scrollFocusChatToBottom() {
  elements.focusChatMessages.scrollTop = elements.focusChatMessages.scrollHeight;
}

function updateDialogue(type) {
  const professor = PROFESSORS[currentProfessorKey];
  setDialogueText(professor.dialogues[type] || professor.quote);
}

function setDialogueText(text) {
  elements.dialogueText.textContent = text;
  elements.dialogueBubble.classList.remove("dialogue-pop");
  void elements.dialogueBubble.offsetWidth;
  elements.dialogueBubble.classList.add("dialogue-pop");
}

window.setLobbyDialogueText = setDialogueText;

function initializeIdleLineDebugTools() {
  window.__professorIdleDebug = {
    trigger: showIdleProfessorLine,
    reset: resetIdleLineTimer,
    start: startIdleLineTimer,
    pause: pauseIdleLineTimer,
    resume: resumeIdleLineTimer,
    clear: clearIdleLineTimer
  };
}

function canRunIdleLineTimer() {
  if (currentMainMode !== "lobby" || document.body.classList.contains("focus-mode-active")) {
    return false;
  }

  return timer.isRunning && timer.mode === "focus";
}

function startIdleLineTimer(delayMs = PROFESSOR_IDLE_LINE_INTERVAL_MS, isResume = false) {
  clearIdleLineTimer(false);

  if (!canRunIdleLineTimer()) {
    return;
  }

  idleDialogueRemainingMs = Math.max(delayMs, 0);
  idleDialogueStartedAt = Date.now();
  idleDialogueTimerId = setTimeout(() => {
    idleDialogueTimerId = null;
    idleDialogueRemainingMs = PROFESSOR_IDLE_LINE_INTERVAL_MS;
    showIdleProfessorLine();
    startIdleLineTimer(PROFESSOR_IDLE_LINE_INTERVAL_MS);
  }, idleDialogueRemainingMs);

  console.log(isResume ? "[IdleLine] timer resumed" : "[IdleLine] timer started", {
    professorId: currentProfessorKey,
    intervalMs: idleDialogueRemainingMs
  });
}

function pauseIdleLineTimer() {
  if (!idleDialogueTimerId) {
    return;
  }

  const elapsedMs = Date.now() - idleDialogueStartedAt;
  idleDialogueRemainingMs = Math.max(idleDialogueRemainingMs - elapsedMs, 0);
  clearTimeout(idleDialogueTimerId);
  idleDialogueTimerId = null;
  console.log("[IdleLine] timer paused");
}

function resumeIdleLineTimer() {
  if (!canRunIdleLineTimer() || idleDialogueTimerId) {
    return;
  }

  const shouldResumePartialTimer = idleDialogueRemainingMs > 0
    && idleDialogueRemainingMs < PROFESSOR_IDLE_LINE_INTERVAL_MS;
  startIdleLineTimer(idleDialogueRemainingMs || PROFESSOR_IDLE_LINE_INTERVAL_MS, shouldResumePartialTimer);
}

function clearIdleLineTimer(shouldLog = true) {
  if (idleDialogueTimerId) {
    clearTimeout(idleDialogueTimerId);
    idleDialogueTimerId = null;
    if (shouldLog) {
      console.log("[IdleLine] timer cleared");
    }
  }
  idleDialogueStartedAt = 0;
}

function resetIdleLineTimer() {
  idleDialogueRemainingMs = PROFESSOR_IDLE_LINE_INTERVAL_MS;
  clearIdleLineTimer();
  resumeIdleLineTimer();
}

function restartIdleLineTimerForProfessor() {
  idleDialogueRemainingMs = PROFESSOR_IDLE_LINE_INTERVAL_MS;
  clearIdleLineTimer();
  if (canRunIdleLineTimer()) {
    startIdleLineTimer(PROFESSOR_IDLE_LINE_INTERVAL_MS);
  }
}

function showIdleProfessorLine() {
  const lines = getIdleLinesForProfessor(currentProfessorKey);
  if (lines.length === 0) {
    return;
  }

  const previousLine = lastIdleLineByProfessor[currentProfessorKey] || "";
  let nextLine = lines[Math.floor(Math.random() * lines.length)];

  if (lines.length > 1) {
    do {
      nextLine = lines[Math.floor(Math.random() * lines.length)];
    } while (nextLine === previousLine);
  }

  lastIdleLineByProfessor[currentProfessorKey] = nextLine;
  setDialogueText(nextLine);
  console.log("[IdleLine] tick", {
    professorId: currentProfessorKey,
    previousLine,
    nextLine
  });
}

function getIdleLinesForProfessor(professorKey) {
  const idleLines = typeof PROFESSOR_IDLE_LINES !== "undefined" ? PROFESSOR_IDLE_LINES : {};
  return idleLines[professorKey] || idleLines.database || [];
}

function updateTimerDisplay(seconds) {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60).toString().padStart(2, "0");
  const restSeconds = (safeSeconds % 60).toString().padStart(2, "0");
  const displayText = `${minutes}:${restSeconds}`;
  elements.timerDisplay.textContent = displayText;
  if (elements.focusRoomTimerDisplay) {
    elements.focusRoomTimerDisplay.textContent = displayText;
  }
}

function updateModeText(mode) {
  const isFocus = mode === "focus";
  const title = isFocus ? "집중 시간" : getBreakTitle();
  const toggleText = isFocus ? "쉬는 시간" : "집중으로";
  elements.timerTitle.textContent = title;
  elements.modeToggleButton.textContent = toggleText;
  if (elements.focusRoomTimerTitle) {
    elements.focusRoomTimerTitle.textContent = title;
  }
  if (elements.focusRoomModeToggleButton) {
    elements.focusRoomModeToggleButton.textContent = toggleText;
  }
}

function getBreakTitle() {
  const nextBreakSeconds = timer.getModeSeconds();
  return nextBreakSeconds === TIMER_SETTINGS.longBreakMinutes * 60 ? "긴 휴식" : "휴식 시간";
}

function updateStats() {
  elements.todaySessions.textContent = studyState.todaySessions;
  elements.todayMinutes.textContent = formatMinutes(studyState.todayStudyMinutes);
  elements.totalMinutes.textContent = formatMinutes(studyState.totalStudyMinutes);
  elements.topTotalStudyTime.textContent = formatCompactTime(studyState.totalStudyMinutes);
  if (elements.totalStudyMinutesStat) {
    elements.totalStudyMinutesStat.textContent = formatMinutes(studyState.totalStudyMinutes);
  }
  if (elements.totalQuestionCount) {
    elements.totalQuestionCount.textContent = studyStats.totalQuestions;
  }
  renderSubjectQuestionStats();
  renderRecordRoom();
  updateRoyalProgress();
}

function renderRecordRoom() {
  if (!elements.recordRoom) {
    return;
  }

  if (elements.recordTodayMinutes) {
    elements.recordTodayMinutes.textContent = formatMinutes(studyState.todayStudyMinutes);
  }
  if (elements.recordTodaySessions) {
    elements.recordTodaySessions.textContent = studyState.todaySessions;
  }
  if (elements.recordTotalQuestions) {
    elements.recordTotalQuestions.textContent = studyStats.totalQuestions;
  }
  if (elements.recordRoyalProgress) {
    elements.recordRoyalProgress.textContent = `${Math.round(gameProgress.royalProgressPercent)}%`;
  }
}

function renderSubjectQuestionStats() {
  if (!elements.subjectQuestionStats) {
    return;
  }

  elements.subjectQuestionStats.innerHTML = "";
  SUBJECTS.forEach((subject) => {
    const row = document.createElement("div");
    const label = document.createElement("span");
    const value = document.createElement("strong");

    label.textContent = subject.label;
    value.textContent = studyStats.subjectQuestions[subject.key] || 0;

    row.appendChild(label);
    row.appendChild(value);
    elements.subjectQuestionStats.appendChild(row);
  });
}

function formatMinutes(minutes) {
  if (minutes < 60) {
    return `${minutes}분`;
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}시간` : `${hours}시간 ${rest}분`;
}

function formatCompactTime(minutes) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours === 0 ? `${rest}m` : `${hours}h ${rest}m`;
}

function updateRoyalProgress() {
  const unlocked = gameProgress.royalProgressPercent >= 100;
  const targetProgress = gameProgress.royalProgressPercent;
  animateRoyalProgress(displayedRoyalProgress, targetProgress);
  elements.royalProgressText.classList.toggle("unlocked", unlocked);
}

function increaseRoyalProgress(amount) {
  const wasUnlocked = gameProgress.royalProgressPercent >= 100;
  gameProgress = addRoyalProgress(gameProgress, amount);
  updateRoyalProgress();
  updateRoyalMode(!wasUnlocked && gameProgress.royalProgressPercent >= 100);
}

function animateRoyalProgress(from, to) {
  cancelAnimationFrame(royalProgressAnimationFrame);
  const startTime = performance.now();
  const duration = 520;

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayedRoyalProgress = from + (to - from) * eased;
    renderRoyalProgress(displayedRoyalProgress);

    if (progress < 1) {
      royalProgressAnimationFrame = requestAnimationFrame(step);
      return;
    }

    displayedRoyalProgress = to;
    renderRoyalProgress(to);
  }

  royalProgressAnimationFrame = requestAnimationFrame(step);
}

function renderRoyalProgress(value) {
  const progressPercent = Math.round(Math.min(Math.max(value, 0), 100));
  const unlocked = progressPercent >= 100;
  elements.royalProgressFill.style.width = `${progressPercent}%`;
  elements.royalProgressText.textContent = unlocked ? "100% Royal Mode" : `${progressPercent}%`;
  if (elements.recordRoyalProgress) {
    elements.recordRoyalProgress.textContent = `${progressPercent}%`;
  }
}

function updateRoyalMode(showUnlockMessage) {
  const unlocked = studyState.royalUnlocked || gameProgress.royalProgressPercent >= 100;
  document.body.classList.toggle("royal-mode", unlocked);
  elements.royalBadge.classList.toggle("unlocked", unlocked);
  elements.royalBadge.textContent = unlocked ? "Royal Mode" : "Royal Progress";
  updateRoyalProgress();

  if (unlocked && showUnlockMessage) {
    elements.unlockMessage.textContent = "Royal Mode Unlocked";
    setTimeout(() => {
      elements.unlockMessage.textContent = "Royal 교수진이 연구실에 입장했습니다.";
    }, 1800);
  } else if (unlocked) {
    elements.unlockMessage.textContent = "Royal 교수진이 연구실에 입장했습니다.";
  } else {
    const remaining = Math.max(1200 - studyState.totalStudyMinutes, 0);
    elements.unlockMessage.textContent = `Royal까지 ${formatMinutes(remaining)}`;
  }

  applyProfessorMode();
}

function checkAchievements() {
  let unlockedSomething = false;
  let changed = false;

  ACHIEVEMENT_DEFINITIONS.forEach((achievement) => {
    const saved = achievementState[achievement.id] || {
      unlocked: false,
      unlockedAt: ""
    };

    if (!saved.unlocked && isAchievementUnlocked(achievement, studyStats)) {
      achievementState[achievement.id] = {
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
      unlockedSomething = true;
      changed = true;
    } else if (!achievementState[achievement.id]) {
      achievementState[achievement.id] = saved;
      changed = true;
    }
  });

  if (changed) {
    saveAchievements(achievementState);
  }

  if (unlockedSomething) {
    showAchievementToast();
  }

  if (elements.achievementModal?.getAttribute("aria-hidden") === "false") {
    renderAchievements();
  }
}

function openAchievementModal() {
  renderAchievementTabs();
  renderAchievementTypeTabs();
  renderAchievements();
  elements.achievementModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("achievement-modal-open");
}

function closeAchievementModal() {
  elements.achievementModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("achievement-modal-open");
}

function renderAchievements() {
  elements.achievementList.innerHTML = "";

  const achievements = ACHIEVEMENT_DEFINITIONS.filter((achievement) => {
    const subject = achievement.subject || achievement.category || "common";
    const type = achievement.category || "other";
    const subjectMatches = activeAchievementCategory === "all" || subject === activeAchievementCategory;
    const typeMatches = activeAchievementType === "all" || type === activeAchievementType;
    return subjectMatches && typeMatches;
  });

  if (achievements.length === 0) {
    const empty = document.createElement("p");
    empty.className = "achievement-empty";
    empty.textContent = "이 카테고리의 업적은 아직 준비 중입니다.";
    elements.achievementList.appendChild(empty);
    return;
  }

  achievements.forEach((achievement) => {
    const saved = achievementState[achievement.id] || {
      unlocked: false,
      unlockedAt: ""
    };
    const progress = getAchievementProgress(achievement, studyStats);
    const item = document.createElement("article");
    item.className = `achievement-item ${saved.unlocked ? "is-unlocked" : "is-locked"}`;

    const icon = document.createElement("strong");
    icon.textContent = achievement.icon;

    const content = document.createElement("div");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const status = document.createElement("span");
    const progressWrap = document.createElement("div");
    const progressMeta = document.createElement("span");
    const progressTrack = document.createElement("div");
    const progressFill = document.createElement("i");

    title.textContent = achievement.title;
    description.textContent = achievement.description;
    status.textContent = saved.unlocked ? `획득일: ${formatLessonDate(saved.unlockedAt)}` : "미획득";
    progressWrap.className = "achievement-progress";
    progressMeta.textContent = `현재 ${progress.displayCurrent} / ${progress.target}`;
    progressTrack.className = "achievement-progress-track";
    progressFill.style.width = `${progress.percent}%`;
    progressTrack.appendChild(progressFill);
    progressWrap.appendChild(progressMeta);
    progressWrap.appendChild(progressTrack);

    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(progressWrap);
    content.appendChild(status);
    item.appendChild(icon);
    item.appendChild(content);
    elements.achievementList.appendChild(item);
  });
}

function renderAchievementTabs() {
  if (!elements.achievementTabs) {
    return;
  }

  elements.achievementTabs.innerHTML = "";
  ACHIEVEMENT_TAB_DEFINITIONS.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "achievement-tab";
    button.textContent = category.label;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(activeAchievementCategory === category.key));
    button.classList.toggle("is-active", activeAchievementCategory === category.key);
    button.addEventListener("click", () => {
      activeAchievementCategory = category.key;
      renderAchievementTabs();
      renderAchievements();
    });
    elements.achievementTabs.appendChild(button);
  });
}

function renderAchievementTypeTabs() {
  if (!elements.achievementTypeTabs) {
    return;
  }

  elements.achievementTypeTabs.innerHTML = "";
  ACHIEVEMENT_TYPE_TAB_DEFINITIONS.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "achievement-tab achievement-type-tab";
    button.textContent = category.label;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(activeAchievementType === category.key));
    button.classList.toggle("is-active", activeAchievementType === category.key);
    button.addEventListener("click", () => {
      activeAchievementType = category.key;
      renderAchievementTypeTabs();
      renderAchievements();
    });
    elements.achievementTypeTabs.appendChild(button);
  });
}

function isAchievementUnlocked(achievement, stats) {
  if (achievement.condition) {
    const progress = getAchievementProgress(achievement, stats);
    return progress.current >= progress.target;
  }

  return Boolean(achievement.isUnlocked?.(stats));
}

function getAchievementProgress(achievement, stats) {
  const condition = achievement.condition || {};
  const target = Math.max(Number(condition.value) || 1, 1);
  const current = getAchievementCurrentValue(condition, stats);

  return {
    current,
    displayCurrent: Math.min(current, target),
    target,
    percent: Math.min(Math.round((current / target) * 100), 100)
  };
}

function getAchievementCurrentValue(condition, stats) {
  const subject = condition.subject;
  const readers = {
    totalQuestionCount: () => stats.totalQuestions || 0,
    totalFocusSessionCount: () => stats.focusCompletions || 0,
    savedLessonCount: () => stats.savedLessons || 0,
    subjectQuestionCount: () => stats.subjectQuestions?.[subject] || 0,
    subjectSessionCount: () => stats.subjectSessions?.[subject] || 0
  };

  return readers[condition.type]?.() || 0;
}

function showAchievementToast() {
  clearTimeout(achievementToastTimer);
  elements.achievementToast.classList.add("show");
  elements.achievementToast.setAttribute("aria-hidden", "false");

  achievementToastTimer = setTimeout(() => {
    elements.achievementToast.classList.remove("show");
    elements.achievementToast.setAttribute("aria-hidden", "true");
  }, 3000);
}

function setProfessorActive(active) {
  elements.professorCard.classList.toggle("is-active", active);
}

function updateButtons() {
  elements.startButton.disabled = timer.isRunning;
  elements.pauseButton.disabled = !timer.isRunning;
  if (elements.focusRoomStartButton) {
    elements.focusRoomStartButton.disabled = timer.isRunning;
  }
  if (elements.focusRoomPauseButton) {
    elements.focusRoomPauseButton.disabled = !timer.isRunning;
  }
}

function showSuccessEffect() {
  elements.successEffect.classList.remove("show");
  void elements.successEffect.offsetWidth;
  elements.successEffect.classList.add("show");
}

// TODO: AI 교수 챗봇 기능은 MVP 이후 연결합니다.
// TODO: BGM 기능은 설정 화면과 함께 MVP 이후 추가합니다.

initializeApp();
