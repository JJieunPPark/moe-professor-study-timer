import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

dotenv.config({ override: true });

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("."));
app.use("/vendor/pixi.js", express.static(path.join(process.cwd(), "node_modules", "pixi.js", "dist")));
app.use("/vendor/naari-pixi-live2d-display", express.static(path.join(process.cwd(), "node_modules", "@naari3", "pixi-live2d-display", "dist")));
app.use("/public/modeldemo", express.static(path.join(process.cwd(), "public", "live2d", "modeldemo")));
app.use(
  "/public/live2d/graphics",
  express.static(path.join(process.cwd(), "public", "live2d", "graphics"))
);

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL
});

const professorKeys = new Set(["graphics", "database", "os", "algorithm"]);
const promptCache = new Map();
const COMMON_PROMPT_KEY = "__common__";

function normalizeProfessorKey(professorKey) {
  if (professorKey === "programming") {
    return "algorithm";
  }

  return professorKeys.has(professorKey) ? professorKey : "database";
}

function loadPromptTemplate(professorKey) {
  const safeProfessorKey = normalizeProfessorKey(professorKey);

  if (promptCache.has(safeProfessorKey)) {
    return promptCache.get(safeProfessorKey);
  }

  const promptPath = path.join(process.cwd(), "prompts", `${safeProfessorKey}.txt`);
  const template = fs.readFileSync(promptPath, "utf8");
  promptCache.set(safeProfessorKey, template);
  return template;
}

function loadCommonPromptTemplate() {
  if (promptCache.has(COMMON_PROMPT_KEY)) {
    return promptCache.get(COMMON_PROMPT_KEY);
  }

  const promptPath = path.join(process.cwd(), "prompts", "common.txt");
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
    const voiceDirectory = path.join(process.cwd(), "public", "audio", "voice", professorKey);
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
  const openingSoundDirectory = path.join(process.cwd(), "public", "audio", "opening");

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

app.post("/api/chat", async (req, res) => {
  const {
    professorKey,
    professorName,
    subjectLabel,
    question,
    studentProfile
  } = req.body || {};

  if (!professorKey || !professorName || !subjectLabel || !question) {
    return res.status(400).json({
      error: "professorKey, professorName, subjectLabel, question are required."
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OpenAI API key is not configured on the server."
    });
  }

  try {
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
      messages: [
        {
          role: "system",
          content: createFullSystemPrompt({
            professorKey,
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
    console.error("========== ERROR ==========");
    console.error(error);

    if (error.response) {
      console.error(error.response.status);
      console.error(error.response.data);
    }

    return res.status(500).json({
      error: "교수님 연구실 서버에서 답변을 생성하지 못했습니다."
    });
  }
});

app.listen(port, () => {
  console.log(`Professor Study Timer is running at http://localhost:${port}`);
});
