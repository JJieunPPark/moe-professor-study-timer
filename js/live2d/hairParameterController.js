(function initializeHairParameterController(global) {
  const HAIR_CONFIG = {
    amplitude: 0.32,
    cycleMs: 6000,
    channels: {
      Hair: 0.20,
      ParamHairHigh: 0.16,
      ParamHairMiddle: 0.12,
      ParamHairLow: 0.09,
      ParamHairEnd: 0.06
    }
  };
  const HAIR_IDS = Object.keys(HAIR_CONFIG.channels);
  const controllers = new WeakMap();

  const clamp = (value) => Math.max(-1, Math.min(1, value));
  const responseForDelta = (response, deltaMS) => 1 - Math.exp(-response * Math.max(0, deltaMS) / 16.67);

  function resolveIndices(core) {
    const indices = new Map(HAIR_IDS.map((id) => [id, -1]));
    const count = Number(core?.getParameterCount?.()) || 0;
    for (let index = 0; index < count; index += 1) {
      const name = core.getParameterId?.(index)?.getString?.()?.s;
      if (typeof name === "string" && indices.has(name)) indices.set(name, index);
    }
    return indices;
  }

  function write(controller) {
    const core = controller.instance.model?.internalModel?.coreModel;
    if (!core) return false;
    controller.channels.forEach((channel, id) => {
      if (channel.index < 0) return;
      core.setParameterValueByIndex?.(channel.index, clamp(channel.current));
    });
    return true;
  }

  function attach(instance, professorKey) {
    if (!instance?.model?.internalModel || professorKey !== "algorithm") return null;
    detach(instance);
    const core = instance.model.internalModel.coreModel;
    const indices = resolveIndices(core);
    const missing = HAIR_IDS.filter((id) => indices.get(id) < 0);
    if (missing.length) console.warn(`[Live2D Hair] Missing parameters; skipped: ${missing.join(", ")}`);
    console.log("[Live2D Hair] parameter binding", Object.fromEntries(indices));

    const channels = new Map(HAIR_IDS.map((id) => [id, {
      index: indices.get(id),
      current: 0,
      target: 0,
      response: HAIR_CONFIG.channels[id]
    }]));
    const controller = { instance, enabled: true, phase: 0, baseTarget: 0, channels, config: structuredClone(HAIR_CONFIG) };
    controller.beforeModelUpdate = () => write(controller);
    instance.model.internalModel.on?.("beforeModelUpdate", controller.beforeModelUpdate);
    controllers.set(instance, controller);
    write(controller);
    return controller;
  }

  function update(instance, deltaMS = 16.67) {
    const controller = controllers.get(instance);
    if (!controller) return;
    const delta = Math.max(0, Number(deltaMS) || 0);
    controller.phase += delta;
    controller.baseTarget = controller.enabled
      ? Math.sin((controller.phase / controller.config.cycleMs) * Math.PI * 2) * controller.config.amplitude
      : 0;

    let upstream = controller.baseTarget;
    controller.channels.forEach((channel) => {
      channel.target = upstream;
      channel.current += (channel.target - channel.current) * responseForDelta(channel.response, delta);
      channel.current = clamp(channel.current);
      upstream = channel.current;
    });
  }

  function detach(instance) {
    const controller = controllers.get(instance);
    if (!controller) return;
    instance.model?.internalModel?.off?.("beforeModelUpdate", controller.beforeModelUpdate);
    controllers.delete(instance);
  }

  function getState(instance) {
    const controller = controllers.get(instance);
    if (!controller) return null;
    return {
      enabled: controller.enabled,
      baseTarget: controller.baseTarget,
      ...Object.fromEntries([...controller.channels].map(([id, channel]) => [id, channel.current]))
    };
  }

  function setEnabled(instance, enabled) {
    const controller = controllers.get(instance);
    if (!controller) return false;
    controller.enabled = Boolean(enabled);
    return true;
  }

  function reset(instance) {
    const controller = controllers.get(instance);
    if (!controller) return false;
    controller.phase = 0;
    controller.baseTarget = 0;
    controller.channels.forEach((channel) => { channel.current = 0; channel.target = 0; });
    return true;
  }

  function setConfig(instance, nextConfig = {}) {
    const controller = controllers.get(instance);
    if (!controller) return false;
    controller.config.amplitude = Number.isFinite(nextConfig.amplitude) ? nextConfig.amplitude : controller.config.amplitude;
    controller.config.cycleMs = Number.isFinite(nextConfig.cycleMs) && nextConfig.cycleMs > 0 ? nextConfig.cycleMs : controller.config.cycleMs;
    return true;
  }

  global.ProfessorHairController = Object.freeze({ attach, detach, update, getState, setEnabled, reset, setConfig });
})(window);
