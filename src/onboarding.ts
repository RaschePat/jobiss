import type {
  AnalysisResult,
  ClarifyingQuestion,
  ConversationTurn,
  EvidenceSpan,
  JobHypothesis,
  JobPosting,
} from "./types";
import { initialJobPostings } from "./data/initialData";

export const interests = [
  {
    id: "content",
    label: "글쓰기·콘텐츠",
    hint: "생각을 이야기로 전하는 일",
    icon: "pen",
    role: "콘텐츠 마케터",
    category: "콘텐츠",
    next: "직접 만든 콘텐츠 하나를 골라, 누구를 위해 어떤 메시지를 담았는지 정리해 보세요.",
  },
  {
    id: "design",
    label: "디자인",
    hint: "더 나은 경험을 만드는 일",
    icon: "shapes",
    role: "UI/UX 디자이너",
    category: "디자인",
    next: "화면 하나를 골라, 사용자가 겪는 문제와 개선한 이유를 함께 정리해 보세요.",
  },
  {
    id: "planning",
    label: "서비스 기획",
    hint: "아이디어를 구체화하는 일",
    icon: "layout",
    role: "서비스 기획자",
    category: "기획",
    next: "불편했던 서비스 하나의 문제와 해결 아이디어를 한 페이지로 정리해 보세요.",
  },
  {
    id: "dev",
    label: "개발·기술",
    hint: "직접 만들고 작동시키는 일",
    icon: "code",
    role: "프론트엔드 개발자",
    category: "개발",
    next: "만든 기능 하나를 골라, 구현 과정과 해결한 문제를 README에 정리해 보세요.",
  },
  {
    id: "marketing",
    label: "마케팅·브랜딩",
    hint: "사람과 브랜드를 연결하는 일",
    icon: "megaphone",
    role: "마케팅 기획자",
    category: "마케팅",
    next: "관심 있는 브랜드의 캠페인 하나를 골라, 대상과 메시지, 성과 측정 방법을 적어 보세요.",
  },
  {
    id: "data",
    label: "데이터·분석",
    hint: "숫자 속에서 답을 찾는 일",
    icon: "chart",
    role: "데이터 분석가",
    category: "데이터",
    next: "작은 데이터셋으로 질문 하나를 정하고, 분석 결과를 차트와 함께 설명해 보세요.",
  },
  {
    id: "research",
    label: "리서치·탐구",
    hint: "질문하고 깊이 이해하는 일",
    icon: "search",
    role: "UX 리서처",
    category: "리서치",
    next: "주변 사람의 서비스 사용 경험을 인터뷰하고, 관찰한 사실과 해석을 나눠 적어 보세요.",
  },
  {
    id: "people",
    label: "소통·운영",
    hint: "사람과 일을 함께 움직이는 일",
    icon: "people",
    role: "커뮤니티 매니저",
    category: "운영",
    next: "함께한 활동 하나에서 본인의 역할, 조율했던 일, 달라진 결과를 기록해 보세요.",
  },
] as const;

export const MAX_EXPERIENCE = 2000;
export const MAX_TURNS = 40;

/**
 * 사용자가 쓴 문장을 구두점 기준으로 쪼갠다.
 * 의미를 해석하지 않고 원문 그대로 잘라내기만 한다. 사전이나 키워드 목록을 쓰지 않으므로
 * 조경학과든 공원 설계든 목록에 없는 말도 그대로 남는다.
 */
export function segmentExperience(text: string): string[] {
  return (text || "")
    .split(/[.!?\n·;]+|,\s*/g)
    .map((part) => part.trim().replace(/^[·\-–—]\s*/, ""))
    .filter((part) => part.length >= 4)
    .slice(0, 12);
}

function buildEvidence(
  textInput: string,
  tags: string[],
  turns: ConversationTurn[],
): EvidenceSpan[] {
  const spans: EvidenceSpan[] = [];
  segmentExperience(textInput).forEach((quote, index) => {
    spans.push({ id: `ev_exp_${index}`, quote, source: "experience" });
  });
  tags.forEach((tag, index) => {
    spans.push({ id: `ev_tag_${index}`, quote: tag, source: "interest" });
  });
  turns.forEach((turn, index) => {
    const quote = (turn.text || "").trim();
    if (quote.length >= 2)
      spans.push({ id: `ev_turn_${index}`, quote, source: "answer" });
  });
  return spans;
}

function demoQuestions(evidence: EvidenceSpan[]): ClarifyingQuestion[] {
  return evidence
    .filter((span) => span.source === "experience")
    .slice(0, 3)
    .map((span, index) => ({
      id: `q_demo_${index}`,
      question: `「${span.quote}」 — 이 일에서 가장 재미있었던 부분은 무엇이었나요?`,
      why: "같은 경험도 무엇이 즐거웠는지에 따라 이어지는 직무가 달라져요.",
      evidenceIds: [span.id],
    }));
}

/**
 * API 키가 없을 때 쓰는 체험 모드.
 *
 * 사용자가 쓴 문장은 근거로 그대로 보여주되 의미를 해석하지 않는다.
 * 직무 가설은 사용자가 직접 고른 관심에서만 만든다. 그건 추론이 아니라 사용자의 선택이기 때문이다.
 * 나머지는 판단을 보류하고 질문으로 돌린다.
 */
