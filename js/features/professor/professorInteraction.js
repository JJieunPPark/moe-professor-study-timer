(function () {
  const clickStateByProfessor = new Map();
  const RAPID_TOUCH_WINDOW_MS = 1300;
  const TOUCH_REACTION_RESET_MS = 3200;
  let touchReactionResetTimer = null;

  function initializeProfessorInteraction(options = {}) {
    const target = options.target || document.getElementById("professorGifStage");
    if (!target || target.dataset.professorInteractionReady === "true") {
      return;
    }

    target.dataset.professorInteractionReady = "true";
    target.setAttribute("role", "button");
    target.setAttribute("tabindex", "0");
    target.setAttribute("aria-label", "교수 캐릭터와 상호작용");
    target.addEventListener("click", handleProfessorTouch);
    target.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      handleProfessorTouch(event);
    });
  }

  function handleProfessorTouch(event) {
    const touchTarget = document.getElementById("professorGifStage");
    window.TouchDistortionRenderer?.play?.(touchTarget, event);
    window.TouchEffect?.play?.(touchTarget, event);

    const professorKey = window.currentProfessorKey || "database";
    const professor = window.PROFESSORS?.[professorKey];
    if (!professor) {
      return;
    }

    const interaction = chooseTouchInteraction(professorKey, professor);
    if (!interaction) {
      return;
    }

    if (interaction.text && typeof window.setLobbyDialogueText === "function") {
      window.setLobbyDialogueText(interaction.text);
    }

    if (interaction.expression && typeof window.setProfessorGif === "function") {
      window.setProfessorGif(interaction.expression);
      clearTimeout(touchReactionResetTimer);
      touchReactionResetTimer = setTimeout(() => {
        if ((window.currentProfessorKey || "database") === professorKey) {
          window.setProfessorGif("idle");
        }
      }, TOUCH_REACTION_RESET_MS);
    }

    if (typeof window.playProfessorVoice === "function") {
      window.playProfessorVoice(professorKey, interaction.voiceEvent || interaction.id);
    }
  }

  function chooseTouchInteraction(professorKey, professor) {
    const now = Date.now();
    const state = clickStateByProfessor.get(professorKey) || { count: 0, lastAt: 0 };
    state.count = now - state.lastAt <= RAPID_TOUCH_WINDOW_MS ? state.count + 1 : 1;
    state.lastAt = now;
    clickStateByProfessor.set(professorKey, state);

    const eventType = state.count >= 5 ? "rapidTouch" : "touch";
    const interactions = professor.interactions?.[eventType] || professor.touch || professor.interactions?.touch || [];
    if (interactions.length === 0) {
      return null;
    }

    return interactions[Math.floor(Math.random() * interactions.length)];
  }

  window.ProfessorInteractionController = {
    initialize: initializeProfessorInteraction
  };
})();
