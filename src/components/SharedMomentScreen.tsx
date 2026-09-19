import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Heart, BookHeart } from 'lucide-react';
import { EmotionalState, SharedMemory } from '../types';
import { EMOTIONAL_CONFIGS } from '../data';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface SharedMomentScreenProps {
  memory: SharedMemory;
  onSaveToStory: () => void;
}

export const SharedMomentScreen: React.FC<SharedMomentScreenProps> = ({
  memory,
  onSaveToStory,
}) => {
  const userConf = EMOTIONAL_CONFIGS[memory.userEmotion] || EMOTIONAL_CONFIGS.calming;
  const friendConf = EMOTIONAL_CONFIGS[memory.friendEmotion] || EMOTIONAL_CONFIGS.fun;

  return (
    <div
      id="shared-moment-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-6 flex items-center justify-center">
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-3 py-1 rounded-full bg-[#EDE9FE]">
            Shared Memory
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-6 max-w-[345px] text-center">
        {/* Headline */}
        <h1 className="font-serif italic font-semibold text-[32px] leading-[115%] text-[#18181B] tracking-tight mb-4">
          A little moment, shared.
        </h1>

        {/* Polaroid-like Memory Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full bg-white border border-[#E5E7EB] rounded-3xl p-5 shadow-sm flex flex-col gap-3.5 mb-4 text-left"
        >
          {/* Photo if available */}
          {memory.photoUrl && (
            <div className="w-full h-[150px] rounded-2xl overflow-hidden border border-[#E5E7EB] relative">
              <img
                src={memory.photoUrl}
                alt="Shared memory"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Activity Title & Time */}
          <div className="flex flex-col">
            <h2 className="font-serif font-semibold text-[20px] text-[#18181B]">
              {memory.activityTitle}
            </h2>
            <span className="text-[12.5px] text-[#6B7280] font-sans flex items-center gap-1.5 mt-0.5">
              <Calendar size={13} className="text-[#7C6EE6]" />
              {memory.dateStr}
            </span>
          </div>

          {/* Note */}
          {memory.note && (
            <p className="text-[13px] text-[#4B5563] leading-[145%] italic bg-[#FAF9F7] p-3 rounded-xl border border-[#F3F4F6]">
              "{memory.note}"
            </p>
          )}

          {/* Dual Emotional Tags matching prompt: Komal — Calming, Riya — Fun */}
          <div className="pt-2 border-t border-[#F3F4F6] flex items-center gap-2">
            {/* User Tag */}
            <div
              className="flex-1 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border text-[12px] font-sans font-medium"
              style={{
                backgroundColor: userConf.bgColor,
                borderColor: userConf.borderColor,
                color: userConf.textColor,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: userConf.dotColor }}
              />
              <span className="truncate">Komal: {userConf.label}</span>
            </div>

            {/* Friend Tag */}
            <div
              className="flex-1 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border text-[12px] font-sans font-medium"
              style={{
                backgroundColor: friendConf.bgColor,
                borderColor: friendConf.borderColor,
                color: friendConf.textColor,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: friendConf.dotColor }}
              />
              <span className="truncate">Riya: {friendConf.label}</span>
            </div>
          </div>
        </motion.div>

        <p className="text-[12.5px] text-[#9CA3AF] leading-[140%] max-w-[280px]">
          Added to your accumulated friendship story.
        </p>
      </div>

      {/* CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 pt-2 shrink-0">
        <button
          id="save-to-our-story-btn"
          type="button"
          onClick={onSaveToStory}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <BookHeart size={18} />
          Save to our story
        </button>
        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
