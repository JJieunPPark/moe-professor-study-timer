(function initializeProfessorTouchController(global) {
  const TOUCH_MAX_DURATION_MS = 500;
  const TOUCH_MAX_DISTANCE_PX = 10;
  const DRAWABLE_OPACITY_THRESHOLD = 0.01;
  const LIVE2D_TOUCH_EVENT = "professor-live2d-touch";
  const REGION_ORDER = ["FACE", "BODY", "CHEST"];
  const TOUCH_Y_BOUNDARIES = Object.freeze({ FACE_END: 0.48, BODY_END: 0.62 });
  const TOUCH_EXCLUDED_DRAWABLE_IDS = Object.freeze({
    algorithm: Object.freeze([])
  });
  const TOUCH_STATE_REACTIONS = Object.freeze({
    algorithm: Object.freeze({
      FACE: Object.freeze({ state: "LAUGH", options: Object.freeze({ duration: 200, hold: 1100, returnTo: "NORMAL" }) }),
      BODY: Object.freeze({ state: "SURPRISED", options: Object.freeze({ duration: 160, hold: 750, returnTo: "NORMAL" }) }),
      CHEST: Object.freeze({ state: "DISGUSTED", options: Object.freeze({ duration: 180, hold: 1200, returnTo: "NORMAL" }) })
    })
  });
  const TOUCH_REGIONS = Object.freeze({
    algorithm: Object.freeze({
      FACE: Object.freeze([
        Object.freeze({ type: "rect", x: 0, y: 0, width: 1, height: TOUCH_Y_BOUNDARIES.FACE_END })
      ]),
      BODY: Object.freeze([
        Object.freeze({
          type: "rect",
          x: 0,
          y: TOUCH_Y_BOUNDARIES.FACE_END,
          width: 1,
          height: TOUCH_Y_BOUNDARIES.BODY_END - TOUCH_Y_BOUNDARIES.FACE_END
        })
      ]),
      CHEST: Object.freeze([
        Object.freeze({
          type: "rect",
          x: 0,
          y: TOUCH_Y_BOUNDARIES.BODY_END,
          width: 1,
          height: 1 - TOUCH_Y_BOUNDARIES.BODY_END
        })
      ])
    })
  });
  const REGION_COLORS = Object.freeze({
    FACE: "rgba(255, 92, 150, 0.3)",
    CHEST: "rgba(92, 190, 255, 0.24)",
    BODY: "rgba(100, 230, 160, 0.2)"
  });
  const controllers = new WeakMap();

  function getNaturalSize(instance) {
    const internalModel = instance?.model?.internalModel;
    const width = Number(internalModel?.width) || Number(instance?.model?.width) || 0;
    const height = Number(internalModel?.height) || Number(instance?.model?.height) || 0;
    return { width, height };
  }

  function screenToNormalized(instance, screenX, screenY) {
    const container = instance?.container;
    const model = instance?.model;
    const renderer = instance?.app?.renderer;
    const rect = container?.getBoundingClientRect?.();
    const naturalSize = getNaturalSize(instance);
    if (!rect?.width || !rect?.height || !naturalSize.width || !naturalSize.height) {
      return null;
    }

    const renderWidth = Number(renderer?.screen?.width) || Number(renderer?.width) || rect.width;
    const renderHeight = Number(renderer?.screen?.height) || Number(renderer?.height) || rect.height;
    const stageX = (screenX - rect.left) * (renderWidth / rect.width);
    const stageY = (screenY - rect.top) * (renderHeight / rect.height);
    let localX;
    let localY;

    if (typeof model?.toLocal === "function" && global.PIXI?.Point) {
      const local = model.toLocal(new global.PIXI.Point(stageX, stageY));
      localX = local.x;
      localY = local.y;
    } else {
      const scaleX = Number(model?.scale?.x) || 1;
      const scaleY = Number(model?.scale?.y) || 1;
      const pivotX = Number(model?.pivot?.x) || 0;
      const pivotY = Number(model?.pivot?.y) || 0;
      localX = (stageX - (Number(model?.position?.x) || 0)) / scaleX + pivotX;
      localY = (stageY - (Number(model?.position?.y) || 0)) / scaleY + pivotY;
    }

    return {
      screenX,
      screenY,
      stageX,
      stageY,
      localX,
      localY,
      normalizedX: localX / naturalSize.width,
      normalizedY: localY / naturalSize.height,
      naturalWidth: naturalSize.width,
      naturalHeight: naturalSize.height
    };
  }

  function resolveRegion(professorKey, normalizedX, normalizedY) {
    if (normalizedX < 0 || normalizedX > 1 || normalizedY < 0 || normalizedY > 1) {
      return "NONE";
    }
    if (!TOUCH_REGIONS[professorKey]) {
      return "NONE";
    }
    if (normalizedY < TOUCH_Y_BOUNDARIES.FACE_END) {
      return "FACE";
    }
    if (normalizedY < TOUCH_Y_BOUNDARIES.BODY_END) {
      return "BODY";
    }
    return "CHEST";
  }

  function toDrawableIdString(id) {
    const value = id?.getString?.();
    if (typeof value === "string") {
      return value;
    }
    return typeof value?.s === "string" ? value.s : String(id ?? "");
  }

  function toDrawablePoint(instance, point) {
    const model = instance?.model;
    if (typeof model?.toModelPosition === "function" && global.PIXI?.Point) {
      return model.toModelPosition(
        new global.PIXI.Point(point.stageX, point.stageY),
        new global.PIXI.Point()
      );
    }

    const result = { x: point.localX, y: point.localY };
    const localTransform = model?.internalModel?.localTransform;
    if (typeof localTransform?.applyInverse === "function") {
      return localTransform.applyInverse(result, result);
    }
    return result;
  }

  function pointInTriangle(px, py, ax, ay, bx, by, cx, cy) {
    if (![px, py, ax, ay, bx, by, cx, cy].every(Number.isFinite)) {
      return false;
    }
    const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (Math.abs(area) < 1e-8) {
      return false;
    }
    const ab = (px - bx) * (ay - by) - (ax - bx) * (py - by);
    const bc = (px - cx) * (by - cy) - (bx - cx) * (py - cy);
    const ca = (px - ax) * (cy - ay) - (cx - ax) * (py - ay);
    const hasNegative = ab < 0 || bc < 0 || ca < 0;
    const hasPositive = ab > 0 || bc > 0 || ca > 0;
    return !(hasNegative && hasPositive);
  }

  function hitTestDrawableMesh(instance, professorKey, point) {
    const internalModel = instance?.model?.internalModel;
    const coreModel = internalModel?.coreModel;
    const drawablePoint = toDrawablePoint(instance, point);
    const drawableCount = Number(coreModel?.getDrawableCount?.()) || 0;
    if (!drawablePoint || !drawableCount || typeof internalModel?.getDrawableVertices !== "function") {
      return { onModel: false, drawableIndex: -1, drawableId: "" };
    }

    const excludedIds = new Set(TOUCH_EXCLUDED_DRAWABLE_IDS[professorKey] || []);
    const renderOrders = coreModel.getDrawableRenderOrders?.();
    const drawableIndices = Array.from({ length: drawableCount }, (_, index) => index)
      .sort((left, right) => (renderOrders?.[right] ?? right) - (renderOrders?.[left] ?? left));

    for (const drawableIndex of drawableIndices) {
      if (coreModel.getDrawableDynamicFlagIsVisible?.(drawableIndex) === false) {
        continue;
      }
      const opacity = Number(coreModel.getDrawableOpacity?.(drawableIndex));
      if (Number.isFinite(opacity) && opacity <= DRAWABLE_OPACITY_THRESHOLD) {
        continue;
      }
      const drawableId = toDrawableIdString(coreModel.getDrawableId?.(drawableIndex));
      if (excludedIds.has(drawableId)) {
        continue;
      }

      const vertices = internalModel.getDrawableVertices(drawableIndex);
      const indices = coreModel.getDrawableVertexIndices?.(drawableIndex);
      if (!vertices?.length || !indices?.length) {
        continue;
      }
      for (let offset = 0; offset + 2 < indices.length; offset += 3) {
        const a = indices[offset] * 2;
        const b = indices[offset + 1] * 2;
        const c = indices[offset + 2] * 2;
        if (pointInTriangle(
          drawablePoint.x,
          drawablePoint.y,
          vertices[a],
          vertices[a + 1],
          vertices[b],
          vertices[b + 1],
          vertices[c],
          vertices[c + 1]
        )) {
          return { onModel: true, drawableIndex, drawableId };
        }
      }
    }
    return { onModel: false, drawableIndex: -1, drawableId: "" };
  }

  function hitTest(instance, screenX, screenY) {
    const controller = controllers.get(instance);
    const point = screenToNormalized(instance, screenX, screenY);
    if (!controller || !point) {
      return { onModel: false, region: "NONE", point };
    }
    const drawableHit = hitTestDrawableMesh(instance, controller.professorKey, point);
    return {
      ...drawableHit,
      region: drawableHit.onModel
        ? resolveRegion(controller.professorKey, point.normalizedX, point.normalizedY)
        : "NONE",
      point
    };
  }

  function applyTouchState(instance, professorKey, region) {
    const reaction = TOUCH_STATE_REACTIONS[professorKey]?.[region];
    if (!reaction) {
      return false;
    }
    return Boolean(global.ProfessorStateController?.setState?.(
      instance,
      reaction.state,
      { ...reaction.options }
    ));
  }

  function getRapidTouchConfig(professorKey) {
    if (typeof PROFESSORS === "undefined") {
      return null;
    }
    return PROFESSORS[professorKey]?.live2dRapidTouch || null;
  }

  function resetRapidTouch(controller) {
    controller.rapidRegion = null;
    controller.rapidTouchCount = 0;
    controller.rapidLastTouchedAt = 0;
  }

  function registerRapidTouch(controller, region, touchedAt) {
    const rapidConfig = getRapidTouchConfig(controller.professorKey);
    const threshold = Number(rapidConfig?.threshold);
    const windowMs = Number(rapidConfig?.windowMs);
    const hasRapidReaction = Boolean(rapidConfig?.[region]);
    if (!hasRapidReaction || !Number.isFinite(threshold) || threshold < 2 || !Number.isFinite(windowMs) || windowMs <= 0) {
      resetRapidTouch(controller);
      return { touchCount: 1, rapid: false, reaction: null };
    }

    const continuesSequence = controller.rapidRegion === region
      && touchedAt - controller.rapidLastTouchedAt <= windowMs;
    controller.rapidRegion = region;
    controller.rapidTouchCount = continuesSequence ? controller.rapidTouchCount + 1 : 1;
    controller.rapidLastTouchedAt = touchedAt;

    const touchCount = controller.rapidTouchCount;
    const rapid = touchCount >= threshold;
    const reaction = rapid ? rapidConfig[region] : null;
    if (rapid) {
      resetRapidTouch(controller);
    }
    return { touchCount, rapid, reaction };
  }

  function applyRapidTouchState(instance, reaction) {
    if (!reaction?.state) {
      return false;
    }
    return Boolean(global.ProfessorStateController?.setState?.(
      instance,
      reaction.state,
      { ...(reaction.stateOptions || {}) }
    ));
  }

  function resetRapidTouchGuard(controller) {
    controller.rapidTouchArmedUntil = 0;
    controller.previousHoverRegion = "NONE";
  }

  function armRapidTouchGuard(controller, currentRegion, activatedAt) {
    const guard = getRapidTouchConfig(controller.professorKey)?.CHEST?.guard;
    const durationMs = Number(guard?.durationMs);
    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      resetRapidTouchGuard(controller);
      return;
    }
    controller.rapidTouchArmedUntil = activatedAt + durationMs;
    controller.previousHoverRegion = currentRegion;
  }

  function isRapidTouchGuardArmed(controller, now = performance.now()) {
    if (controller.rapidTouchArmedUntil <= now) {
      resetRapidTouchGuard(controller);
      return false;
    }
    return true;
  }

  function updateChestGuardHover(controller, event) {
    if (event.isPrimary === false || !isRapidTouchGuardArmed(controller)) {
      return;
    }

    const blocked = isBlockedByUi(
      controller.instance,
      event.clientX,
      event.clientY
    );
    const result = blocked
      ? { onModel: false, region: "NONE" }
      : hitTest(controller.instance, event.clientX, event.clientY);
    const currentRegion = result.onModel ? result.region : "NONE";
    const previousRegion = controller.previousHoverRegion;
    controller.previousHoverRegion = currentRegion;

    if (currentRegion !== "CHEST" || previousRegion === "CHEST") {
      return;
    }

    const guard = getRapidTouchConfig(controller.professorKey)?.CHEST?.guard;
    let stateApplied = false;
    if (guard?.state) {
      stateApplied = Boolean(global.ProfessorStateController?.setState?.(
        controller.instance,
        guard.state,
        { ...(guard.stateOptions || {}) }
      ));
    }
    resetRapidTouchGuard(controller);
    document.dispatchEvent(new CustomEvent(LIVE2D_TOUCH_EVENT, {
      detail: {
        professorKey: controller.professorKey,
        region: "CHEST",
        touchCount: 0,
        rapid: true,
        guard: true,
        stateApplied
      }
    }));
    if (controller.debugEnabled) {
      console.log("[Live2D Chest Guard] ENTER");
    }
  }

  function getStageZIndex(instance) {
    const value = Number.parseFloat(global.getComputedStyle?.(instance.container)?.zIndex);
    return Number.isFinite(value) ? value : 0;
  }

  function isInteractiveElement(element) {
    return Boolean(element?.closest?.(
      "button, a[href], input, select, textarea, label, summary, [role='button'], [contenteditable='true'], [tabindex]:not([tabindex='-1']), #dialogueBubble"
    ));
  }

  function hasHigherStackingLayer(element, instance) {
    const stageZIndex = getStageZIndex(instance);
    let current = element;
    while (current && current !== document.body && current !== document.documentElement) {
      if (current === instance.container || instance.container?.contains?.(current)) {
        return false;
      }
      const style = global.getComputedStyle?.(current);
      const zIndex = Number.parseFloat(style?.zIndex);
      if (style?.pointerEvents !== "none" && Number.isFinite(zIndex) && zIndex > stageZIndex) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  }

  function isBlockedByUi(instance, screenX, screenY) {
    const stack = document.elementsFromPoint?.(screenX, screenY) || [];
    return stack.some((element) => isInteractiveElement(element) || hasHigherStackingLayer(element, instance));
  }

  function createDebugOverlay(controller) {
    if (controller.overlay || !controller.instance.container) {
      return;
    }
    const overlay = document.createElement("div");
    overlay.className = "professor-touch-debug-overlay";
    Object.assign(overlay.style, {
      position: "absolute",
      inset: "0",
      zIndex: "5",
      overflow: "hidden",
      pointerEvents: "none"
    });

    const regionElements = [];
    REGION_ORDER.forEach((regionName) => {
      TOUCH_REGIONS[controller.professorKey]?.[regionName]?.forEach((shape, shapeIndex) => {
        const element = document.createElement("div");
        element.dataset.region = regionName;
        element.dataset.shapeIndex = String(shapeIndex);
        element.textContent = regionName;
        Object.assign(element.style, {
          position: "absolute",
          zIndex: "1",
          boxSizing: "border-box",
          transform: "translate(-50%, -50%)",
          padding: "4px 7px",
          border: `1px solid ${REGION_COLORS[regionName].replace(/0\.\d+\)$/, "0.92)")}`,
          borderRadius: "4px",
          color: "white",
          background: REGION_COLORS[regionName],
          font: "800 12px/1 sans-serif",
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
          pointerEvents: "none"
        });
        overlay.appendChild(element);
        regionElements.push({ element, shape });
      });
    });

    const boundaryElements = [TOUCH_Y_BOUNDARIES.FACE_END, TOUCH_Y_BOUNDARIES.BODY_END]
      .map((normalizedY) => {
        const element = document.createElement("div");
        Object.assign(element.style, {
          position: "absolute",
          zIndex: "1",
          height: "0",
          borderTop: "2px dashed rgba(255, 255, 255, 0.92)",
          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
          pointerEvents: "none"
        });
        overlay.appendChild(element);
        return { element, normalizedY };
      });

    controller.instance.container.appendChild(overlay);
    controller.overlay = overlay;
    controller.regionElements = regionElements;
    controller.boundaryElements = boundaryElements;
    updateDebugOverlay(controller);
  }

  function modelPointToOverlay(instance, localX, localY) {
    const rect = instance.container?.getBoundingClientRect?.();
    const renderer = instance.app?.renderer;
    if (!rect?.width || !rect?.height) {
      return null;
    }
    const renderWidth = Number(renderer?.screen?.width) || Number(renderer?.width) || rect.width;
    const renderHeight = Number(renderer?.screen?.height) || Number(renderer?.height) || rect.height;
    let stagePoint;
    if (typeof instance.model?.toGlobal === "function" && global.PIXI?.Point) {
      stagePoint = instance.model.toGlobal(new global.PIXI.Point(localX, localY));
    } else {
      stagePoint = {
        x: (localX - (Number(instance.model?.pivot?.x) || 0)) * (Number(instance.model?.scale?.x) || 1) + (Number(instance.model?.position?.x) || 0),
        y: (localY - (Number(instance.model?.pivot?.y) || 0)) * (Number(instance.model?.scale?.y) || 1) + (Number(instance.model?.position?.y) || 0)
      };
    }
    return {
      x: stagePoint.x * (rect.width / renderWidth),
      y: stagePoint.y * (rect.height / renderHeight)
    };
  }

  function updateDebugOverlay(controller) {
    if (!controller.debugEnabled || !controller.overlay) {
      return;
    }
    const naturalSize = getNaturalSize(controller.instance);
    if (!naturalSize.width || !naturalSize.height) {
      return;
    }
    controller.regionElements.forEach(({ element, shape }) => {
      const center = modelPointToOverlay(
        controller.instance,
        (shape.x + shape.width / 2) * naturalSize.width,
        (shape.y + shape.height / 2) * naturalSize.height
      );
      if (!center) {
        return;
      }
      Object.assign(element.style, {
        left: `${center.x}px`,
        top: `${center.y}px`
      });
    });
    controller.boundaryElements.forEach(({ element, normalizedY }) => {
      const left = modelPointToOverlay(controller.instance, 0, normalizedY * naturalSize.height);
      const right = modelPointToOverlay(controller.instance, naturalSize.width, normalizedY * naturalSize.height);
      if (!left || !right) {
        return;
      }
      Object.assign(element.style, {
        left: `${Math.min(left.x, right.x)}px`,
        top: `${(left.y + right.y) / 2}px`,
        width: `${Math.abs(right.x - left.x)}px`
      });
    });
  }

  function setDebug(instance, enabled) {
    const controller = controllers.get(instance);
    if (!controller) {
      return false;
    }
    controller.debugEnabled = Boolean(enabled);
    if (controller.debugEnabled) {
      createDebugOverlay(controller);
      updateDebugOverlay(controller);
    } else {
      controller.overlay?.remove();
      controller.overlay = null;
      controller.regionElements = [];
      controller.boundaryElements = [];
    }
    return true;
  }

  function attach(instance, professorKey) {
    if (!instance?.model || instance.id !== "lobby" || professorKey !== "algorithm") {
      return null;
    }
    detach(instance);
    const controller = {
      instance,
      professorKey,
      pointer: null,
      debugEnabled: false,
      overlay: null,
      regionElements: [],
      boundaryElements: [],
      lastHit: null,
      rapidRegion: null,
      rapidTouchCount: 0,
      rapidLastTouchedAt: 0,
      rapidTouchArmedUntil: 0,
      previousHoverRegion: "NONE"
    };

    controller.onPointerDown = (event) => {
      if (!event.isPrimary || event.button !== 0 || isBlockedByUi(instance, event.clientX, event.clientY)) {
        controller.pointer = null;
        return;
      }
      controller.pointer = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startedAt: performance.now(),
        dragged: false
      };
    };
    controller.onPointerMove = (event) => {
      updateChestGuardHover(controller, event);
      const pointer = controller.pointer;
      if (!pointer || pointer.pointerId !== event.pointerId) {
        return;
      }
      const distance = Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY);
      if (distance > TOUCH_MAX_DISTANCE_PX) {
        pointer.dragged = true;
      }
    };
    controller.onPointerUp = (event) => {
      const pointer = controller.pointer;
      controller.pointer = null;
      if (!pointer || pointer.pointerId !== event.pointerId || pointer.dragged) {
        return;
      }
      const duration = performance.now() - pointer.startedAt;
      const distance = Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY);
      if (duration > TOUCH_MAX_DURATION_MS || distance > TOUCH_MAX_DISTANCE_PX || isBlockedByUi(instance, event.clientX, event.clientY)) {
        return;
      }
      const result = hitTest(instance, event.clientX, event.clientY);
      const rapidResult = result.onModel && result.region !== "NONE"
        ? registerRapidTouch(controller, result.region, performance.now())
        : { touchCount: 0, rapid: false, reaction: null };
      controller.lastHit = {
        professor: professorKey,
        onModel: result.onModel,
        region: result.region,
        touchCount: rapidResult.touchCount,
        rapid: rapidResult.rapid,
        screenX: event.clientX,
        screenY: event.clientY,
        normalizedX: result.point?.normalizedX ?? null,
        normalizedY: result.point?.normalizedY ?? null
      };
      console.log("[Live2D Touch]", controller.lastHit);
      if (result.onModel && result.region !== "NONE") {
        const stateApplied = rapidResult.rapid
          ? applyRapidTouchState(instance, rapidResult.reaction)
          : applyTouchState(instance, professorKey, result.region);
        if (rapidResult.rapid) {
          armRapidTouchGuard(controller, result.region, performance.now());
        }
        document.dispatchEvent(new CustomEvent(LIVE2D_TOUCH_EVENT, {
          detail: {
            professorKey,
            region: result.region,
            touchCount: rapidResult.touchCount,
            rapid: rapidResult.rapid,
            stateApplied
          }
        }));
      }
    };
    controller.onPointerCancel = () => {
      controller.pointer = null;
    };
    controller.onPageHide = () => {
      controller.pointer = null;
      resetRapidTouch(controller);
      resetRapidTouchGuard(controller);
    };

    document.addEventListener("pointerdown", controller.onPointerDown, true);
    document.addEventListener("pointermove", controller.onPointerMove, true);
    document.addEventListener("pointerup", controller.onPointerUp, true);
    document.addEventListener("pointercancel", controller.onPointerCancel, true);
    global.addEventListener("pagehide", controller.onPageHide);
    controllers.set(instance, controller);
    return controller;
  }

  function detach(instance) {
    const controller = controllers.get(instance);
    if (!controller) {
      return;
    }
    document.removeEventListener("pointerdown", controller.onPointerDown, true);
    document.removeEventListener("pointermove", controller.onPointerMove, true);
    document.removeEventListener("pointerup", controller.onPointerUp, true);
    document.removeEventListener("pointercancel", controller.onPointerCancel, true);
    global.removeEventListener("pagehide", controller.onPageHide);
    resetRapidTouch(controller);
    resetRapidTouchGuard(controller);
    controller.overlay?.remove();
    controllers.delete(instance);
  }

  function update(instance) {
    const controller = controllers.get(instance);
    if (controller?.debugEnabled) {
      updateDebugOverlay(controller);
    }
  }

  function getDebugState(instance) {
    const controller = controllers.get(instance);
    if (!controller) {
      return null;
    }
    const now = performance.now();
    const rapidTouchArmed = isRapidTouchGuardArmed(controller, now);
    return {
      professorKey: controller.professorKey,
      debugEnabled: controller.debugEnabled,
      lastHit: controller.lastHit ? { ...controller.lastHit } : null,
      rapidTouchArmed,
      rapidTouchArmedRemainingMs: rapidTouchArmed
        ? Math.max(0, controller.rapidTouchArmedUntil - now)
        : 0,
      previousHoverRegion: controller.previousHoverRegion,
      chestGuardActive: rapidTouchArmed,
      chestGuardRemainingMs: rapidTouchArmed
        ? Math.max(0, controller.rapidTouchArmedUntil - now)
        : 0,
      pointerInsideGuardedChest: controller.previousHoverRegion === "CHEST",
      regions: TOUCH_REGIONS[controller.professorKey]
    };
  }

  global.ProfessorTouchController = Object.freeze({
    attach,
    detach,
    update,
    hitTest,
    setDebug,
    getDebugState
  });
})(window);
