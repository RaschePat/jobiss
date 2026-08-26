import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Compass } from 'lucide-react';
import { JobHypothesis, UserProfile } from '../../types';
import { Mascot } from '../Mascot';

interface HypothesisPreviewScreenProps {
  hypotheses: JobHypothesis[];
  user: UserProfile;
  onProceedToDeepAnalysis: () => void;
  onProceedToMainApp: () => void;
}

export const HypothesisPreviewScreen: React.FC<HypothesisPreviewScreenProps> = ({
  hypotheses,
  user,
  onProceedToDeepAnalysis,
  onProceedToMainApp,
}) => {
  return (
    <div id="screen-hypothesis-preview" className="flex flex-col min-h-full pb-20 px-5 pt-3 select-none">
      {/* Top Banner with Mascot */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-2">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-[11.5px] font-bold bg-[#E8EEFF] text-[#4A6CF7] border border-[#D5E0FF] mb-2">
            <Compass className="w-3.5 h-3.5 mr-1" />
            초기 탐색 결과
          </div>
          <h1 className="text-[25px] font-bold text-[#111111] tracking-tight leading-tight">
            {user.name}님에게 어울리는
            <br />
            <span className="text-[#4A6CF7]">임시 직무 후보</span>예요
          </h1>
        </div>
        <Mascot pose="analyzing" size="md" className="flex-shrink-0" />
      </div>

      <p className="text-[13px] text-[#444444] leading-relaxed mb-5 bg-white p-4 rounded-[20px] border border-gray-100 shadow-xs font-medium">
        AI가 분석한 초기 직무 가설입니다. 아직 정해지지 않았어도 괜찮아요! 공고를 확인하면서 가설은 계속 정교해집니다.
      </p>

      {/* Hypotheses Cards */}
      <div className="space-y-3.5 mb-6">
        {hypotheses.map((hypo, idx) => (
          <motion.div
            key={hypo.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[22px] p-5 shadow-xs border border-gray-100"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[11.5px] font-bold px-2.5 py-0.5 rounded-full bg-[#E8EEFF] text-[#4A6CF7]">
                  {hypo.category}
                </span>
                <h3 className="text-[16px] font-bold text-[#111111]">{hypo.trackName}</h3>
              </div>
              <span className="text-[13px] font-bold text-[#4A6CF7]">{hypo.confidenceScore}% 일치</span>
            </div>

            <p className="text-[13px] text-[#555555] leading-relaxed mb-3 font-medium">
              {hypo.rationale}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
              {hypo.keySignals.map((signal, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2.5 py-1 rounded-full text-[11.5px] bg-[#F0F2F5] text-[#555555] font-semibold"
                >
                  #{signal}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-2">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onProceedToDeepAnalysis}
          className="w-full h-13 bg-[#4A6CF7] text-white rounded-[18px] text-[14.5px] font-bold flex items-center justify-center space-x-2 shadow-xs hover:bg-[#3B5BE0] transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>자료 추가하고 정밀 분석하기</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onProceedToMainApp}
          className="w-full h-12 bg-white border border-gray-200 text-[#111111] rounded-[18px] text-[14px] font-bold flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <span>우편함으로 바로 시작하기</span>
        </motion.button>
      </div>
    </div>
  );
};

