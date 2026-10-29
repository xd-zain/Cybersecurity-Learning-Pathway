import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string; resetCode?: string }>;
  resetPassword: (tokenOrCode: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  verify2FA: (otp: string) => Promise<{ success: boolean; error?: string }>;
  verifyToken: (token: string) => Promise<{ success: boolean; error?: string }>;
  toggle2FA: (enabled: boolean) => void;
  submitModuleQuiz: (moduleId: number, scorePercentage: number) => Promise<{ passed: boolean; allCompleted: boolean }>;
  signOut: () => void;
  pendingEmailFor2FA: string | null;
  isSupabaseActive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER = 'sec_user_profile';
const LOCAL_STORAGE_PROGRESS = 'sec_module_progress';
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
  const [isSupabaseActive, setIsSupabaseActive] = useState<boolean>(isSupabaseConfigured());

  // Check Supabase session on boot if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      setIsSupabaseActive(true);
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user && !user) {
          const profile: UserProfile = {
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Specialist',
            email: session.user.email || '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
            enrolledAt: session.user.created_at || new Date().toISOString(),
            twoFactorEnabled: false
          };
          setUser(profile);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const profile: UserProfile = {
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Specialist',
            email: session.user.email || '',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
            enrolledAt: session.user.created_at || new Date().toISOString(),
            twoFactorEnabled: false
          };
          setUser(profile);
        } else if (!session && isSupabaseConfigured()) {
          // Keep user if logged in via custom auth or clear
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

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

  // Strict email & password login (NO Google sign in)
  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Please enter both your email address and password.' };
    }

    // 1. If Supabase is configured, use Supabase Auth
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          const supaUser: UserProfile = {
            name: data.user.user_metadata?.full_name || cleanEmail.split('@')[0],
            email: data.user.email || cleanEmail,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
            enrolledAt: data.user.created_at || new Date().toISOString(),
            twoFactorEnabled: false
          };
          setUser(supaUser);
          return { success: true };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // 2. Otherwise verify strictly with the backend database
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.requires2FA) {
          setPendingEmailFor2FA(cleanEmail);
          return { success: false, requires2FA: true, error: data.message };
        }
        return { success: false, error: data.error || 'Incorrect email or password.' };
      }

      const loggedUser: UserProfile = {
        name: data.user.name,
        email: data.user.email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        enrolledAt: data.user.enrolledAt,
        twoFactorEnabled: data.user.twoFactorEnabled
      };
      setUser(loggedUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login connection failed' };
    }
  };

  // Sign up with Name, Email & Password (stored into database)
  const signUp = async (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const cleanName = name.trim();

    if (!cleanName || !cleanEmail || !cleanPass) {
      return { success: false, error: 'Full name, email, and password are all required.' };
    }
    if (cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    // 1. If Supabase is configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPass,
          options: {
            data: { full_name: cleanName }
          }
        });

        if (error) {
          return { success: false, error: error.message };
        }

        if (data.user) {
          return {
            success: true,
            message: 'Supabase account created! Verification email dispatched to ' + cleanEmail
          };
        }
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    // 2. Register into academy database
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Registration failed.' };
      }

      return {
        success: true,
        message: data.message || 'Account successfully enrolled! Verification email sent.',
        previewLink: data.verifyLink
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // Forgot Password request
  const forgotPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your registered email address.' };
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Password reset link dispatched via Supabase to ' + cleanEmail };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to dispatch reset email.' };
      }
      return {
        success: true,
        message: data.message,
        resetCode: data.resetCode
      };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  // Reset Password with code or token
  const resetPassword = async (tokenOrCode: string, newPassword: string) => {
    if (!tokenOrCode || !newPassword) {
      return { success: false, error: 'Reset token/code and new password are required.' };
    }
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' };
    }

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Password updated in Supabase database! You can now log in.' };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenOrCode.trim(), newPassword: newPassword.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Password reset failed.' };
      }
      return { success: true, message: data.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
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

  const signOut = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
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
        forgotPassword,
        resetPassword,
        verify2FA,
        verifyToken,
        toggle2FA,
        submitModuleQuiz,
        signOut,
        pendingEmailFor2FA,
        isSupabaseActive
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
