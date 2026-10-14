"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface LoginGatewayProps {
  onLogin: (role: "admin" | "faculty" | "student") => void;
}

type AuthMode = "signin" | "signup" | "forgot_password";

export default function LoginGateway({ onLogin }: LoginGatewayProps) {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [role, setRole] = useState<"admin" | "faculty" | "student">("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  // Clear messages when mode or role changes
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // 1. Handle Email & Password Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: password,
      });

      if (error) {
        // Human-friendly error messages
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage(
            "Invalid email or password. If you don't have an account yet, click 'Create account' below."
          );
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMessage(
            "Your email address has not been confirmed yet. Please check your inbox for the confirmation email."
          );
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      // Check if user has an assigned role in Supabase metadata, otherwise fallback to active selection
      const metaRole = data.user?.user_metadata?.role as
        | "admin"
        | "faculty"
        | "student"
        | undefined;
      const finalRole = metaRole && ["admin", "faculty", "student"].includes(metaRole)
        ? metaRole
        : role;

      setSuccessMessage("Authenticated successfully! Loading your workspace...");
      setTimeout(() => {
        onLogin(finalRole);
      }, 350);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to connect to authentication server.";
      setErrorMessage(errorMsg);
      setLoading(false);
    }
  };

  // 2. Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            role: role,
            full_name: cleanEmail.split("@")[0],
          },
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      // Check if session was automatically created or if confirmation email is required
      if (data.session) {
        setSuccessMessage("Account created successfully! Loading workspace...");
        setTimeout(() => {
          onLogin(role);
        }, 500);
      } else {
        setSuccessMessage(
          "Account created! Please check your email to verify your address, then sign in."
        );
        setLoading(false);
        setTimeout(() => {
          setMode("signin");
        }, 2200);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Registration failed. Please try again.";
      setErrorMessage(errorMsg);
      setLoading(false);
    }
  };

  // 3. Handle Password Reset
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo,
      });

      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage(
          `Password reset instructions have been sent to ${cleanEmail}. Check your inbox.`
        );
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Unable to send password reset email.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle OAuth Providers with graceful error notification
  const handleOAuthLogin = async (
    provider: "google" | "facebook" | "apple" | "azure",
    label: string
  ) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setActiveProvider(label);
    setLoading(true);

    try {
      const redirectTo =
        typeof window !== "undefined" ? window.location.origin : undefined;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo,
          queryParams: {
            role: role,
          },
        },
      });

      if (error) {
        setErrorMessage(
          `${label} SSO is not configured in Supabase. Please sign in with your email or use Instant Demo verification.`
        );
        setLoading(false);
        setActiveProvider(null);
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : `${label} sign-in failed. Please use email credentials.`;
      setErrorMessage(errorMsg);
      setLoading(false);
      setActiveProvider(null);
    }
  };

  // 5. Instant 1-Click Demo Access
  const handleDemoLogin = (demoRole: "student" | "faculty" | "admin") => {
    setRole(demoRole);
    setErrorMessage(null);
    setSuccessMessage(`Entering as ${demoRole.toUpperCase()}...`);
    setTimeout(() => {
      onLogin(demoRole);
    }, 200);
  };

  return (
    <div className="min-h-screen w-full bg-[#EEF3F6] text-[#11233D] flex items-center justify-center p-4 sm:p-6 relative font-sans antialiased selection:bg-[#00CEE6]/30 overflow-hidden">
      {/* Soft Ambient Diffusions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-36 -left-36 w-[420px] h-[420px] bg-[#00CEE6]/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-36 -right-36 w-[420px] h-[420px] bg-[#825FEF]/12 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-[#ACBACC]/15 rounded-full blur-[120px]" />
      </div>

      {/* Center Tactile Pebble Login Card (Only component visible on screen) */}
      <div className="w-full max-w-[450px] relative z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white rounded-[32px] sm:rounded-[36px] p-7 sm:p-9 border-2 border-[#ACBACC]/35 shadow-[0_24px_55px_rgba(17,35,61,0.08),0_6px_18px_rgba(17,35,61,0.03),inset_0_2px_4px_rgba(255,255,255,1)]">
          
          {/* Brand Logo & Header Pod */}
          <div className="text-center mb-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-[22px] bg-[#EEF3F6] border-2 border-[#ACBACC]/40 p-2.5 mx-auto mb-3 shadow-[inset_0_2px_4px_rgba(17,35,61,0.04),0_6px_14px_rgba(17,35,61,0.04)] flex items-center justify-center hover:scale-[1.03] transition-transform">
              <img
                src="/brand/logo-full-clean.png"
                alt="Campus 2 Career Logo"
                className="w-full h-full object-contain filter drop-shadow-xs"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#11233D] tracking-tight">
              {mode === "signin"
                ? "Sign In"
                : mode === "signup"
                ? "Create Account"
                : "Reset Password"}
            </h1>
            <p className="text-xs text-[#11233D]/60 mt-1 font-medium">
              {mode === "signin"
                ? "Select your role to access your institutional workspace"
                : mode === "signup"
                ? "Register your student or faculty workspace profile"
                : "Enter your email to receive a password reset link"}
            </p>
          </div>

          {/* Role Switcher (Visible in Sign In and Sign Up modes) */}
          {mode !== "forgot_password" && (
            <div className="mb-5">
              <div className="p-1 bg-[#EEF3F6] rounded-full border-2 border-[#ACBACC]/40 flex items-center shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)]">
                {/* 1. Student Button */}
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
          )}

          {/* Alert: Error Notification */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {/* Alert: Success Notification */}
          {successMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
              <span className="leading-relaxed">{successMessage}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODE: FORGOT PASSWORD                                    */}
          {/* ======================================================== */}
          {mode === "forgot_password" ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-[#11233D]/75 block mb-1.5 px-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ACBACC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@campus.edu"
                    className="w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none focus:border-[#825FEF] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full font-black text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 active:scale-[0.98] border-2 border-white/25 bg-[#825FEF] hover:bg-[#724ee6] text-white shadow-[0_8px_24px_rgba(130,95,239,0.32)] disabled:opacity-60"
              >
                <span>{loading ? "Sending Reset Link..." : "Send Reset Link"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => switchMode("signin")}
                className="w-full py-2.5 text-xs font-bold text-[#11233D]/70 hover:text-[#11233D] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </form>
          ) : (
            /* ======================================================== */
            /* MODE: SIGN IN & SIGN UP                                 */
            /* ======================================================== */
            <form
              onSubmit={mode === "signin" ? handleSignIn : handleSignUp}
              className="space-y-3.5"
            >
              {/* 1. Email Address (Replaced Institutional ID) */}
              <div>
                <label className="text-[11px] font-bold text-[#11233D]/75 block mb-1.5 px-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#ACBACC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      role === "student"
                        ? "student@campus.edu"
                        : role === "faculty"
                        ? "faculty@campus.edu"
                        : "admin@campus.edu"
                    }
                    className={`w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none transition-all ${
                      role === "student"
                        ? "focus:border-[#00CEE6]"
                        : role === "faculty"
                        ? "focus:border-[#825FEF]"
                        : "focus:border-[#11233D]"
                    }`}
                  />
                </div>
              </div>

              {/* 2. Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <label className="text-[11px] font-bold text-[#11233D]/75 block">
                    Password
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => switchMode("forgot_password")}
                      className="text-[11px] font-semibold text-[#825FEF] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#ACBACC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl pl-10 pr-12 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none transition-all ${
                      role === "student"
                        ? "focus:border-[#00CEE6]"
                        : role === "faculty"
                        ? "focus:border-[#825FEF]"
                        : "focus:border-[#11233D]"
                    }`}
                  />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#ACBACC] hover:text-[#11233D] transition-colors cursor-pointer z-20 rounded-full hover:bg-black/5 active:scale-90"
                    title={showPassword ? "Hide password" : "Show password"}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 3. Confirm Password Field (Sign Up Mode Only) */}
              {mode === "signup" && (
                <div>
                  <label className="text-[11px] font-bold text-[#11233D]/75 block mb-1.5 px-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#ACBACC] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-[#EEF3F6]/70 hover:bg-[#EEF3F6] focus:bg-white border-2 border-[#ACBACC]/40 rounded-2xl pl-10 pr-12 py-2.5 text-xs text-[#11233D] placeholder-[#ACBACC] font-medium shadow-[inset_0_2px_4px_rgba(17,35,61,0.03)] focus:outline-none transition-all ${
                        role === "student"
                          ? "focus:border-[#00CEE6]"
                          : role === "faculty"
                          ? "focus:border-[#825FEF]"
                          : "focus:border-[#11233D]"
                      }`}
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-[#ACBACC] hover:text-[#11233D] transition-colors cursor-pointer z-20 rounded-full hover:bg-black/5 active:scale-90"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-full font-black text-xs tracking-wide transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 active:scale-[0.98] border-2 border-white/25 disabled:opacity-60 ${
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
                      ? `Connecting ${activeProvider}...`
                      : mode === "signup"
                      ? "Creating Account..."
                      : "Authenticating..."
                    : mode === "signup"
                    ? "Create Account"
                    : "Sign In"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Judges Verification Demo Access Button (Instant 1-Click) */}
          <div className="mt-4 p-3 rounded-[24px] bg-gradient-to-r from-amber-500/10 via-amber-400/15 to-cyan-500/10 border-2 border-amber-400/40 shadow-[0_4px_16px_rgba(245,158,11,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.85)]">
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
                onClick={() => handleDemoLogin("student")}
                className="py-1.5 px-1 rounded-2xl bg-white hover:bg-[#00CEE6]/15 hover:border-[#00CEE6] text-[#11233D] border border-slate-200 text-[11px] font-black shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                title="Enter as Student (Ananya V.)"
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#00CEE6] mb-0.5 group-hover:scale-110 transition-transform" />
                <span>Student</span>
                <span className="text-[8.5px] font-medium text-slate-400">Score 74</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("faculty")}
                className="py-1.5 px-1 rounded-2xl bg-white hover:bg-[#825FEF]/15 hover:border-[#825FEF] text-[#11233D] border border-slate-200 text-[11px] font-black shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                title="Enter as Faculty (Prof. Rajesh Kumar)"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#825FEF] mb-0.5 group-hover:scale-110 transition-transform" />
                <span>Faculty</span>
                <span className="text-[8.5px] font-medium text-slate-400">Mentor</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin("admin")}
                className="py-1.5 px-1 rounded-2xl bg-white hover:bg-[#11233D]/15 hover:border-[#11233D] text-[#11233D] border border-slate-200 text-[11px] font-black shadow-xs transition-all flex flex-col items-center justify-center cursor-pointer active:scale-95 group"
                title="Enter as Admin (Dr. Srinivas Rao)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#11233D] mb-0.5 group-hover:scale-110 transition-transform" />
                <span>Admin</span>
                <span className="text-[8.5px] font-medium text-slate-400">HOD L3</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#ACBACC]/25" />
            </div>
            <span className="relative bg-white px-3 text-[10.5px] font-bold uppercase tracking-wider text-[#ACBACC]">
              {mode === "signup" ? "or register with" : "or continue with"}
            </span>
          </div>

          {/* Social / SSO Buttons: Google, Facebook, Apple */}
          <div className="flex items-center justify-center gap-3.5">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("google", "Google")}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-[#EEF3F6] hover:bg-white border-2 border-[#ACBACC]/45 shadow-[0_3px_8px_rgba(17,35,61,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:border-[#ACBACC] active:scale-95 transition-all flex items-center justify-center cursor-pointer group disabled:opacity-50"
              title="Sign in with Google"
              aria-label="Sign in with Google"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="w-5 h-5 transition-transform group-hover:scale-110"
                style={{ width: "20px", height: "20px", minWidth: "20px", minHeight: "20px" }}
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("facebook", "Facebook")}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-[#EEF3F6] hover:bg-white border-2 border-[#ACBACC]/45 shadow-[0_3px_8px_rgba(17,35,61,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:border-[#ACBACC] active:scale-95 transition-all flex items-center justify-center cursor-pointer group disabled:opacity-50"
              title="Sign in with Facebook"
              aria-label="Sign in with Facebook"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="#1877F2"
                className="w-5 h-5 transition-transform group-hover:scale-110"
                style={{ width: "20px", height: "20px", minWidth: "20px", minHeight: "20px" }}
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("apple", "Apple")}
              disabled={loading}
              className="w-12 h-12 rounded-2xl bg-[#EEF3F6] hover:bg-white border-2 border-[#ACBACC]/45 shadow-[0_3px_8px_rgba(17,35,61,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.8)] hover:border-[#ACBACC] active:scale-95 transition-all flex items-center justify-center cursor-pointer group disabled:opacity-50"
              title="Sign in with Apple"
              aria-label="Sign in with Apple"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 transition-transform group-hover:scale-110 text-[#11233D]"
                style={{ width: "20px", height: "20px", minWidth: "20px", minHeight: "20px" }}
              >
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.9.04-2 .6-2.65 1.35-.58.66-1.1 1.73-.96 2.76 1.01.08 1.99-.51 2.6-1.26z" />
              </svg>
            </button>
          </div>

          {/* Bottom Mode Switcher */}
          <div className="mt-5 pt-3.5 border-t-2 border-[#ACBACC]/25 text-center">
            {mode === "signup" ? (
              <p className="text-xs text-[#11233D]/65">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-bold text-[#825FEF] hover:underline cursor-pointer"
                >
                  Sign in
                </button>
              </p>
            ) : mode === "signin" ? (
              <p className="text-xs text-[#11233D]/65">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signup")}
                  className="font-bold text-[#825FEF] hover:underline cursor-pointer"
                >
                  Create account
                </button>
              </p>
            ) : (
              <p className="text-xs text-[#11233D]/65">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => switchMode("signin")}
                  className="font-bold text-[#825FEF] hover:underline cursor-pointer"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
