import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, FileText, BarChart2, Folder, Sparkles, PlusCircle } from 'lucide-react';
import { UserProfile, JobPosting, JobHypothesis } from '../../types';
import { Mascot } from '../Mascot';

interface MyCareerScreenProps {
  user: UserProfile;
  hypotheses: JobHypothesis[];
  arrivedJobs: JobPosting[];
  onOpenReport: (job: JobPosting) => void;
  onOpenDeepAnalysis: () => void;
  onOpenTrackSelection: () => void;
  onNavigateToTab: (tab: 'explore' | 'inbox' | 'saved') => void;
}

export const MyCareerScreen: React.FC<MyCareerScreenProps> = ({
  user,
  arrivedJobs,
  onOpenReport,
  onOpenDeepAnalysis,
  onOpenTrackSelection,
  onNavigateToTab
}) => {
  const recentJobs = arrivedJobs.slice(0, 2);

  return (
    <div id="screen-my-career" className="flex flex-col min-h-full pb-20 px-5 pt-3 select-none">
      {/* Top Greeting with Mascot */}
      <div className="flex items-start justify-between mb-5 pt-1">
        <div className="flex-1 pr-2">
          <h1 className="text-[25px] font-bold tracking-tight text-[#111111] leading-[1.28]">
            <span>{user.name}님,</span>
            <br />
            <span className="text-[#4A6CF7]">나에게 맞는 일</span>을
            <br />
            함께 찾아볼게요
          </h1>
        </div>
        <div className="relative -mt-1 flex-shrink-0">
          <Mascot pose="greeting" size="md" />
        </div>
      </div>

      {/* Main Card: AI가 이해한 나 */}
      <motion.div
        whileTap={{ scale: 0.985 }}
        onClick={onOpenTrackSelection}
        id="card-ai-understood-me"
        className="bg-white rounded-[22px] p-5 shadow-xs border border-gray-100 mb-4 cursor-pointer hover:border-[#4A6CF7]/30 transition-all"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1.5">
            <h2 className="text-[18px] font-bold text-[#111111] tracking-tight">AI가 이해한 나</h2>
          </div>
          <ChevronRight className="w-5 h-5 text-[#888888]" />
        </div>

        {/* 관심 신호 Pills */}
        <div className="mb-4">
          <div className="text-[12px] font-semibold text-[#888888] mb-2 uppercase tracking-wide">관심 신호</div>
          <div className="flex flex-wrap gap-1.5">
            {user.interestSignals.map((signal, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1 rounded-full text-[12.5px] font-semibold bg-[#E8EEFF] text-[#4A6CF7] border border-[#D5E0FF]"
              >
                {signal}
              </span>
            ))}
          </div>
        </div>

        {/* 나의 활동 */}
        <div>
          <div className="text-[12px] font-semibold text-[#888888] mb-2.5 uppercase tracking-wide">나의 활동</div>
          <div className="space-y-2">
            {user.activities.map((act) => (
              <div key={act.id} className="flex items-center space-x-3 text-[13.5px] text-[#444444] bg-[#FAFAFC] p-2.5 rounded-[14px] border border-gray-100">
                <div className="w-6 h-6 rounded-lg bg-white shadow-2xs flex items-center justify-center text-[#666666] flex-shrink-0">
                  {act.category === 'blog' && <FileText className="w-3.5 h-3.5" />}
                  {act.category === 'instagram' && <BarChart2 className="w-3.5 h-3.5" />}
                  {act.category === 'portfolio' && <Folder className="w-3.5 h-3.5" />}
                  {act.category === 'project' && <Sparkles className="w-3.5 h-3.5 text-[#4A6CF7]" />}
                </div>
                <span className="truncate font-medium">{act.title}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Action Banner: 관심 신호를 더 모아볼까요? */}
      <motion.div
        whileTap={{ scale: 0.985 }}
        onClick={onOpenDeepAnalysis}
        id="card-add-more-signals"
        className="bg-white rounded-[22px] p-4.5 px-5 shadow-xs border border-gray-100 mb-5 cursor-pointer hover:border-[#4A6CF7]/30 transition-all flex items-center justify-between"
      >
        <div className="pr-3">
          <div className="text-[11px] font-bold text-[#4A6CF7] uppercase tracking-wide mb-0.5">다음으로 추천해요</div>
          <div className="text-[15px] font-bold text-[#111111] tracking-tight">관심 신호를 더 모아볼까요?</div>
          <div className="text-[12.5px] text-[#666666] mt-0.5">활동을 더하면 맞춤 공고가 더 정밀해져요.</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#E8EEFF] text-[#4A6CF7] flex items-center justify-center flex-shrink-0 font-bold">
          <ChevronRight className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Newly Arrived Jobs Section */}
      <div id="section-new-arrived-jobs" className="mb-2">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h3 className="text-[16px] font-bold text-[#111111] tracking-tight">새로 도착한 공고</h3>
          <button
            onClick={() => onNavigateToTab('inbox')}
            className="text-[12px] font-semibold text-[#888888] hover:text-[#4A6CF7] transition-colors"
          >
            전체 보기
          </button>
        </div>

        <div className="space-y-2.5">
          {recentJobs.map((job) => (
            <motion.div
              key={job.id}
              whileTap={{ scale: 0.985 }}
              onClick={() => onOpenReport(job)}
              id={`job-preview-card-${job.id}`}
              className="bg-white rounded-[20px] p-4 px-4.5 shadow-xs border border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#4A6CF7]/30 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                {/* Company Logo Badge */}
                <div
                  className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-bold text-xs ${job.companyLogoBg} shadow-xs flex-shrink-0`}
                >
                  {job.companyInitial}
                </div>
                <div>
                  <div className="text-[11.5px] font-medium text-[#888888] leading-none mb-1">{job.company}</div>
                  <div className="text-[14.5px] font-bold text-[#111111] leading-tight">{job.title}</div>
                </div>
              </div>

              <div className="text-right flex-shrink-0 pl-2">
                <ChevronRight className="w-4.5 h-4.5 text-[#888888] ml-auto" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

