const VOICE_VOLUME = 0.5;

const voiceFileCache = new Map();
const lastVoiceByProfessorKey = new Map();

async function loadProfessorVoiceFiles(professorKey) {
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

function chooseProfessorVoice(professorKey, files, eventName = "") {
  if (files.length === 0) {
    return "";
  }

  const normalizedEvent = String(eventName || "").toLowerCase();
  const eventFiles = normalizedEvent
    ? files.filter((file) => file.toLowerCase().includes(normalizedEvent.toLowerCase()))
    : [];
  const sourceFiles = eventFiles.length > 0 ? eventFiles : files;

  if (sourceFiles.length === 1) {
    return sourceFiles[0];
  }

  const lastVoice = lastVoiceByProfessorKey.get(professorKey);
  const candidates = sourceFiles.filter((file) => file !== lastVoice);
  const pool = candidates.length > 0 ? candidates : sourceFiles;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

async function playProfessorVoice(professorKey, eventName = "") {
  try {
    const files = await loadProfessorVoiceFiles(professorKey);
    const voiceFile = chooseProfessorVoice(professorKey, files, eventName);

    if (!voiceFile) {
      return;
    }

    lastVoiceByProfessorKey.set(professorKey, voiceFile);

    const voiceAudio = new Audio(voiceFile);
    voiceAudio.volume = VOICE_VOLUME;
    voiceAudio.play().then(() => {
      if (typeof startLive2DMouthSync === "function") {
        startLive2DMouthSync(voiceAudio, professorKey);
      }
    }).catch(() => {
      if (typeof stopLive2DMouthSync === "function") {
        stopLive2DMouthSync();
      }
      // Missing files, unsupported audio, or autoplay limits should not interrupt study flow.
    });
  } catch (error) {
    if (typeof stopLive2DMouthSync === "function") {
      stopLive2DMouthSync();
    }
    // Voice playback is optional and must never break chat or timer features.
  }
}
