import React, { useState } from 'react';
import { Orbit, X, Sparkles, Brain, Zap } from 'lucide-react';
import { DualGeminiChatbot } from './DualGeminiChatbot';

interface FloatingChatbotProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const FloatingChatbot: React.FC<FloatingChatbotProps> = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* ── Floating Chat Action Trigger (Bottom-Right) ── */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        
        {/* Subtle hover tooltip on desktop */}
        {!isOpen && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a1226]/90 border border-cyan-500/30 text-cyan-200 text-xs font-mono shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI Defense Mentor</span>
          </div>
        )}

        {/* Floating Orb Button */}
        <button
          onClick={() => setIsOpen(open => !open)}
          className={`relative group w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] ${
            isOpen 
              ? 'bg-[#0f172a] border border-cyan-400 text-cyan-300 rotate-90' 
              : 'bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white border-2 border-white/20 hover:scale-105 shadow-[0_0_25px_rgba(6,182,212,0.5)]'
          }`}
          aria-label={isOpen ? "Close AI Mentor" : "Open AI Defense Mentor"}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-cyan-300 transition-transform" />
          ) : (
            <>
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md group-hover:blur-lg transition-all" />
              <Orbit className="w-7 h-7 animate-spin-slow relative z-10" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#050814] z-20" />
            </>
          )}
        </button>
      </div>

      {/* ── Floating Modal Overlay ── */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
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
