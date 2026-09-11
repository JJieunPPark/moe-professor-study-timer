(function patchPixiLive2DCompat() {
  if (!window.PIXI) {
    return;
  }

  window.PIXI.utils = window.PIXI.utils || {};

  if (!window.PIXI.utils.EventEmitter && window.PIXI.EventEmitter) {
    window.PIXI.utils.EventEmitter = window.PIXI.EventEmitter;
  }

  window.PIXI.utils.url = window.PIXI.utils.url || {
    resolve: (from, to) => {
      const baseUrl = new URL(from, window.location.href);
      return new URL(to, baseUrl).toString();
    }
  };
})();
