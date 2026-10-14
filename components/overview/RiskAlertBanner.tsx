"use client";

import React from "react";
import { ArrowRight, Sparkles, X } from "lucide-react";

interface RiskAlertBannerProps {
  onResolve: () => void;
}

export default function RiskAlertBanner({ onResolve }: RiskAlertBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-300/80 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Alert Icon & Explanation */}
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500 shadow-[0_0_10px_#F59E0B]" />
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                Early-Warning Diagnostic
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#0F1E36]">
                2 Placement Season Flags Detected
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
              Attendance currently at <strong className="text-amber-900">68.4%</strong> (minimum required: 75.0%) and 1 pending DBMS quiz. Completing your 2 assigned faculty interventions restores your clearance and boosts your Success Score by{" "}
              <strong className="text-emerald-700 font-bold">+14 points</strong>.
            </p>
          </div>
        </div>

        {/* Right Side: Remediation Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={onResolve}
            className="flex items-center gap-2 bg-[#0F1E36] hover:bg-[#00D2EA] hover:text-[#0F1E36] text-white px-5 py-2.5 rounded-full text-xs font-extrabold transition-all duration-150 shadow-md hover:shadow-lg cursor-pointer group"
          >
            <span>Resolve Now (+14 pts)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="w-8 h-8 rounded-full hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
            title="Snooze alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
