(function initializeTouchDistortionRenderer(global) {
  const timers = new WeakMap();
  let debugEnabled = false;

  function attach(element) {
    element?.classList.add("touch-distortion-target");
    return element || null;
  }

  function showDebugMarker(x, y, radius, durationMs) {
    if (!debugEnabled) {
      return;
    }
    const marker = document.createElement("span");
    marker.className = "touch-distortion-debug-marker";
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.style.width = `${radius * 2}px`;
    marker.style.height = `${radius * 2}px`;
    document.body.appendChild(marker);
    setTimeout(() => marker.remove(), durationMs);
  }

  function play(target, event, options = {}) {
    if (!target || !event) {
      return null;
    }

    attach(target);
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = Number(options.radius) || 128;
    const durationMs = Number(options.durationMs) || 300;
    target.style.setProperty("--slime-x", `${x}px`);
    target.style.setProperty("--slime-y", `${y}px`);
    target.style.setProperty("--slime-radius", `${radius}px`);
    target.classList.remove("is-slime-distorting");
    void target.offsetWidth;
    target.classList.add("is-slime-distorting");

    clearTimeout(timers.get(target));
    timers.set(target, setTimeout(() => {
      target.classList.remove("is-slime-distorting");
      timers.delete(target);
    }, durationMs));
    showDebugMarker(event.clientX, event.clientY, radius, durationMs);

    return { mode: "overlay", x, y, radius, durationMs };
  }

  global.TouchDistortionRenderer = Object.freeze({
    attach,
    play,
    setDebug(enabled) {
      debugEnabled = Boolean(enabled);
    },
    getLastMode() {
      return "overlay";
    }
  });
})(window);
