import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Sparkles,
  Bookmark,
  Check,
  Plus,
  FolderOpen,
  PenLine,
  GraduationCap,
  Github,
  Award,
  Heart,
  ChevronDown,
  FileText,
  MoveUpRight,
} from "lucide-react";
import { initialJobPostings } from "./data/initialData";

const connections = [
  {
    label: "프로젝트에서 찾은 연결",
    sub: "만들어본 것들이, 다음 일의 단서로",
    icon: FolderOpen,
    job: 1,
    intro: "직접 고민하고 만들어낸 6개의 프로젝트를 살펴봤어요.",
    reason:
      "문제를 발견하고 화면으로 풀어낸 경험이, 사용자의 일상을 더 편리하게 만드는 일과 이어질 수 있겠어요.",
    evidence: "포트폴리오 속 6개의 프로젝트",
    strength: "문제를 화면으로 풀어내는 힘",
    gap: "사용자 리서치와 협업 과정",
    next: "대표 프로젝트 하나에 문제 정의부터 디자인 결정까지의 과정을 담아보세요.",
  },
  {
    label: "관심사에서 찾은 연결",
    sub: "자꾸 눈이 가는 것에도 이유가 있으니까",
    icon: Heart,
    job: 4,
    intro: "좋은 문장을 모으고, 꾸준히 글을 쓰는 일에 마음이 가는군요.",
    reason:
      "일상의 발견을 나만의 언어로 전하는 관심이, 브랜드의 이야기를 만드는 일과 연결될 수 있어요.",
    evidence: "글쓰기·콘텐츠에 대한 관심",
    strength: "꾸준히 쓰고 관찰하는 습관",
    gap: "브랜드의 목소리로 쓴 글",
    next: "좋아하는 브랜드 하나를 골라, 그 브랜드의 목소리를 담은 소개 글을 써보세요.",
  },
  {
    label: "활동에서 찾은 연결",
    sub: "꾸준히 쌓은 기록이, 새로운 가능성으로",
    icon: PenLine,
    job: 0,
    intro: "블로그에 차곡차곡 쌓아온 32편의 글을 발견했어요.",
    reason:
      "독자를 생각하며 주제를 고르고 글을 발행한 경험이, 사람과 브랜드를 연결하는 콘텐츠 마케팅의 시작이 될 수 있어요.",
    evidence: "블로그 글 32편 · SNS 콘텐츠 28건",
    strength: "기획부터 발행까지 해본 경험",
    gap: "콘텐츠 성과를 분석한 기록",
    next: "반응이 좋았던 글 3편을 골라 조회수, 독자 반응과 함께 정리해 보세요.",
  },
];
const faqs = [
  [
    "아직 희망 직무가 없어도 시작할 수 있나요?",
    "네. 좋아하는 일이나 해본 활동을 한 줄로 남겨도 시작할 수 있어요. 잡이쓰는 그 안에서 가능한 직무 방향을 제안하고, 경험이 쌓이면 연결을 더 구체적으로 살펴봅니다. 최종 선택은 언제나 내 몫이에요.",
  ],
  [
    "이력서나 포트폴리오를 꼭 준비해야 하나요?",
    "모든 자료를 준비할 필요는 없어요. 학력과 교육, 프로젝트, 자격증, GitHub 주소, 관심사 등 지금 공유할 수 있는 것부터 등록하세요. 내 경험 메뉴에서 언제든 추가하고 다시 분석할 수 있어요.",
  ],
  [
    "추천받은 공고가 마음에 들지 않으면 어떻게 하나요?",
    "관심 있는 공고는 저장하고, 맞지 않는 공고는 넘길 수 있어요. 선택은 내 우편함에 남고 추천 피드백으로 전달됩니다. 넘긴 공고도 다시 확인하고 되돌릴 수 있어요.",
  ],
  [
    "등록한 정보는 어디에 저장되나요?",
    "현재 체험 버전은 입력한 경험과 공고 선택을 이 브라우저에 저장합니다. 분석을 요청하면 입력 정보가 서버로 전송되며, AI가 연결된 환경에서는 분석 제공자에게 전달됩니다. 실제 채용 정보 연동 전에는 예시 공고가 표시되며, 브라우저 데이터를 삭제하면 저장한 내용도 사라져요.",
  ],
];

