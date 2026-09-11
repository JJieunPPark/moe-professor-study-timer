const LIVE2D_OS_PROFESSOR_KEY = "os";
const LIVE2D_MOUTH_PARAMETER = "ParamMouthOpenY";
const LIVE2D_BREATH_PARAMETER = "ParamBreath";
const LIVE2D_MIN_RENDER_SIZE = 2;
const LIVE2D_SIZE_WAIT_FRAMES = 20;
const LIVE2D_LAYOUT = {
  lobby: {
    scaleMultiplier: 0.351,
    xRatio: 0.43,
    yRatio: 0.7
  },
  focus: {
    scaleMultiplier: 0.225,
    xRatio: 0.45,
    yRatio: 0.48
  }
};
const LIVE2D_BREATH_CONFIG = {
  min: 0,
  max: 1,
  cycleSeconds: 4
};
const LIVE2D_LOOK_CONFIG = {
  lobby: {
    eyeXRatio: 0.5,
    eyeYRatio: 0.18,
    rangeX: 260,
    rangeY: 230,
    focusDistance: 240,
    smoothing: 0.12
  },
  focus: {
    eyeXRatio: 0.5,
    eyeYRatio: 0.2,
    rangeX: 240,
    rangeY: 190,
    focusDistance: 280,
    smoothing: 0.12
  }
};

const live2dInstances = new Map();
const live2dMissingParameters = new WeakMap();
let live2dCurrentProfessorKey = "";
let live2dMouseListenerRegistered = false;
let live2dLastMouseEvent = null;
let live2dMouthSyncStopper = null;
let live2dAudioContext = null;
let live2dSyncRequestId = 0;
let live2dRuntimeLogged = false;
let live2dLookDebugLoggedAt = 0;
let live2dCurrentModelUrl = "";
let live2dExpressionResetTimer = null;

function getLive2DTargets() {
  return [
    {
      id: "lobby",
      container: document.getElementById("lobbyLive2DStage"),
      fallback: document.querySelector(".character-placeholder")
    },
    {
      id: "focus",
      container: document.getElementById("focusLive2DStage"),
      fallback: document.querySelector(".focus-professor-sprite")
    }
  ];
}

function isLive2DAvailable() {
  return Boolean(
    window.PIXI &&
    window.PIXI.live2d &&
    window.PIXI.live2d.Live2DModel &&
    window.Live2DCubismCore
  );
}

async function syncLive2DProfessor(professorKey, preferredTargetId = "") {
  const requestId = live2dSyncRequestId + 1;
  live2dSyncRequestId = requestId;
  clearLive2DExpressionResetTimer();
  live2dCurrentProfessorKey = professorKey;
  const modelUrl = getLive2DModelUrlForProfessor(professorKey);
  const shouldShowLive2D = Boolean(modelUrl);
  live2dCurrentModelUrl = modelUrl;
  const activeTargetId = preferredTargetId || getActiveLive2DTargetId();

  document.body.classList.toggle("live2d-os-active", shouldShowLive2D);
  document.body.classList.remove("live2d-model-ready");
  revealLive2DFallbacks();

  if (!shouldShowLive2D) {
    stopLive2DMouthSync();
    cleanupLive2DTargets();
    return;
  }

  try {
    await initializeLive2DTargets(activeTargetId);
    if (requestId !== live2dSyncRequestId || live2dCurrentProfessorKey !== professorKey) {
      destroyInactiveLive2DTargets(getActiveLive2DTargetId());
      return;
    }
    showLive2DTarget(activeTargetId);
  } catch (error) {
    console.error("Live2D initialization failed. Falling back to static professor.", error);
    console.error("[Live2D] initialization stack:", error?.stack || "(no stack)");
    cleanupLive2DTargets();
  }
}

function getLive2DModelUrlForProfessor(professorKey) {
  if (!professorKey) {
    return "";
  }

  try {
    const professor = PROFESSORS?.[professorKey];
    return professor?.royal?.live2dModel || "";
  } catch (error) {
    return "";
  }
}

async function loadProfessorLive2D(professorKey, preferredTargetId = "") {
  return syncLive2DProfessor(professorKey, preferredTargetId);
}

function getProfessorLive2DExpression(professorKey, expressionName) {
  if (!professorKey || !expressionName) {
    return "";
  }

  try {
    return PROFESSORS?.[professorKey]?.royal?.expressions?.[expressionName] || "";
  } catch (error) {
    return "";
  }
}

function setProfessorExpression(expressionName) {
  clearLive2DExpressionResetTimer();
  const expressionId = getProfessorLive2DExpression(live2dCurrentProfessorKey, expressionName);

  if (!expressionId) {
    return false;
  }

  return applyLive2DExpressionToVisibleModels(expressionId);
}

function resetProfessorExpression() {
  clearLive2DExpressionResetTimer();
  const expressionId = getProfessorLive2DExpression(live2dCurrentProfessorKey, "default");

  if (!expressionId) {
    return false;
  }

  return applyLive2DExpressionToVisibleModels(expressionId);
}

function clearLive2DExpressionResetTimer() {
  clearTimeout(live2dExpressionResetTimer);
  live2dExpressionResetTimer = null;
}

