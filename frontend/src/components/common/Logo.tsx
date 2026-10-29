import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lightText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  lightText = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* University-style briefcase + graduation cap emblem */}
      <div
        className={`${iconSizes[size]} bg-white border border-[#D4DCE6] rounded-sm p-1 flex items-center justify-center shadow-sm shrink-0`}
      >
        <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
          {/* Briefcase Base */}
          <rect
            x="6"
            y="14"
            width="24"
            height="16"
            rx="2"
            fill="#EAF2FC"
            stroke="#356F9D"
            strokeWidth="1.8"
          />
          {/* Briefcase Handle */}
          <path
            d="M13 14V11C13 10.4 13.4 10 14 10H22C22.6 10 23 10.4 23 11V14"
            stroke="#356F9D"
            strokeWidth="1.8"
          />
          {/* Graduation Cap Diamond Roof */}
          <polygon
            points="18,4 31,10 18,16 5,10"
            fill="#356F9D"
            stroke="#28587E"
            strokeWidth="1.2"
          />
          <polygon
            points="18,15 9,11 9,12.5 18,16.5 27,12.5 27,11"
            fill="#4779B8"
          />
          {/* Center Lock Dot */}
          <circle cx="18" cy="22" r="1.8" fill="#356F9D" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className={`font-bold tracking-tight ${titleSizes[size]} ${
              lightText ? 'text-white' : 'text-[#356F9D]'
            }`}
          >
            INTERN DESK
          </span>
          <span
            className={`text-[11px] font-normal tracking-normal ${
              lightText ? 'text-[#EAF2FC]' : 'text-[#666666]'
            }`}
          >
            Internship Management System
          </span>
        </div>
      )}
    </Link>
  );
};
