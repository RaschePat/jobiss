import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ArrowRight, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { JobPosting, UserProfile } from '../../types';
import { Mascot } from '../Mascot';

interface ArrivedJobsScreenProps {
  arrivedJobs: JobPosting[];
  user: UserProfile;
  onOpenReport: (job: JobPosting) => void;
  onSkipJob: (job: JobPosting) => void;
  onSaveJob: (job: JobPosting) => void;
}

export const ArrivedJobsScreen: React.FC<ArrivedJobsScreenProps> = ({
  arrivedJobs,
  user,
  onOpenReport,
  onSkipJob,
  onSaveJob,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isSavedToast, setIsSavedToast] = useState(false);

  const unhandledJobs = arrivedJobs.filter(
    (j) => j.status === 'arrived_new' || j.status === 'saved'
  );

  const currentJob = unhandledJobs[currentIndex] || unhandledJobs[0];

  const handleNext = (action: 'skip' | 'save') => {
    if (!currentJob) return;

    if (action === 'save') {
      onSaveJob(currentJob);
      setIsSavedToast(true);
      setTimeout(() => setIsSavedToast(false), 2000);
      setDirection('right');
    } else {
      onSkipJob(currentJob);
      setDirection('left');
    }

    setTimeout(() => {
      if (currentIndex < unhandledJobs.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(0);
      }
      setDirection(null);
    }, 280);
  };

  return (
    <div id="screen-arrived-jobs" className="flex flex-col min-h-full pb-20 px-5 pt-3 select-none relative">
      {/* Toast feedback */}
      <AnimatePresence>
        {isSavedToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#111111] text-white px-4 py-2 rounded-full text-[13px] font-medium shadow-md flex items-center space-x-1.5"
          >
            <Heart className="w-4 h-4 text-[#FF5C5C] fill-[#FF5C5C]" />
            <span>관심 공고에 저장되었습니다.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[25px] font-bold text-[#111111] tracking-tight leading-tight">
          새로운 공고가
          <br />
          도착했어요
        </h1>
        {unhandledJobs.length > 0 && (
          <div className="px-3 py-1 bg-[#E8EEFF] text-[#4A6CF7] text-xs font-bold rounded-full border border-[#D5E0FF]">
            {currentIndex + 1} / {unhandledJobs.length}
          </div>
        )}
      </div>

      {!currentJob ? (
        // Empty state when all jobs reviewed
        <div className="flex-1 flex flex-col items-center justify-center py-12 bg-white rounded-[24px] border border-gray-100 p-6 text-center shadow-xs">
          <Mascot pose="analyzing" size="lg" className="mb-4" />
          <h3 className="text-[17px] font-bold text-[#111111] mb-2">우편함의 편지를 모두 확인했어요!</h3>
          <p className="text-[13.5px] text-[#666666] max-w-[260px] leading-relaxed mb-5">
            {user.name}님의 활동과 관심 신호를 바탕으로 새로운 맞춤 공고를 준비하고 있어요.
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="inline-flex items-center px-4 py-2.5 bg-[#E8EEFF] text-[#4A6CF7] rounded-[16px] text-sm font-bold hover:bg-[#D5E0FF] transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            도착한 공고 다시 보기
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          {/* Animated Mail Envelope & Letter Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentJob.id}
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                x: direction === 'left' ? -180 : direction === 'right' ? 180 : 0,
                scale: 0.9,
                transition: { duration: 0.25 },
              }}
              className="relative mb-5"
            >
              {/* Envelope Structure */}
              <div className="relative pt-6 pb-2">
                {/* Envelope Backing */}
                <div className="absolute inset-0 top-12 bg-[#F0F2F5] rounded-[24px] border border-gray-200" />

                {/* Letter card popping out from envelope */}
                <div className="relative z-10 mx-3 bg-white rounded-[22px] p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center">
                  {/* Company Logo Badge */}
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-sm ${currentJob.companyLogoBg} shadow-xs mb-3`}
                  >
                    {currentJob.companyInitial}
                  </div>

                  <div className="text-[12px] font-semibold text-[#888888] mb-1">
                    {currentJob.company}
                  </div>
                  <h2 className="text-[20px] font-bold text-[#111111] tracking-tight mb-2">
                    {currentJob.title}
                  </h2>

                  <div className="inline-flex items-center text-[13px] text-[#666666] font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#888888]" />
                    <span>{currentJob.location}</span>
                  </div>

                  {/* Wax Seal Stamp */}
                  <div className="mt-4 -mb-10 z-20">
                    <div className="w-12 h-12 rounded-full bg-[#4A6CF7] text-white font-bold text-xs tracking-wider flex items-center justify-center shadow-md border-2 border-white ring-4 ring-[#E8EEFF]">
                      NEW
                    </div>
                  </div>
                </div>

                {/* Envelope Front Overlay Flap & Mascot */}
                <div className="relative z-10 -mt-3 pt-6 px-4 bg-[#F0F2F5] rounded-b-[24px] border-t border-gray-200/80 pb-3 flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-[#888888]">
                    우편배달부 직무 매칭 레터
                  </div>
                  <div className="absolute -top-10 right-1 z-30">
                    <Mascot pose="delivering" size="md" />
                  </div>
                </div>
              </div>

              {/* 이 공고가 도착한 이유 Card */}
              <div
                id="card-why-this-job-arrived"
                className="mt-3 bg-white rounded-[22px] p-4.5 px-5 shadow-xs border border-gray-100"
              >
                <div className="text-[14.5px] font-bold text-[#111111] mb-1.5 tracking-tight flex items-center">
                  <Sparkles className="w-4 h-4 text-[#4A6CF7] mr-1.5" />
                  이 공고가 도착한 이유
                </div>
                <p className="text-[13.5px] text-[#555555] leading-relaxed font-medium">
                  {currentJob.arrivalReason}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Buttons Row matching Clean Minimalism */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            {/* 넘기기 Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNext('skip')}
              id="btn-skip-job"
              className="h-13 bg-white border border-gray-200 text-[#555555] rounded-[18px] text-[14.5px] font-bold flex items-center justify-center space-x-1 shadow-xs hover:bg-gray-50 cursor-pointer"
            >
              <X className="w-4 h-4 text-[#888888]" />
              <span>넘기기</span>
            </motion.button>

            {/* 관심 Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNext('save')}
              id="btn-save-job"
              className="h-13 bg-white border border-gray-200 text-[#111111] rounded-[18px] text-[14.5px] font-bold flex items-center justify-center space-x-1 shadow-xs hover:bg-gray-50 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#FF5C5C]" />
              <span>관심</span>
            </motion.button>

            {/* 자세히 Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onOpenReport(currentJob)}
              id="btn-view-job-report"
              className="h-13 bg-[#111111] text-white rounded-[18px] text-[14.5px] font-bold flex items-center justify-center space-x-1 shadow-xs hover:bg-black cursor-pointer"
            >
              <span>자세히</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

