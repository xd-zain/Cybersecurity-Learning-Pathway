"use client";

import * as React from "react";
import { useState } from "react";
import { Shield, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, AlertCircle, X, Database, RefreshCw, ChevronLeft } from "lucide-react";
import { isSupabaseConfigured, getSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from "../../lib/supabase";

export interface SignInProps {
  onSignIn?: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  onSignUp?: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onForgotPassword?: (email: string) => Promise<{ success: boolean; message?: string; error?: string; resetCode?: string }>;
  onResetPassword?: (tokenOrCode: string, newPassword: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onVerify2FA?: (otp: string) => Promise<{ success: boolean; error?: string }>;
  defaultMode?: "signin" | "signup" | "forgot" | "reset" | "2fa" | "supabase";
  initialResetCode?: string;
  onClose?: () => void;
}

const SignIn1: React.FC<SignInProps> = ({
  onSignIn,
  onSignUp,
  onForgotPassword,
  onResetPassword,
  onVerify2FA,
  defaultMode = "signin",
  initialResetCode = "",
  onClose,
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot" | "reset" | "2fa" | "supabase">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState(initialResetCode);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Supabase connection state
  const currentConfig = getSupabaseConfig();
  const [supaUrl, setSupaUrl] = useState(currentConfig.url);
  const [supaKey, setSupaKey] = useState(currentConfig.anonKey);
  const isSupaActive = isSupabaseConfigured();

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleAction = async () => {
    setError("");
    setInfoMessage("");

    // 1. Two-Factor Authentication flow
    if (mode === "2fa") {
      if (!otp || otp.length < 6) {
        setError("Please enter the 6-digit OTP code sent to your email.");
        return;
      }
      setLoading(true);
      if (onVerify2FA) {
        const res = await onVerify2FA(otp);
        setLoading(false);
        if (!res.success) {
          setError(res.error || "Invalid 2FA authentication code.");
        }
      }
      return;
    }

    // 2. Forgot Password flow
    if (mode === "forgot") {
      if (!email || !validateEmail(email)) {
        setError("Please enter a valid registered email address.");
        return;
      }
      setLoading(true);
      if (onForgotPassword) {
        const res = await onForgotPassword(email);
        setLoading(false);
        if (res.success) {
          setInfoMessage(res.message || "Password reset code sent! Check your inbox.");
          if (res.resetCode) {
            setResetCode(res.resetCode);
          }
          setMode("reset");
        } else {
          setError(res.error || "Could not dispatch password reset email.");
        }
      } else {
        setLoading(false);
        setError("Password reset handler not initialized.");
      }
      return;
    }

    // 3. Reset Password flow
    if (mode === "reset") {
      if (!resetCode) {
        setError("Please enter the reset code or token from your email.");
        return;
      }
      if (!password || password.length < 6) {
        setError("New password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match. Please verify.");
        return;
      }

      setLoading(true);
      if (onResetPassword) {
        const res = await onResetPassword(resetCode, password);
        setLoading(false);
        if (res.success) {
          setInfoMessage("Password successfully updated! You can now sign in.");
          setPassword("");
          setConfirmPassword("");
          setMode("signin");
        } else {
          setError(res.error || "Failed to update password.");
        }
      } else {
        setLoading(false);
      }
      return;
    }

    // 4. Sign Up and Sign In validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      setLoading(true);
      if (onSignUp) {
        const res = await onSignUp(name, email, password);
        setLoading(false);
        if (res.success) {
          setInfoMessage(res.message || "Enrollment complete! Please sign in with your password.");
          setMode("signin");
        } else {
          setError(res.error || "Registration failed. Try again.");
        }
      } else {
        setLoading(false);
      }
    } else {
      // mode === "signin"
      setLoading(true);
      if (onSignIn) {
        const res = await onSignIn(email, password);
        setLoading(false);
        if (res.requires2FA) {
          setMode("2fa");
          setInfoMessage("Two-factor authentication code sent to your email.");
        } else if (!res.success) {
          setError(res.error || "Incorrect email or password.");
        }
      } else {
        setLoading(false);
      }
    }
  };

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supaUrl.trim().startsWith('http')) {
      setError("Please provide a valid Supabase Project URL (e.g. https://yourproject.supabase.co)");
      return;
    }
    if (!supaKey.trim()) {
      setError("Please provide your Supabase anon public API key.");
      return;
    }
    saveSupabaseConfig(supaUrl, supaKey);
  };

  return (
    <div className="min-h-[540px] flex flex-col items-center justify-center bg-[#141413] border border-[rgba(241,239,234,0.12)] relative overflow-hidden w-full rounded-3xl py-8 px-5 shadow-2xl">
      {/* Subtle warm halo */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 bg-[#F1EFEA]/10" 
        aria-hidden="true" 
      />

      {/* Database connection badge */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => {
            setError("");
            setInfoMessage("");
            setMode(m => m === 'supabase' ? 'signin' : 'supabase');
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all cursor-pointer ${
            isSupaActive 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : 'bg-[#1c1c1b] border-[rgba(241,239,234,0.14)] text-[#98968f] hover:text-[#F1EFEA]'
          }`}
          title="Configure Supabase Database"
        >
          <Database className="w-3 h-3 text-emerald-400" />
          <span>{isSupaActive ? 'Supabase Connected' : 'Attach Supabase'}</span>
        </button>
      </div>

      {/* Centered card */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-[#171716] border border-[rgba(241,239,234,0.1)] p-7 flex flex-col items-center shadow-xl">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-[#98968f] hover:text-[#F1EFEA] text-xs p-1.5 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Brand Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#222220] border border-[rgba(241,239,234,0.15)] mb-3.5 shadow-sm text-[#F1EFEA]">
          <Shield className="w-6 h-6 text-[#F1EFEA]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-medium tracking-tight text-[#F1EFEA] mb-1 text-center font-sans">
          Security Analyzires<sup className="text-xs ml-0.5 opacity-60">®</sup>
        </h2>
        
        <p className="text-xs text-[#98968f] mb-5 text-center leading-relaxed">
          {mode === "signin" && "Sign in with your email and password to access enrolled courses"}
          {mode === "signup" && "Enroll into the zero-trust curriculum with password protection"}
          {mode === "forgot" && "Enter your email to receive a secure password reset link"}
          {mode === "reset" && "Enter the reset code and create your new secure password"}
          {mode === "2fa" && "Two-Factor Verification: Enter 6-digit OTP code"}
          {mode === "supabase" && "Attach your Supabase PostgreSQL database & auth"}
        </p>

        {/* SUPABASE CONFIGURATION MODE */}
        {mode === "supabase" ? (
          <form onSubmit={handleSaveSupabase} className="flex flex-col w-full gap-3">
            <div>
              <label className="text-[11px] font-mono text-[#98968f] block mb-1">
                Supabase Project URL
              </label>
              <input
                placeholder="https://xyzcompany.supabase.co"
                type="url"
                value={supaUrl}
                onChange={(e) => setSupaUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/50 text-xs font-mono focus:outline-none focus:border-[#F1EFEA]"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-[#98968f] block mb-1">
                Supabase Anon Public API Key
              </label>
              <input
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                type="password"
                value={supaKey}
                onChange={(e) => setSupaKey(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/50 text-xs font-mono focus:outline-none focus:border-[#F1EFEA]"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full mt-2 bg-[#F1EFEA] hover:bg-white text-[#111110] font-medium px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow"
            >
              Connect Supabase Project
            </button>

            {isSupaActive && (
              <button
                type="button"
                onClick={clearSupabaseConfig}
                className="w-full bg-[#1c1c1b] hover:bg-rose-950/40 hover:text-rose-300 border border-[rgba(241,239,234,0.12)] text-[#98968f] px-3 py-1.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Disconnect Supabase
              </button>
            )}

            <button
              type="button"
              onClick={() => { setMode('signin'); setError(''); }}
              className="text-xs text-[#98968f] hover:text-[#F1EFEA] mt-2 underline"
            >
              Back to Sign In
            </button>
          </form>
        ) : (
          /* STANDARD EMAIL & PASSWORD AUTH FORM */
          <div className="flex flex-col w-full gap-3.5">
            <div className="w-full flex flex-col gap-3">
              {mode === "signup" && (
                <div className="relative">
                  <input
                    placeholder="Full Name"
                    type="text"
                    value={name}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] focus:ring-1 focus:ring-[#F1EFEA] transition-all"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}

              {/* Email Input for signin, signup, forgot */}
              {(mode === "signin" || mode === "signup" || mode === "forgot") && (
                <div className="relative">
                  <input
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    disabled={loading}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] focus:ring-1 focus:ring-[#F1EFEA] transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {/* Password Input for signin & signup */}
              {(mode === "signin" || mode === "signup") && (
                <div>
                  <div className="relative">
                    <input
                      placeholder="Password"
                      type="password"
                      value={password}
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] focus:ring-1 focus:ring-[#F1EFEA] transition-all"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  {mode === "signin" && (
                    <div className="text-right mt-1.5">
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setError(""); setInfoMessage(""); }}
                        className="text-[11px] text-[#98968f] hover:text-[#F1EFEA] underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Reset Password fields */}
              {mode === "reset" && (
                <>
                  <div className="relative">
                    <input
                      placeholder="6-Digit Reset Code or Token"
                      type="text"
                      value={resetCode}
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-mono focus:outline-none focus:border-[#F1EFEA] transition-all"
                      onChange={(e) => setResetCode(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      placeholder="New Password (min 6 chars)"
                      type="password"
                      value={password}
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] transition-all"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <input
                      placeholder="Confirm New Password"
                      type="password"
                      value={confirmPassword}
                      disabled={loading}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] transition-all"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* 2FA Mode */}
              {mode === "2fa" && (
                <div className="relative">
                  <input
                    placeholder="000000"
                    type="text"
                    maxLength={6}
                    value={otp}
                    disabled={loading}
                    className="w-full tracking-widest text-center text-xl font-mono px-4 py-3 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/50 focus:outline-none focus:border-[#F1EFEA] transition-all"
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/40 p-2.5 rounded-lg text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {infoMessage && (
                <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-lg text-left">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>{infoMessage}</span>
                </div>
              )}
            </div>

            <hr className="border-[rgba(241,239,234,0.08)] my-0.5" />

            <div>
              <button
                onClick={handleAction}
                disabled={loading}
                className="w-full bg-[#F1EFEA] hover:bg-white text-[#111110] font-medium px-5 py-2.5 rounded-xl transition-all mb-3 text-xs shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : mode === "signin" ? (
                  <>Sign In with Password <ArrowRight className="w-3.5 h-3.5" /></>
                ) : mode === "signup" ? (
                  <>Enroll with Password <Mail className="w-3.5 h-3.5" /></>
                ) : mode === "forgot" ? (
                  <>Send Reset Code to Email <Mail className="w-3.5 h-3.5" /></>
                ) : mode === "reset" ? (
                  <>Update Password in Database <KeyRound className="w-3.5 h-3.5" /></>
                ) : (
                  <>Verify 2FA Security Code <KeyRound className="w-3.5 h-3.5" /></>
                )}
              </button>

              <div className="w-full text-center mt-3">
                {mode === "signin" ? (
                  <span className="text-xs text-[#98968f]">
                    New student?{" "}
                    <button
                      onClick={() => { setMode("signup"); setError(""); setInfoMessage(""); }}
                      className="text-[#F1EFEA] underline font-medium ml-1 cursor-pointer hover:opacity-80"
                    >
                      Enroll free here
                    </button>
                  </span>
                ) : mode === "signup" ? (
                  <span className="text-xs text-[#98968f]">
                    Already registered?{" "}
                    <button
                      onClick={() => { setMode("signin"); setError(""); setInfoMessage(""); }}
                      className="text-[#F1EFEA] underline font-medium ml-1 cursor-pointer hover:opacity-80"
                    >
                      Sign in with password
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => { setMode("signin"); setError(""); setInfoMessage(""); }}
                    className="text-xs text-[#98968f] hover:text-[#F1EFEA] underline cursor-pointer inline-flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" /> Back to Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Community proof */}
      <div className="relative z-10 mt-6 flex flex-col items-center text-center">
        <p className="text-[#98968f] text-xs mb-2">
          Join <span className="font-semibold text-[#F1EFEA]">4,800+</span> enrolled cyber defense specialists.
        </p>
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-6 h-6 rounded-full border border-[#141413] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-6 h-6 rounded-full border border-[#141413] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-6 h-6 rounded-full border border-[#141413] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-6 h-6 rounded-full border border-[#141413] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
export default SignIn1;
