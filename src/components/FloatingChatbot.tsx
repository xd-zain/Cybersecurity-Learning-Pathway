import React, { useState } from 'react';
import { Orbit, X, Lock } from 'lucide-react';
import { DualGeminiChatbot } from './DualGeminiChatbot';
import { useAuth } from '../context/AuthContext';

interface FloatingChatbotProps {
  onOpenAuth?: (mode?: 'signin' | 'signup') => void;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = ({ onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const handleTriggerClick = () => {
    if (!isAuthenticated) {
      if (onOpenAuth) {
        onOpenAuth('signin');
      }
      return;
    }
    setIsOpen(open => !open);
  };

  return (
    <>
      {/* ── Floating Chat Action Trigger (Bottom-Right) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        
        {/* Subtle hover tooltip on desktop */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171716]/95 border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] text-xs font-mono shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-none">
            {isAuthenticated ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Defense Mentor</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-[#98968f]" />
                <span className="text-[#98968f]">Sign In for AI Mentor</span>
              </>
            )}
          </div>
        )}

        {/* Floating Orb Button styled with warm luxury charcoal & cream */}
        <button
          onClick={handleTriggerClick}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_12px_35px_rgba(0,0,0,0.7)] ${
            isOpen 
              ? 'bg-[#1c1c1b] border border-[#F1EFEA] text-[#F1EFEA] rotate-90' 
              : 'bg-[#171716] hover:bg-[#1f1f1d] text-[#F1EFEA] border border-[rgba(241,239,234,0.2)] hover:border-[#F1EFEA] hover:scale-105'
          }`}
          aria-label={isOpen ? "Close AI Mentor" : (isAuthenticated ? "Open AI Defense Mentor" : "Sign in to access AI Defense Mentor")}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#F1EFEA] transition-transform" />
          ) : (
            <>
              <div className="absolute inset-0 rounded-full bg-[#F1EFEA]/5 blur-md group-hover:bg-[#F1EFEA]/10 transition-all" />
              <Orbit className="w-6 h-6 animate-spin-slow relative z-10 text-[#F1EFEA]" />
              {isAuthenticated ? (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#171716] z-20" />
              ) : (
                <span className="absolute top-0 right-0 p-0.5 rounded-full bg-[#222220] border border-[rgba(241,239,234,0.2)] z-20">
                  <Lock className="w-2.5 h-2.5 text-[#98968f]" />
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* ── Floating Modal Overlay ── */}
      {isOpen && isAuthenticated && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-2xl relative animate-in zoom-in-95 fade-in duration-300">
            <DualGeminiChatbot 
              isFloatingModal={true} 
              onClose={() => setIsOpen(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
