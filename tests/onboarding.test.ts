import test from "node:test";
import assert from "node:assert/strict";
import {
  analyzeLocally,
  interests,
  mergeJobFeedback,
  sampleJobs,
  segmentExperience,
} from "../src/onboarding";
import { buildCorpus, locateQuote, sanitizeModelOutput } from "../src/grounding";
import type { ConversationTurn } from "../src/types";

const MINSEOK =
  "조경학과에서 공원 설계를 했고, 컴퓨터공학과로 옮겨 팀 프로젝트에서 아이디어를 내고 기획안을 정리하는 역할을 맡았어요. 글 쓰는 걸 오래 좋아했습니다.";

const noScores = (value: unknown) =>
  !/matchScore|confidenceScore|matchedJobsCount|적합도|\d+\s*%/.test(
    JSON.stringify(value),
  );

// ── 원문 근거 추출 ──────────────────────────────────────────────

test("segmentation keeps landscape, park design, team planning and writing verbatim", () => {
  const spans = segmentExperience(MINSEOK);
  assert.deepEqual(spans, [
    "조경학과에서 공원 설계를 했고",
    "컴퓨터공학과로 옮겨 팀 프로젝트에서 아이디어를 내고 기획안을 정리하는 역할을 맡았어요",
    "글 쓰는 걸 오래 좋아했습니다",
  ]);
  for (const span of spans) assert.ok(MINSEOK.includes(span));
});

test("segmentation does not depend on a vocabulary list", () => {
  const unusual = "양봉장에서 벌통을 관리했고, 마을 축제 포스터를 그렸어요.";
  assert.deepEqual(segmentExperience(unusual), [
    "양봉장에서 벌통을 관리했고",
    "마을 축제 포스터를 그렸어요",
  ]);
});

// ── 인용 검증 (모델이 지어낸 근거를 걸러내는 장치) ───────────────

test("locateQuote accepts exact and whitespace-variant quotes and returns the original text", () => {
  assert.equal(locateQuote(MINSEOK, "공원 설계를 했고"), "공원 설계를 했고");
  assert.equal(locateQuote(MINSEOK, "공원설계를  했고"), "공원 설계를 했고");
});

test("locateQuote rejects paraphrased and invented quotes", () => {
  assert.equal(locateQuote(MINSEOK, "공원 디자인 프로젝트를 이끌었다"), null);
  assert.equal(locateQuote(MINSEOK, "UX 리서치 경험 3년"), null);
  assert.equal(locateQuote(MINSEOK, "글"), null);
  assert.equal(locateQuote(MINSEOK, ""), null);
});

// ── 체험 모드 (API 키 없음) ──────────────────────────────────────

test("demo mode with text only shows evidence but withholds judgment", () => {
  const result = analyzeLocally(MINSEOK, []);
  assert.equal(result.mode, "demo");
  assert.equal(result.hypotheses.length, 0);
  assert.ok(result.withheld?.includes("판단을 보류"));
  const quotes = result.evidence.map((span) => span.quote);
  assert.ok(quotes.some((quote) => quote.includes("공원 설계")));
  assert.ok(quotes.some((quote) => quote.includes("기획안")));
  assert.ok(quotes.some((quote) => quote.includes("글 쓰는")));
  assert.ok(result.questions.length > 0);
  for (const question of result.questions)
    assert.ok(question.evidenceIds.length > 0);
});

test("demo hypotheses come only from interests the user picked", () => {
  for (const interest of interests) {
    const result = analyzeLocally("", [interest.label]);
    assert.equal(result.hypotheses.length, 1);
    assert.equal(result.hypotheses[0].trackName, interest.role);
    assert.equal(result.hypotheses[0].status, "tentative");
    const ids = result.hypotheses[0].evidenceIds;
    assert.equal(
      result.evidence.find((span) => span.id === ids[0])?.quote,
      interest.label,
    );
  }
});

test("demo mode never infers a role from free text", () => {
  const result = analyzeLocally("React로 웹을 개발하고 GitHub에 올렸어요.", []);
  assert.equal(result.hypotheses.length, 0);
});

