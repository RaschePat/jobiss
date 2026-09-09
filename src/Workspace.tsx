import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronRight,
  FolderOpen,
  Inbox,
  LoaderCircle,
  Mail,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { initialJobPostings } from "./data/initialData";
import type {
  JobHypothesis,
  JobPosting,
  UserActivity,
  UserProfile,
} from "./types";

type View = "profile" | "analysis" | "inbox" | "saved" | "passed";
type SavedState = {
  profile: UserProfile;
  jobs: JobPosting[];
  hypotheses: JobHypothesis[];
};
export const storageKey = "jobiss-workspace-v1";
const blankProfile: UserProfile = {
  id: "local-user",
  name: "",
  isLoggedIn: false,
  onboardingCompleted: false,
  interestSignals: [],
  activities: [],
  selectedTracks: [],
  careerGoalNote: "",
  notificationsEnabled: false,
  deliveryFrequency: "daily",
};
export function readState(): SavedState {
  const fallback = {
    profile: blankProfile,
    jobs: initialJobPostings,
    hypotheses: [],
  };
  try {
    const data = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (
      data &&
      typeof data.profile?.name === "string" &&
      Array.isArray(data.profile.activities) &&
      Array.isArray(data.profile.interestSignals) &&
      Array.isArray(data.profile.selectedTracks) &&
      Array.isArray(data.jobs) &&
      data.jobs.every(
        (j: JobPosting) =>
          typeof j.id === "string" &&
          Array.isArray(j.pros) &&
          Array.isArray(j.checkPoints) &&
          Array.isArray(j.evidences),
      ) &&
      Array.isArray(data.hypotheses)
    )
      return data;
  } catch {
    /* Start safely if browser storage is unavailable or corrupted. */
  }
  return fallback;
}
async function api<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/ai/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok)
    throw new Error("분석을 완료하지 못했어요. 잠시 후 다시 시도해주세요.");
  return response.json();
}
const interests = [
  "글쓰기·콘텐츠",
  "마케팅",
  "디자인",
  "기획",
  "개발",
  "데이터",
  "아직 탐색 중",
];
const activityTypes: { value: UserActivity["category"]; label: string }[] = [
  { value: "project", label: "프로젝트" },
  { value: "portfolio", label: "포트폴리오" },
  { value: "certificate", label: "자격증" },
  { value: "blog", label: "블로그·글쓰기" },
  { value: "custom", label: "학력·교육" },
  { value: "custom", label: "GitHub·링크" },
  { value: "custom", label: "관심사·기타 활동" },
];

