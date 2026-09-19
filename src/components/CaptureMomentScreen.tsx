import React, { useState } from 'react';
import { Camera, Image, Mic, Square, Trash2, Check } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface CaptureMomentScreenProps {
  activityTitle: string;
  onSaveMoment: (photoUrl?: string, note?: string, voiceDuration?: string) => void;
  onSkip: () => void;
}

export const CaptureMomentScreen: React.FC<CaptureMomentScreenProps> = ({
  activityTitle,
  onSaveMoment,
  onSkip,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  );
  const [note, setNote] = useState(
    'The sky turned lavender and amber over the reservoir. We talked about autumn plans.'
  );
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceDuration, setVoiceDuration] = useState<string | undefined>(undefined);

  const handleToggleVoice = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      setVoiceDuration('0:18');
    } else {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setVoiceDuration('0:24');
      }, 2500);
    }
  };

  const handleSave = () => {
    onSaveMoment(photoUrl, note, voiceDuration);
  };

  return (
    <div
      id="capture-moment-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Header */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-6 flex items-center justify-between">
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            Optional Memory
          </span>
          <button
            id="skip-capture-top-btn"
            type="button"
            onClick={onSkip}
            className="text-[14px] font-sans font-medium text-[#6B7280] hover:text-[#18181B] cursor-pointer"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pt-1">
        {/* Headline */}
        <div className="flex flex-col gap-1 mb-5">
          <h1 className="font-serif font-semibold text-[30px] leading-[115%] text-[#18181B] tracking-tight">
            Keep a little of this moment?
          </h1>
          <p className="font-sans text-[13.5px] leading-[140%] text-[#6B7280]">
            What do you want to remember?
          </p>
        </div>

        {/* Photo Attachment */}
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-sans font-semibold text-[#18181B] flex items-center gap-1.5">
              <Camera size={14} className="text-[#7C6EE6]" />
              Photo
            </label>
            {photoUrl && (
              <button
                type="button"
                onClick={() => setPhotoUrl(undefined)}
                className="text-[11px] text-[#DC2626] hover:underline"
              >
                Remove photo
              </button>
            )}
          </div>

          {photoUrl ? (
            <div className="relative w-full h-[140px] rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs">
              <img
                src={photoUrl}
                alt="Captured moment"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md font-sans">
                Photo attached
              </div>
            </div>
          ) : (
            <div className="w-full h-[90px] rounded-2xl border-2 border-dashed border-[#DDD6FE] bg-[#EDE9FE]/30 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-[#EDE9FE]/50 transition-colors"
              onClick={() =>
                setPhotoUrl(
                  'https://images.unsplash.com/photo-1519337265831-281ec6cc8514?auto=format&fit=crop&w=600&q=80'
                )
              }
            >
              <Image size={20} className="text-[#7C6EE6]" />
              <span className="text-[12px] font-sans font-medium text-[#7C6EE6]">
                Tap to select a photo
              </span>
            </div>
          )}
        </div>

        {/* Short Note */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[13px] font-sans font-semibold text-[#18181B]">
            Short note
          </label>
          <textarea
            id="capture-note-input"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="A line about what happened, something funny said, or how it felt..."
            className="w-full p-3.5 rounded-2xl bg-white border border-[#E5E7EB] text-[13.5px] leading-[145%] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
          />
        </div>

        {/* Voice Note Prompt */}
        <div className="flex flex-col gap-2 mb-2">
          <label className="text-[13px] font-sans font-semibold text-[#18181B] flex items-center gap-1.5">
            <Mic size={14} className="text-[#7C6EE6]" />
            Voice note
          </label>

          <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isRecordingVoice
                    ? 'bg-[#EF4444] text-white animate-pulse'
                    : 'bg-[#EDE9FE] text-[#7C6EE6] hover:bg-[#DDD6FE]'
                }`}
              >
                {isRecordingVoice ? <Square size={14} /> : <Mic size={16} />}
              </button>
              <div className="flex flex-col">
                <span className="text-[13px] font-sans font-medium text-[#18181B]">
                  {isRecordingVoice
                    ? 'Recording voice note...'
                    : voiceDuration
                    ? `Recorded note (${voiceDuration})`
                    : 'Record a quick thought'}
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  10–30 seconds of quiet reflection
                </span>
              </div>
            </div>

            {voiceDuration && (
              <button
                type="button"
                onClick={() => setVoiceDuration(undefined)}
                className="text-[#9CA3AF] hover:text-[#DC2626] p-1"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 gap-2.5 shrink-0">
        <button
          id="save-our-moment-btn"
          type="button"
          onClick={handleSave}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          Save our moment
        </button>

        <button
          id="skip-capture-bottom-btn"
          type="button"
          onClick={onSkip}
          className="py-1.5 text-[14px] font-sans font-medium text-[#6B7280] hover:text-[#18181B] transition-colors cursor-pointer"
        >
          Skip
        </button>

        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
