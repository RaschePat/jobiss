import { UserProfile, JobPosting, JobHypothesis, NotificationItem } from '../types';

export const initialUserProfile: UserProfile = {
  id: 'user_001',
  name: '민석',
  isLoggedIn: true,
  onboardingCompleted: true,
  interestSignals: ['글쓰기·콘텐츠', '마케팅', '디자인', '기획'],
  activities: [
    {
      id: 'act_1',
      title: '블로그 글 32편 발행',
      category: 'blog',
      countOrDesc: '32편 발행',
      iconName: 'FileText'
    },
    {
      id: 'act_2',
      title: '인스타그램 콘텐츠 기획·발행 28건',
      category: 'instagram',
      countOrDesc: '기획·발행 28건',
      iconName: 'BarChart2'
    },
    {
      id: 'act_3',
      title: '포트폴리오 6개 프로젝트 보유',
      category: 'portfolio',
      countOrDesc: '6개 프로젝트 보유',
      iconName: 'Folder'
    },
    {
      id: 'act_4',
      title: '노션 서비스 기획 스터디 정리 4편',
      category: 'project',
      countOrDesc: '스터디 및 아티클 4편',
      iconName: 'Bookmark'
    }
  ],
  selectedTracks: ['콘텐츠 마케터', 'UI/UX 디자이너', '서비스 기획자'],
  careerGoalNote: '콘텐츠 작성과 사용자 경험 기획 역량을 살려 주도적으로 성장할 수 있는 역할 탐색 중',
  notificationsEnabled: true,
  deliveryFrequency: 'daily'
};

export const initialJobHypotheses: JobHypothesis[] = [
  {
    id: 'hyp_1',
    trackName: '콘텐츠 마케터',
    category: '마케팅',
    confidenceScore: 92,
    status: 'recommended',
    rationale: '지속적인 블로그 글쓰기 경험과 인스타그램 채널 콘텐츠 발행 신호가 가장 강력하게 일치해요.',
    keySignals: ['글쓰기·콘텐츠', '스토리텔링', 'SNS 채널 운영'],
    matchedJobsCount: 8
  },
  {
    id: 'hyp_2',
    trackName: 'UI/UX 디자이너',
    category: '디자인',
    confidenceScore: 84,
    status: 'recommended',
    rationale: '포트폴리오 프로젝트 보유 및 시각적 레이아웃 구성에 대한 관심 신호가 관찰돼요.',
    keySignals: ['디자인 툴', '사용자 경험', '포트폴리오'],
    matchedJobsCount: 5
  },
  {
    id: 'hyp_3',
    trackName: '서비스 기획자 (PM/PO)',
    category: '기획',
    confidenceScore: 78,
    status: 'exploring',
    rationale: '문제 정의 및 서비스 구조화 스터디 기록을 바탕으로 기획 트랙 가능성을 탐색 중이에요.',
    keySignals: ['기획', '문제 정의', '문서화'],
    matchedJobsCount: 4
  },
  {
    id: 'hyp_4',
    trackName: '브랜드 에디터',
    category: '콘텐츠',
    confidenceScore: 74,
    status: 'secondary',
    rationale: '브랜드 보이스 형성 및 텍스트 기반 에디토리얼 작업에 적합한 역량을 보여요.',
    keySignals: ['글쓰기·콘텐츠', '브랜딩', '카피라이팅'],
    matchedJobsCount: 3
  }
];

