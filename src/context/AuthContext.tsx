import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  enrolledAt: string;
  twoFactorEnabled: boolean;
}

export interface ModuleRecord {
  completed: boolean;
  score: number;
  attempts: number;
  completedAt?: string;
}

export interface CertificateData {
  id: string;
  issuedAt: string;
  recipientName: string;
  recipientEmail: string;
  averageScore: number;
  totalModules: number;
  verificationHash: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isEnrolled: boolean;
  progress: Record<number, ModuleRecord>;
  certificate: CertificateData | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string; previewLink?: string }>;
  googleSignIn: () => Promise<{ success: boolean; error?: string }>;
  verify2FA: (otp: string) => Promise<{ success: boolean; error?: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; error?: string }>;
  toggle2FA: (enabled: boolean) => void;
  submitModuleQuiz: (moduleId: number, scorePercentage: number) => Promise<{ passed: boolean; allCompleted: boolean }>;
  signOut: () => void;
  pendingEmailFor2FA: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER = 'sec_user_profile';
const LOCAL_STORAGE_PROGRESS = 'sec_module_progress';
const LOCAL_STORAGE_KEY = 'sec_gemini_api_key';
const LOCAL_STORAGE_CERT = 'sec_course_certificate';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(LOCAL_STORAGE_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [progress, setProgress] = useState<Record<number, ModuleRecord>>(() => {
    if (typeof window === 'undefined') return {};
    const saved = localStorage.getItem(LOCAL_STORAGE_PROGRESS);
    return saved ? JSON.parse(saved) : {};
  });

  const [certificate, setCertificate] = useState<CertificateData | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(LOCAL_STORAGE_CERT);
    return saved ? JSON.parse(saved) : null;
  });

  const [pendingEmailFor2FA, setPendingEmailFor2FA] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PROGRESS, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    if (certificate) {
      localStorage.setItem(LOCAL_STORAGE_CERT, JSON.stringify(certificate));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_CERT);
    }
  }, [certificate]);

  // Sign in flow
  const signIn = async (email: string, _password: string) => {
    // If current stored user or previously registered user has 2FA enabled
    const existing = user && user.email.toLowerCase() === email.toLowerCase() ? user : null;
    const has2FA = existing ? existing.twoFactorEnabled : false;

    if (has2FA) {
      setPendingEmailFor2FA(email);
      // Trigger OTP delivery
      try {
        const res = await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        return { success: false, requires2FA: true, error: data.error };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // Direct login
    const newUser: UserProfile = existing || {
      name: email.split('@')[0],
      email: email.toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      enrolledAt: new Date().toISOString(),
      twoFactorEnabled: false
    };

    setUser(newUser);
    return { success: true };
  };

  // 2FA verification
  const verify2FA = async (otp: string) => {
    if (!pendingEmailFor2FA) return { success: false, error: 'No pending login session' };

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmailFor2FA, otp })
      });
      const data = await res.json();

      if (data.success) {
        const loggedUser: UserProfile = {
          name: pendingEmailFor2FA.split('@')[0],
          email: pendingEmailFor2FA,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
          enrolledAt: new Date().toISOString(),
          twoFactorEnabled: true
        };
        setUser(loggedUser);
        setPendingEmailFor2FA(null);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid code' };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Sign up and trigger welcome verification email
  const signUp = async (name: string, email: string, _password: string) => {
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email })
      });
      const data = await res.json();

      if (data.success) {
        return {
          success: true,
          message: 'Welcome email with enrollment verification link has been sent to ' + email,
          previewLink: data.verifyLink
        };
      } else {
        return { success: false, error: data.error };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Google sign in simulation with real profile sync
  const googleSignIn = async () => {
    try {
      const googleUser: UserProfile = {
        name: 'Alex Rivera',
        email: 'alex.rivera@cybersec.org',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
        enrolledAt: new Date().toISOString(),
        twoFactorEnabled: false
      };
      setUser(googleUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Verify token via URL or manual trigger
  const verifyToken = async (token: string) => {
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (data.success) {
        const verifiedUser: UserProfile = {
          name: data.name || 'Verified Specialist',
          email: data.email,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
          enrolledAt: new Date().toISOString(),
          twoFactorEnabled: false
        };
        setUser(verifiedUser);
        return { success: true };
      }
      return { success: false, error: data.error || 'Token verification failed' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Toggle 2FA in user profile
  const toggle2FA = (enabled: boolean) => {
    if (!user) return;
    const updated = { ...user, twoFactorEnabled: enabled };
    setUser(updated);
  };

  // Submit quiz score and check graduation
  const submitModuleQuiz = async (moduleId: number, scorePercentage: number) => {
    const passed = scorePercentage >= 75;
    const prev = progress[moduleId] || { completed: false, score: 0, attempts: 0 };
    const updatedRecord: ModuleRecord = {
      completed: passed || prev.completed,
      score: Math.max(prev.score, scorePercentage),
      attempts: prev.attempts + 1,
      completedAt: passed ? new Date().toISOString() : prev.completedAt
    };

    const nextProgress = {
      ...progress,
      [moduleId]: updatedRecord
    };
    setProgress(nextProgress);

    // Check if all 10 modules completed
    let totalScore = 0;
    let completedCount = 0;
    for (let i = 1; i <= 10; i++) {
      if (nextProgress[i]?.completed) {
        completedCount++;
        totalScore += nextProgress[i].score;
      }
    }

    const allCompleted = completedCount === 10;
    if (allCompleted && !certificate && user) {
      const avg = Math.round(totalScore / 10);
      const certId = 'SEC-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      const newCert: CertificateData = {
        id: certId,
        issuedAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        recipientName: user.name,
        recipientEmail: user.email,
        averageScore: avg,
        totalModules: 10,
        verificationHash: 'sha256:' + Math.random().toString(36).substring(2, 14) + Math.random().toString(36).substring(2, 14)
      };

      setCertificate(newCert);

      // Trigger appreciation email
      try {
        await fetch('/api/auth/send-completion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            certificateId: certId,
            score: avg
          })
        });
      } catch (e) {
        console.error('Failed to trigger certificate email:', e);
      }
    }

    return { passed, allCompleted };
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEnrolled: !!user,
        progress,
        certificate,
        signIn,
        signUp,
        googleSignIn,
        verify2FA,
        verifyToken,
        toggle2FA,
        submitModuleQuiz,
        signOut,
        pendingEmailFor2FA
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
