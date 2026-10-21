/**
 * 해석의 확실성 등급. 화면에서 근거와 해석을 구분해 보여주기 위해 쓴다.
 * - supported: 사용자가 쓴 문장에 직접 근거가 있음
 * - tentative: 근거가 있지만 다른 해석도 가능함
 * - insufficient: 판단을 보류함. 추가 정보가 필요함
 */
export type ReadingStatus = "supported" | "tentative" | "insufficient";

/** 사용자가 직접 쓴 문장에서 그대로 떼어낸 조각. quote는 반드시 원문에 존재해야 한다. */
export interface EvidenceSpan {
  id: string;
  quote: string;
  source: "experience" | "interest" | "answer";
}

export interface JobHypothesis {
  id: string;
  trackName: string;
  category: string;
  status: ReadingStatus;
  /** 이 가설을 뒷받침하는 EvidenceSpan의 id. 비어 있으면 근거 없는 가설이다. */
  evidenceIds: string[];
  /** AI 또는 규칙이 붙인 해석. 근거 자체가 아니라 읽은 결과다. */
  interpretation: string;
}

/** 해석이 모호할 때 사용자에게 되묻는 질문. */
export interface ClarifyingQuestion {
  id: string;
  question: string;
  /** 왜 묻는지. 사용자가 질문의 의도를 알 수 있어야 한다. */
  why: string;
  evidenceIds: string[];
}

/** 사용자가 되돌려준 말. 답변이든 정정이든 사용자의 원문이므로 그대로 근거가 된다. */
export interface ConversationTurn {
  id: string;
  kind: "answer" | "correction";
  /** 질문 id 또는 가설 id */
  targetId: string;
  /** 무엇에 대한 말이었는지 화면에 보여주기 위한 라벨 */
  targetLabel: string;
  text: string;
}

export interface AnalysisResult {
  mode: "demo" | "ai";
  evidence: EvidenceSpan[];
  hypotheses: JobHypothesis[];
  questions: ClarifyingQuestion[];
  /** 판단을 보류한 이유. 보류하지 않았으면 null. */
  withheld: string | null;
}

export interface JobPosting {
  id: string;
  company: string;
  companyInitial: string;
  companyLogoBg: string;
  title: string;
  location: string;
  category: string;
  tags: string[];
  arrivalReason: string;
  pros: string[];
  checkPoints: string[];
  evidences: string[];
  preparationTips?: string[];
  status: "arrived_new" | "saved" | "passed" | "applied";
  receivedAt: string;
  deadline?: string;
  salary?: string;
  experienceLevel?: string;
  roleSummary?: string;
}
