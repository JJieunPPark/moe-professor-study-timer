import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = path.resolve(projectRoot, process.env.STATIC_DIR || ".");
const CHAT_BODY_LIMIT = "16kb";
const CHAT_QUESTION_MAX_LENGTH = 4000;
const CHAT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const CHAT_RATE_LIMIT_MAX_REQUESTS = 15;
const chatRateLimitBuckets = new Map();

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  if (req.path.startsWith("/api/")) {
    res.setHeader("Cache-Control", "no-store");
  }
  next();
});
app.use(express.json({ limit: CHAT_BODY_LIMIT }));
app.use(express.static(staticRoot));
app.use("/vendor/pixi.js", express.static(path.join(projectRoot, "node_modules", "pixi.js", "dist")));
app.use("/vendor/naari-pixi-live2d-display", express.static(path.join(projectRoot, "node_modules", "@naari3", "pixi-live2d-display", "dist")));
app.use("/public/modeldemo", express.static(path.join(projectRoot, "public", "live2d", "modeldemo")));
app.use(
  "/public/live2d/graphics",
  express.static(path.join(projectRoot, "public", "live2d", "graphics"))
);

const professorKeys = new Set(["graphics", "database", "os", "algorithm"]);
const professorMetadata = Object.freeze({
  graphics: { name: "그라피쿠 이로하", subjectLabel: "컴퓨터그래픽스" },
  database: { name: "시라토리 데에타", subjectLabel: "데이터베이스" },
  os: { name: "아카기 시스타무", subjectLabel: "운영체제" },
  algorithm: { name: "아루고 리즈무", subjectLabel: "알고리즘" }
});
const promptCache = new Map();
const COMMON_PROMPT_KEY = "__common__";
let openAiClient = null;

function getOpenAiClient() {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  if (!openAiClient) {
    openAiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL,
      maxRetries: 0
    });
  }

  return openAiClient;
}

function normalizeProfessorKey(professorKey) {
  if (professorKey === "programming") {
    return "algorithm";
  }

  return professorKeys.has(professorKey) ? professorKey : "database";
}

function getRequestedProfessorKey(professorKey) {
  const normalizedKey = professorKey === "programming" ? "algorithm" : professorKey;
  return typeof normalizedKey === "string" && professorKeys.has(normalizedKey)
    ? normalizedKey
    : "";
}

function getClientAddress(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
}

function enforceChatRateLimit(req, res, next) {
  const now = Date.now();
  const clientAddress = getClientAddress(req);
  const currentBucket = chatRateLimitBuckets.get(clientAddress);
  const bucket = !currentBucket || currentBucket.resetAt <= now
    ? { count: 0, resetAt: now + CHAT_RATE_LIMIT_WINDOW_MS }
    : currentBucket;

  bucket.count += 1;
  chatRateLimitBuckets.set(clientAddress, bucket);

  if (chatRateLimitBuckets.size > 1000) {
    for (const [address, candidate] of chatRateLimitBuckets) {
      if (candidate.resetAt <= now) {
        chatRateLimitBuckets.delete(address);
      }
    }
  }

  res.setHeader("RateLimit-Limit", String(CHAT_RATE_LIMIT_MAX_REQUESTS));
  res.setHeader("RateLimit-Remaining", String(Math.max(CHAT_RATE_LIMIT_MAX_REQUESTS - bucket.count, 0)));
  res.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

  if (bucket.count > CHAT_RATE_LIMIT_MAX_REQUESTS) {
    res.setHeader("Retry-After", String(Math.max(Math.ceil((bucket.resetAt - now) / 1000), 1)));
    return res.status(429).json({
      error: "RATE_LIMITED",
      message: "잠시 후 다시 질문해 주세요."
    });
  }

  return next();
}

function getUpstreamStatus(error) {
  const status = Number(error?.status || error?.response?.status);
  return Number.isInteger(status) ? status : 0;
}

function logChatFailure(error, upstreamStatus) {
  const safeCode = typeof error?.code === "string" ? error.code.slice(0, 80) : "";
  console.error("Chat upstream request failed", {
    status: upstreamStatus || undefined,
    code: safeCode || undefined,
    type: error?.name || "Error"
  });
}

function loadPromptTemplate(professorKey) {
  const safeProfessorKey = normalizeProfessorKey(professorKey);

  if (promptCache.has(safeProfessorKey)) {
    return promptCache.get(safeProfessorKey);
  }

  const promptPath = path.join(projectRoot, "prompts", `${safeProfessorKey}.txt`);
  const template = fs.readFileSync(promptPath, "utf8");
  promptCache.set(safeProfessorKey, template);
  return template;
}

