import React from 'react';

interface OwlLogoProps {
  className?: string;
  size?: number;
  showBackdrop?: boolean;
}

export const OwlLogo: React.FC<OwlLogoProps> = ({ 
  className = '', 
  size = 40,
  showBackdrop = true
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        <defs>
          {/* Outer circle gradient matching avatar */}
          <linearGradient id="wwBackdropGrad" x1="15%" y1="15%" x2="85%" y2="85%">
            <stop offset="0%" stopColor="#1e1456" />
            <stop offset="35%" stopColor="#1a256f" />
            <stop offset="70%" stopColor="#08647a" />
            <stop offset="100%" stopColor="#088ea2" />
          </linearGradient>

          {/* Owl Body gradient: periwinkle top to bright cyan bottom */}
          <linearGradient id="wwBodyGrad" x1="50%" y1="12%" x2="50%" y2="92%">
            <stop offset="0%" stopColor="#8da2fc" />
            <stop offset="28%" stopColor="#7a93f8" />
            <stop offset="65%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Left Wing Gradient */}
          <linearGradient id="wwLeftWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6f88ec" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Right Wing Gradient */}
          <linearGradient id="wwRightWingGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6f88ec" />
            <stop offset="60%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Golden Amber Beak & Feet */}
          <linearGradient id="wwGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>

          {/* Ear Horns Gradient */}
          <linearGradient id="wwEarLeftGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6b86ec" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="wwEarRightGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6b86ec" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Subtle drop shadow */}
          <filter id="wwSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 1. Outer Backdrop Circle (as in avatar) */}
        {showBackdrop && (
          <circle cx="60" cy="60" r="58" fill="url(#wwBackdropGrad)" />
        )}

        {/* 2. Ear Tufts / Horns */}
        {/* Left Ear Horn */}
        <path
          d="M38 31C38 31 35 17 41 16C47 15 46 29 46 31Z"
          fill="url(#wwEarLeftGrad)"
        />
        {/* Right Ear Horn */}
        <path
          d="M82 31C82 31 85 17 79 16C73 15 74 29 74 31Z"
          fill="url(#wwEarRightGrad)"
        />

        {/* 3. Left & Right Wings behind/around body */}
        {/* Left Wing */}
        <path
          d="M31 52C24 55 23 76 32 94C35 91 37 77 37 68C37 59 34 54 31 52Z"
          fill="url(#wwLeftWingGrad)"
        />
        {/* Right Wing */}
        <path
          d="M89 52C96 55 97 76 88 94C85 91 83 77 83 68C83 59 86 54 89 52Z"
          fill="url(#wwRightWingGrad)"
        />

        {/* 4. Owl Main Body Silhouette */}
        <path
          d="M60 20C40 20 30 36 30 58C30 80 43 98 60 98C77 98 90 80 90 58C90 36 80 20 60 20Z"
          fill="url(#wwBodyGrad)"
        />

        {/* 5. Face Mask (Cloud Ice White Oval) */}
        <ellipse cx="60" cy="49" rx="24" ry="19.5" fill="#f0f6fc" />

        {/* 6. Eyebrows */}
        {/* Left Eyebrow (Lavender) */}
        <path
          d="M44 41C47 38 52 39 53 41"
          stroke="#9aa8e4"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Right Eyebrow (Mint / Cyan) */}
        <path
          d="M67 41C68 39 73 38 76 41"
          stroke="#55b0bd"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* 7. Eyes: Midnight Orbits with Upward Growth Arrow Pupil Highlights */}
        {/* Left Eye */}
        <circle cx="51" cy="50" r="8.5" fill="#1b1538" />
        {/* Left Eye Upward Arrow Reflection */}
        <path
          d="M51 45.5L48.5 48.5H50V52.5H52V48.5H53.5L51 45.5Z"
          fill="#ffffff"
        />
        <circle cx="49" cy="52" r="0.75" fill="#ffffff" opacity="0.8" />

        {/* Right Eye */}
        <circle cx="69" cy="50" r="8.5" fill="#1b1538" />
        {/* Right Eye Upward Arrow Reflection */}
        <path
          d="M69 45.5L66.5 48.5H68V52.5H70V48.5H71.5L69 45.5Z"
          fill="#ffffff"
        />
        <circle cx="67" cy="52" r="0.75" fill="#ffffff" opacity="0.8" />

        {/* 8. Golden Teardrop Beak */}
        <path
          d="M60 54C57.8 54 56.5 58 58 62C59 64.5 61 64.5 62 62C63.5 58 62.2 54 60 54Z"
          fill="url(#wwGoldGrad)"
        />

        {/* 9. Belly Feathers / Scallop Droplets */}
        {/* Row 1 */}
        <path d="M47 67C47 70.5 45.5 74 44.5 75C43.5 74 42 70.5 42 67C42 64.5 44.5 64.5 47 67Z" fill="#a5f3fc" fillOpacity="0.45" />
        <path d="M54 68C54 72 52.5 75.5 51.5 76.5C50.5 75.5 49 72 49 68C49 65 51.5 65 54 68Z" fill="#a5f3fc" fillOpacity="0.45" />
        <path d="M68.5 68C68.5 72 70 75.5 71 76.5C72 75.5 73.5 72 73.5 68C73.5 65 71 65 68.5 68Z" fill="#a5f3fc" fillOpacity="0.45" />
        <path d="M75.5 67C75.5 70.5 77 74 78 75C79 74 80.5 70.5 80.5 67C80.5 64.5 78 64.5 75.5 67Z" fill="#a5f3fc" fillOpacity="0.45" />

        {/* Row 2 (Center belly) */}
        <path d="M51 77C51 81.5 49.5 85 48.5 86C47.5 85 46 81.5 46 77C46 73.5 48.5 73.5 51 77Z" fill="#a5f3fc" fillOpacity="0.45" />
        <path d="M58 78C58 83 56.5 87 55.5 88C54.5 87 53 83 53 78C53 74 55.5 74 58 78Z" fill="#a5f3fc" fillOpacity="0.45" />
        <path d="M65 78C65 83 66.5 87 67.5 88C68.5 87 70 83 70 78C70 74 67.5 74 65 78Z" fill="#a5f3fc" fillOpacity="0.45" />
        <path d="M72 77C72 81.5 73.5 85 74.5 86C75.5 85 77 81.5 77 77C77 73.5 74.5 73.5 72 77Z" fill="#a5f3fc" fillOpacity="0.45" />

        {/* 10. Cute Yellow Talons / Feet at bottom */}
        <path
          d="M51 98C51 102 53 103.5 55 103.5"
          stroke="url(#wwGoldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M69 98C69 102 67 103.5 65 103.5"
          stroke="url(#wwGoldGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

