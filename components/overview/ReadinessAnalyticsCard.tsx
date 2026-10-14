"use client";

import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Sparkles, TrendingUp, Target, Award } from "lucide-react";

const readinessData = [
  { pillar: "Coding/DSA", score: 76, benchmark: 70, color: "#00D2EA" },
  { pillar: "Academics", score: 84, benchmark: 75, color: "#7C5CFC" },
  { pillar: "Projects/Labs", score: 88, benchmark: 65, color: "#10B981" },
  { pillar: "Soft Skills", score: 62, benchmark: 68, color: "#F59E0B" },
  { pillar: "Resume ATS", score: 88, benchmark: 80, color: "#00D2EA" },
];

export default function ReadinessAnalyticsCard() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(15,30,54,0.05)] flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-bold text-[#00D2EA] uppercase tracking-wider">
            Predictive AI Engine
          </span>
          <h3 className="text-lg font-extrabold text-[#0F1E36] mt-0.5">
            Skill & Placement Readiness
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Benchmarked against 1,200+ previous Tier-1 placed graduates.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#00D2EA]" />
            <span className="font-semibold text-slate-600">Your Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-slate-300" />
            <span className="text-slate-400">Cutoff Avg</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-60 w-full my-4">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={readinessData}
              margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="pillar"
                tick={{ fontSize: 11, fill: "#475569", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#0F1E36] text-white p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-bold text-[#00D2EA]">{data.pillar}</p>
                        <p>Score: <span className="font-bold">{data.score} / 100</span></p>
                        <p className="text-slate-400">Institutional Benchmark: {data.benchmark}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {readinessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            Loading analytics...
          </div>
        )}
      </div>

      {/* Insight Summary Pill */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-2 text-slate-600">
          <Award className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Strongest pillar: <strong>Projects & Labs (88/100)</strong>
          </span>
        </div>
        <span className="text-[11px] font-bold text-[#F59E0B] bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 self-start sm:self-center">
          Growth Focus: Soft Skills (62/100)
        </span>
      </div>
    </div>
  );
}