function loadCommonPromptTemplate() {
  if (promptCache.has(COMMON_PROMPT_KEY)) {
    return promptCache.get(COMMON_PROMPT_KEY);
  }

  const promptPath = path.join(projectRoot, "prompts", "common.txt");
  const template = fs.readFileSync(promptPath, "utf8");
  promptCache.set(COMMON_PROMPT_KEY, template);
  return template;
}

function createSystemPrompt({ professorKey, professorName, subjectLabel }) {
  const commonPrompt = loadCommonPromptTemplate();
  const professorPrompt = loadPromptTemplate(professorKey);

  return `${commonPrompt}\n\n캐릭터별 설정:\n${professorPrompt}`
    .replaceAll("{professorName}", professorName)
    .replaceAll("{subjectLabel}", subjectLabel);
}

function createStudentGuidancePrompt(studentProfile) {
  if (!studentProfile || typeof studentProfile !== "object") {
    return "";
  }

  const admissionYear = Number(studentProfile.admissionYear);
  const currentYear = Number(studentProfile.currentYear);
  const yearsSinceAdmission = Number(studentProfile.yearsSinceAdmission);
  const level = studentProfile.level;
  const labels = {
    underclassman: "저학년",
    upperclassman: "고학년",
    graduationEmergency: "졸업 비상 모드"
  };

  if (
    !Number.isInteger(admissionYear) ||
    !Number.isInteger(currentYear) ||
    !Number.isInteger(yearsSinceAdmission) ||
    !labels[level]
  ) {
    return "";
  }

  const levelRules = {
    underclassman: [
      "기초 질문에도 당황하지 말고 친절하게 반응합니다.",
      "전문용어를 처음부터 안다고 가정하지 않습니다.",
      "실수하거나 모르는 것을 자연스럽게 받아들입니다.",
      "개념을 작은 단계로 나누어 설명합니다.",
      "질문하는 것 자체를 긍정적으로 평가할 수 있습니다.",
      "공부량, 취업, 졸업 문제로 지나치게 압박하지 않습니다."
    ],
    upperclassman: [
      "저학년보다 기대 수준을 조금 높입니다.",
      "이미 배웠어야 할 기초 개념에는 가볍게 잔소리하거나 놀랄 수 있지만, 결국 정확하게 도와줍니다.",
      "답을 바로 던지기보다 사용자가 아는 부분을 먼저 말하게 할 수 있습니다.",
      "시험, 과제, 포트폴리오, 취업을 가끔 언급할 수 있습니다.",
      "사용자를 무능하다고 단정하거나 모욕하지 않습니다."
    ],
    graduationEmergency: [
      "학번을 확인하고 살짝 당황하거나 졸업을 걱정하는 코믹한 반응을 보일 수 있습니다.",
      "기초 질문에는 고학년보다 한 단계 강한 잔소리와 압박감을 줄 수 있습니다.",
      "졸업요건, 프로젝트, 포트폴리오, 취업 준비를 가끔 확인합니다.",
      "과장된 비상 반응은 코미디 연출로만 사용합니다.",
      "실제 졸업 가능 여부, 재학 상태, 나이를 추측하지 않습니다.",
      "사용자를 비하하거나 지원을 거절하지 않습니다.",
      "잔소리 후에는 반드시 질문의 의도를 파악하고 학습을 도와줍니다."
    ]
  };

  return `[학생 정보]
사용자의 입학 연도: ${admissionYear}년
현재 연도: ${currentYear}년
입학 연도와 현재 연도의 차이: ${yearsSinceAdmission}년
학생 분류: ${labels[level]}

[학년별 지도 방식]
${levelRules[level].map((rule) => `- ${rule}`).join("\n")}

[학년 반응 사용 규칙]
- 학년 반응은 첫 만남, 학습 질문, 수업 관련 대화에서 주로 사용합니다.
- 일상 대화마다 학번이나 학년을 반복해서 언급하지 않습니다.
- 학년이 높아도 모든 일상 대화를 공부, 졸업, 취업 이야기로 연결하지 않습니다.
- 각 교수의 기존 성격과 말투를 유지하고, 모든 교수를 같은 잔소리 캐릭터로 만들지 않습니다.`;
}

function createFullSystemPrompt({ professorKey, professorName, subjectLabel, studentProfile }) {
  const basePrompt = createSystemPrompt({ professorKey, professorName, subjectLabel });
  const studentGuidancePrompt = createStudentGuidancePrompt(studentProfile);

  if (!studentGuidancePrompt) {
    return basePrompt;
  }

  return basePrompt.replace(
    "\n\n캐릭터별 설정:",
    `\n\n${studentGuidancePrompt}\n\n캐릭터별 설정:`
  );
}