function applyLive2DExpressionToVisibleModels(expressionId) {
  let applied = false;

  live2dInstances.forEach((instance) => {
    if (!instance.container?.classList.contains("is-visible")) {
      return;
    }

    applied = applyLive2DExpression(instance.model, expressionId) || applied;
  });

  return applied;
}

function applyLive2DExpression(model, expressionId) {
  if (!model || !expressionId) {
    return false;
  }

  const internalModel = model.internalModel;
  const expressionManager = internalModel?.expressionManager
    || internalModel?.motionManager?.expressionManager
    || model.expressionManager;

  try {
    if (typeof model.expression === "function") {
      model.expression(expressionId);
      return true;
    }

    if (typeof model.setExpression === "function") {
      model.setExpression(expressionId);
      return true;
    }

    if (typeof expressionManager?.setExpression === "function") {
      expressionManager.setExpression(expressionId);
      return true;
    }

    if (typeof expressionManager?.startExpression === "function") {
      expressionManager.startExpression(expressionId);
      return true;
    }
  } catch (error) {
    console.warn(`[Live2D] expression "${expressionId}" could not be applied.`, error);
    return false;
  }

  return false;
}

function getActiveLive2DTargetId() {
  return document.body.classList.contains("focus-mode-active") ? "focus" : "lobby";
}

async function initializeLive2DTargets(activeTargetId) {
  if (!isLive2DAvailable()) {
    throw new Error("PIXI, pixi-live2d-display, or Live2DCubismCore is not available.");
  }

  logLive2DRuntimeVersions();
  patchLive2DHitAreaCompatibility();
  destroyInactiveLive2DTargets(activeTargetId);
  const target = getLive2DTargets().find((candidate) => candidate.id === activeTargetId && candidate.container);
  if (!target) {
    throw new Error(`Live2D target "${activeTargetId}" is not available.`);
  }

  await initializeLive2DTarget(target);
  registerLive2DMouseTracking();
}

function logLive2DRuntimeVersions() {
  if (live2dRuntimeLogged) {
    return;
  }

  live2dRuntimeLogged = true;
  try {
    const core = window.Live2DCubismCore;
    const rawVersion = core?.Version?.csmGetVersion?.() || core?.Version?.getVersion?.() || core?.Live2DCubismCore?.getVersion?.() || core?._csm?.getVersion?.();
    const coreVersion = decodeCubismCoreVersion(rawVersion);
    console.log("[Live2D] runtime versions:", {
      pixiVersion: window.PIXI?.VERSION,
      pixiLive2DDisplay: window.PIXI?.live2d,
      cubismCoreVersionRaw: rawVersion,
      cubismCoreVersion: coreVersion,
      cubismCoreGlobal: core
    });

    if (coreVersion.major > 0 && coreVersion.major < 5) {
      throw new Error(`Incompatible Live2D Cubism Core ${coreVersion.label}. Cubism Editor 5.3 models require a Cubism 5 compatible runtime.`);
    }
  } catch (error) {
    console.error("[Live2D] runtime version inspection failed.", error);
    console.error("[Live2D] runtime version stack:", error?.stack || "(no stack)");
    throw error;
  }
}

function patchLive2DHitAreaCompatibility() {
  const internalModelPrototype = window.PIXI?.live2d?.Cubism5InternalModel?.prototype;

  if (!internalModelPrototype || internalModelPrototype.__professorHitAreaPatchApplied) {
    return;
  }

  const originalGetHitAreaDefs = internalModelPrototype.getHitAreaDefs;
  internalModelPrototype.getHitAreaDefs = function getProfessorHitAreaDefs() {
    if (!Array.isArray(this.settings?.hitAreas)) {
      return [];
    }

    return originalGetHitAreaDefs.call(this);
  };
  internalModelPrototype.__professorHitAreaPatchApplied = true;
}

function decodeCubismCoreVersion(rawVersion) {
  if (!Number.isFinite(rawVersion)) {
    return {
      raw: rawVersion,
      major: 0,
      minor: 0,
      patch: 0,
      label: "unknown"
    };
  }

  const major = (rawVersion & 0xff000000) >> 24;
  const minor = (rawVersion & 0x00ff0000) >> 16;
  const patch = rawVersion & 0x0000ffff;
  return {
    raw: rawVersion,
    major,
    minor,
    patch,
    label: `${major}.${minor}.${patch}`
  };
}

