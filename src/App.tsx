/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ScreenId,
  NavTab,
  Contact,
  Activity,
  Plan,
  SharedMemory,
  EmotionalState,
} from './types';
import {
  CONTACT_SUGGESTIONS,
  CURATED_ACTIVITIES,
  DEFAULT_PLAN,
  INITIAL_MEMORIES,
} from './data';

// Flow Screens
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { ConnectFriendScreen } from './components/ConnectFriendScreen';
import { FriendConnectedScreen } from './components/FriendConnectedScreen';
import { ChooseActivityScreen } from './components/ChooseActivityScreen';
import { InviteFriendScreen } from './components/InviteFriendScreen';
import { FriendAcceptsScreen } from './components/FriendAcceptsScreen';
import { MakePlanScreen } from './components/MakePlanScreen';
import { PlanConfirmedScreen } from './components/PlanConfirmedScreen';
import { ActivityCheckinScreen } from './components/ActivityCheckinScreen';
import { CaptureMomentScreen } from './components/CaptureMomentScreen';
import { SharedMomentScreen } from './components/SharedMomentScreen';

// Main Tabs
import { HomeScreen } from './components/HomeScreen';
import { OurStoryScreen } from './components/OurStoryScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { YouScreen } from './components/YouScreen';

// Navigation & Notifications
import { BottomNavBar } from './components/BottomNavBar';
import { TopNotificationBanner } from './components/TopNotificationBanner';

