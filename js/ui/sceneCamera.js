(function () {
  const SCENE_CAMERA_PRESETS = {
    default: { scale: 1, x: 0, y: 0 },
    professorFace: { scale: 1.08, x: "-3vw", y: "-2vh" },
    operator: { scale: 1.14, x: "-8vw", y: "1vh" }
  };

  function createSceneCamera(worldElement) {
    let currentPreset = "default";

    function focus(presetName = "default") {
      const preset = SCENE_CAMERA_PRESETS[presetName] || SCENE_CAMERA_PRESETS.default;
      currentPreset = presetName;
      if (!worldElement) {
        return preset;
      }
      worldElement.style.setProperty("--camera-scale", String(preset.scale));
      worldElement.style.setProperty("--camera-x", String(preset.x));
      worldElement.style.setProperty("--camera-y", String(preset.y));
      worldElement.dataset.cameraPreset = currentPreset;
      return preset;
    }

    focus("default");
    return { focus, get currentPreset() { return currentPreset; } };
  }

  window.SceneCamera = {
    create: createSceneCamera,
    presets: SCENE_CAMERA_PRESETS
  };
})();
