"use client";

import React from "react";
import { Sparkles, Mic, MicOff, ArrowUpRight } from "lucide-react";

interface OverviewHeroProps {
  studentName?: string;
  department?: string;
  semester?: string;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function OverviewHero({
  studentName = "Ananya V.",
  department = "Computer Science & Engineering",
  semester = "7th Semester",
  isVoiceActive,
  onToggleVoice,
  onNavigateTab,
}: OverviewHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#162B47] to-[#11233D] text-white p-4 sm:p-7 border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.2)]">
      {/* Soft Ambient Brand Lights */}
      <div className="absolute -right-8 -top-8 w-72 h-72 bg-[#00CEE6]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute right-48 -bottom-8 w-64 h-64 bg-[#825FEF]/14 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-5">
        {/* Left: Clean Minimal Greeting */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold bg-[#00CEE6]/20 text-[#00CEE6] border border-[#00CEE6]/40">
              <Sparkles className="w-3 h-3" />
              CSE · Sem 7
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-300">
              Target: <strong className="text-white">Tier-1 SDE</strong>
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            Welcome, {studentName}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-300 font-medium">
            Daily schedule, verified gate pass, and placement roadmap.
          </p>
        </div>

        {/* Right: Tactile Quick Actions */}
        <div className="flex items-center gap-2 shrink-0 self-start md:self-auto pt-1 sm:pt-0">
          <button
            onClick={onToggleVoice}
            className={`flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-black transition-all cursor-pointer shadow-md ${
              isVoiceActive
                ? "bg-rose-500 text-white animate-pulse"
                : "bg-[#00CEE6] text-[#11233D] hover:bg-[#00BCD4] shadow-[0_4px_14px_rgba(0,206,230,0.3)]"
            }`}
          >
            {isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{isVoiceActive ? "Listening..." : "Career AI"}</span>
          </button>

          <button
            onClick={() => onNavigateTab("Career Paths")}
            className="flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer"
          >
            <span>8 Pathways</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00CEE6]" />
          </button>
        </div>
      </div>
    </div>
  );
}
