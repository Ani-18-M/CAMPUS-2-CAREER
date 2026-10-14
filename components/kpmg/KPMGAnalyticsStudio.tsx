"use client";

import React, { useState } from "react";
import UnifiedDataPipeline from "./UnifiedDataPipeline";
import WhatIfScoreSimulator from "./WhatIfScoreSimulator";
import AtRiskIdentificationMatrix from "./AtRiskIdentificationMatrix";
import CohortAnalyticsBenchmark from "./CohortAnalyticsBenchmark";
import SmartStudentSegmentation from "./SmartStudentSegmentation";
import ExplainableAIEngine from "./ExplainableAIEngine";
import { Sparkles, Sliders, BarChart3, Database, Layers } from "lucide-react";

interface KPMGAnalyticsStudioProps {
  onNavigateTab: (tab: string) => void;
}

export default function KPMGAnalyticsStudio({ onNavigateTab }: KPMGAnalyticsStudioProps) {
  const [activeKPMGTab, setActiveKPMGTab] = useState<
    "score" | "simulator" | "risk-segmentation" | "cohort" | "pipeline"
  >("score");

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
      {/* KPMG Module Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-[#ACBACC]/30 shadow-xs flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveKPMGTab("score")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKPMGTab === "score"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#11233D] hover:bg-[#EFF4F7]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00CEE6]" />
            <span>Success Score & XAI</span>
          </button>

          <button
            onClick={() => setActiveKPMGTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKPMGTab === "simulator"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#11233D] hover:bg-[#EFF4F7]"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-[#825FEF]" />
            <span>"What-If" Simulator</span>
          </button>

          <button
            onClick={() => setActiveKPMGTab("risk-segmentation")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKPMGTab === "risk-segmentation"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#11233D] hover:bg-[#EFF4F7]"
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B] shrink-0" />
            <span>Risk Flags & Segmentation</span>
          </button>

          <button
            onClick={() => setActiveKPMGTab("cohort")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKPMGTab === "cohort"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#11233D] hover:bg-[#EFF4F7]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#00CEE6]" />
            <span>Cohort Benchmarking</span>
          </button>

          <button
            onClick={() => setActiveKPMGTab("pipeline")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeKPMGTab === "pipeline"
                ? "bg-[#11233D] text-white shadow-xs"
                : "text-slate-600 hover:text-[#11233D] hover:bg-[#EFF4F7]"
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#825FEF]" />
            <span>Data Pipelines</span>
          </button>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider text-[#ACBACC] px-3 hidden md:inline">
          KPMG Enterprise Suite
        </span>
      </div>

      {/* Dynamic Tab Contents */}
      {activeKPMGTab === "score" && (
        <div className="space-y-6">
          <ExplainableAIEngine onOpenRecovery={() => onNavigateTab("Interventions")} />
          <WhatIfScoreSimulator />
        </div>
      )}

      {activeKPMGTab === "simulator" && (
        <div className="space-y-6">
          <WhatIfScoreSimulator />
        </div>
      )}

      {activeKPMGTab === "risk-segmentation" && (
        <div className="space-y-6">
          <AtRiskIdentificationMatrix onResolve={() => onNavigateTab("Interventions")} />
          <SmartStudentSegmentation />
        </div>
      )}

      {activeKPMGTab === "cohort" && (
        <div className="space-y-6">
          <CohortAnalyticsBenchmark />
        </div>
      )}

      {activeKPMGTab === "pipeline" && (
        <div className="space-y-6">
          <UnifiedDataPipeline />
        </div>
      )}
    </div>
  );
}
