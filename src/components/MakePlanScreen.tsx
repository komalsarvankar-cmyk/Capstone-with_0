import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Repeat, FileText, Check } from 'lucide-react';
import { Activity, Contact, Plan } from '../types';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface MakePlanScreenProps {
  activity: Activity;
  friend: Contact;
  dateTime: string;
  initialNote?: string;
  onSetPlan: (finalPlan: Plan) => void;
  onBack: () => void;
}

export const MakePlanScreen: React.FC<MakePlanScreenProps> = ({
  activity,
  friend,
  dateTime,
  initialNote = '',
  onSetPlan,
  onBack,
}) => {
  const [recurrence, setRecurrence] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('weekly');
  const [recurrenceDuration, setRecurrenceDuration] = useState<'1 week' | '2 weeks' | '1 month' | '3 months' | 'custom'>('1 month');
  const [planNote, setPlanNote] = useState(initialNote);

  const handleConfirmPlan = () => {
    const finalPlan: Plan = {
      id: `plan-${Date.now()}`,
      activityId: activity.id,
      activityTitle: activity.title,
      duration: activity.duration,
      date: 'Saturday',
      time: '6:00 PM',
      displayDateTime: dateTime || 'Saturday · 6:00 PM',
      initiator: 'Komal',
      recipient: friend.name.split(' ')[0],
      note: planNote,
      recurrence,
      recurrenceDuration: recurrence !== 'none' ? recurrenceDuration : undefined,
      status: 'accepted',
    };
    onSetPlan(finalPlan);
  };

  return (
    <div
      id="make-plan-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Bar */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-4 flex items-center justify-between">
          <button
            id="make-plan-back-btn"
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5 cursor-pointer transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            Finalize
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pt-1">
        {/* Headline */}
        <div className="flex flex-col gap-1.5 mb-5">
          <h1 className="font-serif font-semibold text-[30px] leading-[118%] text-[#18181B] tracking-tight">
            Make it a plan.
          </h1>
          <p className="font-sans text-[13.5px] leading-[140%] text-[#6B7280]">
            Set the rhythm so you don't have to keep replanning from scratch.
          </p>
        </div>

        {/* Plan Overview Summary */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-5 shadow-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-[16px] text-[#18181B]">
              {activity.title}
            </span>
            <span className="text-[12px] font-medium text-[#7C6EE6] bg-[#EDE9FE] px-2 py-0.5 rounded-md">
              {activity.duration}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[13px] text-[#4B5563] pt-1 border-t border-[#F3F4F6]">
            <span className="flex items-center gap-1.5 font-medium">
              <Calendar size={14} className="text-[#7C6EE6]" />
              {dateTime || 'Saturday · 6:00 PM'}
            </span>
            <span>&bull;</span>
            <span>You + {friend.name.split(' ')[0]}</span>
          </div>
        </div>

        {/* Recurrence Selector */}
        <div className="flex flex-col gap-2 mb-4">
          <label className="text-[13px] font-sans font-semibold text-[#18181B] flex items-center gap-1.5">
            <Repeat size={14} className="text-[#7C6EE6]" />
            Repeat this activity?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'none', label: 'No repeat' },
              { id: 'daily', label: 'Every day' },
              { id: 'weekly', label: 'Every week' },
              { id: 'monthly', label: 'Every month' },
            ].map((opt) => {
              const isSelected = recurrence === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRecurrence(opt.id as any)}
                  className={`h-[42px] px-3 rounded-xl text-[13px] font-sans font-medium flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-[#7C6EE6] text-[#18181B] shadow-xs'
                      : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check size={14} className="text-[#7C6EE6]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* If recurring: For how long? */}
        {recurrence !== 'none' && (
          <div className="flex flex-col gap-2 mb-4">
            <label className="text-[13px] font-sans font-semibold text-[#18181B]">
              For how long?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(['1 week', '2 weeks', '1 month', '3 months', 'custom'] as const).map(
                (dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setRecurrenceDuration(dur)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-sans font-medium capitalize transition-all cursor-pointer ${
                      recurrenceDuration === dur
                        ? 'bg-[#7C6EE6] text-white'
                        : 'bg-white border border-[#E5E7EB] text-[#4B5563]'
                    }`}
                  >
                    {dur === 'custom' ? 'Custom end date' : dur}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Add a note */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[13px] font-sans font-semibold text-[#18181B] flex items-center gap-1.5">
            <FileText size={14} className="text-[#7C6EE6]" />
            Add a note
          </label>
          <textarea
            id="plan-notes-input"
            rows={2}
            value={planNote}
            onChange={(e) => setPlanNote(e.target.value)}
            placeholder="e.g. Bring a water bottle, let's grab coffee afterward"
            className="w-full p-3 rounded-xl bg-white border border-[#E5E7EB] text-[13.5px] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
          />
        </div>
      </div>

      {/* CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 pt-2 shrink-0">
        <button
          id="set-our-plan-btn"
          type="button"
          onClick={handleConfirmPlan}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          Set our plan
        </button>
        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
