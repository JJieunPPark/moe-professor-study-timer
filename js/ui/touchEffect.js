(function () {
  const TOUCH_EFFECT_CONFIG = {
    radius: 128,
    durationMs: 380,
    strength: 0.08
  };

  function playTouchEffect(target, event) {
    if (!target) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const x = event ? event.clientX - rect.left : rect.width / 2;
    const y = event ? event.clientY - rect.top : rect.height / 2;
    target.style.setProperty("--touch-x", `${x}px`);
    target.style.setProperty("--touch-y", `${y}px`);
    target.classList.remove("is-touching");
    void target.offsetWidth;
    target.classList.add("is-touching");
    window.setTimeout(() => target.classList.remove("is-touching"), TOUCH_EFFECT_CONFIG.durationMs);
  }

  window.TouchEffect = {
    config: TOUCH_EFFECT_CONFIG,
    play: playTouchEffect
  };
})();
