import React from 'react';

interface StatusBarProps {
  currentTime?: string;
  dark?: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  currentTime = '9:41',
  dark = false,
}) => {
  const textColor = dark ? 'text-white' : 'text-[#111827]';
  const fill = dark ? '#FFFFFF' : '#111827';

  return (
    <div className={`w-full h-[44px] px-6 flex items-center justify-between select-none ${textColor} shrink-0`}>
      <span className="text-[14px] font-semibold tracking-tight font-sans">
        {currentTime}
      </span>
      <div className="flex items-center gap-[6px]">
        {/* iOS Cellular Signal */}
        <svg
          width="18"
          height="12"
          viewBox="0 0 18 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0.5" y="9" width="2.5" height="3" rx="0.5" fill={fill} />
          <rect x="4.5" y="6.5" width="2.5" height="5.5" rx="0.5" fill={fill} />
          <rect x="8.5" y="4" width="2.5" height="8" rx="0.5" fill={fill} />
          <rect x="12.5" y="1" width="2.5" height="11" rx="0.5" fill={fill} />
        </svg>

        {/* iOS Wifi Signal */}
        <svg
          width="16"
          height="12"
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 11.5C8.82843 11.5 9.5 10.8284 9.5 10C9.5 9.17157 8.82843 8.5 8 8.5C7.17157 8.5 6.5 9.17157 6.5 10C6.5 10.8284 7.17157 11.5 8 11.5Z"
            fill={fill}
          />
          <path
            d="M4.6 6.6C5.5 5.7 6.7 5.2 8 5.2C9.3 5.2 10.5 5.7 11.4 6.6L12.4 5.6C11.2 4.4 9.7 3.7 8 3.7C6.3 3.7 4.8 4.4 3.6 5.6L4.6 6.6Z"
            fill={fill}
          />
          <path
            d="M1.8 3.8C3.4 2.1 5.6 1.2 8 1.2C10.4 1.2 12.6 2.1 14.2 3.8L15.2 2.7C13.3 0.8 10.8 -0.2 8 -0.2C5.2 -0.2 2.7 0.8 0.8 2.7L1.8 3.8Z"
            fill={fill}
          />
        </svg>

        {/* iOS Battery Full */}
        <svg
          width="24"
          height="12"
          viewBox="0 0 24 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="0.75"
            y="0.75"
            width="19.5"
            height="10.5"
            rx="3"
            stroke={fill}
            strokeWidth="1.5"
          />
          <rect x="2.5" y="2.5" width="16" height="7" rx="1.5" fill={fill} />
          <path
            d="M21.5 4.5C22.2 4.8 22.7 5.3 22.7 6C22.7 6.7 22.2 7.2 21.5 7.5V4.5Z"
            fill={fill}
          />
        </svg>
      </div>
    </div>
  );
};
