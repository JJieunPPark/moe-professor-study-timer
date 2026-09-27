const ALGORITHM_VOICE_VOLUME_KEY = "algorithmProfessorVoiceVolume";
const DEFAULT_ALGORITHM_VOICE_VOLUME = 0.7;
const DEFAULT_PROFESSOR_VOICE_VOLUME = 0.5;
const ALGORITHM_VOICE_POOLS = Object.freeze({
  answer: ["005_", "006_", "009_"],
  touch: ["001_", "002_", "003_", "004_", "007_", "008_"]
});
const ALGORITHM_VOICE_FILE_NAMES = Object.freeze([
  "001_冥鳴ひまり（ノーマル）_……冗談、冗談。.wav",
  "002_冥鳴ひまり（ノーマル）_お腹いっぱいで眠い….wav",
  "003_冥鳴ひまり（ノーマル）_……冗談ですよ、冗….wav",
  "004_冥鳴ひまり（ノーマル）_まだ解けない？ 大….wav",
  "005_冥鳴ひまり（ノーマル）_正解です。.wav",
  "006_冥鳴ひまり（ノーマル）_お見事。.wav",
  "007_冥鳴ひまり（ノーマル）_……そんな顔しなく….wav",
  "008_冥鳴ひまり（ノーマル）_分からなかった？ ….wav",
  "009_冥鳴ひまり（ノーマル）_私、説明上手なので。.wav"
]);
const ALGORITHM_VOICE_FILES = Object.freeze(
  ALGORITHM_VOICE_FILE_NAMES.map((fileName) => `/public/audio/voice/algorithm/${encodeURIComponent(fileName)}`)
);

const voiceFileCache = new Map();
const lastVoiceByPool = new Map();
let currentVoiceAudio = null;
let currentPlayRequestId = 0;
let voiceAudioElement = null;
let voiceAudioUnlocked = false;
let voiceUnlockPromise = null;

function clampVoiceVolume(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(1, Math.max(0, number)) : DEFAULT_ALGORITHM_VOICE_VOLUME;
}

function loadAlgorithmVoiceVolume() {
  try {
    const stored = localStorage.getItem(ALGORITHM_VOICE_VOLUME_KEY);
    return stored === null ? DEFAULT_ALGORITHM_VOICE_VOLUME : clampVoiceVolume(stored);
  } catch (error) {
    return DEFAULT_ALGORITHM_VOICE_VOLUME;
  }
}

let algorithmVoiceVolume = loadAlgorithmVoiceVolume();

async function loadProfessorVoiceFiles(professorKey) {
  if (professorKey === "algorithm") {
    return ALGORITHM_VOICE_FILES;
  }

  if (voiceFileCache.has(professorKey)) {
    return voiceFileCache.get(professorKey);
  }

  try {
    const response = await fetch(`/api/voices/${encodeURIComponent(professorKey)}`);
    if (!response.ok) {
      voiceFileCache.set(professorKey, []);
      return [];
    }

    const data = await response.json();
    const files = Array.isArray(data.files) ? data.files : [];
    voiceFileCache.set(professorKey, files);
    return files;
  } catch (error) {
    voiceFileCache.set(professorKey, []);
    return [];
  }
}

function getProfessorVoiceFilesImmediately(professorKey) {
  if (professorKey === "algorithm") {
    return ALGORITHM_VOICE_FILES;
  }
  return voiceFileCache.get(professorKey) || null;
}

function getVoiceAudioElement() {
  if (!voiceAudioElement) {
    voiceAudioElement = new Audio();
    voiceAudioElement.preload = "auto";
  }
  return voiceAudioElement;
}

function chooseProfessorVoice(professorKey, files, eventName = "") {
  if (files.length === 0) {
    return "";
  }

  const normalizedEvent = String(eventName || "").toLowerCase();
  const prefixes = professorKey === "algorithm" ? ALGORITHM_VOICE_POOLS[normalizedEvent] : null;
  const eventFiles = prefixes
    ? files.filter((file) => prefixes.some((prefix) => decodeURIComponent(file).split("/").pop()?.startsWith(prefix)))
    : normalizedEvent
      ? files.filter((file) => file.toLowerCase().includes(normalizedEvent))
      : [];
  const sourceFiles = eventFiles.length > 0 ? eventFiles : files;

  if (sourceFiles.length === 1) {
    return sourceFiles[0];
  }

  const poolKey = `${professorKey}:${normalizedEvent || "default"}`;
  const lastVoice = lastVoiceByPool.get(poolKey);
  const candidates = sourceFiles.filter((file) => file !== lastVoice);
  const pool = candidates.length > 0 ? candidates : sourceFiles;
  const index = Math.floor(Math.random() * pool.length);
  const selected = pool[index];
  lastVoiceByPool.set(poolKey, selected);
  return selected;
}

function stopProfessorVoice() {
  currentPlayRequestId += 1;
  if (currentVoiceAudio) {
    currentVoiceAudio.pause();
    try {
      currentVoiceAudio.currentTime = 0;
    } catch (error) {
      // Some browsers reject currentTime changes before metadata is available.
    }
    currentVoiceAudio = null;
  }
  if (typeof stopLive2DMouthSync === "function") {
    stopLive2DMouthSync();
  }
}

