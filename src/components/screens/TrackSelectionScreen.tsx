import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check } from 'lucide-react';
import { JobHypothesis, UserProfile } from '../../types';
import { Mascot } from '../Mascot';

interface TrackSelectionScreenProps {
  user: UserProfile;
  hypotheses: JobHypothesis[];
  onBack: () => void;
  onUpdateTracks: (selectedTracks: string[]) => void;
}

export const TrackSelectionScreen: React.FC<TrackSelectionScreenProps> = ({
  user,
  hypotheses,
  onBack,
  onUpdateTracks,
}) => {
  const [selectedTracks, setSelectedTracks] = useState<string[]>(user.selectedTracks || []);
  const [savedMessage, setSavedMessage] = useState(false);

  const toggleTrack = (trackName: string) => {
    if (selectedTracks.includes(trackName)) {
      setSelectedTracks(selectedTracks.filter((t) => t !== trackName));
    } else {
      setSelectedTracks([...selectedTracks, trackName]);
    }
  };

  const handleSave = () => {
    onUpdateTracks(selectedTracks);
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      onBack();
    }, 900);
  };

  return (
    <div id="screen-track-selection" className="flex flex-col min-h-full pb-20 px-5 pt-1 select-none">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3 py-1">
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#111111] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-[16px] font-bold text-[#111111] tracking-tight">직무 트랙 선택 & 가설 수정</div>
        <div className="w-9" />
      </div>

      <div className="flex items-center space-x-3 bg-white p-4 rounded-[22px] border border-gray-100 shadow-xs mb-5">
        <Mascot pose="holding_quiz" size="sm" className="flex-shrink-0" />
        <div className="text-[13px] text-[#444444] leading-snug font-medium">
          관심 있는 직무 트랙을 선택해 두시면, 해당 분야의 우편 공고를 우선적으로 배달해 드립니다.
        </div>
      </div>

      <div className="text-[14.5px] font-bold text-[#111111] mb-3">AI가 추천하는 직무 가설 트랙</div>

      <div className="space-y-3 mb-6">
        {hypotheses.map((hypo) => {
          const isSelected = selectedTracks.includes(hypo.trackName);
          return (
            <motion.div
              key={hypo.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleTrack(hypo.trackName)}
              className={`p-4.5 rounded-[22px] border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#F4F7FF] border-[#4A6CF7] shadow-xs'
                  : 'bg-white border-gray-100 shadow-xs hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-[#444444]">
                    {hypo.category}
                  </span>
                  <h3 className="text-[15.5px] font-bold text-[#111111]">{hypo.trackName}</h3>
                </div>

                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-[#4A6CF7] border-[#4A6CF7] text-white' : 'border-gray-300 bg-white'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                </div>
              </div>

              <p className="text-[13px] text-[#555555] leading-relaxed mb-2.5 font-medium">
                {hypo.rationale}
              </p>

              <div className="flex items-center justify-between text-[11.5px] text-[#888888] pt-2 border-t border-gray-100 font-medium">
                <span>추천 신뢰도 {hypo.confidenceScore}%</span>
                <span>매칭 공고 약 {hypo.matchedJobsCount}건</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="pt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="w-full h-13 bg-[#111111] text-white rounded-[18px] text-[15px] font-bold flex items-center justify-center shadow-lg hover:bg-black transition-colors cursor-pointer"
        >
          {savedMessage ? '저장 완료!' : '선택한 트랙 적용하기'}
        </motion.button>
      </div>
    </div>
  );
};