async function initializeLive2DTarget(target) {
  if (live2dInstances.has(target.id)) {
    resizeLive2DInstance(live2dInstances.get(target.id));
    return live2dInstances.get(target.id);
  }

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  target.container.classList.add("is-visible");
  target.container.appendChild(canvas);

  let pixiApp = null;

  try {
    pixiApp = await createPixiApplication(canvas, target.container, target.id);
    console.log("[Live2D] loading model URL:", live2dCurrentModelUrl);
    const model = await window.PIXI.live2d.Live2DModel.from(live2dCurrentModelUrl, {
      autoFocus: false,
      autoHitTest: false
    });
    patchLive2DCoreModelCompatibility(model, target.id);
    model.setRenderer?.(pixiApp.renderer);
    validateLive2DRendererState(model, pixiApp, target.id);
    logLive2DDrawableRenderDiagnostics(model, target.id);

    pixiApp.stage.addChild(model);

    const instance = {
      ...target,
      app: pixiApp,
      model,
      canvas,
      resizeObserver: null,
      live2dTickerUpdate: null,
      look: {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0
      },
      breathTime: 0,
      lastTransform: null
    };

    instance.resizeObserver = new ResizeObserver(() => resizeLive2DInstance(instance));
    instance.resizeObserver.observe(target.container);
    live2dInstances.set(target.id, instance);
    resizeLive2DInstance(instance);
    startLive2DFrameUpdates(instance);
    requestAnimationFrame(() => {
      renderLive2DApplication(pixiApp);
    });
    console.log("[Live2D] model loaded successfully", target.id);
    return instance;
  } catch (error) {
    console.error(`[Live2D] target "${target.id}" failed to initialize.`, error);
    console.error("[Live2D] target initialization stack:", error?.stack || "(no stack)");
    canvas.remove();
    pixiApp?.destroy?.(true, { children: true, texture: false, baseTexture: false });
    target.container.classList.remove("is-visible");
    target.fallback?.classList.remove("live2d-ready");
    throw error;
  }
}

function getLive2DBounds(model) {
  try {
    const bounds = model.getBounds?.();
    if (!bounds) {
      return null;
    }

    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
      bottom: bounds.bottom
    };
  } catch (error) {
    return {
      error: error?.message || String(error),
      stack: error?.stack || "(no stack)"
    };
  }
}

function patchLive2DCoreModelCompatibility(model, targetId) {
  const coreModel = model.internalModel?.coreModel;

  if (!coreModel || coreModel.__professorCorePatchApplied) {
    return;
  }

  const originalGetDrawableRenderOrders = coreModel.getDrawableRenderOrders;
  coreModel.getDrawableRenderOrders = function getProfessorDrawableRenderOrders() {
    const renderOrders = originalGetDrawableRenderOrders?.call(this);

    if (isValidLive2DRenderOrder(renderOrders, this.getDrawableCount?.())) {
      return renderOrders;
    }

    const resolvedOrders = resolveLive2DRenderOrders(this);

    if (!this.__professorRenderOrderFallbackLogged) {
      this.__professorRenderOrderFallbackLogged = true;
      console.warn(`[Live2D] drawable renderOrders missing for ${targetId}. Using Cubism Core model.renderOrders.`);
    }

    return resolvedOrders;
  };

  coreModel.__professorCorePatchApplied = true;
}

function isValidLive2DRenderOrder(renderOrders, drawableCount = 0) {
  if (!renderOrders || typeof renderOrders.length !== "number" || renderOrders.length !== drawableCount) {
    return false;
  }

  for (let index = 0; index < drawableCount; index += 1) {
    const order = renderOrders[index];
    if (!Number.isInteger(order) || order < 0 || order >= drawableCount) {
      return false;
    }
  }

  return true;
}

function resolveLive2DRenderOrders(coreModel) {
  const core = coreModel?._model || {};
  const drawables = core.drawables || {};
  const drawableCount = coreModel?.getDrawableCount?.() || drawables.count || drawables.ids?.length || 0;
  const modelRenderOrders = normalizeLive2DRenderOrders(core.renderOrders, drawableCount);

  if (modelRenderOrders) {
    return modelRenderOrders;
  }

  const directCandidates = [
    drawables.renderOrders,
    drawables.renderOrder
  ];

  for (const candidate of directCandidates) {
    if (isValidLive2DRenderOrder(candidate, drawableCount)) {
      return candidate;
    }
  }

  const sortableOrders = [
    drawables.drawOrders,
    drawables.drawOrder
  ].find((candidate) => candidate && typeof candidate.length === "number" && candidate.length === drawableCount);

  if (sortableOrders && isValidLive2DRenderOrder(sortableOrders, drawableCount)) {
    return sortableOrders;
  }

  throw new Error("[Live2D] Cubism renderOrders are unavailable. Refusing to render with guessed drawable order.");
}

function normalizeLive2DRenderOrders(renderOrders, drawableCount) {
  if (!renderOrders || typeof renderOrders.length !== "number" || renderOrders.length < drawableCount) {
    return null;
  }

  const drawableRenderOrders = renderOrders.length === drawableCount
    ? renderOrders
    : Int32Array.from(Array.from(renderOrders).slice(0, drawableCount));

  return isValidLive2DRenderOrder(drawableRenderOrders, drawableCount) ? drawableRenderOrders : null;
}

