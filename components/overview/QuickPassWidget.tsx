"use client";

import React from "react";
import { QrCode, Clock, MapPin } from "lucide-react";

interface QuickPassWidgetProps {
  onOpenQR: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function QuickPassWidget({
  onOpenQR,
}: QuickPassWidgetProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)] flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-[#ACBACC]/20">
        <h3 className="text-base font-extrabold text-[#11233D]">
          Gate Pass
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00CEE6]/15 text-[#00CEE6] border border-[#00CEE6]/30">
          Active
        </span>
      </div>

      <div
        onClick={onOpenQR}
        className="my-3 p-3.5 rounded-2xl bg-[#EFF4F7]/70 hover:bg-[#EFF4F7] border border-[#ACBACC]/20 hover:border-[#00CEE6] transition-all cursor-pointer flex items-center gap-3.5 group"
      >
        <div className="w-11 h-11 rounded-xl bg-white border border-[#ACBACC]/40 flex items-center justify-center text-[#11233D] group-hover:bg-[#00CEE6] group-hover:text-white transition-colors shadow-sm shrink-0">
          <QrCode className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h4 className="text-xs font-bold text-[#11233D] truncate">
            Electronics Lab 03
          </h4>
          <p className="text-[11px] text-[#ACBACC] truncate">Today · 10:00 AM</p>
        </div>
      </div>

      <button
        onClick={onOpenQR}
        className="w-full bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <QrCode className="w-3.5 h-3.5" />
        <span>View QR Pass</span>
      </button>
    </div>
  );
}
