import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, LayoutGrid, RotateCcw, Send, Sparkles, Check, Heart, Mail } from 'lucide-react';
import {
  UserProfile,
  JobPosting,
  JobHypothesis,
  NotificationItem,
  TabType,
  ScreenFlow,
  UserActivity,
} from './types';
import {
  initialUserProfile,
  initialJobHypotheses,
  initialJobPostings,
  initialNotifications,
} from './data/initialData';
import { MobileFrame } from './components/MobileFrame';
import { MyCareerScreen } from './components/screens/MyCareerScreen';
import { ExploreJobsScreen } from './components/screens/ExploreJobsScreen';
import { ArrivedJobsScreen } from './components/screens/ArrivedJobsScreen';
import { JobReportScreen } from './components/screens/JobReportScreen';
import { SavedJobsScreen } from './components/screens/SavedJobsScreen';
import { OnboardingQuizScreen } from './components/screens/OnboardingQuizScreen';
import { HypothesisPreviewScreen } from './components/screens/HypothesisPreviewScreen';
import { DeepAnalysisScreen } from './components/screens/DeepAnalysisScreen';
import { TrackSelectionScreen } from './components/screens/TrackSelectionScreen';
import { ProfileSettingsModal } from './components/screens/ProfileSettingsModal';
import { AllScreensGalleryView } from './components/screens/AllScreensGalleryView';