function validateLive2DRendererState(model, app, targetId) {
  try {
    const internalModel = model.internalModel;
    const coreModel = internalModel?.coreModel;
    const renderer = internalModel?.renderer;
    const clippingManager = renderer?._clippingManager;
    const drawableCount = coreModel?.getDrawableCount?.() || 0;
    const maskCounts = coreModel?.getDrawableMaskCounts?.() || [];
    const maskedDrawables = [];

    for (let index = 0; index < drawableCount; index += 1) {
      const maskCount = maskCounts[index] || 0;
      if (maskCount > 0) {
        maskedDrawables.push(index);
      }
    }

    console.log("[Live2D] renderer ready:", {
      target: targetId,
      rendererClass: app.renderer?.constructor?.name,
      rendererType: app.renderer?.type,
      hasWebGL: Boolean(app.renderer?.gl),
      modelRendererConnected: model.renderer === app.renderer,
      clippingManager: Boolean(clippingManager),
      clippingContextCount: clippingManager?.getClippingContextListForDraw?.()?.getSize?.(),
      renderTextureCount: clippingManager?.getRenderTextureCount?.(),
      maskBufferSize: clippingManager?.getClippingMaskBufferSize?.(),
      drawableCount,
      maskedDrawableCount: maskedDrawables.length,
      maskCounts
    });
  } catch (error) {
    console.error("[Live2D] renderer validation failed.", error);
    console.error("[Live2D] renderer validation stack:", error?.stack || "(no stack)");
  }
}

function logLive2DDrawableRenderDiagnostics(model, targetId) {
  try {
    const internalModel = model.internalModel;
    const coreModel = internalModel?.coreModel;
    const core = coreModel?._model || {};
    const drawables = core.drawables || {};
    const renderer = internalModel?.renderer;
    const clippingManager = renderer?._clippingManager;
    const clippingContexts = clippingManager?.getClippingContextListForDraw?.();
    const drawableCount = coreModel?.getDrawableCount?.() || drawables.count || 0;
    const renderOrders = coreModel?.getDrawableRenderOrders?.();
    const diagnostics = [];

    for (let index = 0; index < drawableCount; index += 1) {
      const clipContext = clippingContexts?.at?.(index);
      diagnostics.push({
        index,
        id: toLive2DIdString(coreModel?.getDrawableId?.(index)),
        textureIndex: coreModel?.getDrawableTextureIndex?.(index),
        renderOrder: renderOrders?.[index],
        drawOrder: drawables.drawOrders?.[index],
        opacity: coreModel?.getDrawableOpacity?.(index),
        blendMode: coreModel?.getDrawableBlendMode?.(index),
        culling: coreModel?.getDrawableCulling?.(index),
        maskCount: drawables.maskCounts?.[index] || 0,
        masks: drawables.masks?.[index] ? Array.from(drawables.masks[index]) : [],
        clipContext: clipContext ? {
          clippingIdCount: clipContext._clippingIdCount,
          clippingIds: clipContext._clippingIdList ? Array.from(clipContext._clippingIdList) : [],
          bufferIndex: clipContext._bufferIndex,
          layoutChannelIndex: clipContext._layoutChannelIndex,
          isUsing: clipContext._isUsing
        } : null
      });
    }

    const result = {
      coreRenderOrders: core.renderOrders ? Array.from(core.renderOrders).slice(0, drawableCount) : null,
      drawableRenderOrders: Array.from(renderOrders || []),
      drawableDrawOrders: drawables.drawOrders ? Array.from(drawables.drawOrders) : null,
      clippingManager: Boolean(clippingManager),
      clippingContextCount: clippingContexts?.getSize?.(),
      renderTextureCount: clippingManager?.getRenderTextureCount?.(),
      maskBufferSize: clippingManager?.getClippingMaskBufferSize?.(),
      diagnostics
    };

    window.__live2dDrawableDiagnostics = window.__live2dDrawableDiagnostics || {};
    window.__live2dDrawableDiagnostics[targetId] = result;
    console.log(`[Live2D] drawable render diagnostics ${targetId}:`, result);
    console.log(`[Live2D] drawable render diagnostics ${targetId} JSON: ${JSON.stringify(result)}`);
  } catch (error) {
    console.error("[Live2D] drawable render diagnostics failed.", error);
    console.error("[Live2D] drawable render diagnostics stack:", error?.stack || "(no stack)");
  }
}

function toLive2DIdString(id) {
  if (typeof id === "string") {
    return id;
  }

  if (typeof id?.s === "string") {
    return id.s;
  }

  if (id?.s && id.s !== id) {
    return toLive2DIdString(id.s);
  }

  return id?._id || id?.id || id?._key || id?.toString?.() || String(id);
}

function renderLive2DApplication(app) {
  try {
    if (typeof app.render === "function") {
      app.render();
      return;
    }

    if (typeof app.renderer?.render === "function" && app.stage) {
      app.renderer.render({ container: app.stage });
    }
  } catch (error) {
    console.error("[Live2D render] explicit render failed.", error);
    console.error("[Live2D render] explicit render stack:", error?.stack || "(no stack)");
  }
}

function ensureLive2DTickerRunning(app) {
  try {
    if (app.ticker && !app.ticker.started) {
      app.start?.();
      app.ticker.start?.();
    }
  } catch (error) {
    console.error("[Live2D] ticker inspection failed.", error);
    console.error("[Live2D] ticker inspection stack:", error?.stack || "(no stack)");
  }
}

function startLive2DFrameUpdates(instance) {
  if (instance.live2dTickerUpdate || !instance.app?.ticker) {
    return;
  }

  instance.live2dTickerUpdate = (ticker) => {
    updateLive2DBreath(instance, ticker?.deltaMS || 16.67);
    updateLive2DLook(instance);
  };

  const tickerPriority = window.PIXI?.UPDATE_PRIORITY?.LOW ?? -25;
  instance.app.ticker.add(instance.live2dTickerUpdate, null, tickerPriority);
  ensureLive2DTickerRunning(instance.app);
}

