"use client";

import React from "react";
import { TrendingUp, Briefcase, CheckSquare, ShieldCheck } from "lucide-react";

interface KpiMetricsGridProps {
  onNavigateTab: (tab: string) => void;
  successScore?: number;
  attendanceRate?: string;
}

export default function KpiMetricsGrid({
  onNavigateTab,
  successScore = 74,
  attendanceRate = "68.4%",
}: KpiMetricsGridProps) {
  const isAttendanceSafe = parseFloat(attendanceRate) >= 75;

  const metrics = [
    {
      id: "score",
      label: "Success Score",
      value: String(successScore),
      sub: "/ 100",
      badge: "Target: 80+",
      badgeColor: "bg-[#00CEE6]/15 text-[#11233D] border-[#00CEE6]/40",
      targetTab: "Success Score",
      icon: TrendingUp,
    },
    {
      id: "attendance",
      label: "Attendance",
      value: attendanceRate,
      sub: "",
      badge: isAttendanceSafe ? "Safe (≥75%)" : "Cutoff: 75%",
      badgeColor: isAttendanceSafe
        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
        : "bg-amber-50 text-amber-800 border-amber-200",
      targetTab: "Attendance",
      icon: ShieldCheck,
      dotColor: isAttendanceSafe
        ? "bg-emerald-500 shadow-[0_0_6px_#10B981]"
        : "bg-amber-500 shadow-[0_0_6px_#F59E0B]",
    },
    {
      id: "interventions",
      label: "Action Plan",
      value: "2",
      sub: "Tasks Due",
      badge: "+14 pts Gain",
      badgeColor: "bg-[#825FEF]/15 text-[#825FEF] border-[#825FEF]/30",
      targetTab: "Interventions",
      icon: CheckSquare,
    },
    {
      id: "drives",
      label: "Campus Drives",
      value: "78",
      sub: "Active",
      badge: "14 Eligible",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-300",
      targetTab: "Career Paths",
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <div
            key={m.id}
            onClick={() => onNavigateTab(m.targetTab)}
            className="group bg-white rounded-2xl sm:rounded-[28px] p-3.5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05)] hover:shadow-lg hover:border-[#00CEE6] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400 group-hover:text-[#11233D] transition-colors truncate">
                {m.label}
              </span>
              {m.dotColor ? (
                <span className={`w-2.5 h-2.5 rounded-full ${m.dotColor} shrink-0`} />
              ) : Icon ? (
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-[#00CEE6] transition-colors shrink-0" />
              ) : null}
            </div>

            {/* Stat Value */}
            <div className="my-1.5 sm:my-3 flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-2xl sm:text-4xl font-black text-[#11233D] tracking-tight">
                {m.value}
              </span>
              {m.sub && (
                <span className="text-[11px] sm:text-xs font-bold text-slate-400">
                  {m.sub}
                </span>
              )}
            </div>

            {/* Status Chip */}
            <div>
              <span
                className={`inline-block text-[10px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full border ${m.badgeColor}`}
              >
                {m.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
