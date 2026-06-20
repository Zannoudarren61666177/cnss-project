import React from 'react';

export function ChatbotIcon({ className = '', size = 48 }: { className?: string; size?: number }) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ch-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#BAE6FD" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#0b1220" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Rounded square background with subtle shadow */}
      <g filter="url(#shadow)">
        <rect x="4" y="4" width="56" height="56" rx="12" fill="url(#ch-g)" />
      </g>

      {/* Inner speech bubble */}
      <path
        d="M18 26c0-5 4-9 9-9h10c5 0 9 4 9 9v6c0 2.2-1.8 4-4 4H34l-6 6v-6H27c-5 0-9-4-9-9z"
        fill="#FFFFFF"
        opacity="0.98"
      />

      {/* Three dots */}
      <circle cx="28" cy="28" r="2.5" fill="#0369A1" />
      <circle cx="34" cy="28" r="2.5" fill="#0369A1" />
      <circle cx="40" cy="28" r="2.5" fill="#0369A1" />

      {/* Subtle border */}
      <rect x="4.5" y="4.5" width="55" height="55" rx="11.5" stroke="#ffffff22" strokeWidth="1" />
    </svg>
  );
}

export default ChatbotIcon;