function stopLive2DFrameUpdates(instance) {
  if (!instance.live2dTickerUpdate) {
    return;
  }

  instance.app?.ticker?.remove?.(instance.live2dTickerUpdate);
  instance.live2dTickerUpdate = null;
}

function updateLive2DBreath(instance, deltaMS = 16.67) {
  if (!instance.container?.classList.contains("is-visible")) {
    return;
  }

  instance.breathTime = (instance.breathTime || 0) + deltaMS / 1000;
  const phase = (instance.breathTime / LIVE2D_BREATH_CONFIG.cycleSeconds) * Math.PI * 2;
  const normalized = 0.5 - 0.5 * Math.cos(phase);
  const value = LIVE2D_BREATH_CONFIG.min
    + normalized * (LIVE2D_BREATH_CONFIG.max - LIVE2D_BREATH_CONFIG.min);

  setLive2DParameter(instance.model?.internalModel?.coreModel, LIVE2D_BREATH_PARAMETER, value);
}

function updateLive2DLook(instance) {
  if (!instance.container?.classList.contains("is-visible")) {
    return;
  }

  const config = LIVE2D_LOOK_CONFIG[instance.id] || LIVE2D_LOOK_CONFIG.lobby;
  const target = getLive2DLookTarget(instance, config);

  instance.look.targetX = target.x;
  instance.look.targetY = target.y;
  instance.look.currentX += (instance.look.targetX - instance.look.currentX) * config.smoothing;
  instance.look.currentY += (instance.look.targetY - instance.look.currentY) * config.smoothing;

  const bounds = getLive2DBounds(instance.model);
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
    return;
  }

  const eyeOriginX = bounds.x + bounds.width * config.eyeXRatio;
  const eyeOriginY = bounds.y + bounds.height * config.eyeYRatio;
  const focusX = eyeOriginX + instance.look.currentX * config.focusDistance;
  const focusY = eyeOriginY + instance.look.currentY * config.focusDistance;
  instance.model.focus?.(focusX, focusY);
}

function getLive2DLookTarget(instance, config) {
  if (!live2dLastMouseEvent) {
    return { x: 0, y: 0 };
  }

  const rect = instance.container.getBoundingClientRect();
  const isInside = live2dLastMouseEvent.clientX >= rect.left
    && live2dLastMouseEvent.clientX <= rect.right
    && live2dLastMouseEvent.clientY >= rect.top
    && live2dLastMouseEvent.clientY <= rect.bottom;

  if (!isInside) {
    return { x: 0, y: 0 };
  }

  const bounds = getLive2DBounds(instance.model);
  if (!bounds || bounds.width <= 0 || bounds.height <= 0) {
    return { x: 0, y: 0 };
  }

  const localMouseX = ((live2dLastMouseEvent.clientX - rect.left) / Math.max(rect.width, 1)) * instance.app.renderer.width;
  const localMouseY = ((live2dLastMouseEvent.clientY - rect.top) / Math.max(rect.height, 1)) * instance.app.renderer.height;
  const eyeOriginX = bounds.x + bounds.width * config.eyeXRatio;
  const eyeOriginY = bounds.y + bounds.height * config.eyeYRatio;
  const relativeX = localMouseX - eyeOriginX;
  const relativeY = localMouseY - eyeOriginY;
  const verticalDeadZone = bounds.height * 0.03;
  const horizontalDeadZone = bounds.width * 0.025;
  const targetX = Math.abs(relativeX) < horizontalDeadZone
    ? 0
    : clampLive2DValue(relativeX / (bounds.width * 0.35), -1, 1);
  const targetY = Math.abs(relativeY) < verticalDeadZone
    ? 0
    : clampLive2DValue(relativeY / (bounds.height * 0.35), -1, 1);
  logLive2DLookDebug(instance, {
    mouseCanvasX: localMouseX,
    mouseCanvasY: localMouseY,
    eyeOriginX,
    eyeOriginY,
    relativeX,
    relativeY,
    targetX,
    targetY,
    bounds,
    modelX: instance.model.x,
    modelY: instance.model.y,
    modelScaleX: instance.model.scale.x,
    modelScaleY: instance.model.scale.y
  });

  return {
    x: targetX,
    y: targetY
  };
}

function clampLive2DValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function logLive2DLookDebug(instance, payload) {
  const now = performance.now();
  if (now - live2dLookDebugLoggedAt < 900) {
    return;
  }

  live2dLookDebugLoggedAt = now;
  console.log("[Live2D] look sample", {
    target: instance.id,
    ...payload,
    finalFocusTarget: {
      x: payload.eyeOriginX + payload.targetX * (LIVE2D_LOOK_CONFIG[instance.id]?.focusDistance || 250),
      y: payload.eyeOriginY + payload.targetY * (LIVE2D_LOOK_CONFIG[instance.id]?.focusDistance || 250)
    }
  });
}

