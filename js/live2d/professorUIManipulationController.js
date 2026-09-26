(function initializeProfessorUIManipulationController(global) {
  const DEFAULT_LOOK_DURATION = 420;
  const DEFAULT_RESET_DURATION = 340;
  const DEFAULT_MOVE_DURATION = 500;
  const DEFAULT_SAFE_RATIO = 0.8;
  const controllers = new WeakMap();
  let activeController = null;

  function resolveParameterRange(core, parameterId) {
    const count = Number(core?.getParameterCount?.()) || 0;
    for (let index = 0; index < count; index += 1) {
      if (core.getParameterId?.(index)?.getString?.()?.s !== parameterId) continue;
      const minimum = Number(core.getParameterMinimumValue?.(index));
      const maximum = Number(core.getParameterMaximumValue?.(index));
      return {
        minimum: Number.isFinite(minimum) ? minimum : -1,
        maximum: Number.isFinite(maximum) ? maximum : 1
      };
    }
    return { minimum: -1, maximum: 1 };
  }

  function attach(instance, professorKey) {
    if (!instance || instance.id !== "lobby" || professorKey !== "algorithm") return null;
    detach(instance);
    const core = instance.model?.internalModel?.coreModel;
    const controller = {
      instance,
      professorKey,
      cursorRange: {
        x: resolveParameterRange(core, "cursorX"),
        y: resolveParameterRange(core, "cursorY")
      },
      safeRatio: DEFAULT_SAFE_RATIO,
      state: "idle",
      target: null,
      snapshot: null,
      operationId: 0,
      waitTimer: null,
      waitResolve: null,
      lastMapping: null
    };
    controllers.set(instance, controller);
    activeController = controller;
    return controller;
  }

  function detach(instance) {
    const controller = controllers.get(instance);
    if (!controller) return;
    resetController(controller, { immediate: true });
    controllers.delete(instance);
    if (activeController === controller) activeController = null;
  }

  function isUsableElement(element) {
    return element instanceof Element && element.isConnected;
  }

  function resolveElement(target) {
    if (typeof target === "string") return document.querySelector(target);
    return isUsableElement(target) ? target : null;
  }

  function getModelScreenBounds(instance) {
    const containerRect = instance.canvas?.getBoundingClientRect?.()
      || instance.target?.container?.getBoundingClientRect?.();
    const model = instance.model;
    const naturalWidth = Number(model?.internalModel?.width) || 1;
    const naturalHeight = Number(model?.internalModel?.height) || 1;
    const scaleX = Number(model?.scale?.x) || 1;
    const scaleY = Number(model?.scale?.y) || scaleX;
    const left = (containerRect?.left || 0) + (Number(model?.position?.x) || 0);
    const top = (containerRect?.top || 0) + (Number(model?.position?.y) || 0);
    const width = naturalWidth * scaleX;
    const height = naturalHeight * scaleY;
    return {
      left,
      top,
      width,
      height,
      centerX: left + width / 2,
      centerY: top + height / 2
    };
  }

  function clampToSafeRange(value, range, safeRatio) {
    const safeMin = Math.min(0, range.minimum * safeRatio);
    const safeMax = Math.max(0, range.maximum * safeRatio);
    return Math.max(safeMin, Math.min(safeMax, value));
  }

  function mapElementToCursor(controller, element, options = {}) {
    const rect = element.getBoundingClientRect();
    const modelBounds = getModelScreenBounds(controller.instance);
    const anchorX = Number.isFinite(options.anchorX) ? Math.max(0, Math.min(1, options.anchorX)) : 0.5;
    const anchorY = Number.isFinite(options.anchorY) ? Math.max(0, Math.min(1, options.anchorY)) : 0.5;
    const targetX = rect.left + rect.width * anchorX;
    const targetY = rect.top + rect.height * anchorY;
    const normalizedX = (targetX - modelBounds.centerX) / Math.max(window.innerWidth / 2, 1);
    const normalizedY = -(targetY - modelBounds.centerY) / Math.max(window.innerHeight / 2, 1);
    const cursorX = clampToSafeRange(normalizedX, controller.cursorRange.x, controller.safeRatio);
    const cursorY = clampToSafeRange(normalizedY, controller.cursorRange.y, controller.safeRatio);
    controller.lastMapping = {
      targetRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
      modelBounds,
      screenX: targetX,
      screenY: targetY,
      anchorX,
      anchorY,
      cursorX,
      cursorY
    };
    return controller.lastMapping;
  }

  function snapshotElement(controller, element) {
    if (controller.target === element && controller.snapshot) return controller.snapshot;
    restoreCurrentTarget(controller, { immediate: true });
    const style = element.style;
    controller.target = element;
    controller.snapshot = {
      transform: style.getPropertyValue("transform"),
      transformPriority: style.getPropertyPriority("transform"),
      transition: style.getPropertyValue("transition"),
      transitionPriority: style.getPropertyPriority("transition"),
      zIndex: style.getPropertyValue("z-index"),
      zIndexPriority: style.getPropertyPriority("z-index"),
      pointerEvents: style.getPropertyValue("pointer-events"),
      pointerEventsPriority: style.getPropertyPriority("pointer-events"),
      computedTransform: getComputedStyle(element).transform
    };
    return controller.snapshot;
  }

  function restoreProperty(style, name, value, priority) {
    if (value) style.setProperty(name, value, priority);
    else style.removeProperty(name);
  }

  function clearWait(controller) {
    if (controller.waitTimer !== null) {
      clearTimeout(controller.waitTimer);
      controller.waitTimer = null;
    }
    if (controller.waitResolve) {
      const resolve = controller.waitResolve;
      controller.waitResolve = null;
      resolve(false);
    }
  }

  function waitFor(controller, duration, operationId) {
    clearWait(controller);
    return new Promise((resolve) => {
      controller.waitResolve = resolve;
      controller.waitTimer = setTimeout(() => {
        controller.waitTimer = null;
        controller.waitResolve = null;
        resolve(controller.operationId === operationId);
      }, Math.max(0, duration));
    });
  }

  function applyTransform(controller, options = {}) {
    const element = controller.target;
    const snapshot = controller.snapshot;
    if (!isUsableElement(element) || !snapshot) return false;
    const base = snapshot.computedTransform === "none" ? "" : snapshot.computedTransform;
    const translateX = Number(options.translateX) || 0;
    const translateY = Number(options.translateY) || 0;
    const scale = Number.isFinite(options.scale) ? options.scale : 1;
    const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration) : DEFAULT_MOVE_DURATION;
    element.style.setProperty(
      "transition",
      `transform ${duration}ms cubic-bezier(.22,.82,.24,1), box-shadow 180ms ease, filter 180ms ease`,
      "important"
    );
    element.style.setProperty(
      "transform",
      `${base} translate(${translateX}px, ${translateY}px) scale(${scale})`.trim(),
      "important"
    );
    return true;
  }

  function restoreCurrentTarget(controller, options = {}) {
    const element = controller.target;
    const snapshot = controller.snapshot;
    if (!element || !snapshot) return false;
    clearWait(controller);
    element.classList.remove("professor-ui-targeted", "professor-ui-grabbed");
    restoreProperty(element.style, "transform", snapshot.transform, snapshot.transformPriority);
    restoreProperty(element.style, "transition", snapshot.transition, snapshot.transitionPriority);
    restoreProperty(element.style, "z-index", snapshot.zIndex, snapshot.zIndexPriority);
    restoreProperty(element.style, "pointer-events", snapshot.pointerEvents, snapshot.pointerEventsPriority);
    controller.target = null;
    controller.snapshot = null;
    controller.state = options.keepState ? controller.state : "idle";
    return true;
  }

  function beginOperation(controller, element, state) {
    if (!controller || !isUsableElement(element)) return 0;
    controller.operationId += 1;
    clearWait(controller);
    snapshotElement(controller, element);
    controller.state = state;
    return controller.operationId;
  }

  async function lookAt(target, options = {}) {
    const controller = activeController;
    const element = resolveElement(target);
    const operationId = beginOperation(controller, element, "targeting");
    if (!operationId) return false;
    const mapping = mapElementToCursor(controller, element, options);
    const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration) : DEFAULT_LOOK_DURATION;
    const moved = global.ProfessorCursorController?.moveTo?.(
      controller.instance,
      mapping.cursorX,
      mapping.cursorY,
      { duration }
    );
    if (!moved) return false;
    await waitFor(controller, duration, operationId);
    return controller.operationId === operationId;
  }

  function track(target, options = {}) {
    const controller = activeController;
    const element = resolveElement(target);
    if (!controller || !element) return false;
    const mapping = mapElementToCursor(controller, element, options);
    const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration) : DEFAULT_LOOK_DURATION;
    return Boolean(global.ProfessorCursorController?.moveTo?.(
      controller.instance,
      mapping.cursorX,
      mapping.cursorY,
      { duration }
    ));
  }

  function highlight(target) {
    const controller = activeController;
    const element = resolveElement(target);
    if (!beginOperation(controller, element, "highlighting")) return false;
    element.classList.add("professor-ui-targeted");
    return true;
  }

  function grab(target) {
    const controller = activeController;
    const element = resolveElement(target);
    if (!beginOperation(controller, element, "grabbed")) return false;
    element.classList.add("professor-ui-targeted", "professor-ui-grabbed");
    element.style.setProperty("z-index", "59", "important");
    return applyTransform(controller, { translateY: -6, scale: 1.035, duration: 180 });
  }

  async function move(target, options = {}) {
    const controller = activeController;
    const element = resolveElement(target);
    const operationId = beginOperation(controller, element, "moving");
    if (!operationId) return false;
    element.classList.add("professor-ui-targeted", "professor-ui-grabbed");
    const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration) : DEFAULT_MOVE_DURATION;
    applyTransform(controller, {
      translateX: options.translateX,
      translateY: options.translateY,
      scale: Number.isFinite(options.scale) ? options.scale : 1.035,
      duration
    });
    await waitFor(controller, duration, operationId);
    return controller.operationId === operationId;
  }

  async function restore(target, options = {}) {
    const controller = activeController;
    const element = resolveElement(target) || controller?.target;
    if (!controller || element !== controller.target || !controller.snapshot) return false;
    const operationId = ++controller.operationId;
    clearWait(controller);
    controller.state = "restoring";
    const duration = Number.isFinite(options.duration) ? Math.max(0, options.duration) : DEFAULT_MOVE_DURATION;
    element.classList.remove("professor-ui-grabbed");
    element.style.setProperty("transition", `transform ${duration}ms cubic-bezier(.22,.82,.24,1), box-shadow 180ms ease, filter 180ms ease`, "important");
    element.style.setProperty("transform", controller.snapshot.computedTransform, "important");
    await waitFor(controller, duration, operationId);
    if (controller.operationId !== operationId) return false;
    return restoreCurrentTarget(controller);
  }

  async function release(target, options = {}) {
    const restored = await restore(target, options);
    const controller = activeController;
    global.ProfessorCursorController?.reset?.(controller?.instance, {
      duration: Number.isFinite(options.resetDuration) ? options.resetDuration : DEFAULT_RESET_DURATION
    });
    return restored;
  }

  function resetController(controller, options = {}) {
    if (!controller) return false;
    controller.operationId += 1;
    clearWait(controller);
    restoreCurrentTarget(controller, { immediate: true });
    global.ProfessorCursorController?.reset?.(controller.instance, {
      immediate: options.immediate === true,
      duration: options.duration ?? DEFAULT_RESET_DURATION
    });
    controller.state = "idle";
    return true;
  }

  function reset(options = {}) {
    return resetController(activeController, options);
  }

  function activate(target) {
    const element = resolveElement(target);
    if (!element || element.matches(":disabled,[aria-disabled='true']")) return false;
    element.click();
    return true;
  }

  async function testTelekinesis(target, options = {}) {
    const element = resolveElement(target);
    if (!element || !activeController) return false;
    reset({ immediate: true });
    if (!await lookAt(element, { duration: options.lookDuration ?? DEFAULT_LOOK_DURATION })) return false;
    highlight(element);
    await waitFor(activeController, options.highlightDuration ?? 280, activeController.operationId);
    grab(element);
    await waitFor(activeController, options.grabDuration ?? 260, activeController.operationId);
    await move(element, {
      translateX: options.translateX ?? -36,
      translateY: options.translateY ?? 18,
      duration: options.moveDuration ?? DEFAULT_MOVE_DURATION
    });
    await release(element, {
      duration: options.restoreDuration ?? DEFAULT_MOVE_DURATION,
      resetDuration: options.resetDuration ?? DEFAULT_RESET_DURATION
    });
    return true;
  }

  function setSafeRatio(ratio) {
    const numeric = Number(ratio);
    if (!activeController || !Number.isFinite(numeric) || numeric <= 0 || numeric > 1) return false;
    activeController.safeRatio = numeric;
    return true;
  }

  function getState() {
    const controller = activeController;
    if (!controller) return null;
    return {
      state: controller.state,
      busy: controller.state !== "idle",
      target: controller.target?.id || controller.target?.className || null,
      cursorRange: controller.cursorRange,
      safeRatio: controller.safeRatio,
      lastMapping: controller.lastMapping
    };
  }

  global.ProfessorUIManipulationController = Object.freeze({
    attach,
    detach,
    lookAt,
    track,
    highlight,
    grab,
    move,
    restore,
    release,
    reset,
    activate,
    testTelekinesis,
    setSafeRatio,
    getState
  });
})(window);
