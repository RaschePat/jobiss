import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ChevronRight, Trash2 } from 'lucide-react';
import { JobPosting, UserProfile } from '../../types';
import { Mascot } from '../Mascot';

interface SavedJobsScreenProps {
  savedJobs: JobPosting[];
  user: UserProfile;
  onOpenReport: (job: JobPosting) => void;
  onRemoveSavedJob: (jobId: string) => void;
  onNavigateToTab: (tab: 'explore' | 'inbox') => void;
}

export const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({
  savedJobs,
  user,
  onOpenReport,
  onRemoveSavedJob,
  onNavigateToTab,
}) => {
  return (
    <div id="screen-saved-jobs" className="flex flex-col min-h-full pb-20 px-5 pt-3 select-none">
      {/* Page Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[25px] font-bold text-[#111111] tracking-tight leading-tight">
            관심 공고
          </h1>
          <p className="text-[12.5px] text-[#666666] mt-0.5 font-medium">
            우편함에서 찜해둔 직무 기회들이에요.
          </p>
        </div>
        <span className="px-3 py-1 bg-[#FFF0F0] text-[#FF5C5C] text-xs font-bold rounded-full border border-[#FFE0E0]">
          {savedJobs.length}건
        </span>
      </div>

      {savedJobs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 bg-white rounded-[24px] border border-gray-100 p-6 text-center shadow-xs">
          <Mascot pose="curious" size="lg" className="mb-3" />
          <h3 className="text-[17px] font-bold text-[#111111] mb-1">아직 보관된 관심 공고가 없어요</h3>
          <p className="text-[13px] text-[#666666] max-w-[240px] leading-relaxed mb-5 font-medium">
            도착한 공고 우편함이나 공고 탐색에서 마음에 드는 공고의 하트를 눌러보세요.
          </p>
          <button
            onClick={() => onNavigateToTab('inbox')}
            className="px-5 py-2.5 bg-[#111111] text-white rounded-[16px] text-sm font-bold shadow-xs hover:bg-black transition-colors"
          >
            도착한 공고 보러가기
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {savedJobs.map((job) => (
            <motion.div
              key={job.id}
              whileTap={{ scale: 0.985 }}
              id={`saved-job-${job.id}`}
              className="bg-white rounded-[22px] p-4.5 shadow-xs border border-gray-100 hover:border-[#4A6CF7]/30 transition-all relative"
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  onClick={() => onOpenReport(job)}
                  className="flex items-center space-x-3.5 flex-1 cursor-pointer"
                >
                  <div
                    className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-bold text-xs ${job.companyLogoBg} shadow-xs flex-shrink-0`}
                  >
                    {job.companyInitial}
                  </div>
                  <div>
                    <div className="text-[11.5px] font-semibold text-[#888888] leading-none mb-1">
                      {job.company}
                    </div>
                    <div className="text-[15px] font-bold text-[#111111] leading-tight">
                      {job.title}
                    </div>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveSavedJob(job.id)}
                  className="p-1.5 text-gray-300 hover:text-[#FF5C5C] rounded-lg transition-colors ml-2"
                  title="관심 목록에서 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div
                onClick={() => onOpenReport(job)}
                className="cursor-pointer"
              >
                <div className="flex items-center text-[12px] text-[#666666] mb-2.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#888888]" />
                  <span>{job.location}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-[#4A6CF7] font-bold">{job.matchScore}% 매칭</span>
                </div>

                <div className="bg-[#FAFAFC] rounded-[14px] p-2.5 text-[12.5px] text-[#555555] line-clamp-1 border border-gray-100 flex items-center justify-between font-medium">
                  <span>{job.arrivalReason}</span>
                  <ChevronRight className="w-4 h-4 text-[#888888] flex-shrink-0 ml-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

