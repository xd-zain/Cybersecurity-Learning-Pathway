import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Award, 
  HelpCircle, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles,
  BookOpen,
  ChevronRight,
  Terminal,
  Key,
  ExternalLink,
  Check,
  Folder,
  FolderOpen,
  Layers,
  Video,
  ListOrdered
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from './ui/timeline';
import GlassFolder, { ArtPreset } from './ui/glass-folder-cards';
import { COURSE_MODULES, CourseModule, QuizQuestion } from '../data/curriculum';
import { useAuth } from '../context/AuthContext';
import { DualGeminiChatbot } from './DualGeminiChatbot';

interface StudentDashboardProps {
  onOpenCertificate: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenCertificate }) => {
  const { user, progress, submitModuleQuiz, toggle2FA } = useAuth();
  
  // Selected module state
  const [activeModuleId, setActiveModuleId] = useState<number>(1);
  const activeModule = COURSE_MODULES.find(m => m.id === activeModuleId) || COURSE_MODULES[0];
  const activeRecord = progress[activeModuleId];

  // Active sub-folder tier: "Beginner" | "Intermediate" | "Advanced"
  const [selectedTier, setSelectedTier] = useState<"Beginner" | "Intermediate" | "Advanced">(
    activeModule.level
  );

  // Curriculum view mode: "folders" (Interactive Dossier Folders) vs "timeline"
  const [navMode, setNavMode] = useState<'folders' | 'timeline'>('folders');

  // Sub-navigation tabs: 'lecture' | 'quiz' | 'assistant'
  const [activeTab, setActiveTab] = useState<'lecture' | 'quiz' | 'assistant'>('lecture');

  // Graded Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Group modules into the 3 tiers
  const beginnerModules = COURSE_MODULES.filter(m => m.level === 'Beginner');
  const intermediateModules = COURSE_MODULES.filter(m => m.level === 'Intermediate');
  const advancedModules = COURSE_MODULES.filter(m => m.level === 'Advanced');

  // Calculate overall metrics
  const completedCount = Object.values(progress).filter(p => p.completed).length;
  const progressPercent = Math.round((completedCount / COURSE_MODULES.length) * 100);

  const handleSelectModule = (id: number) => {
    setActiveModuleId(id);
    const mod = COURSE_MODULES.find(m => m.id === id);
    if (mod) setSelectedTier(mod.level);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setActiveTab('lecture');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    let correctCount = 0;
    activeModule.quiz.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / activeModule.quiz.length) * 100);
    setQuizScore(scorePercentage);
    setQuizSubmitted(true);

    await submitModuleQuiz(activeModule.id, scorePercentage);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Convert modules into GlassFolder file representations
  const getFolderFiles = (modules: CourseModule[]) => {
    return modules.map(m => {
      const isCompleted = progress[m.id]?.completed;
      const score = progress[m.id]?.score;
      const artName: ArtPreset = m.level === 'Beginner' ? 'ember' : m.level === 'Intermediate' ? 'aurora' : 'verdant';
      return {
        name: `0${m.id}. ${m.title}`,
        meta: `${m.duration} · ${isCompleted ? `Cleared (${score}%)` : 'Video & Lab'}`,
        art: artName
      };
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
      
      {/* ── Top Banner & Progress Summary ── */}
      <div className="p-6 md:p-8 mb-8 rounded-3xl bg-[#141413] border border-[rgba(241,239,234,0.1)] relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#98968f] mb-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F1EFEA]" />
              <span>Zero-Trust Cybersecurity Curriculum · Student Workspace</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-normal text-[#F1EFEA] tracking-tight">
              Welcome Back, <span className="font-serif italic font-normal">{user?.name || 'Defense Specialist'}</span>
            </h1>
            <p className="text-[#98968f] text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              10 structured project videos, hands-on lab environments, and verified assessments organized into Beginner, Intermediate, and Advanced dossiers.
            </p>
          </div>

          {/* Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="py-2.5 px-4 rounded-2xl bg-[#1c1c1b] border border-[rgba(241,239,234,0.12)] text-center">
              <div className="text-[11px] text-[#98968f] font-mono">Modules</div>
              <div className="text-lg font-medium text-[#F1EFEA] mt-0.5">{completedCount} / 10</div>
            </div>

            <div className="py-2.5 px-4 rounded-2xl bg-[#1c1c1b] border border-[rgba(241,239,234,0.12)] text-center">
              <div className="text-[11px] text-[#98968f] font-mono">Progress</div>
              <div className="text-lg font-medium text-[#F1EFEA] mt-0.5">{progressPercent}%</div>
            </div>

            {completedCount === 10 ? (
              <button
                onClick={onOpenCertificate}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#F1EFEA] text-[#111110] font-medium text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg"
              >
                <Award className="w-4 h-4 text-[#111110]" />
                <span>View Certificate</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('assistant')}
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-[#232321] hover:bg-[#2c2c29] text-[#F1EFEA] border border-[rgba(241,239,234,0.16)] font-medium text-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Ask AI Mentor</span>
              </button>
            )}
          </div>
        </div>

        {/* Minimal Progress Bar */}
        <div className="relative z-10 w-full mt-6 bg-[rgba(241,239,234,0.06)] h-1.5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* ── Main Workspace: 2-Column Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ── Left Column: Course Dossiers & Navigation (4 cols) ── */}
        <div className="lg:col-span-4 space-y-5">
          
          <div className="p-5 rounded-3xl bg-[#141413] border border-[rgba(241,239,234,0.1)] shadow-xl">
            
            {/* Header with Mode Switcher (Dossier Folders vs Timeline) */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[rgba(241,239,234,0.08)]">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-medium text-[#F1EFEA] uppercase tracking-wider">
                  Course Dossiers
                </span>
              </div>

              {/* View Switcher Toggle */}
              <div className="flex items-center bg-[#1d1d1b] p-0.5 rounded-xl border border-white/5 text-[11px] font-mono">
                <button
                  onClick={() => setNavMode('folders')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    navMode === 'folders' 
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold' 
                      : 'text-[#98968f] hover:text-[#F1EFEA]'
                  }`}
                >
                  Folders
                </button>
                <button
                  onClick={() => setNavMode('timeline')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    navMode === 'timeline' 
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold' 
                      : 'text-[#98968f] hover:text-[#F1EFEA]'
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>

            {/* ── FOLDERS MODE: 3 Sub-Folders (Beginner, Intermediate, Advanced) ── */}
            {navMode === 'folders' && (
              <div className="space-y-5">
                
                {/* 1. Interactive Glass Folder Dossier (Same Look & Feel as Landing Page) */}
                <div className="py-2 flex flex-col items-center justify-center">
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>Active Folder: {selectedTier} Dossier</span>
                  </div>
                  
                  <GlassFolder
                    label={`${selectedTier} Dossier`}
                    meta={`${selectedTier === 'Beginner' ? 3 : selectedTier === 'Intermediate' ? 4 : 3} Project Videos`}
                    art={selectedTier === 'Beginner' ? 'ember' : selectedTier === 'Intermediate' ? 'aurora' : 'verdant'}
                    seed={selectedTier === 'Beginner' ? 14 : selectedTier === 'Intermediate' ? 42 : 88}
                    files={getFolderFiles(
                      selectedTier === 'Beginner' 
                        ? beginnerModules 
                        : selectedTier === 'Intermediate' 
                        ? intermediateModules 
                        : advancedModules
                    )}
                    onFileSelect={(_, idx) => {
                      const list = selectedTier === 'Beginner' 
                        ? beginnerModules 
                        : selectedTier === 'Intermediate' 
                        ? intermediateModules 
                        : advancedModules;
                      handleSelectModule(list[idx].id);
                    }}
                    width={320}
                  />
                  
                  <p className="text-[10px] text-[#98968f] text-center mt-3 font-mono">
                    Click folder cover or any enclosed sheet to open video
                  </p>
                </div>

                {/* 2. Three Sub-Folders Navigation Cards (Beginner, Intermediate, Advanced) */}
                <div className="space-y-2 pt-2 border-t border-[rgba(241,239,234,0.08)]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#98968f] px-1 mb-1">
                    <span className="uppercase tracking-wider">Curriculum Sub-Folders</span>
                    <span>3 Categories</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((tier) => {
                      const isSelected = selectedTier === tier;
                      const tierModules = COURSE_MODULES.filter(m => m.level === tier);
                      const clearedInTier = tierModules.filter(m => progress[m.id]?.completed).length;
                      const allCleared = clearedInTier === tierModules.length && tierModules.length > 0;

                      return (
                        <button
                          key={tier}
                          onClick={() => {
                            setSelectedTier(tier);
                            // Auto-select first video in that tier if current active video is outside this tier
                            const currentInTier = tierModules.find(m => m.id === activeModuleId);
                            if (!currentInTier && tierModules[0]) {
                              handleSelectModule(tierModules[0].id);
                            }
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-[#1e1e1c] border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.18)] ring-1 ring-cyan-400/30'
                              : 'bg-[#151514] border-[rgba(241,239,234,0.07)] hover:bg-[#1a1a19] hover:border-[rgba(241,239,234,0.16)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                                : 'bg-[#20201e] border-white/5 text-[#98968f]'
                            }`}>
                              {isSelected ? (
                                <FolderOpen className="w-4 h-4 text-cyan-300" />
                              ) : (
                                <Folder className="w-4 h-4 text-[#98968f]" />
                              )}
                            </div>

                            <div className="truncate">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold ${isSelected ? 'text-[#F1EFEA]' : 'text-[#F1EFEA]/80'}`}>
                                  {tier} Folder
                                </span>
                                {allCleared && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                    Cleared ✓
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono text-[#98968f] mt-0.5">
                                {tier === 'Beginner' ? 'Modules 01–03 · Foundations' : tier === 'Intermediate' ? 'Modules 04–07 · Defense Labs' : 'Modules 08–10 · Zero-Trust & Cloud'}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span className={`text-xs font-mono font-medium ${isSelected ? 'text-cyan-300' : 'text-[#98968f]'}`}>
                              {clearedInTier}/{tierModules.length}
                            </span>
                            <span className="text-[9px] font-mono text-[#98968f]/60">
                              Videos
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Project Videos inside Selected Sub-Folder */}
                <div className="pt-3 border-t border-[rgba(241,239,234,0.08)]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#98968f] mb-2 px-1">
                    <span className="uppercase tracking-wider text-cyan-400">
                      {selectedTier} Project Videos
                    </span>
                    <span>Click to Play</span>
                  </div>

                  <div className="space-y-2">
                    {(selectedTier === 'Beginner' ? beginnerModules : selectedTier === 'Intermediate' ? intermediateModules : advancedModules).map((m) => {
                      const isCurrent = m.id === activeModuleId;
                      const isPassed = progress[m.id]?.completed;
                      const score = progress[m.id]?.score;

                      return (
                        <div
                          key={m.id}
                          onClick={() => handleSelectModule(m.id)}
                          className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${
                            isCurrent
                              ? 'bg-[#222220] border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/30'
                              : isPassed
                              ? 'bg-[#181817] border-emerald-500/20 hover:bg-[#1d1d1c]'
                              : 'bg-[#171716] border-[rgba(241,239,234,0.06)] hover:bg-[#1e1e1d]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                              isPassed 
                                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                                : isCurrent 
                                ? 'bg-cyan-400 text-slate-950 font-bold'
                                : 'bg-[#242422] text-[#98968f]'
                            }`}>
                              {isPassed ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : `0${m.id}`}
                            </div>

                            <div className="truncate">
                              <h4 className={`text-xs font-medium truncate ${isCurrent ? 'text-[#F1EFEA]' : 'text-[#F1EFEA]/80'}`}>
                                {m.title}
                              </h4>
                              <div className="flex items-center gap-2 text-[10px] font-mono text-[#98968f] mt-0.5">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {m.duration}
                                </span>
                                {score !== undefined && (
                                  <span className={isPassed ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                                    · Assessment: {score}%
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-1.5">
                            {isCurrent && (
                              <span className="text-[10px] font-mono text-cyan-300 hidden sm:inline">
                                Playing
                              </span>
                            )}
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                              isCurrent ? 'bg-cyan-400 text-slate-950 shadow-md' : 'bg-white/5 text-[#98968f] hover:text-white'
                            }`}>
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {/* ── TIMELINE MODE: Full Chronological 10-Module Roadmap ── */}
            {navMode === 'timeline' && (
              <div className="max-h-[620px] overflow-y-auto pr-2 pl-6 py-2 scrollbar-thin">
                <Timeline
                  orientation="vertical"
                  value={activeModuleId}
                  onValueChange={handleSelectModule}
                  className="w-full"
                >
                  {COURSE_MODULES.map((m) => {
                    const rec = progress[m.id];
                    const isPassed = rec?.completed;
                    const isCurrent = m.id === activeModuleId;

                    return (
                      <TimelineItem
                        key={m.id}
                        step={m.id}
                        onClick={() => handleSelectModule(m.id)}
                        className={cn(
                          "cursor-pointer group/item p-3.5 rounded-xl transition-all duration-200 border relative",
                          isCurrent
                            ? "bg-[#21211f] border-cyan-400/40 shadow-[0_0_18px_rgba(6,182,212,0.12)] ring-1 ring-cyan-400/30"
                            : isPassed
                            ? "bg-[#181817] border-emerald-500/20 hover:bg-[#1f1f1d] hover:border-emerald-500/40"
                            : "bg-[#161615] border-[rgba(241,239,234,0.05)] hover:bg-[#1c1c1b] hover:border-[rgba(241,239,234,0.14)]"
                        )}
                      >
                        <TimelineIndicator
                          className={cn(
                            "flex items-center justify-center font-mono text-[10px] font-bold cursor-pointer transition-all duration-300",
                            isPassed
                              ? "!border-emerald-400 !bg-emerald-500 !text-slate-950 font-bold shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                              : isCurrent
                              ? "!border-cyan-400 !bg-cyan-400 !text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                              : "!border-[rgba(241,239,234,0.2)] !bg-[#181817] !text-[#98968f]"
                          )}
                        >
                          {isPassed ? (
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          ) : (
                            <span>{m.id}</span>
                          )}
                        </TimelineIndicator>

                        <TimelineSeparator
                          className={cn(
                            "transition-colors duration-300",
                            isPassed ? "!bg-emerald-500/40" : "!bg-[rgba(241,239,234,0.12)]"
                          )}
                        />

                        <TimelineHeader className="flex items-center justify-between gap-2">
                          <TimelineDate className="text-[#98968f] font-mono text-[11px] uppercase tracking-wider mb-0 flex items-center gap-1.5">
                            <span className="text-[#F1EFEA] font-medium">Module 0{m.id}</span>
                            <span className="opacity-40">·</span>
                            <span>{m.duration}</span>
                          </TimelineDate>
                          <span
                            className={cn(
                              "text-[10px] font-mono px-2 py-0.5 rounded-full border shrink-0 transition-colors",
                              m.level === 'Advanced'
                                ? "bg-purple-950/40 border-purple-500/30 text-purple-300"
                                : m.level === 'Intermediate'
                                ? "bg-blue-950/40 border-blue-500/30 text-blue-300"
                                : "bg-[rgba(241,239,234,0.06)] border-[rgba(241,239,234,0.14)] text-[#F1EFEA]"
                            )}
                          >
                            {m.level}
                          </span>
                        </TimelineHeader>

                        <TimelineTitle
                          className={cn(
                            "text-xs md:text-sm font-medium tracking-tight transition-colors line-clamp-1 mt-1",
                            isCurrent ? "text-cyan-300 font-semibold" : "text-[#F1EFEA]/90 group-hover/item:text-[#F1EFEA]"
                          )}
                        >
                          {m.title}
                        </TimelineTitle>

                        <TimelineContent className="text-[11px] text-[#98968f] leading-relaxed mt-1 line-clamp-2">
                          {m.summary}
                        </TimelineContent>
                      </TimelineItem>
                    );
                  })}
                </Timeline>
              </div>
            )}

          </div>

          {/* Quick Security 2FA Toggle Card */}
          <div className="p-5 rounded-3xl bg-[#141413] border border-[rgba(241,239,234,0.1)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#F1EFEA] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Two-Factor Auth (2FA)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user?.twoFactorEnabled || false}
                  onChange={(e) => toggle2FA(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-[#262624] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#F1EFEA] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-[#111110]"></div>
              </label>
            </div>
            <p className="text-[11px] text-[#98968f] leading-relaxed">
              When enabled, a one-time 6-digit OTP code is emailed on every login sequence.
            </p>
          </div>

        </div>

        {/* ── Right Column: Project Video Player, Graded Lab & Quiz (8 cols) ── */}
        <div className="lg:col-span-8">
          
          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-2 pb-4 border-b border-[rgba(241,239,234,0.08)] mb-6">
            <button
              onClick={() => setActiveTab('lecture')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                activeTab === 'lecture'
                  ? 'bg-[#F1EFEA] text-[#111110] border-transparent shadow-md'
                  : 'text-[#98968f] hover:text-[#F1EFEA] border-[rgba(241,239,234,0.1)]'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Project Video</span>
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                activeTab === 'quiz'
                  ? 'bg-[#F1EFEA] text-[#111110] border-transparent shadow-md'
                  : 'text-[#98968f] hover:text-[#F1EFEA] border-[rgba(241,239,234,0.1)]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Graded Assessment ({activeRecord?.completed ? 'Passed ✓' : 'Pending'})</span>
            </button>

            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                activeTab === 'assistant'
                  ? 'bg-[#F1EFEA] text-[#111110] border-transparent shadow-md'
                  : 'text-[#98968f] hover:text-[#F1EFEA] border-[rgba(241,239,234,0.1)]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Defense Tutor</span>
            </button>
          </div>

          {/* TAB 1: PROJECT VIDEO & LECTURE */}
          {activeTab === 'lecture' && (
            <div className="space-y-6">
              {/* YouTube Video Player Embed */}
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-[rgba(241,239,234,0.12)] shadow-2xl bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeModule.youtubeId}?rel=0&modestbranding=1`}
                  title={activeModule.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Module Metadata and Key Takeaways */}
              <div className="p-6 md:p-8 rounded-3xl bg-[#141413] border border-[rgba(241,239,234,0.1)]">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
                      {activeModule.level} Tier Dossier · Module 0{activeModule.id}
                    </span>
                    <h2 className="text-xl md:text-2xl font-normal text-[#F1EFEA] tracking-tight mt-1">
                      {activeModule.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#F1EFEA] px-3 py-1 rounded-full bg-[#222220] border border-[rgba(241,239,234,0.14)]">
                      {activeModule.level}
                    </span>
                    <span className="text-xs font-mono text-[#98968f]">
                      {activeModule.duration}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#98968f] leading-relaxed mb-6">
                  {activeModule.summary}
                </p>

                {/* Key Concepts Grid */}
                <div className="mb-6">
                  <h3 className="text-xs font-mono uppercase text-[#98968f] tracking-wider mb-3">
                    Curriculum Core Concepts
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {activeModule.keyConcepts.map((concept, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#1b1b1a] border border-[rgba(241,239,234,0.06)] text-xs text-[#F1EFEA]">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{concept}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hands-on Lab Overview */}
                <div className="p-4.5 rounded-2xl bg-[#1a1a19] border border-[rgba(241,239,234,0.1)]">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#F1EFEA] mb-1">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Hands-On Practical Lab Assignment</span>
                  </div>
                  <p className="text-xs text-[#98968f] leading-relaxed">
                    {activeModule.handsOnLab}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[rgba(241,239,234,0.08)]">
                  <span className="text-xs text-[#98968f]">
                    Finished the project video? Verify your understanding with the graded lab quiz.
                  </span>
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.35)]"
                  >
                    <span>Launch Graded Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GRADED QUIZ & ASSESSMENT */}
          {activeTab === 'quiz' && (
            <div className="p-6 md:p-8 rounded-3xl bg-[#141413] border border-[rgba(241,239,234,0.1)] space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[rgba(241,239,234,0.08)]">
                <div>
                  <h2 className="text-lg font-normal text-[#F1EFEA] tracking-tight">
                    Module 0{activeModule.id} Graded Assessment
                  </h2>
                  <p className="text-xs text-[#98968f] mt-0.5 font-serif italic">
                    Passing standard: 75% or higher (3 of 4 questions correct).
                  </p>
                </div>

                {activeRecord?.score !== undefined && (
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-[#98968f]">Best Score:</span>
                    <span className={activeRecord.completed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {activeRecord.score}% {activeRecord.completed && '✓ Passed'}
                    </span>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeModule.quiz.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = isAnswered && userAnswer === q.correctAnswer;
                  const showExplanation = quizSubmitted;

                  return (
                    <div 
                      key={q.id}
                      className="p-5 rounded-2xl bg-[#191918] border border-[rgba(241,239,234,0.06)] space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#262624] text-[#F1EFEA] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <h3 className="text-sm font-medium text-[#F1EFEA] leading-relaxed">
                          {q.question}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-2 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isOptionSelected = userAnswer === optIdx;
                          let optionClasses = "bg-[#141413] border-[rgba(241,239,234,0.08)] text-[#98968f] hover:text-[#F1EFEA] hover:bg-[#1e1e1d]";

                          if (quizSubmitted) {
                            if (optIdx === q.correctAnswer) {
                              optionClasses = "bg-emerald-950/40 border-emerald-500/50 text-emerald-200";
                            } else if (isOptionSelected) {
                              optionClasses = "bg-rose-950/40 border-rose-500/50 text-rose-200";
                            }
                          } else if (isOptionSelected) {
                            optionClasses = "bg-[#252523] border-cyan-400 text-cyan-200 shadow-sm";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleAnswerSelect(q.id, optIdx)}
                              disabled={quizSubmitted}
                              className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${optionClasses}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correctAnswer && (
                                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation box */}
                      {showExplanation && (
                        <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed ${
                          isCorrect ? 'bg-emerald-950/30 border border-emerald-800/40 text-emerald-300' : 'bg-rose-950/30 border border-rose-800/40 text-rose-300'
                        }`}>
                          <span className="font-semibold">{isCorrect ? '✓ Correct! ' : '✗ Incorrect. '}</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Assessment Submit / Results Footer */}
              <div className="pt-4 border-t border-[rgba(241,239,234,0.08)] flex flex-wrap items-center justify-between gap-4">
                {quizSubmitted ? (
                  <div className="flex items-center gap-4">
                    <div className="p-3 px-5 rounded-2xl bg-[#1d1d1b] border border-[rgba(241,239,234,0.1)]">
                      <span className="text-xs text-[#98968f]">Score: </span>
                      <span className={`text-base font-bold font-mono ${quizScore! >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {quizScore}% {quizScore! >= 75 ? '· Passed!' : '· Failed (Need 75%)'}
                      </span>
                    </div>

                    <button
                      onClick={handleRetakeQuiz}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-[rgba(241,239,234,0.18)] hover:bg-white/5 text-[#F1EFEA] text-xs font-medium cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Assessment</span>
                    </button>

                    {activeModule.id < 10 && quizScore! >= 75 && (
                      <button
                        onClick={() => handleSelectModule(activeModule.id + 1)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-cyan-400 text-slate-950 text-xs font-bold cursor-pointer shadow-md hover:bg-cyan-300"
                      >
                        <span>Next Module</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs text-[#98968f]">
                      Answered {Object.keys(selectedAnswers).length} of {activeModule.quiz.length} questions
                    </span>
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(selectedAnswers).length < activeModule.quiz.length}
                      className="px-6 py-2.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Submit for Grading
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DUAL-GEMINI CHATBOT (Default in Orb mode) */}
          {activeTab === 'assistant' && (
            <div className="space-y-4">
              <DualGeminiChatbot />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
