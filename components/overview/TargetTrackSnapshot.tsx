"use client";

import React from "react";
import { Target, ArrowRight, CheckCircle2, Compass, Sparkles } from "lucide-react";

interface TargetTrackSnapshotProps {
  onNavigateTab: (tab: string) => void;
  successScore?: number;
}

export default function TargetTrackSnapshot({
  onNavigateTab,
  successScore = 74,
}: TargetTrackSnapshotProps) {
  const readinessPercent = Math.min(100, Math.round((successScore / 85) * 100));

  const milestones = [
    { label: "Core DSA", status: "76%", ok: true },
    { label: "System Design", status: "Review Needed", ok: false },
    { label: "Full Stack Projects", status: "88%", ok: true },
    { label: "Attendance (≥75%)", status: "68.4% (Action)", ok: false },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-[28px] p-4 sm:p-7 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05)] hover:shadow-md transition-all flex flex-col justify-between h-full">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 sm:pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#11233D] text-[#00CEE6] flex items-center justify-center shrink-0 shadow-sm">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#00CEE6] block">
                Career Track
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#11233D] leading-tight">
                Tier-1 SDE Placement
              </h3>
            </div>
          </div>

          <span className="text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#825FEF]/15 text-[#825FEF] border border-[#825FEF]/30">
            24+ LPA Target
          </span>
        </div>

        {/* Readiness Meter */}
        <div className="my-3 sm:my-5 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F5F8FA] to-[#EFF4F7] border border-slate-200/70">
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <span className="text-xs font-bold text-[#11233D]">
              Placement Readiness
            </span>
            <span className="text-xs sm:text-sm font-black text-[#11233D]">
              {successScore} <span className="text-[11px] sm:text-xs font-bold text-slate-400">/ 100</span>
            </span>
          </div>

          <div className="w-full h-2.5 sm:h-3 bg-white rounded-full overflow-hidden border border-slate-200 p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#00CEE6] to-[#825FEF] transition-all duration-500 shadow-sm"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-[11px]">
            <span className="text-slate-500 font-medium">Cutoff: 80 pts</span>
            <span className="font-extrabold text-[#825FEF]">
              {80 - successScore > 0 ? `${80 - successScore} pts to unlock Tier-1 MNCs` : "Target Cleared"}
            </span>
          </div>
        </div>

        {/* Track Milestones Checklist */}
        <div className="space-y-2">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 block">
            Core Milestones
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  {m.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B] shrink-0 mx-0.5" />
                  )}
                  <span className="font-bold text-[#11233D] text-[11px] sm:text-xs truncate">{m.label}</span>
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${
                    m.ok
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          Alternative: GATE · Research · Startups
        </span>
        <button
          onClick={() => onNavigateTab("Career Paths")}
          className="w-full sm:w-auto ml-auto flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-black bg-[#11233D] text-white hover:bg-[#00CEE6] hover:text-[#11233D] transition-all cursor-pointer shadow-sm group"
        >
          <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          <span>Explore 8 Pathways</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
