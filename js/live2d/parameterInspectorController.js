(function initializeParameterInspectorController(global) {
  const PARAMETER_IDS = Object.freeze([
    "ParamMouthForm",
    "ParamBrowLY",
    "ParamBrowLForm",
    "ParamBrowRY",
    "ParamBrowRForm",
    "ParamEyeLOpen",
    "ParamEyeROpen",
    "Glasses",
    "Card"
  ]);
  const EYE_IDS = new Set(["ParamEyeLOpen", "ParamEyeROpen"]);
  const NORMAL_VALUES = Object.freeze({
    ParamMouthForm: 0,
    ParamBrowLY: 0,
    ParamBrowLForm: 0,
    ParamBrowRY: 0,
    ParamBrowRForm: 0,
    ParamEyeLOpen: 0.5,
    ParamEyeROpen: 0.5,
    Glasses: 0,
    Card: 0
  });
  const GENERAL_RETURN_DELAY_MS = 3000;
  const RETURN_DURATION_MS = 250;
  const EYE_CLOSED_HOLD_MS = 1000;
  const controllers = new WeakMap();

  const ui = {
    root: document.getElementById("parameterInspector"),
    collapse: document.getElementById("parameterInspectorCollapse"),
    rows: document.getElementById("parameterInspectorRows")
  };

  function easeInOutCubic(value) {
    return value < 0.5
      ? 4 * value * value * value
      : 1 - Math.pow(-2 * value + 2, 3) / 2;
  }

  function toIdString(id) {
    const value = id?.getString?.();
    if (typeof value === "string") return value;
    if (typeof value?.s === "string") return value.s;
    return String(id ?? "");
  }

  function readCoreValue(core, methodName, rawKey, index, fallback = 0) {
    const methodValue = Number(core?.[methodName]?.(index));
    if (Number.isFinite(methodValue)) return methodValue;
    const rawValue = Number(core?._model?.parameters?.[rawKey]?.[index]);
    return Number.isFinite(rawValue) ? rawValue : fallback;
  }

  function enumerateParameters(core) {
    const requested = new Set(PARAMETER_IDS);
    const result = new Map();
    const count = Number(core?.getParameterCount?.()) || 0;
    for (let index = 0; index < count; index += 1) {
      const id = toIdString(core.getParameterId?.(index));
      if (!requested.has(id)) continue;
      const minimum = readCoreValue(core, "getParameterMinimumValue", "minimumValues", index, -1);
      const maximum = readCoreValue(core, "getParameterMaximumValue", "maximumValues", index, 1);
      result.set(id, {
        id,
        index,
        minimum,
        maximum,
        defaultValue: readCoreValue(core, "getParameterDefaultValue", "defaultValues", index, NORMAL_VALUES[id]),
        currentValue: readCoreValue(core, "getParameterValueByIndex", "values", index, NORMAL_VALUES[id])
      });
    }
    return result;
  }

  function isStatePriorityActive(controller) {
    const stateController = global.ProfessorStateController;
    const target = stateController?.getTargetState?.(controller.instance);
    return Boolean(target && (target !== "NORMAL" || stateController?.isTransitioning?.(controller.instance)));
  }

  function clearOwnership(controller) {
    controller.generalValues.clear();
    controller.activeGeneralInteractions.clear();
    controller.generalDeadline = 0;
    controller.generalReturn = null;
    controller.eyes.forEach((eye) => {
      eye.phase = "idle";
      eye.elapsed = 0;
      eye.holdRemaining = 0;
    });
  }

  function clampParameter(meta, value) {
    return Math.max(meta.minimum, Math.min(meta.maximum, Number(value)));
  }

  function setCoreValue(controller, id, value) {
    const meta = controller.parameters.get(id);
    const core = controller.instance.model?.internalModel?.coreModel;
    if (!meta || !core) return false;
    core.setParameterValueByIndex?.(meta.index, clampParameter(meta, value));
    return true;
  }

  function write(controller) {
    if (isStatePriorityActive(controller)) {
      clearOwnership(controller);
      return false;
    }
    controller.generalValues.forEach((value, id) => setCoreValue(controller, id, value));
    controller.eyes.forEach((eye, id) => {
      if (eye.phase !== "idle") setCoreValue(controller, id, eye.current);
    });
    return true;
  }

  function updateGeneralReturn(controller, deltaMS, now) {
    if (!controller.generalReturn && controller.generalDeadline > 0 && now >= controller.generalDeadline) {
      controller.generalDeadline = 0;
      controller.generalReturn = {
        elapsed: 0,
        sources: new Map(controller.generalValues)
      };
    }
    const animation = controller.generalReturn;
    if (!animation) return;
    animation.elapsed += deltaMS;
    const progress = Math.min(1, animation.elapsed / RETURN_DURATION_MS);
    const amount = easeInOutCubic(progress);
    animation.sources.forEach((source, id) => {
      controller.generalValues.set(id, source + (NORMAL_VALUES[id] - source) * amount);
    });
    if (progress >= 1) {
      animation.sources.forEach((_, id) => controller.generalValues.delete(id));
      controller.generalReturn = null;
    }
  }

  function updateEyes(controller, deltaMS) {
    controller.eyes.forEach((eye, id) => {
      if (eye.phase === "hold") {
        eye.holdRemaining -= deltaMS;
        eye.current = 0;
        if (eye.holdRemaining <= 0) {
          eye.phase = "return";
          eye.elapsed = 0;
          eye.source = 0;
        }
      } else if (eye.phase === "return") {
        eye.elapsed += deltaMS;
        const progress = Math.min(1, eye.elapsed / RETURN_DURATION_MS);
        eye.current = eye.source + (NORMAL_VALUES[id] - eye.source) * easeInOutCubic(progress);
        if (progress >= 1) {
          eye.current = NORMAL_VALUES[id];
          eye.phase = "idle";
        }
      }
    });
  }

  function readDisplayedValue(controller, id) {
    if (controller.generalValues.has(id)) return controller.generalValues.get(id);
    const eye = controller.eyes.get(id);
    if (eye && eye.phase !== "idle") return eye.current;
    const meta = controller.parameters.get(id);
    return readCoreValue(
      controller.instance.model?.internalModel?.coreModel,
      "getParameterValueByIndex",
      "values",
      meta.index,
      NORMAL_VALUES[id]
    );
  }

  function syncUi(controller) {
    const stateOwned = isStatePriorityActive(controller);
    ui.root?.classList.toggle("is-state-owned", stateOwned);
    controller.rows.forEach((row, id) => {
      const value = readDisplayedValue(controller, id);
      row.input.value = String(value);
      row.value.textContent = value.toFixed(2);
      row.input.setAttribute("aria-valuetext", value.toFixed(2));
    });
  }

  function beginInteraction(controller, id) {
    if (isStatePriorityActive(controller)) return false;
    if (EYE_IDS.has(id)) {
      const eye = controller.eyes.get(id);
      eye.phase = "user";
      eye.elapsed = 0;
      eye.holdRemaining = 0;
    } else {
      controller.activeGeneralInteractions.add(id);
      controller.generalDeadline = 0;
      controller.generalReturn = null;
    }
    return true;
  }

  function setUserValue(controller, id, value) {
    if (isStatePriorityActive(controller)) {
      clearOwnership(controller);
      return false;
    }
    const meta = controller.parameters.get(id);
    if (!meta) return false;
    const nextValue = clampParameter(meta, value);
    if (EYE_IDS.has(id)) {
      const eye = controller.eyes.get(id);
      if (eye.phase !== "user") beginInteraction(controller, id);
      eye.current = nextValue;
    } else {
      if (!controller.activeGeneralInteractions.has(id)) beginInteraction(controller, id);
      controller.generalValues.set(id, nextValue);
    }
    write(controller);
    syncUi(controller);
    global.ProfessorParameterReactionController?.recordUserChange?.(controller.instance, id, nextValue);
    return true;
  }

  function endInteraction(controller, id) {
    if (EYE_IDS.has(id)) {
      const eye = controller.eyes.get(id);
      if (eye.phase !== "user") return;
      if (isStatePriorityActive(controller)) {
        eye.phase = "idle";
        return;
      }
      eye.phase = "hold";
      eye.current = 0;
      eye.holdRemaining = EYE_CLOSED_HOLD_MS;
      eye.elapsed = 0;
      setCoreValue(controller, id, 0);
      syncUi(controller);
      return;
    }
    if (!controller.activeGeneralInteractions.delete(id)) return;
    if (controller.activeGeneralInteractions.size === 0 && controller.generalValues.size > 0) {
      controller.generalDeadline = performance.now() + GENERAL_RETURN_DELAY_MS;
    }
  }

  function createRow(controller, meta) {
    const row = document.createElement("div");
    row.className = "parameter-inspector__row";
    const label = document.createElement("label");
    const value = document.createElement("output");
    const input = document.createElement("input");
    const inputId = `parameterInspector-${meta.id}`;
    label.htmlFor = inputId;
    label.textContent = meta.id;
    value.className = "parameter-inspector__value";
    input.id = inputId;
    input.type = "range";
    input.min = String(meta.minimum);
    input.max = String(meta.maximum);
    input.step = String(Math.max((meta.maximum - meta.minimum) / 200, 0.001));
    input.dataset.parameterId = meta.id;
    input.dataset.parameterIndex = String(meta.index);
    input.dataset.parameterDefault = String(meta.defaultValue);
    row.append(label, value, input);
    ui.rows.appendChild(row);

    const onStart = () => beginInteraction(controller, meta.id);
    const onInput = () => setUserValue(controller, meta.id, input.value);
    const onEnd = () => endInteraction(controller, meta.id);
    input.addEventListener("pointerdown", onStart);
    input.addEventListener("keydown", onStart);
    input.addEventListener("input", onInput);
    input.addEventListener("pointerup", onEnd);
    input.addEventListener("pointercancel", onEnd);
    input.addEventListener("keyup", onEnd);
    input.addEventListener("change", onEnd);
    input.addEventListener("blur", onEnd);
    controller.cleanup.push(() => {
      input.removeEventListener("pointerdown", onStart);
      input.removeEventListener("keydown", onStart);
      input.removeEventListener("input", onInput);
      input.removeEventListener("pointerup", onEnd);
      input.removeEventListener("pointercancel", onEnd);
      input.removeEventListener("keyup", onEnd);
      input.removeEventListener("change", onEnd);
      input.removeEventListener("blur", onEnd);
    });
    controller.rows.set(meta.id, { input, value });
  }

  function attach(instance, professorKey) {
    if (!instance?.model?.internalModel || instance.id !== "lobby" || professorKey !== "algorithm") return null;
    detach(instance);
    const parameters = enumerateParameters(instance.model.internalModel.coreModel);
    const missing = PARAMETER_IDS.filter((id) => !parameters.has(id));
    if (missing.length) console.warn(`[Live2D Inspector] Missing parameters; skipped: ${missing.join(", ")}`);

    const controller = {
      instance,
      professorKey,
      parameters,
      generalValues: new Map(),
      activeGeneralInteractions: new Set(),
      generalDeadline: 0,
      generalReturn: null,
      eyes: new Map(Array.from(EYE_IDS, (id) => [id, { phase: "idle", current: NORMAL_VALUES[id], source: 0, elapsed: 0, holdRemaining: 0 }])),
      rows: new Map(),
      cleanup: [],
      beforeModelUpdate: null
    };
    controller.beforeModelUpdate = () => write(controller);
    instance.model.internalModel.on?.("beforeModelUpdate", controller.beforeModelUpdate);
    controllers.set(instance, controller);

    if (ui.rows) {
      ui.rows.innerHTML = "";
      PARAMETER_IDS.forEach((id) => {
        const meta = parameters.get(id);
        if (meta) createRow(controller, meta);
      });
    }
    if (ui.root) ui.root.hidden = false;
    syncUi(controller);
    console.log("[Live2D Inspector] parameter enumeration", [...parameters.values()]);
    console.log(`[Live2D Inspector] parameter enumeration JSON: ${JSON.stringify([...parameters.values()])}`);
    return controller;
  }

  function detach(instance) {
    const controller = controllers.get(instance);
    if (!controller) return;
    instance.model?.internalModel?.off?.("beforeModelUpdate", controller.beforeModelUpdate);
    controller.cleanup.forEach((cleanup) => cleanup());
    clearOwnership(controller);
    controllers.delete(instance);
    if (ui.rows) ui.rows.innerHTML = "";
    if (ui.root) {
      ui.root.hidden = true;
      ui.root.classList.remove("is-state-owned");
    }
  }

  function update(instance, deltaMS = 16.67) {
    const controller = controllers.get(instance);
    if (!controller) return;
    const delta = Math.max(0, Number(deltaMS) || 0);
    if (isStatePriorityActive(controller)) {
      clearOwnership(controller);
    } else {
      updateGeneralReturn(controller, delta, performance.now());
      updateEyes(controller, delta);
    }
    syncUi(controller);
  }

  function getState(instance) {
    const controller = controllers.get(instance);
    if (!controller) return null;
    return {
      professorKey: controller.professorKey,
      parameters: [...controller.parameters.values()].map((meta) => ({ ...meta, value: readDisplayedValue(controller, meta.id) })),
      generalReturnPending: controller.generalDeadline > 0,
      generalReturning: Boolean(controller.generalReturn),
      eyes: Object.fromEntries([...controller.eyes].map(([id, eye]) => [id, { ...eye }])),
      statePriorityActive: isStatePriorityActive(controller)
    };
  }

  ui.collapse?.addEventListener("click", () => {
    const collapsed = ui.root?.classList.toggle("is-collapsed") || false;
    ui.collapse.textContent = collapsed ? "+" : "−";
    ui.collapse.setAttribute("aria-expanded", String(!collapsed));
    ui.collapse.setAttribute("aria-label", `Parameter Inspector ${collapsed ? "펼치기" : "접기"}`);
  });

  global.ParameterInspectorController = Object.freeze({ attach, detach, update, getState });
})(window);
