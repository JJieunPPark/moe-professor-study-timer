(function initializeProfessorStateController(global) {
  const DEFAULT_STATE = "NORMAL";
  const DEFAULT_DURATION_MS = 250;
  const PRESETS = Object.freeze({
    NORMAL: { ParamMouthForm: 0, ParamBrowLY: 0, ParamBrowLForm: 0, ParamBrowRY: 0, ParamBrowRForm: 0, ParamEyeLOpen: 0.5, ParamEyeLSmile: 0, ParamEyeROpen: 0.5, ParamEyeRSmile: 0, Glasses: 0, Card: 0 },
    LAUGH: { ParamMouthForm: 1, ParamBrowLY: -1, ParamBrowLForm: 0, ParamBrowRY: -1, ParamBrowRForm: 0, ParamEyeLOpen: 0, ParamEyeLSmile: 1, ParamEyeROpen: 0, ParamEyeRSmile: 1, Glasses: 0, Card: -1 },
    SURPRISED: { ParamMouthForm: -1, ParamBrowLY: 1, ParamBrowLForm: 1, ParamBrowRY: 1, ParamBrowRForm: 1, ParamEyeLOpen: 1, ParamEyeLSmile: 0, ParamEyeROpen: 1, ParamEyeRSmile: 0, Glasses: -1, Card: 0 },
    DISGUSTED: { ParamMouthForm: 0, ParamBrowLY: 0, ParamBrowLForm: -1, ParamBrowRY: 0.3, ParamBrowRForm: 0.6, ParamEyeLOpen: 0.3, ParamEyeLSmile: 0, ParamEyeROpen: 0.3, ParamEyeRSmile: 0, Glasses: 1, Card: 1 }
  });
  const controllers = new WeakMap();

  function resolveParameterIndices(core, ids) {
    const indices = new Map(ids.map((id) => [id, -1]));
    const count = Number(core?.getParameterCount?.()) || 0;
    for (let index = 0; index < count; index += 1) {
      const name = core.getParameterId?.(index)?.getString?.()?.s;
      if (typeof name === "string" && indices.has(name)) indices.set(name, index);
    }
    return indices;
  }
  function ease(value) {
    return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }
  function write(controller) {
    const core = controller.instance.model?.internalModel?.coreModel;
    if (!core) return false;
    Object.entries(controller.currentValues).forEach(([id, value]) => {
      const index = controller.indices.get(id);
      if (!Number.isInteger(index) || index < 0) return;
      core.setParameterValueByIndex?.(index, value);
    });
    return true;
  }
  function begin(controller, target, duration) {
    controller.sourceValues = { ...controller.currentValues };
    controller.targetValues = { ...PRESETS[target] };
    controller.targetState = target;
    controller.elapsed = 0;
    controller.duration = duration;
    controller.phase = "transition";
  }
  function setState(instance, name, options = {}) {
    const controller = controllers.get(instance);
    const target = typeof name === "string" ? name.toUpperCase() : "";
    if (!controller) {
      console.warn("[Live2D State] No attached algorithm model.");
      return false;
    }
    if (!Object.prototype.hasOwnProperty.call(PRESETS, target)) {
      console.warn(`[Live2D State] Unknown state \"${name}\".`);
      return false;
    }
    const duration = Number.isFinite(options.duration) && options.duration >= 0 ? options.duration : DEFAULT_DURATION_MS;
    const hold = Number.isFinite(options.hold) && options.hold > 0 ? options.hold : 0;
    const returnTo = options.returnTo == null ? null : String(options.returnTo).toUpperCase();
    if (returnTo && !Object.prototype.hasOwnProperty.call(PRESETS, returnTo)) {
      console.warn(`[Live2D State] Unknown return state \"${options.returnTo}\".`);
      return false;
    }
    controller.hold = hold;
    controller.returnTo = returnTo;
    controller.holdElapsed = 0;
    begin(controller, target, duration);
    return true;
  }
  function update(instance, deltaMS = 16.67) {
    const controller = controllers.get(instance);
    if (!controller || controller.phase === "idle") return;
    const delta = Math.max(0, Number(deltaMS) || 0);
    if (controller.phase === "hold") {
      controller.holdElapsed += delta;
      if (controller.holdElapsed < controller.hold) return;
      if (controller.returnTo) {
        controller.state = controller.targetState;
        controller.hold = 0;
        controller.holdElapsed = 0;
        begin(controller, controller.returnTo, DEFAULT_DURATION_MS);
      } else controller.phase = "idle";
      return;
    }
    controller.elapsed += delta;
    const progress = controller.duration === 0 ? 1 : Math.min(1, controller.elapsed / controller.duration);
    const amount = ease(progress);
    Object.keys(controller.currentValues).forEach((id) => {
      controller.currentValues[id] = controller.sourceValues[id] + (controller.targetValues[id] - controller.sourceValues[id]) * amount;
    });
    if (progress >= 1) {
      controller.currentValues = { ...controller.targetValues };
      controller.state = controller.targetState;
      controller.phase = controller.hold > 0 ? "hold" : "idle";
      controller.holdElapsed = 0;
    }
  }
  function attach(instance, professorKey) {
    if (!instance?.model?.internalModel || professorKey !== "algorithm") return null;
    detach(instance);
    const core = instance.model.internalModel.coreModel;
    const ids = Object.keys(PRESETS.NORMAL);
    const indices = resolveParameterIndices(core, ids);
    const missing = ids.filter((id) => indices.get(id) < 0);
    if (missing.length) console.warn(`[Live2D State] Missing algorithm parameters; skipped: ${missing.join(", ")}`);
    console.log("[Live2D State] parameter binding", Object.fromEntries(indices));
    const controller = { instance, professorKey, state: DEFAULT_STATE, targetState: DEFAULT_STATE, currentValues: { ...PRESETS.NORMAL }, sourceValues: { ...PRESETS.NORMAL }, targetValues: { ...PRESETS.NORMAL }, indices, phase: "idle", elapsed: 0, duration: DEFAULT_DURATION_MS, hold: 0, holdElapsed: 0, returnTo: null };
    controller.beforeModelUpdate = () => write(controller);
    instance.model.internalModel.on?.("beforeModelUpdate", controller.beforeModelUpdate);
    controllers.set(instance, controller);
    write(controller);
    console.log("[Live2D State] attached:", JSON.stringify(getState(instance)));
    return controller;
  }
  function detach(instance) {
    const controller = controllers.get(instance);
    if (!controller) return;
    instance.model?.internalModel?.off?.("beforeModelUpdate", controller.beforeModelUpdate);
    controllers.delete(instance);
  }
  function getState(instance) {
    const controller = controllers.get(instance);
    return controller ? { professorKey: controller.professorKey, state: controller.state, values: { ...controller.currentValues } } : null;
  }
  function getTargetState(instance) { return controllers.get(instance)?.targetState || null; }
  function isTransitioning(instance) { return controllers.get(instance)?.phase !== "idle"; }
  function reset(instance) {
    const controller = controllers.get(instance);
    if (!controller) return false;
    controller.currentValues = { ...PRESETS.NORMAL };
    controller.sourceValues = { ...PRESETS.NORMAL };
    controller.targetValues = { ...PRESETS.NORMAL };
    controller.state = DEFAULT_STATE;
    controller.targetState = DEFAULT_STATE;
    controller.phase = "idle";
    controller.hold = 0;
    controller.returnTo = null;
    write(controller);
    return true;
  }
  global.ProfessorStateController = Object.freeze({ attach, detach, update, setState, getState, getTargetState, isTransitioning, reset });
})(window);
