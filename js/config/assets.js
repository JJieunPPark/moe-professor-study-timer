const UI_ART_ASSETS = {
  homeFrame: "/art/prototypes/home-frame.svg",
  studentRecord: "/art/prototypes/student-record.svg",
  questionRoomBackground: "/art/prototypes/question-room-bg.svg",
  focusRoomBackground: "/art/prototypes/focus-room-bg.svg",
  touchEffect: "/art/prototypes/touch-effect-placeholder.svg"
};

const ART_ASSETS = {
  lobby: {},
  question: {
    background: UI_ART_ASSETS.questionRoomBackground
  },
  common: {
    touchEffect: UI_ART_ASSETS.touchEffect
  }
};

const PROFESSOR_ART_ASSETS = {
  database: {
    decoration: "/art/prototypes/database-decoration.svg"
  },
  os: {
    decoration: "/art/prototypes/os-decoration.svg",
    operator: "/art/prototypes/operator-placeholder.svg"
  },
  graphics: {
    decoration: "/art/prototypes/graphics-decoration.svg"
  },
  algorithm: {
    decoration: "/art/prototypes/algorithm-decoration.svg"
  }
};

function getProfessorArtAsset(professorKey, slot) {
  return PROFESSOR_ART_ASSETS[professorKey]?.[slot] || "";
}

window.UI_ART_ASSETS = UI_ART_ASSETS;
window.ART_ASSETS = ART_ASSETS;
window.PROFESSOR_ART_ASSETS = PROFESSOR_ART_ASSETS;
window.getProfessorArtAsset = getProfessorArtAsset;
