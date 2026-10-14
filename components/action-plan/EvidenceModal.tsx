"use client";

import React from "react";
import { X, ShieldCheck, Database, FileText, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export interface EvidenceData {
  title: string;
  category: string;
  source: string;
  detectedDate: string;
  insight: string;
  threshold: string;
  currentValue: string;
  metrics: { label: string; value: string; benchmark: string; status: "risk" | "safe" | "warning" }[];
  explainability: string;
}

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvidenceData | null;
  onAddToPlan?: () => void;
}

export default function EvidenceModal({
  isOpen,
  onClose,
  data,
  onAddToPlan,
}: EvidenceModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-[32px] sm:rounded-[38px] shadow-[0_25px_60px_-15px_rgba(17,35,61,0.3),inset_0_2px_4px_rgba(255,255,255,0.95)] border-2 border-slate-300/80 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#11233D] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00CEE6]/20 border border-[#00CEE6]/30 flex items-center justify-center text-[#00CEE6]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00CEE6] block">
                Explainable AI Diagnostic
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                {data.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Diagnostic Context Bar */}
          <div className="p-4 rounded-2xl bg-[#EFF4F7] border border-[#ACBACC]/40 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Data Source</span>
              <span className="font-black text-[#11233D]">{data.source}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Detected On</span>
              <span className="font-black text-[#11233D]">{data.detectedDate}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Current Level</span>
              <span className="font-black text-amber-700">{data.currentValue}</span>
            </div>
            <div>
              <span className="text-slate-400 font-bold block text-[10px] uppercase">Threshold Target</span>
              <span className="font-black text-emerald-700">{data.threshold}</span>
            </div>
          </div>

          {/* Institutional Benchmark Evidence Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Supporting Institutional Records
            </h4>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
              {data.metrics.map((m, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        m.status === "risk"
                          ? "bg-rose-500"
                          : m.status === "warning"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span className="font-bold text-[#11233D]">{m.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-[#11233D]">{m.value}</span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Benchmark: {m.benchmark}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainability Section */}
          <div className="p-4 rounded-2xl bg-[#825FEF]/10 border border-[#825FEF]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-[#825FEF]">
              <Sparkles className="w-4 h-4" />
              <span>Why This Matters</span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {data.explainability}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Verified Academic & Attendance Records
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onAddToPlan && (
              <button
                onClick={() => {
                  onAddToPlan();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Add to Action Plan</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