test("nothing to go on means no hypotheses and an explicit hold", () => {
  const result = analyzeLocally("", []);
  assert.deepEqual(result.hypotheses, []);
  assert.ok(result.withheld);
});

// ── 대화: 정정과 답변 ────────────────────────────────────────────

test("a correction removes the hypothesis the user rejected", () => {
  const before = analyzeLocally(MINSEOK, ["글쓰기·콘텐츠", "서비스 기획"]);
  const content = before.hypotheses.find((h) => h.trackName === "콘텐츠 마케터");
  assert.ok(content);
  const turns: ConversationTurn[] = [
    {
      id: "t1",
      kind: "correction",
      targetId: content.id,
      targetLabel: content.trackName,
      text: "글쓰기는 좋아하지만 마케팅 쪽은 아니에요.",
    },
  ];
  const after = analyzeLocally(MINSEOK, ["글쓰기·콘텐츠", "서비스 기획"], turns);
  assert.equal(
    after.hypotheses.some((h) => h.trackName === "콘텐츠 마케터"),
    false,
  );
  assert.ok(after.hypotheses.some((h) => h.trackName === "서비스 기획자"));
});

test("an answer becomes quotable evidence because the user wrote it", () => {
  const turns: ConversationTurn[] = [
    {
      id: "t1",
      kind: "answer",
      targetId: "q_demo_0",
      targetLabel: "무엇이 재미있었나요",
      text: "사람들이 머무는 동선을 상상하는 게 재미있었어요",
    },
  ];
  const result = analyzeLocally(MINSEOK, [], turns);
  const answer = result.evidence.find((span) => span.source === "answer");
  assert.equal(answer?.quote, "사람들이 머무는 동선을 상상하는 게 재미있었어요");
});

// ── AI 경로 후처리 (Gemini 응답을 흉내 내어 검증) ────────────────

test("model output keeps verified quotes and drops invented ones", () => {
  const corpus = buildCorpus(MINSEOK, [], []);
  const { result, dropped } = sanitizeModelOutput(
    {
      evidence: [
        { quote: "조경학과에서 공원 설계를 했고", source: "experience" },
        { quote: "기획안을 정리하는 역할을 맡았어요", source: "experience" },
        { quote: "UX 리서치를 3년간 진행", source: "experience" },
      ],
      hypotheses: [
        {
          trackName: "서비스 기획자",
          category: "기획",
          status: "supported",
          evidenceQuotes: ["기획안을 정리하는 역할을 맡았어요"],
          interpretation: "팀에서 아이디어를 기획안으로 정리한 역할이 기획 업무와 닮았어요.",
        },
        {
          trackName: "UX 리서처",
          category: "리서치",
          status: "supported",
          evidenceQuotes: ["UX 리서치를 3년간 진행"],
          interpretation: "리서치 경험이 많아요.",
        },
      ],
      questions: [],
      withheld: "",
    },
    corpus,
  );
  assert.equal(dropped, 1);
  assert.equal(result.evidence.length, 2);
  assert.deepEqual(
    result.hypotheses.map((h) => h.trackName),
    ["서비스 기획자"],
  );
  for (const span of result.evidence) assert.ok(MINSEOK.includes(span.quote));
});

test("model output with no surviving evidence becomes a hold, not a guess", () => {
  const { result } = sanitizeModelOutput(
    {
      evidence: [{ quote: "마케팅 캠페인을 운영했다", source: "experience" }],
      hypotheses: [
        {
          trackName: "마케터",
          category: "마케팅",
          status: "supported",
          evidenceQuotes: ["마케팅 캠페인을 운영했다"],
          interpretation: "",
        },
      ],
      questions: [
        {
          question: "공원 설계에서 어떤 단계가 가장 즐거웠나요?",
          why: "설계와 기획 중 어느 쪽에 끌리는지 알 수 있어요.",
          evidenceQuotes: [],
        },
      ],
      withheld: "",
    },
    buildCorpus(MINSEOK, [], []),
  );
  assert.equal(result.hypotheses.length, 0);
  assert.ok(result.withheld);
  assert.equal(result.questions.length, 1);
});