function hasVisibleLive2DPixels(instance) {
  try {
    renderLive2DApplication(instance.app);
    const extractResult = instance.app.renderer?.extract?.pixels?.({
      target: instance.model,
      resolution: 0.25
    });
    const pixels = extractResult?.pixels || extractResult;

    if (!pixels || typeof pixels.length !== "number") {
      console.warn("[Live2D] pixel extraction did not return readable pixels.", {
        target: instance.id,
        extractResult
      });
      return false;
    }

    const step = 4 * 8;
    for (let index = 3; index < pixels.length; index += step) {
      if (pixels[index] > 8) {
        return true;
      }
    }

    console.warn("[Live2D] model rendered without visible pixels. Keeping static fallback visible.", {
      target: instance.id,
      pixelCount: pixels.length / 4
    });
    return false;
  } catch (error) {
    console.error("[Live2D] visible pixel check failed.", error);
    console.error("[Live2D] visible pixel check stack:", error?.stack || "(no stack)");
    return false;
  }
}

function waitForNextLive2DFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function getLive2DElementLabel(element) {
  if (!element) {
    return "(missing element)";
  }

  const id = element.id ? `#${element.id}` : "";
  const classes = typeof element.className === "string" && element.className.trim()
    ? `.${element.className.trim().split(/\s+/).join(".")}`
    : "";
  return `${element.tagName?.toLowerCase?.() || "element"}${id}${classes}`;
}

function getLive2DLayoutDiagnostics(element) {
  const diagnostics = [];
  let current = element;
  let depth = 0;

  while (current && depth < 8) {
    const style = window.getComputedStyle(current);
    const rect = current.getBoundingClientRect();
    diagnostics.push({
      label: getLive2DElementLabel(current),
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      position: style.position,
      width: style.width,
      height: style.height,
      minWidth: style.minWidth,
      minHeight: style.minHeight,
      clientWidth: current.clientWidth,
      clientHeight: current.clientHeight,
      offsetWidth: current.offsetWidth,
      offsetHeight: current.offsetHeight,
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        left: rect.left
      },
      offsetParent: getLive2DElementLabel(current.offsetParent)
    });
    current = current.parentElement;
    depth += 1;
  }

  return diagnostics;
}

function getLive2DContainerSize(container) {
  const rect = container.getBoundingClientRect();
  const width = container.clientWidth || Math.round(rect.width);
  const height = container.clientHeight || Math.round(rect.height);

  return {
    width,
    height,
    rectWidth: rect.width,
    rectHeight: rect.height,
    isValid: width >= LIVE2D_MIN_RENDER_SIZE && height >= LIVE2D_MIN_RENDER_SIZE
  };
}

async function waitForLive2DContainerSize(container, targetId) {
  for (let frame = 0; frame < LIVE2D_SIZE_WAIT_FRAMES; frame += 1) {
    const size = getLive2DContainerSize(container);
    if (size.isValid) {
      console.log("[Live2D] measured container size:", {
        target: targetId,
        frame,
        width: size.width,
        height: size.height,
        rectWidth: size.rectWidth,
        rectHeight: size.rectHeight
      });
      return size;
    }

    await waitForNextLive2DFrame();
  }

  const diagnostics = getLive2DLayoutDiagnostics(container);
  console.error("[Live2D] container has no valid render size.", {
    target: targetId,
    diagnostics
  });
  throw new Error(`[Live2D] ${targetId} container size is not measurable. Pixi renderer was not initialized.`);
}

async function createPixiApplication(canvas, container, targetId = "unknown") {
  const { width, height } = await waitForLive2DContainerSize(container, targetId);
  canvas.style.background = "transparent";

  if (typeof window.PIXI.Application !== "function") {
    throw new Error("PIXI.Application is not available.");
  }

  const supportsAsyncInit = typeof window.PIXI.Application.prototype.init === "function";

  if (supportsAsyncInit) {
    const app = new window.PIXI.Application();
    await app.init({
      canvas,
      width,
      height,
      backgroundAlpha: 0,
      preference: "webgl",
      antialias: true,
      clearBeforeRender: true,
      autoStart: true
    });
    applyTransparentLive2DRenderer(app);
    return app;
  }

  const app = new window.PIXI.Application({
    view: canvas,
    width,
    height,
    transparent: true,
    backgroundAlpha: 0,
    autoStart: true,
    antialias: true
  });
  applyTransparentLive2DRenderer(app);
  return app;
}

function applyTransparentLive2DRenderer(app) {
  try {
    if (app.renderer?.background) {
      app.renderer.background.alpha = 0;
    }
    if (app.canvas) {
      app.canvas.style.background = "transparent";
    }
    if (app.view) {
      app.view.style.background = "transparent";
    }
  } catch (error) {
    console.warn("[Live2D] transparent renderer setup could not be fully applied.", error);
  }
}

