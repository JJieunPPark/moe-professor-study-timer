(function initializeProfessorBreakInterferenceController(global) {
  const DETECTION_PADDING = 42;
  const ABANDON_GRACE_MS = 650;
  const COOLDOWN_MS = 700;
  const CLONE_GRAB_ANCHOR = Object.freeze({ x: 0.88, y: 0.5 });
  let configuration = null;
  let state = "idle";
  let clone = null;
  let sourceRect = null;
  let breakRect = null;
  let pointerInsideZone = false;
  let operationId = 0;
  let sequenceTimer = null;
  let sequenceResolve = null;
  let abandonTimer = null;
  let cooldownTimer = null;
  let cooldownUntil = 0;
  let lastPointer = { x: 0, y: 0 };
  let listenersAttached = false;

  function manipulation() {
    return global.ProfessorUIManipulationController;
  }

  function forcedFocusBusy() {
    const forcedState = global.ProfessorForcedFocusController?.getState?.();
    return forcedState?.state === "forcing" || forcedState?.state === "activated";
  }

  function isVisible(element) {
    if (!element?.isConnected) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none"
      && style.visibility !== "hidden"
      && Number(style.opacity) > 0
      && rect.width > 0
      && rect.height > 0;
  }

  function isVisibleAndEnabled(element) {
    return isVisible(element)
      && !element.disabled
      && element.getAttribute("aria-disabled") !== "true";
  }

  function isBaseContextActive() {
    return Boolean(configuration?.isBaseContextActive?.() && manipulation()?.getState?.());
  }

  function isProductionEligible() {
    const breakButton = configuration?.getBreakButton?.();
    const sourceButton = configuration?.getSourceButton?.();
    const manipulationState = manipulation()?.getState?.();
    return Boolean(
      isBaseContextActive()
      && configuration?.isTimerEligible?.()
      && isVisibleAndEnabled(breakButton)
      && isVisible(sourceButton)
      && !forcedFocusBusy()
      && manipulationState
      && !manipulationState.busy
      && state === "idle"
      && performance.now() >= cooldownUntil
    );
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

  function clearAbandonTimer() {
    if (abandonTimer !== null) {
      clearTimeout(abandonTimer);
      abandonTimer = null;
    }
  }

  function clearCooldownTimer() {
    if (cooldownTimer !== null) {
      clearTimeout(cooldownTimer);
      cooldownTimer = null;
    }
  }

  function waitFor(duration, expectedOperationId) {
    clearSequenceTimer();
    return new Promise((resolve) => {
      sequenceResolve = resolve;
      sequenceTimer = setTimeout(() => {
        sequenceTimer = null;
        sequenceResolve = null;
        resolve(operationId === expectedOperationId && (state === "arming" || state === "blocking"));
      }, duration);
    });
  }

  function detectionZone(rect) {
    return {
      left: rect.left - DETECTION_PADDING,
      right: rect.right + DETECTION_PADDING,
      top: rect.top - DETECTION_PADDING,
      bottom: rect.bottom + DETECTION_PADDING
    };
  }

  function containsPoint(zone, x, y) {
    return x >= zone.left && x <= zone.right && y >= zone.top && y <= zone.bottom;
  }

  function createClone(sourceButton) {
    const rect = sourceButton.getBoundingClientRect();
    const visualClone = sourceButton.cloneNode(true);
    visualClone.removeAttribute("id");
    visualClone.disabled = false;
    visualClone.tabIndex = -1;
    visualClone.setAttribute("aria-hidden", "true");
    visualClone.classList.add("professor-break-blocker-clone");
    Object.assign(visualClone.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      zIndex: "80"
    });
    visualClone.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    document.body.appendChild(visualClone);
    return { element: visualClone, rect };
  }

  function updateCloneFollow(screenX, screenY) {
    if (!clone || state !== "blocking" || !sourceRect || !breakRect) return;
    const desiredLeft = screenX + sourceRect.width * 0.12;
    const desiredTop = screenY + sourceRect.height * 0.05;
    const minLeft = breakRect.left - sourceRect.width * 0.75;
    const maxLeft = breakRect.right + 8;
    const minTop = breakRect.top - sourceRect.height * 0.75;
    const maxTop = breakRect.bottom + 8;
    const left = Math.max(minLeft, Math.min(maxLeft, desiredLeft));
    const top = Math.max(minTop, Math.min(maxTop, desiredTop));
    const translateX = left - sourceRect.left;
    const translateY = top - sourceRect.top;
    clone.style.setProperty("transition", "transform 145ms cubic-bezier(.22,.82,.24,1), box-shadow 160ms ease", "important");
    clone.style.setProperty("transform", `translate(${translateX}px, ${translateY}px) scale(1.035)`, "important");
    manipulation().track(clone, {
      anchorX: CLONE_GRAB_ANCHOR.x,
      anchorY: CLONE_GRAB_ANCHOR.y,
      duration: 145
    });
  }

  function removeClone() {
    clone?.remove?.();
    clone = null;
    sourceRect = null;
    breakRect = null;
  }

  function cleanup(options = {}) {
    operationId += 1;
    clearSequenceTimer();
    clearAbandonTimer();
    clearCooldownTimer();
    manipulation()?.reset?.({ immediate: options.immediate === true, duration: options.immediate ? 0 : 260 });
    removeClone();
    state = options.cooldown === false ? "idle" : "cooldown";
    cooldownUntil = options.cooldown === false ? 0 : performance.now() + COOLDOWN_MS;
    pointerInsideZone = false;
    if (state === "cooldown") {
      cooldownTimer = setTimeout(() => {
        cooldownTimer = null;
        if (state === "cooldown" && performance.now() >= cooldownUntil) state = "idle";
      }, COOLDOWN_MS);
    }
    return true;
  }

  function completeBreakSuccess() {
    if (state !== "arming" && state !== "blocking") return false;
    cleanup({ immediate: true });
    configuration?.showSuccessDialogue?.("……당했네요.");
    return true;
  }

  async function trigger(options = {}) {
    const debug = options.debug === true;
    if (state !== "idle" || performance.now() < cooldownUntil) return false;
    if (debug ? !isBaseContextActive() : !isProductionEligible()) return false;
    if (forcedFocusBusy()) return false;
    global.ProfessorProgressPrankController?.stop?.({ immediate: true, rearm: false });

    const breakButton = configuration.getBreakButton();
    const sourceButton = configuration.getSourceButton();
    if (!isVisibleAndEnabled(breakButton) || !isVisible(sourceButton)) return false;

    const expectedOperationId = ++operationId;
    state = "arming";
    breakRect = breakButton.getBoundingClientRect();
    if (!await manipulation().lookAt(breakButton, { duration: 300 })) return false;
    if (!await waitFor(140, expectedOperationId)) return false;

    const created = createClone(sourceButton);
    clone = created.element;
    sourceRect = created.rect;
    manipulation().track(clone, {
      anchorX: CLONE_GRAB_ANCHOR.x,
      anchorY: CLONE_GRAB_ANCHOR.y,
      duration: 260
    });
    manipulation().highlight(clone);
    manipulation().grab(clone);
    if (!await waitFor(190, expectedOperationId)) return false;

    breakRect = breakButton.getBoundingClientRect();
    const targetLeft = breakRect.left + (breakRect.width - sourceRect.width) / 2;
    const targetTop = breakRect.top + (breakRect.height - sourceRect.height) / 2;
    const movePromise = manipulation().move(clone, {
      translateX: targetLeft - sourceRect.left,
      translateY: targetTop - sourceRect.top,
      duration: 380
    });
    manipulation().track(clone, {
      anchorX: CLONE_GRAB_ANCHOR.x,
      anchorY: CLONE_GRAB_ANCHOR.y,
      duration: 380
    });
    await movePromise;
    if (operationId !== expectedOperationId || state !== "arming") return false;
    state = "blocking";
    updateCloneFollow(lastPointer.x, lastPointer.y);
    return true;
  }

  function scheduleAbandon() {
    if (abandonTimer !== null) return;
    abandonTimer = setTimeout(() => {
      abandonTimer = null;
      if (!pointerInsideZone && (state === "arming" || state === "blocking")) cleanup();
    }, ABANDON_GRACE_MS);
  }

  function handlePointerMove(event) {
    lastPointer = { x: event.clientX, y: event.clientY };
    const breakButton = configuration?.getBreakButton?.();

    if ((state === "arming" || state === "blocking") && !isBaseContextActive()) {
      cleanup({ immediate: true, cooldown: false });
      return;
    }
    if (!breakButton || !isVisibleAndEnabled(breakButton)) {
      if (state === "arming" || state === "blocking") cleanup({ immediate: true });
      return;
    }

    const rect = breakButton.getBoundingClientRect();
    const inside = containsPoint(detectionZone(rect), event.clientX, event.clientY);
    const entered = inside && !pointerInsideZone;
    pointerInsideZone = inside;

    if (inside) {
      clearAbandonTimer();
      if (state === "blocking") updateCloneFollow(event.clientX, event.clientY);
      else if (entered && isProductionEligible()) trigger();
    } else if (state === "arming" || state === "blocking") {
      scheduleAbandon();
    }
  }

  function sync() {
    if ((state === "arming" || state === "blocking") && configuration?.didBreakSucceed?.()) {
      return completeBreakSuccess();
    }
    if ((state === "arming" || state === "blocking") && !isProductionEligibleDuringSequence()) {
      return cleanup({ immediate: true, cooldown: false });
    }
    return true;
  }

  function isProductionEligibleDuringSequence() {
    return Boolean(
      isBaseContextActive()
      && configuration?.isTimerEligible?.()
      && isVisibleAndEnabled(configuration?.getBreakButton?.())
      && !forcedFocusBusy()
    );
  }

  function configure(options) {
    configuration = options || null;
    if (!listenersAttached) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
      window.addEventListener("pagehide", destroy, { once: true });
      listenersAttached = true;
    }
    return sync();
  }

  function stop() {
    return cleanup({ immediate: true, cooldown: false });
  }

  function destroy() {
    cleanup({ immediate: true, cooldown: false });
    if (listenersAttached) {
      window.removeEventListener("pointermove", handlePointerMove, { capture: true });
      listenersAttached = false;
    }
    configuration = null;
  }

  function getState() {
    return {
      state,
      active: state === "arming" || state === "blocking",
      pointerInsideZone,
      cloneConnected: Boolean(clone?.isConnected),
      detectionPadding: DETECTION_PADDING,
      abandonGraceMs: ABANDON_GRACE_MS,
      cooldownRemainingMs: Math.max(0, cooldownUntil - performance.now()),
      sourceRect: sourceRect && { left: sourceRect.left, top: sourceRect.top, width: sourceRect.width, height: sourceRect.height },
      breakRect: breakRect && { left: breakRect.left, top: breakRect.top, width: breakRect.width, height: breakRect.height }
    };
  }

  global.ProfessorBreakInterferenceController = Object.freeze({
    configure,
    trigger,
    stop,
    sync,
    getState,
    destroy
  });
})(window);
