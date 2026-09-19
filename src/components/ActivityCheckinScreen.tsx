import React, { useState } from 'react';
import { ChevronLeft, Check, Sparkles, HeartHandshake } from 'lucide-react';
import { EmotionalState, Plan } from '../types';
import { EMOTIONAL_CONFIGS } from '../data';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface ActivityCheckinScreenProps {
  plan: Plan;
  onCompleteCheckin: (didDoIt: 'yes' | 'not-this-time' | 'something-else', emotion?: EmotionalState) => void;
  onBack: () => void;
}

export const ActivityCheckinScreen: React.FC<ActivityCheckinScreenProps> = ({
  plan,
  onCompleteCheckin,
  onBack,
}) => {
  const [didDoIt, setDidDoIt] = useState<'yes' | 'not-this-time' | 'something-else'>('yes');
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionalState>('calming');

  const handleContinue = () => {
    onCompleteCheckin(didDoIt, didDoIt === 'yes' ? selectedEmotion : undefined);
  };

  const emotions: EmotionalState[] = ['fun', 'calming', 'meaningful', 'unexpected', 'just-nice'];

  return (
    <div
      id="activity-checkin-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-4 flex items-center justify-between">
          <button
            id="checkin-back-btn"
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5 cursor-pointer transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            Activity Check-in
          </span>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pt-1">
        {/* Activity context pill */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[12px] font-sans font-semibold text-[#6B7280]">
            {plan.activityTitle} &bull; with {plan.recipient}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif font-semibold text-[32px] leading-[115%] text-[#18181B] tracking-tight mb-6">
          How did it feel?
        </h1>

        {/* Question 1: Did you do it? */}
        <div className="flex flex-col gap-2.5 mb-7">
          <label className="text-[13.5px] font-sans font-semibold text-[#18181B]">
            Did you do it?
          </label>
          <div className="flex flex-col gap-2">
            {[
              { id: 'yes', label: 'Yes, we did' },
              { id: 'not-this-time', label: 'Not this time' },
              { id: 'something-else', label: 'We did something else' },
            ].map((opt) => {
              const isSelected = didDoIt === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setDidDoIt(opt.id as any)}
                  className={`w-full h-[46px] px-4 rounded-xl flex items-center justify-between text-[14px] font-sans transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-[#7C6EE6] text-[#18181B] font-semibold shadow-xs'
                      : 'bg-white border border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB]'
                  }`}
                >
                  <span>{opt.label}</span>
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

        {/* Question 2: How did it feel? (Shown if completed) */}
        {didDoIt === 'yes' && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="text-[13.5px] font-sans font-semibold text-[#18181B]">
                How did it feel?
              </label>
              <span className="text-[12px] text-[#6B7280]">
                Choose an emotional tone that will color your shared story.
              </span>
            </div>

            {/* Emotional Tag Cards */}
            <div className="flex flex-col gap-2.5">
              {emotions.map((emotionKey) => {
                const conf = EMOTIONAL_CONFIGS[emotionKey];
                const isSelected = selectedEmotion === emotionKey;

                return (
                  <button
                    id={`emotion-tag-${conf.id}`}
                    key={conf.id}
                    type="button"
                    onClick={() => setSelectedEmotion(conf.id)}
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 shadow-xs'
                        : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                    }`}
                    style={{
                      backgroundColor: isSelected ? conf.bgColor : '#FFFFFF',
                      borderColor: isSelected ? conf.dotColor : '#E5E7EB',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {/* Emotional color indicator dot */}
                      <div
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ backgroundColor: conf.dotColor }}
                      />
                      <div className="flex flex-col text-left">
                        <span
                          className="font-sans font-semibold text-[15px]"
                          style={{
                            color: isSelected ? conf.textColor : '#18181B',
                          }}
                        >
                          {conf.label}
                        </span>
                        <span className="text-[12px] text-[#6B7280]">
                          {conf.description}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: conf.dotColor }}
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 pt-2 shrink-0">
        <button
          id="checkin-continue-btn"
          type="button"
          onClick={handleContinue}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          {didDoIt === 'yes' ? 'Next: Capture the moment' : 'Finish check-in'}
        </button>
        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
