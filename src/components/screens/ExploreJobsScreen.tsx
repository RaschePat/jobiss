import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, PenTool, Megaphone, Palette, Lightbulb, Database, X, Sparkles, MapPin } from 'lucide-react';
import { JobPosting, UserProfile } from '../../types';
import { Mascot } from '../Mascot';

interface ExploreJobsScreenProps {
  jobs: JobPosting[];
  user: UserProfile;
  onOpenReport: (job: JobPosting) => void;
}

export const ExploreJobsScreen: React.FC<ExploreJobsScreenProps> = ({
  jobs,
  user,
  onOpenReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: '콘텐츠', label: '콘텐츠', icon: PenTool },
    { id: '마케팅', label: '마케팅', icon: Megaphone },
    { id: '디자인', label: '디자인', icon: Palette },
    { id: '기획', label: '기획', icon: Lightbulb },
    { id: '데이터', label: '데이터', icon: Database },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.arrivalReason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      !selectedCategory || job.category === selectedCategory || job.tags.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="screen-explore-jobs" className="flex flex-col min-h-full pb-20 px-5 pt-3 select-none">
      {/* Page Title */}
      <h1 className="text-[25px] font-bold text-[#111111] tracking-tight mb-4">
        어떤 일을 찾아볼까요?
      </h1>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-[#888888] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          id="input-explore-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="직무, 회사, 키워드로 검색해 보세요"
          className="w-full h-13 pl-12 pr-10 bg-white rounded-[18px] text-[14.5px] text-[#111111] placeholder:text-[#888888] shadow-xs border border-gray-100 focus:outline-hidden focus:border-[#4A6CF7] transition-all font-medium"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#888888] hover:text-[#111111] rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Category Icons */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        {categories.slice(0, 4).map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
              id={`btn-cat-${cat.id}`}
              className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-[18px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white text-[#444444] border border-gray-100 shadow-xs hover:border-gray-200'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAFAFC] text-[#4A6CF7]'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[12.5px] font-semibold tracking-tight whitespace-nowrap">{cat.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mascot Guidance Banner: 딱 정해지지 않아도 괜찮아요 */}
      <div className="bg-[#E8EEFF] rounded-[22px] p-4.5 px-5 border border-[#D5E0FF] mb-5 relative overflow-hidden flex items-center justify-between">
        <div className="flex-1 pr-3">
          <div className="text-[15px] font-bold text-[#4A6CF7] mb-1 tracking-tight">
            딱 정해지지 않아도 괜찮아요
          </div>
          <div className="text-[13px] text-[#444444] leading-snug font-medium">
            직접 검색해도 좋아요.
            <br />
            원하는 키워드로 시작해 보세요!
          </div>
        </div>
        <div className="flex-shrink-0 -mr-1">
          <Mascot pose="encouraging" size="md" />
        </div>
      </div>

      {/* Recommended Job List */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <h2 className="text-[16px] font-bold text-[#111111] tracking-tight">
            {selectedCategory ? `${selectedCategory} 추천 공고` : '추천 공고'}
          </h2>
          <span className="text-[12px] text-[#888888] font-medium">
            총 {filteredJobs.length}건
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-[22px] p-8 text-center border border-gray-100 shadow-xs">
            <Mascot pose="analyzing" size="md" className="mb-2" />
            <div className="text-[15px] font-bold text-[#111111] mb-1">일치하는 공고가 없어요</div>
            <div className="text-[13px] text-[#666666]">다른 검색어나 카테고리를 선택해 보세요.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.id}
                whileTap={{ scale: 0.985 }}
                onClick={() => onOpenReport(job)}
                id={`explore-job-card-${job.id}`}
                className="bg-white rounded-[22px] p-4.5 shadow-xs border border-gray-100 cursor-pointer hover:border-[#4A6CF7]/30 transition-all"
              >
                <div className="flex items-start space-x-3.5 mb-3">
                  {/* Company Initial Badge */}
                  <div
                    className={`w-11 h-11 rounded-[14px] flex items-center justify-center font-bold text-xs ${job.companyLogoBg} shadow-xs flex-shrink-0`}
                  >
                    {job.companyInitial}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-medium text-[#888888] leading-none mb-1">
                      {job.company}
                    </div>
                    <div className="text-[15px] font-bold text-[#111111] tracking-tight leading-tight">
                      {job.title}
                    </div>
                    <div className="flex items-center text-[12px] text-[#666666] mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-[#888888] flex-shrink-0" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* 도착한 이유 Tag Card */}
                <div className="bg-[#F4F7FF] rounded-[14px] p-2.5 px-3 border border-[#E0E7FF] flex items-start space-x-2">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10.5px] font-bold bg-[#4A6CF7] text-white flex-shrink-0 mt-0.5">
                    도착한 이유
                  </span>
                  <p className="text-[12.5px] text-[#444444] font-medium leading-relaxed">
                    {job.arrivalReason}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

