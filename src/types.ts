export interface UserProfile {
  id: string;
  name: string;
  isLoggedIn: boolean;
  onboardingCompleted: boolean;
  interestSignals: string[];
  activities: UserActivity[];
  selectedTracks: string[];
  careerGoalNote?: string;
  notificationsEnabled: boolean;
  deliveryFrequency: 'immediate' | 'daily' | 'weekly';
}

export interface UserActivity {
  id: string;
  title: string;
  category: 'blog' | 'instagram' | 'portfolio' | 'project' | 'certificate' | 'custom';
  countOrDesc: string;
  iconName: string;
  dateAdded?: string;
}

export interface JobHypothesis {
  id: string;
  trackName: string;
  category: string;
  confidenceScore: number; // e.g. 88%
  status: 'recommended' | 'exploring' | 'secondary';
  rationale: string;
  keySignals: string[];
  matchedJobsCount: number;
}

export interface JobPosting {
  id: string;
  company: string;
  companyInitial: string;
  companyLogoBg: string; // e.g. "bg-slate-800 text-white"
  title: string;
  location: string;
  category: string;
  tags: string[];
  arrivalReason: string;
  matchScore: number; // e.g. 92
  pros: string[]; // 잘 맞는 점
  checkPoints: string[]; // 확인할 점
  evidences: string[]; // 준비 근거
  preparationTips?: string[]; // 지원 준비 팁
  status: 'arrived_new' | 'saved' | 'passed' | 'applied';
  receivedAt: string;
  deadline?: string;
  salary?: string;
  experienceLevel?: string;
  roleSummary?: string;
}

export type TabType = 'career' | 'explore' | 'inbox' | 'saved';

export type ScreenFlow = 
  | 'main_tab'
  | 'onboarding_quiz'
  | 'hypotheses_preview'
  | 'deep_analysis'
  | 'track_selection'
  | 'job_detail_report';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  jobId?: string;
}
