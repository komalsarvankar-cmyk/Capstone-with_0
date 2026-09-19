import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Calendar, Bell, Sparkles } from 'lucide-react';
import { Plan } from '../types';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface PlanConfirmedScreenProps {
  plan: Plan;
  onDone: () => void;
  onTestNotification: () => void;
  onGoToCheckin: () => void;
}

export const PlanConfirmedScreen: React.FC<PlanConfirmedScreenProps> = ({
  plan,
  onDone,
  onTestNotification,
  onGoToCheckin,
}) => {
  const [calendarAdded, setCalendarAdded] = useState(false);

  const handleCalendar = () => {
    setCalendarAdded(true);
    setTimeout(() => setCalendarAdded(false), 2500);
  };

  return (
    <div
      id="plan-confirmed-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-6 flex items-center justify-center">
          <span className="text-[13px] font-sans font-medium text-[#7C6EE6] px-3 py-1 rounded-full bg-[#EDE9FE]">
            You + {plan.recipient}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-7 text-center max-w-[340px]">
        {/* Soft Animated Confirmation Ring */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-20 h-20 rounded-full bg-[#EDE9FE] border-2 border-[#DDD6FE] flex items-center justify-center mb-6 shadow-xs"
        >
          <div className="w-12 h-12 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center shadow-xs">
            <Check size={26} strokeWidth={2.6} />
          </div>
        </motion.div>

        {/* Headline */}
        <h1 className="font-serif font-semibold text-[32px] leading-[115%] text-[#18181B] tracking-tight mb-4">
          It’s a plan.
        </h1>

        {/* Card Details */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-5 mb-5 shadow-xs flex flex-col gap-2.5">
          <span className="font-serif font-bold text-[20px] text-[#18181B]">
            {plan.activityTitle}
          </span>
          <div className="flex items-center justify-center gap-2 text-[14px] text-[#4B5563] font-sans font-medium">
            <Calendar size={15} className="text-[#7C6EE6]" />
            {plan.displayDateTime}
          </div>
          <span className="text-[12px] text-[#6D5EC9] font-medium">
            You + {plan.recipient}
          </span>
        </div>

        {/* Supporting Copy */}
        <p className="font-sans text-[14px] text-[#6B7280] leading-[145%] max-w-[280px]">
          With will remind you before it’s time.
        </p>

        {/* Quick simulation helper for prototype reviewers */}
        <div className="mt-5 flex items-center gap-2">
          <button
            id="simulate-notification-btn"
            type="button"
            onClick={onTestNotification}
            className="text-[12px] text-[#7C6EE6] bg-[#EDE9FE] hover:bg-[#DDD6FE] px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Bell size={12} />
            Test 30-min reminder
          </button>
          <button
            id="jump-to-checkin-btn"
            type="button"
            onClick={onGoToCheckin}
            className="text-[12px] text-[#55479E] bg-[#EDE9FE] hover:bg-[#DDD6FE] px-3 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Sparkles size={12} />
            Check-in flow
          </button>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 gap-2.5 shrink-0">
        {/* Primary CTA */}
        <button
          id="plan-confirmed-done-btn"
          type="button"
          onClick={onDone}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          Done
        </button>

        {/* Secondary CTA: Add to calendar */}
        <button
          id="add-to-calendar-btn"
          type="button"
          onClick={handleCalendar}
          className="py-2 text-[14px] font-sans font-medium text-[#6B7280] hover:text-[#18181B] transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Calendar size={14} />
          {calendarAdded ? '✓ Added to calendar' : 'Add to calendar'}
        </button>

        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
