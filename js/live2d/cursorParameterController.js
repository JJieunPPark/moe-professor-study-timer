(function initializeProfessorCursorController(global) {
  const CURSOR_IDS = Object.freeze(["cursorX", "cursorY"]);
  const DEFAULT_MOVE_DURATION_MS = 400;
  const DEFAULT_RESET_DURATION_MS = 300;
  const controllers = new WeakMap();

  const clamp = (value) => Math.max(-1, Math.min(1, value));

  function normalize(value) {
    const number = Number(value);
    return clamp(Number.isFinite(number) ? number : 0);
  }

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function resolveIndices(core) {
    const indices = new Map(CURSOR_IDS.map((id) => [id, -1]));
    const count = Number(core?.getParameterCount?.()) || 0;

    for (let index = 0; index < count; index += 1) {
      const name = core.getParameterId?.(index)?.getString?.()?.s;
      if (typeof name === "string" && indices.has(name)) {
        indices.set(name, index);
      }
    }

    return indices;
  }

  function write(controller) {
    const core = controller.instance.model?.internalModel?.coreModel;
    if (!core) return false;

    const xIndex = controller.indices.get("cursorX");
    const yIndex = controller.indices.get("cursorY");

    if (Number.isInteger(xIndex) && xIndex >= 0) {
      core.setParameterValueByIndex?.(xIndex, controller.currentX);
    }
    if (Number.isInteger(yIndex) && yIndex >= 0) {
      core.setParameterValueByIndex?.(yIndex, controller.currentY);
    }

    return true;
  }

  function attach(instance, professorKey) {
    if (!instance?.model?.internalModel || professorKey !== "algorithm") return null;

    detach(instance);
    const core = instance.model.internalModel.coreModel;
    const indices = resolveIndices(core);
    const missing = CURSOR_IDS.filter((id) => indices.get(id) < 0);

    if (missing.length) {
      console.warn(`[Live2D Cursor] Missing parameters; skipped: ${missing.join(", ")}`);
    }
    console.log("[Live2D Cursor] parameter binding", JSON.stringify(Object.fromEntries(indices)));

    const controller = {
      instance,
      professorKey,
      indices,
      enabled: true,
      currentX: 0,
      currentY: 0,
      sourceX: 0,
      sourceY: 0,
      targetX: 0,
      targetY: 0,
      elapsed: 0,
      duration: 0,
      transitioning: false,
      beforeModelUpdate: null
    };

    controller.beforeModelUpdate = () => write(controller);
    instance.model.internalModel.on?.("beforeModelUpdate", controller.beforeModelUpdate);
    controllers.set(instance, controller);
    write(controller);
    return controller;
  }

  function detach(instance) {
    const controller = controllers.get(instance);
    if (!controller) return;

    instance.model?.internalModel?.off?.("beforeModelUpdate", controller.beforeModelUpdate);
    controller.transitioning = false;
    controller.beforeModelUpdate = null;
    controllers.delete(instance);
  }

  function update(instance, deltaMS = 16.67) {
    const controller = controllers.get(instance);
    if (!controller || !controller.enabled || !controller.transitioning) return;

    controller.elapsed += Math.max(0, Number(deltaMS) || 0);
    const progress = controller.duration === 0
      ? 1
      : Math.min(1, controller.elapsed / controller.duration);
    const amount = easeInOutCubic(progress);

    controller.currentX = controller.sourceX + (controller.targetX - controller.sourceX) * amount;
    controller.currentY = controller.sourceY + (controller.targetY - controller.sourceY) * amount;

    if (progress >= 1) {
      controller.currentX = controller.targetX;
      controller.currentY = controller.targetY;
      controller.transitioning = false;
    }
  }

  function setPosition(instance, x, y) {
    const controller = controllers.get(instance);
    if (!controller) return false;

    controller.currentX = normalize(x);
    controller.currentY = normalize(y);
    controller.sourceX = controller.currentX;
    controller.sourceY = controller.currentY;
    controller.targetX = controller.currentX;
    controller.targetY = controller.currentY;
    controller.elapsed = 0;
    controller.duration = 0;
    controller.transitioning = false;
    return true;
  }

  function moveTo(instance, x, y, options = {}) {
    const controller = controllers.get(instance);
    if (!controller) return false;

    const duration = Number.isFinite(options.duration) && options.duration >= 0
      ? options.duration
      : DEFAULT_MOVE_DURATION_MS;

    controller.sourceX = controller.currentX;
    controller.sourceY = controller.currentY;
    controller.targetX = normalize(x);
    controller.targetY = normalize(y);
    controller.elapsed = 0;
    controller.duration = duration;
    controller.transitioning = duration > 0;

    if (duration === 0) {
      controller.currentX = controller.targetX;
      controller.currentY = controller.targetY;
    }

    return true;
  }

  function reset(instance, options = {}) {
    if (options?.immediate) {
      return setPosition(instance, 0, 0);
    }

    const duration = Number.isFinite(options?.duration) && options.duration >= 0
      ? options.duration
      : DEFAULT_RESET_DURATION_MS;
    return moveTo(instance, 0, 0, { duration });
  }

  function setEnabled(instance, enabled) {
    const controller = controllers.get(instance);
    if (!controller) return false;
    controller.enabled = Boolean(enabled);
    return true;
  }

  function getState(instance) {
    const controller = controllers.get(instance);
    if (!controller) return null;

    return {
      enabled: controller.enabled,
      currentX: controller.currentX,
      currentY: controller.currentY,
      targetX: controller.targetX,
      targetY: controller.targetY,
      transitioning: controller.transitioning
    };
  }

  global.ProfessorCursorController = Object.freeze({
    attach,
    detach,
    update,
    setPosition,
    moveTo,
    reset,
    setEnabled,
    getState
  });
})(window);
