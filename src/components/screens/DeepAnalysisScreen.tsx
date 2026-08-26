import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, BarChart2, Folder, Plus, ArrowLeft, Sparkles, Check } from 'lucide-react';
import { UserActivity, UserProfile } from '../../types';
import { Mascot } from '../Mascot';

interface DeepAnalysisScreenProps {
  user: UserProfile;
  onBack: () => void;
  onAddActivity: (activity: UserActivity) => void;
  onRunAiAnalysis: (newActivityDesc: string) => Promise<void>;
}

export const DeepAnalysisScreen: React.FC<DeepAnalysisScreenProps> = ({
  user,
  onBack,
  onAddActivity,
  onRunAiAnalysis,
}) => {
  const [selectedType, setSelectedType] = useState<'blog' | 'instagram' | 'portfolio' | 'project'>('blog');
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleAdd = async () => {
    if (!titleInput.trim()) return;

    setIsAnalyzing(true);
    const newAct: UserActivity = {
      id: `act_${Date.now()}`,
      title: titleInput.trim(),
      category: selectedType,
      countOrDesc: descInput.trim() || '추가된 활동',
      iconName: selectedType === 'blog' ? 'FileText' : selectedType === 'instagram' ? 'BarChart2' : 'Folder',
    };

    onAddActivity(newAct);
    await onRunAiAnalysis(titleInput);
    setIsAnalyzing(false);
    setTitleInput('');
    setDescInput('');
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 2500);
  };

  const quickPresets = [
    { type: 'blog' as const, label: '브런치/블로그 글 10편 추가', count: '10편 발행' },
    { type: 'instagram' as const, label: '인스타그램 릴스/기획 15건', count: '15건 기획' },
    { type: 'portfolio' as const, label: '노션 프로젝트 포트폴리오 링크', count: '노션 문서' },
    { type: 'project' as const, label: '사이드 프로젝트 UI 프로토타입', count: 'Figma 작업' },
  ];

  return (
    <div id="screen-deep-analysis" className="flex flex-col min-h-full pb-20 px-5 pt-1 select-none relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3 py-1">
        <button
          onClick={onBack}
          className="w-9 h-9 -ml-1 rounded-full flex items-center justify-center text-[#111111] hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-[16px] font-bold text-[#111111] tracking-tight">자료 기반 정밀 분석</div>
        <div className="w-9" />
      </div>

      {/* Mascot Header */}
      <div className="flex items-center space-x-3 bg-white p-4 rounded-[22px] border border-gray-100 shadow-xs mb-5">
        <Mascot pose="analyzing" size="sm" className="flex-shrink-0" />
        <div className="text-[13px] text-[#444444] leading-snug font-medium">
          기록을 더 자세히 추가할수록, 우편배달부가 더 꼭 맞는 채용공고를 배달해 드려요.
        </div>
      </div>

      {/* My Current Activities List */}
      <div className="mb-5">
        <div className="text-[14.5px] font-bold text-[#111111] mb-2.5">등록된 나의 활동 기록</div>
        <div className="space-y-2">
          {user.activities.map((act) => (
            <div
              key={act.id}
              className="bg-white rounded-[18px] p-3.5 px-4 shadow-xs border border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 text-[13.5px] text-[#111111]">
                <div className="w-7 h-7 rounded-[10px] bg-[#E8EEFF] text-[#4A6CF7] flex items-center justify-center flex-shrink-0">
                  {act.category === 'blog' && <FileText className="w-3.5 h-3.5" />}
                  {act.category === 'instagram' && <BarChart2 className="w-3.5 h-3.5" />}
                  {act.category === 'portfolio' && <Folder className="w-3.5 h-3.5" />}
                  {act.category === 'project' && <Sparkles className="w-3.5 h-3.5" />}
                </div>
                <span className="font-semibold">{act.title}</span>
              </div>
              <span className="text-[11.5px] text-[#888888] font-medium">{act.countOrDesc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Activity Section */}
      <div className="bg-white rounded-[22px] p-5 shadow-xs border border-gray-100 mb-5">
        <div className="text-[15px] font-bold text-[#111111] mb-3">새 활동 또는 자료 추가</div>

        {/* Type Selector */}
        <div className="grid grid-cols-4 gap-1.5 mb-3">
          {[
            { id: 'blog' as const, label: '블로그/글' },
            { id: 'instagram' as const, label: 'SNS/채널' },
            { id: 'portfolio' as const, label: '포트폴리오' },
            { id: 'project' as const, label: '기획/기타' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`py-2 text-[12px] font-bold rounded-[12px] transition-all cursor-pointer ${
                selectedType === t.id
                  ? 'bg-[#4A6CF7] text-white shadow-xs'
                  : 'bg-[#FAFAFC] text-[#666666] hover:bg-gray-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="예: 미디엄 아티클 5편 작성, 브랜딩 포트폴리오 등"
          className="w-full h-11 px-3.5 rounded-[14px] bg-[#FAFAFC] border border-gray-200 text-sm text-[#111111] placeholder:text-[#888888] focus:outline-hidden focus:border-[#4A6CF7] mb-2.5 font-medium"
        />

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdd}
            disabled={!titleInput.trim() || isAnalyzing}
            className={`flex-1 h-11.5 rounded-[16px] font-bold text-[13.5px] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
              titleInput.trim() && !isAnalyzing
                ? 'bg-[#111111] text-white hover:bg-black'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#4A6CF7]" />
                <span>AI가 신호 추출 중...</span>
              </span>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>활동 추가 및 신호 분석</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-3.5 pt-3 border-t border-gray-100">
          <div className="text-[11.5px] font-semibold text-[#888888] mb-2">간편 원클릭 등록 예시</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedType(preset.type);
                  setTitleInput(preset.label);
                  setDescInput(preset.count);
                }}
                className="px-2.5 py-1 bg-[#FAFAFC] hover:bg-[#E8EEFF] text-[#666666] hover:text-[#4A6CF7] rounded-[10px] text-[11.5px] border border-gray-200 font-medium transition-colors cursor-pointer"
              >
                + {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#EBF9F1] text-[#10B981] p-3.5 rounded-[18px] text-center text-[13px] font-bold flex items-center justify-center space-x-1.5 border border-[#D1F2E0]"
        >
          <Check className="w-4 h-4 text-[#10B981]" />
          <span>활동이 반영되고 맞춤 신호가 업데이트되었습니다!</span>
        </motion.div>
      )}
    </div>
  );
};

