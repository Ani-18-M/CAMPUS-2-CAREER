"use client";

import React, { useState } from "react";
import {
  BookOpen,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Download,
  BarChart3,
  Target,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

interface AcademicPerformanceScreenProps {
  onNavigateTab?: (tab: string) => void;
}

// ─── Data ──────────────────────────────────────────────────────────────────

const sgpaHistory = [
  { sem: "Sem 1", sgpa: 7.8 },
  { sem: "Sem 2", sgpa: 8.1 },
  { sem: "Sem 3", sgpa: 8.3 },
  { sem: "Sem 4", sgpa: 8.5 },
  { sem: "Sem 5", sgpa: 8.6 },
  { sem: "Sem 6", sgpa: 8.75 },
  { sem: "Sem 7*", sgpa: 8.42 },
];

const subjects = [
  {
    code: "CS701",
    name: "Machine Learning",
    credits: 4,
    type: "Theory",
    internal: 42,
    maxInternal: 50,
    mid: 38,
    maxMid: 50,
    grade: "A+",
    gradeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    trend: "up",
    faculty: "Dr. Priya Menon",
    risk: null,
  },
  {
    code: "CS702",
    name: "Cloud Computing",
    credits: 3,
    type: "Theory",
    internal: 35,
    maxInternal: 50,
    mid: 28,
    maxMid: 50,
    grade: "B+",
    gradeColor: "text-amber-700 bg-amber-50 border-amber-200",
    trend: "down",
    faculty: "Prof. Arun Kumar",
    risk: "Mid-term below target",
  },
  {
    code: "CS703",
    name: "Advanced DBMS",
    credits: 4,
    type: "Theory",
    internal: 40,
    maxInternal: 50,
    mid: 34,
    maxMid: 50,
    grade: "A",
    gradeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    trend: "stable",
    faculty: "Dr. R. Sharma",
    risk: null,
  },
  {
    code: "CS704",
    name: "Compiler Design",
    credits: 3,
    type: "Theory",
    internal: 30,
    maxInternal: 50,
    mid: 24,
    maxMid: 50,
    grade: "B",
    gradeColor: "text-orange-700 bg-orange-50 border-orange-200",
    trend: "down",
    faculty: "Prof. V. Krishnan",
    risk: "Internal marks low — needs improvement",
  },
  {
    code: "CS705",
    name: "ML Lab",
    credits: 2,
    type: "Lab",
    internal: 45,
    maxInternal: 50,
    mid: 48,
    maxMid: 50,
    grade: "A+",
    gradeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    trend: "up",
    faculty: "Dr. Priya Menon",
    risk: null,
  },
  {
    code: "CS706",
    name: "Cloud Lab",
    credits: 2,
    type: "Lab",
    internal: 38,
    maxInternal: 50,
    mid: 40,
    maxMid: 50,
    grade: "A",
    gradeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
    trend: "stable",
    faculty: "Prof. Arun Kumar",
    risk: null,
  },
];

const radarData = [
  { subject: "ML", score: 90 },
  { subject: "Cloud", score: 63 },
  { subject: "DBMS", score: 74 },
  { subject: "Compiler", score: 54 },
  { subject: "ML Lab", score: 93 },
  { subject: "Cloud Lab", score: 78 },
];

const internalBarData = subjects.map((s) => ({
  name: s.code,
  score: Math.round((s.internal / s.maxInternal) * 100),
  fill:
    s.internal / s.maxInternal >= 0.8
      ? "#10B981"
      : s.internal / s.maxInternal >= 0.65
      ? "#F59E0B"
      : "#EF4444",
}));

const gradePoints: Record<string, number> = {
  "A+": 10,
  A: 9,
  "B+": 8,
  B: 7,
  "C+": 6,
  C: 5,
};

// ─── Sub-components ────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[24px] p-3.5 sm:p-5 border border-slate-100 shadow-[0_2px_12px_-2px_rgba(17,35,61,0.06)] flex flex-col gap-0.5 sm:gap-1">
      <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-400">
        {label}
      </span>
      <span
        className={`text-2xl sm:text-3xl font-black tracking-tight ${
          accent || "text-[#11233D]"
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 truncate">{sub}</span>
    </div>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")
    return <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />;
  if (trend === "down")
    return <TrendingDown className="w-3.5 h-3.5 text-red-400" />;
  return <Minus className="w-3.5 h-3.5 text-slate-400" />;
}

function ScoreBar({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) {
  const pct = (value / max) * 100;
  return (
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function AcademicPerformanceScreen({
  onNavigateTab,
}: AcademicPerformanceScreenProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "subjects" | "trends"
  >("overview");
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  const cgpa = 8.42;
  const currentSGPA = 8.75;
  const totalCredits = 146;
  const maxCredits = 160;
  const backlogs = 0;
  const atRiskCount = subjects.filter((s) => s.risk).length;

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
    }, 900);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "subjects", label: "Subjects" },
    { id: "trends", label: "Trends" },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#11233D] flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-[#00CEE6]" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-[#11233D]">
              Academic Performance
            </h1>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 font-semibold ml-10">
            Sem 7 · CSE · 21BCE1089
          </p>
        </div>

        <div className="flex items-center gap-2 ml-10 sm:ml-0 flex-wrap">
          {atRiskCount > 0 && (
            <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] sm:text-[11px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full">
              <AlertTriangle className="w-3 h-3" />
              {atRiskCount} subject{atRiskCount > 1 ? "s" : ""} need attention
            </span>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-white border border-slate-200 text-[#11233D] text-xs font-bold px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#825FEF]" />
            {downloading ? "Generating…" : "Export PDF"}
          </button>
        </div>
      </div>

      {/* ── KPI Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          label="CGPA"
          value={String(cgpa)}
          sub="First Class Distinction"
          accent="text-[#11233D]"
        />
        <StatCard
          label="Sem 6 SGPA"
          value={String(currentSGPA)}
          sub="+0.30 from Sem 5"
          accent="text-[#825FEF]"
        />
        <StatCard
          label="Credits Earned"
          value={`${totalCredits}/${maxCredits}`}
          sub={`${Math.round((totalCredits / maxCredits) * 100)}% complete`}
          accent="text-[#00CEE6]"
        />
        <StatCard
          label="Active Backlogs"
          value={String(backlogs)}
          sub="All semesters cleared"
          accent="text-emerald-600"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="bg-white rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-[0_2px_12px_-2px_rgba(17,35,61,0.06)] overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-slate-100 px-4 sm:px-6 pt-3 sm:pt-5 gap-1 overflow-x-auto scrollbar-none">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-2.5 sm:pb-3 px-3.5 sm:px-4 text-xs font-bold border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === t.id
                  ? "border-[#00CEE6] text-[#11233D]"
                  : "border-transparent text-slate-400 hover:text-[#11233D]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Overview ── */}
        {activeTab === "overview" && (
          <div className="p-3.5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Left: Radar */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
                Sem 7 Subject Proficiency
              </p>
              <div className="h-44 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius={75}>
                    <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }}
                    />
                    <Radar
                      dataKey="score"
                      stroke="#00CEE6"
                      fill="#00CEE6"
                      fillOpacity={0.15}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                      formatter={(v: number) => [`${v}%`, "Score"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right: Internal marks bar */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-3 sm:mb-4">
                Internal Assessment (%)
              </p>
              <div className="h-44 sm:h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={internalBarData}
                    barSize={20}
                    margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 9, fill: "#94A3B8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "#F1F5F9", radius: 8 }}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                      formatter={(v: number) => [`${v}%`, "Internal"]}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {internalBarData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Grade summary row */}
            <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
              {subjects.map((s) => (
                <div
                  key={s.code}
                  className="bg-[#F5F8FA] rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 flex flex-col gap-1 border border-slate-100"
                >
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {s.code}
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#11233D]">
                    {s.grade}
                  </span>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit ${s.gradeColor}`}
                  >
                    {gradePoints[s.grade]}pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB: Subjects ── */}
        {activeTab === "subjects" && (
          <div className="p-3.5 sm:p-6 space-y-2.5 sm:space-y-3">
            {subjects.map((s) => {
              const isExpanded = expandedSubject === s.code;
              const internalPct = Math.round(
                (s.internal / s.maxInternal) * 100
              );
              const midPct = Math.round((s.mid / s.maxMid) * 100);
              const barColor =
                internalPct >= 80
                  ? "#10B981"
                  : internalPct >= 65
                  ? "#F59E0B"
                  : "#EF4444";

              return (
                <div
                  key={s.code}
                  className="border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-200"
                >
                  {/* Row */}
                  <button
                    onClick={() =>
                      setExpandedSubject(isExpanded ? null : s.code)
                    }
                    className="w-full flex items-center justify-between px-3.5 sm:px-5 py-3 sm:py-4 hover:bg-[#F5F8FA] transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      {/* Code + Type */}
                      <div className="shrink-0 text-center">
                        <p className="text-xs font-black text-[#11233D]">
                          {s.code}
                        </p>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            s.type === "Lab"
                              ? "bg-[#825FEF]/10 text-[#825FEF]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {s.type}
                        </span>
                      </div>

                      {/* Name + risk */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#11233D] truncate">
                          {s.name}
                        </p>
                        {s.risk ? (
                          <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            {s.risk}
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {s.credits} credits · {s.faculty}
                          </p>
                        )}
                      </div>

                      {/* Internal bar */}
                      <div className="hidden sm:flex flex-col gap-1 w-28 shrink-0">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Internal</span>
                          <span className="text-[#11233D]">
                            {s.internal}/{s.maxInternal}
                          </span>
                        </div>
                        <ScoreBar
                          value={s.internal}
                          max={s.maxInternal}
                          color={barColor}
                        />
                      </div>
                    </div>

                    {/* Grade + trend + chevron */}
                    <div className="flex items-center gap-3 ml-4 shrink-0">
                      <span
                        className={`text-sm font-black px-2.5 py-1 rounded-full border ${s.gradeColor}`}
                      >
                        {s.grade}
                      </span>
                      <TrendIcon trend={s.trend} />
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-[#F5F8FA] border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          Internal
                        </p>
                        <p className="text-xl font-black text-[#11233D]">
                          {s.internal}
                          <span className="text-xs font-bold text-slate-400">
                            /{s.maxInternal}
                          </span>
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                          {internalPct}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          Mid-Term
                        </p>
                        <p className="text-xl font-black text-[#11233D]">
                          {s.mid}
                          <span className="text-xs font-bold text-slate-400">
                            /{s.maxMid}
                          </span>
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                          {midPct}%
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          Credits
                        </p>
                        <p className="text-xl font-black text-[#11233D]">
                          {s.credits}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                          Grade pts: {gradePoints[s.grade]}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
                          Faculty
                        </p>
                        <p className="text-sm font-bold text-[#11233D] leading-snug">
                          {s.faculty}
                        </p>
                        {s.risk && (
                          <button
                            onClick={() => onNavigateTab?.("Interventions")}
                            className="mt-2 text-[11px] font-bold text-[#825FEF] flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            View Action Plan
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB: Trends ── */}
        {activeTab === "trends" && (
          <div className="p-3.5 sm:p-6 space-y-4 sm:space-y-6">
            {/* SGPA Trend */}
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <p className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  SGPA Progression
                </p>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 sm:px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +0.95 over 6 sems
                </span>
              </div>
              <div className="h-44 sm:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={sgpaHistory}
                    margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="sgpaGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#00CEE6"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#00CEE6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="sem"
                      tick={{ fontSize: 10, fill: "#94A3B8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[7.5, 9]}
                      tick={{ fontSize: 10, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                      formatter={(v: number) => [v.toFixed(2), "SGPA"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="sgpa"
                      stroke="#00CEE6"
                      strokeWidth={2.5}
                      fill="url(#sgpaGrad)"
                      dot={{ fill: "#00CEE6", r: 4, strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: "#11233D" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Semester GPA history table */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-4">
                Semester Breakdown
              </p>
              <div className="space-y-2">
                {sgpaHistory.map((row, i) => {
                  const prev = sgpaHistory[i - 1];
                  const delta = prev ? row.sgpa - prev.sgpa : null;
                  const isCurrent = i === sgpaHistory.length - 1;
                  return (
                    <div
                      key={row.sem}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                        isCurrent
                          ? "bg-[#00CEE6]/8 border border-[#00CEE6]/30"
                          : "bg-[#F5F8FA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-[10px] font-black text-slate-500 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isCurrent ? "text-[#11233D]" : "text-slate-500"
                          }`}
                        >
                          {row.sem}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold text-[#00CEE6] bg-[#00CEE6]/10 px-2 py-0.5 rounded-full border border-[#00CEE6]/30">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {delta !== null && (
                          <span
                            className={`text-[11px] font-bold flex items-center gap-1 ${
                              delta >= 0 ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {delta >= 0 ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : (
                              <TrendingDown className="w-3 h-3" />
                            )}
                            {delta >= 0 ? "+" : ""}
                            {delta.toFixed(2)}
                          </span>
                        )}
                        <span className="text-sm font-black text-[#11233D] w-10 text-right">
                          {row.sgpa}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick actions */}
            <div className="border-t border-slate-100 pt-5 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateTab?.("Interventions")}
                className="flex items-center gap-2 bg-[#11233D] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#00CEE6] hover:text-[#11233D] transition-all cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                View Action Plan
              </button>
              <button
                onClick={() => onNavigateTab?.("Success Score")}
                className="flex items-center gap-2 bg-[#F5F8FA] border border-slate-200 text-[#11233D] text-xs font-bold px-4 py-2.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-[#825FEF]" />
                Success Score Breakdown
              </button>
              <button
                onClick={() => onNavigateTab?.("Attendance")}
                className="flex items-center gap-2 bg-[#F5F8FA] border border-slate-200 text-[#11233D] text-xs font-bold px-4 py-2.5 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Attendance Records
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Bottom: At-risk subjects callout ── */}
      {atRiskCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                {atRiskCount} subject
                {atRiskCount > 1 ? "s require" : " requires"} immediate
                attention
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {subjects
                  .filter((s) => s.risk)
                  .map((s) => s.name)
                  .join(" · ")}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab?.("Interventions")}
            className="shrink-0 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
          >
            Open Action Plan
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
