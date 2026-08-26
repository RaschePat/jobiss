import React from 'react';
import { motion } from 'motion/react';
import { User, Search, Mail, Heart, Bell } from 'lucide-react';
import { TabType, NotificationItem } from '../types';

interface MobileFrameProps {
  children: React.ReactNode;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenProfile: () => void;
  notifications: NotificationItem[];
  arrivedUnreadCount: number;
  savedCount: number;
  hideHeaderAndTabs?: boolean;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  onOpenProfile,
  notifications,
  arrivedUnreadCount,
  savedCount,
  hideHeaderAndTabs = false,
}) => {
  const hasUnreadNotif = notifications.some((n) => !n.read);

  const tabs: { id: TabType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'career', label: '내 커리어', icon: User },
    { id: 'explore', label: '탐색', icon: Search },
    { id: 'inbox', label: '도착', icon: Mail },
    { id: 'saved', label: '관심', icon: Heart },
  ];

  return (
    <div className="relative w-[390px] h-[844px] bg-[#FFFFFF] rounded-[48px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border-[8px] border-[#1A1A1A] overflow-hidden flex flex-col select-none ring-1 ring-black/10">
      {/* Top Status Bar */}
      <div className="h-11 pt-3 px-7 flex items-center justify-between text-[12px] font-bold text-[#111111] bg-transparent flex-shrink-0 z-40">
        <span className="tracking-tight">9:41</span>
        {/* Dynamic Island / Pill notch */}
        <div className="w-24 h-5 bg-[#1A1A1A] rounded-full mx-auto" />
        <div className="flex items-center space-x-1.5">
          <svg className="w-4 h-3.5 fill-current" viewBox="0 0 16 12">
            <path d="M0 9.5C0 9.22386 0.223858 9 0.5 9H2.5C2.77614 9 3 9.22386 3 9.5V11.5C3 11.7761 2.77614 12 2.5 12H0.5C0.223858 12 0 11.7761 0 11.5V9.5Z" />
            <path d="M4.33334 7C4.33334 6.72386 4.5572 6.5 4.83334 6.5H6.83334C7.10948 6.5 7.33334 6.72386 7.33334 7V11.5C7.33334 11.7761 7.10948 12 6.83334 12H4.83334C4.5572 12 4.33334 11.7761 4.33334 11.5V7Z" />
            <path d="M8.66667 4.5C8.66667 4.22386 8.89053 4 9.16667 4H11.1667C11.4428 4 11.6667 4.22386 11.6667 4.5V11.5C11.6667 11.7761 11.4428 12 11.1667 12H9.16667C8.89053 12 8.66667 11.7761 8.66667 11.5V4.5Z" />
            <path d="M13 1.5C13 1.22386 13.2239 1 13.5 1H15.5C15.7761 1 16 1.22386 16 1.5V11.5C16 11.7761 15.7761 12 15.5 12H13.5C13.2239 12 13 11.7761 13 11.5V1.5Z" />
          </svg>
          <div className="w-5 h-2.5 rounded-[4px] border border-[#111111] p-0.5 flex items-center">
            <div className="w-full h-full bg-[#111111] rounded-[2px]" />
          </div>
        </div>
      </div>

      {/* Top App Bar Header (Only when not in full modal flow) */}
      {!hideHeaderAndTabs && (
        <div className="h-12 px-5 flex items-center justify-between bg-transparent flex-shrink-0 z-30">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#E8EEFF] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-[2px] bg-[#4A6CF7]" />
            </div>
            <span className="text-[20px] font-bold text-[#111111] tracking-tight font-sans">
              잡있으
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenProfile}
              id="btn-top-profile"
              className="relative w-9 h-9 rounded-full bg-[#F8F9FA] border border-gray-100 flex items-center justify-center text-[#666666] hover:text-[#111111] hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-4.5 h-4.5" />
              {hasUnreadNotif && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#4A6CF7] rounded-full ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Screen Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col bg-[#FAFAFC]">
        {children}
      </div>

      {/* Bottom 4-Tab Navigation Bar */}
      {!hideHeaderAndTabs && (
        <div
          id="bottom-tab-bar"
          className="h-16 px-4 bg-white border-t border-gray-100 flex items-center justify-around flex-shrink-0 z-40"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                id={`tab-btn-${tab.id}`}
                className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all cursor-pointer ${
                  isActive ? 'opacity-100' : 'opacity-40 hover:opacity-75'
                }`}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-5 h-5 rounded-sm flex items-center justify-center transition-colors ${
                      isActive ? 'text-[#4A6CF7]' : 'text-[#666666]'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  {/* Badges */}
                  {tab.id === 'inbox' && arrivedUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-2.5 px-1.5 min-w-[15px] h-3.5 bg-[#4A6CF7] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {arrivedUnreadCount}
                    </span>
                  )}
                  {tab.id === 'saved' && savedCount > 0 && (
                    <span className="absolute -top-1 -right-2.5 px-1.5 min-w-[15px] h-3.5 bg-[#FF5C5C] text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {savedCount}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] mt-1 tracking-tight whitespace-nowrap transition-colors ${
                    isActive ? 'text-[#4A6CF7] font-bold' : 'text-[#666666] font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Home Indicator Bar */}
      <div className="h-4 bg-white flex items-center justify-center pb-1 flex-shrink-0">
        <div className="w-32 h-1 bg-[#1A1A1A]/30 rounded-full" />
      </div>
    </div>
  );
};