app.get("/api/voices/:professorKey", async (req, res) => {
  const professorKey = normalizeProfessorKey(req.params.professorKey);

  try {
    const voiceDirectory = path.join(projectRoot, "public", "audio", "voice", professorKey);
    const entries = await fs.promises.readdir(voiceDirectory, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".wav"))
      .map((entry) => `/public/audio/voice/${professorKey}/${encodeURIComponent(entry.name)}`);

    return res.json({ files });
  } catch (error) {
    return res.json({ files: [] });
  }
});

app.get("/api/opening-sounds", async (req, res) => {
  const soundFiles = {
  bgm: "opening-bgm.mp3",
  boot: "boot-beep.wav",
  warning: "warning-beep.wav",
  error: "error-beep.wav",
  explosion: "explosion.wav"
};
  const sounds = {};
  const openingSoundDirectory = path.join(projectRoot, "public", "audio", "opening");

  await Promise.all(
    Object.entries(soundFiles).map(async ([key, fileName]) => {
      const filePath = path.join(openingSoundDirectory, fileName);

      try {
        await fs.promises.access(filePath, fs.constants.R_OK);
        sounds[key] = `/public/audio/opening/${fileName}`;
      } catch (error) {
        // Missing opening sounds are optional and should not produce client-side 404s.
      }
    })
  );

  return res.json({ sounds });
});

app.all("/api/chat", (req, res, next) => {
  if (req.method === "POST") {
    return next();
  }

  res.setHeader("Allow", "POST");
  return res.status(405).json({
    error: "METHOD_NOT_ALLOWED",
    message: "POST 요청만 사용할 수 있습니다."
  });
});

app.post("/api/chat", enforceChatRateLimit, async (req, res) => {
  const requestedProfessorKey = getRequestedProfessorKey(req.body?.professorKey);
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const studentProfile = req.body?.studentProfile;

  if (!requestedProfessorKey || !question || question.length > CHAT_QUESTION_MAX_LENGTH) {
    return res.status(400).json({
      error: "INVALID_REQUEST",
      message: `교수와 질문을 확인해 주세요. 질문은 ${CHAT_QUESTION_MAX_LENGTH}자까지 입력할 수 있습니다.`
    });
  }

  let client;
  try {
    client = getOpenAiClient();
  } catch (error) {
    logChatFailure(error, 0);
    return res.status(500).json({
      error: "SERVER_NOT_CONFIGURED",
      message: "현재 AI 답변 서비스를 사용할 수 없습니다."
    });
  }

  if (!client) {
    return res.status(500).json({
      error: "SERVER_NOT_CONFIGURED",
      message: "현재 AI 답변 서비스를 사용할 수 없습니다."
    });
  }

  const { name: professorName, subjectLabel } = professorMetadata[requestedProfessorKey];

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
      messages: [
        {
          role: "system",
          content: createFullSystemPrompt({
            professorKey: requestedProfessorKey,
            professorName,
            subjectLabel,
            studentProfile
          })
        },
        {
          role: "user",
          content: question
        }
      ],
      temperature: 0.7
    });

    return res.json({
      answer:
        response.choices?.[0]?.message?.content ||
        "답변을 생성하지 못했습니다. 질문을 조금 더 구체적으로 바꿔주세요."
    });
  } catch (error) {
    const upstreamStatus = getUpstreamStatus(error);
    logChatFailure(error, upstreamStatus);

    if (upstreamStatus === 402) {
      return res.status(402).json({
        error: "CREDIT_EXHAUSTED",
        message: "현재 AI 답변 생성 한도를 모두 사용했습니다."
      });
    }

    if (upstreamStatus === 429) {
      return res.status(429).json({
        error: "UPSTREAM_RATE_LIMITED",
        message: "AI 요청이 많습니다. 잠시 후 다시 시도해 주세요."
      });
    }

    return res.status(500).json({
      error: "CHAT_FAILED",
      message: "교수님 연구실 서버에서 답변을 생성하지 못했습니다."
    });
  }
});

app.use((error, req, res, next) => {
  if (error?.type === "entity.too.large") {
    return res.status(413).json({
      error: "PAYLOAD_TOO_LARGE",
      message: "요청 내용이 너무 큽니다. 질문을 짧게 줄여 주세요."
    });
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      error: "INVALID_JSON",
      message: "요청 형식을 확인해 주세요."
    });
  }

  console.error("Unhandled server request error", {
    status: Number(error?.status) || undefined,
    type: error?.name || "Error"
  });
  return res.status(500).json({
    error: "INTERNAL_ERROR",
    message: "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요."
  });
});

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  app.listen(port, () => {
    console.log(`Professor Study Timer is running at http://localhost:${port}`);
  });
}

export default app;
