import type { JobHypothesis, JobPosting } from "./types";
import { initialJobPostings } from "./data/initialData";

export const interests = [
  {
    id: "content",
    label: "글쓰기·콘텐츠",
    hint: "생각을 이야기로 전하는 일",
    icon: "pen",
    role: "콘텐츠 마케터",
    category: "콘텐츠",
    keywords: [
      "글쓰기",
      "블로그",
      "콘텐츠",
      "글을",
      "글 ",
      "에디터",
      "영상",
      "유튜브",
    ],
    next: "직접 만든 콘텐츠 하나를 골라, 누구를 위해 어떤 메시지를 담았는지 정리해 보세요.",
  },
  {
    id: "design",
    label: "디자인",
    hint: "더 나은 경험을 만드는 일",
    icon: "shapes",
    role: "UI/UX 디자이너",
    category: "디자인",
    keywords: ["디자인", "figma", "피그마", "ui", "ux", "시각"],
    next: "화면 하나를 골라, 사용자가 겪는 문제와 개선한 이유를 함께 정리해 보세요.",
  },
  {
    id: "planning",
    label: "서비스 기획",
    hint: "아이디어를 구체화하는 일",
    icon: "layout",
    role: "서비스 기획자",
    category: "기획",
    keywords: ["기획", "서비스", "문제 정의", "동아리", "스터디"],
    next: "불편했던 서비스 하나의 문제와 해결 아이디어를 한 페이지로 정리해 보세요.",
  },
  {
    id: "dev",
    label: "개발·기술",
    hint: "직접 만들고 작동시키는 일",
    icon: "code",
    role: "프론트엔드 개발자",
    category: "개발",
    keywords: [
      "개발",
      "코딩",
      "react",
      "javascript",
      "github",
      "프로그래밍",
      "웹",
      "앱",
    ],
    next: "만든 기능 하나를 골라, 구현 과정과 해결한 문제를 README에 정리해 보세요.",
  },
  {
    id: "marketing",
    label: "마케팅·브랜딩",
    hint: "사람과 브랜드를 연결하는 일",
    icon: "megaphone",
    role: "마케팅 기획자",
    category: "마케팅",
    keywords: ["마케팅", "브랜드", "브랜딩", "sns", "인스타", "캠페인", "광고"],
    next: "관심 있는 브랜드의 캠페인 하나를 골라, 대상과 메시지, 성과 측정 방법을 적어 보세요.",
  },
  {
    id: "data",
    label: "데이터·분석",
    hint: "숫자 속에서 답을 찾는 일",
    icon: "chart",
    role: "데이터 분석가",
    category: "데이터",
    keywords: ["데이터", "분석", "sql", "python", "파이썬", "통계", "엑셀"],
    next: "작은 데이터셋으로 질문 하나를 정하고, 분석 결과를 차트와 함께 설명해 보세요.",
  },
  {
    id: "research",
    label: "리서치·탐구",
    hint: "질문하고 깊이 이해하는 일",
    icon: "search",
    role: "UX 리서처",
    category: "리서치",
    keywords: ["리서치", "탐구", "연구", "인터뷰", "설문", "조사", "심리"],
    next: "주변 사람의 서비스 사용 경험을 인터뷰하고, 관찰한 사실과 해석을 나눠 적어 보세요.",
  },
  {
    id: "people",
    label: "소통·운영",
    hint: "사람과 일을 함께 움직이는 일",
    icon: "people",
    role: "커뮤니티 매니저",
    category: "운영",
    keywords: ["소통", "운영", "사람", "행사", "고객", "봉사", "매니저"],
    next: "함께한 활동 하나에서 본인의 역할, 조율했던 일, 달라진 결과를 기록해 보세요.",
  },
] as const;

export interface AnalysisResult {
  signals: string[];
  hypotheses: JobHypothesis[];
  mode: "demo" | "ai";
}

export function analyzeLocally(
  textInput: string,
  tags: string[],
): AnalysisResult {
  const text = textInput.toLowerCase();
  const ranked = interests
    .map((item, index) => {
      const words = item.keywords.filter((word) => text.includes(word));
      return {
        item,
        score: (tags.includes(item.label) ? 3 : 0) + words.length,
        words,
        index,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 3);
  return {
    mode: "demo",
    signals: ranked.map(({ item }) => item.label),
    hypotheses: ranked.map(({ item, words }, index) => ({
      id: item.id,
      trackName: item.role,
      category: item.category,
      confidenceScore: 0,
      status: index === 0 ? "recommended" : "exploring",
      rationale: words.length
        ? `적어주신 경험의 ‘${words.slice(0, 2).join("’, ‘")}’에서 ${item.role}와의 연결을 찾아봤어요. 구체적인 역할과 결과를 더하면 더 깊이 살펴볼 수 있어요.`
        : `선택한 ‘${item.label}’ 관심에서 시작한 탐색 방향이에요. 실제 경험과 필요한 역량을 비교하며 확인해 보세요.`,
      keySignals: words.length ? words.slice(0, 3) : [item.label],
      matchedJobsCount: 0,
    })),
  };
}

export function sampleJobs(tracks: JobHypothesis[]): JobPosting[] {
  return tracks.map((track) => {
    const interest = interests.find(
      (item) =>
        item.category === track.category || track.trackName.includes(item.role),
    );
    const source = initialJobPostings.find(
      (job) => job.category === track.category,
    );
    return {
      id: `sample_${track.category}_${track.trackName}`,
      company: source?.company || "넥스트팀",
      companyInitial: source?.companyInitial || "nt",
      companyLogoBg: "",
      title: track.trackName,
      category: track.category,
      location: source?.location || "서울 · 하이브리드",
      tags: track.keySignals,
      arrivalReason: track.rationale,
      matchScore: 0,
      pros: [
        `‘${track.keySignals.join(" · ")}’에 대한 관심이나 기록이 이 직무를 탐색하는 출발점이 될 수 있어요.`,
      ],
      checkPoints: [
        "관심만으로 실무 역량을 판단할 수는 없어요. 직접 해본 일과 맡았던 역할을 확인해 보세요.",
        "실제 지원 전에는 기업의 원문 공고에서 모집 여부와 필수 요건을 확인해야 해요.",
      ],
      evidences: track.keySignals,
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

export async function requestAnalysis(
  textInput: string,
  selectedTags: string[],
  signal: AbortSignal,
): Promise<AnalysisResult> {
  const response = await fetch("/api/ai/analyze-experience", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal,
    body: JSON.stringify({ textInput, selectedTags }),
  });
  if (!response.ok)
    throw new Error("분석을 마치지 못했어요. 잠시 후 다시 시도해 주세요.");
  const data = await response.json();
  if (
    !Array.isArray(data.signals) ||
    !Array.isArray(data.hypotheses) ||
    !data.hypotheses.every(
      (h: JobHypothesis) =>
        h &&
        typeof h.id === "string" &&
        typeof h.trackName === "string" &&
        typeof h.rationale === "string" &&
        Array.isArray(h.keySignals) &&
        h.keySignals.every((s) => typeof s === "string"),
    )
  ) {
    throw new Error("분석 결과를 읽지 못했어요. 다시 시도해 주세요.");
  }
  return {
    signals: data.signals,
    hypotheses: data.hypotheses,
    mode: data.mode === "ai" ? "ai" : "demo",
  };
}
