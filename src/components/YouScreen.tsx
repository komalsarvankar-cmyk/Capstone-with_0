import React, { useState } from 'react';
import { User, Bell, Sliders, Shield, HelpCircle, Heart, RotateCcw, Check } from 'lucide-react';
import { Contact } from '../types';
import { StatusBar } from './StatusBar';

interface YouScreenProps {
  friend: Contact;
  onResetFlow: () => void;
  onOpenScreenSelector: () => void;
}

export const YouScreen: React.FC<YouScreenProps> = ({
  friend,
  onResetFlow,
  onOpenScreenSelector,
}) => {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [morningDigest, setMorningDigest] = useState(false);
  const [calendarSync, setCalendarSync] = useState(true);

  return (
    <div
      id="you-screen-tab"
      className="w-full h-full flex flex-col bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full px-6 pt-2 pb-3 flex flex-col gap-1">
          <h1 className="font-serif italic font-bold text-[26px] tracking-tight text-[#18181B]">
            You
          </h1>
          <p className="text-[13px] font-sans text-[#6B7280]">
            Preferences and gentle rhythms.
          </p>
        </div>
      </div>

      {/* Main Settings List */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar px-6 py-2 flex flex-col gap-4">
        {/* User & Friend Profile Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#E5E7EB] shadow-2xs flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EDE9FE] text-[#55479E] font-serif font-bold text-[18px] flex items-center justify-center">
              KS
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-[16px] text-[#18181B]">
                Komal Sarvankar
              </span>
              <span className="text-[12px] text-[#6B7280]">
                komalsarvankar@gmail.com
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#FAF9F7] border border-[#F3F4F6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#92400E] font-serif font-bold text-[12px] flex items-center justify-center">
                {friend.initials}
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#18181B]">
                  Friend: {friend.name}
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  Connected since Jan 2026
                </span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-[#7C6EE6] px-2 py-0.5 rounded-full bg-[#EDE9FE]">
              Active pair
            </span>
          </div>
        </div>

        {/* Notifications & Quiet Reminders */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
            Gentle Notifications
          </span>
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-[#18181B]">
                  30-minute activity reminder
                </span>
                <span className="text-[11.5px] text-[#6B7280]">
                  Gives you time to get ready without stress
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRemindersEnabled(!remindersEnabled)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                  remindersEnabled ? 'bg-[#7C6EE6] justify-end' : 'bg-[#D1D5DB] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
              <div className="flex flex-col">
                <span className="text-[13.5px] font-medium text-[#18181B]">
                  Calendar sync
                </span>
                <span className="text-[11.5px] text-[#6B7280]">
                  Add confirmed plans directly to device calendar
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCalendarSync(!calendarSync)}
                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 cursor-pointer ${
                  calendarSync ? 'bg-[#7C6EE6] justify-end' : 'bg-[#D1D5DB] justify-start'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Activity Preferences */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
            Activity Preferences
          </span>
          <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#6B7280]">Pace & energy:</span>
              <span className="font-medium text-[#18181B]">Relaxed / Low-pressure</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#6B7280]">Preferred setting:</span>
              <span className="font-medium text-[#18181B]">Outdoors & Parks</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#6B7280]">Favorite times:</span>
              <span className="font-medium text-[#18181B]">Weekend sunsets</span>
            </div>
          </div>
        </div>

        {/* Privacy & Principles */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-[#7C6EE6]" />
            <span className="text-[13px] font-semibold text-[#18181B]">
              Quiet & Private Design
            </span>
          </div>
          <p className="text-[12px] text-[#6B7280] leading-[145%]">
            With is just between you and your friends. No public algorithms, no likes, no view counts, and zero advertising.
          </p>
        </div>

        {/* Interactive Prototype Testing Tools */}
        <div className="p-4 rounded-2xl bg-[#EDE9FE]/40 border border-[#DDD6FE] flex flex-col gap-2.5">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6]">
            Interactive Prototype Controls
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onOpenScreenSelector}
              className="flex-1 py-2 px-3 rounded-xl bg-white border border-[#DDD6FE] text-[#55479E] text-[12px] font-semibold hover:bg-[#EDE9FE] transition-colors cursor-pointer text-center"
            >
              Jump to any screen
            </button>
            <button
              type="button"
              onClick={onResetFlow}
              className="py-2 px-3 rounded-xl bg-white border border-[#DDD6FE] text-[#6B7280] text-[12px] font-medium hover:text-[#18181B] transition-colors cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={12} /> Restart flow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
