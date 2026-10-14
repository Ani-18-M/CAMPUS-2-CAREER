"use client";

import React, { useState } from "react";
import { TrendingDown, BookOpen, UserCheck, ArrowRight, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";

interface RiskItem {
  id: string;
  title: string;
  badge: string;
  detected: string;
  supportingEvidence: string;
  whyItMatters: string;
  studentAction: string;
  progressMeasure: string;
  actionButtonText: string;
}

interface RiskBasedActionsSectionProps {
  onImplementAction: (actionTitle: string) => void;
}

export default function RiskBasedActionsSection({
  onImplementAction,
}: RiskBasedActionsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("academic");

  const risks: Record<string, RiskItem> = {
    academic: {
      id: "academic",
      title: "Academic Performance",
      badge: "Targeted Revision",
      detected: "DBMS & OS scores dropped 14% across recent tests.",
      supportingEvidence: "DBMS Test 2: 62% · OS Quiz 2: 68%.",
      whyItMatters: "May lower semester SGPA below Day-1 cutoff.",
      studentAction: "Review Normalization and Virtual Memory notes.",
      progressMeasure: "Target ≥ 75% on Mid-Term 2 re-evaluation.",
      actionButtonText: "Add Review to Plan",
    },
    placement: {
      id: "placement",
      title: "Coding Readiness",
      badge: "Tier-1 Gap",
      detected: "Diagnostic score 45/100 (Tier-1 cutoff: 70+).",
      supportingEvidence: "Passed 3/10 test cases in Graph Traversals.",
      whyItMatters: "Recruiters screen on algorithmic problem solving.",
      studentAction: "Complete 5 recommended graph problems.",
      progressMeasure: "Target ≥ 65/100 on diagnostic re-test.",
      actionButtonText: "Start Coding Practice",
    },
    engagement: {
      id: "engagement",
      title: "LMS Learning Activity",
      badge: "Study Habit",
      detected: "Weekly LMS access down 35% with 2 labs pending.",
      supportingEvidence: "1.5 hrs/wk active vs 4.8 hrs cohort average.",
      whyItMatters: "Consistent weekly study prevents last-minute shortfall.",
      studentAction: "Submit OS Lab 3 and DS assignments.",
      progressMeasure: "100% submission rate and 4+ hrs/wk active time.",
      actionButtonText: "Apply Study Schedule",
    },
  };

  const currentRisk = risks[activeTab];

  return (
    <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-300/60 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#11233D]">
            Risk-Based Recommendations
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Clear indicators and recommended next steps to prevent academic or placement shortfall.
          </p>
        </div>

        {/* Domain Tabs Pod */}
        <div className="p-1.5 rounded-2xl bg-white/80 border-2 border-slate-200/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center gap-1.5 text-xs font-bold self-start sm:self-center shrink-0">
          {["academic", "placement", "engagement"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-1.5 rounded-xl capitalize transition-all cursor-pointer ${
                activeTab === t
                  ? "bg-gradient-to-b from-[#64748B] via-[#475569] to-[#334155] text-white font-black shadow-[0_4px_12px_rgba(30,41,59,0.35),inset_0_2px_3px_rgba(255,255,255,0.35)]"
                  : "text-slate-600 hover:text-[#11233D] hover:bg-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Explainability Card — Pebble Slate Grey Card */}
      <div className="p-6 sm:p-7 rounded-[30px] sm:rounded-[36px] bg-gradient-to-br from-[#D5DEE7] via-[#E4EBF2] to-[#CBD6E2] border-2 border-slate-300/90 shadow-[0_12px_36px_-8px_rgba(71,85,105,0.15),inset_0_2px_4px_rgba(255,255,255,0.95)] space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#11233D] flex items-center justify-center shrink-0 shadow-sm">
              <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#FBBF24]" />
            </div>
            <h3 className="text-base font-black text-[#11233D]">
              {currentRisk.title}
            </h3>
          </div>

          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
            {currentRisk.badge}
          </span>
        </div>

        {/* 4 Pillars — Pebble White Pods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 sm:p-5 rounded-[24px] bg-white/95 border-2 border-slate-200/90 shadow-[0_6px_16px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] space-y-1.5 min-h-[92px]">
            <span className="text-xs font-black uppercase text-[#00CEE6] block">
              Observed Gap
            </span>
            <p className="text-slate-700 font-bold leading-relaxed text-xs sm:text-sm">
              {currentRisk.detected}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-[24px] bg-white/95 border-2 border-slate-200/90 shadow-[0_6px_16px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] space-y-1.5 min-h-[92px]">
            <span className="text-xs font-black uppercase text-[#825FEF] block">
              Evidence
            </span>
            <p className="text-slate-700 font-bold leading-relaxed text-xs sm:text-sm">
              {currentRisk.supportingEvidence}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-[24px] bg-white/95 border-2 border-slate-200/90 shadow-[0_6px_16px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] space-y-1.5 min-h-[92px]">
            <span className="text-xs font-black uppercase text-rose-600 block">
              Impact
            </span>
            <p className="text-slate-700 font-bold leading-relaxed text-xs sm:text-sm">
              {currentRisk.whyItMatters}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-[24px] bg-white/95 border-2 border-slate-200/90 shadow-[0_6px_16px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] space-y-1.5 min-h-[92px]">
            <span className="text-xs font-black uppercase text-emerald-700 block">
              Action Plan
            </span>
            <p className="text-slate-700 font-bold leading-relaxed text-xs sm:text-sm">
              {currentRisk.studentAction}
            </p>
          </div>
        </div>

        {/* Measurement & Target */}
        <div className="p-4 sm:p-5 rounded-[24px] bg-[#11233D] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_8px_20px_rgba(17,35,61,0.25),inset_0_2px_4px_rgba(255,255,255,0.15)]">
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#00CEE6] block">
              Measurement & Target
            </span>
            <p className="text-xs text-slate-200 font-medium">
              {currentRisk.progressMeasure}
            </p>
          </div>

          <button
            onClick={() => onImplementAction(currentRisk.title)}
            className="px-4 py-2 rounded-xl text-xs font-black bg-[#00CEE6] hover:bg-[#00CEE6]/90 text-[#11233D] transition-all cursor-pointer shrink-0 shadow-sm flex items-center gap-1.5"
          >
            <span>{currentRisk.actionButtonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
