import React from 'react';
import { User, LogOut, Award, Sparkles, BookOpen, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  activeView: 'landing' | 'dashboard' | 'assistant';
  setActiveView: (view: 'landing' | 'dashboard' | 'assistant') => void;
  onOpenCertificate?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  activeView,
  setActiveView,
  onOpenCertificate,
}) => {
  const { user, isAuthenticated, certificate, signOut, progress } = useAuth();

  const completedCount = Object.values(progress).filter(p => p.completed).length;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#111110]/90 backdrop-blur-xl border-b border-[rgba(241,239,234,0.1)] transition-colors">
      <div className="max-w-[1440px] mx-auto px-6 h-18 flex items-center justify-between gap-6">
        
        {/* Brand wordmark matching Forma design library */}
        <a 
          href="#"
          onClick={(e) => { e.preventDefault(); setActiveView('landing'); }}
          className="flex items-center gap-2.5 text-[#F1EFEA] font-semibold text-[17px] tracking-tight whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          <span className="w-2 h-2 rounded-full bg-[#F1EFEA] inline-block shadow-[0_0_8px_rgba(241,239,234,0.6)]"></span>
          <span>Security Analyzires<sup className="text-[10px] ml-0.5 opacity-60">®</sup></span>
        </a>

        {/* Minimalist pill navigation links */}
        <nav className="flex items-center gap-2 sm:gap-3 text-xs sm:text-[13.5px] font-medium text-[#98968f]">
          <button
            onClick={() => {
              if (!isAuthenticated) {
                onOpenAuth('signin');
              } else {
                setActiveView('dashboard');
              }
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer px-3.5 py-1.5 rounded-full border ${
              activeView === 'dashboard' 
                ? 'border-[#F1EFEA] text-[#111110] bg-[#F1EFEA] font-medium shadow-[0_2px_10px_rgba(241,239,234,0.15)]' 
                : 'border-transparent text-[#98968f] hover:text-[#F1EFEA] hover:border-[rgba(241,239,234,0.16)]'
            }`}
          >
            {isAuthenticated ? <BookOpen className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-[#98968f]" />}
            <span>10-Module LMS</span>
          </button>

          <button
            onClick={() => setActiveView('landing')}
            className={`whitespace-nowrap shrink-0 transition-all cursor-pointer px-3.5 py-1.5 rounded-full border ${
              activeView === 'landing' 
                ? 'border-[#F1EFEA] text-[#111110] bg-[#F1EFEA] font-medium shadow-[0_2px_10px_rgba(241,239,234,0.15)]' 
                : 'border-transparent text-[#98968f] hover:text-[#F1EFEA] hover:border-[rgba(241,239,234,0.16)]'
            }`}
          >
            Overview
          </button>
          
          <button
            onClick={() => {
              if (!isAuthenticated) {
                onOpenAuth('signin');
              } else {
                setActiveView('assistant');
              }
            }}
            className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-all cursor-pointer px-3.5 py-1.5 rounded-full border ${
              activeView === 'assistant' 
                ? 'border-[#F1EFEA] text-[#111110] bg-[#F1EFEA] font-medium shadow-[0_2px_10px_rgba(241,239,234,0.15)]' 
                : 'border-transparent text-[#98968f] hover:text-[#F1EFEA] hover:border-[rgba(241,239,234,0.16)]'
            }`}
          >
            {isAuthenticated ? <Sparkles className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-[#98968f]" />}
            <span>Dual-AI Mentor</span>
          </button>

          {certificate && (
            <button
              onClick={onOpenCertificate}
              className="flex items-center gap-1.5 whitespace-nowrap shrink-0 text-emerald-400 hover:text-emerald-300 font-medium transition-colors cursor-pointer px-2"
            >
              <Award className="w-4 h-4" />
              <span>Certificate</span>
            </button>
          )}
        </nav>

        {/* Minimalist actions */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('dashboard')}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-[#F1EFEA] bg-[#1d1d1b] border border-[rgba(241,239,234,0.14)] rounded-full hover:border-[rgba(241,239,234,0.3)] transition-all cursor-pointer"
              >
                <span>Progress: {completedCount}/10 Labs</span>
              </button>

              <div className="flex items-center gap-2.5 pl-2 border-l border-[rgba(241,239,234,0.1)]">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"}
                  alt={user?.name || "Student"}
                  className="w-8 h-8 rounded-full border border-[rgba(241,239,234,0.2)] object-cover"
                />
                <button
                  onClick={signOut}
                  title="Sign Out"
                  className="p-1.5 text-[#98968f] hover:text-[#F1EFEA] transition-colors cursor-pointer rounded-full hover:bg-white/5"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('signin')}
                className="hidden sm:inline-block text-xs font-medium text-[#98968f] hover:text-[#F1EFEA] transition-colors cursor-pointer px-3 py-1.5"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 text-xs font-medium text-[#F1EFEA] border border-[rgba(241,239,234,0.24)] hover:bg-[#F1EFEA] hover:text-[#111110] rounded-full transition-all whitespace-nowrap shrink-0 cursor-pointer"
              >
                Enroll Free
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
