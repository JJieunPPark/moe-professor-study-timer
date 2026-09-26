(function initializeProfessorInactivityController(global) {
  const INPUT_EVENTS = [
    "pointermove", "pointerdown", "pointerup", "click", "wheel", "keydown",
    "touchstart", "touchmove", "input", "change"
  ];
  const subscribers = new Set();
  let lastUserInteractionTime = performance.now();
  let listenersAttached = false;

  function handleUserInteraction(event) {
    if (event?.isTrusted === false) return;
    lastUserInteractionTime = performance.now();
    subscribers.forEach((subscriber) => subscriber(lastUserInteractionTime, event));
  }

  function attach() {
    if (listenersAttached) return;
    INPUT_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleUserInteraction, { passive: true, capture: true });
    });
    listenersAttached = true;
  }

  function subscribe(subscriber) {
    if (typeof subscriber !== "function") return () => {};
    attach();
    subscribers.add(subscriber);
    return () => subscribers.delete(subscriber);
  }

  function getState() {
    return {
      lastUserInteractionTime,
      inactiveFor: Math.max(0, performance.now() - lastUserInteractionTime)
    };
  }

  attach();
  global.ProfessorInactivityController = Object.freeze({ subscribe, getState });
})(window);
