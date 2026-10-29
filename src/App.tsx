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
import { CheckCircle2, AlertCircle, X, Lock } from 'lucide-react';

const MainApp: React.FC = () => {
  const { 
    isAuthenticated, 
    user, 
    signIn, 
    signUp, 
    forgotPassword,
    resetPassword,
    verify2FA, 
    verifyToken,
    certificate 
  } = useAuth();

  // Default to landing page for visitors; only allow dashboard/assistant if authenticated
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'assistant'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'landing') return 'landing';
    }
    return 'landing';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [initialResetToken, setInitialResetToken] = useState<string>('');
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

  // 2. Handle URL email verification link (?verifyToken=...) and password reset link (?resetToken=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const verifyTok = params.get('verifyToken');
    if (verifyTok) {
      verifyToken(verifyTok).then((res) => {
        if (res.success) {
          setToastMessage('🎉 Email identity successfully verified! Your enrollment in Security Analyzires is active.');
          setActiveView('dashboard');
          window.history.replaceState({}, document.title, window.location.pathname);
        } else {
          setToastMessage(`⚠️ Verification error: ${res.error}`);
        }
      });
    }

    const resetTok = params.get('resetToken');
    if (resetTok) {
      setInitialResetToken(resetTok);
      setAuthMode('reset');
      setAuthModalOpen(true);
      setToastMessage('🔑 Password reset link verified. Enter your new password below.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // 3. Strict Auth Protection: visitors must be signed in/enrolled to access modules or AI mentor
  useEffect(() => {
    if (!isAuthenticated && (activeView === 'dashboard' || activeView === 'assistant')) {
      setActiveView('landing');
      setToastMessage('Enrollment required: Sign in or register to access the full curriculum and AI Defense Mentor.');
      handleOpenAuth('signin');
    }
  }, [isAuthenticated, activeView]);

  // If user signs in while on landing, smoothly transition them to their enrolled dashboard
  useEffect(() => {
    if (isAuthenticated && activeView === 'landing') {
      setActiveView('dashboard');
      setAuthModalOpen(false);
    }
  }, [isAuthenticated]);

  const handleOpenAuth = (mode: 'signin' | 'signup' | 'forgot' | 'reset' = 'signin') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleViewChange = (view: 'landing' | 'dashboard' | 'assistant') => {
    if ((view === 'dashboard' || view === 'assistant') && !isAuthenticated) {
      setToastMessage('Enrollment required: Sign in or register to access the 10-module curriculum and AI Mentor.');
      handleOpenAuth('signin');
      return;
    }
    setActiveView(view);
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

  const handleForgotPasswordAction = async (email: string) => {
    const res = await forgotPassword(email);
    if (res.success) {
      setToastMessage(res.message || `Password reset instructions sent to ${email}`);
    }
    return res;
  };

  const handleResetPasswordAction = async (tokenOrCode: string, newPass: string) => {
    const res = await resetPassword(tokenOrCode, newPass);
    if (res.success) {
      setToastMessage('🎉 Password successfully updated! Please sign in with your new password.');
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
    <div className="min-h-screen bg-[#111110] text-[#F1EFEA] flex flex-col font-sans selection:bg-[#F1EFEA] selection:text-[#111110]">
      
      {/* Toast Notification Banner matching dark luxury palette */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[999] max-w-md p-4 rounded-2xl bg-[#171716]/95 border border-[rgba(241,239,234,0.18)] text-[#F1EFEA] text-xs shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-relaxed">{toastMessage}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-[#98968f] hover:text-[#F1EFEA] p-1 rounded-full hover:bg-white/5 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Primary Navigation Bar */}
      <Navbar
        onOpenAuth={handleOpenAuth}
        activeView={activeView}
        setActiveView={handleViewChange}
        onOpenCertificate={() => setCertModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            onEnrollClick={() => handleOpenAuth('signup')}
            onExploreModules={() => {
              handleViewChange('dashboard');
            }}
          />
        )}

        {activeView === 'dashboard' && isAuthenticated && (
          <StudentDashboard onOpenCertificate={() => setCertModalOpen(true)} />
        )}

        {activeView === 'assistant' && isAuthenticated && (
          <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-8">
            <DualGeminiChatbot />
          </div>
        )}
      </main>

      {/* Authentication Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md">
            <SignIn1
              defaultMode={authMode}
              initialResetCode={initialResetToken}
              onSignIn={handleSignInAction}
              onSignUp={handleSignUpAction}
              onForgotPassword={handleForgotPasswordAction}
              onResetPassword={handleResetPasswordAction}
              onVerify2FA={handleVerify2FAAction}
              onClose={() => {
                setAuthModalOpen(false);
                setInitialResetToken('');
              }}
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
      <FloatingChatbot onOpenAuth={handleOpenAuth} />
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
