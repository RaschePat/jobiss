import type {
  AnalysisResult,
  ClarifyingQuestion,
  ConversationTurn,
  EvidenceSpan,
  JobHypothesis,
  ReadingStatus,
} from "./types";

const READING_STATUS: ReadingStatus[] = [
  "supported",
  "tentative",
  "insufficient",
];

function normalizeWithMap(source: string) {
  let norm = "";
  const map: number[] = [];
  for (let i = 0; i < source.length; i += 1) {
    if (!/\s/.test(source[i])) {
      norm += source[i];
      map.push(i);
    }
  }
  return { norm, map };
}

/**
 * 인용문이 원문에 실제로 있으면 원문에서 그대로 잘라낸 문자열을, 없으면 null을 돌려준다.
 * 공백 차이만 허용한다. 모델이 바꿔 쓰거나 지어낸 인용은 여기서 걸러진다.
 */
export function locateQuote(source: string, quote: string): string | null {
  const trimmed = (quote || "").trim();
  if (trimmed.length < 2) return null;
  if (source.includes(trimmed)) return trimmed;
  const haystack = normalizeWithMap(source);
  const needle = normalizeWithMap(trimmed);
  if (needle.norm.length < 2) return null;
  const at = haystack.norm.indexOf(needle.norm);
  if (at === -1) return null;
  const start = haystack.map[at];
  const end = haystack.map[at + needle.norm.length - 1];
  return source.slice(start, end + 1);
}

/** 인용 검증의 기준이 되는 원문. 사용자가 직접 쓰거나 고른 것만 들어간다. */
export function buildCorpus(
  textInput: string,
  tags: string[],
  turns: ConversationTurn[],
): string {
  return [textInput, ...tags, ...turns.map((turn) => turn.text)]
    .filter(Boolean)
    .join("\n");
}

const DEFAULT_WITHHELD =
  "지금 남겨주신 내용만으로는 직무 방향을 말하기 어려워요. 아래 질문에 답해주시면 다시 살펴볼게요.";

/**
 * 모델 응답을 화면에 내보낼 수 있는 형태로 정리한다.
 *
 * - 원문에서 확인되지 않은 인용은 버린다.
 * - 확인된 근거가 하나도 없는 가설은 내보내지 않는다.
 * - 가설이 하나도 남지 않으면 판단 보류로 처리한다.
 */
export function sanitizeModelOutput(
  parsed: any,
  corpus: string,
): { result: AnalysisResult; dropped: number } {
  const spans: EvidenceSpan[] = [];
  const byQuote = new Map<string, string>();
  let dropped = 0;

  const rawEvidence: any[] = Array.isArray(parsed?.evidence)
    ? parsed.evidence
    : [];
  for (const item of rawEvidence.slice(0, 12)) {
    const asked = typeof item?.quote === "string" ? item.quote : "";
    const found = locateQuote(corpus, asked);
    if (!found) {
      dropped += 1;
      continue;
    }
    let span = spans.find((existing) => existing.quote === found);
    if (!span) {
      span = {
        id: `ev_ai_${spans.length}`,
        quote: found,
        source:
          item?.source === "interest"
            ? "interest"
            : item?.source === "answer"
              ? "answer"
              : "experience",
      };
      spans.push(span);
    }
    byQuote.set(asked.trim(), span.id);
    byQuote.set(found, span.id);
  }

  const resolveIds = (quotes: unknown): string[] => {
    if (!Array.isArray(quotes)) return [];
    const ids = new Set<string>();
    for (const quote of quotes) {
      if (typeof quote !== "string") continue;
      const direct = byQuote.get(quote.trim());
      if (direct) {
        ids.add(direct);
        continue;
      }
      const found = locateQuote(corpus, quote);
      const mapped = found ? byQuote.get(found) : undefined;
      if (mapped) ids.add(mapped);
    }
    return [...ids];
  };

  const hypotheses: JobHypothesis[] = (
    Array.isArray(parsed?.hypotheses) ? parsed.hypotheses : []
  )
    .slice(0, 4)
    .map((item: any, index: number) => ({
      id: `hyp_ai_${index}`,
      trackName: String(item?.trackName || "").trim().slice(0, 60),
      category: String(item?.category || "").trim().slice(0, 30),
      status: READING_STATUS.includes(item?.status)
        ? (item.status as ReadingStatus)
        : "tentative",
      evidenceIds: resolveIds(item?.evidenceQuotes),
      interpretation: String(item?.interpretation || "").trim().slice(0, 400),
    }))
    .filter(
      (item: JobHypothesis) => item.trackName && item.evidenceIds.length > 0,
    );

  const questions: ClarifyingQuestion[] = (
    Array.isArray(parsed?.questions) ? parsed.questions : []
  )
    .slice(0, 3)
    .map((item: any, index: number) => ({
      id: `q_ai_${index}`,
      question: String(item?.question || "").trim().slice(0, 300),
      why: String(item?.why || "").trim().slice(0, 300),
      evidenceIds: resolveIds(item?.evidenceQuotes),
    }))
    .filter((item: ClarifyingQuestion) => item.question);

  const modelWithheld =
    typeof parsed?.withheld === "string" ? parsed.withheld.trim() : "";
  const withheld = hypotheses.length
    ? modelWithheld || null
    : modelWithheld || DEFAULT_WITHHELD;

  return {
    result: { mode: "ai", evidence: spans, hypotheses, questions, withheld },
    dropped,
  };
}