export function analyzeLocally(
  textInput: string,
  tags: string[],
  turns: ConversationTurn[] = [],
): AnalysisResult {
  const evidence = buildEvidence(textInput, tags, turns);
  const rejected = new Set(
    turns.filter((turn) => turn.kind === "correction").map((turn) => turn.targetId),
  );
  const hypotheses: JobHypothesis[] = tags
    .map((tag) => interests.find((item) => item.label === tag))
    .filter((item): item is (typeof interests)[number] => Boolean(item))
    .map((item) => ({
      id: `demo_${item.id}`,
      trackName: item.role,
      category: item.category,
      status: "tentative" as const,
      evidenceIds: evidence
        .filter((span) => span.source === "interest" && span.quote === item.label)
        .map((span) => span.id),
      interpretation: `직접 고르신 '${item.label}' 관심에서 이어지는 방향이에요. 체험 모드는 적어주신 문장을 해석하지 않으니, 이 방향이 맞는지는 질문에 답하거나 AI 분석을 연결해 확인해 주세요.`,
    }))
    .filter((hypothesis) => !rejected.has(hypothesis.id));

  const wroteExperience = evidence.some((span) => span.source === "experience");
  const withheld = !hypotheses.length
    ? wroteExperience
      ? "적어주신 문장에서 근거는 찾았지만, 체험 모드에서는 그 의미를 해석하지 않아요. 어떤 직무와 이어지는지는 판단을 보류했어요."
      : "아직 판단할 근거가 없어요. 해본 일을 한 줄 적거나 관심을 하나 골라주세요."
    : wroteExperience
      ? "적어주신 문장은 근거로만 담아두었어요. 문장의 의미 해석은 AI 분석을 연결해야 할 수 있어요."
      : null;

  return {
    mode: "demo",
    evidence,
    hypotheses,
    questions: demoQuestions(evidence),
    withheld,
  };
}

export function sampleJobs(
  tracks: JobHypothesis[],
  evidence: EvidenceSpan[] = [],
): JobPosting[] {
  const quoteOf = (id: string) =>
    evidence.find((span) => span.id === id)?.quote || "";
  return tracks.map((track) => {
    const interest = interests.find(
      (item) =>
        item.category === track.category || track.trackName.includes(item.role),
    );
    const source = initialJobPostings.find(
      (job) => job.category === track.category,
    );
    const quotes = track.evidenceIds.map(quoteOf).filter(Boolean);
    return {
      id: `sample_${track.category}_${track.trackName}`,
      company: source?.company || "넥스트팀",
      companyInitial: source?.companyInitial || "nt",
      companyLogoBg: "",
      title: track.trackName,
      category: track.category,
      location: source?.location || "서울 · 하이브리드",
      tags: quotes.slice(0, 3),
      arrivalReason: track.interpretation,
      pros: quotes.length
        ? quotes.map((quote) => `「${quote}」`)
        : ["아직 이 방향을 뒷받침할 원문 근거가 없어요."],
      checkPoints: [
        "관심만으로 실무 역량을 판단할 수는 없어요. 직접 해본 일과 맡았던 역할을 확인해 보세요.",
        "실제 지원 전에는 기업의 원문 공고에서 모집 여부와 필수 요건을 확인해야 해요.",
      ],
      evidences: quotes,
      preparationTips: [
        interest?.next ||
          "대표 경험 하나를 골라 본인의 역할과 해결 과정, 결과를 정리해 보세요.",
      ],
      status: "arrived_new",
      receivedAt: "방금 도착",
      experienceLevel: "신입·주니어",
      roleSummary: `${track.trackName} 직무의 연결 이유와 준비 방향을 살펴보는 체험 공고예요. 실제 모집 중인 공고가 아닙니다.`,
    };
  });
}

export function mergeJobFeedback(
  previous: JobPosting[],
  incoming: JobPosting[],
): JobPosting[] {
  const next = incoming.map((job) => ({
    ...job,
    status: previous.find((old) => old.id === job.id)?.status || job.status,
  }));
  const historical = previous.filter(
    (old) =>
      (old.status === "saved" || old.status === "passed") &&
      !next.some((job) => job.id === old.id),
  );
  return [...next, ...historical];
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

export function isAnalysisResult(data: unknown): data is AnalysisResult {
  const value = data as AnalysisResult;
  return Boolean(
    value &&
      (value.mode === "ai" || value.mode === "demo") &&
      Array.isArray(value.evidence) &&
      value.evidence.every(
        (span) =>
          span && typeof span.id === "string" && typeof span.quote === "string",
      ) &&
      Array.isArray(value.hypotheses) &&
      value.hypotheses.every(
        (hypothesis) =>
          hypothesis &&
          typeof hypothesis.id === "string" &&
          typeof hypothesis.trackName === "string" &&
          typeof hypothesis.category === "string" &&
          typeof hypothesis.interpretation === "string" &&
          isStringArray(hypothesis.evidenceIds),
      ) &&
      Array.isArray(value.questions) &&
      value.questions.every(
        (question) =>
          question &&
          typeof question.id === "string" &&
          typeof question.question === "string" &&
          isStringArray(question.evidenceIds),
      ) &&
      (value.withheld === null || typeof value.withheld === "string"),
  );
}

export async function requestAnalysis(
  textInput: string,
  selectedTags: string[],
  turns: ConversationTurn[],
  signal: AbortSignal,
): Promise<AnalysisResult> {
  const response = await fetch("/api/ai/analyze-experience", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ textInput, selectedTags, turns }),
  });
  if (!response.ok)
    throw new Error("분석을 마치지 못했어요. 잠시 후 다시 시도해 주세요.");
  const data = await response.json();
  if (!isAnalysisResult(data))
    throw new Error("분석 결과를 읽지 못했어요. 다시 시도해 주세요.");
  return data;
}
