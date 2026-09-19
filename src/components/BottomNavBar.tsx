import React from 'react';
import { Home, BookHeart, Compass, User } from 'lucide-react';
import { NavTab } from '../types';
import { HomeIndicator } from './HomeIndicator';

interface BottomNavBarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'our-story', label: 'Our Story', icon: BookHeart },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'you', label: 'You', icon: User },
  ];

  return (
    <nav
      id="main-bottom-navigation"
      aria-label="Main application navigation"
      className="w-full bg-[#FAF9F7]/95 backdrop-blur-md border-t border-[#E5E7EB] flex flex-col items-center shrink-0 z-30 select-none"
    >
      <div className="w-full h-[58px] px-6 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              id={`nav-tab-${tab.id}`}
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
                isActive ? 'text-[#7C6EE6]' : 'text-[#9CA3AF] hover:text-[#4B5563]'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.4 : 1.8}
                  className="transition-transform duration-150"
                />
                {isActive && (
                  <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#7C6EE6]" />
                )}
              </div>
              <span
                className={`text-[11px] font-sans transition-colors ${
                  isActive ? 'font-semibold text-[#7C6EE6]' : 'font-medium text-[#6B7280]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <HomeIndicator color="#D1D5DB" />
    </nav>
  );
};
