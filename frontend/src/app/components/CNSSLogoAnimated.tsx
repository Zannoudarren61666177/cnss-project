import React from 'react';

interface Props {
  size?: number;
}

export function CNSSLogoAnimated({ size = 64 }: Props) {
  const s = size;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="g1" x1="0" x2="1">
          <stop offset="0%" stopColor="#7DD3FC" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>
      </defs>

      <g>
        {/* outer rotating ring */}
        <g>
          <circle cx="32" cy="32" r="26" stroke="url(#g1)" strokeWidth="4" strokeOpacity="0.18" />
          <path
            d="M32 6 A26 26 0 0 1 58 32"
            stroke="url(#g1)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          >
            <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="1.6s" repeatCount="indefinite" />
          </path>
        </g>

        {/* inner emblem - simple stylized tree + hands */}
        <g transform="translate(16,14)">
          <g transform="translate(0,0)">
            <path d="M16 6 C14 4, 12 4, 12 6 C12 8, 14 8, 16 6 Z" fill="#0369A1" opacity="0.9">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.2s" repeatCount="indefinite" />
            </path>
            <circle cx="16" cy="20" r="8" fill="#0369A1" opacity="0.95">
              <animateTransform attributeName="transform" type="scale" values="0.96;1.03;0.96" dur="1.2s" repeatCount="indefinite" />
            </circle>

            {/* hands / base */}
            <path d="M6 36 C10 30, 22 30, 26 36" stroke="#0369A1" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M38 36 C42 30, 54 30, 58 36" stroke="#0369A1" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </g>
      </g>
    </svg>
  );
}
