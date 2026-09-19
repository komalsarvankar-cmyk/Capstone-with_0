import React, { useState } from 'react';
import { ChevronLeft, Mail, ArrowRight } from 'lucide-react';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface CreateAccountScreenProps {
  onBack: () => void;
  onContinue: (name: string, email: string) => void;
}

export const CreateAccountScreen: React.FC<CreateAccountScreenProps> = ({
  onBack,
  onContinue,
}) => {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [name, setName] = useState('Komal Sarvankar');
  const [email, setEmail] = useState('komalsarvankar@gmail.com');

  const handleGoogle = () => {
    onContinue(name, email);
  };

  const handleApple = () => {
    onContinue(name, email);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onContinue(name, email);
    }
  };

  return (
    <div
      id="create-account-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Navigation */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-4 flex items-center">
          <button
            id="create-account-back-btn"
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5 cursor-pointer transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 flex flex-col justify-center px-7 max-w-[340px]">
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[12px] font-sans font-semibold tracking-wider text-[#7C6EE6] uppercase">
            Step 1 of 3
          </span>
          <h1 className="font-serif font-semibold text-[32px] leading-[115%] text-[#18181B] tracking-tight">
            Let’s get you in.
          </h1>
          <p className="font-sans text-[15px] leading-[145%] text-[#6B7280]">
            Create your account and start doing more with your friends.
          </p>
        </div>

        {/* Auth Stack */}
        <div className="w-full flex flex-col gap-3">
          {/* Google */}
          <button
            id="auth-google-btn"
            type="button"
            onClick={handleGoogle}
            className="w-full h-[52px] rounded-full bg-white border border-[#E5E7EB] text-[#18181B] font-sans font-medium text-[15px] flex items-center justify-center gap-3 shadow-xs hover:border-[#D1D5DB] active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Apple */}
          <button
            id="auth-apple-btn"
            type="button"
            onClick={handleApple}
            className="w-full h-[52px] rounded-full bg-white border border-[#E5E7EB] text-[#18181B] font-sans font-medium text-[15px] flex items-center justify-center gap-3 shadow-xs hover:border-[#D1D5DB] active:scale-[0.99] transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-.99 1.71-.85 2.73 1 .08 2.03-.51 2.55-1.23z" />
            </svg>
            Continue with Apple
          </button>

          {/* Email toggle */}
          {!showEmailInput ? (
            <button
              id="auth-email-btn"
              type="button"
              onClick={() => setShowEmailInput(true)}
              className="w-full h-[52px] rounded-full bg-white border border-[#E5E7EB] text-[#18181B] font-sans font-medium text-[15px] flex items-center justify-center gap-3 shadow-xs hover:border-[#D1D5DB] active:scale-[0.99] transition-all cursor-pointer"
            >
              <Mail size={17} className="text-[#6B7280]" />
              Continue with email
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2.5 pt-1">
              <input
                id="input-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-[48px] px-4 rounded-xl bg-white border border-[#DDD6FE] text-[#18181B] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
              />
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full h-[48px] px-4 rounded-xl bg-white border border-[#DDD6FE] text-[#18181B] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
              />
              <button
                id="submit-email-btn"
                type="submit"
                className="w-full h-[48px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[15px] flex items-center justify-center gap-2 cursor-pointer hover:bg-[#6D5EC9] transition-colors mt-1"
              >
                Continue <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 shrink-0">
        <p className="text-[12px] text-[#9CA3AF] text-center max-w-[280px]">
          By continuing, you agree to With’s quiet and private terms of service.
        </p>
        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
