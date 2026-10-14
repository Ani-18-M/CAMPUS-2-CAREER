"use client";

import React from "react";
import { ChevronRight, Briefcase, ArrowRight } from "lucide-react";

interface UpcomingDrivesCardProps {
  onNavigateTab: (tab: string) => void;
}

export default function UpcomingDrivesCard({ onNavigateTab }: UpcomingDrivesCardProps) {
  const drives = [
    {
      id: "drive-1",
      company: "Amazon AWS",
      initials: "AW",
      role: "Cloud Software Engineer",
      package: "28 LPA",
      date: "Oct 18",
      status: "Eligible",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    {
      id: "drive-2",
      company: "Microsoft IDC",
      initials: "MS",
      role: "SDE 1 (Core Systems)",
      package: "32 LPA",
      date: "Oct 22",
      status: "80 pts Cutoff",
      statusColor: "bg-amber-50 text-amber-800 border-amber-200",
    },
    {
      id: "drive-3",
      company: "J.P. Morgan Chase",
      initials: "JP",
      role: "Software Analyst",
      package: "21 LPA",
      date: "Oct 26",
      status: "Eligible",
      statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05)] hover:shadow-md transition-all flex flex-col justify-between h-full">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#11233D] text-[#00CEE6] flex items-center justify-center shrink-0 shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00CEE6] block">
                Placement Pipeline
              </span>
              <h3 className="text-base font-black text-[#11233D] leading-tight">
                Top Campus Drives
              </h3>
            </div>
          </div>
          <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-[#825FEF]/15 text-[#825FEF] border border-[#825FEF]/30">
            78 Active
          </span>
        </div>

        {/* Drives List */}
        <div className="divide-y divide-slate-100 my-2">
          {drives.map((d) => (
            <div
              key={d.id}
              onClick={() => onNavigateTab("Career Paths")}
              className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50 -mx-2 px-2.5 rounded-2xl transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#11233D] text-[#00CEE6] flex items-center justify-center font-black text-xs shrink-0 shadow-2xs">
                  {d.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-[#11233D] truncate">
                      {d.company}
                    </h4>
                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-[#825FEF]/10 text-[#825FEF]">
                      {d.package}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{d.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-slate-400 font-bold hidden sm:inline">
                  {d.date}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${d.statusColor}`}>
                  {d.status}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#11233D] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          14 Drives match your profile
        </span>
        <button
          onClick={() => onNavigateTab("Career Paths")}
          className="font-black text-[#11233D] hover:text-[#00CEE6] transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>All Drives</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