export default function App() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isInTabMode, setIsInTabMode] = useState<boolean>(false);

  // App Data State
  const [selectedFriend, setSelectedFriend] = useState<Contact>(CONTACT_SUGGESTIONS[0]); // Riya Sharma
  const [selectedActivity, setSelectedActivity] = useState<Activity>(CURATED_ACTIVITIES[0]); // Take a walk
  const [proposedWhen, setProposedWhen] = useState<string>('Saturday · 6:00 PM');
  const [proposedNote, setProposedNote] = useState<string>('Want to try the new park?');
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(DEFAULT_PLAN);
  const [memories, setMemories] = useState<SharedMemory[]>(INITIAL_MEMORIES);
  const [activeCheckinEmotion, setActiveCheckinEmotion] = useState<EmotionalState>('calming');
  const [pendingMemory, setPendingMemory] = useState<SharedMemory>({
    id: 'mem-new',
    activityTitle: 'Take a walk',
    dateStr: 'Sept 19 · 6:00 PM',
    userEmotion: 'calming',
    friendEmotion: 'fun',
    note: 'The sky turned lavender and amber over the reservoir. We talked about autumn plans.',
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  });

  // Top Notification Banner State
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState({
    title: 'Your walk with Riya starts in 30 minutes.',
    subtitle: 'Ready?',
  });

  // Screen Jump Modal
  const [showScreenPicker, setShowScreenPicker] = useState<boolean>(false);

  // Handlers for Step Transitions
  const handleGetStarted = () => {
    setIsInTabMode(false);
    setCurrentScreen('create-account');
  };

  const handleHaveAccount = () => {
    setIsInTabMode(true);
    setActiveTab('home');
  };

  const handleAccountCreated = () => {
    setCurrentScreen('connect-friend');
  };

  const handleFriendConnected = (friend: Contact) => {
    setSelectedFriend(friend);
    setCurrentScreen('friend-connected');
  };

  const handleChooseFirstExperience = () => {
    setCurrentScreen('choose-activity');
  };

  const handleExploreFirst = () => {
    setIsInTabMode(true);
    setActiveTab('discover');
  };

  const handleSelectActivity = (activity: Activity) => {
    setSelectedActivity(activity);
    setCurrentScreen('invite-friend');
  };

  const handleSendInvitation = (when: string, note?: string) => {
    setProposedWhen(when);
    if (note) setProposedNote(note);
    setCurrentScreen('friend-accepts');
  };

  const handleFriendAccepts = (when: string, note?: string) => {
    setProposedWhen(when);
    if (note) setProposedNote(note);
    setCurrentScreen('make-plan');
  };

  const handleSetPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    setCurrentScreen('plan-confirmed');
    // Trigger the notification reminder 2 seconds after confirmation
    setTimeout(() => {
      setNotificationMessage({
        title: `Your ${plan.activityTitle.toLowerCase()} with ${selectedFriend.name.split(' ')[0]} starts in 30 minutes.`,
        subtitle: 'Ready?',
      });
      setShowNotification(true);
    }, 1500);
  };

  const handleDoneConfirmed = () => {
    setIsInTabMode(true);
    setActiveTab('home');
  };

  const handleCompleteCheckin = (
    didDoIt: 'yes' | 'not-this-time' | 'something-else',
    emotion?: EmotionalState
  ) => {
    if (didDoIt === 'yes') {
      const selectedEmo = emotion || 'calming';
      setActiveCheckinEmotion(selectedEmo);
      setPendingMemory((prev) => ({
        ...prev,
        activityTitle: currentPlan?.activityTitle || 'Take a walk',
        dateStr: 'Today · 6:00 PM',
        userEmotion: selectedEmo,
        friendEmotion: 'fun',
      }));
      setCurrentScreen('capture-moment');
    } else {
      // User didn't do it this time
      setIsInTabMode(true);
      setActiveTab('home');
    }
  };

  const handleSaveMoment = (
    photoUrl?: string,
    note?: string,
    voiceDuration?: string
  ) => {
    const updated: SharedMemory = {
      id: `mem-${Date.now()}`,
      activityTitle: currentPlan?.activityTitle || selectedActivity.title,
      dateStr: 'Sept 19 · 6:00 PM',
      userEmotion: activeCheckinEmotion,
      friendEmotion: 'fun',
      photoUrl,
      note,
      voiceNoteDuration: voiceDuration,
    };
    setPendingMemory(updated);
    setCurrentScreen('shared-moment');
  };

  const handleSkipCapture = () => {
    const updated: SharedMemory = {
      id: `mem-${Date.now()}`,
      activityTitle: currentPlan?.activityTitle || selectedActivity.title,
      dateStr: 'Sept 19 · 6:00 PM',
      userEmotion: activeCheckinEmotion,
      friendEmotion: 'fun',
    };
    setPendingMemory(updated);
    setCurrentScreen('shared-moment');
  };

  const handleSaveToStory = () => {
    setMemories((prev) => [pendingMemory, ...prev]);
    setIsInTabMode(true);
    setActiveTab('our-story');
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    setIsInTabMode(true);
  };

  const allScreensList: { id: ScreenId | 'main-nav'; label: string; desc: string }[] = [
    { id: 'welcome', label: '1. Welcome', desc: 'Brand intro & value statement' },
    { id: 'create-account', label: '2. Create Account', desc: 'Google, Apple, Email' },
    { id: 'connect-friend', label: '3. Connect Friend', desc: 'Search, contacts, invite link' },
    { id: 'friend-connected', label: '4. Friend Connected', desc: 'You + Riya connection' },
    { id: 'choose-activity', label: '5. Choose Activity', desc: 'Curated list & AI idea generator' },
    { id: 'invite-friend', label: '6. Invite Friend', desc: 'Time, note & lightweight chat' },
    { id: 'friend-accepts', label: '7. Friend Accepts', desc: 'Accept, suggest time or activity' },
    { id: 'make-plan', label: '8. Make Plan', desc: 'Recurrence rhythm & notes' },
    { id: 'plan-confirmed', label: '9. Plan Confirmed', desc: 'Confirmation & calendar sync' },
    { id: 'activity-checkin', label: '10. Check-in', desc: 'Did you do it? Emotional tones' },
    { id: 'capture-moment', label: '11. Capture Moment', desc: 'Optional photo, note, voice' },
    { id: 'shared-moment', label: '12. Shared Moment', desc: 'Dual emotion tag polaroid' },
    { id: 'main-nav', label: 'Main Tab Navigation', desc: 'Home, Our Story, Discover, You' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#E5E7EB]/40 flex flex-col items-center justify-center p-0 sm:py-5 sm:px-4 selection:bg-[#7C6EE6] selection:text-white font-sans">
      {/* Top Prototype Navigation Toolbar */}
      <header
        id="prototype-top-toolbar"
        className="hidden lg:flex items-center justify-between gap-3 mb-3 px-4 py-2 bg-white/95 backdrop-blur-md rounded-full border border-[#D1D5DB]/70 shadow-xs max-w-[960px] w-full"
      >
        <div className="flex items-center gap-2">
          <span className="font-serif italic font-bold text-[15px] text-[#18181B] px-2 border-r border-[#E5E7EB]">
            With<span className="text-[#7C6EE6]">.</span>
          </span>
          <span className="text-[12px] font-sans font-medium text-[#6B7280]">
            Friendship Experience App Prototype
          </span>
        </div>

        {/* Quick jump to the 12 screens */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => {
              setIsInTabMode(false);
              setCurrentScreen('welcome');
            }}
            className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-full transition-all cursor-pointer ${
              !isInTabMode && currentScreen === 'welcome'
                ? 'bg-[#7C6EE6] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#18181B] hover:bg-black/5'
            }`}
          >
            1. Welcome
          </button>

          <button
            type="button"
            onClick={() => {
              setIsInTabMode(false);
              setCurrentScreen('choose-activity');
            }}
            className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-full transition-all cursor-pointer ${
              !isInTabMode && currentScreen === 'choose-activity'
                ? 'bg-[#7C6EE6] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#18181B] hover:bg-black/5'
            }`}
          >
            5. Activities
          </button>

          <button
            type="button"
            onClick={() => {
              setIsInTabMode(false);
              setCurrentScreen('activity-checkin');
            }}
            className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-full transition-all cursor-pointer ${
              !isInTabMode && currentScreen === 'activity-checkin'
                ? 'bg-[#7C6EE6] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#18181B] hover:bg-black/5'
            }`}
          >
            10. Check-in
          </button>

          <button
            type="button"
            onClick={() => {
              setIsInTabMode(true);
              setActiveTab('home');
            }}
            className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-full transition-all cursor-pointer ${
              isInTabMode && activeTab === 'home'
                ? 'bg-[#7C6EE6] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#18181B] hover:bg-black/5'
            }`}
          >
            Home Tab
          </button>

          <button
            type="button"
            onClick={() => {
              setIsInTabMode(true);
              setActiveTab('our-story');
            }}
            className={`px-2.5 py-1 text-[11px] font-sans font-medium rounded-full transition-all cursor-pointer ${
              isInTabMode && activeTab === 'our-story'
                ? 'bg-[#7C6EE6] text-white shadow-2xs'
                : 'text-[#6B7280] hover:text-[#18181B] hover:bg-black/5'
            }`}
          >
            Our Story Tab
          </button>

          <button
            type="button"
            onClick={() => setShowScreenPicker(true)}
            className="px-3 py-1 text-[11px] font-sans font-semibold rounded-full bg-[#EDE9FE] text-[#55479E] hover:bg-[#DDD6FE] transition-colors cursor-pointer"
          >
            All 12 Screens ▾
          </button>
        </div>
      </header>

      {/* Main Mobile Device Container (Matching standard 402px x 874px frame) */}
      <main
        id="with-device-frame"
        className="relative w-full sm:w-[402px] h-[100dvh] sm:h-[874px] sm:min-h-[874px] bg-[#FAF9F7] sm:border sm:border-[#E5E7EB] sm:rounded-[36px] sm:shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top Interactive Mobile Notification Simulation */}
        <TopNotificationBanner
          show={showNotification}
          onOpen={() => {
            setShowNotification(false);
            setCurrentScreen('activity-checkin');
            setIsInTabMode(false);
          }}
          onDismiss={() => setShowNotification(false)}
          title={notificationMessage.title}
          subtitle={notificationMessage.subtitle}
          ctaText="Check-in"
        />

        {/* Dynamic Screen Surface */}
        <div className="w-full flex-1 overflow-hidden relative flex flex-col">
          <AnimatePresence mode="wait">
            {!isInTabMode ? (
              // 12 STEP-BY-STEP FLOW SCREENS
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full h-full flex flex-col"
              >
                {currentScreen === 'welcome' && (
                  <WelcomeScreen
                    onGetStarted={handleGetStarted}
                    onHaveAccount={handleHaveAccount}
                  />
                )}

                {currentScreen === 'create-account' && (
                  <CreateAccountScreen
                    onBack={() => setCurrentScreen('welcome')}
                    onContinue={handleAccountCreated}
                  />
                )}

                {currentScreen === 'connect-friend' && (
                  <ConnectFriendScreen
                    selectedFriend={selectedFriend}
                    onSelectFriend={setSelectedFriend}
                    onConnect={handleFriendConnected}
                    onBack={() => setCurrentScreen('create-account')}
                  />
                )}

                {currentScreen === 'friend-connected' && (
                  <FriendConnectedScreen
                    friend={selectedFriend}
                    onChooseExperience={handleChooseFirstExperience}
                    onExploreFirst={handleExploreFirst}
                  />
                )}

                {currentScreen === 'choose-activity' && (
                  <ChooseActivityScreen
                    friend={selectedFriend}
                    onSelectActivity={handleSelectActivity}
                    onBack={() => setCurrentScreen('friend-connected')}
                  />
                )}

                {currentScreen === 'invite-friend' && (
                  <InviteFriendScreen
                    activity={selectedActivity}
                    friend={selectedFriend}
                    onSendInvitation={handleSendInvitation}
                    onBack={() => setCurrentScreen('choose-activity')}
                  />
                )}

                {currentScreen === 'friend-accepts' && (
                  <FriendAcceptsScreen
                    activity={selectedActivity}
                    friend={selectedFriend}
                    proposedTime={proposedWhen}
                    proposedNote={proposedNote}
                    onAccept={handleFriendAccepts}
                    onSuggestAnotherActivity={() =>
                      setCurrentScreen('choose-activity')
                    }
                    onBack={() => setCurrentScreen('invite-friend')}
                  />
                )}

                {currentScreen === 'make-plan' && (
                  <MakePlanScreen
                    activity={selectedActivity}
                    friend={selectedFriend}
                    dateTime={proposedWhen}
                    initialNote={proposedNote}
                    onSetPlan={handleSetPlan}
                    onBack={() => setCurrentScreen('friend-accepts')}
                  />
                )}

                {currentScreen === 'plan-confirmed' && (
                  <PlanConfirmedScreen
                    plan={currentPlan || DEFAULT_PLAN}
                    onDone={handleDoneConfirmed}
                    onTestNotification={() => {
                      setNotificationMessage({
                        title: `Your walk with ${selectedFriend.name.split(' ')[0]} starts in 30 minutes.`,
                        subtitle: 'Ready?',
                      });
                      setShowNotification(true);
                    }}
                    onGoToCheckin={() => {
                      setCurrentScreen('activity-checkin');
                    }}
                  />
                )}

                {currentScreen === 'activity-checkin' && (
                  <ActivityCheckinScreen
                    plan={currentPlan || DEFAULT_PLAN}
                    onCompleteCheckin={handleCompleteCheckin}
                    onBack={() => {
                      setIsInTabMode(true);
                      setActiveTab('home');
                    }}
                  />
                )}

                {currentScreen === 'capture-moment' && (
                  <CaptureMomentScreen
                    activityTitle={currentPlan?.activityTitle || selectedActivity.title}
                    onSaveMoment={handleSaveMoment}
                    onSkip={handleSkipCapture}
                  />
                )}

                {currentScreen === 'shared-moment' && (
                  <SharedMomentScreen
                    memory={pendingMemory}
                    onSaveToStory={handleSaveToStory}
                  />
                )}
              </motion.div>
            ) : (
              // MAIN APP BOTTOM NAVIGATION TABS
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                {activeTab === 'home' && (
                  <HomeScreen
                    currentPlan={currentPlan}
                    recentMemories={memories}
                    onStartNewActivity={() => {
                      setIsInTabMode(false);
                      setCurrentScreen('choose-activity');
                    }}
                    onOpenPlan={() => {
                      setIsInTabMode(false);
                      setCurrentScreen('plan-confirmed');
                    }}
                    onGoToCheckin={() => {
                      setIsInTabMode(false);
                      setCurrentScreen('activity-checkin');
                    }}
                    onSelectQuickActivity={(act) => {
                      setSelectedActivity(act);
                      setIsInTabMode(false);
                      setCurrentScreen('invite-friend');
                    }}
                  />
                )}

                {activeTab === 'our-story' && (
                  <OurStoryScreen memories={memories} />
                )}

                {activeTab === 'discover' && (
                  <DiscoverScreen
                    onPlanExperience={(act) => {
                      setSelectedActivity(act);
                      setIsInTabMode(false);
                      setCurrentScreen('invite-friend');
                    }}
                  />
                )}

                {activeTab === 'you' && (
                  <YouScreen
                    friend={selectedFriend}
                    onResetFlow={() => {
                      setIsInTabMode(false);
                      setCurrentScreen('welcome');
                    }}
                    onOpenScreenSelector={() => setShowScreenPicker(true)}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Persistent Bottom Navigation Bar (Shown on main tabs) */}
        {isInTabMode && (
          <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
        )}
      </main>

      {/* Screen Selector Modal */}
      <AnimatePresence>
        {showScreenPicker && (
          <div
            id="all-screens-catalog-modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4"
          >
            <div className="w-full max-w-[440px] bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E7EB] flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
                <div>
                  <h3 className="font-serif font-bold text-[18px] text-[#18181B]">
                    Navigate UX/UI Prototype
                  </h3>
                  <p className="text-[12px] text-[#6B7280]">
                    All 12 screens & 4 persistent tabs from the prompt
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScreenPicker(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5"
                >
                  &times;
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto no-scrollbar flex flex-col gap-2">
                {allScreensList.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.id === 'main-nav') {
                        setIsInTabMode(true);
                        setActiveTab('home');
                      } else {
                        setIsInTabMode(false);
                        setCurrentScreen(item.id as ScreenId);
                      }
                      setShowScreenPicker(false);
                    }}
                    className="p-3 rounded-xl border border-[#E5E7EB] hover:border-[#7C6EE6] hover:bg-[#EDE9FE]/20 text-left transition-all cursor-pointer flex flex-col"
                  >
                    <span className="font-sans font-semibold text-[14px] text-[#18181B]">
                      {item.label}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <footer className="hidden sm:flex items-center gap-2 mt-3 text-[12px] text-[#6B7280]">
        <span>With &bull; Friendship support system &bull; 402 &times; 874 px</span>
      </footer>
    </div>
  );
}
