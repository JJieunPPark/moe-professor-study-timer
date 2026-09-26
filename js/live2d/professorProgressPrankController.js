(function initializeProfessorProgressPrankController(global) {
  const THRESHOLD_MS = 10000;
  const ANCHOR = Object.freeze({ x: 0.9, y: 0.85 });
  const MOVES = Object.freeze([
    [-130, 35, 280], [90, -55, 320], [-60, -90, 250], [150, 45, 310],
    [40, 100, 290], [-150, 65, 320], [110, -30, 260], [0, 0, 300]
  ]);
  let configuration = null;
  let state = "idle";
  let armed = true;
  let timer = null;
  let sequenceId = 0;
  let target = null;
  let unsubscribe = null;

  function manipulation() {
    return global.ProfessorUIManipulationController;
  }

  function inactivityState() {
    return global.ProfessorInactivityController?.getState?.() || { lastUserInteractionTime: performance.now(), inactiveFor: 0 };
  }

  function higherPriorityBusy() {
    const forced = global.ProfessorForcedFocusController?.getState?.();
    const breaking = global.ProfessorBreakInterferenceController?.getState?.();
    return forced?.state === "forcing" || forced?.state === "activated" || breaking?.active === true;
  }

  function isVisible(element) {
    if (!element?.isConnected) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0
      && rect.width > 0 && rect.height > 0;
  }

  function isContextActive() {
    return Boolean(configuration?.isContextActive?.());
  }

  function isReady() {
    const element = configuration?.getProgressElement?.();
    const manipulationState = manipulation()?.getState?.();
    return Boolean(isContextActive() && armed && isVisible(element) && manipulationState
      && !manipulationState.busy && !higherPriorityBusy());
  }

  function clearTimer() {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function schedule() {
    clearTimer();
    if (!isContextActive() || !armed || state === "running") return false;
    state = "counting";
    const remaining = Math.max(0, THRESHOLD_MS - inactivityState().inactiveFor);
    timer = setTimeout(() => {
      timer = null;
      trigger();
    }, remaining);
    return true;
  }

  function clampMove(rect, x, y) {
    const padding = 12;
    const bottomBar = document.querySelector(".bottom-command-row")?.getBoundingClientRect?.();
    const bottomLimit = bottomBar?.top || window.innerHeight;
    return {
      x: Math.max(padding - rect.left, Math.min(window.innerWidth - padding - rect.right, x)),
      y: Math.max(padding - rect.top, Math.min(bottomLimit - padding - rect.bottom, y))
    };
  }

  function setNormal() {
    configuration?.setState?.("NORMAL", { duration: 180 });
  }

  function cleanup(options = {}) {
    const wasRunning = state === "running";
    sequenceId += 1;
    clearTimer();
    if (wasRunning || target) {
      manipulation()?.reset?.({ immediate: options.immediate !== false, duration: 240 });
      setNormal();
    }
    target = null;
    state = "idle";
    if (options.rearm === true) armed = true;
    if (options.schedule === true) schedule();
    return true;
  }

  function handleUserInteraction() {
    armed = true;
    cleanup({ immediate: true, rearm: true, schedule: true });
  }

  async function trigger(options = {}) {
    const debug = options.debug === true;
    if (state === "running" || (!debug && inactivityState().inactiveFor < THRESHOLD_MS)) return false;
    if (!isReady()) {
      if (isContextActive() && armed) {
        state = "counting";
        timer = setTimeout(() => { timer = null; trigger(); }, 500);
      }
      return false;
    }

    clearTimer();
    const controller = manipulation();
    const progress = configuration.getProgressElement();
    const originalRect = progress.getBoundingClientRect();
    const currentSequenceId = ++sequenceId;
    state = "running";
    target = progress;
    configuration?.showDialogue?.("……가만히 계시네요.");
    configuration?.setState?.("LAUGH", { duration: 180 });

    if (!await controller.lookAt(progress, { anchorX: ANCHOR.x, anchorY: ANCHOR.y, duration: 360 })) {
      cleanup({ immediate: true });
      return false;
    }
    if (sequenceId !== currentSequenceId || state !== "running") return false;
    controller.highlight(progress);
    controller.grab(progress);
    configuration?.showDialogue?.("그럼 이건 제가 좀 빌리겠습니다.");

    for (const [rawX, rawY, duration] of MOVES) {
      if (sequenceId !== currentSequenceId || state !== "running" || !isContextActive() || higherPriorityBusy()) {
        cleanup({ immediate: true });
        return false;
      }
      const move = clampMove(originalRect, rawX, rawY);
      const movePromise = controller.move(progress, { translateX: move.x, translateY: move.y, duration });
      controller.track(progress, { anchorX: ANCHOR.x, anchorY: ANCHOR.y, duration });
      if (!await movePromise) return false;
    }

    if (sequenceId !== currentSequenceId || state !== "running") return false;
    await controller.release(progress, { duration: 260, resetDuration: 220 });
    if (sequenceId !== currentSequenceId) return false;
    target = null;
    setNormal();
    configuration?.showDialogue?.("잘 따라오네요. 꽤 귀엽습니다.");
    armed = false;
    state = "completed";
    return true;
  }

  function sync() {
    if (!isContextActive()) {
      cleanup({ immediate: true, rearm: false });
      return false;
    }
    if (state === "running") return true;
    if (state === "completed" && !armed) return true;
    return schedule();
  }

  function configure(options) {
    configuration = options || null;
    if (!unsubscribe) unsubscribe = global.ProfessorInactivityController?.subscribe?.(handleUserInteraction) || null;
    window.addEventListener("pagehide", destroy, { once: true });
    return sync();
  }

  function stop(options = {}) {
    return cleanup({ immediate: options.immediate !== false, rearm: options.rearm === true, schedule: false });
  }

  function destroy() {
    cleanup({ immediate: true, rearm: false });
    unsubscribe?.();
    unsubscribe = null;
    configuration = null;
  }

  function getState() {
    return {
      state,
      armed,
      thresholdMs: THRESHOLD_MS,
      inactiveFor: inactivityState().inactiveFor,
      targetConnected: Boolean(target?.isConnected),
      anchorX: ANCHOR.x,
      anchorY: ANCHOR.y
    };
  }

  global.ProfessorProgressPrankController = Object.freeze({ configure, sync, trigger, stop, getState, destroy });
})(window);
