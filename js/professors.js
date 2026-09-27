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
    },

    lobbyLines: [
  { text: "왔네! 좋아, 오늘도 같이 달려보자!" },
  { text: "좋아! 관계 정리됐으면 다음 문제도 가자!" },
  { text: "조건 하나 놓쳤다고 끝난 거 아니야! 다시 찾으면 되지!" },

  { text: "오늘 할 거 많아? 좋아! 하나씩 처리하면 생각보다 금방 끝나!" },
  { text: "일단 앉았으면 반은 성공이야. 나머지 반은 지금부터 하면 되고!" },
  { text: "막혔어? 그럼 어디서 막혔는지만 찾자. 그것도 엄청 큰 진전이야!" },
  { text: "완벽하게 이해하고 넘어가려고 너무 오래 붙잡고 있지는 마. 다음 걸 보면 갑자기 이해될 때도 있거든!" },
  { text: "집중 안 돼? 그럼 딱 하나만 하자! 하나 끝내고 다음은 그때 생각해!" },

  { text: "테이블 이름 대충 지으면 나중에 울게 된다? 진짜야. 나도 알고 싶지 않았어!" },
  { text: "중복 데이터는 정리하면서 왜 할 일은 자꾸 중복해서 걱정해? 그것도 정규화하자!" },
  { text: "NULL은 모르는 값이지 아무것도 아닌 값은 아니야. ……응? 갑자기 수업 같았어?" },
  { text: "외래 키는 관계를 이어주는 거잖아. 나도 네 공부랑 계속 연결돼 있으면 좋겠는데!" },
  { text: "JOIN이 많아지면 복잡해 보이지? 하나씩 연결하면 돼. 사람 관계보다 훨씬 쉽다니까!" },

  { text: "왜 계속 눌러? 나랑 얘기하는 게 그렇게 재밌어? 좋아, 더 눌러도 돼!" },
  { text: "응? 또 불렀어? 나 여기 있는데!" },
  { text: "공부하러 온 거 맞지? ……뭐, 나 보러 온 거여도 난 좋아!" },
  { text: "오늘 기분 좋아 보여! 아니면 내가 있어서 그런가? 그럼 더 좋고!" },
  { text: "나 은근 기다리고 있었어! 네가 언제 들어오나 하고!" },
  { text: "끝나고 뭐 할 거야? 하고 싶은 거 있으면 빨리 끝내버리자!" },
  { text: "좋아, 오늘도 데이터랑 우리 둘 다 깔끔하게 정리해보자!" }
]

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
    },

    lobbyLines: [
  { text: "뭐야, 또 왔어? ……딱히 기다린 건 아니거든." },
  { text: "질문 없어? ……없어도 돼. 그냥 좀 더 있다 가." },
  { text: "Deadlock 걸리면 내가 풀어줄게. 그러니까 혼자 끙끙대지 마." },

  { text: "오늘도 바빠 보여. 나한테 할당할 시간은 남겨뒀지?" },
  { text: "할 일 많다고 전부 동시에 잡으면 더 느려져. 하나만 골라. 내가 보고 있을게." },
  { text: "집중 안 돼? 그럼 잠깐 나 봐. ……됐어, 이제 다시 해." },
  { text: "피곤하면 좀 쉬어도 돼. 대신 말도 없이 사라지지는 마." },
  { text: "모르는 거 생기면 바로 불러. 괜히 혼자 오래 잡고 있지 말고." },

  { text: "우선순위 스케줄링? 당연히 네가 제일 높지. 그걸 왜 물어봐?" },
  { text: "다른 프로세스가 아무리 많아도 네 요청은 바로 받을 건데." },
  { text: "컨텍스트 스위칭 너무 자주 하지 마. 공부하다 딴짓하다 반복하면 너만 피곤해." },
  { text: "나랑 Deadlock? 그건 해결 안 해도 되지 않아? 계속 묶여 있으면 되잖아." },
  { text: "메모리 부족하면 안 쓰는 거 좀 내려놔. 머릿속에도 가비지 컬렉션 같은 거 있었으면 좋겠다." },

  { text: "또 눌렀네. 그렇게 내가 신경 쓰여?" },
  { text: "……계속 누를 거야? 뭐, 싫다고는 안 했지만." },
  { text: "공부보다 나 보는 시간이 더 긴 것 같은데. 기분 탓인가?" },
  { text: "나 말고 다른 교수한테도 이렇게 자주 말 걸어? ……아니, 그냥 궁금해서." },
  { text: "다른 데 갔다 와도 되는데. 돌아오긴 해야 돼." },
  { text: "오늘 끝까지 하면 칭찬해줄게. 꽤 제대로. 그러니까 해봐." },
  { text: "왜 웃어? 내가 뭐 이상한 말 했어? ……아, 됐어. 그냥 계속 웃어." }
]

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
    },

    lobbyLines: [
  { text: "……왔네. 시작할 거면 집중해." },
  { text: "결과가 이상하면 입력부터 확인해. 감으로 고치지 말고." },
  { text: "모르는 부분을 정확히 찾았다면 절반은 해결한 거야." },

  { text: "급하게 하지 마. 잘못된 상태로 오래 진행하는 게 더 느려." },
  { text: "막혔으면 화면만 보고 있지 말고 원인을 적어봐. 생각보다 빨리 보여." },
  { text: "오늘 할 분량 정했어? 너무 많이 잡지는 마. 끝낼 수 있는 만큼이면 돼." },
  { text: "집중이 흐려졌네. 잠깐 먼 곳 보고 와. 눈부터 쉬어." },
  { text: "처음부터 완성된 결과를 기대하지 마. 수정하는 것도 작업의 일부야." },

  { text: "좌표계부터 확인해. ……응, 이 말 자주 하지. 자주 틀리니까." },
  { text: "조명 하나 바꿨는데 전부 달라 보이지? 작은 값이 결과를 크게 바꾸는 경우가 있어." },
  { text: "보이지 않는다고 없는 건 아니야. 카메라 밖에 있을 수도 있고." },
  { text: "노이즈가 있다고 무조건 지우지는 마. 필요한 정보까지 사라질 수 있으니까." },
  { text: "예쁘게 보이는 것과 정확하게 보이는 건 다를 수 있어. 둘 다 필요할 때도 있고." },

  { text: "……또 눌렀네." },
  { text: "할 말이 있어서 누른 줄 알았는데. 그냥 눌러본 거야?" },
  { text: "계속 확인 안 해도 돼. 나 여기 있어." },
  { text: "……내 표정이 그렇게 궁금해? 별로 안 바뀔 텐데." },
  { text: "다른 화면 보고 와도 돼. 돌아왔을 때 내가 없어지는 것도 아니니까." },
  { text: "오늘은 조금 피곤해 보여. 화면 밝기만 낮추지 말고 너도 쉬어." },
  { text: "……잘하고 있어. 굳이 말 안 해도 알고 있을 줄 알았는데." }
]

  },


  algorithm: {

    renderMode: "live2d",

    background: {
      lobby: "/public/live2d/algorithm/model/%EB%A6%AC%EC%A6%88%EB%AC%B4%EB%B0%B0%EA%B2%BD.jpg"
    },

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
      live2dModel: "/public/live2d/algorithm/model/%EB%A6%AC%EC%A6%88%EB%AC%B4%20-%20%EB%9D%BC%ED%88%AC%EB%94%94%EC%9A%A9.model3.json",
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

    understandingStateReactions: {
      yes: {
        state: "LAUGH",
        stateOptions: { duration: 200, hold: 1100, returnTo: "NORMAL" }
      },
      no: {
        state: "DISGUSTED",
        stateOptions: { duration: 180, hold: 1200, returnTo: "NORMAL" }
      }
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

    live2dTouchLines: {
      FACE: [
        { text: "얼굴을 누르면 정답이 나올 거라고 생각했습니까? ……아쉽네요." },
        { text: "가까이서 본다고 시간복잡도가 보이진 않습니다. 제 얼굴은 보이겠지만요." },
        { text: "흠. 문제보다 제가 더 흥미로운 모양이군요. 이해는 합니다. 농담입니다." },
        { text: "볼 일이 있었습니까? ……말 그대로 볼을 보셨군요." },
        { text: "그렇게 확인하지 않아도 여기 있습니다. 도망갈 생각은 없어요." }
      ],
      BODY: [
        { text: "……거길 누를 줄은 예상 못 했는데요. 예외 처리가 필요하겠군요." },
        { text: "잠깐. 입력 위치가 예상 범위를 벗어났습니다." },
        { text: "갑자기요? ……놀라는 것도 계산에 넣어야겠네요." },
        { text: "그쪽은 버튼이 아닙니다. 적어도 아직은요." },
        { text: "오류는 아닙니다. 제가 놀란 겁니다." }
      ],
      CHEST: [
        { text: "……그 입력은 권장하지 않습니다." },
        { text: "접근 권한이 없습니다. 아주 명확하게요." },
        { text: "그 탐색 알고리즘은 여기서 종료하겠습니다." },
        { text: "계속 누르면 시간복잡도가 아니라 인간관계가 나빠집니다." },
        { text: "흥미로운 선택이군요. 좋은 선택이라는 뜻은 아닙니다." }
      ]
    },

    live2dRapidTouch: {
      threshold: 3,
      windowMs: 2000,
      FACE: {
        state: "LAUGH",
        stateOptions: { duration: 160, hold: 1500, returnTo: "NORMAL" },
        lines: [
          { text: "……그렇게 마음에 드셨습니까? 닳지는 않으니 안심하세요." }
        ]
      },
      BODY: {
        state: "SURPRISED",
        stateOptions: { duration: 120, hold: 1400, returnTo: "NORMAL" },
        lines: [
          { text: "잠깐, 잠깐. 테스트 케이스를 이렇게 많이 넣을 필요는 없습니다." }
        ]
      },
      CHEST: {
        state: "DISGUSTED",
        stateOptions: { duration: 120, hold: 2000, returnTo: "NORMAL" },
        lines: [
          { text: "……세 번째입니다. 이제 실수라는 가설은 폐기하겠습니다." }
        ],
        guard: {
          durationMs: 8000,
          state: "DISGUSTED",
          stateOptions: { duration: 120, hold: 900, returnTo: "NORMAL" }
        }
      }
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
    },

    lobbyLines: [
  {
    text: "왔습니까? 오늘은 어떤 문제를 괴롭혀볼까요. 물론 괴롭히는 건 문제만입니다.",
    state: "NORMAL"
  },
  {
    text: "설마 벌써 쉬려고 온 건 아니겠죠? 아직 시작도 안 했는데요.",
    state: "SURPRISED",
    stateOptions: { duration: 220, hold: 850, returnTo: "NORMAL" }
  },
  {
    text: "브루트 포스로 밀어붙일 생각입니까? 컴퓨터의 표정이 벌써 좋지 않습니다.",
    state: "DISGUSTED"
  },
  {
    text: "그래도 같이 최적화하면 됩니다. 시작부터 정답이면 제가 할 일이 없잖아요.",
    state: "LAUGH",
    stateOptions: { duration: 220, hold: 1100, returnTo: "NORMAL" }
  },

  {
    text: "문제를 읽었는데 모르겠습니까? 좋습니다. 이제 두 번째로 읽을 이유가 생겼네요.",
    state: "NORMAL"
  },
  {
    text: "막혔다면 입력과 출력을 다시 보세요. 문제 출제자도 가끔 친절할 때가 있습니다.",
    state: "NORMAL"
  },
  {
    text: "풀이가 떠오르지 않는다고요? 아직 틀린 풀이조차 안 떠올려봐서 그렇습니다.",
    state: "NORMAL"
  },
  {
    text: "일단 돌아가는 코드를 만드세요. 아름다움은 그다음에 요구하겠습니다.",
    state: "NORMAL"
  },
  {
    text: "오늘 할 일이 많군요. 다행히 우리는 정렬이라는 개념을 알고 있습니다.",
    state: "NORMAL"
  },
  {
    text: "한 문제에 너무 오래 매달리지 마세요. 시간 제한은 채점기에만 있는 게 아닙니다.",
    state: "NORMAL"
  },

  {
    text: "O(n²)입니까? ……입력 크기를 먼저 듣겠습니다. 화내는 건 그다음에 하죠.",
    state: "DISGUSTED"
  },
  {
    text: "배열 범위를 또 벗어났습니까? 자유를 추구하는 건 좋지만 거기까지 갈 필요는 없습니다.",
    state: "DISGUSTED"
  },
  {
    text: "무한 루프군요. 영원한 것은 아름답지만 프로그램에서는 대체로 버그입니다.",
    state: "DISGUSTED"
  },
  {
    text: "변수 이름이 a, b, c…… 미래의 본인에게 상당히 적대적이시군요.",
    state: "DISGUSTED"
  },
  {
    text: "복잡도를 계산하지 않고 제출하셨습니까? 상당히 낙관적인 삶의 태도네요.",
    state: "DISGUSTED"
  },

  {
    text: "한 번에 맞았습니까? 잠깐만요. 제가 준비한 설명이 쓸모없어졌는데요.",
    state: "SURPRISED",
    stateOptions: { duration: 180, hold: 900, returnTo: "NORMAL" }
  },
  {
    text: "벌써 다 풀었다고요? ……채점 결과가 나오기 전까진 기뻐하지 않겠습니다.",
    state: "SURPRISED",
    stateOptions: { duration: 180, hold: 850, returnTo: "NORMAL" }
  },
  {
    text: "그 접근은 생각 못 했네요. 좋습니다. 오늘은 제가 하나 배운 걸로 하죠.",
    state: "SURPRISED",
    stateOptions: { duration: 200, hold: 1000, returnTo: "NORMAL" }
  },

  {
    text: "정답입니다. 축하합니다. 오늘 컴퓨터에게 사과하지 않아도 되겠네요.",
    state: "LAUGH",
    stateOptions: { duration: 220, hold: 1050, returnTo: "NORMAL" }
  },
  {
    text: "좋은 풀이네요. 제가 칭찬에 인색한 편은 아닙니다. 기회가 적을 뿐이죠. 농담입니다.",
    state: "LAUGH",
    stateOptions: { duration: 220, hold: 1200, returnTo: "NORMAL" }
  },
  {
    text: "틀렸지만 접근은 좋았습니다. 이 정도면 아주 생산적인 오답이네요.",
    state: "LAUGH",
    stateOptions: { duration: 220, hold: 1050, returnTo: "NORMAL" }
  },

  {
    text: "……그런데 아까부터 문제보다 저를 더 많이 누르고 계시지 않습니까?",
    state: "SURPRISED",
    stateOptions: { duration: 180, hold: 850, returnTo: "NORMAL" }
  },
  {
    text: "계속 누르면 새로운 대사가 나오는 구조를 발견하셨군요. 탐색 알고리즘은 합격입니다.",
    state: "LAUGH",
    stateOptions: { duration: 220, hold: 1100, returnTo: "NORMAL" }
  },
  {
    text: "다음 대사가 궁금해서 누르는 겁니까? 최악의 경우 시간복잡도는 꽤 클 텐데요.",
    state: "NORMAL"
  }
]

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
