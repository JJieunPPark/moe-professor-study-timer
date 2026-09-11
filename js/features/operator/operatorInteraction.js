(function () {
  const operatorState = {
    lastAction: ""
  };

  function play(action = "default") {
    operatorState.lastAction = action;
    const operator = document.getElementById("operatorAssistant");
    if (!operator) {
      return;
    }

    operator.dataset.operatorAction = action;
    operator.classList.remove("is-pulsing");
    void operator.offsetWidth;
    operator.classList.add("is-pulsing");
  }

  window.operatorInteraction = {
    play,
    state: operatorState
  };
})();