export default function App() {
  const [viewMode, setViewMode] = useState<'mobile_device' | 'all_screens'>('mobile_device');
  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [hypotheses, setHypotheses] = useState<JobHypothesis[]>(initialJobHypotheses);
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobPostings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [activeTab, setActiveTab] = useState<TabType>('career');
  const [activeFlowScreen, setActiveFlowScreen] = useState<ScreenFlow>('main_tab');
  const [selectedJobForReport, setSelectedJobForReport] = useState<JobPosting | null>(jobs[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Job handlers
  const handleOpenReport = (job: JobPosting) => {
    setSelectedJobForReport(job);
    setActiveFlowScreen('job_detail_report');
  };

  const handleSaveJob = (job: JobPosting) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: j.status === 'saved' ? 'arrived_new' : 'saved' } : j))
    );
    showToast(job.status === 'saved' ? '관심 목록에서 해제되었습니다.' : '관심 공고에 저장되었습니다. 💌');
  };

  const handleSkipJob = async (job: JobPosting) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, status: 'passed' } : j))
    );
    showToast(`'${job.title}' 공고 피드백이 AI 가설에 반영되었습니다.`);

    try {
      await fetch('/api/ai/tune-hypothesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'passed', job }),
      });
    } catch {
      // Offline fallback
    }
  };

  const handleRemoveSavedJob = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'arrived_new' } : j))
    );
    showToast('관심 공고에서 삭제되었습니다.');
  };

  // Onboarding completion
  const handleOnboardingComplete = async (signals: string[], text: string) => {
    try {
      const res = await fetch('/api/ai/analyze-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textInput: text, selectedTags: signals }),
      });
      const data = await res.json();
      if (data.hypotheses && data.hypotheses.length > 0) {
        setHypotheses(data.hypotheses);
      }
      if (data.signals) {
        setUser((prev) => ({
          ...prev,
          interestSignals: Array.from(new Set([...prev.interestSignals, ...data.signals])),
        }));
      }
    } catch {
      // Offline fallback
    }
    setActiveFlowScreen('hypotheses_preview');
  };

  // Add new activity with AI analysis
  const handleAddActivity = (activity: UserActivity) => {
    setUser((prev) => ({
      ...prev,
      activities: [activity, ...prev.activities],
    }));
  };

  const handleRunAiAnalysis = async (newActivityDesc: string) => {
    try {
      const res = await fetch('/api/ai/analyze-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          textInput: newActivityDesc,
          selectedTags: user.interestSignals,
        }),
      });
      const data = await res.json();
      if (data.signals) {
        setUser((prev) => ({
          ...prev,
          interestSignals: Array.from(new Set([...prev.interestSignals, ...data.signals])),
        }));
      }
      if (data.hypotheses) {
        setHypotheses(data.hypotheses);
      }
    } catch {
      // Offline fallback
    }
  };

  // Simulate new mail carrier delivery
  const handleSimulateNewDelivery = () => {
    const newJob: JobPosting = {
      id: `job_new_${Date.now()}`,
      company: '스튜디오 크레센트',
      companyInitial: 'SC',
      companyLogoBg: 'bg-indigo-700 text-white',
      title: '브랜드 에디터 & 카피라이터',
      location: '서울 · 성동구 (성수)',
      category: '콘텐츠',
      tags: ['에디터', '브랜딩', '카피라이팅'],
      arrivalReason: `${user.interestSignals[0] || '글쓰기'} 관심 신호와 누적된 기록을 분석해 새롭게 도착했어요!`,
      matchScore: 91,
      pros: [
        '정기적인 텍스트 발행 습관으로 지속적인 창작 호흡을 유지하고 있어요.',
        '섬세한 문장 구사력과 브랜드 톤앤매너 조율 역량이 잠재되어 있어요.',
        '새로운 시도에 열려 있고 자기 주도성이 높아요.',
      ],
      checkPoints: [
        '브랜드 철학을 담은 롱폼 인터뷰 및 보도자료 작성 역량 증명이 필요해요.',
        '콘텐츠 반응 지표를 지속적으로 모니터링하는 습관을 보완하면 좋아요.',
      ],
      evidences: user.activities.map((a) => a.title).slice(0, 3),
      status: 'arrived_new',
      receivedAt: '방금 전',
    };

    setJobs((prev) => [newJob, ...prev]);
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '새로운 맞춤 공고가 우편함에 도착했어요 💌',
      message: `[${newJob.company}] ${newJob.title} 공고가 배달되었습니다.`,
      timestamp: '방금 전',
      read: false,
      jobId: newJob.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveTab('inbox');
    setActiveFlowScreen('main_tab');
    showToast('우편배달부가 새 공고 편지를 전달했습니다! 💌');
  };

  // Reset to initial demo state
  const handleResetData = () => {
    setUser(initialUserProfile);
    setHypotheses(initialJobHypotheses);
    setJobs(initialJobPostings);
    setNotifications(initialNotifications);
    setActiveTab('career');
    setActiveFlowScreen('main_tab');
    showToast('데이터가 초기 상태로 리셋되었습니다.');
  };

  const arrivedUnreadCount = jobs.filter((j) => j.status === 'arrived_new').length;
  const savedCount = jobs.filter((j) => j.status === 'saved').length;

  return (
    <div className="min-h-screen bg-[#E5E8EC] flex flex-col font-sans">
      {/* Top Desktop Navigation & View Mode Switcher */}
      <header className="bg-white border-b border-gray-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-xs z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#4A6CF7] flex items-center justify-center text-white shadow-xs font-bold text-sm">
            잡
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-[#111111] tracking-tight">잡있으</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#E8EEFF] text-[#4A6CF7] font-bold border border-[#D5E0FF]">
                AI 커리어 탐색
              </span>
            </div>
            <p className="text-xs text-[#666666] hidden sm:block font-medium">
              희망 직무가 명확하지 않은 구직자를 위한 AI 우편배달 모바일 앱
            </p>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex items-center space-x-2">
          {/* Toggle between Interactive Mobile Device and All 8-Screen Gallery */}
          <div className="bg-[#F0F2F5] p-1 rounded-[14px] flex items-center space-x-1 border border-gray-200">
            <button
              onClick={() => setViewMode('mobile_device')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'mobile_device'
                  ? 'bg-white text-[#4A6CF7] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>모바일 앱 체험 (390×844)</span>
            </button>
            <button
              onClick={() => setViewMode('all_screens')}
              className={`px-3 py-1.5 rounded-[10px] text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === 'all_screens'
                  ? 'bg-white text-[#4A6CF7] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>8개 화면 디자인 보드</span>
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={handleSimulateNewDelivery}
            className="px-3 py-1.5 bg-[#E8EEFF] hover:bg-[#D5E0FF] text-[#4A6CF7] rounded-[12px] text-xs font-bold border border-[#D5E0FF] transition-colors flex items-center space-x-1 cursor-pointer"
            title="새로운 맞춤 공고 배달 시뮬레이션"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">새 공고 배달</span>
          </button>

          <button
            onClick={() => {
              setActiveFlowScreen('onboarding_quiz');
              setViewMode('mobile_device');
            }}
            className="px-3 py-1.5 bg-[#FAFAFC] hover:bg-gray-100 text-[#111111] border border-gray-200 rounded-[12px] text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
            title="비회원 간편 탐색 온보딩"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4A6CF7]" />
            <span className="hidden sm:inline">온보딩 체험</span>
          </button>

          <button
            onClick={handleResetData}
            className="p-1.5 text-[#888888] hover:text-[#111111] rounded-[10px] hover:bg-gray-100 transition-colors cursor-pointer"
            title="초기 데이터 리셋"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Canvas Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 overflow-x-auto relative">
        {/* Global Floating Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xl flex items-center space-x-2"
            >
              <Check className="w-4 h-4 text-[#10B981]" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {viewMode === 'all_screens' ? (
          /* All 8-Screen Gallery Board */
          <AllScreensGalleryView
            user={user}
            hypotheses={hypotheses}
            jobs={jobs}
            onSelectScreenForInteractive={(screenName, data) => {
              if (screenName === 'job_detail_report' && data) {
                setSelectedJobForReport(data);
                setActiveFlowScreen('job_detail_report');
              } else if (screenName === 'deep_analysis') {
                setActiveFlowScreen('deep_analysis');
              } else if (screenName === 'track_selection') {
                setActiveFlowScreen('track_selection');
              } else if (screenName === 'onboarding_quiz') {
                setActiveFlowScreen('onboarding_quiz');
              } else if (screenName === 'hypotheses_preview') {
                setActiveFlowScreen('hypotheses_preview');
              } else if (['career', 'explore', 'inbox', 'saved'].includes(screenName)) {
                setActiveTab(screenName as TabType);
                setActiveFlowScreen('main_tab');
              }
              setViewMode('mobile_device');
            }}
          />
        ) : (
          /* Single Interactive Mobile Frame (390×844px) */
          <div className="flex flex-col items-center my-auto">
            <MobileFrame
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setActiveFlowScreen('main_tab');
              }}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              notifications={notifications}
              arrivedUnreadCount={arrivedUnreadCount}
              savedCount={savedCount}
              hideHeaderAndTabs={
                activeFlowScreen === 'job_detail_report' ||
                activeFlowScreen === 'onboarding_quiz' ||
                activeFlowScreen === 'hypotheses_preview' ||
                activeFlowScreen === 'deep_analysis' ||
                activeFlowScreen === 'track_selection'
              }
            >
              {/* Screen Rendering Router */}
              {activeFlowScreen === 'job_detail_report' && selectedJobForReport && (
                <JobReportScreen
                  job={selectedJobForReport}
                  user={user}
                  onBack={() => setActiveFlowScreen('main_tab')}
                  onSaveJob={handleSaveJob}
                />
              )}

              {activeFlowScreen === 'onboarding_quiz' && (
                <OnboardingQuizScreen
                  onComplete={handleOnboardingComplete}
                  onCancel={() => setActiveFlowScreen('main_tab')}
                />
              )}

              {activeFlowScreen === 'hypotheses_preview' && (
                <HypothesisPreviewScreen
                  hypotheses={hypotheses}
                  user={user}
                  onProceedToDeepAnalysis={() => setActiveFlowScreen('deep_analysis')}
                  onProceedToMainApp={() => {
                    setActiveTab('career');
                    setActiveFlowScreen('main_tab');
                  }}
                />
              )}

              {activeFlowScreen === 'deep_analysis' && (
                <DeepAnalysisScreen
                  user={user}
                  onBack={() => setActiveFlowScreen('main_tab')}
                  onAddActivity={handleAddActivity}
                  onRunAiAnalysis={handleRunAiAnalysis}
                />
              )}

              {activeFlowScreen === 'track_selection' && (
                <TrackSelectionScreen
                  user={user}
                  hypotheses={hypotheses}
                  onBack={() => setActiveFlowScreen('main_tab')}
                  onUpdateTracks={(newTracks) => {
                    setUser((prev) => ({ ...prev, selectedTracks: newTracks }));
                    showToast('직무 트랙이 성공적으로 저장되었습니다.');
                  }}
                />
              )}

              {activeFlowScreen === 'main_tab' && (
                <>
                  {activeTab === 'career' && (
                    <MyCareerScreen
                      user={user}
                      hypotheses={hypotheses}
                      arrivedJobs={jobs}
                      onOpenReport={handleOpenReport}
                      onOpenDeepAnalysis={() => setActiveFlowScreen('deep_analysis')}
                      onOpenTrackSelection={() => setActiveFlowScreen('track_selection')}
                      onNavigateToTab={(tab) => setActiveTab(tab)}
                    />
                  )}

                  {activeTab === 'explore' && (
                    <ExploreJobsScreen
                      jobs={jobs}
                      user={user}
                      onOpenReport={handleOpenReport}
                    />
                  )}

                  {activeTab === 'inbox' && (
                    <ArrivedJobsScreen
                      arrivedJobs={jobs}
                      user={user}
                      onOpenReport={handleOpenReport}
                      onSkipJob={handleSkipJob}
                      onSaveJob={handleSaveJob}
                    />
                  )}

                  {activeTab === 'saved' && (
                    <SavedJobsScreen
                      savedJobs={jobs.filter((j) => j.status === 'saved')}
                      user={user}
                      onOpenReport={handleOpenReport}
                      onRemoveSavedJob={handleRemoveSavedJob}
                      onNavigateToTab={(tab) => setActiveTab(tab)}
                    />
                  )}
                </>
              )}
            </MobileFrame>
          </div>
        )}
      </main>

      {/* Profile & Settings Modal */}
      <ProfileSettingsModal
        user={user}
        notifications={notifications}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        onClearActivities={() => {
          setUser((prev) => ({ ...prev, activities: [] }));
          showToast('활동 데이터가 초기화되었습니다.');
        }}
      />
    </div>
  );
}