test("model status values outside the allowed set are downgraded to tentative", () => {
  const { result } = sanitizeModelOutput(
    {
      evidence: [{ quote: "글 쓰는 걸 오래 좋아했습니다", source: "experience" }],
      hypotheses: [
        {
          trackName: "에디터",
          category: "콘텐츠",
          status: "perfect_match",
          evidenceQuotes: ["글 쓰는 걸 오래 좋아했습니다"],
          interpretation: "오래 이어온 글쓰기 관심이 있어요.",
        },
      ],
      questions: [],
      withheld: "",
    },
    buildCorpus(MINSEOK, [], []),
  );
  assert.equal(result.hypotheses[0].status, "tentative");
});

test("a user's answer can ground a model hypothesis on the next turn", () => {
  const turns: ConversationTurn[] = [
    {
      id: "t1",
      kind: "answer",
      targetId: "q_ai_0",
      targetLabel: "공원 설계에서 무엇이 즐거웠나요",
      text: "도면보다 이용자 동선을 상상하는 게 재미있었어요",
    },
  ];
  const { result, dropped } = sanitizeModelOutput(
    {
      evidence: [
        { quote: "이용자 동선을 상상하는 게 재미있었어요", source: "answer" },
      ],
      hypotheses: [
        {
          trackName: "UX 기획자",
          category: "기획",
          status: "tentative",
          evidenceQuotes: ["이용자 동선을 상상하는 게 재미있었어요"],
          interpretation: "사람이 공간을 어떻게 쓰는지 상상하는 관심이 서비스 흐름 설계와 닮았어요.",
        },
      ],
      questions: [],
      withheld: "",
    },
    buildCorpus(MINSEOK, [], turns),
  );
  assert.equal(dropped, 0);
  assert.equal(result.hypotheses[0].trackName, "UX 기획자");
  assert.equal(result.evidence[0].source, "answer");
});

// ── 점수 없음 ────────────────────────────────────────────────────

test("no score or percentage appears anywhere in results or sample letters", () => {
  const demo = analyzeLocally(MINSEOK, ["서비스 기획", "글쓰기·콘텐츠"]);
  assert.ok(noScores(demo));
  assert.ok(noScores(sampleJobs(demo.hypotheses, demo.evidence)));
});

// ── 체험 공고 ────────────────────────────────────────────────────

test("sample letters quote the user's evidence and disclose they are examples", () => {
  const result = analyzeLocally(MINSEOK, ["서비스 기획"]);
  const [job] = sampleJobs(result.hypotheses, result.evidence);
  assert.ok(job.roleSummary?.includes("실제 모집 중인 공고가 아닙니다"));
  assert.deepEqual(job.pros, ["「서비스 기획」"]);
  assert.equal(JSON.stringify(job).includes("32편"), false);
});

test("reanalysis preserves saved and passed feedback even when direction changes", () => {
  const first = analyzeLocally("", ["디자인", "개발·기술"]);
  const oldJobs = sampleJobs(first.hypotheses, first.evidence);
  oldJobs[0].status = "saved";
  oldJobs[1].status = "passed";
  const second = analyzeLocally("", ["데이터·분석"]);
  const nextJobs = sampleJobs(second.hypotheses, second.evidence);
  const merged = mergeJobFeedback(oldJobs, nextJobs);
  assert.equal(merged.length, 3);
  assert.equal(merged.find((j) => j.id === oldJobs[0].id)?.status, "saved");
  assert.equal(merged.find((j) => j.id === oldJobs[1].id)?.status, "passed");
  assert.equal(mergeJobFeedback(merged, nextJobs).length, 3);
});

test("letter identity survives analysis IDs changing", () => {
  const track = analyzeLocally("", ["디자인"]).hypotheses[0];
  assert.equal(
    sampleJobs([track])[0].id,
    sampleJobs([{ ...track, id: "hyp_ai_7" }])[0].id,
  );
});
