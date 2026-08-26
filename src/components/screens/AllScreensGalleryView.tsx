import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Layers, Eye, Smartphone, ZoomIn, ZoomOut, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { UserProfile, JobPosting, JobHypothesis } from '../../types';
import { MyCareerScreen } from './MyCareerScreen';
import { ExploreJobsScreen } from './ExploreJobsScreen';
import { ArrivedJobsScreen } from './ArrivedJobsScreen';
import { JobReportScreen } from './JobReportScreen';
import { SavedJobsScreen } from './SavedJobsScreen';
import { OnboardingQuizScreen } from './OnboardingQuizScreen';
import { HypothesisPreviewScreen } from './HypothesisPreviewScreen';
import { DeepAnalysisScreen } from './DeepAnalysisScreen';
import { TrackSelectionScreen } from './TrackSelectionScreen';

interface AllScreensGalleryViewProps {
  user: UserProfile;
  hypotheses: JobHypothesis[];
  jobs: JobPosting[];
  onSelectScreenForInteractive: (screenName: string, data?: any) => void;
}

export const AllScreensGalleryView: React.FC<AllScreensGalleryViewProps> = ({
  user,
  hypotheses,
  jobs,
  onSelectScreenForInteractive,
}) => {
  const [scale, setScale] = useState(0.85);
  const sampleJob = jobs[0];

  const screens = [
    {
      id: 'screen_1',
      number: '1',
      title: '내 커리어 (홈)',
      desc: 'AI가 이해한 관심 신호 및 활동 요약, 새 공고 프리뷰',
      render: (
        <MyCareerScreen
          user={user}
          hypotheses={hypotheses}
          arrivedJobs={jobs}
          onOpenReport={() => onSelectScreenForInteractive('job_detail_report', sampleJob)}
          onOpenDeepAnalysis={() => onSelectScreenForInteractive('deep_analysis')}
          onOpenTrackSelection={() => onSelectScreenForInteractive('track_selection')}
          onNavigateToTab={(tab) => onSelectScreenForInteractive(tab)}
        />
      ),
    },
    {
      id: 'screen_2',
      number: '2',
      title: '공고 탐색',
      desc: '키워드 검색, 카테고리 필터링 및 도착한 이유 태그 추천 공고',
      render: (
        <ExploreJobsScreen
          jobs={jobs}
          user={user}
          onOpenReport={(job) => onSelectScreenForInteractive('job_detail_report', job)}
        />
      ),
    },
    {
      id: 'screen_3',
      number: '3',
      title: '도착한 공고 (우편함)',
      desc: '우편배달부 레터 봉투 및 왁스실, 넘기기/관심/자세히 인터랙션',
      render: (
        <ArrivedJobsScreen
          arrivedJobs={jobs}
          user={user}
          onOpenReport={(job) => onSelectScreenForInteractive('job_detail_report', job)}
          onSkipJob={() => {}}
          onSaveJob={() => {}}
        />
      ),
    },
    {
      id: 'screen_4',
      number: '4',
      title: '개인 맞춤 공고 리포트',
      desc: '잘 맞는 점, 확인할 점, 준비 근거 3단 구조 및 지원 준비하기',
      render: (
        <JobReportScreen
          job={sampleJob}
          user={user}
          onBack={() => {}}
          onSaveJob={() => {}}
        />
      ),
    },
    {
      id: 'screen_5',
      number: '5',
      title: '비회원 간편 탐색',
      desc: '3단계 신호 수집 온보딩과 우편배달부 질문지 가이드',
      render: (
        <OnboardingQuizScreen
          onComplete={() => onSelectScreenForInteractive('hypotheses_preview')}
        />
      ),
    },
    {
      id: 'screen_6',
      number: '6',
      title: '임시 직무 후보',
      desc: '초기 신호 기반 AI 직무 가설 제안 및 일치도 분석',
      render: (
        <HypothesisPreviewScreen
          hypotheses={hypotheses}
          user={user}
          onProceedToDeepAnalysis={() => onSelectScreenForInteractive('deep_analysis')}
          onProceedToMainApp={() => onSelectScreenForInteractive('career')}
        />
      ),
    },
    {
      id: 'screen_7',
      number: '7',
      title: '자료 기반 정밀 분석',
      desc: '블로그, SNS, 포트폴리오 자료 등록 및 AI 신호 추출',
      render: (
        <DeepAnalysisScreen
          user={user}
          onBack={() => {}}
          onAddActivity={() => {}}
          onRunAiAnalysis={async () => {}}
        />
      ),
    },
    {
      id: 'screen_8',
      number: '8',
      title: '관심 공고 보관함',
      desc: '사용자가 찜한 맞춤 공고 리스트 및 지원 상태 추적',
      render: (
        <SavedJobsScreen
          savedJobs={jobs.slice(0, 3)}
          user={user}
          onOpenReport={(job) => onSelectScreenForInteractive('job_detail_report', job)}
          onRemoveSavedJob={() => {}}
          onNavigateToTab={(tab) => onSelectScreenForInteractive(tab)}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#E5E8EC] text-[#111111] p-6 select-none">
      {/* Top Banner Control */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-6 mb-8 border-b border-gray-300 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[#4A6CF7] text-sm font-bold mb-1">
            <Layers className="w-4 h-4" />
            <span>잡있으 (JobIs) 모바일 앱 UI/UX 디자인 시스템 보드</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
            8개 핵심 화면 규격 갤러리 (390×844px)
          </h1>
          <p className="text-sm text-[#666666] mt-1 font-medium">
            모든 화면은 Clean Minimalism 테마(22px 카드 곡률, #F0F2F5 소프트 배경, #4A6CF7 브랜드 블루)로 정밀하게 설계되었습니다.
          </p>
        </div>

        {/* Zoom and actions */}
        <div className="flex items-center space-x-3 bg-white p-2 rounded-[16px] border border-gray-200 shadow-xs">
          <button
            onClick={() => setScale((s) => Math.max(0.6, s - 0.1))}
            className="p-2 rounded-[10px] text-[#666666] hover:text-[#111111] hover:bg-gray-100 transition-colors cursor-pointer"
            title="축소"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-[#111111] px-1">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(1.05, s + 0.1))}
            className="p-2 rounded-[10px] text-[#666666] hover:text-[#111111] hover:bg-gray-100 transition-colors cursor-pointer"
            title="확대"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => onSelectScreenForInteractive('career')}
            className="ml-2 px-3.5 py-1.5 bg-[#4A6CF7] hover:bg-[#3B5BE0] text-white rounded-[12px] text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>모바일 인터랙션 모드로 전환</span>
          </button>
        </div>
      </div>

      {/* Grid of 8 Mobile Devices */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-16 justify-items-center">
        {screens.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            {/* Screen Header Badge */}
            <div className="w-[340px] mb-3 flex items-center justify-between px-2">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-[#4A6CF7] text-white text-xs font-bold flex items-center justify-center">
                  {item.number}
                </span>
                <span className="text-sm font-bold text-[#111111] tracking-tight">{item.title}</span>
              </div>
              <button
                onClick={() => onSelectScreenForInteractive(item.id.replace('screen_', ''))}
                className="text-xs text-[#4A6CF7] hover:text-[#3B5BE0] font-bold flex items-center space-x-0.5 cursor-pointer"
              >
                <span>직접 사용</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Device Frame Container (Scaled) */}
            <div
              style={{
                width: 390 * scale,
                height: 844 * scale,
                position: 'relative',
              }}
              className="rounded-[40px] shadow-xl bg-black p-[10px] ring-1 ring-gray-400/40 overflow-hidden group"
            >
              {/* Inner screen content */}
              <div
                style={{
                  width: 370,
                  height: 824,
                  transform: `scale(${scale * (370 / 390)})`,
                  transformOrigin: 'top left',
                }}
                className="bg-[#F0F2F5] rounded-[32px] overflow-hidden flex flex-col relative text-[#111111]"
              >
                {/* Status Bar */}
                <div className="h-10 pt-2 px-6 flex items-center justify-between text-xs font-semibold text-[#111111] bg-transparent flex-shrink-0 z-30">
                  <span>9:41</span>
                  <div className="w-20 h-4.5 bg-black rounded-full mx-auto" />
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-bold">5G</span>
                    <div className="w-4 h-2 rounded-xs border border-[#111111] relative">
                      <div className="w-2.5 h-1 bg-[#111111] absolute top-0.5 left-0.5" />
                    </div>
                  </div>
                </div>

                {/* Body Component */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                  {item.render}
                </div>
              </div>
            </div>

            <p className="w-[320px] text-xs text-[#666666] font-medium text-center mt-3 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
