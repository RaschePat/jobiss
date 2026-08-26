import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, User, Shield, Check } from 'lucide-react';
import { UserProfile, NotificationItem } from '../../types';
import { Mascot } from '../Mascot';

interface ProfileSettingsModalProps {
  user: UserProfile;
  notifications: NotificationItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: Partial<UserProfile>) => void;
  onClearActivities: () => void;
}

export const ProfileSettingsModal: React.FC<ProfileSettingsModalProps> = ({
  user,
  notifications,
  isOpen,
  onClose,
  onUpdateUser,
  onClearActivities,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'data'>('profile');
  const [userName, setUserName] = useState(user.name);
  const [deliveryFreq, setDeliveryFreq] = useState(user.deliveryFrequency);
  const [isSavedToast, setIsSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = () => {
    onUpdateUser({
      name: userName,
      deliveryFrequency: deliveryFreq,
    });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white w-full max-w-[370px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
      >
        {/* Modal Header */}
        <div className="p-4 px-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-[#4A6CF7]" />
            <h2 className="text-[16.5px] font-bold text-[#111111]">내 계정 & 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#888888] hover:text-[#111111] hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="grid grid-cols-3 border-b border-gray-100 bg-[#FAFAFC] p-1.5 gap-1 text-[13px] font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 rounded-[12px] transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-[#4A6CF7] shadow-xs' : 'text-[#666666]'
            }`}
          >
            프로필
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 rounded-[12px] transition-all relative cursor-pointer ${
              activeTab === 'notifications' ? 'bg-white text-[#4A6CF7] shadow-xs' : 'text-[#666666]'
            }`}
          >
            알림
            {notifications.some((n) => !n.read) && (
              <span className="w-1.5 h-1.5 bg-[#4A6CF7] rounded-full absolute top-2 right-4" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`py-2 rounded-[12px] transition-all cursor-pointer ${
              activeTab === 'data' ? 'bg-white text-[#4A6CF7] shadow-xs' : 'text-[#666666]'
            }`}
          >
            데이터 관리
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 bg-[#FAFAFC] p-3.5 rounded-[18px] border border-gray-100">
                <Mascot pose="greeting" size="sm" />
                <div>
                  <div className="text-[14px] font-bold text-[#111111]">{user.name} 님</div>
                  <div className="text-[12px] text-[#666666] font-medium">AI 커리어 우편 서비스 이용 중</div>
                </div>
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#111111] mb-1.5">사용자 이름</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#FAFAFC] rounded-[14px] border border-gray-200 text-sm font-semibold text-[#111111] focus:outline-hidden focus:border-[#4A6CF7]"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-bold text-[#111111] mb-1.5">
                  우편배달부 배송 주기
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                  {(['immediate', 'daily', 'weekly'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setDeliveryFreq(freq)}
                      className={`py-2.5 rounded-[12px] border transition-all cursor-pointer ${
                        deliveryFreq === freq
                          ? 'bg-[#E8EEFF] border-[#4A6CF7] text-[#4A6CF7] font-bold shadow-xs'
                          : 'bg-white border-gray-200 text-[#666666]'
                      }`}
                    >
                      {freq === 'immediate' ? '실시간' : freq === 'daily' ? '매일 1회' : '주간 요약'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProfile}
                className="w-full h-11 bg-[#111111] text-white rounded-[16px] text-sm font-bold flex items-center justify-center space-x-1 hover:bg-black transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>설정 저장하기</span>
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-2.5">
              <div className="text-[13px] font-bold text-[#111111] mb-1">최근 도착한 알림</div>
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 rounded-[18px] border text-left ${
                    notif.read ? 'bg-[#FAFAFC] border-gray-100' : 'bg-[#F4F7FF] border-[#D5E0FF]'
                  }`}
                >
                  <div className="text-[13px] font-bold text-[#111111] mb-0.5">{notif.title}</div>
                  <div className="text-[12px] text-[#555555] leading-snug font-medium">{notif.message}</div>
                  <div className="text-[11px] text-[#888888] mt-1 font-medium">{notif.timestamp}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-[#FEF6E6] border border-[#FDE68A] p-3.5 rounded-[18px] text-[12.5px] text-[#B45309] leading-relaxed font-medium">
                <Shield className="w-4 h-4 inline mr-1.5 text-[#F59E0B]" />
                사용자의 활동 기록과 관심 신호는 안전하게 보호되며, 오직 더 정확한 직무 매칭을 위해서만 활용됩니다.
              </div>

              <div className="p-3.5 bg-[#FAFAFC] border border-gray-100 rounded-[16px] flex items-center justify-between text-sm">
                <div>
                  <div className="font-bold text-[#111111]">등록된 활동</div>
                  <div className="text-xs text-[#666666] font-medium">총 {user.activities.length}개 기록 보관 중</div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('모든 활동 데이터를 초기화하시겠습니까?')) {
                      onClearActivities();
                    }
                  }}
                  className="px-3 py-1.5 bg-white border border-[#FFD5D5] text-[#FF5C5C] rounded-[10px] text-xs font-bold hover:bg-[#FFF0F0] cursor-pointer"
                >
                  초기화
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Toast */}
        {isSavedToast && (
          <div className="p-2.5 bg-[#EBF9F1] text-[#10B981] text-center text-xs font-bold border-t border-[#D1F2E0]">
            설정이 성공적으로 저장되었습니다!
          </div>
        )}
      </motion.div>
    </div>
  );
};

