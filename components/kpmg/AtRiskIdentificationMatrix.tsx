"use client";

import React from "react";
import { ShieldCheck, Clock, ArrowRight, UserCheck } from "lucide-react";

interface AtRiskIdentificationMatrixProps {
  onResolve: () => void;
}

export default function AtRiskIdentificationMatrix({ onResolve }: AtRiskIdentificationMatrixProps) {
  const riskTiers = [
    {
      level: "Low Risk (Safe)",
      range: "Score > 80",
      description: "Cleared for Super-Dream drives (>20 LPA). Zero backlogs.",
      isCurrent: false,
      color: "border-slate-200 text-slate-400 bg-white",
    },
    {
      level: "Moderate Risk",
      range: "Score 65 – 79",
      description: "Conditional placement status. Resolvable via assigned remedial interventions.",
      isCurrent: true,
      color: "border-amber-400 bg-amber-50/70 text-amber-900 shadow-md ring-2 ring-amber-400/30",
    },
    {
      level: "Critical Risk",
      range: "Score < 65",
      description: "Barred from campus drives. Mandatory HOD counseling & credit review.",
      isCurrent: false,
      color: "border-slate-200 text-slate-400 bg-white",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ACBACC]/20 gap-3">
        <div>
          <span className="text-xs font-bold text-[#825FEF] uppercase tracking-wider">
            KPMG Requirement 3 · Early-Warning Engine
          </span>
          <h3 className="text-xl font-extrabold text-[#11233D] mt-0.5">
            At-Risk Student Identification
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-amber-100 text-amber-800 px-3 py-1 rounded-full border border-amber-300">
            Current: Moderate Risk Tier
          </span>
        </div>
      </div>

      {/* 3-Tier Risk Hierarchy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {riskTiers.map((tier, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-all ${tier.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider">{tier.level}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-current">
                {tier.range}
              </span>
            </div>
            <p className="text-xs leading-relaxed mt-2 opacity-90">{tier.description}</p>
            {tier.isCurrent && (
              <span className="inline-block mt-3 text-[10px] font-extrabold bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
                Active Student Status
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Active Trigger Flags & Escalation Workflow */}
      <div className="p-5 rounded-2xl bg-[#EFF4F7]/70 border border-[#ACBACC]/25 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-[10px] font-bold bg-[#11233D] text-[#00CEE6] px-2 py-0.5 rounded-md">
              TRIGGER: RULE-ATT-075
            </span>
            <span className="text-xs font-bold text-[#11233D]">
              Attendance Deficit (68.4% &lt; 75% Cutoff)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#ACBACC] flex-wrap">
            <span className="flex items-center gap-1 text-[#11233D] font-medium">
              <UserCheck className="w-3.5 h-3.5 text-[#825FEF]" />
              Escalated to: Dr. Srinivas Rao (Mentor)
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-rose-600 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              14 Days to Clear Before Tier-1 Registration Lock
            </span>
          </div>
        </div>

        <button
          onClick={onResolve}
          className="bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-2 shadow-sm"
        >
          <span>Open Recovery Actions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
