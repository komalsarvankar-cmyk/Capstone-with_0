import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';

interface TopNotificationBannerProps {
  show: boolean;
  onOpen: () => void;
  onDismiss: () => void;
  title?: string;
  subtitle?: string;
  ctaText?: string;
}

export const TopNotificationBanner: React.FC<TopNotificationBannerProps> = ({
  show,
  onOpen,
  onDismiss,
  title = 'Your walk with Riya starts in 30 minutes.',
  subtitle = 'Ready?',
  ctaText = 'Open plan',
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 300 }}
          className="absolute top-12 left-3 right-3 z-50 bg-[#18181B] text-white p-3.5 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-3 cursor-pointer"
          onClick={onOpen}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#7C6EE6] flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#A78BFA]">
                  With
                </span>
                <span className="text-[10px] text-zinc-400">&bull; now</span>
              </div>
              <p className="text-[13px] font-sans font-medium text-white leading-tight">
                {title}
              </p>
              <p className="text-[12px] text-zinc-300">{subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[12px] font-sans font-semibold text-[#A78BFA] underline">
              {ctaText}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              aria-label="Dismiss notification"
              className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-400 hover:text-white"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
