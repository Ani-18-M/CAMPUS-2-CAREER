"use client";

import React from "react";
import { TrendingUp, CheckSquare, CheckCircle2, Calendar, ArrowUpRight, Sparkles } from "lucide-react";

interface ActionPlanHeaderProps {
  successScore?: number;
  activeActionsCount: number;
  completedActionsCount: number;
  overdueActionsCount: number;
  nextDeadline?: string;
  onNavigateTab: (tab: string) => void;
}

export default function ActionPlanHeader({
  successScore = 74,
  activeActionsCount = 6,
  completedActionsCount = 12,
  overdueActionsCount = 2,
  nextDeadline = "16 Oct · DBMS Lab",
  onNavigateTab,
}: ActionPlanHeaderProps) {
  const kpiCards = [
    {
      id: "score",
      label: "Success Score",
      value: `${successScore}/100`,
      badge: "Target: 80+",
      badgeColor: "bg-[#00CEE6]/15 text-[#11233D] border-[#00CEE6]/40",
      clickable: true,
      onClick: () => onNavigateTab("Success Score"),
      icon: TrendingUp,
      accent: "border-[#00CEE6]/40 hover:border-[#00CEE6]",
    },
    {
      id: "active",
      label: "Active Actions",
      value: String(activeActionsCount),
      badge: "In Progress",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      clickable: false,
      icon: CheckSquare,
      accent: "border-slate-200",
    },
    {
      id: "completed",
      label: "Completed",
      value: String(completedActionsCount),
      badge: "Verified",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      clickable: false,
      icon: CheckCircle2,
      accent: "border-slate-200",
    },
    {
      id: "overdue",
      label: "Overdue",
      value: String(overdueActionsCount),
      badge: "Needs Action",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      clickable: false,
      icon: null,
      dotColor: "bg-rose-500 shadow-[0_0_6px_#F43F5E]",
      accent: "border-rose-200/80",
    },
    {
      id: "deadline",
      label: "Next Deadline",
      value: "16 Oct",
      badge: "3 days left",
      badgeColor: "bg-[#825FEF]/15 text-[#825FEF] border-[#825FEF]/30",
      clickable: false,
      icon: Calendar,
      accent: "border-slate-200",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Sleek Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] sm:rounded-[36px] bg-[#11233D] text-white p-6 sm:p-7 shadow-[0_14px_34px_rgba(17,35,61,0.25),inset_0_2px_4px_rgba(255,255,255,0.15)] border-2 border-slate-300/20">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-60 -bottom-10 w-60 h-60 bg-[#825FEF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#825FEF]/25 text-[#825FEF] border border-[#825FEF]/30">
                <Sparkles className="w-3 h-3 text-[#00CEE6]" />
                KPMG Decision Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
              My Action Plan
            </h1>
            <p className="text-xs sm:text-sm text-[#ACBACC] font-medium mt-1">
              Targeted interventions and milestones for academic and placement readiness.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("Success Score")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#00CEE6] text-[#11233D] hover:bg-[#00CEE6]/90 transition-all cursor-pointer shadow-sm self-start sm:self-center shrink-0"
          >
            <span>Score Breakdown</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5 Compact KPI Metric Cards — Pebble Theme & Slate Grey Background */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              onClick={kpi.onClick}
              className={`rounded-[26px] sm:rounded-[28px] p-4 sm:p-5 border-2 border-slate-200/90 bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] shadow-[0_10px_24px_rgba(17,35,61,0.06),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] transition-all duration-200 flex flex-col justify-between min-h-[136px] hover:shadow-[0_14px_30px_rgba(17,35,61,0.1),inset_0_2px_4px_rgba(255,255,255,1)] hover:border-[#00CEE6]/80 ${
                kpi.clickable ? "cursor-pointer" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {kpi.label}
                </span>
                {kpi.dotColor ? (
                  <span className={`w-2.5 h-2.5 rounded-full ${kpi.dotColor} shrink-0`} />
                ) : Icon ? (
                  <Icon className={`w-4 h-4 ${kpi.id === "score" ? "text-[#00CEE6]" : "text-slate-400"}`} />
                ) : null}
              </div>

              <div className="my-1.5">
                <span className="text-2xl sm:text-3xl font-black text-[#11233D] tracking-tight">
                  {kpi.value}
                </span>
              </div>

              <div>
                <span
                  className={`inline-block text-xs font-extrabold px-2.5 py-0.5 rounded-full border shadow-2xs ${kpi.badgeColor}`}
                >
                  {kpi.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
