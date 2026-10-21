"use client";

import * as React from "react";
import { useState } from "react";
import { Shield, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

export interface SignInProps {
  onSignIn?: (email: string, password: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  onSignUp?: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  onGoogleSignIn?: () => Promise<{ success: boolean; error?: string }>;
  onVerify2FA?: (otp: string) => Promise<{ success: boolean; error?: string }>;
  defaultMode?: "signin" | "signup";
  onClose?: () => void;
}

const SignIn1: React.FC<SignInProps> = ({
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onVerify2FA,
  defaultMode = "signin",
  onClose,
}) => {
  const [mode, setMode] = useState<"signin" | "signup" | "2fa">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleAction = async () => {
    setError("");
    setInfoMessage("");

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
          setInfoMessage(res.message || "Verification email dispatched! Check your inbox.");
        } else {
          setError(res.error || "Registration failed. Try again.");
        }
      } else {
        setLoading(false);
        setInfoMessage("Verification link sent! Please check your email.");
      }
    } else {
      setLoading(true);
      if (onSignIn) {
        const res = await onSignIn(email, password);
        setLoading(false);
        if (res.requires2FA) {
          setMode("2fa");
          setInfoMessage("Two-factor authentication code sent to your email.");
        } else if (!res.success) {
          setError(res.error || "Authentication failed.");
        }
      } else {
        setLoading(false);
      }
    }
  };

  const handleGoogleClick = async () => {
    setError("");
    setLoading(true);
    if (onGoogleSignIn) {
      const res = await onGoogleSignIn();
      setLoading(false);
      if (!res.success) {
        setError(res.error || "Google authentication was cancelled.");
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[560px] flex flex-col items-center justify-center bg-[#070b14] relative overflow-hidden w-full rounded-2xl py-8 px-4">
      {/* Background radial highlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-20 bg-cyan-500" 
        aria-hidden="true" 
      />

      {/* Centered glass card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-7 flex flex-col items-center">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
          >
            ✕
          </button>
        )}

        {/* Logo badge with cybersecurity icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/30 mb-5 shadow-[0_0_20px_rgba(6,182,212,0.25)]">
          <Shield className="w-6 h-6 text-cyan-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-white mb-1 text-center font-sans">
          Security Analyzires
        </h2>
        <p className="text-xs text-slate-400 mb-6 text-center">
          {mode === "signin" && "Sign in to access your cybersecurity labs & lectures"}
          {mode === "signup" && "Create your academy account & enroll free"}
          {mode === "2fa" && "Two-Factor Verification: Enter 6-digit OTP"}
        </p>

        {/* Form */}
        <div className="flex flex-col w-full gap-4">
          <div className="w-full flex flex-col gap-3">
            {mode === "signup" && (
              <div className="relative">
                <input
                  placeholder="Full Name"
                  type="text"
                  value={name}
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            {mode !== "2fa" ? (
              <>
                <div className="relative">
                  <input
                    placeholder="Email Address"
                    type="email"
                    value={email}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    disabled={loading}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <div className="relative">
                <input
                  placeholder="000000"
                  type="text"
                  maxLength={6}
                  value={otp}
                  disabled={loading}
                  className="w-full tracking-widest text-center text-xl font-mono px-4 py-3 rounded-xl bg-white/[0.07] border border-white/10 text-cyan-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {infoMessage && (
              <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 p-2.5 rounded-lg text-left">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{infoMessage}</span>
              </div>
            )}
          </div>

          <hr className="border-white/10 my-0.5" />

          <div>
            <button
              onClick={handleAction}
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold px-5 py-3 rounded-xl shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.45)] transition-all mb-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === "signin" ? (
                <>Sign in to Dashboard <ArrowRight className="w-4 h-4" /></>
              ) : mode === "signup" ? (
                <>Enroll & Get Verification <Mail className="w-4 h-4" /></>
              ) : (
                <>Verify 2FA Code <KeyRound className="w-4 h-4" /></>
              )}
            </button>

            {mode !== "2fa" && (
              <button 
                onClick={handleGoogleClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 rounded-xl px-5 py-3 font-medium text-white shadow transition-all mb-2 text-sm disabled:opacity-50"
              >
                <img
                  src="https://cdn.21st.dev/assets/mirror/38/38146bfd9eff6dbf0d74771f2e625c70d87d3770e0d080dbb6e50db1d5403f46.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                Continue with Google
              </button>
            )}

            <div className="w-full text-center mt-3">
              {mode === "signin" ? (
                <span className="text-xs text-slate-400">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); setInfoMessage(""); }}
                    className="underline text-cyan-400 hover:text-cyan-300 font-medium ml-1"
                  >
                    Sign up, it&apos;s free!
                  </button>
                </span>
              ) : mode === "signup" ? (
                <span className="text-xs text-slate-400">
                  Already registered?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(""); setInfoMessage(""); }}
                    className="underline text-cyan-400 hover:text-cyan-300 font-medium ml-1"
                  >
                    Sign in here
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => { setMode("signin"); setError(""); setInfoMessage(""); }}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User count and active community avatars */}
      <div className="relative z-10 mt-8 flex flex-col items-center text-center">
        <p className="text-slate-400 text-xs mb-2">
          Join <span className="font-semibold text-white">4,800+</span> aspiring cyber defense specialists.
        </p>
        <div className="flex -space-x-2">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-7 h-7 rounded-full border-2 border-[#070b14] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-7 h-7 rounded-full border-2 border-[#070b14] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-7 h-7 rounded-full border-2 border-[#070b14] object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80"
            alt="Student"
            className="w-7 h-7 rounded-full border-2 border-[#070b14] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export { SignIn1 };
export default SignIn1;
