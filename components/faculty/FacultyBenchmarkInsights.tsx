"use client";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  Users,
  Download,
  Target,
  Activity,
  ArrowRight,
  Sparkles,
  BarChart2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DepartmentRow {
  dept: string;
  avgCGPA: number;
  avgAttendance: string;
  avgSuccessScore: number;
  placementPct: string;
  rank: number;
  isCurrent?: boolean;
}

interface Pillar {
  label: string;
  cse: number;
  batchAvg: number;
  topDept: number;
}

interface Correlation {
  label: string;
  r: number;
  strength: string;
  trend: "up" | "down";
}

interface HeatCell {
  value: number; // 0–100
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEPARTMENTS: DepartmentRow[] = [
  { dept: "CSE", avgCGPA: 7.84, avgAttendance: "76.2%", avgSuccessScore: 71.4, placementPct: "67.1%", rank: 2, isCurrent: true },
  { dept: "ECE", avgCGPA: 7.62, avgAttendance: "79.8%", avgSuccessScore: 68.3, placementPct: "61.4%", rank: 3 },
  { dept: "IT",  avgCGPA: 7.91, avgAttendance: "81.5%", avgSuccessScore: 73.2, placementPct: "71.2%", rank: 1 },
  { dept: "MECH",  avgCGPA: 7.20, avgAttendance: "83.4%", avgSuccessScore: 65.1, placementPct: "48.3%", rank: 4 },
  { dept: "CIVIL", avgCGPA: 6.95, avgAttendance: "85.1%", avgSuccessScore: 61.2, placementPct: "32.5%", rank: 5 },
];

const PILLARS: Pillar[] = [
  { label: "Academics (CGPA)",   cse: 84, batchAvg: 72, topDept: 91 },
  { label: "Coding & DSA",       cse: 76, batchAvg: 61, topDept: 88 },
  { label: "Projects & Labs",    cse: 88, batchAvg: 68, topDept: 90 },
  { label: "Soft Skills",        cse: 62, batchAvg: 65, topDept: 74 },
  { label: "Attendance",         cse: 76, batchAvg: 79, topDept: 85 },
];

const CORRELATIONS: Correlation[] = [
  { label: "LMS Logins vs Score",       r: 0.74, strength: "Strong positive",   trend: "up" },
  { label: "Attendance vs Placement",   r: 0.68, strength: "Moderate",          trend: "up" },
  { label: "Coding Practice vs CTC",    r: 0.81, strength: "Strong positive",   trend: "up" },
];

// Subjects × 4 weeks heatmap
const SUBJECTS = ["Data Structures", "OS Concepts", "DBMS", "Networks", "Machine Learning"];
const WEEKS = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"];
const HEATMAP: HeatCell[][] = [
  [{ value: 88 }, { value: 74 }, { value: 91 }, { value: 83 }],
  [{ value: 55 }, { value: 62 }, { value: 48 }, { value: 70 }],
  [{ value: 76 }, { value: 80 }, { value: 68 }, { value: 85 }],
  [{ value: 34 }, { value: 41 }, { value: 29 }, { value: 44 }],
  [{ value: 92 }, { value: 88 }, { value: 95 }, { value: 90 }],
];

const INSIGHTS = [
  "CSE ranks #2 with opportunity in Soft Skills (+3 pts gap)",
  "Attendance deficit in 32 students suppressing dept avg by 4.2%",
  "LMS coding engagement directly predicts top quartile placement odds",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rankBadge(rank: number) {
  const configs: Record<number, { bg: string; text: string; label: string }> = {
    1: { bg: "bg-yellow-100", text: "text-yellow-700", label: "#1" },
    2: { bg: "bg-slate-100",  text: "text-slate-600",  label: "#2" },
    3: { bg: "bg-orange-100", text: "text-orange-700", label: "#3" },
  };
  const c = configs[rank] ?? { bg: "bg-gray-100", text: "text-gray-500", label: `#${rank}` };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      {rank <= 3 && <Award size={11} />}
      {c.label}
    </span>
  );
}

function heatColor(value: number): string {
  if (value >= 80) return "bg-emerald-100 text-emerald-700";
  if (value >= 60) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-600";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function PillarBar({ value, color, label }: { value: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-5 bg-[#EEF3F6] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500 ${color}`}
          style={{ width: `${value}%` }}
        >
          <span className="text-[10px] font-semibold text-white leading-none">{value}</span>
        </div>
      </div>
      <span className="text-[11px] text-[#ACBACC] w-6 text-right">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FacultyBenchmarkInsights() {
  return (
    <div className="min-h-screen bg-[#EEF3F6] font-sans">

      {/* ── Header Banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#11233D] via-[#1a2f50] to-[#0d1e36] px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            {/* Left */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#825FEF]/20 flex items-center justify-center">
                  <BarChart3 size={20} className="text-[#825FEF]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Benchmark Insights</h1>
                  <p className="text-[#ACBACC] text-sm mt-0.5">Statistical Distributions & LMS Correlation</p>
                </div>
              </div>

              {/* Pill badges */}
              <div className="flex flex-wrap gap-2 mt-1">
                {[
                  { label: "CSE vs ECE vs IT", icon: <BarChart2 size={11} /> },
                  { label: "KPMG Criterion 4", icon: <Award size={11} /> },
                  { label: "Live Data",         icon: <Activity size={11} /> },
                ].map(({ label, icon }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/15 backdrop-blur-sm"
                  >
                    {icon}
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Export button */}
            <button className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00CEE6] hover:bg-[#00b8ce] text-[#11233D] text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap">
              <Download size={15} />
              Export Report
            </button>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-7">
            {[
              { label: "Dept CGPA",        value: "7.84",  sub: "vs 7.54 batch avg",  icon: <Target size={16} className="text-[#825FEF]" />, pos: true },
              { label: "Placement Rate",   value: "67.1%", sub: "+5.7% YoY",          icon: <TrendingUp size={16} className="text-[#00CEE6]" />, pos: true },
              { label: "Dept Rank",        value: "#2",    sub: "of 5 departments",   icon: <Award size={16} className="text-yellow-400" />, pos: null },
              { label: "LMS Correlation",  value: "r=0.81",sub: "Coding vs CTC",      icon: <Activity size={16} className="text-emerald-400" />, pos: true },
            ].map(({ label, value, sub, icon, pos }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#ACBACC]">{label}</span>
                  {icon}
                </div>
                <span className="text-xl font-bold text-white">{value}</span>
                <span className={`text-[11px] font-medium ${pos === true ? "text-emerald-400" : pos === false ? "text-red-400" : "text-[#ACBACC]"}`}>
                  {sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col gap-6">

        {/* ── Department Ranking Table ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EEF3F6] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#EEF3F6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-[#825FEF]" />
              <h2 className="text-base font-semibold text-[#11233D]">Department Ranking Overview</h2>
            </div>
            <span className="text-xs text-[#ACBACC] bg-[#EEF3F6] px-3 py-1 rounded-full">AY 2024-25</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#EEF3F6]/60">
                  {["Department", "Avg CGPA", "Avg Attendance", "Avg Success Score", "Placement %", "Rank"].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-[#ACBACC] px-5 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.sort((a, b) => a.rank - b.rank).map((row) => (
                  <tr
                    key={row.dept}
                    className={`border-t border-[#EEF3F6] transition-colors ${row.isCurrent ? "bg-[#825FEF]/[0.06]" : "hover:bg-[#EEF3F6]/40"}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#11233D]">{row.dept}</span>
                        {row.isCurrent && (
                          <span className="text-[10px] font-semibold text-[#825FEF] bg-[#825FEF]/10 px-2 py-0.5 rounded-full">Your Dept</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-[#11233D]">{row.avgCGPA}</td>
                    <td className="px-5 py-3.5 text-[#11233D]">{row.avgAttendance}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-[#EEF3F6] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#825FEF]"
                            style={{ width: `${row.avgSuccessScore}%` }}
                          />
                        </div>
                        <span className="text-[#11233D]">{row.avgSuccessScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#11233D]">{row.placementPct}</td>
                    <td className="px-5 py-3.5">{rankBadge(row.rank)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Multi-Pillar Benchmark ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#EEF3F6] p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <BarChart2 size={18} className="text-[#825FEF]" />
              <h2 className="text-base font-semibold text-[#11233D]">
                Multi-Pillar Academic Benchmark
                <span className="text-[#ACBACC] font-normal"> · CSE vs Batch Avg</span>
              </h2>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium">
              {[
                { label: "CSE",       color: "bg-[#825FEF]" },
                { label: "Batch Avg", color: "bg-[#ACBACC]" },
                { label: "Top Dept",  color: "bg-[#00CEE6]" },
              ].map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-[#ACBACC]">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {PILLARS.map((pillar) => (
              <div key={pillar.label} className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-[#11233D]">{pillar.label}</span>
                <div className="grid grid-cols-1 gap-1">
                  <PillarBar value={pillar.cse}      color="bg-[#825FEF]"  label="CSE" />
                  <PillarBar value={pillar.batchAvg}  color="bg-[#ACBACC]"  label="Batch Avg" />
                  <PillarBar value={pillar.topDept}   color="bg-[#00CEE6]"  label="Top Dept" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── LMS Activity Correlation ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Heatmap */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#EEF3F6] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity size={18} className="text-[#00CEE6]" />
              <h2 className="text-base font-semibold text-[#11233D]">LMS Engagement Heatmap</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-[#ACBACC] font-medium pb-2 pr-3 whitespace-nowrap w-36">Subject</th>
                    {WEEKS.map((w) => (
                      <th key={w} className="text-center text-[#ACBACC] font-medium pb-2 px-2">{w}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SUBJECTS.map((subj, si) => (
                    <tr key={subj}>
                      <td className="py-1.5 pr-3 font-medium text-[#11233D] whitespace-nowrap">{subj}</td>
                      {HEATMAP[si].map((cell, wi) => (
                        <td key={wi} className="py-1.5 px-1.5 text-center">
                          <span className={`inline-block px-2.5 py-1 rounded-lg font-semibold ${heatColor(cell.value)}`}>
                            {cell.value}%
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Heat legend */}
            <div className="flex items-center gap-4 mt-5 text-[10px] font-medium text-[#ACBACC]">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block" />≥80% High</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200 inline-block" />60–79% Med</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />&lt;60% Low</span>
            </div>
          </div>

          {/* Correlations */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-[#EEF3F6] p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={18} className="text-[#825FEF]" />
              <h2 className="text-base font-semibold text-[#11233D]">Key Correlations</h2>
            </div>

            <div className="flex flex-col gap-4">
              {CORRELATIONS.map((c) => {
                const rPct = Math.round(Math.abs(c.r) * 100);
                return (
                  <div key={c.label} className="rounded-2xl bg-[#EEF3F6]/60 border border-[#EEF3F6] p-4 flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-[#11233D] leading-tight">{c.label}</span>
                      {c.trend === "up"
                        ? <TrendingUp size={15} className="text-emerald-500 shrink-0" />
                        : <TrendingDown size={15} className="text-red-400 shrink-0" />}
                    </div>

                    {/* r bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-[#ACBACC]">Pearson r</span>
                        <span className="text-base font-bold text-[#825FEF]">r = {c.r}</span>
                      </div>
                      <div className="h-2 bg-[#EEF3F6] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#825FEF] to-[#00CEE6]"
                          style={{ width: `${rPct}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full self-start">
                      {c.strength}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Insights Summary ─────────────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#825FEF]/10 to-[#825FEF]/5 border border-[#825FEF]/20 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

            <div className="flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={16} className="text-[#825FEF]" />
                <span className="text-sm font-semibold text-[#11233D]">Key Insights</span>
              </div>

              {INSIGHTS.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#825FEF]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#825FEF]">{i + 1}</span>
                  </div>
                  <p className="text-xs text-[#11233D] leading-relaxed font-medium">{insight}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#825FEF] hover:bg-[#6e4fd4] text-white text-sm font-semibold transition-colors cursor-pointer shadow-lg shadow-[#825FEF]/30">
                <Award size={16} />
                Generate KPMG Report
                <ArrowRight size={14} />
              </button>
              <span className="text-[10px] text-[#ACBACC]">Criterion 4 · PDF export</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
