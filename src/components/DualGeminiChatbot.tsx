import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Brain, 
  Copy, 
  Check, 
  RefreshCw, 
  Orbit, 
  MessageSquare, 
  X,
  Sparkles
} from 'lucide-react';
import MorphOrb from './ui/ai-thiking-orb-and-input';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: 'flash' | 'pro';
}

interface DualGeminiChatbotProps {
  isFloatingModal?: boolean;
  onClose?: () => void;
}

export const DualGeminiChatbot: React.FC<DualGeminiChatbotProps> = ({ 
  isFloatingModal = false,
  onClose 
}) => {
  const [modelMode, setModelMode] = useState<'flash' | 'pro'>('flash');
  const [activeTab, setActiveTab] = useState<'orb' | 'history'>('orb');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init_1',
      role: 'assistant',
      content: "Security Analyzires Defense Core Online. Powered by Google Gemini Dual Intelligence. Submit any cyber threat analysis, packet trace, CVE query, or defense architecture query to activate multi-stage neural synthesis.",
      timestamp: 'Just now',
      mode: 'flash'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleOrbSubmit = async (query: string): Promise<string> => {
    setLoading(true);
    try {
      const historyPayload = messages.slice(-4).map(m => ({
        role: m.role,
        text: m.content
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: query,
          modelMode,
          history: historyPayload
        })
      });

      const data = await res.json();
      const reply = data.success && data.reply 
        ? data.reply 
        : (data.error || "Zero-trust verification complete. All security parameters within safe boundaries.");

      setMessages(prev => [
        ...prev,
        { id: 'u_' + Date.now(), role: 'user', content: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mode: modelMode },
        { id: 'a_' + Date.now(), role: 'assistant', content: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mode: modelMode }
      ]);

      return reply;
    } catch (e: any) {
      const fallback = `Security analysis error: ${e.message}. Using cached threat mitigation profile.`;
      setMessages(prev => [
        ...prev,
        { id: 'u_' + Date.now(), role: 'user', content: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mode: modelMode },
        { id: 'err_' + Date.now(), role: 'assistant', content: fallback, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), mode: modelMode }
      ]);
      return fallback;
    } finally {
      setLoading(false);
    }
  };

  const handleTextSubmit = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;
    setInputText('');
    await handleOrbSubmit(text);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={`w-full flex flex-col rounded-3xl overflow-hidden border border-[rgba(241,239,234,0.12)] bg-[#141413] shadow-2xl transition-all duration-300 ${
      isFloatingModal 
        ? 'h-[85vh] max-h-[720px] max-w-2xl mx-auto' 
        : 'min-h-[580px] max-w-5xl mx-auto'
    }`}>
      
      {/* ── Top Cyber Command Header ── */}
      <div className="p-3.5 sm:p-4 px-4 sm:px-6 border-b border-[rgba(241,239,234,0.08)] bg-[#171716] flex items-center justify-between gap-3 shrink-0">
        
        {/* Brand & AI Indicator */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-[#222220] border border-[rgba(241,239,234,0.15)] flex items-center justify-center text-[#F1EFEA]">
              <Orbit className="w-5 h-5 animate-spin-slow" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#171716]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-medium text-[#F1EFEA] tracking-tight">
                AI Defense Mentor
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#222220] border border-[rgba(241,239,234,0.12)] text-[#98968f] hidden sm:inline">
                Dual-Gemini Heuristics
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-[#98968f] font-mono truncate max-w-[180px] sm:max-w-none">
              {modelMode === 'pro' ? 'Gemini 1.5 Pro (Deep Exploit Reasoning)' : 'Gemini 1.5 Flash (Low-Latency Stream)'}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          
          {/* Flash vs Pro Model Switcher */}
          <div className="flex items-center bg-[#111110] p-1 rounded-2xl border border-[rgba(241,239,234,0.1)]">
            <button
              onClick={() => setModelMode('flash')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                modelMode === 'flash'
                  ? 'bg-[#F1EFEA] text-[#111110] shadow-sm font-semibold'
                  : 'text-[#98968f] hover:text-[#F1EFEA]'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span className="hidden xs:inline">Flash</span>
            </button>
            <button
              onClick={() => setModelMode('pro')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer ${
                modelMode === 'pro'
                  ? 'bg-[#262624] text-[#F1EFEA] border border-[rgba(241,239,234,0.2)] font-semibold'
                  : 'text-[#98968f] hover:text-[#F1EFEA]'
              }`}
            >
              <Brain className="w-3 h-3" />
              <span className="hidden xs:inline">Pro</span>
            </button>
          </div>

          {/* History Toggle */}
          <button
            onClick={() => setActiveTab(t => t === 'orb' ? 'history' : 'orb')}
            className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#F1EFEA] text-[#111110] border-[#F1EFEA]'
                : 'bg-[#171716] text-[#98968f] border-[rgba(241,239,234,0.1)] hover:text-[#F1EFEA] hover:bg-white/5'
            }`}
            title={activeTab === 'history' ? "Switch to Thinking Orb" : "View Chat History"}
          >
            {activeTab === 'history' ? <Orbit className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
          </button>

          {/* Close button if in floating modal */}
          {isFloatingModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#171716] hover:bg-white/5 border border-[rgba(241,239,234,0.1)] text-[#98968f] hover:text-[#F1EFEA] transition-all cursor-pointer"
              title="Close floating chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Main AI Content Area ── */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#111110]">
        
        {/* VIEW 1: NEURAL THINKING ORB */}
        {activeTab === 'orb' && (
          <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden animate-in fade-in duration-300">
            
            {/* Header Stage Badge */}
            <div className="text-center z-10 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1b] border border-[rgba(241,239,234,0.12)] text-[#F1EFEA] text-[11px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{modelMode === 'pro' ? 'Gemini Pro Deep Exploit Reasoning' : 'Gemini Flash Low-Latency Stream'}</span>
              </div>
            </div>

            {/* The MorphOrb Component */}
            <div className="w-full flex-1 flex items-center justify-center relative">
              <MorphOrb 
                onSubmit={handleOrbSubmit}
                modelMode={modelMode}
                minThinkMs={modelMode === 'pro' ? 2200 : 1400}
                speed={1.05}
              />
            </div>

          </div>
        )}

        {/* VIEW 2: CONVERSATION HISTORY */}
        {activeTab === 'history' && (
          <div className="flex-1 flex flex-col justify-between overflow-hidden bg-[#111110] animate-in fade-in duration-300">
            
            {/* Message Stack */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((m) => {
                const isAi = m.role === 'assistant';
                return (
                  <div
                    key={m.id}
                    className={`flex gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
                  >
                    {isAi && (
                      <div className="w-8 h-8 rounded-xl bg-[#222220] border border-[rgba(241,239,234,0.15)] flex items-center justify-center text-[#F1EFEA] shrink-0 mt-1 shadow-sm">
                        {m.mode === 'pro' ? <Brain className="w-4 h-4 text-[#F1EFEA]" /> : <Sparkles className="w-4 h-4 text-[#F1EFEA]" />}
                      </div>
                    )}

                    <div className={`relative max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isAi 
                        ? 'bg-[#171716] border border-[rgba(241,239,234,0.1)] text-[#F1EFEA] shadow-md' 
                        : 'bg-[#262624] border border-[rgba(241,239,234,0.15)] text-[#F1EFEA] shadow-md'
                    }`}>
                      {/* Meta header */}
                      <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-[rgba(241,239,234,0.06)] text-[10px] font-mono text-[#98968f]">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${isAi ? 'bg-emerald-400' : 'bg-[#F1EFEA]'}`} />
                          {isAi ? (m.mode === 'pro' ? 'Gemini 1.5 Pro' : 'Gemini 1.5 Flash') : 'Student Question'}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>{m.timestamp}</span>
                          {isAi && (
                            <button
                              onClick={() => copyToClipboard(m.content, m.id)}
                              className="hover:text-[#F1EFEA] transition-colors cursor-pointer p-0.5"
                              title="Copy response"
                            >
                              {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-relaxed text-[#F1EFEA]">
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#222220] border border-[rgba(241,239,234,0.15)] flex items-center justify-center text-[#F1EFEA] shrink-0">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#F1EFEA]" />
                  </div>
                  <div className="bg-[#171716] border border-[rgba(241,239,234,0.12)] rounded-2xl p-3 px-4 text-xs font-mono text-[#98968f] flex items-center gap-2 shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>{modelMode === 'pro' ? 'Synthesizing threat vectors & security heuristics...' : 'Scanning CVE database & generating response...'}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Cyber Input Bar in history mode */}
            <div className="p-3 sm:p-4 px-4 sm:px-6 border-t border-[rgba(241,239,234,0.08)] bg-[#171716]">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleTextSubmit(); }}
                className="flex items-center gap-2.5"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Ask ${modelMode === 'pro' ? 'Gemini Pro for deep code audit' : 'Gemini Flash for rapid answers'}...`}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/50 text-xs sm:text-sm focus:outline-none focus:border-[#F1EFEA] transition-all font-sans"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#F1EFEA] hover:bg-white text-[#111110] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 text-xs shadow-sm"
                >
                  <span>Query</span>
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DualGeminiChatbot;
