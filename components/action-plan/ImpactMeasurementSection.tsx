"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Info,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const impactTrendData = [
  { week: "W1", successScore: 64, codingScore: 38, attendance: 65 },
  { week: "W2", successScore: 66, codingScore: 40, attendance: 66 },
  { week: "W3", successScore: 65, codingScore: 42, attendance: 67 },
  { week: "W4", successScore: 68, codingScore: 45, attendance: 68 },
  { week: "W5", successScore: 71, codingScore: 50, attendance: 68 },
  { week: "W6", successScore: 72, codingScore: 55, attendance: 69 },
  { week: "W7", successScore: 74, codingScore: 62, attendance: 72 },
  { week: "W8 (Proj.)", successScore: 88, codingScore: 75, attendance: 76 },
];

export default function ImpactMeasurementSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const beforeAfterMetrics = [
    {
      label: "Algorithmic Coding",
      category: "Placement Diagnostic",
      beforeVal: "45 / 100",
      beforeDate: "Baseline",
      afterVal: "62 / 100",
      afterDate: "Current",
      change: "+17 pts",
      isPositive: true,
      context: "Graph module completed",
    },
    {
      label: "Assignment Completion",
      category: "Continuous Assessment",
      beforeVal: "65%",
      beforeDate: "Baseline",
      afterVal: "90%",
      afterDate: "Current",
      change: "+25%",
      isPositive: true,
      context: "Weekly study blocks active",
    },
    {
      label: "Course Attendance",
      category: "Eligibility Clearance",
      beforeVal: "68.4%",
      beforeDate: "Current",
      afterVal: "76.2%",
      afterDate: "Projected",
      change: "+7.8%",
      isPositive: true,
      context: "With Saturday make-up lab",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-300/60 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              Measurable Progress
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#11233D] mt-0.5">
            Measure Action Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Observed metrics before and after completed actions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 self-start sm:self-center">
          <Award className="w-4 h-4 text-[#825FEF]" />
          <span>Continuous Assessment Tracking</span>
        </div>
      </div>

      {/* Before vs. After Comparison Cards — Pebble Theme & Slate Grey Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {beforeAfterMetrics.map((m, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-[26px] sm:rounded-[30px] border-2 border-slate-200/90 bg-white/95 flex flex-col justify-between hover:border-[#00CEE6]/80 hover:shadow-[0_12px_28px_rgba(17,35,61,0.08),inset_0_2px_4px_rgba(255,255,255,1)] transition-all shadow-[0_8px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] min-h-[195px]"
          >
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                {m.category}
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#11233D] leading-tight line-clamp-1">
                {m.label}
              </h3>

              <div className="my-3 grid grid-cols-2 gap-2 text-xs">
                {/* Before */}
                <div className="p-3 rounded-2xl bg-slate-100/90 border border-slate-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                  <span className="text-xs font-bold text-slate-400 block uppercase">
                    Before
                  </span>
                  <span className="text-base sm:text-lg font-black text-slate-600 block mt-0.5">
                    {m.beforeVal}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {m.beforeDate}
                  </span>
                </div>

                {/* After */}
                <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 shadow-[inset_0_1px_2px_rgba(16,185,129,0.05)]">
                  <span className="text-xs font-bold text-emerald-800 block uppercase">
                    Observed
                  </span>
                  <span className="text-base sm:text-lg font-black text-emerald-700 block mt-0.5">
                    {m.afterVal}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold">
                    {m.afterDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-xs text-slate-500 font-medium truncate">
                {m.context}
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full shrink-0 ml-2 shadow-2xs">
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Over Time Line Chart — Pebble Slate Grey Card */}
      <div className="p-6 sm:p-7 rounded-[30px] sm:rounded-[36px] bg-gradient-to-br from-[#D5DEE7] via-[#E4EBF2] to-[#CBD6E2] border-2 border-slate-300/90 shadow-[0_12px_36px_-8px_rgba(71,85,105,0.15),inset_0_2px_4px_rgba(255,255,255,0.95)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-base font-black text-[#11233D]">
              Historical Progression Timeline (Weeks 1 – 8)
            </h4>
            <p className="text-xs text-slate-600 font-medium">
              Observes the correlation between completed tasks, diagnostic tests, and overall Success Score.
            </p>
          </div>
          <span className="text-xs font-bold text-[#825FEF] bg-[#825FEF]/10 px-3 py-1 rounded-full border border-[#825FEF]/20 self-start sm:self-center shadow-2xs">
            Projected Recovery: 88/100
          </span>
        </div>

        <div className="h-64 w-full">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={impactTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#475569", fontWeight: 700 }} />
                <YAxis domain={[30, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#11233D] text-white p-3 rounded-2xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-[#00CEE6]">{label}</p>
                          <p>Success Score: <span className="font-bold">{payload[0]?.value}/100</span></p>
                          <p>Coding Diagnostic: <span className="font-bold">{payload[1]?.value}/100</span></p>
                          <p>Attendance: <span className="font-bold">{payload[2]?.value}%</span></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "11px", fontWeight: 700, paddingTop: "8px" }}
                />
                <Line
                  type="monotone"
                  dataKey="successScore"
                  name="Success Score"
                  stroke="#00CEE6"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#00CEE6" }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="codingScore"
                  name="Coding Diagnostic"
                  stroke="#825FEF"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: "#825FEF" }}
                />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance %"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#10B981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
              Loading trend visualization...
            </div>
          )}
        </div>

        {/* Progress Context Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Observed progress across curriculum milestones and completed action items.</span>
        </div>
      </div>
    </div>
  );
}