function unlockProfessorVoice() {
  if (voiceAudioUnlocked) {
    return Promise.resolve(true);
  }
  if (voiceUnlockPromise) {
    return voiceUnlockPromise;
  }

  const voiceAudio = getVoiceAudioElement();
  const unlockRequestId = currentPlayRequestId;
  const previousVolume = voiceAudio.volume;
  voiceAudio.src = ALGORITHM_VOICE_FILES[0];
  voiceAudio.volume = 0;
  voiceAudio.muted = false;
  voiceUnlockPromise = voiceAudio.play()
    .then(() => {
      if (currentPlayRequestId !== unlockRequestId || currentVoiceAudio === voiceAudio) {
        voiceAudioUnlocked = true;
        return true;
      }
      voiceAudio.pause();
      voiceAudio.currentTime = 0;
      voiceAudio.volume = previousVolume;
      voiceAudioUnlocked = true;
      return true;
    })
    .catch(() => false)
    .finally(() => {
      voiceUnlockPromise = null;
    });
  return voiceUnlockPromise;
}

function getProfessorVoiceVolume(professorKey = "algorithm") {
  return professorKey === "algorithm" ? algorithmVoiceVolume : DEFAULT_PROFESSOR_VOICE_VOLUME;
}

function setProfessorVoiceVolume(value) {
  algorithmVoiceVolume = clampVoiceVolume(value);
  try {
    localStorage.setItem(ALGORITHM_VOICE_VOLUME_KEY, String(algorithmVoiceVolume));
  } catch (error) {
    // Storage can be unavailable in privacy modes; playback should still work.
  }
  if (currentVoiceAudio) {
    currentVoiceAudio.volume = algorithmVoiceVolume;
  }
  return algorithmVoiceVolume;
}

function startProfessorVoicePlayback(professorKey, eventName, files, requestId) {
  const voiceFile = chooseProfessorVoice(professorKey, files, eventName);
  if (!voiceFile || requestId !== currentPlayRequestId) {
    return Promise.resolve(false);
  }

  const voiceAudio = getVoiceAudioElement();
  voiceAudio.src = voiceFile;
  voiceAudio.volume = getProfessorVoiceVolume(professorKey);
  voiceAudio.muted = false;
  currentVoiceAudio = voiceAudio;
  voiceAudio.addEventListener("ended", () => {
    if (currentVoiceAudio === voiceAudio) {
      currentVoiceAudio = null;
      stopLive2DMouthSync?.();
    }
  }, { once: true });

  return voiceAudio.play()
    .then(() => {
      if (requestId !== currentPlayRequestId || currentVoiceAudio !== voiceAudio) {
        voiceAudio.pause();
        return false;
      }
      voiceAudioUnlocked = true;
      if (typeof startLive2DMouthSync === "function") {
        startLive2DMouthSync(voiceAudio, professorKey);
      }
      return true;
    })
    .catch(() => {
      if (currentVoiceAudio === voiceAudio) {
        currentVoiceAudio = null;
      }
      if (typeof stopLive2DMouthSync === "function") {
        stopLive2DMouthSync();
      }
      return false;
    });
}

async function playProfessorVoice(professorKey, eventName = "") {
  const requestId = currentPlayRequestId + 1;
  stopProfessorVoice();
  currentPlayRequestId = requestId;

  try {
    const immediateFiles = getProfessorVoiceFilesImmediately(professorKey);
    if (immediateFiles) {
      return startProfessorVoicePlayback(professorKey, eventName, immediateFiles, requestId);
    }

    const files = await loadProfessorVoiceFiles(professorKey);
    if (requestId !== currentPlayRequestId) {
      return false;
    }
    return startProfessorVoicePlayback(professorKey, eventName, files, requestId);
  } catch (error) {
    if (typeof stopLive2DMouthSync === "function") {
      stopLive2DMouthSync();
    }
    return false;
  }
}

function handleProfessorVoiceInstanceDetach(instance) {
  if (instance?.professorKey === "algorithm") {
    stopProfessorVoice();
  }
}

window.ProfessorVoiceController = Object.freeze({
  play: playProfessorVoice,
  stop: stopProfessorVoice,
  unlock: unlockProfessorVoice,
  getVolume: () => getProfessorVoiceVolume("algorithm"),
  setVolume: setProfessorVoiceVolume,
  getState: () => ({
    volume: getProfessorVoiceVolume("algorithm"),
    muted: Boolean(voiceAudioElement?.muted),
    paused: voiceAudioElement ? voiceAudioElement.paused : true,
    currentSrc: voiceAudioElement?.currentSrc || voiceAudioElement?.src || "",
    unlocked: voiceAudioUnlocked
  }),
  handleInstanceDetach: handleProfessorVoiceInstanceDetach
});

window.addEventListener("pagehide", stopProfessorVoice);
window.addEventListener("beforeunload", stopProfessorVoice);
