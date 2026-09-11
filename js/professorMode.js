const PROFESSOR_MODE_STORAGE_KEY = "professorMode";
const PROFESSOR_MODE_NORMAL = "normal";
const PROFESSOR_MODE_ROYAL = "royal";

function isRoyalProgressUnlocked(progress) {
  return Number(progress?.royalProgressPercent || 0) >= 100;
}

function loadProfessorMode(progress) {
  if (!isRoyalProgressUnlocked(progress)) {
    localStorage.setItem(PROFESSOR_MODE_STORAGE_KEY, PROFESSOR_MODE_NORMAL);
    return PROFESSOR_MODE_NORMAL;
  }

  const savedMode = localStorage.getItem(PROFESSOR_MODE_STORAGE_KEY);
  return savedMode === PROFESSOR_MODE_ROYAL ? PROFESSOR_MODE_ROYAL : PROFESSOR_MODE_NORMAL;
}

function saveProfessorMode(mode) {
  const normalizedMode = mode === PROFESSOR_MODE_ROYAL ? PROFESSOR_MODE_ROYAL : PROFESSOR_MODE_NORMAL;
  localStorage.setItem(PROFESSOR_MODE_STORAGE_KEY, normalizedMode);
  return normalizedMode;
}

function getProfessorLive2DModel(professor) {
  return professor?.royal?.live2dModel || "";
}

function getProfessorMascot(professor) {
  return professor?.mascot || { image: "" };
}
