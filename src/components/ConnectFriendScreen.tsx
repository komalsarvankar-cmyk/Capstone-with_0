import React, { useState } from 'react';
import { ChevronLeft, Search, Link2, Check, UserCheck } from 'lucide-react';
import { Contact } from '../types';
import { CONTACT_SUGGESTIONS } from '../data';
import { StatusBar } from './StatusBar';
import { HomeIndicator } from './HomeIndicator';

interface ConnectFriendScreenProps {
  onBack: () => void;
  onConnect: (friend: Contact) => void;
  selectedFriend: Contact;
  onSelectFriend: (friend: Contact) => void;
}

export const ConnectFriendScreen: React.FC<ConnectFriendScreenProps> = ({
  onBack,
  onConnect,
  selectedFriend,
  onSelectFriend,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const filteredContacts = CONTACT_SUGGESTIONS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div
      id="connect-friend-screen"
      className="w-full h-full flex flex-col justify-between items-center bg-[#FAF9F7] text-[#18181B] select-none"
    >
      {/* Top Bar */}
      <div className="w-full flex flex-col shrink-0">
        <StatusBar />
        <div className="w-full h-[52px] px-4 flex items-center justify-between">
          <button
            id="connect-back-btn"
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#18181B] hover:bg-black/5 cursor-pointer transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          <span className="text-[12px] font-sans font-medium text-[#7C6EE6] px-2.5 py-0.5 rounded-full bg-[#EDE9FE]">
            Step 2 of 3
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex-1 flex flex-col px-6 overflow-y-auto no-scrollbar pt-1">
        {/* Header Copy */}
        <div className="flex flex-col gap-2 mb-6">
          <h1 className="font-serif font-semibold text-[30px] leading-[118%] text-[#18181B] tracking-tight">
            Who would you like to do this with?
          </h1>
          <p className="font-sans text-[14px] leading-[145%] text-[#6B7280]">
            Connect with a friend to start sharing experiences together.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full mb-4">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
          <input
            id="friend-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full h-[46px] pl-10 pr-4 rounded-xl bg-white border border-[#E5E7EB] text-[#18181B] text-[14px] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7C6EE6]"
          />
        </div>

        {/* Send Invite Link Option */}
        <div className="w-full bg-white border border-[#E5E7EB] rounded-2xl p-3.5 mb-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[#7C6EE6]">
              <Link2 size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-sans font-semibold text-[#18181B]">
                Send invite link
              </span>
              <span className="text-[11px] text-[#6B7280]">
                Invite anyone via Messages or WhatsApp
              </span>
            </div>
          </div>
          <button
            id="copy-invite-link-btn"
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-full bg-[#FAF9F7] border border-[#DDD6FE] text-[#7C6EE6] text-[12px] font-sans font-medium hover:bg-[#EDE9FE] transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check size={13} className="text-emerald-600" />
                Copied
              </>
            ) : (
              'Copy link'
            )}
          </button>
        </div>

        {/* Contact List */}
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
            Suggested Friends
          </span>

          <div className="flex flex-col gap-2">
            {filteredContacts.map((contact) => {
              const isSelected = selectedFriend.id === contact.id;
              return (
                <button
                  id={`friend-option-${contact.id}`}
                  key={contact.id}
                  type="button"
                  onClick={() => onSelectFriend(contact)}
                  className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-2 border-[#7C6EE6] shadow-sm'
                      : 'bg-white border border-[#E5E7EB] hover:border-[#D1D5DB]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-[14px] text-[#55479E]"
                      style={{ backgroundColor: contact.avatarBg || '#EDE9FE' }}
                    >
                      {contact.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[14px] font-sans font-semibold text-[#18181B]">
                        {contact.name}
                      </span>
                      <span className="text-[12px] text-[#6B7280]">
                        {contact.location || contact.phone}
                      </span>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-[#7C6EE6] text-white flex items-center justify-center">
                      <UserCheck size={14} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#D1D5DB]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Friend Profile Preview Card */}
        {selectedFriend && (
          <div className="w-full bg-[#EDE9FE]/50 border border-[#DDD6FE] rounded-2xl p-4 flex items-center gap-3.5 mt-auto mb-2">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-serif font-bold text-[16px] text-[#55479E] bg-[#DDD6FE] shrink-0"
            >
              {selectedFriend.initials}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[14px] font-sans font-bold text-[#18181B]">
                {selectedFriend.name}
              </span>
              <span className="text-[12px] text-[#6D5EC9]">
                Ready to do activities together
              </span>
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/80 text-[#55479E]">
              Selected
            </span>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="w-full flex flex-col items-center px-6 pb-3 pt-2 shrink-0">
        <button
          id="connect-friend-confirm-btn"
          type="button"
          onClick={() => onConnect(selectedFriend)}
          className="w-full h-[52px] rounded-full bg-[#7C6EE6] text-white font-sans font-semibold text-[16px] shadow-sm hover:bg-[#6D5EC9] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center"
        >
          Connect with {selectedFriend.name.split(' ')[0]}
        </button>
        <HomeIndicator color="#D1D5DB" />
      </div>
    </div>
  );
};
