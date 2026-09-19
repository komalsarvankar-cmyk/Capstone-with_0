import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, Calendar, RefreshCw, X, MessageSquare } from 'lucide-react';
import { Activity, Contact } from '../types';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface FriendAcceptsScreenProps {
  activity: Activity;
  friend: Contact;
  proposedTime: string;
  proposedNote?: string;
  onAccept: (time: string, note?: string) => void;
  onSuggestAnotherActivity: () => void;
  onBack: () => void;
}

export const FriendAcceptsScreen: React.FC<FriendAcceptsScreenProps> = ({
  activity,
  friend,
  proposedTime,
  proposedNote,
  onAccept,
  onSuggestAnotherActivity,
  onBack,
}) => {
  const friendFirstName = friend.name.split(' ')[0];
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState(proposedTime || 'Saturday · 6:00 PM');

  const alternateTimes = [
    'Saturday · 6:00 PM (Original)',
    'Saturday · 7:15 PM (Sunset)',
    'Sunday · 11:00 AM (Morning)',
    'Sunday · 5:30 PM (Evening)',
  ];

  return (
    <div
      id="friend-accepts-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-6 flex items-center justify-between">
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            Friend Agency
          </span>
          <button
            type="button"
            onClick={onBack}
            className="text-[13px] text-[#6B7280] hover:text-[#18181B]"
          >
            Switch view
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col items-center justify-center px-6 max-w-[345px] text-center">
        {/* Invitation Sender Pill */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-serif font-bold text-[11px] flex items-center justify-center">
            {friend.initials}
          </div>
          <span className="text-[13px] font-sans font-semibold text-[#6B7280]">
            {friendFirstName} invited you
          </span>
        </div>

        {/* Activity Card */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-sm flex flex-col items-center gap-3 mb-4">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6] bg-[#EDE9FE] px-3 py-0.5 rounded-full">
            {activity.duration}
          </span>

          <h1 className="font-serif font-semibold text-[30px] leading-[115%] text-[#18181B] tracking-tight">
            {activity.title}
          </h1>

          <div className="flex items-center gap-2 text-[14px] font-sans font-medium text-[#18181B] bg-[#FAF9F7] px-3.5 py-1.5 rounded-full border border-[#E5E7EB]">
            <Calendar size={14} className="text-[#7C6EE6]" />
            {selectedTime}
          </div>

          {proposedNote && (
            <div className="w-full mt-2 p-3 rounded-xl bg-[#FAF9F7] border border-[#E5E7EB] text-[13px] text-[#4B5563] text-left italic flex items-start gap-2">
              <MessageSquare size={14} className="text-[#9CA3AF] shrink-0 mt-0.5" />
              <span>"{proposedNote}"</span>
            </div>
          )}
        </div>

        <p className="text-[13px] text-[#6B7280] leading-[145%] px-2">
          You can accept right away, adjust the time to your schedule, or suggest a different activity.
        </p>
      </div>

      {/* Agency Actions Footer matching prompt */}
      <div className="w-full flex flex-col items-center px-6 pb-3 gap-2.5 shrink-0">
        {/* Primary Accept */}
        <button
          id="friend-accept-btn"
          type="button"
          onClick={() => onAccept(selectedTime, proposedNote)}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Accept
        </button>

        {/* Suggest another time */}
        <button
          id="suggest-another-time-btn"
          type="button"
          onClick={() => setShowTimeModal(true)}
          className="w-full h-[46px] rounded-full bg-white border border-[#E5E7EB] text-[#18181B] font-sans font-medium text-[14px] hover:border-[#D1D5DB] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Clock size={15} className="text-[#7C6EE6]" />
          Suggest another time
        </button>

        {/* Suggest another activity */}
        <button
          id="suggest-another-activity-btn"
          type="button"
          onClick={onSuggestAnotherActivity}
          className="py-2 text-[13px] font-sans font-medium text-[#6B7280] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          Suggest another activity
        </button>

        <HomeIndicator color="#D1D5DB" />
      </div>

      {/* Suggest another time modal */}
      <AnimatePresence>
        {showTimeModal && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-[402px] bg-[#FAF9F7] rounded-t-[28px] p-6 flex flex-col gap-4 border-t border-[#E5E7EB] shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <h3 className="font-serif font-semibold text-[18px] text-[#18181B]">
                  Choose another time
                </h3>
                <button
                  type="button"
                  onClick={() => setShowTimeModal(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {alternateTimes.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      setSelectedTime(time.replace(' (Original)', '').replace(' (Sunset)', '').replace(' (Morning)', '').replace(' (Evening)', ''));
                      setShowTimeModal(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left text-[14px] font-sans transition-all cursor-pointer ${
                      selectedTime.includes(time.slice(0, 8))
                        ? 'bg-white border-[#7C6EE6] font-semibold text-[#18181B]'
                        : 'bg-white border-[#E5E7EB] text-[#4B5563]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
