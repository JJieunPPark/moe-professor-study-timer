(function () {
  const SCREEN_CLASS_MAP = {
    home: "screen-home",
    question: "screen-question",
    focus: "screen-focus",
    record: "screen-record"
  };

  function setScreen(screen) {
    Object.values(SCREEN_CLASS_MAP).forEach((className) => document.body.classList.remove(className));
    document.body.classList.add(SCREEN_CLASS_MAP[screen] || SCREEN_CLASS_MAP.home);
    window.ProfessorStudyStore?.setScreen?.(screen);
  }

  window.ProfessorScreenManager = {
    setScreen
  };
})();
