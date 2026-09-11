(function () {
  const initialState = {
    currentProfessor: "database",
    currentScreen: "home",
    professorExpression: "idle",
    questionMode: "general"
  };

  const listeners = new Map();
  let state = { ...initialState };

  function getState() {
    return { ...state };
  }

  function setState(patch, eventName = "stateChanged") {
    const previous = state;
    state = { ...state, ...patch };
    emit(eventName, { state: getState(), previous });
  }

  function on(eventName, callback) {
    const currentListeners = listeners.get(eventName) || new Set();
    currentListeners.add(callback);
    listeners.set(eventName, currentListeners);
    return () => currentListeners.delete(callback);
  }

  function emit(eventName, payload) {
    (listeners.get(eventName) || []).forEach((callback) => callback(payload));
  }

  function setProfessor(professorKey) {
    if (state.currentProfessor === professorKey) {
      return;
    }
    setState({ currentProfessor: professorKey }, "professorChanged");
  }

  function setScreen(screen) {
    if (state.currentScreen === screen) {
      return;
    }
    setState({ currentScreen: screen }, "screenChanged");
  }

  function setProfessorExpression(expression) {
    setState({ professorExpression: expression }, "professorExpressionChanged");
  }

  function setQuestionMode(questionMode) {
    setState({ questionMode }, "questionModeChanged");
  }

  window.ProfessorStudyStore = {
    getState,
    setState,
    setProfessor,
    setScreen,
    setProfessorExpression,
    setQuestionMode,
    on
  };
})();
