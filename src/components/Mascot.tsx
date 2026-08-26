import React from 'react';
import { motion } from 'motion/react';

export type MascotPose = 
  | 'greeting' 
  | 'delivering' 
  | 'analyzing' 
  | 'encouraging' 
  | 'holding_quiz' 
  | 'curious';

interface MascotProps {
  pose?: MascotPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  speechBubble?: string;
  showHat?: boolean;
}

export const Mascot: React.FC<MascotProps> = ({
  pose = 'greeting',
  size = 'md',
  className = '',
  speechBubble,
  showHat = true
}) => {
  // Dimensions mapping
  const sizeDimensions = {
    sm: { width: 44, height: 44 },
    md: { width: 68, height: 68 },
    lg: { width: 92, height: 92 },
    xl: { width: 120, height: 120 },
  };

  const { width, height } = sizeDimensions[size];

  // Motion variants for floating, blinking, and gesture
  const floatTransition = {
    duration: 3,
    repeat: Infinity,
    repeatType: 'reverse' as const,
    ease: 'easeInOut' as const,
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble if provided */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-1.5 px-3 py-1.5 bg-white text-slate-800 text-xs font-medium rounded-2xl shadow-xs border border-slate-100 max-w-[200px] text-center relative"
        >
          {speechBubble}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-slate-100" />
        </motion.div>
      )}

      <motion.div
        animate={{
          y: pose === 'analyzing' ? [0, -3, 0] : [0, -5, 0],
          rotate: pose === 'curious' ? [0, 4, 0] : [0, 0, 0],
        }}
        transition={floatTransition}
        style={{ width, height }}
        className="relative flex items-center justify-center filter drop-shadow-xs"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F8FAFC" />
              <stop offset="1" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="wingGrad" x1="0" y1="0" x2="20" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#93C5FD" />
              <stop offset="1" stopColor="#60A5FA" />
            </linearGradient>
            <linearGradient id="capGrad" x1="10" y1="0" x2="70" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1E293B" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="beakGrad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" />
              <stop offset="1" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          {/* Soft Shadow */}
          <ellipse cx="50" cy="94" rx="28" ry="5" fill="#CBD5E1" opacity="0.45" />

          {/* Body - Soft round baby penguin/creature */}
          <ellipse cx="50" cy="56" rx="34" ry="32" fill="url(#bodyGrad)" />

          {/* Soft White Belly */}
          <ellipse cx="50" cy="62" rx="24" ry="22" fill="#FFFFFF" />

          {/* Cute soft blush cheeks */}
          <ellipse cx="32" cy="58" rx="5" ry="3" fill="#FDA4AF" opacity="0.65" />
          <ellipse cx="68" cy="58" rx="5" ry="3" fill="#FDA4AF" opacity="0.65" />

          {/* Eyes */}
          {pose === 'encouraging' ? (
            // Winking / smiling eyes (curved arcs)
            <>
              <path d="M29 48 Q34 43 39 48" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <circle cx="63" cy="47" r="3.5" fill="#1E293B" />
              <circle cx="64.5" cy="45.5" r="1.2" fill="#FFFFFF" />
            </>
          ) : pose === 'analyzing' ? (
            // Focused curious eyes
            <>
              <circle cx="36" cy="47" r="3.8" fill="#1E293B" />
              <circle cx="64" cy="47" r="3.8" fill="#1E293B" />
              <circle cx="37.5" cy="45.5" r="1.4" fill="#FFFFFF" />
              <circle cx="65.5" cy="45.5" r="1.4" fill="#FFFFFF" />
            </>
          ) : (
            // Sparkly happy eyes
            <>
              <circle cx="36" cy="48" r="3.8" fill="#1E293B" />
              <circle cx="64" cy="48" r="3.8" fill="#1E293B" />
              <circle cx="37.5" cy="46.5" r="1.5" fill="#FFFFFF" />
              <circle cx="65.5" cy="46.5" r="1.5" fill="#FFFFFF" />
            </>
          )}

          {/* Beak / Tiny nose */}
          <path
            d="M45 52 Q50 49 55 52 Q50 59 45 52 Z"
            fill="url(#beakGrad)"
          />

          {/* Tiny Feet */}
          <ellipse cx="40" cy="88" rx="6" ry="3.5" fill="#F59E0B" />
          <ellipse cx="60" cy="88" rx="6" ry="3.5" fill="#F59E0B" />

          {/* Wings according to pose */}
          {pose === 'delivering' ? (
            <>
              {/* Left wing holding envelope */}
              <path d="M20 54 Q14 62 26 70 Q30 62 25 54 Z" fill="url(#wingGrad)" />
              {/* Right wing waving */}
              <path d="M78 52 Q88 44 86 58 Q78 64 74 54 Z" fill="url(#wingGrad)" />

              {/* Little Letter Envelope with wax seal */}
              <g transform="translate(18, 58) rotate(-12) scale(0.6)">
                <rect width="36" height="24" rx="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
                <path d="M0 0 L18 13 L36 0" stroke="#CBD5E1" strokeWidth="1.5" fill="none" />
                <circle cx="18" cy="13" r="4.5" fill="#3B82F6" />
              </g>
            </>
          ) : pose === 'holding_quiz' ? (
            <>
              <path d="M18 56 Q12 66 24 70 Q28 62 22 56 Z" fill="url(#wingGrad)" />
              <path d="M78 56 Q86 64 74 72 Q72 64 76 56 Z" fill="url(#wingGrad)" />
              {/* Clipboard */}
              <g transform="translate(34, 56) scale(0.55)">
                <rect width="30" height="40" rx="3" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
                <rect x="8" y="-3" width="14" height="6" rx="2" fill="#78716C" />
                <line x1="6" y1="12" x2="24" y2="12" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="20" x2="20" y2="20" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
                <line x1="6" y1="28" x2="16" y2="28" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
              </g>
            </>
          ) : pose === 'analyzing' ? (
            <>
              {/* Left wing */}
              <path d="M18 54 Q12 64 24 68 Q28 60 22 54 Z" fill="url(#wingGrad)" />
              {/* Right wing holding small compass or magnifying glass */}
              <path d="M76 52 Q86 46 82 62 Q76 66 74 54 Z" fill="url(#wingGrad)" />
              <g transform="translate(68, 48) scale(0.5)">
                <circle cx="16" cy="16" r="12" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="2.5" />
                <line x1="25" y1="25" x2="35" y2="35" stroke="#1E40AF" strokeWidth="3.5" strokeLinecap="round" />
                <polygon points="16,8 19,16 16,14 13,16" fill="#EF4444" />
                <polygon points="16,24 19,16 16,18 13,16" fill="#3B82F6" />
              </g>
            </>
          ) : (
            // Default wings
            <>
              <path d="M20 54 Q14 64 26 68 Q28 60 24 54 Z" fill="url(#wingGrad)" />
              <path d="M80 54 Q86 64 74 68 Q72 60 76 54 Z" fill="url(#wingGrad)" />
            </>
          )}

          {/* Mail Carrier Crossbody Bag */}
          <path
            d="M32 46 Q50 64 68 76"
            stroke="#92400E"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <rect
            x="60"
            y="66"
            width="18"
            height="14"
            rx="3.5"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="1.2"
            transform="rotate(10 60 66)"
          />
          <circle cx="70" cy="74" r="2" fill="#FCD34D" />

          {/* Mail Carrier Hat (Postal Navy Cap with Gold Emblem) */}
          {showHat && (
            <g id="mail-carrier-cap">
              {/* Cap visor */}
              <path
                d="M24 30 Q50 20 76 30 Q50 33 24 30 Z"
                fill="#0F172A"
              />
              {/* Cap crown */}
              <path
                d="M27 29 Q28 14 50 14 Q72 14 73 29 Q50 24 27 29 Z"
                fill="url(#capGrad)"
              />
              {/* Gold decorative ribbon line */}
              <path
                d="M27 28 Q50 24 73 28"
                stroke="#F59E0B"
                strokeWidth="2"
                fill="none"
              />
              {/* Gold Anchor/Bird Badge */}
              <circle cx="50" cy="22" r="3.2" fill="#FBBF24" />
              <circle cx="50" cy="22" r="1.5" fill="#78350F" />
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
};
