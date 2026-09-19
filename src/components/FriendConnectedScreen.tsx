import React from 'react';
import { motion } from 'motion/react';
import { Contact } from '../types';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface FriendConnectedScreenProps {
  friend: Contact;
  onChooseExperience: () => void;
  onExploreFirst: () => void;
}

export const FriendConnectedScreen: React.FC<FriendConnectedScreenProps> = ({
  friend,
  onChooseExperience,
  onExploreFirst,
}) => {
  const friendFirstName = friend.name.split(' ')[0];

  return (
    <div
      id="friend-connected-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-6 flex items-center justify-center">
          <span className="text-[13px] font-sans font-medium text-[#7C6EE6] px-3 py-1 rounded-full bg-[#EDE9FE]">
            You + {friendFirstName}
          </span>
        </div>
      </div>

      {/* Visual Avatar Connection */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-8 text-center max-w-[340px]">
        <div className="relative mb-8 flex items-center justify-center">
          {/* Gentle background lavender pulse */}
          <div className="absolute w-52 h-52 rounded-full bg-[#EDE9FE]/70 blur-2xl -z-10" />

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center -space-x-4"
          >
            {/* User Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#EDE9FE] border-4 border-[#FAF9F7] shadow-md flex flex-col items-center justify-center z-10">
              <span className="font-serif font-bold text-[22px] text-[#55479E]">You</span>
              <span className="text-[10px] text-[#7C6EE6] font-medium">Komal</span>
            </div>

            {/* Friend Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#FEF3C7] border-4 border-[#FAF9F7] shadow-md flex flex-col items-center justify-center z-20">
              <span className="font-serif font-bold text-[22px] text-[#92400E]">
                {friend.initials}
              </span>
              <span className="text-[10px] text-[#D97706] font-medium">{friendFirstName}</span>
            </div>
          </motion.div>
        </div>

        {/* Headline & Copy */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col items-center gap-2.5"
        >
          <h1 className="font-serif font-semibold text-[32px] leading-[115%] text-[#18181B] tracking-tight">
            You’re all set.
          </h1>
          <p className="font-sans text-[15px] leading-[145%] text-[#6B7280] max-w-[280px]">
            You and {friendFirstName} are now connected.
          </p>
        </motion.div>
      </div>

      {/* CTA Buttons (strictly matching prompt: primary Choose your first experience, secondary Explore first, no additional options) */}
      <div className="w-full flex flex-col items-center px-6 pb-3 gap-3 shrink-0">
        <button
          id="choose-first-experience-btn"
          type="button"
          onClick={onChooseExperience}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          Choose your first experience
        </button>

        <button
          id="explore-first-btn"
          type="button"
          onClick={onExploreFirst}
          className="w-full py-2 text-center text-[14px] font-sans font-medium text-[#6B7280] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          Explore first
        </button>

        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
