import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  FileText,
  FolderOpen,
  LayoutTemplate,
  Lightbulb,
  LoaderCircle,
  Mail,
  Megaphone,
  MessageCircle,
  PenLine,
  Plus,
  Search,
  Shapes,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  ChartNoAxesCombined,
  RotateCcw,
} from "lucide-react";
import {
  analyzeLocally,
  interests,
  mergeJobFeedback,
  requestAnalysis,
  sampleJobs,
  type AnalysisResult,
} from "./onboarding";
import type { JobPosting } from "./types";

type Page = 1 | 2 | 3 | "inbox" | "paused";
type Draft = {
  version: 1;
  page: Page;
  resume: 1 | 2 | 3 | "inbox";
  name: string;
  tags: string[];
  experience: string;
  result: AnalysisResult | null;
  tracks: string[];
  jobs: JobPosting[];
  done: string[];
};
const STORAGE = "jobiss.onboarding.v1";
const fresh = (): Draft => ({
  version: 1,
  page: 1,
  resume: 1,
  name: "",
  tags: [],
  experience: "",
  result: null,
  tracks: [],
  jobs: [],
  done: [],
});

function readDraft(): Draft {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE) || "null");
    if (
      !data ||
      data.version !== 1 ||
      ![1, 2, 3, "inbox", "paused"].includes(data.page)
    )
      return fresh();
    const stringArray = (value: unknown): value is string[] =>
      Array.isArray(value) && value.every((item) => typeof item === "string");
    if (
      typeof data.name !== "string" ||
      typeof data.experience !== "string" ||
      !stringArray(data.tags) ||
      !stringArray(data.tracks) ||
      !stringArray(data.done) ||
      !Array.isArray(data.jobs)
    )
      return fresh();
    if (
      data.result &&
      (!Array.isArray(data.result.hypotheses) ||
        !stringArray(data.result.signals) ||
        !data.result.hypotheses.every(
          (h: any) =>
            h &&
            typeof h.id === "string" &&
            typeof h.trackName === "string" &&
            typeof h.category === "string" &&
            typeof h.rationale === "string" &&
            stringArray(h.keySignals),
        ))
    )
      return fresh();
    if (
      !data.jobs.every(
        (j: any) =>
          j &&
          typeof j.id === "string" &&
          typeof j.title === "string" &&
          stringArray(j.pros) &&
          stringArray(j.checkPoints) &&
          stringArray(j.evidences) &&
          stringArray(j.preparationTips),
      )
    )
      return fresh();
    if ((data.page === 3 || data.page === "inbox") && !data.result)
      data.page = 2;
    if (![1, 2, 3, "inbox"].includes(data.resume)) data.resume = 1;
    return data;
  } catch {
    return fresh();
  }
}

const iconMap = {
  pen: PenLine,
  shapes: Shapes,
  layout: LayoutTemplate,
  code: Code2,
  megaphone: Megaphone,
  chart: ChartNoAxesCombined,
  search: Search,
  people: Users,
};
const stepNames = ["관심 찾기", "경험 더하기", "가능성 발견"];

function Wordmark() {
  return (
    <span className="wordmark" aria-label="잡이쓰">
      jobiss<span>.</span>
    </span>
  );
}