export const initialJobPostings: JobPosting[] = [
  {
    id: 'job_1',
    company: '브랜딩랩',
    companyInitial: 'BR',
    companyLogoBg: 'bg-slate-800 text-white',
    title: '콘텐츠 마케터',
    location: '서울 · 강남구',
    category: '콘텐츠',
    tags: ['콘텐츠', '마케팅', '블로그', 'SNS'],
    arrivalReason: '글쓰기·콘텐츠 관심과 블로그 운영 경험이 이 직무와 잘 맞을 것 같아서 도착했어요.',
    matchScore: 94,
    pros: [
      '블로그 운영 및 콘텐츠 발행 경험이 있어요.',
      '글쓰기·콘텐츠에 지속적인 관심을 보여왔어요.',
      '기획부터 발행까지의 흐름을 이해하고 있어요.'
    ],
    checkPoints: [
      '다양한 채널 콘텐츠 제작 경험이 더 필요해요.',
      '데이터 기반 콘텐츠 성과 분석 경험이 부족해요.',
      '트렌드를 빠르게 반영하는 능력을 키우면 좋아요.'
    ],
    evidences: [
      '블로그 글 32편 발행',
      '인스타그램 콘텐츠 기획·발행 28건',
      '포트폴리오 6개 프로젝트 보유'
    ],
    preparationTips: [
      '기존 블로그 글 중 반응이 좋았던 대표 글 3편을 선별해 성과 지표(조회수, 댓글 등)와 함께 요약해 보세요.',
      '인스타그램 카드뉴스 기획 의도와 타깃 독자 정의 과정을 1장으로 정리하면 설득력이 높아져요.'
    ],
    status: 'arrived_new',
    receivedAt: '오늘 오전 9:15',
    salary: '3,600 ~ 4,500만원',
    experienceLevel: '신입 ~ 경력 3년',
    roleSummary: '브랜딩랩의 브랜드 채널 콘텐츠(블로그, 뉴스레터, SNS) 기획 및 제작을 주도할 분을 찾습니다.'
  },
  {
    id: 'job_2',
    company: '모노디자인',
    companyInitial: 'M',
    companyLogoBg: 'bg-blue-600 text-white',
    title: 'UI/UX 디자이너',
    location: '서울 · 마포구',
    category: '디자인',
    tags: ['UI/UX', 'Figma', '디자인시스템'],
    arrivalReason: '포트폴리오와 디자인 관심 신호가 이 직무와 연결돼요.',
    matchScore: 86,
    pros: [
      '실제 6개 이상의 프로젝트 포트폴리오를 구성해 본 경험이 있어요.',
      '사용자 중심의 화면 구조와 시각적 위계에 관심이 높아요.',
      '디자인 툴 활용 및 컴포넌트 구조화에 친숙해요.'
    ],
    checkPoints: [
      '실제 프로덕트 릴리즈 및 개발팀과의 협업 핸드오프 경험을 보완하면 좋아요.',
      '사용자 인터뷰 및 정량적 유저 리서치 데이터 활용 사례가 필요해요.'
    ],
    evidences: [
      '포트폴리오 6개 프로젝트 보유',
      '디자인 관심 신호 등록'
    ],
    preparationTips: [
      '포트폴리오 프로젝트 중 문제 해결 과정(Before/After)이 드러난 대표 케이스스터디를 강조해 보세요.'
    ],
    status: 'arrived_new',
    receivedAt: '어제 오후 4:20',
    salary: '3,800 ~ 4,800만원',
    experienceLevel: '신입 ~ 경력 2년',
    roleSummary: '사용자 친화적인 모바일/웹 인터페이스를 디자인하고 디자인 시스템을 함께 구축해 나갈 디자이너를 모십니다.'
  },
  {
    id: 'job_3',
    company: '퍼플컴퍼니',
    companyInitial: 'P.',
    companyLogoBg: 'bg-indigo-900 text-white',
    title: '마케팅 기획자',
    location: '서울 · 종로구',
    category: '마케팅',
    tags: ['퍼포먼스', '마케팅기획', '캠페인'],
    arrivalReason: '마케팅 콘텐츠 기획 경험이 이 직무와 잘 맞아요.',
    matchScore: 82,
    pros: [
      '인스타그램 28건의 콘텐츠 기획 경험으로 타깃 맞춤 메시지 작성에 능숙해요.',
      '트렌디한 카피라이팅과 기획 감각을 보유하고 있어요.'
    ],
    checkPoints: [
      '유료 광고 집행(Meta Ads, Google Ads) 및 ROAS 최적화 경험을 채워보세요.',
      'GA4 등 마케팅 트래킹 툴 기초 사용법을 익히면 유리해요.'
    ],
    evidences: [
      '인스타그램 콘텐츠 기획·발행 28건',
      '마케팅 관심 신호 등록'
    ],
    preparationTips: [
      '콘텐츠별 도달률과 인게이지먼트를 비교한 미니 리포트를 포트폴리오에 첨부해 보세요.'
    ],
    status: 'arrived_new',
    receivedAt: '2일 전',
    salary: '3,500 ~ 4,400만원',
    experienceLevel: '신입 ~ 경력 3년',
    roleSummary: '신규 브랜드 런칭 캠페인 기획 및 통합 마케팅 커뮤니케이션(IMC)을 담당할 기획자입니다.'
  },
  {
    id: 'job_4',
    company: '넥스트웨이브',
    companyInitial: 'NW',
    companyLogoBg: 'bg-emerald-700 text-white',
    title: '서비스 기획자 (Junior PM)',
    location: '서울 · 서초구',
    category: '기획',
    tags: ['서비스기획', 'PM', '데이터분석'],
    arrivalReason: '노션 아티클 정리와 논리적 문제 정의 관심 신호가 연결돼요.',
    matchScore: 79,
    pros: [
      '정보를 구조화하고 체계적으로 문서화하는 역량이 돋보여요.',
      '서비스 기능에 대한 비판적 사고와 사용자 관점의 개선 아이디어가 풍부해요.'
    ],
    checkPoints: [
      '정책서(PRD) 및 와이어프레임 상세 명세서 작성 경험을 쌓아보세요.',
      '개발 지식(API, DB 구조)에 대한 기초 이해도가 요구돼요.'
    ],
    evidences: [
      '노션 서비스 기획 스터디 정리 4편',
      '기획 관심 신호 등록'
    ],
    status: 'saved',
    receivedAt: '3일 전',
    salary: '3,800 ~ 4,600만원',
    experienceLevel: '신입 ~ 경력 2년',
    roleSummary: 'B2C 모바일 서비스 기능 기획 및 유저 저니 개선을 함께할 주니어 서비스 기획자를 모십니다.'
  },
  {
    id: 'job_5',
    company: '스튜디오 크레센트',
    companyInitial: 'SC',
    companyLogoBg: 'bg-amber-700 text-white',
    title: '브랜드 에디터 & 카피라이터',
    location: '서울 · 성동구 (성수)',
    category: '콘텐츠',
    tags: ['에디터', '브랜딩', '카피라이팅'],
    arrivalReason: '글쓰기 관심과 지속적인 텍스트 발행 역량이 높은 평가를 받았어요.',
    matchScore: 88,
    pros: [
      '정기적인 텍스트 발행 습관으로 지속적인 창작 호흡을 유지하고 있어요.',
      '섬세한 문장 구사력과 브랜드 톤앤매너 조율 역량이 잠재되어 있어요.'
    ],
    checkPoints: [
      '브랜드 철학을 담은 롱폼 인터뷰 및 보도자료 작성 역량 증명이 필요해요.'
    ],
    evidences: [
      '블로그 글 32편 발행',
      '글쓰기·콘텐츠 관심 신호'
    ],
    status: 'arrived_new',
    receivedAt: '오늘 오전 8:00',
    salary: '3,400 ~ 4,200만원',
    experienceLevel: '신입',
    roleSummary: '성수동 감성 라이프스타일 브랜드의 스토리텔링과 브랜드 저널을 담당할 에디터입니다.'
  },
  {
    id: 'job_6',
    company: '데이터그루브',
    companyInitial: 'DG',
    companyLogoBg: 'bg-cyan-800 text-white',
    title: '그로스 콘텐츠 마케터',
    location: '서울 · 송파구',
    category: '마케팅',
    tags: ['그로스', 'A/B테스트', '콘텐츠'],
    arrivalReason: '인스타그램 콘텐츠 분석 및 마케팅 기획 역량을 바탕으로 매칭되었어요.',
    matchScore: 81,
    pros: [
      '콘텐츠 소재 제작부터 반응 파악까지 빠른 호흡으로 실행할 수 있어요.'
    ],
    checkPoints: [
      '전환율(CVR) 분석 및 퍼널 단계별 실험 설계 경험이 필요해요.'
    ],
    evidences: [
      '인스타그램 콘텐츠 기획·발행 28건'
    ],
    status: 'arrived_new',
    receivedAt: '어제 오전 11:30',
    salary: '3,700 ~ 4,700만원',
    experienceLevel: '신입 ~ 경력 2년',
    roleSummary: '가설 기반 콘텐츠 실험으로 신규 유저 유입과 전환을 극대화할 그로스 마케터를 찾습니다.'
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    title: '새로운 공고가 우편함에 도착했어요 💌',
    message: '민석님의 블로그 및 글쓰기 활동과 잘 맞는 [브랜딩랩] 콘텐츠 마케터 공고가 도착했습니다.',
    timestamp: '10분 전',
    read: false,
    jobId: 'job_1'
  },
  {
    id: 'notif_2',
    title: '직무 가설이 더 정교해졌어요 🧭',
    message: '새로 등록해주신 활동을 분석하여 [UI/UX 디자이너] 트랙 추천도가 업데이트되었습니다.',
    timestamp: '2시간 전',
    read: false
  },
  {
    id: 'notif_3',
    title: '우편배달부의 주간 커리어 리포트',
    message: '이번 주 민석님에게 가장 반응이 좋았던 상위 직무는 [콘텐츠 마케터]였습니다.',
    timestamp: '어제',
    read: true
  }
];
