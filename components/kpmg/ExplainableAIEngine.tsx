"use client";

import React, { useState } from "react";
import { Sparkles, FileText, Download, Check, ArrowRight, ShieldCheck, Info } from "lucide-react";

interface ExplainableAIEngineProps {
  onOpenRecovery: () => void;
}

export default function ExplainableAIEngine({ onOpenRecovery }: ExplainableAIEngineProps) {
  const [downloading, setDownloading] = useState(false);

  const handleExportPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("KPMG Explainability Audit Report (PDF) downloaded successfully for Roll: 21BCE1089.");
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ACBACC]/20 gap-3">
        <div>
          <span className="text-xs font-bold text-[#825FEF] uppercase tracking-wider">
            KPMG Requirement 6 · Explainable AI (XAI)
          </span>
          <h3 className="text-xl font-extrabold text-[#11233D] mt-0.5">
            Explainable Success Score & Risk Flags
          </h3>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={downloading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#EFF4F7] hover:bg-[#11233D] hover:text-white text-[#11233D] border border-[#ACBACC]/30 transition-all cursor-pointer self-start sm:self-center"
        >
          <Download className="w-3.5 h-3.5 text-[#00CEE6]" />
          <span>{downloading ? "Generating PDF..." : "Export KPMG Audit Report (PDF)"}</span>
        </button>
      </div>

      {/* Factor Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Positive Drivers Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">
              Positive Drivers (+27 pts)
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Strengths
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              +15
            </div>
            <div>
              <h5 className="text-xs font-bold text-emerald-950">Academic Consistency</h5>
              <p className="text-[11px] text-emerald-800 mt-0.5">CGPA 8.42 across Sem 1–6 with 0 active backlogs</p>
              <span className="text-[9px] font-mono text-emerald-700 mt-1 inline-block">Rule: CS-EVAL-CGPA-30%</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              +12
            </div>
            <div>
              <h5 className="text-xs font-bold text-emerald-950">Verified Practical Portfolio</h5>
              <p className="text-[11px] text-emerald-800 mt-0.5">2 faculty-verified GitHub repos + Next.js certification</p>
              <span className="text-[9px] font-mono text-emerald-700 mt-1 inline-block">Rule: CS-PORTFOLIO-15%</span>
            </div>
          </div>
        </div>

        {/* Negative Risk Penalties Column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-rose-800 uppercase tracking-wider">
              Risk Penalties (-16 pts)
            </span>
            <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Penalties
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              -10
            </div>
            <div>
              <h5 className="text-xs font-bold text-rose-950">Attendance Shortfall</h5>
              <p className="text-[11px] text-rose-800 mt-0.5">68.4% is 6.6% below the 75% institutional cutoff</p>
              <span className="text-[9px] font-mono text-rose-700 mt-1 inline-block">Policy: CS-REG-2026-ATT</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              -6
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-950">Missed Technical Assessment</h5>
              <p className="text-[11px] text-amber-800 mt-0.5">DBMS indexing mock quiz not attempted last week</p>
              <span className="text-[9px] font-mono text-amber-700 mt-1 inline-block">Policy: CS-ASSESS-DBMS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Action Footer */}
      <div className="pt-4 border-t border-[#ACBACC]/20 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
        <span className="text-slate-600">
          Total Recoverable Penalty: <strong className="text-emerald-700 font-bold">+16 points available</strong>
        </span>
        <button
          onClick={onOpenRecovery}
          className="bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm self-start sm:self-center"
        >
          <span>Open Recovery Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
