const PROFESSORS = {

  database: {

    subjectLabel: "데이터베이스",

    name: "시라토리 데에타",

    kanjiName: "白鳥 出絵太",

    personality: "밝고 적극적인 아가씨 강아지형",

    quote: "좋아! 관계 정리됐으면 다음 문제도 가자!",

    initial: "デ",

    mascot: {
      image: ""
    },

    royal: {
      live2dModel: "",
      fallbackSymbol: "デ",
      expressions: {
        default: "",
        happy: "",
        troubled: ""
      }
    },

    understandingCheck: {
      yes: "좋아! 이해했으면 바로 다음 문제도 같이 달려보자!",
      no: "괜찮아, 아직 페이스 조절 중인 거야. 어느 부분에서 막혔는지 말해줘!"
    },

    interactions: {
      touch: [
        { id: "database_touch_01", text: "좋아! 오늘 컨디션 괜찮아 보여. 바로 달려볼까?", expression: "smile", voiceEvent: "touch" },
        { id: "database_touch_02", text: "응? 불렀어? 데이터 정리는 내가 도와줄게!", expression: "smile", voiceEvent: "touch" }
      ],
      rapidTouch: [
        { id: "database_rapid_01", text: "잠깐, 너무 빠르잖아! 그래도 기세는 마음에 들어!", expression: "troubled", voiceEvent: "rapidTouch" }
      ]
    },

    questionIntro: [
      "좋아! 질문실 준비 완료! 막힌 부분부터 편하게 던져봐.",
      "오늘은 어떤 개념을 같이 정리해볼까? 천천히 말해줘!"
    ],

    dialogues: {
      select: "왔네! 좋아, 오늘도 같이 달려보자!",
      start: "좋아! 지금부터 한 세트 간다! 집중!",
      pause: "잠깐 쉬는 거지? 좋아, 물 한 모금 마시고 바로 돌아오자!",
      complete: "완주! 잘했어! 진짜 끝까지 해냈네!",
      break: "휴식 시간! 너무 오래 쉬면 내가 다시 끌고 온다?",
      reset: "괜찮아! 다시 출발하면 되지! 이번엔 더 깔끔하게 가자!"
    }

  },


  os: {

    subjectLabel: "운영체제",

    name: "아카기 시스타무",

    kanjiName: "赤城 志須太夢",

    gif: {
    idle: "/public/professor-gif/os/Idle.gif",
    smile: "/public/professor-gif/os/Smile.gif",
    troubled: "/public/professor-gif/os/Troubled.gif"
    },


    personality: "여유로운 인기인 갸루, 플레이어 한정 메가데레",

    quote: "뭐야, 또 나 보러 왔어? 공부하러 왔다고? 재미없게.",

    initial: "シ",

    mascot: {
      image: ""
    },

    royal: {
      live2dModel: "/public/modeldemo/Himikan%20Live2D%20%EC%9E%85%EB%AC%B8%EA%B0%95%EC%A2%8C%EC%9A%A9%20%EB%AA%A8%EB%8D%B8.model3.json",
      fallbackSymbol: "シ",
      expressions: {
        default: "",
        happy: "",
        troubled: ""
      }
    },

    understandingCheck: {
      yes: "응, 잘 따라왔네. ……뭐야, 그렇게 바로 이해하면 내가 좀 설레잖아.",
      no: "아, 아직 애매해? 괜찮아. 네가 헷갈린 부분, 나한테 다시 던져봐."
    },

    interactions: {
      touch: [
        { id: "os_touch_01", text: "뭐야, 불렀어? ……아니, 싫다는 건 아니고.", expression: "smile", voiceEvent: "touch" },
        { id: "os_touch_02", text: "지금은 네 요청만 우선순위 높게 잡아둘게.", expression: "smile", voiceEvent: "touch" }
      ],
      rapidTouch: [
        { id: "os_rapid_01", text: "야, 인터럽트 너무 자주 걸지 마! ……그래도 네 거면 봐줄게.", expression: "troubled", voiceEvent: "rapidTouch" }
      ]
    },

    questionIntro: [
      "왔네. 질문할 거 있으면 바로 말해. 내가 봐줄게.",
      "괜찮아, 어려운 부분부터 던져봐. 나한테 맡겨."
    ],

    dialogues: {
      select: "뭐야, 또 왔어? ……딱히 기다린 건 아니거든.",
      start: "좋아, 지금은 나한테만 집중해. 다른 프로세스는 전부 정지!",
      pause: "에이, 벌써 쉬어? ……뭐, 잠깐이면 괜찮아. 어디 가지는 마.",
      complete: "오, 끝까지 했네? 생각보다 멋있는데. ……아니, 그냥 그렇다고!",
      break: "컨텍스트 스위치~ 잠깐 쉬었다 와. 너무 늦으면 나 삐진다?",
      reset: "다시 시작하는 거야? 좋아. 이번엔 내가 끝까지 봐줄게."
    }

  },


  graphics: {

    subjectLabel: "컴퓨터그래픽스",

    name: "그라피쿠 이로하",

    kanjiName: "具羅比久 色葉",

    gif: {
    idle: "/public/professor-gif/graphics/Idle.gif",
    smile: "/public/professor-gif/graphics/Smile.gif",
    troubled: "/public/professor-gif/graphics/Troubled.gif"
    },

    personality: "차분하고 무표정한 프로페셔널 쿨데레",

    quote: "결과가 이상하면 입력부터 확인해. 감으로 고치지 말고.",

    initial: "イ",

    mascot: {
      image: ""
    },

    royal: {
      live2dModel: "/public/live2d/graphics/그라피쿠 - 라투디몸.model3.json",
      fallbackSymbol: "イ",
      expressions: {
        default: "",
        happy: "",
        troubled: ""
      }
    },

    understandingCheck: {
      yes: "좋아. 시야가 선명해졌다면 다음 단계로 넘어가도 돼.",
      no: "괜찮아. 흐릿한 부분을 정확히 짚어줘. 다시 렌더링해줄게."
    },

    interactions: {
      touch: [
        { id: "graphics_touch_01", text: "……응. 보고 있어. 질문할 거면 정확히 말해.", expression: "smile", voiceEvent: "touch" },
        { id: "graphics_touch_02", text: "시선이 흔들리면 결과도 흔들려. 천천히 가자.", expression: "smile", voiceEvent: "touch" }
      ],
      rapidTouch: [
        { id: "graphics_rapid_01", text: "너무 많이 누르면 샘플링 노이즈가 생겨. ……농담이야.", expression: "troubled", voiceEvent: "rapidTouch" }
      ]
    },

    questionIntro: [
      "질문 모드야. 흐릿한 부분이 있으면 정확히 짚어줘.",
      "좋아. 지금은 네 질문만 보자. 어디가 막혔어?"
    ],

    dialogues: {
      select: "……왔네. 시작할 거면 집중해.",
      start: "시야를 고정해. 지금부터는 흐트러지지 마.",
      pause: "잠깐 멈춰도 돼. 흐린 상태로 계속 보는 게 더 비효율적이니까.",
      complete: "……잘했어. 이 정도면 다음으로 넘어가도 돼.",
      break: "눈 쉬어. 먼 곳 보고 와. 돌아오면 계속하자.",
      reset: "괜찮아. 처음부터 다시 보면 더 선명하게 보일 때도 있으니까."
    }

  },


  algorithm: {

    subjectLabel: "알고리즘",

    name: "아루고 리즈무",

    kanjiName: "有瑠吾 理澄夢",

    hiraganaName: "あるご りずむ",

    romanizedName: "Arugo Rizumu",

    personality: "농담을 자주 던지지만 설명은 정확한 알고리즘 교수",

    quote: "O(n²)…… 컴퓨터한테 미안하지도 않습니까? 농담입니다.",

    initial: "ア",

    mascot: {
      image: ""
    },

    royal: {
      live2dModel: "",
      fallbackSymbol: "ア",
      expressions: {
        default: "",
        happy: "",
        troubled: ""
      }
    },

    understandingCheck: {
      yes: "좋습니다. 이제 브루트 포스 말고 더 예쁜 풀이도 볼 수 있겠네요. 농담입니다.",
      no: "괜찮습니다. 알고리즘은 원래 한 번에 안 잡힙니다. 어디서 꼬였는지 같이 풀죠."
    },

    interactions: {
      touch: [
        { id: "algorithm_touch_01", text: "부르셨습니까? 문제보다 저를 먼저 누르는 전략이네요. 농담입니다.", expression: "smile", voiceEvent: "touch" },
        { id: "algorithm_touch_02", text: "좋아요. 지금 질문하면 평균 시간복잡도는 꽤 괜찮을 겁니다.", expression: "smile", voiceEvent: "touch" }
      ],
      rapidTouch: [
        { id: "algorithm_rapid_01", text: "연타 알고리즘인가요? 효율은 낮지만 의지는 인정하겠습니다.", expression: "troubled", voiceEvent: "rapidTouch" }
      ]
    },

    questionIntro: [
      "좋습니다. 어떤 문제를 풀어볼까요? 너무 무서워하지는 말고요.",
      "질문을 던져보세요. 최적해는 아니어도 같이 개선해보면 됩니다."
    ],

    dialogues: {
      select: "왔습니까? 오늘은 어떤 문제를 괴롭혀볼까요. 물론 괴롭히는 건 문제만입니다.",
      start: "좋습니다. 지금부터 집중합니다. 시간복잡도처럼 시간도 아껴야죠.",
      pause: "잠깐 쉬는 건 허용합니다. 무한 루프만 아니면 됩니다.",
      complete: "잘했습니다. 방금 세션은 꽤 효율적이었어요. O(칭찬) 정도는 드리죠.",
      break: "휴식 시간입니다. 캐시도 비워야 다음 연산이 빨라집니다. 농담 반, 진담 반.",
      reset: "다시 시작합시다. 알고리즘도 한 번에 최적해가 나오진 않으니까요."
    }

  }

};

const SUBJECTS = [
  { key: "database", label: "데이터베이스" },
  { key: "os", label: "운영체제" },
  { key: "graphics", label: "컴퓨터그래픽스" },
  { key: "algorithm", label: "알고리즘" }
];

function setProfessorGif(state = "idle") {
  const professor = PROFESSORS[currentProfessorKey];
  const src = professor?.gif?.[state];
  const images = [
    document.getElementById("professorGif"),
    document.getElementById("focusProfessorGif"),
    document.getElementById("focusRoomProfessorGif")
  ].filter(Boolean);

  if (!src) {
    images.forEach((img) => {
      img.style.display = "none";
      img.removeAttribute("src");
    });
    document.body?.classList.remove("professor-gif-active");
    return;
  }

  document.body?.classList.add("professor-gif-active");
  images.forEach((img) => {
    img.style.display = "block";

    // 같은 GIF를 다시 선택해도 처음부터 재생되게 한다.
    img.src = "";
    requestAnimationFrame(() => {
      img.src = src;
    });
  });
}
