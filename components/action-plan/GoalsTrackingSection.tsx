"use client";

import React from "react";
import { Target, Plus, CheckCircle2, Award, Calendar, HelpCircle } from "lucide-react";
import { GoalItem } from "./CreateGoalModal";

interface GoalsTrackingSectionProps {
  goals: GoalItem[];
  onOpenCreateGoal: () => void;
}

export default function GoalsTrackingSection({
  goals,
  onOpenCreateGoal,
}: GoalsTrackingSectionProps) {
  return (
    <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-300/60 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#825FEF]/15 text-[#825FEF] border border-[#825FEF]/30 shadow-2xs">
              Personal Targets
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#11233D] mt-0.5">
            Goals & Progress Tracking
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Personal targets to bridge skill gaps and maintain momentum.
          </p>
        </div>

        <button
          onClick={onOpenCreateGoal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer self-start sm:self-center shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Set New Goal</span>
        </button>
      </div>

      {/* Goals Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {goals.map((g) => {
          const progressPercent = Math.min(
            100,
            Math.max(0, Math.round((g.currentValue / g.targetValue) * 100))
          );

          return (
            <div
              key={g.id}
              className="p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border-2 border-slate-200/90 bg-white/95 flex flex-col justify-between hover:border-[#00CEE6]/80 hover:shadow-[0_12px_28px_rgba(17,35,61,0.08),inset_0_2px_4px_rgba(255,255,255,1)] transition-all shadow-[0_8px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] min-h-[185px]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#11233D] text-[#00CEE6]">
                    {g.category}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#825FEF]" />
                    {g.targetDate}
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-[#11233D] leading-tight line-clamp-1 mt-1">
                  {g.title}
                </h3>

                <div className="my-3 space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium">
                      Current: <strong className="text-[#11233D] font-black">{g.currentValue}{g.unit}</strong>
                    </span>
                    <span className="text-slate-500 font-medium">
                      Target: <strong className="text-emerald-700 font-black">{g.targetValue}{g.unit}</strong>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.08)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00CEE6] to-[#825FEF] transition-all duration-500 shadow-xs"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 text-xs text-slate-500 font-medium flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{g.measure}</span>
                <span className="text-xs font-black text-[#825FEF] bg-[#825FEF]/10 px-2.5 py-0.5 rounded-full">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