function showLive2DTarget(activeTargetId) {
  let visibleCount = 0;

  getLive2DTargets().forEach((target) => {
    const instance = live2dInstances.get(target.id);

    if (!target.container || !instance || target.id !== activeTargetId) {
      target.container?.classList.remove("is-visible");
      target.fallback?.classList.remove("live2d-ready");
      return;
    }

    target.container.classList.add("is-visible");
    visibleCount += 1;

    // is-visible 적용 후 브라우저 레이아웃 계산을 기다린다.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resizeLive2DInstance(instance);
        renderLive2DApplication(instance.app);
        const hasVisiblePixels = hasVisibleLive2DPixels(instance);
        target.fallback?.classList.toggle("live2d-ready", hasVisiblePixels);

        console.log("[Live2D] resized after becoming visible:", {
          containerWidth: target.container.clientWidth,
          containerHeight: target.container.clientHeight,
          rendererWidth: instance.app.renderer?.width,
          rendererHeight: instance.app.renderer?.height,
          hasVisiblePixels
        });
      });
    });
  });

  if (visibleCount > 0) {
    document.body.classList.add("live2d-model-ready");
  }
}

function hideLive2DTargets() {
  document.body.classList.remove("live2d-model-ready");
  getLive2DTargets().forEach((target) => {
    target.container?.classList.remove("is-visible");
    target.fallback?.classList.remove("live2d-ready");
  });
}

function revealLive2DFallbacks() {
  getLive2DTargets().forEach((target) => {
    target.fallback?.classList.remove("live2d-ready");
  });
}

function cleanupLive2DTargets() {
  stopLive2DMouthSync();
  clearLive2DExpressionResetTimer();
  document.body.classList.remove("live2d-model-ready");

  live2dInstances.forEach((instance) => destroyLive2DInstance(instance));
  live2dInstances.clear();

  getLive2DTargets().forEach((target) => {
    target.container?.classList.remove("is-visible");
    if (target.container) {
      target.container.innerHTML = "";
    }
    target.fallback?.classList.remove("live2d-ready");
  });
}

function destroyInactiveLive2DTargets(activeTargetId) {
  live2dInstances.forEach((instance, id) => {
    if (id === activeTargetId) {
      return;
    }

    destroyLive2DInstance(instance);
    live2dInstances.delete(id);
  });

  getLive2DTargets().forEach((target) => {
    if (target.id === activeTargetId) {
      return;
    }

    target.container?.classList.remove("is-visible");
    if (target.container) {
      target.container.innerHTML = "";
    }
    target.fallback?.classList.remove("live2d-ready");
  });
}

function destroyLive2DInstance(instance) {
  try {
    clearLive2DExpressionResetTimer();
    stopLive2DFrameUpdates(instance);
    instance.resizeObserver?.disconnect();
    instance.app?.stop?.();
    instance.app?.stage?.removeChildren?.();
    instance.model?.destroy?.({ children: true, texture: false, baseTexture: false });
    instance.app?.destroy?.(true, { children: true, texture: false, baseTexture: false });
    instance.canvas?.remove?.();
  } catch (error) {
    console.error("[Live2D] cleanup failed.", error);
    console.error("[Live2D] cleanup stack:", error?.stack || "(no stack)");
  }
}

function resizeLive2DInstance(instance) {
  const { container, app, model } = instance;
  const size = getLive2DContainerSize(container);

  if (!size.isValid) {
    console.error("[Live2D] resize skipped because container is not measurable.", {
      target: instance.id,
      diagnostics: getLive2DLayoutDiagnostics(container)
    });
    return;
  }

  const { width, height } = size;

  if (app.renderer?.resize) {
    app.renderer.resize(width, height);
  }

  const layout = LIVE2D_LAYOUT[instance.id] || LIVE2D_LAYOUT.lobby;
  const naturalSize = getLive2DNaturalSize(model);
  const scale = layout.scaleMultiplier;
  const scaledWidth = naturalSize.width * scale;
  const scaledHeight = naturalSize.height * scale;
  const x = width * layout.xRatio - scaledWidth / 2;
  const y = height * layout.yRatio - scaledHeight / 2;

  ensureLive2DTickerRunning(app);

  model.anchor?.set?.(0, 0);
  model.scale.set(scale);
  model.position.set(x, y);
  model.visible = true;
  model.renderable = true;
  instance.lastTransform = {
    target: instance.id,
    baseScale: naturalSize.baseScale,
    scaleMultiplier: layout.scaleMultiplier,
    finalScale: scale,
    scale,
    x,
    y,
    naturalWidth: naturalSize.width,
    naturalHeight: naturalSize.height,
    rendererWidth: width,
    rendererHeight: height
  };
  console.log("[Live2D] final layout", instance.lastTransform);

  app.stage.visible = true;
  app.stage.renderable = true;
  try {
    model.update?.(16.67);
    model.internalModel?.update?.(16.67, performance.now());
    model.internalModel?.coreModel?.update?.();
  } catch (error) {
    console.error("[Live2D] model update failed but render test will continue.", error);
    console.error("[Live2D] model update stack:", error?.stack || "(no stack)");
  }

  try {
    renderLive2DApplication(app);
  } catch (error) {
    console.error("[Live2D] forced render failed.", error);
    console.error("[Live2D] forced render stack:", error?.stack || "(no stack)");
  }
}

function getLive2DNaturalSize(model) {
  const scaleX = model.scale?.x || 1;
  const scaleY = model.scale?.y || scaleX || 1;
  const width = model.internalModel?.width || model.width / scaleX || model.width || 1;
  const height = model.internalModel?.height || model.height / scaleY || model.height || 1;

  return {
    baseScale: 1,
    width,
    height
  };
}