export default function Workspace({
  initialView,
  onClose,
}: {
  initialView: "profile" | "inbox";
  onClose: () => void;
}) {
  const [state, setState] = useState<SavedState>(readState);
  const [view, setView] = useState<View>(initialView);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [activityText, setActivityText] = useState("");
  const [activityType, setActivityType] = useState(0);
  const [busy, setBusy] = useState(false);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [demo, setDemo] = useState<boolean | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const job = state.jobs.find((j) => j.id === selectedJob);
  const savedCount = state.jobs.filter((j) => j.status === "saved").length;
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controller = new AbortController();
    fetch("/api/health", { signal: controller.signal })
      .then((r) => r.json())
      .then((d) => setDemo(!d.hasGeminiKey))
      .catch(() => {});
    return () => {
      controller.abort();
      document.body.style.overflow = overflow;
      previousFocus?.focus();
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  useEffect(() => {
    content.current?.scrollTo(0, 0);
    setError("");
    setNotice("");
  }, [view, selectedJob]);
  function navigate(next: View) {
    setView(next);
    setSelectedJob(null);
  }
  function profileChange(patch: Partial<UserProfile>) {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
  }
  function addActivity() {
    if (!activityText.trim()) return;
    const type = activityTypes[activityType];
    const activity: UserActivity = {
      id: crypto.randomUUID(),
      title: activityText.trim(),
      category: type.value,
      countOrDesc: type.label,
      iconName: "Folder",
      dateAdded: new Date().toISOString(),
    };
    profileChange({ activities: [...state.profile.activities, activity] });
    setActivityText("");
  }
  async function analyze() {
    setError("");
    if (activityText.trim()) {
      setError("작성 중인 경험을 먼저 추가해주세요.");
      return;
    }
    if (
      !state.profile.careerGoalNote?.trim() &&
      !state.profile.activities.length &&
      !state.profile.interestSignals.length
    ) {
      setError("경험 한 줄 또는 관심사 하나를 알려주세요.");
      return;
    }
    setBusy(true);
    try {
      const result = await api<{
        signals: string[];
        hypotheses: JobHypothesis[];
      }>("analyze-experience", {
        textInput: [
          state.profile.careerGoalNote,
          ...state.profile.activities.map(
            (a) => `${a.countOrDesc}: ${a.title}`,
          ),
        ]
          .filter(Boolean)
          .join("\n"),
        selectedTags: state.profile.interestSignals,
      });
      if (!Array.isArray(result.hypotheses) || !result.hypotheses.length)
        throw new Error(
          "연결할 단서를 찾지 못했어요. 경험을 조금 더 구체적으로 알려주세요.",
        );
      setState((s) => ({
        ...s,
        hypotheses: result.hypotheses,
        profile: { ...s.profile, onboardingCompleted: true },
      }));
      navigate("analysis");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "분석 중 문제가 발생했어요. 다시 시도해주세요.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function reactToJob(target: JobPosting, action: JobPosting["status"]) {
    setFeedbackBusy(true);
    setError("");
    setNotice("");
    try {
      await api("tune-hypothesis", {
        action,
        job: target,
        currentHypotheses: state.hypotheses,
      });
      setState((s) => ({
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === target.id ? { ...j, status: action } : j,
        ),
      }));
      setNotice(
        action === "saved"
          ? "저장했어요. 관심 선택을 추천 피드백으로 전달했어요."
          : action === "passed"
            ? "넘긴 공고에 보관했어요. 언제든 다시 볼 수 있어요."
            : "공고를 우편함으로 되돌렸어요.",
      );
    } catch {
      setError("선택을 반영하지 못했어요. 연결을 확인하고 다시 시도해주세요.");
    } finally {
      setFeedbackBusy(false);
    }
  }
  async function deepAnalyze() {
    setNotice("");
    if (!job) return;
    if (
      !state.profile.activities.length &&
      !state.profile.careerGoalNote?.trim() &&
      !state.profile.interestSignals.length
    ) {
      setError("내 경험에서 관심사나 활동을 먼저 등록해주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await api<Partial<JobPosting>>("match-report", {
        jobTitle: job.title,
        company: job.company,
        userActivities: [
          ...state.profile.activities,
          ...(state.profile.careerGoalNote
            ? [{ title: state.profile.careerGoalNote }]
            : []),
        ],
        interestSignals: state.profile.interestSignals,
      });
      if (
        !Array.isArray(result.pros) ||
        !Array.isArray(result.checkPoints) ||
        !Array.isArray(result.evidences)
      )
        throw new Error("리포트 형식이 올바르지 않아요. 다시 시도해주세요.");
      setState((s) => ({
        ...s,
        jobs: s.jobs.map((j) =>
          j.id === job.id
            ? {
                ...j,
                pros: result.pros!,
                checkPoints: result.checkPoints!,
                evidences: result.evidences!,
                preparationTips: result.preparationTips,
                arrivalReason: result.arrivalReason || j.arrivalReason,
              }
            : j,
        ),
      }));
      setNotice(
        demo
          ? "예시 분석 리포트를 불러왔어요. 실제 개인 맞춤 분석은 AI 연결 후 이용할 수 있어요."
          : "추가한 경험을 반영해 리포트를 업데이트했어요.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "다시 분석하지 못했어요.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="workspace-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="workspace-title"
    >
      <div className="workspace-shell">
        <header className="workspace-header">
          <span className="wordmark">
            jobiss<span>.</span>
          </span>
          <span id="workspace-title">나의 다음을 찾는 공간</span>
          <button className="icon-button" aria-label="닫기" onClick={onClose}>
            <X size={23} />
          </button>
        </header>
        <div className="workspace-layout">
          <nav className="workspace-nav" aria-label="내 공간 메뉴">
            {[
              { id: "profile", label: "내 경험", icon: UserRound },
              { id: "analysis", label: "발견한 가능성", icon: Sparkles },
              { id: "inbox", label: "내 우편함", icon: Inbox },
              {
                id: "saved",
                label: `저장한 공고 ${savedCount}`,
                icon: Bookmark,
              },
              { id: "passed", label: "넘긴 공고", icon: RotateCcw },
            ].map((n) => (
              <button
                key={n.id}
                aria-current={view === n.id ? "page" : undefined}
                onClick={() => navigate(n.id as View)}
              >
                <n.icon size={18} />
                {n.label}
              </button>
            ))}
            <p>
              기록은 이 브라우저에 저장돼요.
              <br />
              실제 채용 연동 전 체험 버전입니다.
            </p>
          </nav>
          <div className="workspace-content" ref={content}>
            {storageError && (
              <p className="form-error" role="alert">
                브라우저 저장 공간을 사용할 수 없어 변경 내용이 유지되지 않을 수
                있어요.
              </p>
            )}
            <div className="demo-banner">
              <Sparkles size={16} />
              <span>
                {demo === true
                  ? "현재는 예시 분석과 예시 공고로 체험하고 있어요."
                  : demo === false
                    ? "AI 분석을 사용할 수 있어요. 채용공고는 서비스 체험용 예시입니다."
                    : "채용공고는 서비스 체험용 예시입니다. AI 연결 상태를 확인하고 있어요."}
              </span>
            </div>
            {view === "profile" && (
              <>
                <div className="workspace-title">
                  <span className="section-label">
                    모든 경험이 가능성의 시작
                  </span>
                  <h2>당신의 이야기를 들려주세요.</h2>
                  <p>대단하지 않아도 괜찮아요. 지금 떠오르는 것부터.</p>
                </div>
                <div className="profile-fields">
                  <label>
                    어떻게 불러드릴까요? <span>선택</span>
                    <input
                      placeholder="이름 또는 닉네임"
                      maxLength={30}
                      value={state.profile.name}
                      onChange={(e) => profileChange({ name: e.target.value })}
                    />
                  </label>
                  <label>
                    해본 일, 좋아하는 일, 앞으로 해보고 싶은 일
                    <textarea
                      rows={4}
                      maxLength={4000}
                      placeholder="예) 동아리에서 전시를 기획했어요. 사람들의 반응을 보고 더 나은 경험을 만드는 일이 재미있었어요."
                      value={state.profile.careerGoalNote}
                      onChange={(e) =>
                        profileChange({ careerGoalNote: e.target.value })
                      }
                    />
                  </label>
                  <fieldset>
                    <legend>
                      요즘 관심이 가는 분야 <span>여러 개 선택해도 좋아요</span>
                    </legend>
                    <div className="interest-tags">
                      {interests.map((tag) => (
                        <button
                          key={tag}
                          aria-pressed={state.profile.interestSignals.includes(
                            tag,
                          )}
                          onClick={() =>
                            profileChange({
                              interestSignals:
                                state.profile.interestSignals.includes(tag)
                                  ? state.profile.interestSignals.filter(
                                      (t) => t !== tag,
                                    )
                                  : [...state.profile.interestSignals, tag],
                            })
                          }
                        >
                          {state.profile.interestSignals.includes(tag) && (
                            <Check size={13} />
                          )}{" "}
                          {tag}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="activity-editor">
                    <h3>
                      조금 더 구체적인 경험 <span>선택</span>
                    </h3>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        addActivity();
                      }}
                      className="activity-form"
                    >
                      <select
                        aria-label="경험 종류"
                        value={activityType}
                        onChange={(e) =>
                          setActivityType(Number(e.target.value))
                        }
                      >
                        {activityTypes.map((t, i) => (
                          <option key={t.label} value={i}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label="추가할 경험"
                        value={activityText}
                        onChange={(e) => setActivityText(e.target.value)}
                        maxLength={600}
                        placeholder="경험이나 자료 링크를 남겨주세요"
                      />
                      <button
                        className="icon-button add-activity"
                        aria-label="경험 추가"
                        disabled={!activityText.trim()}
                      >
                        <Plus size={20} />
                      </button>
                    </form>
                    <div className="activity-list">
                      {state.profile.activities.map((a) => (
                        <div key={a.id}>
                          <FolderOpen size={16} />
                          <span>
                            <small>{a.countOrDesc}</small>
                            {a.title}
                          </span>
                          <button
                            className="icon-button"
                            aria-label={`${a.title} 삭제`}
                            onClick={() =>
                              profileChange({
                                activities: state.profile.activities.filter(
                                  (item) => item.id !== a.id,
                                ),
                              })
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="privacy-note">
                    분석을 누르면 입력한 정보가 분석 서버에 전달됩니다. 링크는
                    현재 텍스트 단서로 활용되며 파일 내용을 자동으로 읽지는
                    않아요.
                  </p>
                </div>
                <button
                  className="button button-dark wide-button"
                  onClick={analyze}
                  disabled={busy}
                >
                  {busy ? (
                    <LoaderCircle className="spin" size={18} />
                  ) : (
                    <Sparkles size={18} />
                  )}{" "}
                  {busy
                    ? "경험 사이의 연결을 살펴보고 있어요…"
                    : state.hypotheses.length
                      ? "추가한 경험으로 다시 분석하기"
                      : "나의 가능성 발견하기"}
                </button>
              </>
            )}
            {view === "analysis" && (
              <>
                <div className="workspace-title">
                  <span className="section-label">발견한 가능성</span>
                  <h2>
                    {state.profile.name || "당신"}님의 다음은
                    <br />
                    이런 일과 연결될 수 있어요.
                  </h2>
                  <p>
                    정답 대신 가능성을 제안해요. 더 알아보고 싶은 방향을
                    골라보세요.
                  </p>
                </div>
                {state.hypotheses.length ? (
                  <>
                    <div className="hypotheses">
                      {state.hypotheses.map((h) => (
                        <button
                          key={h.id}
                          className={
                            state.profile.selectedTracks.includes(h.trackName)
                              ? "selected"
                              : ""
                          }
                          aria-pressed={state.profile.selectedTracks.includes(
                            h.trackName,
                          )}
                          onClick={() =>
                            profileChange({
                              selectedTracks:
                                state.profile.selectedTracks.includes(
                                  h.trackName,
                                )
                                  ? state.profile.selectedTracks.filter(
                                      (t) => t !== h.trackName,
                                    )
                                  : [
                                      ...state.profile.selectedTracks,
                                      h.trackName,
                                    ],
                            })
                          }
                        >
                          <div>
                            <span>{h.category}</span>
                            <CheckCircle2 size={21} />
                          </div>
                          <h3>{h.trackName}</h3>
                          <p>{h.rationale}</p>
                          <small>{h.keySignals.join(" · ")}</small>
                        </button>
                      ))}
                    </div>
                    <button
                      className="button button-dark wide-button"
                      onClick={() => navigate("inbox")}
                    >
                      연결된 예시 공고 살펴보기 <ArrowRight size={17} />
                    </button>
                    <button
                      className="subtle-link"
                      onClick={() => navigate("profile")}
                    >
                      경험을 더하고 다시 분석하기
                    </button>
                  </>
                ) : (
                  <div className="empty-state">
                    <Sparkles size={37} />
                    <h3>첫 번째 단서를 기다리고 있어요.</h3>
                    <p>
                      경험 한 줄이나 관심사를 알려주면
                      <br />
                      탐색해볼 만한 직무를 함께 찾아볼게요.
                    </p>
                    <button
                      className="button button-dark"
                      onClick={() => navigate("profile")}
                    >
                      내 경험 등록하기
                    </button>
                  </div>
                )}
              </>
            )}
            {["inbox", "saved", "passed"].includes(view) && !job && (
              <>
                <div className="workspace-title">
                  <span className="section-label">기회가 도착하는 곳</span>
                  <h2>
                    {view === "saved"
                      ? "다시 읽고 싶은 기회."
                      : view === "passed"
                        ? "잠시 지나친 기회."
                        : `${state.profile.name || "당신"}님께, 새로운 가능성.`}
                  </h2>
                  <p>
                    {view === "saved"
                      ? "마음에 담아둔 공고를 비교하고 다음 준비를 시작하세요."
                      : view === "passed"
                        ? "마음이 바뀌었다면 우편함으로 되돌릴 수 있어요."
                        : "공고를 열어 연결의 근거와 다음 준비를 확인해보세요."}
                  </p>
                </div>
                {state.profile.selectedTracks.length > 0 && (
                  <p className="track-summary">
                    탐색 중인 방향: {state.profile.selectedTracks.join(", ")}
                  </p>
                )}
                <div className="inbox-list">
                  {state.jobs
                    .filter((j) =>
                      view === "saved"
                        ? j.status === "saved"
                        : view === "passed"
                          ? j.status === "passed"
                          : j.status !== "passed",
                    )
                    .map((j) => (
                      <button
                        className="inbox-job"
                        key={j.id}
                        onClick={() => setSelectedJob(j.id)}
                      >
                        <div className="company-monogram">
                          {j.companyInitial}
                        </div>
                        <div>
                          <small>{j.company} · 예시 공고</small>
                          <h3>{j.title}</h3>
                          <p>
                            {j.location} · {j.experienceLevel}
                          </p>
                          <span>{j.arrivalReason}</span>
                        </div>
                        {j.status === "saved" ? (
                          <Bookmark size={19} fill="currentColor" />
                        ) : (
                          <ChevronRight size={20} />
                        )}
                      </button>
                    ))}
                </div>
                {!state.jobs.filter((j) =>
                  view === "saved"
                    ? j.status === "saved"
                    : view === "passed"
                      ? j.status === "passed"
                      : j.status !== "passed",
                ).length && (
                  <div className="empty-state">
                    <Mail size={36} />
                    <h3>
                      {view === "saved"
                        ? "아직 저장한 공고가 없어요."
                        : view === "passed"
                          ? "넘긴 공고가 없어요."
                          : "공고를 모두 확인했어요."}
                    </h3>
                    <p>다른 공고에서 새로운 연결을 발견해보세요.</p>
                    <button
                      className="button button-dark"
                      onClick={() =>
                        navigate(view === "inbox" ? "passed" : "inbox")
                      }
                    >
                      {view === "inbox"
                        ? "넘긴 공고 다시 보기"
                        : "우편함 살펴보기"}
                    </button>
                  </div>
                )}
              </>
            )}
            {job && (
              <>
                <button
                  className="back-button"
                  onClick={() => setSelectedJob(null)}
                >
                  <ArrowLeft size={16} /> 목록으로
                </button>
                <div className="job-report-header">
                  <span className="company-monogram">{job.companyInitial}</span>
                  <div>
                    <small>{job.company} · 예시 공고</small>
                    <h2>{job.title}</h2>
                    <p>
                      {job.location} · {job.experienceLevel}
                    </p>
                  </div>
                </div>
                <p className="job-summary">{job.roleSummary}</p>
                <div className="salary-row">
                  제시 연봉 <strong>{job.salary || "공고 확인 필요"}</strong>
                </div>
                <div className="arrival-reason">
                  <Sparkles size={20} />
                  <p>
                    <b>이 기회가 도착한 이유</b>
                    {job.arrivalReason}
                  </p>
                </div>
                <div className="report-sections">
                  {[
                    {
                      title: "이미 잘하고 있는 것",
                      items: job.pros,
                      icon: Check,
                    },
                    {
                      title: "더 확인하고 채워볼 것",
                      items: job.checkPoints,
                      icon: Plus,
                    },
                    {
                      title: "경험에서 찾은 근거",
                      items: job.evidences,
                      icon: FolderOpen,
                    },
                    {
                      title: "지금 해볼 수 있는 다음 행동",
                      items: job.preparationTips || [
                        "대표 경험 하나를 골라 문제, 실행 과정, 결과를 정리해보세요.",
                      ],
                      icon: ArrowUpRight,
                    },
                  ].map((s) => (
                    <section key={s.title}>
                      <h3>
                        <s.icon size={18} />
                        {s.title}
                      </h3>
                      <ul>
                        {s.items.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <button
                  className="button button-light wide-button"
                  onClick={deepAnalyze}
                  disabled={busy}
                >
                  {busy ? (
                    <LoaderCircle size={17} className="spin" />
                  ) : (
                    <Sparkles size={17} />
                  )}{" "}
                  {busy
                    ? "경험과 공고를 다시 살펴보고 있어요…"
                    : "내가 추가한 경험으로 다시 분석하기"}
                </button>
                <div className="report-footer">
                  <button
                    className="button button-outline"
                    disabled={feedbackBusy}
                    onClick={() =>
                      reactToJob(
                        job,
                        job.status === "passed" ? "arrived_new" : "passed",
                      )
                    }
                  >
                    {job.status === "passed"
                      ? "우편함으로 되돌리기"
                      : "이번에는 넘기기"}
                  </button>
                  <button
                    className="button button-dark"
                    disabled={feedbackBusy}
                    onClick={() =>
                      reactToJob(
                        job,
                        job.status === "saved" ? "arrived_new" : "saved",
                      )
                    }
                  >
                    <Bookmark
                      size={16}
                      fill={job.status === "saved" ? "currentColor" : "none"}
                    />
                    {job.status === "saved" ? "저장 취소" : "관심 공고 저장"}
                  </button>
                </div>
              </>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="form-notice" role="status">
                <CheckCircle2 size={17} />
                {notice}
              </p>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}