export default function Landing({ onStart }: { onStart: () => void }) {
  const [connection, setConnection] = useState(0);
  const [report, setReport] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const item = connections[connection];
  const job = initialJobPostings[item.job];
  const start = () => onStart();
  useEffect(() => {
    document.documentElement.classList.add("landing-scroll");
    return () => document.documentElement.classList.remove("landing-scroll");
  }, []);
  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>
      <header className="lp-site-header">
        <div className="nav-shell">
          <a className="lp-wordmark" href="#" aria-label="잡이쓰 홈">
            jobiss<span>.</span>
          </a>
          <nav aria-label="주요 메뉴">
            <a href="#how-it-works">잡이쓰 소개</a>
            <a href="#your-letter">도착한 기회</a>
            <a href="#faq">궁금한 점</a>
          </nav>
          <div className="nav-actions">
            <button className="lp-text-button" onClick={start}>
              내 우편함
            </button>
            <button className="button button-small button-dark" onClick={start}>
              시작하기 <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="hero-inner content-width">
            <div className="hero-copy">
              <p className="hero-kicker">
                <span className="tiny-dot" />
                나를 알아가는 새로운 취업 준비
              </p>
              <h1>
                해온 일 속에서,
                <br />
                앞으로의 일을
                <br />
                발견하세요<span className="headline-dot">.</span>
              </h1>
              <p className="hero-description">
                당신의 경험을 읽고, 가능성을 발견해요.
                <br />
                나를 이해한 채용 기회가 편지처럼 도착하는 곳.
              </p>
              <div className="hero-actions">
                <button className="button button-dark" onClick={start}>
                  나의 가능성 발견하기 <ArrowUpRight size={19} />
                </button>
                <a className="hero-demo" href="#your-letter">
                  먼저 둘러보기 <ArrowRight size={16} />
                </a>
              </div>
              <p className="hero-note">완벽한 이력서 없이, 경험 한 줄부터.</p>
            </div>
            <div className="hero-art">
              <span className="art-caption">
                A new chapter,
                <br />
                <em>addressed to you.</em>
              </span>
              <img
                className="envelope-image"
                src="/images/jobiss-envelope.webp"
                alt="하늘색 봉투에서 꺼낸, 나에게 도착한 잡이쓰의 편지"
                fetchPriority="high"
              />
              <div className="arrival-card">
                <div className="arrival-icon">
                  <Mail size={23} />
                  <i />
                </div>
                <div>
                  <small>잡이쓰에서 온 편지</small>
                  <strong>당신의 경험과 연결된 기회가 도착했어요.</strong>
                </div>
                <span>방금</span>
              </div>
              <div className="experience-slip">
                <FolderOpen size={17} />
                <span>나의 작은 프로젝트</span>
                <span className="slip-connection">
                  <Sparkles size={13} /> 새로운 가능성
                </span>
              </div>
              <span className="art-bottom">
                Every experience opens a possibility.
              </span>
            </div>
          </div>
          <div className="context-band content-width">
            <p>
              이력서 한 장보다,
              <br />
              <strong>당신의 이야기를 더 넓게.</strong>
            </p>
            <div className="context-items">
              {[
                [GraduationCap, "학력·교육"],
                [FolderOpen, "프로젝트"],
                [FileText, "포트폴리오"],
                [Github, "GitHub"],
                [Award, "자격증"],
                [Heart, "관심사·활동"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof Mail;
                return (
                  <span key={label as string}>
                    <I size={21} strokeWidth={1.5} />
                    {label as string}
                  </span>
                );
              })}
            </div>
          </div>
        </section>

        <section className="letter-section content-width" id="your-letter">
          <div className="section-heading">
            <span className="section-label">
              <Mail size={17} /> 기회가 도착하는 순간
            </span>
            <h2>
              이 공고가 온 데에는,
              <br />
              당신만의 이유가 있어요.
            </h2>
            <p>
              같은 공고도, 연결되는 이유는 저마다 다르니까.
              <br />내 경험에서 시작된 편지를 열어보세요.
            </p>
          </div>
          <div className="letter-layout">
            <div className="connection-menu">
              <div
                role="tablist"
                aria-label="연결의 시작점"
                className="connection-tabs"
              >
                {connections.map((c, i) => (
                  <button
                    key={c.label}
                    role="tab"
                    id={`connection-${i}`}
                    aria-controls="letter-panel"
                    aria-selected={connection === i}
                    tabIndex={connection === i ? 0 : -1}
                    onKeyDown={(e) => {
                      const keys = [
                        "ArrowRight",
                        "ArrowDown",
                        "ArrowLeft",
                        "ArrowUp",
                        "Home",
                        "End",
                      ];
                      if (!keys.includes(e.key)) return;
                      e.preventDefault();
                      const next =
                        e.key === "Home"
                          ? 0
                          : e.key === "End"
                            ? 2
                            : (i +
                                (["ArrowRight", "ArrowDown"].includes(e.key)
                                  ? 1
                                  : 2)) %
                              connections.length;
                      setConnection(next);
                      setReport(false);
                      document.getElementById(`connection-${next}`)?.focus();
                    }}
                    className={`connection-tab ${connection === i ? "lp-active" : ""}`}
                    onClick={() => {
                      setConnection(i);
                      setReport(false);
                    }}
                  >
                    <c.icon size={21} strokeWidth={1.5} />
                    <span>
                      <strong>{c.label}</strong>
                      <small>{c.sub}</small>
                    </span>
                    <ArrowUpRight size={18} />
                  </button>
                ))}
              </div>
              <div className="sample-note">
                <span className="sample-avatar">예시</span>
                <p>
                  <strong>예시로 만들어 본 편지예요.</strong>
                  <br />
                  나의 경험을 남기면, 나만의 연결이 시작돼요.
                </p>
              </div>
              <p className="letter-aside">
                당신을 한 가지 직무로 정의하지 않아요.
                <br />
                미처 몰랐던 가능성을 함께 찾아갈 뿐.
              </p>
            </div>
            <article
              className="letter-paper"
              id="letter-panel"
              role="tabpanel"
              aria-labelledby={`connection-${connection}`}
              tabIndex={0}
              key={connection}
            >
              <div className="lp-letter-top">
                <span className="letter-to">To. 경험을 쌓아온 당신</span>
                <span className="postmark">
                  a possibility
                  <br />
                  <b>for you</b>
                </span>
              </div>
              <p className="letter-greeting">이런 연결을 발견했어요.</p>
              <p className="letter-body">
                {item.intro}
                <br />
                {item.reason}
              </p>
              <div className="job-preview">
                <div className={`lp-company-monogram company-${item.job}`}>
                  {job.companyInitial}
                </div>
                <div>
                  <small>{job.company}</small>
                  <h3>{job.title}</h3>
                  <p>
                    {job.location}
                    <span>·</span>
                    {job.experienceLevel}
                  </p>
                </div>
                <ArrowUpRight size={21} />
              </div>
              <div className="letter-evidence">
                <Sparkles size={15} />
                <span>연결의 단서</span>
                <strong>{item.evidence}</strong>
              </div>
              {report && (
                <div className="inline-report">
                  <div>
                    <Check size={16} />
                    <p>
                      <b>이미 잘하고 있는 것</b>
                      {item.strength}
                    </p>
                  </div>
                  <div>
                    <Plus size={16} />
                    <p>
                      <b>더 채워보면 좋은 것</b>
                      {item.gap}
                    </p>
                  </div>
                  <div>
                    <ArrowRight size={16} />
                    <p>
                      <b>지금 해볼 수 있는 한 가지</b>
                      {item.next}
                    </p>
                  </div>
                </div>
              )}
              <div className="letter-actions">
                <button
                  onClick={() => setReport(!report)}
                  className="report-button"
                  aria-expanded={report}
                >
                  {report ? "리포트 접기" : "나와의 연결 자세히 보기"}{" "}
                  <ArrowRight size={16} />
                </button>
                <button className="save-letter" onClick={start}>
                  <Bookmark size={17} />
                  내 편지 받기
                </button>
              </div>
              <div className="letter-signoff">
                <span>당신의 다음을 응원하며,</span>
                <span className="lp-wordmark">
                  jobiss<span>.</span>
                </span>
              </div>
            </article>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="content-width">
            <div className="how-heading">
              <div>
                <span className="section-label">나의 다음을 만나는 방법</span>
                <h2>
                  조금씩 알려주세요.
                  <br />
                  연결은 잡이쓰가 찾아볼게요.
                </h2>
              </div>
              <p>
                흩어져 있던 경험이 모여,
                <br />
                나만의 커리어 방향이 되기까지.
              </p>
            </div>
            <div className="steps">
              <article>
                <div className="step-visual input-visual">
                  <div className="input-note">
                    <PenLine size={17} />
                    <p>
                      동아리에서 작은 전시를 기획했어요.
                      <br />
                      사람들의 반응을 보는 게 좋았어요
                      <span className="typing-cursor" />
                    </p>
                  </div>
                  <span className="little-tag">
                    <Plus size={12} /> 이 정도 경험도 괜찮아요
                  </span>
                </div>
                <span className="lp-step-number">01</span>
                <h3>해온 일을 들려주세요</h3>
                <p>
                  프로젝트부터 사소한 관심사까지.
                  <br />
                  지금 떠오르는 경험 하나면 충분해요.
                </p>
              </article>
              <article>
                <div className="step-visual signal-visual">
                  <span>전시 기획</span>
                  <span>관객의 반응</span>
                  <div className="signal-center">
                    <Sparkles size={23} />
                  </div>
                  <div className="signal-result">
                    <i />
                    경험을 설계하는 일의 가능성
                  </div>
                </div>
                <span className="lp-step-number">02</span>
                <h3>경험 사이의 연결을 발견해요</h3>
                <p>
                  AI가 흩어진 기록 속 단서를 읽고,
                  <br />
                  탐색해볼 만한 직무 방향을 제안해요.
                </p>
              </article>
              <article>
                <div className="step-visual next-visual">
                  <div className="mini-letter">
                    <Mail size={21} />
                    <span>새로운 기회가 도착했어요</span>
                    <Check size={14} />
                  </div>
                  <div className="next-line">
                    <span className="mini-check">
                      <Check size={12} />
                    </span>
                    잘 맞는 이유부터, 다음 준비까지
                  </div>
                </div>
                <span className="lp-step-number">03</span>
                <h3>이유가 담긴 기회를 만나요</h3>
                <p>
                  내게 온 공고를 읽고, 저장하고, 준비해요.
                  <br />
                  무엇을 선택할지는 언제나 당신의 몫.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="growth-section content-width">
          <div className="growth-copy">
            <span className="section-label">
              <Sparkles size={16} /> 한 번의 추천, 그다음까지
            </span>
            <h2>
              경험이 쌓일수록,
              <br />
              가능성도 선명해져요.
            </h2>
            <p>
              새로운 활동을 더하고, 관심 있는 공고를 골라보세요.
              <br />
              잡이쓰는 달라지는 당신을 계속 알아가요.
            </p>
            <button className="underlined-button" onClick={start}>
              내 경험부터 기록하기 <ArrowUpRight size={18} />
            </button>
          </div>
          <div className="growth-board">
            <div className="board-header">
              <span>
                <span className="tiny-dot" /> 나의 커리어 기록
              </span>
              <span>계속 자라는 중</span>
            </div>
            <div className="timeline">
              <div>
                <span className="timeline-icon">
                  <PenLine size={17} />
                </span>
                <p>
                  <strong>블로그를 꾸준히 써왔어요</strong>
                  <small>글쓰기 · 콘텐츠 기획</small>
                </p>
                <Check size={16} />
              </div>
              <div>
                <span className="timeline-icon">
                  <FolderOpen size={17} />
                </span>
                <p>
                  <strong>브랜드 프로젝트를 추가했어요</strong>
                  <small>브랜딩 · 스토리텔링</small>
                </p>
                <span className="new-label">새 경험</span>
              </div>
              <div className="timeline-insight">
                <Sparkles size={18} />
                <p>
                  <strong>브랜드 에디터도 탐색해볼까요?</strong>
                  <small>
                    글쓰기 경험에 브랜드를 이해하는 감각이 더해졌어요.
                  </small>
                </p>
              </div>
            </div>
            <p className="board-note">
              경험이 더해지면 연결도 달라질 수 있어요. · 예시
            </p>
          </div>
        </section>

        <section className="faq-section content-width" id="faq">
          <div>
            <span className="section-label">시작하기 전에</span>
            <h2>궁금한 점이 있나요?</h2>
            <p>부담 없이, 내 속도대로 시작하세요.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([q, a], i) => (
              <div className="faq-item" key={q}>
                <h3>
                  <button
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {q}
                    <ChevronDown
                      size={18}
                      className={openFaq === i ? "rotated" : ""}
                    />
                  </button>
                </h3>
                <div id={`faq-answer-${i}`} hidden={openFaq !== i}>
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="closing">
          <div className="content-width closing-inner">
            <div>
              <span>다음 이야기는, 당신에게.</span>
              <h2>
                생각보다 가까이에,
                <br />
                당신의 다음 일이 있어요.
              </h2>
              <button className="button button-dark" onClick={start}>
                나의 가능성 발견하기 <ArrowUpRight size={19} />
              </button>
            </div>
            <div className="closing-postage" aria-hidden="true">
              <MoveUpRight strokeWidth={1} size={83} />
              <span>
                your next
                <br />
                <b>begins here.</b>
              </span>
              <small>jobiss.</small>
            </div>
          </div>
        </section>
      </main>
      <footer className="lp-site-footer content-width">
        <div>
          <a href="#" className="lp-wordmark" aria-label="잡이쓰 홈">
            jobiss<span>.</span>
          </a>
          <p>당신의 경험이, 다음 기회가 되는 곳.</p>
        </div>
        <span>© {new Date().getFullYear()} Jobiss. All rights reserved.</span>
        <button
          className="lp-text-button"
          onClick={() => {
            setOpenFaq(3);
            document
              .getElementById("faq")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          내 정보는 어떻게 보관되나요? <ArrowUpRight size={14} />
        </button>
      </footer>
    </div>
  );
}