function registerLive2DMouseTracking() {
  if (live2dMouseListenerRegistered) {
    return;
  }

  document.addEventListener("mousemove", handleLive2DMouseMove, { passive: true });
  document.addEventListener("mouseleave", handleLive2DMouseLeave, { passive: true });
  live2dMouseListenerRegistered = true;
}

function handleLive2DMouseMove(event) {
  live2dLastMouseEvent = event;
}

function handleLive2DMouseLeave() {
  live2dLastMouseEvent = null;
}

function startLive2DMouthSync(audioElement, professorKey) {
  if (professorKey !== LIVE2D_OS_PROFESSOR_KEY) {
    return;
  }

  const focusInstance = live2dInstances.get("focus");
  if (!focusInstance || !audioElement) {
    return;
  }

  stopLive2DMouthSync();

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    live2dAudioContext = live2dAudioContext || new AudioContextClass();
    if (live2dAudioContext.state === "suspended") {
      live2dAudioContext.resume().catch(() => {});
    }

    const source = live2dAudioContext.createMediaElementSource(audioElement);
    const analyser = live2dAudioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyser.connect(live2dAudioContext.destination);

    const data = new Uint8Array(analyser.frequencyBinCount);
    let animationFrameId = 0;

    const closeMouth = () => setLive2DMouthOpen(0);
    const cleanup = () => {
      cancelAnimationFrame(animationFrameId);
      audioElement.removeEventListener("ended", cleanup);
      audioElement.removeEventListener("pause", cleanup);
      audioElement.removeEventListener("error", cleanup);
      closeMouth();
      try {
        source.disconnect();
        analyser.disconnect();
      } catch (error) {
        // Disconnect can throw if the node is already detached.
      }
      if (live2dMouthSyncStopper === cleanup) {
        live2dMouthSyncStopper = null;
      }
    };

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (const value of data) {
        const normalized = (value - 128) / 128;
        sum += normalized * normalized;
      }
      const volume = Math.sqrt(sum / data.length);
      setLive2DMouthOpen(Math.min(1, volume * 5.2));
      animationFrameId = requestAnimationFrame(tick);
    };

    audioElement.addEventListener("ended", cleanup, { once: true });
    audioElement.addEventListener("pause", cleanup, { once: true });
    audioElement.addEventListener("error", cleanup, { once: true });
    live2dMouthSyncStopper = cleanup;
    tick();
  } catch (error) {
    console.error("Live2D mouth sync failed.", error);
    console.error("[Live2D] mouth sync stack:", error?.stack || "(no stack)");
    setLive2DMouthOpen(0);
  }
}

function stopLive2DMouthSync() {
  if (live2dMouthSyncStopper) {
    live2dMouthSyncStopper();
    live2dMouthSyncStopper = null;
  }
  setLive2DMouthOpen(0);
}

function setLive2DMouthOpen(value) {
  const focusInstance = live2dInstances.get("focus");
  const coreModel = focusInstance?.model?.internalModel?.coreModel;

  if (!coreModel) {
    return;
  }

  setLive2DParameter(coreModel, LIVE2D_MOUTH_PARAMETER, value);
}

function setLive2DParameter(coreModel, parameterId, value) {
  if (!coreModel) {
    return;
  }

  const missingSet = live2dMissingParameters.get(coreModel);
  if (missingSet?.has(parameterId)) {
    return;
  }

  try {
    if (typeof coreModel.getParameterIndex === "function") {
      const index = coreModel.getParameterIndex(parameterId);
      if (index < 0) {
        markLive2DParameterMissing(coreModel, parameterId);
        return;
      }
    }

    if (typeof coreModel.setParameterValueById === "function") {
      coreModel.setParameterValueById(parameterId, value);
    } else if (typeof coreModel.addParameterValueById === "function") {
      coreModel.addParameterValueById(parameterId, value);
    }
  } catch (error) {
    console.error(`Live2D parameter "${parameterId}" could not be updated.`, error);
    console.error("[Live2D] parameter stack:", error?.stack || "(no stack)");
  }
}

function markLive2DParameterMissing(coreModel, parameterId) {
  let missingSet = live2dMissingParameters.get(coreModel);
  if (!missingSet) {
    missingSet = new Set();
    live2dMissingParameters.set(coreModel, missingSet);
  }

  if (!missingSet.has(parameterId)) {
    missingSet.add(parameterId);
    console.warn(`[Live2D] parameter "${parameterId}" is not available on this model.`);
  }
}

window.__professorLive2DDebug = {
  getInstance(id) {
    return live2dInstances.get(id) || null;
  },
  getInstances() {
    return Object.fromEntries(live2dInstances);
  },
  getLayoutConfig() {
    return LIVE2D_LAYOUT;
  },
  getLookConfig() {
    return LIVE2D_LOOK_CONFIG;
  },
  getBreathConfig() {
    return LIVE2D_BREATH_CONFIG;
  },
  setExpression(expressionName) {
    return setProfessorExpression(expressionName);
  },
  resetExpression() {
    return resetProfessorExpression();
  }
};

window.loadProfessorLive2D = loadProfessorLive2D;
window.setProfessorExpression = setProfessorExpression;
window.resetProfessorExpression = resetProfessorExpression;
