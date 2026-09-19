import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  X,
  Shuffle,
  Check,
  Footprints,
  Sunset,
  Utensils,
  Gamepad2,
  Music,
  Coffee,
  BookOpen,
  Compass,
  Camera,
  Bike,
  Palette,
} from 'lucide-react';
import { Activity, Contact } from '../types';
import { CURATED_ACTIVITIES } from '../data';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface ChooseActivityScreenProps {
  friend: Contact;
  onSelectActivity: (activity: Activity) => void;
  onBack: () => void;
}

export const ChooseActivityScreen: React.FC<ChooseActivityScreenProps> = ({
  friend,
  onSelectActivity,
  onBack,
}) => {
  const [showAllLibrary, setShowAllLibrary] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('All');
  const [showAiModal, setShowAiModal] = useState(false);

  // AI prompt state
  const [aiTime, setAiTime] = useState<'15–20 min' | '30 min' | '45–60 min'>('15–20 min');
  const [aiSetting, setAiSetting] = useState<'Outdoors' | 'Indoors' | 'Either'>('Outdoors');
  const [aiEnergy, setAiEnergy] = useState<'Low / Chill' | 'Active' | 'Creative'>('Low / Chill');
  const [aiFormat, setAiFormat] = useState<'In-person' | 'Remote / Over phone'>('In-person');
  const [aiGeneratedIdea, setAiGeneratedIdea] = useState<{
    title: string;
    description: string;
    duration: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getActivityIcon = (iconName: Activity['iconName']) => {
    switch (iconName) {
      case 'walk':
        return <Footprints size={18} className="text-[#7C6EE6]" />;
      case 'sunset':
        return <Sunset size={18} className="text-[#D97706]" />;
      case 'utensils':
        return <Utensils size={18} className="text-[#059669]" />;
      case 'gamepad':
        return <Gamepad2 size={18} className="text-[#7C6EE6]" />;
      case 'music':
        return <Music size={18} className="text-[#EC4899]" />;
      case 'coffee':
        return <Coffee size={18} className="text-[#92400E]" />;
      case 'book':
        return <BookOpen size={18} className="text-[#4F46E5]" />;
      case 'compass':
        return <Compass size={18} className="text-[#F97316]" />;
      case 'camera':
        return <Camera size={18} className="text-[#7C6EE6]" />;
      case 'bike':
        return <Bike size={18} className="text-[#10B981]" />;
      case 'palette':
        return <Palette size={18} className="text-[#EC4899]" />;
      default:
        return <Sparkles size={18} className="text-[#7C6EE6]" />;
    }
  };

  const aiIdeaCatalog = [
    {
      title: 'Try a photo walk',
      duration: '20 min',
      description:
        'Take a 20-minute walk around your neighborhood and give each other three things to photograph. Compare what you noticed afterward.',
    },
    {
      title: 'Balcony / Window Tea Ritual',
      duration: '15 min',
      description:
        'Brew a warm mug of tea, stand near an open window or porch, and listen to the ambient city sounds while catching up.',
    },
    {
      title: 'Two-Song Listening Exchange',
      duration: '10–15 min',
      description:
        'Pick one song that has been on repeat for you this week and play it for each other with zero interruptions.',
    },
    {
      title: 'Unfamiliar Grocery Snack Swap',
      duration: '30 min',
      description:
        'Stop into a corner market you normally bypass, buy two snacks neither of you has tried, and sample them together.',
    },
  ];

  const handleGenerateAiIdea = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomIdea =
        aiIdeaCatalog[Math.floor(Math.random() * aiIdeaCatalog.length)];
      setAiGeneratedIdea(randomIdea);
      setIsGenerating(false);
    }, 600);
  };

  const handleSelectAiActivity = () => {
    if (!aiGeneratedIdea) return;
    const generatedActivity: Activity = {
      id: `ai-${Date.now()}`,
      title: aiGeneratedIdea.title,
      duration: aiGeneratedIdea.duration,
      description: aiGeneratedIdea.description,
      iconName: 'camera',
      locationType: 'either',
      tags: ['AI Suggested', 'Spontaneous'],
    };
    setShowAiModal(false);
    onSelectActivity(generatedActivity);
  };

  // Primary curated 9 activities
  const primaryActivities = CURATED_ACTIVITIES.slice(0, 9);

  return (
    <div
      id="choose-activity-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-4 flex items-center justify-between">
          <button
            id="choose-activity-back-btn"
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5 cursor-pointer transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            With {friend.name.split(' ')[0]}
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pt-1 pb-4">
        {/* Headline */}
        <div className="flex flex-col gap-1.5 mb-5">
          <h1 className="font-serif font-semibold text-[28px] leading-[118%] text-[#18181B] tracking-tight">
            What would you like to do together?
          </h1>
          <p className="font-sans text-[13.5px] leading-[140%] text-[#6B7280]">
            Small, simple activities that fit into real life.
          </p>
        </div>

        {/* AI Suggestion Card (Prominently placed as requested) */}
        <div
          id="ai-suggestion-card"
          className="w-full bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl p-4 mb-5 flex flex-col gap-2.5 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#7C6EE6] text-white flex items-center justify-center">
                <Sparkles size={15} />
              </div>
              <span className="font-serif italic font-semibold text-[15px] text-[#18181B]">
                Can’t decide?
              </span>
            </div>
            <span className="text-[11px] font-sans font-medium text-[#7C6EE6] px-2 py-0.5 rounded-full bg-white">
              Idea Generator
            </span>
          </div>

          <p className="font-sans text-[13px] text-[#55479E] leading-[140%]">
            Let With think of something for you two based on your time and mood.
          </p>

          <button
            id="ai-suggest-something-btn"
            type="button"
            onClick={() => {
              setAiGeneratedIdea({
                title: 'Try a photo walk',
                duration: '20 min',
                description:
                  'Take a 20-minute walk around your neighborhood and give each other three things to photograph. Compare what you noticed afterward.',
              });
              setShowAiModal(true);
            }}
            className="w-full h-[42px] rounded-xl bg-[#7C6EE6] text-white font-sans font-semibold text-[14px] flex items-center justify-center gap-2 shadow-xs hover:bg-[#6D5EC9] transition-all cursor-pointer"
          >
            <Sparkles size={15} />
            Suggest something
          </button>
        </div>

        {/* Curated Activity List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Curated Everyday Activities
            </span>
            <span className="text-[11px] text-[#6B7280]">Low effort</span>
          </div>

          {primaryActivities.map((activity) => (
            <button
              id={`activity-card-${activity.id}`}
              key={activity.id}
              type="button"
              onClick={() => onSelectActivity(activity)}
              className="w-full bg-white border border-[#E5E7EB] hover:border-[#C4B5FD] rounded-2xl p-4 flex items-center justify-between text-left transition-all hover:shadow-xs active:scale-[0.99] cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F7] border border-[#E5E7EB] flex items-center justify-center shrink-0 group-hover:bg-[#EDE9FE] transition-colors">
                  {getActivityIcon(activity.iconName)}
                </div>
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-[15px] text-[#18181B] group-hover:text-[#7C6EE6] transition-colors">
                    {activity.title}
                  </span>
                  <div className="flex items-center gap-2 text-[12px] text-[#6B7280] mt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} className="text-[#9CA3AF]" />
                      {activity.duration}
                    </span>
                    <span>&bull;</span>
                    <span className="line-clamp-1">{activity.tags[0]}</span>
                  </div>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-[#FAF9F7] group-hover:bg-[#7C6EE6] group-hover:text-white flex items-center justify-center text-[#9CA3AF] transition-colors">
                <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>

        {/* Prominent "View all activities →" Link directly visible on screen as mandated */}
        <div className="w-full py-5 flex justify-center">
          <button
            id="view-all-activities-btn"
            type="button"
            onClick={() => setShowAllLibrary(true)}
            className="px-5 py-2.5 rounded-full bg-white border border-[#DDD6FE] text-[#7C6EE6] font-sans font-semibold text-[14px] flex items-center gap-2 hover:bg-[#EDE9FE] active:scale-[0.98] transition-all shadow-xs cursor-pointer"
          >
            View all activities &rarr;
          </button>
        </div>
      </div>

      <HomeIndicator color="#D1D5DB" />

      {/* MODAL 1: COMPLETE ACTIVITY LIBRARY */}
      <AnimatePresence>
        {showAllLibrary && (
          <div
            id="all-activities-library-modal"
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="w-full max-w-[402px] h-[85vh] bg-[#FAF9F7] rounded-t-[28px] border-t border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-5 pb-3 border-b border-[#E5E7EB] flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-semibold text-[20px] text-[#18181B]">
                    Complete Activity Library
                  </h2>
                  <p className="text-[12px] text-[#6B7280]">
                    Simple ways to spend time together
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllLibrary(false)}
                  aria-label="Close"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Tag filters */}
              <div className="flex items-center gap-2 px-5 py-2.5 overflow-x-auto no-scrollbar shrink-0 border-b border-[#E5E7EB]/60">
                {['All', 'Simple', 'Outdoors', 'Creative', 'Remote', 'Comforting'].map(
                  (tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTagFilter(tag)}
                      className={`px-3 py-1 text-[12px] rounded-full font-sans font-medium whitespace-nowrap cursor-pointer transition-colors ${
                        selectedTagFilter === tag
                          ? 'bg-[#7C6EE6] text-white'
                          : 'bg-white border border-[#E5E7EB] text-[#6B7280]'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>

              {/* Activity List */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-5 flex flex-col gap-2.5">
                {CURATED_ACTIVITIES.filter((a) =>
                  selectedTagFilter === 'All'
                    ? true
                    : a.tags.includes(selectedTagFilter) ||
                      (selectedTagFilter === 'Remote' && a.locationType === 'remote') ||
                      (selectedTagFilter === 'Outdoors' && a.tags.includes('Outdoors'))
                ).map((activity) => (
                  <button
                    key={activity.id}
                    type="button"
                    onClick={() => {
                      setShowAllLibrary(false);
                      onSelectActivity(activity);
                    }}
                    className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-4 flex items-center justify-between text-left hover:border-[#7C6EE6] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF9F7] flex items-center justify-center shrink-0">
                        {getActivityIcon(activity.iconName)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans font-semibold text-[14.5px] text-[#18181B]">
                          {activity.title}
                        </span>
                        <span className="text-[12px] text-[#6B7280]">
                          {activity.duration} &bull; {activity.description}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-[#9CA3AF] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: AI ACTIVITY SUGGESTION FLOW */}
      <AnimatePresence>
        {showAiModal && (
          <div
            id="ai-suggestion-modal"
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="w-full max-w-[402px] max-h-[88vh] bg-[#FAF9F7] rounded-t-[28px] border-t border-[#E5E7EB] shadow-2xl flex flex-col p-6 overflow-y-auto no-scrollbar gap-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-1 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#7C6EE6] text-white flex items-center justify-center">
                    <Sparkles size={15} />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[18px] text-[#18181B]">
                      Idea Generator for You + {friend.name.split(' ')[0]}
                    </h3>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  aria-label="Close"
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Quick contextual dials */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Quick Context for Both of You
                </span>

                {/* Available time */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-[#6B7280]">
                    Available time:
                  </label>
                  <div className="flex gap-2">
                    {(['15–20 min', '30 min', '45–60 min'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setAiTime(t)}
                        className={`flex-1 py-1.5 rounded-xl text-[12px] font-sans font-medium transition-colors cursor-pointer ${
                          aiTime === t
                            ? 'bg-[#7C6EE6] text-white'
                            : 'bg-white border border-[#E5E7EB] text-[#18181B]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Setting */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-[#6B7280]">
                    Setting:
                  </label>
                  <div className="flex gap-2">
                    {(['Outdoors', 'Indoors', 'Either'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setAiSetting(s)}
                        className={`flex-1 py-1.5 rounded-xl text-[12px] font-sans font-medium transition-colors cursor-pointer ${
                          aiSetting === s
                            ? 'bg-[#7C6EE6] text-white'
                            : 'bg-white border border-[#E5E7EB] text-[#18181B]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-medium text-[#6B7280]">
                    Energy level:
                  </label>
                  <div className="flex gap-2">
                    {(['Low / Chill', 'Active', 'Creative'] as const).map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setAiEnergy(e)}
                        className={`flex-1 py-1.5 rounded-xl text-[12px] font-sans font-medium transition-colors cursor-pointer ${
                          aiEnergy === e
                            ? 'bg-[#7C6EE6] text-white'
                            : 'bg-white border border-[#E5E7EB] text-[#18181B]'
                        }`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Suggestion Result Box matching user specification */}
              {aiGeneratedIdea && (
                <div className="w-full bg-white border border-[#DDD6FE] rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-sans font-semibold text-[#7C6EE6] uppercase tracking-wider">
                      Here’s an idea for you two
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EDE9FE] text-[#55479E]">
                      {aiGeneratedIdea.duration}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-[19px] text-[#18181B]">
                    {aiGeneratedIdea.title}
                  </h4>

                  <p className="font-sans text-[13.5px] leading-[145%] text-[#4B5563]">
                    {aiGeneratedIdea.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  id="ai-accept-idea-btn"
                  type="button"
                  onClick={handleSelectAiActivity}
                  className="w-full h-[48px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[15px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check size={16} />
                  Let’s do this
                </button>

                <button
                  id="ai-try-another-btn"
                  type="button"
                  onClick={handleGenerateAiIdea}
                  disabled={isGenerating}
                  className="w-full h-[44px] rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] font-sans font-medium text-[14px] flex items-center justify-center gap-2 hover:border-[#D1D5DB] transition-all cursor-pointer"
                >
                  <Shuffle size={15} />
                  {isGenerating ? 'Thinking...' : 'Try another idea'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
