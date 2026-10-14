"use client";

import React, { useState } from "react";
import { ArrowRight, ShieldCheck, BookOpen, GraduationCap, Sparkles, Check } from "lucide-react";

interface LoginGatewayProps {
  onLogin: (role: "admin" | "faculty" | "student") => void;
}

export default function LoginGateway({ onLogin }: LoginGatewayProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"admin" | "faculty" | "student">("student");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(role);
    }, 280);
  };

  const handleOAuthLogin = (provider: string) => {
    setActiveProvider(provider);
    setLoading(true);
    setTimeout(() => {
      onLogin(role);
    }, 350);
  };

  return (
    <div className="min-h-screen w-screen bg-[#EEF3F6] text-[#11233D] flex flex-col justify-between items-center p-4 sm:p-6 relative font-sans antialiased selection:bg-[#00CEE6]/30 overflow-x-hidden">
      {/* Soft Pebble Ambient Diffusions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[460px] h-[460px] bg-[#00CEE6]/14 rounded-full blur-[110px]" />
        <div className="absolute -bottom-40 -right-40 w-[460px] h-[460px] bg-[#825FEF]/10 rounded-full blur-[110px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] bg-[#ACBACC]/15 rounded-full blur-[130px]" />
      </div>

      {/* Top Subtle Brand Bar */}
      <header className="w-full max-w-4xl flex items-center justify-between relative z-10 text-xs pt-2 px-2">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00CEE6] shadow-[0_0_10px_#00CEE6]" />
          <span className="font-extrabold tracking-tight text-[#11233D] text-sm">
            Campus 2 Career
          </span>
        </div>
        <span className="font-semibold text-[11px] text-[#11233D]/70 bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border-2 border-[#ACBACC]/35 shadow-[0_2px_6px_rgba(17,35,61,0.04),inset_0_1px_2px_rgba(255,255,255,1)]">
          KPMG Campus Analytics
        </span>
      </header>

      {/* Center Tactile Pebble Login Card */}
      <main className="w-full max-w-[460px] my-auto py-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-[36px] p-8 sm:p-10 border-2 border-[#ACBACC]/35 shadow-[0_28px_60px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.03),inset_0_2px_4px_rgba(255,255,255,1)]">
          
          {/* Prominently Sized Brand Logo Pod */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-[24px] bg-[#EEF3F6] border-2 border-[#ACBACC]/40 p-3 mx-auto mb-3.5 shadow-[inset_0_2px_4px_rgba(17,35,61,0.04),0_6px_16px_rgba(17,35,61,0.05)] flex items-center justify-center hover:scale-[1.03] transition-transform">
              <img
                src="/brand/logo-full-clean.png"
                alt="Campus 2 Career Logo"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <h1 className="text-2xl font-black text-[#11233D] tracking-tight">
              {isSignUp ? "Create Account" : "Sign In"}
            </h1>
            <p className="text-xs text-[#11233D]/60 mt-1 font-medium">
              {isSignUp
                ? "Register your institutional workspace profile"
                : "Select your role to access workspace"}
            </p>
          </div>

          {/* Role Switcher (Pebble Segmented Control - Student First, then Faculty & Admin) */}
          <div className="mb-6">
            <div className="p-1 bg-[#EEF3F6] rounded-full border-2 border-[#ACBACC]/40 flex items-center shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)]">
              {/* 1. Student Button (First Preference) */}
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex-1 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === "student"
                    ? "bg-[#00CEE6] text-[#11233D] shadow-[0_4px_14px_rgba(0,206,230,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.5)] font-black"
                    : "text-[#11233D]/65 hover:text-[#11233D]"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>

              {/* 2. Faculty Button */}
              <button
                type="button"
                onClick={() => setRole("faculty")}
                className={`flex-1 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === "faculty"
                    ? "bg-[#825FEF] text-white shadow-[0_4px_14px_rgba(130,95,239,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.3)] font-black"
                    : "text-[#11233D]/65 hover:text-[#11233D]"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Faculty</span>
              </button>

              {/* 3. Admin Button */}
              <button
                type="button"
                onClick={() => setRole("admin")}
                className={`flex-1 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  role === "admin"
                    ? "bg-[#11233D] text-white shadow-[0_4px_14px_rgba(17,35,61,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.3)] font-black"
                    : "text-[#11233D]/65 hover:text-[#11233D]"
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* 1. First Preference: Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-[#11233D]/70 block mb-1.5 px-1">
                Institutional ID
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Institutional ID"
                className={`w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl px-4 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none transition-all ${
                  role === "student"
                    ? "focus:border-[#00CEE6]"
                    : role === "faculty"
                    ? "focus:border-[#825FEF]"
                    : "focus:border-[#11233D]"
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5 px-1">
                <label className="text-[11px] font-bold text-[#11233D]/70 block">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-[#825FEF] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className={`w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl px-4 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none transition-all ${
                  role === "student"
                    ? "focus:border-[#00CEE6]"
                    : role === "faculty"
                    ? "focus:border-[#825FEF]"
                    : "focus:border-[#11233D]"
                }`}
              />
            </div>

            {/* Extra Confirm Password Field for Create Account Mode */}
            {isSignUp && (
              <div>
                <label className="text-[11px] font-bold text-[#11233D]/70 block mb-1.5 px-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className={`w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl px-4 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none transition-all ${
                    role === "student"
                      ? "focus:border-[#00CEE6]"
                      : role === "faculty"
                      ? "focus:border-[#825FEF]"
                      : "focus:border-[#11233D]"
                  }`}
                />
              </div>
            )}

            {/* Primary Action Button (Tactile Pebble Theme) */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-full font-black text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 active:scale-[0.98] border-2 border-white/25 ${
                role === "admin"
                  ? "bg-[#11233D] hover:bg-[#0c1a2d] text-white shadow-[0_8px_24px_rgba(17,35,61,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.25)]"
                  : role === "faculty"
                  ? "bg-[#825FEF] hover:bg-[#724ee6] text-white shadow-[0_8px_24px_rgba(130,95,239,0.32),inset_0_1.5px_2px_rgba(255,255,255,0.3)]"
                  : "bg-[#00CEE6] hover:bg-[#00bcd4] text-[#11233D] shadow-[0_8px_24px_rgba(0,206,230,0.32),inset_0_1.5px_2px_rgba(255,255,255,0.5)]"
              }`}
            >
              <span>
                {loading
                  ? activeProvider
                    ? `Connecting to ${activeProvider}...`
                    : isSignUp
                    ? "Creating Account..."
                    : "Signing in..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Judges Verification Demo Access Button */}
          <div className="mt-4 p-3.5 rounded-[26px] bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-cyan-500/10 border-2 border-amber-400/40 shadow-[0_4px_16px_rgba(245,158,11,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.85)]">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                Judges Demo Verification
              </span>
              <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full border border-amber-300">
                Instant 1-Click
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  onLogin("student");
                }}
                className="py-2 px-1 rounded-2xl bg-white hover:bg-[#00CEE6]/15 hover:border-[#00CEE6] text-[#11233D] border border-slate-200 text-[11px] font-black shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                title="Enter as Student (Ananya V.)"
              >
                <GraduationCap className="w-4 h-4 text-[#00CEE6] mb-0.5 group-hover:scale-110 transition-transform" />
                <span>Student</span>
                <span className="text-[8.5px] font-medium text-slate-400">Score 74</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("faculty");
                  onLogin("faculty");
                }}
                className="py-2 px-1 rounded-2xl bg-white hover:bg-[#825FEF]/15 hover:border-[#825FEF] text-[#11233D] border border-slate-200 text-[11px] font-black shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                title="Enter as Faculty (Prof. Rajesh Kumar)"
              >
                <BookOpen className="w-4 h-4 text-[#825FEF] mb-0.5 group-hover:scale-110 transition-transform" />
                <span>Faculty</span>
                <span className="text-[8.5px] font-medium text-slate-400">HOD L3</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  onLogin("admin");
                }}
                className="py-2 px-1 rounded-2xl bg-white hover:bg-[#11233D]/15 hover:border-[#11233D] text-[#11233D] border border-slate-200 text-[11px] font-black shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                title="Enter as Admin (Dr. Srinivas Rao)"
              >
                <ShieldCheck className="w-4 h-4 text-[#11233D] mb-0.5 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
                <span className="text-[8.5px] font-medium text-slate-400">Registrar</span>
              </button>
            </div>
          </div>

          {/* 2. Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#ACBACC]/25" />
            </div>
            <span className="relative bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-[#ACBACC]">
              {isSignUp ? "or register with" : "or continue with"}
            </span>
          </div>

          {/* 3. Social / SSO Buttons: Just Logos in Tactile Pebble Pods */}
          <div className="flex items-center justify-center gap-3.5">
            {/* Microsoft 365 */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("Microsoft")}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-[#EEF3F6] hover:bg-white border-2 border-[#ACBACC]/45 shadow-[0_3px_8px_rgba(17,35,61,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:border-[#ACBACC] active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
              title="Microsoft"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 21 21">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("Facebook")}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-[#EEF3F6] hover:bg-white border-2 border-[#ACBACC]/45 shadow-[0_3px_8px_rgba(17,35,61,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:border-[#ACBACC] active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
              title="Facebook"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("Apple")}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-[#EEF3F6] hover:bg-white border-2 border-[#ACBACC]/45 shadow-[0_3px_8px_rgba(17,35,61,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:border-[#ACBACC] active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
              title="Apple"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110 text-[#11233D]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.1 1.73-.96 2.76 1.01.08 1.99-.51 2.6-1.26z" />
              </svg>
            </button>
          </div>

          {/* Bottom Switcher: Clean toggle between Sign In and Create Account */}
          <div className="mt-6 pt-4 border-t-2 border-[#ACBACC]/25 text-center">
            {isSignUp ? (
              <p className="text-xs text-[#11233D]/65">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="font-bold text-[#825FEF] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#11233D]/65">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="font-bold text-[#825FEF] hover:underline cursor-pointer"
                >
                  Create account
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Bottom Minimal Security Note */}
      <footer className="w-full max-w-4xl text-center text-[11px] text-[#11233D]/50 relative z-10 pb-2 font-medium">
        Enterprise SSO Protected · FERPA & GDPR Compliant
      </footer>
    </div>
  );
}
