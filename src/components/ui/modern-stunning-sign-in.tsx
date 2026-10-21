"use client";

import * as React from "react";
import { useState } from "react";
import { Shield, Lock, Mail, ArrowRight, KeyRound, CheckCircle2, AlertCircle, X } from "lucide-react";

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
    <div className="min-h-[540px] flex flex-col items-center justify-center bg-[#141413] border border-[rgba(241,239,234,0.12)] relative overflow-hidden w-full rounded-3xl py-8 px-5 shadow-2xl">
      {/* Subtle warm halo */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-25 bg-[#F1EFEA]/10" 
        aria-hidden="true" 
      />

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
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#222220] border border-[rgba(241,239,234,0.15)] mb-4 shadow-sm text-[#F1EFEA]">
          <Shield className="w-6 h-6 text-[#F1EFEA]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-medium tracking-tight text-[#F1EFEA] mb-1 text-center font-sans">
          Security Analyzires<sup className="text-xs ml-0.5 opacity-60">®</sup>
        </h2>
        <p className="text-xs text-[#98968f] mb-6 text-center leading-relaxed">
          {mode === "signin" && "Sign in to access your enrolled courses & AI Defense Mentor"}
          {mode === "signup" && "Enroll into the zero-trust curriculum and unlock full access"}
          {mode === "2fa" && "Two-Factor Verification: Enter 6-digit OTP code"}
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
                  className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] focus:ring-1 focus:ring-[#F1EFEA] transition-all"
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
                    className="w-full px-4 py-2.5 rounded-xl bg-[#111110] border border-[rgba(241,239,234,0.14)] text-[#F1EFEA] placeholder-[#98968f]/60 text-xs font-sans focus:outline-none focus:border-[#F1EFEA] focus:ring-1 focus:ring-[#F1EFEA] transition-all"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
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
              </>
            ) : (
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
                <>Enter Academy Dashboard <ArrowRight className="w-3.5 h-3.5" /></>
              ) : mode === "signup" ? (
                <>Enroll Free & Verify Email <Mail className="w-3.5 h-3.5" /></>
              ) : (
                <>Verify 2FA Security Code <KeyRound className="w-3.5 h-3.5" /></>
              )}
            </button>

            {mode !== "2fa" && (
              <button 
                onClick={handleGoogleClick}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 bg-[#1c1c1b] hover:bg-[#262624] border border-[rgba(241,239,234,0.12)] rounded-xl px-5 py-2.5 font-medium text-[#F1EFEA] transition-all mb-2 text-xs disabled:opacity-50 cursor-pointer"
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
                <span className="text-xs text-[#98968f]">
                  New to Security Analyzires?{" "}
                  <button
                    onClick={() => { setMode("signup"); setError(""); setInfoMessage(""); }}
                    className="text-[#F1EFEA] underline font-medium ml-1 cursor-pointer hover:opacity-80"
                  >
                    Enroll free here
                  </button>
                </span>
              ) : mode === "signup" ? (
                <span className="text-xs text-[#98968f]">
                  Already enrolled?{" "}
                  <button
                    onClick={() => { setMode("signin"); setError(""); setInfoMessage(""); }}
                    className="text-[#F1EFEA] underline font-medium ml-1 cursor-pointer hover:opacity-80"
                  >
                    Sign in here
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => { setMode("signin"); setError(""); setInfoMessage(""); }}
                  className="text-xs text-[#98968f] hover:text-[#F1EFEA] underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              )}
            </div>
          </div>
        </div>
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
