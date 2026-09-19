import React, { useState } from 'react';
import { Compass, Sparkles, MapPin, Users, Heart, ArrowRight, Clock } from 'lucide-react';
import { Activity } from '../types';
import { CURATED_ACTIVITIES } from '../data';
import { StatusBar } from './StatusBar';

interface DiscoverScreenProps {
  onPlanExperience: (activity: Activity) => void;
}

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({ onPlanExperience }) => {
  const [section, setSection] = useState<'for-you' | 'experiences' | 'community' | 'near-you'>('for-you');

  const communityEvents = [
    {
      id: 'comm-1',
      title: 'Gentle Neighborhood Tree Walk',
      date: 'This Sunday · 10:00 AM',
      location: 'Botanical Park',
      duration: '45 min',
      attendees: '12 friend pairs going',
      description: 'A quiet, unhurried morning stroll guided by local plant enthusiasts.',
    },
    {
      id: 'comm-2',
      title: 'Silent Reading in the Courtyard',
      date: 'Next Tuesday · 6:30 PM',
      location: 'Library Pavilion',
      duration: '40 min',
      attendees: '8 friend pairs going',
      description: 'Bring whatever book you are reading. Read side-by-side with tea.',
    },
  ];

  const nearYouSpots = [
    {
      id: 'spot-1',
      title: 'Reservoir Overlook Trail',
      distance: '0.8 miles away',
      tag: 'Sunset view spot',
      duration: '30 min walk',
    },
    {
      id: 'spot-2',
      title: 'Clay & Ceramic Quiet Corner',
      distance: '1.4 miles away',
      tag: 'Casual drop-in',
      duration: '45 min craft',
    },
    {
      id: 'spot-3',
      title: 'Little Bird Tea Merchant',
      distance: '0.5 miles away',
      tag: 'Cozy conversation',
      duration: '25 min tea',
    },
  ];

  return (
    <div
      id="discover-screen-tab"
      className="w-full h-full flex flex-col bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full px-6 pt-2 pb-3 flex flex-col gap-1">
          <h1 className="font-serif italic font-bold text-[26px] tracking-tight text-[#18181B]">
            Discover
          </h1>
          <p className="text-[13px] font-sans text-[#6B7280]">
            Inspiration and gentle spaces for friends.
          </p>
        </div>

        {/* 4 Section Filters matching prompt: For you two | Experiences | Community | Near you */}
        <div className="w-full px-6 pb-2 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'for-you', label: 'For you two' },
              { id: 'experiences', label: 'Experiences' },
              { id: 'community', label: 'Community' },
              { id: 'near-you', label: 'Near you' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSection(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-sans font-medium whitespace-nowrap transition-all cursor-pointer ${
                  section === tab.id
                    ? 'bg-[#7C6EE6] text-white font-semibold'
                    : 'bg-white border border-[#E5E7EB] text-[#6B7280] hover:text-[#18181B]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full flex-1 overflow-y-auto no-scrollbar px-6 py-4 flex flex-col gap-4">
        {/* SECTION 1: FOR YOU TWO */}
        {section === 'for-you' && (
          <div className="flex flex-col gap-3">
            <div className="p-4 rounded-3xl bg-gradient-to-br from-[#EDE9FE] to-white border border-[#DDD6FE] flex flex-col gap-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#7C6EE6]">
                Curated for Komal & Riya
              </span>
              <h3 className="font-serif font-bold text-[20px] text-[#18181B]">
                Cook the same meal while on speaker
              </h3>
              <p className="text-[13px] text-[#55479E] leading-[140%]">
                Both of you love low-pressure food rituals. Make a 15-minute pasta dish from your own kitchens together.
              </p>
              <button
                type="button"
                onClick={() =>
                  onPlanExperience(CURATED_ACTIVITIES.find((a) => a.id === 'cook-1')!)
                }
                className="mt-1 self-start px-4 py-2 rounded-full bg-[#7C6EE6] text-white text-[13px] font-sans font-semibold hover:bg-[#6D5EC9] cursor-pointer"
              >
                Plan with Riya
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
                Gentle Everyday Ideas
              </span>
              {CURATED_ACTIVITIES.slice(2, 6).map((activity) => (
                <div
                  key={activity.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-between hover:border-[#DDD6FE] transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="font-sans font-semibold text-[14px] text-[#18181B]">
                      {activity.title}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      {activity.duration} &bull; {activity.description}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPlanExperience(activity)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-[#EDE9FE] text-[#55479E] text-[12px] font-semibold hover:bg-[#DDD6FE] ml-2"
                  >
                    Plan
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: EXPERIENCES */}
        {section === 'experiences' && (
          <div className="flex flex-col gap-3">
            {CURATED_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="font-sans font-semibold text-[14.5px] text-[#18181B]">
                    {act.title}
                  </span>
                  <span className="text-[12px] text-[#6B7280]">
                    {act.duration} &bull; {act.tags.join(', ')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onPlanExperience(act)}
                  className="px-3 py-1.5 rounded-full bg-[#7C6EE6] text-white text-[12px] font-semibold hover:bg-[#6D5EC9]"
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 3: COMMUNITY */}
        {section === 'community' && (
          <div className="flex flex-col gap-3">
            <span className="text-[12px] text-[#6B7280]">
              Wholesome community gatherings where friends can join together:
            </span>
            {communityEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#7C6EE6] bg-[#EDE9FE] px-2 py-0.5 rounded-md">
                    {evt.date}
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">{evt.duration}</span>
                </div>
                <h4 className="font-serif font-bold text-[16px] text-[#18181B]">
                  {evt.title}
                </h4>
                <p className="text-[12.5px] text-[#6B7280]">{evt.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-[#F3F4F6]">
                  <span className="text-[11.5px] text-[#9CA3AF] flex items-center gap-1">
                    <Users size={13} /> {evt.attendees}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onPlanExperience({
                        id: evt.id,
                        title: evt.title,
                        duration: evt.duration,
                        description: evt.description,
                        iconName: 'walk',
                        locationType: 'in-person',
                        tags: ['Community', 'Outdoor'],
                      })
                    }
                    className="px-3 py-1 rounded-full bg-[#EDE9FE] text-[#55479E] text-[12px] font-semibold hover:bg-[#DDD6FE]"
                  >
                    Go with Riya
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 4: NEAR YOU */}
        {section === 'near-you' && (
          <div className="flex flex-col gap-3">
            <span className="text-[12px] text-[#6B7280]">
              Quiet places close to you for quick meetups:
            </span>
            {nearYouSpots.map((spot) => (
              <div
                key={spot.id}
                className="p-4 rounded-2xl bg-white border border-[#E5E7EB] flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-semibold text-[14.5px] text-[#18181B]">
                      {spot.title}
                    </span>
                  </div>
                  <span className="text-[12px] text-[#6B7280] flex items-center gap-1 mt-0.5">
                    <MapPin size={12} className="text-[#7C6EE6]" />
                    {spot.distance} &bull; {spot.duration}
                  </span>
                  <span className="text-[11px] text-[#7C6EE6] mt-0.5 font-medium">
                    {spot.tag}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onPlanExperience({
                      id: spot.id,
                      title: `Visit ${spot.title}`,
                      duration: spot.duration,
                      description: `Explore ${spot.title} together (${spot.tag}).`,
                      iconName: 'walk',
                      locationType: 'in-person',
                      tags: ['Local', 'Near You'],
                    })
                  }
                  className="px-3 py-1.5 rounded-full bg-[#7C6EE6] text-white text-[12px] font-semibold hover:bg-[#6D5EC9]"
                >
                  Go here
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
