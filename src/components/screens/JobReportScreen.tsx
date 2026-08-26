import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, HelpCircle, FileText, ArrowLeft, Heart, Sparkles, Check, Send } from 'lucide-react';
import { JobPosting, UserProfile } from '../../types';

interface JobReportScreenProps {
  job: JobPosting;
  user: UserProfile;
  onBack: () => void;
  onSaveJob: (job: JobPosting) => void;
}

export const JobReportScreen: React.FC<JobReportScreenProps> = ({
  job,
  user,
  onBack,
  onSaveJob,
}) => {
  const [isSaved, setIsSaved] = useState(job.status === 'saved');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);

  const handleToggleSave = () => {
    setIsSaved(!isSaved);
    onSaveJob(job);
  };

  return (
    <div id="screen-job-report" className="flex flex-col min-h-full pb-24 px-5 pt-1 select-none relative">
      {/* Top Bar with Back, Title, Actions */}
      <div className="flex items-center justify-between mb-3 py-1">
        <button
          onClick={onBack}
          id="btn-report-back"
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#111111] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-[16px] font-bold text-[#111111] tracking-tight">리포트</div>

        <div className="flex items-center space-x-1 -mr-1">
          <button
            onClick={handleToggleSave}
            id="btn-report-save"
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#111111] hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isSaved ? 'text-[#FF5C5C] fill-[#FF5C5C]' : 'text-[#888888]'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Heading */}
      <h1 className="text-[25px] font-bold text-[#111111] tracking-tight leading-tight mb-4">
        이 공고,
        <br />
        나와 어떻게 맞을까요?
      </h1>

      {/* Company & Job Card Banner */}
      <div className="bg-white rounded-[22px] p-4.5 shadow-xs border border-gray-100 mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div
            className={`w-12 h-12 rounded-[16px] flex items-center justify-center font-bold text-sm ${job.companyLogoBg} shadow-xs flex-shrink-0`}
          >
            {job.companyInitial}
          </div>
          <div>
            <div className="text-[11.5px] font-semibold text-[#888888] mb-0.5">{job.company}</div>
            <div className="text-[16px] font-bold text-[#111111] leading-tight">{job.title}</div>
            <div className="text-[12px] text-[#666666] mt-0.5 font-medium">📍 {job.location}</div>
          </div>
        </div>

        <div className="text-right">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold bg-[#E8EEFF] text-[#4A6CF7] border border-[#D5E0FF]">
            {job.matchScore}% 매칭
          </span>
        </div>
      </div>

      {/* 3 Core Section Cards from Design Spec */}
      <div className="space-y-3.5 mb-6">
        {/* Section 1: 잘 맞는 점 */}
        <div
          id="report-section-pros"
          className="bg-white rounded-[22px] p-5 shadow-xs border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#EBF9F1] text-[#10B981] flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 fill-[#10B981] text-white" />
            </div>
            <h2 className="text-[15.5px] font-bold text-[#111111] tracking-tight">잘 맞는 점</h2>
          </div>

          <ul className="space-y-2">
            {job.pros.map((item, idx) => (
              <li key={idx} className="flex items-start text-[13.5px] text-[#444444] leading-relaxed font-medium">
                <span className="text-[#888888] mr-2 select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2: 확인할 점 */}
        <div
          id="report-section-checkpoints"
          className="bg-white rounded-[22px] p-5 shadow-xs border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#FEF6E6] text-[#F59E0B] flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4 fill-[#F59E0B] text-white" />
            </div>
            <h2 className="text-[15.5px] font-bold text-[#111111] tracking-tight">확인할 점</h2>
          </div>

          <ul className="space-y-2">
            {job.checkPoints.map((item, idx) => (
              <li key={idx} className="flex items-start text-[13.5px] text-[#444444] leading-relaxed font-medium">
                <span className="text-[#888888] mr-2 select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: 준비 근거 */}
        <div
          id="report-section-evidences"
          className="bg-white rounded-[22px] p-5 shadow-xs border border-gray-100"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-[#E8EEFF] text-[#4A6CF7] flex items-center justify-center flex-shrink-0">
              <FileText className="w-3.5 h-3.5 text-[#4A6CF7]" />
            </div>
            <h2 className="text-[15.5px] font-bold text-[#111111] tracking-tight">준비 근거</h2>
          </div>

          <ul className="space-y-2">
            {job.evidences.map((item, idx) => (
              <li key={idx} className="flex items-start text-[13.5px] text-[#444444] leading-relaxed font-medium">
                <span className="text-[#888888] mr-2 select-none">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Sticky Action Button: 지원 준비하기 */}
      <div className="fixed bottom-4 left-0 right-0 max-w-[390px] mx-auto px-5 z-40">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowApplyModal(true)}
          id="btn-prepare-application"
          className="w-full h-13 bg-[#111111] text-white rounded-[18px] text-[15px] font-bold flex items-center justify-center shadow-lg hover:bg-black transition-all cursor-pointer"
        >
          지원 준비하기
        </motion.button>
      </div>

      {/* Application Preparation Sheet Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="bg-white w-full max-w-[390px] rounded-t-[28px] p-6 pb-8 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4" />

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#E8EEFF] text-[#4A6CF7] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-[17px] font-bold text-[#111111]">맞춤 지원 가이드</h3>
                </div>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="text-[#888888] hover:text-[#111111] text-sm font-semibold"
                >
                  닫기
                </button>
              </div>

              <div className="mb-4 bg-[#F4F7FF] p-4 rounded-[18px] border border-[#E0E7FF]">
                <div className="text-[12.5px] font-bold text-[#4A6CF7] mb-1">
                  💡 {user.name}님을 위한 자기소개서 강조 팁
                </div>
                <div className="space-y-2 text-[13px] text-[#444444] font-medium">
                  {job.preparationTips && job.preparationTips.length > 0 ? (
                    job.preparationTips.map((tip, idx) => (
                      <p key={idx} className="leading-relaxed">
                        • {tip}
                      </p>
                    ))
                  ) : (
                    <p className="leading-relaxed">
                      • {job.evidences[0] || '기존 활동'}을 통한 정량적 성과와 실행 과정을 첫 단락에 요약해 보세요.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="text-[13.5px] font-bold text-[#111111]">추천 이력서 서술 문장</div>
                <div className="bg-[#FAFAFC] p-3.5 rounded-[14px] text-[13px] text-[#444444] leading-relaxed border border-gray-100 font-medium">
                  "{user.name}님의 {user.activities[0]?.title || '콘텐츠 제작 활동'}을 통해 타깃 독자의 니즈를 분석하고, {job.company}의 {job.title} 직무에서 지속 가능한 가치를 만들겠습니다."
                </div>
              </div>

              {applicationSubmitted ? (
                <div className="bg-[#EBF9F1] text-[#10B981] p-4 rounded-[16px] text-center font-bold text-sm flex items-center justify-center space-x-2">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>지원 준비 목록에 저장되었습니다!</span>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setApplicationSubmitted(true)}
                  className="w-full h-12 bg-[#4A6CF7] text-white rounded-[16px] text-[14.5px] font-bold flex items-center justify-center space-x-1.5 shadow-xs hover:bg-[#3B5BE0] transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>지원 체크리스트에 담기</span>
                </motion.button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

