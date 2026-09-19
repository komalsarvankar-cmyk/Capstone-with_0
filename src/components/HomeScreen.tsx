import React from 'react';
import { Sparkles, Calendar, ArrowRight, Footprints, Sunset, Clock, Plus } from 'lucide-react';
import { Activity, Plan, SharedMemory } from '../types';
import { EMOTIONAL_CONFIGS } from '../data';
import { StatusBar } from './StatusBar';

interface HomeScreenProps {
  currentPlan: Plan | null;
  recentMemories: SharedMemory[];
  onStartNewActivity: () => void;
  onOpenPlan: () => void;
  onGoToCheckin: () => void;
  onSelectQuickActivity: (activity: Activity) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentPlan,
  recentMemories,
  onStartNewActivity,
  onOpenPlan,
  onGoToCheckin,
  onSelectQuickActivity,
}) => {
  const latestMemory = recentMemories[0];

  const quickActivities: Activity[] = [
    {
      id: 'sunset-1',
      title: 'Watch the sunset',
      duration: '15–30 min',
      description: 'Find a quiet spot outdoors and watch the sky change colors together.',
      iconName: 'sunset',
      locationType: 'in-person',
      tags: ['Simple', 'Outdoors'],
    },
    {
      id: 'coffee-1',
      title: 'Have coffee together',
      duration: '20–30 min',
      description: 'Grab a hot cup at a favorite neighborhood cafe or brew together.',
      iconName: 'coffee',
      locationType: 'in-person',
      tags: ['Relaxing', 'Everyday'],
    },
  ];

  return (
    <div
      id="home-screen-tab"
      className="w-full h-full flex flex-col bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif italic font-bold text-[24px] tracking-tight text-[#18181B]">
              With<span className="text-[#7C6EE6]">.</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE9FE] text-[#55479E] text-[12px] font-sans font-medium">
            <span className="w-2 h-2 rounded-full bg-[#7C6EE6]" />
            You + Riya
          </div>
        </div>
      </div>

      {/* Main Screen Content (designed for minimal scrolling) */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar gap-4 pb-2">
        {/* Subtle emotional pattern color trail banner */}
        <div className="w-full py-1.5 px-3 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-between">
          <span className="text-[11px] font-sans font-medium text-[#6B7280]">
            Recent emotional rhythm:
          </span>
          <div className="flex items-center gap-1.5">
            {recentMemories.slice(0, 5).map((mem, idx) => {
              const conf = EMOTIONAL_CONFIGS[mem.userEmotion] || EMOTIONAL_CONFIGS.calming;
              return (
                <div
                  key={idx}
                  title={`${mem.activityTitle} (${conf.label})`}
                  className="w-3 h-3 rounded-full transition-transform hover:scale-125"
                  style={{ backgroundColor: conf.dotColor }}
                />
              );
            })}
          </div>
        </div>

        {/* 1. Main Card: "Your next moment" */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
            Your Next Moment
          </span>

          {currentPlan ? (
            <div
              id="next-moment-card"
              className="w-full bg-white border border-[#DDD6FE] rounded-3xl p-5 shadow-xs flex flex-col gap-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6] bg-[#EDE9FE] px-2.5 py-0.5 rounded-full">
                  Upcoming
                </span>
                <span className="text-[12px] text-[#6B7280] flex items-center gap-1">
                  <Clock size={12} />
                  {currentPlan.duration}
                </span>
              </div>

              <div>
                <h3 className="font-serif font-semibold text-[22px] text-[#18181B] leading-tight">
                  {currentPlan.activityTitle}
                </h3>
                <div className="flex items-center gap-1.5 text-[13px] text-[#6B7280] font-sans mt-1">
                  <Calendar size={13} className="text-[#7C6EE6]" />
                  <span>{currentPlan.displayDateTime}</span>
                  <span>&bull;</span>
                  <span>With {currentPlan.recipient}</span>
                </div>
              </div>

              {currentPlan.note && (
                <p className="text-[12.5px] text-[#4B5563] italic bg-[#FAF9F7] p-2.5 rounded-xl border border-[#F3F4F6]">
                  "{currentPlan.note}"
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  id="view-plan-btn"
                  type="button"
                  onClick={onOpenPlan}
                  className="flex-1 h-[40px] rounded-xl bg-[#EDE9FE] text-[#55479E] text-[13px] font-sans font-semibold hover:bg-[#DDD6FE] transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  View plan
                </button>
                <button
                  id="checkin-now-btn"
                  type="button"
                  onClick={onGoToCheckin}
                  className="flex-1 h-[40px] rounded-xl bg-[#7C6EE6] text-white text-[13px] font-sans font-semibold hover:bg-[#6D5EC9] transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  Check-in now
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-white border border-dashed border-[#DDD6FE] rounded-3xl p-6 text-center flex flex-col items-center gap-2">
              <span className="font-serif text-[18px] text-[#18181B]">
                No moment planned yet
              </span>
              <p className="text-[13px] text-[#6B7280] max-w-[240px]">
                Ready to find a small activity to share with Riya?
              </p>
              <button
                type="button"
                onClick={onStartNewActivity}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#7C6EE6] text-white text-[13px] font-sans font-semibold flex items-center gap-1.5 hover:bg-[#6D5EC9] cursor-pointer"
              >
                <Plus size={15} /> Plan something
              </button>
            </div>
          )}
        </div>

        {/* 2. "Something you could do next" (1-2 curated activities) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Something you could do next
            </span>
            <button
              type="button"
              onClick={onStartNewActivity}
              className="text-[11.5px] font-sans font-medium text-[#7C6EE6] hover:underline cursor-pointer"
            >
              See all
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {quickActivities.map((activity) => (
              <div
                key={activity.id}
                className="w-full bg-white border border-[#E5E7EB] hover:border-[#DDD6FE] rounded-2xl p-3.5 flex items-center justify-between transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF9F7] flex items-center justify-center text-[#7C6EE6] shrink-0">
                    {activity.iconName === 'sunset' ? (
                      <Sunset size={18} className="text-[#D97706]" />
                    ) : (
                      <Footprints size={18} className="text-[#7C6EE6]" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-[14px] text-[#18181B]">
                      {activity.title}
                    </span>
                    <span className="text-[11.5px] text-[#6B7280]">
                      {activity.duration} &bull; {activity.tags[0]}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectQuickActivity(activity)}
                  className="px-3 py-1.5 rounded-full bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#55479E] text-[12px] font-sans font-semibold transition-colors cursor-pointer"
                >
                  Plan this
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. "Recent moment" with emotional color tags */}
        {latestMemory && (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
              Recent moment
            </span>

            <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-2xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-serif font-semibold text-[15px] text-[#18181B]">
                  {latestMemory.activityTitle}
                </span>
                <span className="text-[11px] text-[#9CA3AF]">
                  {latestMemory.dateStr}
                </span>
              </div>

              {latestMemory.note && (
                <p className="text-[12.5px] text-[#4B5563] leading-[140%] line-clamp-2">
                  "{latestMemory.note}"
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                {(() => {
                  const uConf =
                    EMOTIONAL_CONFIGS[latestMemory.userEmotion] ||
                    EMOTIONAL_CONFIGS.calming;
                  return (
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1"
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
                  );
                })()}

                {(() => {
                  const fConf =
                    EMOTIONAL_CONFIGS[latestMemory.friendEmotion] ||
                    EMOTIONAL_CONFIGS.fun;
                  return (
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1"
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
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
