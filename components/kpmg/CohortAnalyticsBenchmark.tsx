"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Target, Users, Award } from "lucide-react";

export default function CohortAnalyticsBenchmark() {
  const [selectedCohort, setSelectedCohort] = useState<"all" | "tier1">("tier1");

  const pillars = [
    { name: "Academics (CGPA)", student: 84, batchAvg: 72, placedAvg: 80 },
    { name: "Coding & DSA", student: 76, batchAvg: 61, placedAvg: 82 },
    { name: "Projects & Labs", student: 88, batchAvg: 68, placedAvg: 78 },
    { name: "Soft Skills & Mock", student: 62, batchAvg: 65, placedAvg: 75 },
    { name: "Attendance Ratio", student: 68, batchAvg: 78, placedAvg: 85 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ACBACC]/20 gap-3">
        <div>
          <span className="text-xs font-bold text-[#825FEF] uppercase tracking-wider">
            KPMG Requirement 4 · Comparative Intelligence
          </span>
          <h3 className="text-xl font-extrabold text-[#11233D] mt-0.5">
            Interactive Cohort Analytics & Placement Odds
          </h3>
        </div>

        {/* Cohort Toggle */}
        <div className="flex items-center gap-1 bg-[#EFF4F7] p-1 rounded-2xl border border-[#ACBACC]/30">
          <button
            onClick={() => setSelectedCohort("tier1")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCohort === "tier1"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-[#ACBACC] hover:text-[#11233D]"
            }`}
          >
            Tier-1 Aspirants (65 Students)
          </button>
          <button
            onClick={() => setSelectedCohort("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCohort === "all"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-[#ACBACC] hover:text-[#11233D]"
            }`}
          >
            All CSE Batch (180 Students)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        {/* Left: Comparative Pillar Bars (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#ACBACC] font-semibold pb-1">
            <span>Pillar</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-[#11233D] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#00CEE6]" /> You
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#ACBACC]" /> Batch Avg
              </span>
              <span className="flex items-center gap-1.5 text-[#825FEF] font-bold">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#825FEF]" /> Tier-1 Cutoff
              </span>
            </div>
          </div>

          {pillars.map((p, idx) => (
            <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-[#EFF4F7]/40 border border-[#ACBACC]/20">
              <div className="flex justify-between text-xs font-bold text-[#11233D]">
                <span>{p.name}</span>
                <span className="font-mono text-[#00CEE6]">{p.student} / 100</span>
              </div>
              <div className="relative h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">
                {/* Batch Avg Marker */}
                <div
                  className="absolute top-0 bottom-0 bg-[#ACBACC] rounded-full z-10"
                  style={{ width: `${p.batchAvg}%` }}
                />
                {/* Student Score Bar */}
                <div
                  className="absolute top-0 bottom-0 bg-gradient-to-r from-[#00CEE6] to-[#825FEF] rounded-full z-20"
                  style={{ width: `${p.student}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Right: Predictive Placement Probability Box (5 cols) */}
        <div className="lg:col-span-5 bg-[#EFF4F7]/80 rounded-3xl p-6 border border-[#ACBACC]/30 space-y-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#825FEF] bg-[#825FEF]/10 px-2.5 py-1 rounded-full border border-[#825FEF]/20">
              Placement Conversion Odds
            </span>
            <h4 className="text-base font-extrabold text-[#11233D] mt-2">
              Corporate Offer Likelihood
            </h4>
          </div>

          <div className="space-y-3">
            {/* Tier-1 Product Probability */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#ACBACC]/25 shadow-xs">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-[#11233D]">Tier-1 Product (Top Tech & MNCs)</span>
                <span className="font-extrabold text-amber-600">52% (Conditional)</span>
              </div>
              <p className="text-[10px] text-[#ACBACC]">
                Jumps to <strong className="text-emerald-600 font-bold">88%</strong> once attendance &gt; 75% clears Tier-1 lock.
              </p>
            </div>

            {/* Tier-2 Enterprise IT Probability */}
            <div className="p-3.5 bg-white rounded-2xl border border-[#ACBACC]/25 shadow-xs">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-[#11233D]">Tier-2 Enterprise (Deloitte/TCS)</span>
                <span className="font-extrabold text-emerald-600">96% (High)</span>
              </div>
              <p className="text-[10px] text-[#ACBACC]">
                Meets all academic CGPA (8.42) and portfolio benchmarks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
