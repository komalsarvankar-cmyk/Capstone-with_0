import React from 'react';
import { motion } from 'motion/react';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onHaveAccount: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onHaveAccount,
}) => {
  return (
    <div
      id="welcome-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Frame */}
      <div className="w-full flex flex-col items-center shrink-0">
        <StatusBar />
        {/* Brand Header */}
        <div className="w-full px-7 pt-4 flex items-center justify-between">
          <span className="font-serif italic font-bold text-[28px] tracking-tight text-[#18181B]">
            With<span className="text-[#7C6EE6]">.</span>
          </span>
          <span className="text-[12px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#6D5EC9]">
            for friends
          </span>
        </div>
      </div>

      {/* Visual Center Graphic - Calm Warm Togetherness */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-8 relative">
        <div className="relative w-[240px] h-[200px] flex items-center justify-center">
          {/* Subtle ambient blur */}
          <div className="absolute w-44 h-44 rounded-full bg-[#EDE9FE]/70 blur-2xl -top-4 -left-4 pointer-events-none" />
          <div className="absolute w-40 h-40 rounded-full bg-[#FEF3C7]/60 blur-2xl -bottom-4 -right-4 pointer-events-none" />

          {/* Connected organic circles representing two friends sharing life */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex items-center"
          >
            {/* Friend 1 Circle (Lavender) */}
            <div className="w-28 h-28 rounded-full bg-[#EDE9FE] border-2 border-[#DDD6FE] flex flex-col items-center justify-center shadow-xs">
              <span className="font-serif italic text-[16px] text-[#55479E]">You</span>
              <span className="text-[10px] text-[#7C6EE6] font-medium mt-0.5">here</span>
            </div>

            {/* Connecting gentle thread */}
            <div className="w-10 h-0.5 border-t-2 border-dashed border-[#7C6EE6] mx-[-6px] z-10" />

            {/* Friend 2 Circle (Soft Ochre/Warm) */}
            <div className="w-28 h-28 rounded-full bg-[#FEF3C7] border-2 border-[#FDE68A] flex flex-col items-center justify-center shadow-xs">
              <span className="font-serif italic text-[16px] text-[#92400E]">Riya</span>
              <span className="text-[10px] text-[#D97706] font-medium mt-0.5">with you</span>
            </div>
          </motion.div>
        </div>

        {/* Text Container */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full flex flex-col items-center text-center mt-2 max-w-[320px]"
        >
          <h1 className="font-serif font-semibold text-[30px] leading-[118%] text-[#18181B] tracking-tight mb-3">
            Do more of life with the people who matter.
          </h1>
          <p className="font-sans text-[14px] leading-[150%] text-[#6B7280]">
            Whether you’re away from each other, can’t meet often, or simply want some company for what you’re doing, With helps you do more together.
          </p>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex flex-col items-center px-7 pb-3 gap-3 shrink-0">
        <button
          id="welcome-get-started-btn"
          type="button"
          onClick={onGetStarted}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          Get started
        </button>

        <button
          id="welcome-have-account-btn"
          type="button"
          onClick={onHaveAccount}
          className="py-2 px-4 text-[14px] font-sans font-medium text-[#6B7280] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          I already have an account
        </button>

        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
