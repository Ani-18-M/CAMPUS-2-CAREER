"use client";

import React from "react";
import { BookOpen, Calendar, ArrowRight, CheckSquare } from "lucide-react";

interface InterventionsCardProps {
  onNavigateTab: (tab: string) => void;
}

export default function InterventionsCard({ onNavigateTab }: InterventionsCardProps) {
  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05)] hover:shadow-md transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#11233D] text-[#00CEE6] flex items-center justify-center shrink-0 shadow-sm">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00CEE6] block">
                Action Plan
              </span>
              <h3 className="text-base font-black text-[#11233D] leading-tight">
                Faculty Remedial Tasks
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
            2 Due
          </span>
        </div>

        {/* Action Items List */}
        <div className="space-y-3 my-4">
          {/* Task 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-[#00CEE6] transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-black text-[#11233D] truncate">
                    Graph Traversal DSA
                  </h4>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    +8 pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  5 coding questions · Due in 3d
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("Interventions")}
              className="bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              Start
            </button>
          </div>

          {/* Task 2 */}
          <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-[#00CEE6] transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs font-black text-[#11233D] truncate">
                    Saturday Make-up Lab
                  </h4>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    +6 pts
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  Lab 03 · Restores Attendance
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab("Permissions")}
              className="bg-[#00CEE6] hover:bg-[#00BCD4] text-[#11233D] px-3.5 py-1.5 rounded-xl text-xs font-black transition-colors shrink-0 cursor-pointer shadow-2xs"
            >
              Book
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-emerald-700 font-bold">
          Recovery: 74 → <strong className="font-black">88 / 100</strong>
        </span>
        <button
          onClick={() => onNavigateTab("Interventions")}
          className="font-black text-[#825FEF] hover:text-[#00CEE6] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
