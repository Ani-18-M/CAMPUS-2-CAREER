"use client";

import React, { useState } from "react";
import { Sparkles, Sliders, ArrowUpRight, CheckCircle2, RotateCcw } from "lucide-react";

export default function WhatIfScoreSimulator() {
  const baseScore = 74;
  const [labSessions, setLabSessions] = useState(2);
  const [dsaProblems, setDsaProblems] = useState(5);
  const [certVerified, setCertVerified] = useState(true);

  // Dynamic score calculator
  const attendanceRecovery = labSessions * 3; // +6 points for 2 sessions
  const dsaRecovery = Math.min(8, Math.round(dsaProblems * 1.6)); // +8 points for 5 problems
  const certBonus = certVerified ? 4 : 0;
  
  const projectedScore = Math.min(100, baseScore + attendanceRecovery + dsaRecovery + certBonus);
  const delta = projectedScore - baseScore;

  const handleReset = () => {
    setLabSessions(0);
    setDsaProblems(0);
    setCertVerified(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ACBACC]/20 gap-3">
        <div>
          <span className="text-xs font-bold text-[#825FEF] uppercase tracking-wider">
            KPMG Requirement 2 · Predictive Modeling
          </span>
          <h3 className="text-xl font-extrabold text-[#11233D] mt-0.5">
            "What-If" Success Score Simulator
          </h3>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#ACBACC] hover:text-[#11233D] transition-colors self-start sm:self-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Simulation</span>
        </button>
      </div>

      {/* Simulator Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
        {/* Left Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Control 1: Make-up Lab Sessions */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#11233D]">
                Make-up Lab Attendance Sessions: <strong className="text-[#825FEF]">{labSessions} sessions</strong>
              </span>
              <span className="font-semibold text-emerald-600">+{attendanceRecovery} pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              value={labSessions}
              onChange={(e) => setLabSessions(Number(e.target.value))}
              className="w-full accent-[#00CEE6] h-2 bg-[#EFF4F7] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#ACBACC]">
              <span>0 (Deficit at 68%)</span>
              <span>2 (Clears 75% cutoff)</span>
              <span>4 (Excellence 82%)</span>
            </div>
          </div>

          {/* Control 2: DSA Coding Challenges */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-[#11233D]">
                DSA Coding Solves (LeetCode/Mock): <strong className="text-[#825FEF]">{dsaProblems} solved</strong>
              </span>
              <span className="font-semibold text-emerald-600">+{dsaRecovery} pts</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={dsaProblems}
              onChange={(e) => setDsaProblems(Number(e.target.value))}
              className="w-full accent-[#00CEE6] h-2 bg-[#EFF4F7] rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#ACBACC]">
              <span>0 (Baseline)</span>
              <span>5 (Remedial Done)</span>
              <span>10 (Advanced Mastery)</span>
            </div>
          </div>

          {/* Control 3: Industry Certification Toggle */}
          <div className="p-4 rounded-2xl bg-[#EFF4F7]/60 border border-[#ACBACC]/25 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-bold text-[#11233D]">Cloud / Full-Stack Certification</h5>
              <p className="text-[11px] text-[#ACBACC]">AWS / Azure or Verified Faculty Project</p>
            </div>
            <button
              onClick={() => setCertVerified(!certVerified)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                certVerified
                  ? "bg-[#00CEE6] text-[#11233D] shadow-sm"
                  : "bg-white border border-[#ACBACC]/40 text-[#ACBACC]"
              }`}
            >
              {certVerified ? "Verified (+4 pts)" : "Not Included"}
            </button>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#11233D] rounded-3xl p-6 text-white text-center flex flex-col justify-between shadow-xl border border-[#ACBACC]/20">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00CEE6] bg-[#00CEE6]/15 px-3 py-1 rounded-full border border-[#00CEE6]/30">
              Simulated Projection
            </span>
            <div className="my-5 flex items-center justify-center gap-3">
              <div className="text-center">
                <span className="text-xs text-[#ACBACC] block">Current</span>
                <span className="text-3xl font-bold text-[#ACBACC]">{baseScore}</span>
              </div>
              <span className="text-2xl text-[#00CEE6]">➔</span>
              <div className="text-center">
                <span className="text-xs text-[#00CEE6] block font-bold">Simulated</span>
                <span className="text-5xl font-black text-white">{projectedScore}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-1">
            <span className="text-xs font-bold text-emerald-400">
              Potential Recovery: +{delta} Points
            </span>
            <p className="text-[11px] text-[#ACBACC]">
              {projectedScore >= 85
                ? "🚀 Unlocks Super-Dream Tier-1 Placements (Top Product MNCs)"
                : "Eligible for Core IT & Tier-2 Drives"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
