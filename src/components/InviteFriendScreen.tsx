import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, MessageSquare, Send, X, Check } from 'lucide-react';
import { Activity, Contact } from '../types';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface InviteFriendScreenProps {
  activity: Activity;
  friend: Contact;
  onSendInvitation: (when: string, note?: string) => void;
  onBack: () => void;
}

export const InviteFriendScreen: React.FC<InviteFriendScreenProps> = ({
  activity,
  friend,
  onSendInvitation,
  onBack,
}) => {
  const friendFirstName = friend.name.split(' ')[0];
  const [whenOption, setWhenOption] = useState<'Today' | 'Tomorrow' | 'Saturday · 6:00 PM'>('Saturday · 6:00 PM');
  const [note, setNote] = useState('Want to try the new park?');
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'you' | 'friend'; text: string; time: string }[]>([
    { sender: 'friend', text: `Hey Komal! Down for a walk this weekend?`, time: '2:15 PM' },
    { sender: 'you', text: `Yes! I was just looking at the park near the water.`, time: '2:18 PM' },
  ]);
  const [newMsg, setNewMsg] = useState('');

  const handleSend = () => {
    onSendInvitation(whenOption, note);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'you', text: newMsg.trim(), time: 'Just now' },
    ]);
    setNewMsg('');
  };

  return (
    <div
      id="invite-friend-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Bar */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-4 flex items-center justify-between">
          <button
            id="invite-back-btn"
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5 cursor-pointer transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            Initiating Activity
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pt-1">
        {/* Selected Activity Hero Card */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-3xl p-5 mb-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6]">
              Selected Activity
            </span>
            <span className="text-[12px] font-medium px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#55479E] flex items-center gap-1">
              <Clock size={12} />
              {activity.duration}
            </span>
          </div>

          <h2 className="font-serif font-semibold text-[26px] leading-tight text-[#18181B]">
            {activity.title}
          </h2>

          <p className="font-sans text-[14px] leading-[145%] text-[#6B7280]">
            {activity.description}
          </p>
        </div>

        {/* Coordination: When? */}
        <div className="flex flex-col gap-2.5 mb-5">
          <label className="text-[13px] font-sans font-semibold text-[#18181B] flex items-center gap-1.5">
            <Calendar size={15} className="text-[#7C6EE6]" />
            When?
          </label>

          <div className="flex flex-col gap-2">
            {(['Today', 'Tomorrow', 'Saturday · 6:00 PM'] as const).map((opt) => {
              const isSelected = whenOption === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setWhenOption(opt)}
                  className={`w-full h-[46px] px-4 rounded-xl flex items-center justify-between text-[14px] font-sans transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-[#7C6EE6] text-[#18181B] font-semibold shadow-xs'
                      : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span>{opt}</span>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center">
                      <Check size={12} />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-[#D1D5DB]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Note */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-[13px] font-sans font-semibold text-[#18181B]">
            Add a note <span className="text-[12px] font-normal text-[#9CA3AF]">(optional)</span>
          </label>
          <input
            id="activity-custom-note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Want to try the new park?"
            className="w-full h-[46px] px-4 rounded-xl bg-white border border-[#E5E7EB] text-[#18181B] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
          />
        </div>

        {/* Lightweight Chat Option */}
        <div className="w-full py-1">
          <button
            id="open-simple-chat-btn"
            type="button"
            onClick={() => setShowChatDrawer(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#EDE9FE]/50 border border-[#DDD6FE] text-[#55479E] text-[13px] font-sans font-medium flex items-center justify-center gap-2 hover:bg-[#EDE9FE] transition-colors cursor-pointer"
          >
            <MessageSquare size={15} className="text-[#7C6EE6]" />
            Chat with {friendFirstName} about this
          </button>
        </div>
      </div>

      {/* Primary CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 pt-2 shrink-0">
        <button
          id="send-to-friend-btn"
          type="button"
          onClick={handleSend}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Send to {friendFirstName}
        </button>
        <HomeIndicator color="#D1D5DB" />
      </div>

      {/* Intentionally Simple Coordination Chat Drawer */}
      {showChatDrawer && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 backdrop-blur-xs">
          <div className="w-full max-w-[402px] h-[65vh] bg-[#FAF9F7] rounded-t-[28px] border-t border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#EDE9FE] text-[#55479E] font-serif font-bold text-[13px] flex items-center justify-center">
                  {friend.initials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-sans font-semibold text-[#18181B]">
                    Chat with {friendFirstName}
                  </span>
                  <span className="text-[11px] text-[#6B7280]">
                    Coordination only &bull; quiet space
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowChatDrawer(false)}
                aria-label="Close chat"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B]"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat message bubbles */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[78%] ${
                    msg.sender === 'you' ? 'self-end items-end' : 'self-start items-start'
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-[140%] ${
                      msg.sender === 'you'
                        ? 'bg-[#7C6EE6] text-white rounded-br-xs'
                        : 'bg-white border border-[#E5E7EB] text-[#18181B] rounded-bl-xs shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#9CA3AF] mt-0.5 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSendChatMessage}
              className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2"
            >
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder={`Quick reply to ${friendFirstName}...`}
                className="flex-1 h-[40px] px-3.5 rounded-full bg-[#FAF9F7] border border-[#E5E7EB] text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
