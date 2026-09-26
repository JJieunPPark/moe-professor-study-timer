(function initializeProfessorParameterReactionController(global) {
  const COOLDOWN_MS = 5000;
  const RAPID_WINDOW_MS = 2500;
  const RAPID_DISTINCT_COUNT = 4;
  const RAPID_EVENT_COUNT = 12;
  const controllers = new WeakMap();

  const REACTIONS = Object.freeze({
    GLASSES_OFF: {
      text: "……제 안경을 벗기셨네요. 그렇게 보고 싶었습니까?",
      state: "SURPRISED",
      stateOptions: { duration: 180, hold: 900, returnTo: "NORMAL" }
    },
    CARD_MAX: {
      text: "카드까지 꺼내게 하셨으니, 뭔가 시키실 생각이겠죠?",
      state: "LAUGH",
      stateOptions: { duration: 200, hold: 900, returnTo: "NORMAL" }
    },
    MOUTH_POSITIVE: {
      text: "……제 표정을 직접 조정하는 게 그렇게 재미있습니까?",
      state: "DISGUSTED",
      stateOptions: { duration: 180, hold: 1000, returnTo: "NORMAL" }
    },
    MOUTH_NEGATIVE: {
      text: "입 모양으로 장난치는 건 예상 못 했는데요.",
      state: "DISGUSTED",
      stateOptions: { duration: 180, hold: 1000, returnTo: "NORMAL" }
    },
    BOTH_EYES_CLOSED: {
      text: "저를 재우려는 겁니까? 아직 수업 안 끝났습니다.",
      state: "SURPRISED",
      stateOptions: { duration: 180, hold: 850, returnTo: "NORMAL" }
    },
    WINK: {
      text: "윙크까지 직접 시키시네요. 취향이 확실하십니다.",
      state: "LAUGH",
      stateOptions: { duration: 180, hold: 1000, returnTo: "NORMAL" }
    },
    EYEBROW_ASYMMETRY: {
      text: "……제 눈썹으로 비대칭 알고리즘을 구현하지 마십시오.",
      state: "DISGUSTED",
      stateOptions: { duration: 180, hold: 1000, returnTo: "NORMAL" }
    },
    RAPID_EDIT: {
      text: "잠깐만요. 지금 제 얼굴로 파라미터 탐색 중입니까?",
      state: "DISGUSTED",
      stateOptions: { duration: 180, hold: 1000, returnTo: "NORMAL" }
    }
  });

  function parameterValue(parameters, id, fallback) {
    const value = Number(parameters?.get?.(id)?.currentValue);
    return Number.isFinite(value) ? value : fallback;
  }

  function parameterSpan(parameters, id) {
    const meta = parameters?.get?.(id);
    const span = Number(meta?.maximum) - Number(meta?.minimum);
    return Number.isFinite(span) && span > 0 ? span : 2;
  }

  function attach(instance, professorKey, parameters) {
    if (!instance || instance.id !== "lobby" || professorKey !== "algorithm") return null;
    detach(instance);
    const values = new Map([
      ["ParamMouthForm", parameterValue(parameters, "ParamMouthForm", 0)],
      ["ParamBrowLY", parameterValue(parameters, "ParamBrowLY", 0)],
      ["ParamBrowRY", parameterValue(parameters, "ParamBrowRY", 0)],
      ["ParamEyeLOpen", parameterValue(parameters, "ParamEyeLOpen", 0.5)],
      ["ParamEyeROpen", parameterValue(parameters, "ParamEyeROpen", 0.5)],
      ["Glasses", parameterValue(parameters, "Glasses", 0)],
      ["Card", parameterValue(parameters, "Card", 0)]
    ]);
    const eyebrowTrigger = Math.max(
      parameterSpan(parameters, "ParamBrowLY"),
      parameterSpan(parameters, "ParamBrowRY")
    ) * 0.6;
    const controller = {
      instance,
      professorKey,
      values,
      eyebrowTrigger,
      eyebrowRearm: eyebrowTrigger * (2 / 3),
      armed: {
        glasses: values.get("Glasses") >= 0.15,
        card: values.get("Card") <= 0.8,
        mouth: Math.abs(values.get("ParamMouthForm")) < 0.7,
        bothEyes: true,
        leftWink: true,
        rightWink: true,
        eyebrow: true
      },
      recentInteractions: [],
      rapidLatched: false,
      cooldownUntil: 0,
      lastReactionKey: null,
      lastReactionAt: 0
    };
    controllers.set(instance, controller);
    return controller;
  }

  function detach(instance) {
    if (instance) controllers.delete(instance);
  }

  function dispatchReaction(controller, key, now) {
    const reaction = REACTIONS[key];
    if (!reaction) return false;
    const bothEyesOverride = key === "BOTH_EYES_CLOSED" && controller.lastReactionKey === "WINK";
    if (now < controller.cooldownUntil && !bothEyesOverride) return false;
    controller.cooldownUntil = now + COOLDOWN_MS;
    controller.lastReactionKey = key;
    controller.lastReactionAt = now;
    document.dispatchEvent(new CustomEvent("professor-live2d-parameter-reaction", {
      detail: {
        professorKey: controller.professorKey,
        reactionKey: key,
        text: reaction.text,
        state: reaction.state,
        stateOptions: { ...reaction.stateOptions }
      }
    }));
    return true;
  }

  function recordRapidInteraction(controller, id, now) {
    controller.recentInteractions.push({ id, at: now });
    controller.recentInteractions = controller.recentInteractions.filter((entry) => now - entry.at <= RAPID_WINDOW_MS);
    const distinctCount = new Set(controller.recentInteractions.map((entry) => entry.id)).size;
    const active = distinctCount >= RAPID_DISTINCT_COUNT || controller.recentInteractions.length >= RAPID_EVENT_COUNT;
    if (!active) {
      controller.rapidLatched = false;
      return false;
    }
    if (controller.rapidLatched) return false;
    controller.rapidLatched = true;
    return dispatchReaction(controller, "RAPID_EDIT", now);
  }

  function evaluateGlasses(controller, value, now) {
    if (value >= 0.15) controller.armed.glasses = true;
    if (value > 0.01 || !controller.armed.glasses) return false;
    controller.armed.glasses = false;
    return dispatchReaction(controller, "GLASSES_OFF", now);
  }

  function evaluateCard(controller, value, now) {
    if (value <= 0.8) controller.armed.card = true;
    if (value < 0.99 || !controller.armed.card) return false;
    controller.armed.card = false;
    return dispatchReaction(controller, "CARD_MAX", now);
  }

  function evaluateMouth(controller, value, now) {
    if (value > -0.7 && value < 0.7) controller.armed.mouth = true;
    if (!controller.armed.mouth) return false;
    const key = value >= 0.9
      ? "MOUTH_POSITIVE"
      : value <= -0.9
        ? "MOUTH_NEGATIVE"
        : null;
    if (!key) return false;
    controller.armed.mouth = false;
    return dispatchReaction(controller, key, now);
  }

  function evaluateEyes(controller, now) {
    const left = controller.values.get("ParamEyeLOpen");
    const right = controller.values.get("ParamEyeROpen");
    if (left > 0.2 || right > 0.2) controller.armed.bothEyes = true;
    if (left >= 0.25) controller.armed.leftWink = true;
    if (right >= 0.25) controller.armed.rightWink = true;

    if (left <= 0.1 && right <= 0.1) {
      if (!controller.armed.bothEyes) return false;
      controller.armed.bothEyes = false;
      controller.armed.leftWink = false;
      controller.armed.rightWink = false;
      return dispatchReaction(controller, "BOTH_EYES_CLOSED", now);
    }
    if (left <= 0.1 && right >= 0.35 && controller.armed.leftWink) {
      controller.armed.leftWink = false;
      return dispatchReaction(controller, "WINK", now);
    }
    if (right <= 0.1 && left >= 0.35 && controller.armed.rightWink) {
      controller.armed.rightWink = false;
      return dispatchReaction(controller, "WINK", now);
    }
    return false;
  }

  function evaluateEyebrows(controller, now) {
    const difference = Math.abs(
      controller.values.get("ParamBrowLY") - controller.values.get("ParamBrowRY")
    );
    if (difference <= controller.eyebrowRearm) controller.armed.eyebrow = true;
    if (difference < controller.eyebrowTrigger || !controller.armed.eyebrow) return false;
    controller.armed.eyebrow = false;
    return dispatchReaction(controller, "EYEBROW_ASYMMETRY", now);
  }

  function recordUserChange(instance, parameterId, value) {
    const controller = controllers.get(instance);
    const numericValue = Number(value);
    if (!controller || !controller.values.has(parameterId) || !Number.isFinite(numericValue)) return false;
    const now = performance.now();
    controller.values.set(parameterId, numericValue);

    let reacted = false;
    if (parameterId === "Glasses") reacted = evaluateGlasses(controller, numericValue, now);
    else if (parameterId === "Card") reacted = evaluateCard(controller, numericValue, now);
    else if (parameterId === "ParamMouthForm") reacted = evaluateMouth(controller, numericValue, now);
    else if (parameterId === "ParamEyeLOpen" || parameterId === "ParamEyeROpen") reacted = evaluateEyes(controller, now);
    else if (parameterId === "ParamBrowLY" || parameterId === "ParamBrowRY") reacted = evaluateEyebrows(controller, now);

    const rapidReacted = recordRapidInteraction(controller, parameterId, now);
    return reacted || rapidReacted;
  }

  function getState(instance) {
    const controller = controllers.get(instance);
    if (!controller) return null;
    const now = performance.now();
    return {
      professorKey: controller.professorKey,
      values: Object.fromEntries(controller.values),
      armed: { ...controller.armed },
      eyebrowTrigger: controller.eyebrowTrigger,
      eyebrowRearm: controller.eyebrowRearm,
      cooldownRemainingMs: Math.max(0, controller.cooldownUntil - now),
      recentInteractions: controller.recentInteractions.map((entry) => ({ ...entry })),
      rapidLatched: controller.rapidLatched,
      lastReactionKey: controller.lastReactionKey
    };
  }

  global.ProfessorParameterReactionController = Object.freeze({
    attach,
    detach,
    recordUserChange,
    getState
  });
})(window);
