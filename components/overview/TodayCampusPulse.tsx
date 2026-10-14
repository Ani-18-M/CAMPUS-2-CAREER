"use client";

import React from "react";
import { Clock, MapPin, QrCode, ArrowRight, UserCheck } from "lucide-react";

interface TodayCampusPulseProps {
  onOpenQR: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function TodayCampusPulse({
  onOpenQR,
  onNavigateTab,
}: TodayCampusPulseProps) {
  return (
    <div className="bg-white rounded-[28px] p-6 sm:p-7 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05)] hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#11233D] text-[#00CEE6] flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00CEE6] block">
                Daily Schedule
              </span>
              <h3 className="text-base font-black text-[#11233D] leading-tight">
                Campus Pulse & Pass
              </h3>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Day 3 · Active
          </span>
        </div>

        {/* Current Session Card */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-br from-[#EFF4F7] to-[#E4EBF2] border border-slate-200/70">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#11233D] bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
              Current Session
            </span>
            <span className="text-xs font-black text-[#11233D] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#00CEE6]" />
              10:00 AM – 12:00 PM
            </span>
          </div>

          <h4 className="text-sm font-black text-[#11233D] mt-2.5 leading-tight">
            Electronics & IoT Practical Lab
          </h4>

          <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-600 font-bold">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#00CEE6]" />
              Lab 03 · Block B
            </span>
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#825FEF]" />
              Dr. Srinivas
            </span>
          </div>
        </div>

        {/* Digital QR Gate Pass Bar */}
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#11233D] text-[#00CEE6] flex items-center justify-center shrink-0 shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h5 className="text-xs font-black text-[#11233D] truncate">
                Digital Gate & Lab Pass
              </h5>
              <p className="text-[11px] text-slate-500 font-medium truncate">
                Main Gate & Lab 03 Entry
              </p>
            </div>
          </div>

          <button
            onClick={onOpenQR}
            className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-[#00CEE6] text-[#11233D] hover:bg-[#00BCD4] transition-all cursor-pointer shrink-0 shadow-2xs"
          >
            Show QR
          </button>
        </div>
      </div>

      {/* Footer Navigation CTA */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          Attendance: <strong className="text-amber-700 font-black">68.4%</strong> (2 to 75%)
        </span>
        <button
          onClick={() => onNavigateTab("Attendance")}
          className="flex items-center gap-1.5 text-xs font-black text-[#11233D] hover:text-[#00CEE6] transition-colors cursor-pointer group"
        >
          <span>Schedule</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
