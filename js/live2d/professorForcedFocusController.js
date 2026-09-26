(function initializeProfessorForcedFocusController(global) {
  const INACTIVITY_MS = 300000;
  let configuration = null;
  let inactivityTimer = null;
  let sequenceTimer = null;
  let sequenceResolve = null;
  let sequenceId = 0;
  let state = "idle";
  let activatedAt = 0;
  let unsubscribe = null;

  function manipulation() {
    return global.ProfessorUIManipulationController;
  }

  function isContextActive() {
    return Boolean(configuration?.isContextActive?.());
  }

  function isReadyToForce() {
    const controller = manipulation();
    const focusButton = configuration?.getFocusButton?.();
    const manipulationState = controller?.getState?.();
    return Boolean(
      isContextActive()
      && focusButton?.isConnected
      && controller
      && manipulationState
      && !manipulationState.busy
    );
  }

  function clearInactivityTimer() {
    if (inactivityTimer !== null) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  }

  function clearSequenceTimer() {
    if (sequenceTimer !== null) {
      clearTimeout(sequenceTimer);
      sequenceTimer = null;
    }
    if (sequenceResolve) {
      const resolve = sequenceResolve;
      sequenceResolve = null;
      resolve(false);
    }
  }

  function waitFor(duration, expectedSequenceId) {
    clearSequenceTimer();
    return new Promise((resolve) => {
      sequenceResolve = resolve;
      sequenceTimer = setTimeout(() => {
        sequenceTimer = null;
        sequenceResolve = null;
        resolve(sequenceId === expectedSequenceId && state === "forcing");
      }, duration);
    });
  }

  function getInactivityState() {
    return global.ProfessorInactivityController?.getState?.() || {
      lastUserInteractionTime: performance.now(),
      inactiveFor: 0
    };
  }

  function scheduleFromSharedActivity() {
    clearInactivityTimer();
    if (!isContextActive()) {
      state = "idle";
      return false;
    }
    state = "counting";
    const remaining = Math.max(0, INACTIVITY_MS - getInactivityState().inactiveFor);
    inactivityTimer = setTimeout(() => {
      inactivityTimer = null;
      trigger();
    }, remaining);
    return true;
  }

  function cancelSequence({ restart = false, immediate = false } = {}) {
    sequenceId += 1;
    clearSequenceTimer();
    clearInactivityTimer();
    manipulation()?.reset?.({ immediate, duration: immediate ? 0 : 300 });
    state = "idle";
    activatedAt = 0;
    if (restart && isContextActive()) scheduleFromSharedActivity();
    return true;
  }

  function handleUserInteraction() {
    if (!isContextActive()) {
      if (state !== "idle") cancelSequence({ immediate: true });
      return;
    }
    if (state === "forcing") {
      cancelSequence({ restart: true });
      return;
    }
    if (state === "activated") return;
    scheduleFromSharedActivity();
  }

  async function trigger() {
    global.ProfessorProgressPrankController?.stop?.({ immediate: true, rearm: false });
    if (state === "forcing" || state === "activated" || !isReadyToForce()) {
      if (isContextActive() && state !== "forcing" && state !== "activated") scheduleFromSharedActivity();
      return false;
    }

    clearInactivityTimer();
    const controller = manipulation();
    const focusButton = configuration.getFocusButton();
    const currentSequenceId = ++sequenceId;
    state = "forcing";
    configuration?.showDialogue?.("……공부하실 생각이 없어 보이니, 제가 시작하겠습니다.");

    if (!await controller.lookAt(focusButton, { duration: 400 })) return false;
    if (!await waitFor(250, currentSequenceId)) return false;
    if (!isContextActive()) return cancelSequence({ immediate: true }) && false;

    if (!controller.highlight(focusButton)) return cancelSequence() && false;
    if (!await waitFor(350, currentSequenceId)) return false;
    if (!isContextActive()) return cancelSequence({ immediate: true }) && false;

    if (!controller.grab(focusButton)) return cancelSequence() && false;
    if (!await waitFor(600, currentSequenceId)) return false;
    if (!isContextActive()) return cancelSequence({ immediate: true }) && false;

    state = "activated";
    activatedAt = performance.now();
    const activated = controller.activate(focusButton);
    if (!activated) {
      cancelSequence({ restart: true });
      return false;
    }
    return true;
  }

  function sync() {
    if (!isContextActive()) {
      cancelSequence({ immediate: true });
      return false;
    }
    if (state === "forcing" || state === "activated") return true;
    return scheduleFromSharedActivity();
  }

  function configure(options) {
    configuration = options || null;
    if (!unsubscribe) {
      unsubscribe = global.ProfessorInactivityController?.subscribe?.(handleUserInteraction) || null;
      window.addEventListener("pagehide", destroy, { once: true });
      window.addEventListener("professor-opening-finished", sync);
    }
    return sync();
  }

  function destroy() {
    cancelSequence({ immediate: true });
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
      window.removeEventListener("professor-opening-finished", sync);
    }
    configuration = null;
  }

  function resetTimer() {
    cancelSequence({ immediate: true });
    return scheduleFromSharedActivity();
  }

  function getState() {
    const inactivity = getInactivityState();
    return {
      state,
      inactivityMs: INACTIVITY_MS,
      lastInteractionTime: inactivity.lastUserInteractionTime,
      remainingMs: state === "counting"
        ? Math.max(0, INACTIVITY_MS - inactivity.inactiveFor)
        : 0,
      sequenceActive: state === "forcing",
      activatedAt,
      contextActive: isContextActive(),
      manipulationReady: Boolean(manipulation()?.getState?.())
    };
  }

  global.ProfessorForcedFocusController = Object.freeze({
    configure,
    sync,
    trigger,
    resetTimer,
    cancel: cancelSequence,
    getState,
    destroy
  });
})(window);
