import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { Mascot } from '../Mascot';

interface OnboardingQuizScreenProps {
  onComplete: (selectedSignals: string[], userText: string) => void;
  onCancel?: () => void;
}

export const OnboardingQuizScreen: React.FC<OnboardingQuizScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['글쓰기·콘텐츠', '마케팅']);
  const [workStyle, setWorkStyle] = useState<string>('자유로운 기획과 표현');
  const [activitiesInput, setActivitiesInput] = useState<string>('개인 블로그에 글을 정기적으로 쓰고 있고 인스타그램 카드뉴스도 만들어봤어요.');

  const interestOptions = [
    '글쓰기·콘텐츠',
    '마케팅',
    '디자인',
    '기획',
    '데이터 분석',
    '브랜딩',
    '커뮤니티 운영',
    '영상·미디어',
    '개발·IT',
    '고객 경험(CX)',
  ];

  const workStyleOptions = [
    { title: '자유로운 기획과 표현', desc: '새로운 아이디어를 구상하고 콘텐츠나 글로 표현하는 일' },
    { title: '체계적인 문제 해결', desc: '데이터와 프로세스를 분석하고 최적의 해결책을 설계하는 일' },
    { title: '시각적 완성도와 UX', desc: '사람들이 직관적이고 아름답게 느낄 수 있도록 만드는 일' },
    { title: '사람과의 소통과 확산', desc: '커뮤니티와 고객을 연결하고 메시지를 널리 알리는 일' },
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(selectedInterests, activitiesInput);
    }
  };

  return (
    <div id="screen-onboarding-quiz" className="flex flex-col min-h-full pb-20 px-5 pt-3 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#111111] hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <span className="text-[12px] font-bold text-[#4A6CF7] tracking-wider">
            간편 탐색
          </span>
        )}

        <div className="flex space-x-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all ${
                s === step ? 'w-6 bg-[#4A6CF7]' : s < step ? 'w-3 bg-[#B4C6FF]' : 'w-3 bg-gray-200'
              }`}
            />
          ))}
        </div>

        {onCancel ? (
          <button onClick={onCancel} className="text-[13px] text-[#888888] hover:text-[#111111] font-semibold">
            건너뛰기
          </button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Mascot Guidance Header */}
      <div className="flex items-center space-x-3 bg-white p-4 rounded-[22px] border border-gray-100 shadow-xs mb-5">
        <Mascot pose="holding_quiz" size="sm" className="flex-shrink-0" />
        <div className="text-[13px] text-[#444444] leading-snug font-medium">
          {step === 1 && '정확한 직무명이 아니어도 괜찮아요. 마음이 가는 관심사를 골라주세요!'}
          {step === 2 && '어떤 업무 방식에서 가장 몰입되고 즐거운지 알려주세요.'}
          {step === 3 && '직접 해본 작은 경험이나 기록이 있다면 가볍게 적어주세요.'}
        </div>
      </div>

      {/* Step Contents */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-[23px] font-bold text-[#111111] tracking-tight leading-snug mb-2">
              요즘 어떤 일이나 활동에
              <br />
              흥미가 가나요?
            </h2>
            <p className="text-[13px] text-[#666666] mb-5 font-medium">
              관련 있는 키워드를 여러 개 선택해 주세요.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {interestOptions.map((opt) => {
                const isSelected = selectedInterests.includes(opt);
                return (
                  <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleInterest(opt)}
                    className={`px-4 py-2.5 rounded-[16px] text-[13.5px] font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#4A6CF7] text-white shadow-xs'
                        : 'bg-white text-[#444444] border border-gray-100 hover:border-[#4A6CF7]/40'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 inline mr-1" />}
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-[23px] font-bold text-[#111111] tracking-tight leading-snug mb-2">
              선호하는 업무 스타일은
              <br />
              어떤 편인가요?
            </h2>
            <p className="text-[13px] text-[#666666] mb-4 font-medium">
              가장 나와 가깝다고 느껴지는 스타일을 골라보세요.
            </p>

            <div className="space-y-2.5 mb-6">
              {workStyleOptions.map((style) => {
                const isSelected = workStyle === style.title;
                return (
                  <motion.div
                    key={style.title}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setWorkStyle(style.title)}
                    className={`p-4 rounded-[20px] border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F4F7FF] border-[#4A6CF7] shadow-xs'
                        : 'bg-white border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="text-[14.5px] font-bold text-[#111111] mb-0.5">{style.title}</div>
                    <div className="text-[12.5px] text-[#666666] font-medium">{style.desc}</div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-[23px] font-bold text-[#111111] tracking-tight leading-snug mb-2">
              해본 경험이나 프로젝트를
              <br />
              자유롭게 들려주세요
            </h2>
            <p className="text-[13px] text-[#666666] mb-4 font-medium">
              블로그, SNS, 학교 과제, 아르바이트, 취미 등 사소한 경험도 훌륭한 신호가 돼요!
            </p>

            <div className="bg-white rounded-[22px] p-4 border border-gray-100 shadow-xs mb-4">
              <textarea
                value={activitiesInput}
                onChange={(e) => setActivitiesInput(e.target.value)}
                rows={4}
                placeholder="예: 6개월간 영화 리뷰 블로그를 운영했고, 동아리 홍보 포스터를 피그마로 만들었어요."
                className="w-full text-[14px] text-[#111111] placeholder:text-[#888888] focus:outline-hidden resize-none font-medium"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Action Button */}
      <div className="pt-3">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full h-13 bg-[#111111] text-white rounded-[18px] text-[15px] font-bold flex items-center justify-center space-x-2 shadow-lg hover:bg-black transition-all cursor-pointer"
        >
          <span>{step === 3 ? 'AI 직무 가설 만들기' : '다음으로'}</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