function LetterPreview({
  tags,
  name,
  experience,
  stage,
}: {
  tags: string[];
  name: string;
  experience: string;
  stage: Page;
}) {
  const preview = analyzeLocally(experience, tags).hypotheses[0];
  const role = preview?.trackName || "나와 연결되는 새로운 일";
  return (
    <aside className="preview-panel" aria-label="첫 편지 미리보기">
      <div className="preview-heading">
        <span className="tiny-mail">
          <Mail size={16} />
        </span>
        <span>당신의 첫 번째 커리어 레터</span>
      </div>
      <h2>
        지나온 경험이,
        <br />
        다음 기회가 되는 곳.
      </h2>
      <div className="letter-scene">
        <div className="envelope-back" />
        <article className="preview-letter">
          <div className="letter-top">
            <span>To. {name.trim() || "새로운 가능성을 찾는 당신"}</span>
            <span className="postage">
              <Sparkles size={22} />
              <small>jobiss.</small>
            </span>
          </div>
          <div className="letter-rule" />
          <p className="letter-eyebrow">이런 연결이 기다리고 있어요</p>
          <h3 key={role}>{role}</h3>
          <p className="letter-copy">
            {preview ? (
              <>
                당신이 남긴 <strong>{preview.keySignals[0]}</strong>,<br />이
                일과 연결해 보면 어떨까요?
              </>
            ) : (
              <>
                좋아하는 것, 작게라도 해본 일.
                <br />그 안에서 다음 가능성을 찾아볼게요.
              </>
            )}
          </p>
          <div className="letter-tags">
            {(tags.length
              ? tags.slice(0, 2)
              : preview?.keySignals || ["당신의 관심", "당신의 경험"]
            ).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="letter-bottom">
            <span>나의 경험에서 찾은 연결</span>
            <ArrowUpRight size={16} />
          </div>
        </article>
        <div className="envelope-front">
          <div className="envelope-fold" />
          <span className="envelope-wordmark">jobiss.</span>
          <span className="envelope-number">
            a little about you,
            <br />a new way forward.
          </span>
        </div>
        <span className="letter-seal">
          <ArrowUpRight size={26} strokeWidth={1.5} />
        </span>
      </div>
      <div className="preview-caption">
        <span className="live-dot" />
        {preview
          ? "남겨주신 이야기로 미리 채워본 편지예요"
          : "관심을 고르면 편지가 조금씩 채워져요"}
      </div>
      <div className="preview-route">
        <span className={stage === 1 ? "active" : ""}>나의 관심</span>
        <span className="route-dots" />
        <span className={stage === 2 ? "active" : ""}>경험의 연결</span>
        <span className="route-dots" />
        <span className={stage === 3 ? "active" : ""}>새로운 기회</span>
      </div>
    </aside>
  );
}

export default function OnboardingFlow({ onHome }: { onHome: () => void }) {
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [toast, setToast] = useState("");
  const [help, setHelp] = useState(false);
  const [filter, setFilter] = useState<"all" | "saved" | "passed">("all");
  const [openedId, setOpenedId] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const update = (values: Partial<Draft>) =>
    setDraft((old) => ({ ...old, ...values }));
  const page = draft.page;
  const currentJob = draft.jobs.find((job) => job.id === openedId);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(draft));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [draft]);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  function go(next: Page) {
    setError("");
    update({ page: next });
  }
  function toggleTag(label: string) {
    setDraft((old) => ({
      ...old,
      tags: old.tags.includes(label)
        ? old.tags.filter((tag) => tag !== label)
        : [...old.tags, label],
    }));
  }
  async function analyze(event?: FormEvent) {
    event?.preventDefault();
    if (busy) return;
    if (!draft.tags.length && !draft.experience.trim()) {
      setError("관심을 하나 고르거나, 해본 일을 한 줄 적어 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 45000);
    try {
      const result = await requestAnalysis(
        draft.experience.trim(),
        draft.tags,
        controller.current.signal,
      );
      update({
        result,
        tracks: result.hypotheses.slice(0, 1).map((h) => h.id),
        page: 3,
      });
    } catch (e) {
      setError(
        e instanceof TypeError
          ? "서버에 연결하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요."
          : e instanceof SyntaxError
            ? "분석 결과를 읽지 못했어요. 잠시 후 다시 시도해 주세요."
            : e instanceof Error && e.name !== "AbortError"
              ? e.message
              : "분석에 시간이 걸리고 있어요. 입력은 그대로 두었으니 다시 시도해 주세요.",
      );
    } finally {
      clearTimeout(timeout);
      setBusy(false);
    }
  }
  function complete() {
    const selected =
      draft.result?.hypotheses.filter((h) => draft.tracks.includes(h.id)) || [];
    const jobs = mergeJobFeedback(draft.jobs, sampleJobs(selected));
    update({ jobs, page: "inbox" });
    setFilter("all");
  }
  function changeJob(id: string, status: JobPosting["status"]) {
    setDraft((old) => ({
      ...old,
      jobs: old.jobs.map((job) => (job.id === id ? { ...job, status } : job)),
    }));
    setToast(
      status === "saved"
        ? "관심 공고에 저장했어요. 이 브라우저에서 다시 볼 수 있어요."
        : status === "passed"
          ? "넘긴 편지로 옮겼어요. 언제든 되돌릴 수 있어요."
          : "도착한 편지로 다시 옮겼어요.",
    );
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          href="/"
          className="brand-link"
          aria-label="잡이쓰 홈"
          onClick={(e) => {
            e.preventDefault();
            onHome();
          }}
        >
          <Wordmark />
        </a>
        <div className="header-divider" />
        <span className="header-description">나를 알아가는 첫걸음</span>
        <div className="header-actions">
          {page === "inbox" ? (
            <button className="text-button" onClick={() => go(2)}>
              <PenLine size={15} /> 내 경험 수정
            </button>
          ) : page !== "paused" ? (
            <button
              disabled={busy}
              className="text-button"
              onClick={() => {
                update({ resume: page, page: "paused" });
              }}
            >
              저장하고 나가기
              <ArrowUpRight size={15} />
            </button>
          ) : (
            <span className="header-saved">
              <Check size={15} /> 잠시 쉬어가도 괜찮아요
            </span>
          )}
        </div>
      </header>

      {storageError && (
        <div className="storage-warning" role="status">
          이 브라우저에서는 자동 저장이 안 돼요. 창을 닫으면 입력 내용이 사라질
          수 있어요.
        </div>
      )}

      {typeof page === "number" && (
        <main className="onboarding-layout">
          <section className="form-panel">
            <nav className="stepper" aria-label="온보딩 진행 단계">
              {stepNames.map((name, index) => (
                <div
                  className={`step ${page === index + 1 ? "current" : ""} ${page > index + 1 ? "complete" : ""}`}
                  key={name}
                >
                  <button
                    disabled={page <= index + 1 || busy}
                    aria-current={page === index + 1 ? "step" : undefined}
                    onClick={() => go((index + 1) as Page)}
                  >
                    <span className="step-number">
                      {page > index + 1 ? (
                        <Check size={12} strokeWidth={3} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    {name}
                  </button>
                  {index < 2 && <span className="step-line" />}
                </div>
              ))}
            </nav>

            {page === 1 && (
              <div className="step-content">
                <div className="intro">
                  <div className="step-kicker">
                    반가워요, 잡이쓰예요 <span className="hello-spark">✳</span>
                  </div>
                  <h1 ref={heading} tabIndex={-1}>
                    아직 직무를 몰라도,
                    <br />
                    좋아하는 것부터.
                  </h1>
                  <p>
                    평소 눈길이 가는 일을 골라주세요.
                    <br />
                    작은 관심도 새로운 가능성의 시작이 돼요.
                  </p>
                </div>
                <fieldset className="interest-fieldset">
                  <legend>
                    어떤 일에 마음이 가나요?{" "}
                    <span>여러 개 선택할 수 있어요</span>
                  </legend>
                  <div className="interest-grid">
                    {interests.map((item) => {
                      const Icon = iconMap[item.icon];
                      const selected = draft.tags.includes(item.label);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`interest-option ${selected ? "selected" : ""}`}
                          aria-pressed={selected}
                          onClick={() => toggleTag(item.label)}
                        >
                          <span className="interest-icon">
                            <Icon size={21} strokeWidth={1.65} />
                          </span>
                          <span className="interest-label">
                            <strong>{item.label}</strong>
                            <small>{item.hint}</small>
                          </span>
                          <span className="option-check">
                            {selected ? (
                              <Check size={12} strokeWidth={3} />
                            ) : (
                              <Plus size={12} />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="form-actions">
                  <div className="selection-note" aria-live="polite">
                    {draft.tags.length ? (
                      <>
                        <span>{draft.tags.length}개</span>의 관심을 골랐어요
                      </>
                    ) : (
                      "잘하는 일보다, 마음이 가는 일이면 충분해요"
                    )}
                  </div>
                  <button
                    className="primary-button"
                    disabled={!draft.tags.length}
                    onClick={() => go(2)}
                  >
                    내 경험 더하기
                    <ArrowRight size={18} />
                  </button>
                  <button className="skip-button" onClick={() => go(2)}>
                    아직 잘 모르겠어요 <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {page === 2 && (
              <form className="step-content" onSubmit={analyze}>
                <div className="intro">
                  <div className="step-kicker">
                    대단한 경험이 아니어도 괜찮아요
                  </div>
                  <h1 ref={heading} tabIndex={-1}>
                    해본 일 하나면,
                    <br />
                    이야기는 시작돼요.
                  </h1>
                  <p>
                    수업 과제, 동아리, 혼자 해본 작은 시도까지.
                    <br />
                    어떤 일을 했고, 무엇이 즐거웠는지 들려주세요.
                  </p>
                </div>
                <div className="name-field">
                  <label htmlFor="name">
                    어떻게 불러드릴까요? <span>선택</span>
                  </label>
                  <input
                    id="name"
                    autoComplete="given-name"
                    maxLength={20}
                    placeholder="이름 또는 닉네임"
                    value={draft.name}
                    disabled={busy}
                    onChange={(e) => update({ name: e.target.value })}
                  />
                </div>
                <div className="experience-field">
                  <label htmlFor="experience">
                    나의 경험 한 조각{" "}
                    <span>
                      {draft.tags.length
                        ? "선택"
                        : "관심 대신 경험을 들려주세요"}
                    </span>
                  </label>
                  <textarea
                    id="experience"
                    maxLength={2000}
                    disabled={busy}
                    value={draft.experience}
                    onChange={(e) => update({ experience: e.target.value })}
                    placeholder={
                      "예를 들어, 동아리 인스타그램을 운영하면서\n행사 소개 콘텐츠를 만들었어요.\n어떤 글에 반응이 오는지 보는 게 재미있었어요."
                    }
                    aria-describedby="experience-help"
                  />
                  <div className="textarea-bottom">
                    <span>
                      <FileText size={13} /> 한 줄로 시작해도 좋아요
                    </span>
                    <span>
                      {draft.experience.length.toLocaleString()} / 2,000
                    </span>
                  </div>
                </div>
                <details className="experience-help" id="experience-help">
                  <summary>
                    어떤 경험을 적으면 좋을까요?
                    <ChevronDown size={15} />
                  </summary>
                  <p>
                    학력·교육, 자격증, 프로젝트, 포트폴리오, GitHub, 관심사·활동
                    모두 좋아요. 링크는 작업 설명과 함께 남겨주세요. 지금은 링크
                    안의 내용을 자동으로 읽지 않아요.
                  </p>
                </details>
                {draft.tags.length > 0 && (
                  <div className="selected-context">
                    <span>나의 관심</span>
                    {draft.tags.map((tag) => (
                      <span className="small-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => go(1)}
                      disabled={busy}
                      aria-label="관심 수정"
                    >
                      <PenLine size={13} />
                    </button>
                  </div>
                )}
                <div className="privacy-note">
                  <ShieldCheck size={16} />
                  <p>
                    입력은 이 브라우저에 저장돼요. 분석 시 경험과 관심을 서버로
                    보내며, AI 연결 시 분석 제공자에게 전달해요.
                  </p>
                </div>
                {error && (
                  <p className="form-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="form-actions experience-actions">
                  <button
                    className="primary-button"
                    disabled={
                      busy || (!draft.tags.length && !draft.experience.trim())
                    }
                    type="submit"
                  >
                    {busy ? (
                      <>
                        <LoaderCircle className="spinner" size={18} /> 경험 속
                        연결을 찾고 있어요
                      </>
                    ) : (
                      <>
                        나의 가능성 발견하기
                        <Sparkles size={18} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="skip-button"
                    disabled={busy}
                    onClick={() => go(1)}
                  >
                    <ArrowLeft size={14} /> 관심 다시 고르기
                  </button>
                </div>
                {busy && (
                  <p role="status" className="loading-note">
                    관심과 경험을 살펴보고 있어요. 잠시만 기다려주세요.
                  </p>
                )}
              </form>
            )}

            {page === 3 && (
              <div className="step-content results-content">
                <div className="intro">
                  <div className="step-kicker">
                    <Sparkles size={15} />{" "}
                    {draft.result?.mode === "demo"
                      ? "입력 기반 체험 결과"
                      : "AI가 찾아본 연결"}
                  </div>
                  <h1 ref={heading} tabIndex={-1}>
                    {draft.name.trim()
                      ? `${draft.name.trim()}님의 경험에서`
                      : "당신이 남긴 이야기에서"}
                    <br />
                    가능성을 찾았어요.
                  </h1>
                  <p>
                    정답이 아닌, 함께 탐색할 출발점이에요.
                    <br />
                    조금 더 알아보고 싶은 방향을 골라주세요.
                  </p>
                </div>
                {!draft.result?.hypotheses.length ? (
                  <div className="empty-result">
                    <Search size={28} />
                    <h2>조금 더 알면 연결을 찾을 수 있어요</h2>
                    <p>
                      어떤 일을 했는지 한 문장 더 적거나, 관심을 하나
                      골라주세요.
                    </p>
                    <button className="secondary-button" onClick={() => go(2)}>
                      경험 더하기
                    </button>
                  </div>
                ) : (
                  <div className="hypotheses">
                    {draft.result.hypotheses.map((h) => (
                      <button
                        key={h.id}
                        className={`hypothesis ${draft.tracks.includes(h.id) ? "selected" : ""}`}
                        aria-pressed={draft.tracks.includes(h.id)}
                        onClick={() =>
                          update({
                            tracks: draft.tracks.includes(h.id)
                              ? draft.tracks.filter((id) => id !== h.id)
                              : [...draft.tracks, h.id],
                          })
                        }
                      >
                        <div className="hypothesis-title">
                          <h2>{h.trackName}</h2>
                          <span className="option-check">
                            {draft.tracks.includes(h.id) && <Check size={13} />}
                          </span>
                        </div>
                        <p>{h.rationale}</p>
                        <div className="hypothesis-signals">
                          {h.keySignals.map((signal) => (
                            <span key={signal}>{signal}</span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <p className="demo-note">
                  {draft.result?.mode === "demo"
                    ? "현재는 관심·키워드로 연결을 찾는 체험 모드예요. 직무 적합성을 확정하거나 경력을 평가하지 않아요."
                    : "입력한 정보만으로 살펴본 잠정적인 제안이에요. 실제 경험을 더하며 방향을 조정할 수 있어요."}
                </p>
                <div className="form-actions">
                  <button
                    className="primary-button"
                    disabled={!draft.tracks.length}
                    onClick={complete}
                  >
                    첫 편지 받아보기 <Mail size={18} />
                  </button>
                  <button className="skip-button" onClick={() => go(2)}>
                    <ArrowLeft size={14} /> 경험을 더하고 다시 살펴보기
                  </button>
                </div>
              </div>
            )}
          </section>
          <LetterPreview
            tags={draft.tags}
            name={draft.name}
            experience={draft.experience}
            stage={page}
          />
        </main>
      )}

      {page === "paused" && (
        <main className="paused-layout">
          <div className="pause-icon">
            <Mail size={38} strokeWidth={1.4} />
          </div>
          <span className="step-kicker">우리의 이야기는 여기서 이어져요</span>
          <h1 ref={heading} tabIndex={-1}>
            가능성은,
            <br />
            기다리고 있을게요.
          </h1>
          <p>
            {storageError
              ? "브라우저 저장을 사용할 수 없어요. 현재 창에서 이어갈 수 있어요."
              : "지금까지 남긴 이야기를 이 브라우저에 저장했어요."}
            <br />
            준비가 되면, 멈춘 곳에서 다시 시작하세요.
          </p>
          <button className="primary-button" onClick={() => go(draft.resume)}>
            이어서 알아보기
            <ArrowRight size={18} />
          </button>
          <small>다른 기기에서는 이어지지 않아요.</small>
        </main>
      )}

      {page === "inbox" && (
        <main className="inbox-layout">
          <div className="inbox-intro">
            <div>
              <div className="step-kicker">
                <span className="live-dot" /> 나의 첫 번째 우편함
              </div>
              <h1 ref={heading} tabIndex={-1}>
                {draft.name.trim() || "당신"}님, 새로운 연결이 도착했어요.
              </h1>
              <p>
                왜 이 일이 연결됐는지 읽고, 마음이 가는 가능성을 남겨보세요.
              </p>
            </div>
            <span className="inbox-stamp">
              <Mail size={28} />
              <span>
                첫 편지
                <br />
                <strong>{draft.jobs.length.toString().padStart(2, "0")}</strong>
              </span>
            </span>
          </div>
          <div className="mailbox-notice">
            <Lightbulb size={17} />
            <span>
              온보딩 체험용 공고예요. 실제 모집 중인 채용공고가 아닙니다.
            </span>
          </div>
          <div className="mailbox-columns">
            <section>
              <div className="mailbox-tabs" role="group" aria-label="편지 필터">
                {(
                  [
                    ["all", "도착한 편지"],
                    ["saved", "관심 공고"],
                    ["passed", "넘긴 편지"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    aria-pressed={filter === key}
                    className={filter === key ? "active" : ""}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                    <span>
                      {
                        draft.jobs.filter((j) =>
                          key === "all"
                            ? j.status !== "passed"
                            : j.status === key,
                        ).length
                      }
                    </span>
                  </button>
                ))}
              </div>
              <div className="job-list">
                {draft.jobs
                  .filter((j) =>
                    filter === "all"
                      ? j.status !== "passed"
                      : j.status === filter,
                  )
                  .map((job) => (
                    <article className="job-card" key={job.id}>
                      <div className="job-card-top">
                        <span className="company-monogram">
                          {job.companyInitial}
                        </span>
                        <div>
                          <span className="company-name">
                            {job.company}{" "}
                            <span className="sample-label">체험</span>
                          </span>
                          <span className="job-location">
                            {job.location} · {job.experienceLevel}
                          </span>
                        </div>
                        <button
                          className={`icon-button save-button ${job.status === "saved" ? "is-saved" : ""}`}
                          aria-label={
                            job.status === "saved"
                              ? `${job.title} 저장 취소`
                              : `${job.title} 저장`
                          }
                          aria-pressed={job.status === "saved"}
                          onClick={() =>
                            changeJob(
                              job.id,
                              job.status === "saved" ? "arrived_new" : "saved",
                            )
                          }
                        >
                          <Bookmark size={20} />
                        </button>
                      </div>
                      <button
                        className="job-open"
                        onClick={() => setOpenedId(job.id)}
                      >
                        <h2>{job.title}</h2>
                        <p>{job.arrivalReason}</p>
                        <span>
                          나와 연결된 이유 읽기
                          <ArrowUpRight size={17} />
                        </span>
                      </button>
                      <div className="job-card-bottom">
                        <span>
                          <Mail size={13} /> {job.receivedAt}
                        </span>
                        <button
                          onClick={() =>
                            changeJob(
                              job.id,
                              job.status === "passed"
                                ? "arrived_new"
                                : "passed",
                            )
                          }
                        >
                          {job.status === "passed"
                            ? "다시 가져오기"
                            : "이번에는 넘기기"}
                          <ChevronRight size={13} />
                        </button>
                      </div>
                    </article>
                  ))}
                {!draft.jobs.some((j) =>
                  filter === "all"
                    ? j.status !== "passed"
                    : j.status === filter,
                ) && (
                  <div className="empty-result">
                    <Mail size={30} />
                    <h2>
                      {filter === "saved"
                        ? "마음에 드는 편지를 남겨보세요"
                        : filter === "passed"
                          ? "아직 넘긴 편지가 없어요"
                          : "도착한 편지를 모두 살펴봤어요"}
                    </h2>
                    <p>관심 공고와 넘긴 편지는 언제든 다시 확인할 수 있어요.</p>
                    <button
                      className="secondary-button"
                      onClick={() =>
                        setFilter(filter === "all" ? "passed" : "all")
                      }
                    >
                      {filter === "all" ? "넘긴 편지 보기" : "도착한 편지 보기"}
                    </button>
                  </div>
                )}
              </div>
            </section>
            <aside className="context-sidebar">
              <span className="sidebar-icon">
                <FolderOpen size={24} strokeWidth={1.5} />
              </span>
              <h2>
                이야기가 쌓이면,
                <br />
                연결도 더 선명해져요.
              </h2>
              <p>
                오늘은 작은 관심으로 시작했어요.
                <br />
                다음에는 당신의 경험을 더 들려주세요.
              </p>
              <div className="context-summary">
                <label>탐색 중인 방향</label>
                {draft.result?.hypotheses
                  .filter((h) => draft.tracks.includes(h.id))
                  .map((h) => (
                    <span key={h.id}>
                      <Check size={13} />
                      {h.trackName}
                    </span>
                  ))}
              </div>
              <button className="secondary-button" onClick={() => go(2)}>
                <Plus size={16} /> 경험 추가하고 다시 분석
              </button>
              <button className="text-button" onClick={() => go(3)}>
                탐색 방향 바꾸기
                <ChevronRight size={14} />
              </button>
              <div className="sidebar-footnote">
                <ShieldCheck size={14} /> 활동과 선택은 이 브라우저에 저장돼요.
              </div>
            </aside>
          </div>
        </main>
      )}

      <footer className="site-footer">
        <span>조금씩 알아가요. 당신의 다음 가능성.</span>
        <button onClick={() => setHelp(true)}>
          <MessageCircle size={14} /> 궁금한 점이 있나요?
        </button>
      </footer>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
          <button aria-label="알림 닫기" onClick={() => setToast("")}>
            <X size={14} />
          </button>
        </div>
      )}
      {help && (
        <Dialog title="처음이라 궁금한 것들" onClose={() => setHelp(false)}>
          <div className="faq">
            <h3>이력서가 꼭 필요한가요?</h3>
            <p>
              아니요. 관심 하나 또는 짧은 경험만으로 시작할 수 있어요. 학력,
              교육, 자격증, 프로젝트, GitHub 등은 이후 경험에 추가해 주세요.
            </p>
            <h3>추천 결과가 제 적성을 결정하나요?</h3>
            <p>
              가능한 방향을 살펴보는 출발점이에요. 결과를 읽고 직접 방향을
              고르거나, 경험을 수정해 다시 분석할 수 있어요.
            </p>
            <h3>지금 보이는 공고에 지원할 수 있나요?</h3>
            <p>
              현재 우편함은 체험용 예시 공고로 구성되어 있어요. 실제 채용
              지원이나 알림 발송 기능은 연결되어 있지 않아요.
            </p>
            <h3>제 정보는 어디에 저장되나요?</h3>
            <p>
              이름, 경험, 결과와 선택은 이 브라우저에 저장돼요. 분석 시 경험과
              관심은 서버에 보내며, AI가 연결된 경우 분석 제공자에게도 전달해요.
              저장 공간을 비우면 이어할 수 없어요.
            </p>
            <details className="reset-details">
              <summary>이 브라우저의 입력 내용 지우기</summary>
              <p>
                입력한 경험, 분석 결과, 저장한 공고를 모두 지우고 처음부터
                시작해요.
              </p>
              <button
                className="secondary-button"
                onClick={() => {
                  controller.current?.abort();
                  setDraft(fresh());
                  setHelp(false);
                  setOpenedId(null);
                  setToast("이 브라우저의 입력 내용을 지웠어요.");
                }}
              >
                <RotateCcw size={15} /> 모두 지우고 새로 시작
              </button>
            </details>
          </div>
        </Dialog>
      )}
      {currentJob && (
        <Dialog
          title="나의 첫 번째 커리어 레터"
          onClose={() => setOpenedId(null)}
        >
          <div className="report">
            <span className="sample-label">체험 공고</span>
            <p className="report-company">
              {currentJob.company} · {currentJob.location}
            </p>
            <h2>{currentJob.title}</h2>
            <p className="report-intro">
              To. {draft.name.trim() || "새로운 가능성을 찾는 당신"}
            </p>
            <p>{currentJob.arrivalReason}</p>
            <div className="report-section">
              <span className="report-section-icon">
                <Check size={18} />
              </span>
              <div>
                <h3>연결의 출발점</h3>
                {currentJob.pros.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <div className="hypothesis-signals">
                  {currentJob.evidences.map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="report-section">
              <span className="report-section-icon">
                <Search size={18} />
              </span>
              <div>
                <h3>함께 확인할 점</h3>
                {currentJob.checkPoints.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <div className="next-action">
              <div>
                <Sparkles size={18} />
                <h3>오늘 해볼 작은 한 가지</h3>
              </div>
              <p>{currentJob.preparationTips?.[0]}</p>
              <button
                aria-pressed={draft.done.includes(currentJob.id)}
                onClick={() =>
                  update({
                    done: draft.done.includes(currentJob.id)
                      ? draft.done.filter((id) => id !== currentJob.id)
                      : [...draft.done, currentJob.id],
                  })
                }
              >
                <span
                  className={`task-check ${draft.done.includes(currentJob.id) ? "checked" : ""}`}
                >
                  {draft.done.includes(currentJob.id) && <Check size={13} />}
                </span>
                {draft.done.includes(currentJob.id)
                  ? "준비를 마쳤어요"
                  : "완료한 뒤 체크하기"}
              </button>
            </div>
            <div className="report-actions">
              <button
                className="primary-button"
                onClick={() =>
                  changeJob(
                    currentJob.id,
                    currentJob.status === "saved" ? "arrived_new" : "saved",
                  )
                }
              >
                <Bookmark size={17} />
                {currentJob.status === "saved"
                  ? "관심 공고에서 빼기"
                  : "관심 공고로 남기기"}
              </button>
              <button
                className="skip-button"
                onClick={() => {
                  changeJob(currentJob.id, "passed");
                  setOpenedId(null);
                }}
              >
                이번에는 넘기기
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement;
    dialog?.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="dialog"
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        closeRef.current();
      }}
      onClick={(event) => {
        if (event.target === ref.current) {
          const rect = ref.current.getBoundingClientRect();
          if (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
          )
            closeRef.current();
        }
      }}
    >
      <div className="dialog-header">
        <span id="dialog-title">{title}</span>
        <button className="icon-button" aria-label="닫기" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}
