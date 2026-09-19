import React, { useState } from 'react';
import { BookHeart, Calendar, Heart, MessageCircle, Sparkles, Send, Check } from 'lucide-react';
import { SharedMemory } from '../types';
import { EMOTIONAL_CONFIGS } from '../data';
import { StatusBar } from './StatusBar';

interface OurStoryScreenProps {
  memories: SharedMemory[];
}

export const OurStoryScreen: React.FC<OurStoryScreenProps> = ({ memories }) => {
  const [subTab, setSubTab] = useState<'moments' | 'journal' | 'year-in-review'>('moments');
  const [journalInput, setJournalInput] = useState('');
  const [journalEntries, setJournalEntries] = useState([
    {
      prompt: 'What made us laugh recently?',
      author: 'Riya',
      text: 'Trying to teach each other how to roll pasta dough and making modern art triangles instead.',
      date: 'Sept 14',
    },
    {
      prompt: 'A moment of calm this week:',
      author: 'Komal',
      text: 'Sitting quietly on the park bench while rain tapped the umbrella.',
      date: 'Sept 10',
    },
  ]);

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalInput.trim()) return;
    setJournalEntries((prev) => [
      {
        prompt: 'What made us laugh recently?',
        author: 'Komal',
        text: journalInput.trim(),
        date: 'Today',
      },
      ...prev,
    ]);
    setJournalInput('');
  };

  return (
    <div
      id="our-story-screen-tab"
      className="w-full h-full flex flex-col bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full px-6 pt-2 pb-3 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="font-serif italic font-bold text-[26px] tracking-tight text-[#18181B]">
              You + Riya
            </h1>
            <span className="text-[12px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#55479E]">
              8 months together
            </span>
          </div>
          <p className="text-[13px] font-sans text-[#6B7280]">
            {memories.length + 19} moments shared &bull; Connected since Jan 2026
          </p>
        </div>

        {/* Emotional Color Trail Ribbon */}
        <div className="w-full px-6 pb-3">
          <div className="w-full p-2.5 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#6B7280]">
              Emotional trail:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {['calming', 'fun', 'meaningful', 'just-nice', 'fun', 'unexpected', 'calming'].map(
                (emotionKey, idx) => {
                  const conf =
                    EMOTIONAL_CONFIGS[emotionKey as any] || EMOTIONAL_CONFIGS.calming;
                  return (
                    <div
                      key={idx}
                      className="w-3.5 h-3.5 rounded-full shadow-2xs"
                      style={{ backgroundColor: conf.dotColor }}
                    />
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* 3 Sub-tabs matching prompt: Moments | Journal | Year in review */}
        <div className="w-full px-6 pb-2 border-b border-[#E5E7EB]">
          <div className="flex rounded-xl bg-[#EDE9FE]/50 p-1">
            {[
              { id: 'moments', label: 'Moments' },
              { id: 'journal', label: 'Journal' },
              { id: 'year-in-review', label: 'Year in review' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSubTab(tab.id as any)}
                className={`flex-1 py-1.5 rounded-lg text-[12.5px] font-sans font-medium transition-all cursor-pointer ${
                  subTab === tab.id
                    ? 'bg-white text-[#18181B] font-semibold shadow-xs'
                    : 'text-[#6B7280] hover:text-[#18181B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar px-6 py-4">
        {/* SUBTAB 1: MOMENTS (Timeline of shared memories) */}
        {subTab === 'moments' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF]">
                September 2026
              </span>
              <span className="text-[11px] text-[#7C6EE6]">Milestone: 20th activity</span>
            </div>

            {memories.map((memory) => {
              const uConf =
                EMOTIONAL_CONFIGS[memory.userEmotion] || EMOTIONAL_CONFIGS.calming;
              const fConf =
                EMOTIONAL_CONFIGS[memory.friendEmotion] || EMOTIONAL_CONFIGS.fun;

              return (
                <div
                  key={memory.id}
                  className="w-full bg-white border border-[#E5E7EB] rounded-3xl p-4 shadow-2xs flex flex-col gap-3"
                >
                  {memory.photoUrl && (
                    <div className="w-full h-[140px] rounded-2xl overflow-hidden relative border border-[#E5E7EB]">
                      <img
                        src={memory.photoUrl}
                        alt={memory.activityTitle}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-semibold text-[17px] text-[#18181B]">
                        {memory.activityTitle}
                      </h3>
                      <span className="text-[11.5px] text-[#9CA3AF]">
                        {memory.dateStr}
                      </span>
                    </div>
                    {memory.note && (
                      <p className="text-[13px] text-[#4B5563] italic mt-1 leading-[140%]">
                        "{memory.note}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-[#F3F4F6]">
                    <span
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: uConf.bgColor,
                        color: uConf.textColor,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: uConf.dotColor }}
                      />
                      You: {uConf.label}
                    </span>

                    <span
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1"
                      style={{
                        backgroundColor: fConf.bgColor,
                        color: fConf.textColor,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: fConf.dotColor }}
                      />
                      Riya: {fConf.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SUBTAB 2: JOURNAL (Lightweight shared reflections) */}
        {subTab === 'journal' && (
          <div className="flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-white border border-[#DDD6FE] flex flex-col gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6]">
                Weekly Prompt
              </span>
              <h3 className="font-serif font-bold text-[18px] text-[#18181B]">
                What made us laugh recently?
              </h3>
              <p className="text-[12.5px] text-[#6B7280]">
                A quiet space to write small reflections you can look back on.
              </p>

              <form onSubmit={handleAddJournal} className="flex flex-col gap-2 mt-2">
                <textarea
                  rows={2}
                  value={journalInput}
                  onChange={(e) => setJournalInput(e.target.value)}
                  placeholder="Share a short line or funny thought..."
                  className="w-full p-3 rounded-xl bg-[#FAF9F7] border border-[#E5E7EB] text-[13px] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
                />
                <button
                  type="submit"
                  className="self-end px-4 py-1.5 rounded-full bg-[#7C6EE6] text-white text-[12px] font-semibold flex items-center gap-1 hover:bg-[#6D5EC9] cursor-pointer"
                >
                  <Send size={12} /> Add to journal
                </button>
              </form>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
                Recent Entries
              </span>

              {journalEntries.map((entry, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#55479E]">
                      {entry.author}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF]">{entry.date}</span>
                  </div>
                  <p className="text-[13.5px] text-[#374151] leading-[145%]">
                    "{entry.text}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: YEAR IN REVIEW */}
        {subTab === 'year-in-review' && (
          <div className="flex flex-col gap-4">
            <div className="w-full rounded-3xl bg-gradient-to-b from-[#EDE9FE] to-white p-5 border border-[#DDD6FE] flex flex-col items-center text-center gap-2">
              <div className="w-12 h-12 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center">
                <Sparkles size={20} />
              </div>
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6]">
                Annual Friendship Ritual
              </span>
              <h2 className="font-serif font-bold text-[24px] text-[#18181B]">
                2026 With Riya
              </h2>
              <p className="text-[13px] text-[#6B7280] max-w-[260px]">
                A quiet reflection on the small moments that shaped your year together.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
                <span className="text-[26px] font-serif font-bold text-[#7C6EE6]">
                  23
                </span>
                <span className="text-[12px] text-[#6B7280]">Shared moments</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
                <span className="text-[26px] font-serif font-bold text-[#D97706]">
                  14 hrs
                </span>
                <span className="text-[12px] text-[#6B7280]">Time spent together</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
                <span className="text-[26px] font-serif font-bold text-[#059669]">
                  Calming
                </span>
                <span className="text-[12px] text-[#6B7280]">Dominant feeling</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col">
                <span className="text-[26px] font-serif font-bold text-[#EC4899]">
                  8 walks
                </span>
                <span className="text-[12px] text-[#6B7280]">Favorite ritual</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
