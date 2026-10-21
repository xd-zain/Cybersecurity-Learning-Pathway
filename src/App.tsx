import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { DualGeminiChatbot } from './components/DualGeminiChatbot';
import { CertificateModal } from './components/CertificateModal';
import { SignIn1 } from './components/ui/modern-stunning-sign-in';
import { FloatingChatbot } from './components/FloatingChatbot';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    isAuthenticated, 
    user, 
    signIn, 
    signUp, 
    googleSignIn, 
    verify2FA, 
    verifyToken,
    certificate 
  } = useAuth();

  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'assistant'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'landing' || v === 'assistant' || v === 'dashboard') return v;
    }
    return 'dashboard';
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [certModalOpen, setCertModalOpen] = useState(false);

  // Notification banners (e.g. email verified successfully)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // 2. Handle URL email verification link (?verifyToken=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get('verifyToken');
    if (token) {
      verifyToken(token).then((res) => {
        if (res.success) {
          setToastMessage('🎉 Email identity successfully verified! Your enrollment in Security Analyzires is active.');
          setActiveView('dashboard');
          // Clean URL params
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setToastMessage(`⚠️ Verification error: ${res.error}`);
        }
      });
    }
  }, []);

  // If user signs in, smoothly transition them to dashboard if they were on landing
  useEffect(() => {
    if (isAuthenticated && activeView === 'landing') {
      setActiveView('dashboard');
      setAuthModalOpen(false);
    }
  }, [isAuthenticated]);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignInAction = async (email: string, pass: string) => {
    const res = await signIn(email, pass);
    if (res.success) {
      setAuthModalOpen(false);
      setActiveView('dashboard');
    }
    return res;
  };

  const handleSignUpAction = async (name: string, email: string, pass: string) => {
    const res = await signUp(name, email, pass);
    if (res.success) {
      setToastMessage(`Verification link emailed to ${email}. Check your inbox to finalize enrollment.`);
    }
    return res;
  };

  const handleGoogleAction = async () => {
    const res = await googleSignIn();
    if (res.success) {
      setAuthModalOpen(false);
      setActiveView('dashboard');
    }
    return res;
  };

  const handleVerify2FAAction = async (otp: string) => {
    const res = await verify2FA(otp);
    if (res.success) {
      setAuthModalOpen(false);
      setActiveView('dashboard');
    }
    return res;
  };

  return (
    <div className="min-h-screen bg-[#05070d] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-[999] max-w-md p-4 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-cyan-400 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Navigation Bar adhering to Top Bar Contract */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenCertificate={() => setCertModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onEnrollClick={() => handleOpenAuth('signup')}
            onExploreModules={() => {
              setActiveView('dashboard');
            }}
          />
        )}

        {activeView === 'dashboard' && (
          <StudentDashboard onOpenCertificate={() => setCertModalOpen(true)} />
        )}

        {activeView === 'assistant' && (
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
            <DualGeminiChatbot />
          </div>
        )}
      </main>

      {/* Authentication Modal using modern-stunning-sign-in component */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md">
            <SignIn1
              defaultMode={authMode}
              onSignIn={handleSignInAction}
              onSignUp={handleSignUpAction}
              onGoogleSignIn={handleGoogleAction}
              onVerify2FA={handleVerify2FAAction}
              onClose={() => setAuthModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Course Completion Certificate Modal */}
      {certModalOpen && certificate && (
        <CertificateModal
          certificate={certificate}
          onClose={() => setCertModalOpen(false)}
        />
      )}

      {/* Floating Chat Icon & Neural Thinking Orb Launcher */}
      <FloatingChatbot />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
