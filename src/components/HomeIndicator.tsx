import React from 'react';

interface HomeIndicatorProps {
  color?: string;
}

export const HomeIndicator: React.FC<HomeIndicatorProps> = ({
  color = '#9CA3AF',
}) => {
  return (
    <div className="w-full flex justify-center items-center py-3 select-none shrink-0">
      <div
        className="w-[140px] h-[5px] rounded-full transition-colors"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};
