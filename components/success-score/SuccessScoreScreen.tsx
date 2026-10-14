"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Award,
  ShieldAlert,
  ShieldCheck,
  Download,
  BookOpen,
  Code,
  Users,
  AlertTriangle,
  ArrowRight,
  Zap,
  Target,
  Sliders,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  BarChart3,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

interface SuccessScoreScreenProps {
  onNavigateTab: (tab: string) => void;
  baseScore?: number;
  attendanceRate?: string;
}

export default function SuccessScoreScreen({
  onNavigateTab,
  baseScore = 74,
  attendanceRate = "68.4%",
}: SuccessScoreScreenProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Simulator controls
  const [labSessions, setLabSessions] = useState(2);
  const [dsaProblems, setDsaProblems] = useState(5);
  const [certVerified, setCertVerified] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Simulator calculations
  const attendanceRecovery = labSessions * 3;
  const dsaRecovery = Math.min(8, Math.round(dsaProblems * 1.6));
  const certBonus = certVerified ? 4 : 0;
  const simulatedScore = Math.min(100, baseScore + attendanceRecovery + dsaRecovery + certBonus);
  const scoreDelta = simulatedScore - baseScore;

  const handleResetSimulator = () => {
    setLabSessions(0);
    setDsaProblems(0);
    setCertVerified(false);
  };

  const handleExportPDF = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Success Score Audit Summary (PDF) generated.");
    }, 900);
  };

  // 5 Pillars Data
  const pillars = [
    {
      id: "academics",
      title: "Academics",
      score: 84,
      weight: "30%",
      metric: "8.42 CGPA",
      status: "Optimal",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
      barColor: "#10B981",
      icon: BookOpen,
    },
    {
      id: "coding",
      title: "Coding & DSA",
      score: 76,
      weight: "25%",
      metric: "185 Solved",
      status: "Good",
      statusColor: "text-[#00CEE6] bg-cyan-50 border-cyan-200",
      barColor: "#00CEE6",
      icon: Code,
    },
    {
      id: "attendance",
      title: "Attendance",
      score: 68,
      weight: "20%",
      metric: `${attendanceRate} (<75%)`,
      status: "Risk",
      statusColor: "text-rose-700 bg-rose-50 border-rose-200",
      barColor: "#F43F5E",
      icon: ShieldAlert,
    },
    {
      id: "projects",
      title: "Projects & Labs",
      score: 88,
      weight: "15%",
      metric: "2 Repos · 1 Cert",
      status: "High",
      statusColor: "text-purple-700 bg-purple-50 border-purple-200",
      barColor: "#825FEF",
      icon: Award,
    },
    {
      id: "readiness",
      title: "Soft Skills & ATS",
      score: 62,
      weight: "10%",
      metric: "ATS 88% · 1 Mock",
      status: "Needs Action",
      statusColor: "text-amber-700 bg-amber-50 border-amber-200",
      barColor: "#F59E0B",
      icon: Users,
    },
  ];

  // Benchmark chart data
  const benchmarkData = [
    { label: "You", score: baseScore, fill: "#00CEE6" },
    { label: "Dept Avg", score: 71, fill: "#94A3B8" },
    { label: "Target (Tier 1)", score: 80, fill: "#825FEF" },
    { label: "Top 10%", score: 92, fill: "#10B981" },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-wider text-[#825FEF] uppercase bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
              Predictive Index
            </span>
            <span className="text-xs text-slate-400 font-medium">Roll: 21BCE1089</span>
          </div>
          <h1 className="text-2xl font-black text-[#11233D] mt-1 tracking-tight">
            Success Score
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const el = document.getElementById("score-simulator");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-[#11233D] bg-[#EFF4F7] hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#825FEF]" />
            <span>Simulator</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={downloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#11233D] hover:bg-[#1E3A5F] shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#00CEE6]" />
            <span>{downloading ? "Exporting..." : "Export Report"}</span>
          </button>
        </div>
      </div>

      {/* Main Score Hero Card & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Score Dial Card (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#11233D] via-[#162D4D] to-[#0A1626] text-white p-6 sm:p-7 rounded-3xl shadow-md border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00CEE6]">
              Overall Score
            </span>
            <span className="text-xs font-bold bg-white/10 text-white px-2.5 py-1 rounded-full border border-white/15">
              Target: 80+
            </span>
          </div>

          <div className="my-6 flex items-center gap-6">
            {/* Circular Gauge */}
            <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#00CEE6"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - baseScore / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white">{baseScore}</span>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest -mt-0.5">
                  / 100
                </span>
              </div>
            </div>

            {/* Status & Potential Gain */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-cyan-400/15 border border-cyan-400/30 text-[#00CEE6] text-xs font-bold px-2.5 py-1 rounded-lg">
                <Target className="w-3.5 h-3.5" />
                <span>Tier-2 Ready</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                6 pts to Tier-1 Cutoff
              </p>
              <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>+16 pts recoverable</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-slate-300">Percentile</span>
            <span className="font-bold text-[#00CEE6]">Top 28% of Cohort</span>
          </div>
        </div>

        {/* 4 Metric Tiles (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Target</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-[#11233D]">80+</div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Tier-1 Threshold</p>
            </div>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 self-start">
              Achievable in 2 wks
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Attendance</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-rose-600">{attendanceRate}</div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Cutoff: 75.0%</p>
            </div>
            <button
              onClick={() => onNavigateTab("Attendance")}
              className="text-[11px] text-rose-700 font-bold hover:underline flex items-center gap-1 self-start cursor-pointer"
            >
              <span>View deficit</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Eligible Drives</span>
              <Target className="w-4 h-4 text-[#825FEF]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-[#11233D]">14 / 78</div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Current clearance</p>
            </div>
            <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200 self-start">
              +48 with 80+ score
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">Action Plan</span>
              <CheckCircle2 className="w-4 h-4 text-[#00CEE6]" />
            </div>
            <div className="my-2">
              <div className="text-2xl font-black text-[#11233D]">2 Tasks</div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Pending completion</p>
            </div>
            <button
              onClick={() => onNavigateTab("Interventions")}
              className="text-[11px] text-[#00CEE6] hover:text-[#11233D] font-bold hover:underline flex items-center gap-1 self-start cursor-pointer"
            >
              <span>Start tasks</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Breakdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-[#11233D]">Score Pillars</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Weighted factor contribution</p>
          </div>
          <span className="text-xs font-bold text-slate-400">Total: 100%</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => {
                  if (p.id === "academics") onNavigateTab("Academic Performance");
                  else if (p.id === "attendance") onNavigateTab("Attendance");
                  else if (p.id === "coding" || p.id === "projects") onNavigateTab("Career Paths");
                  else if (p.id === "readiness") onNavigateTab("Interventions");
                }}
                className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/70 hover:border-[#00CEE6] hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#11233D] group-hover:text-[#00CEE6] group-hover:border-[#00CEE6]/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">
                      Wt: {p.weight}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#11233D] group-hover:text-[#00CEE6] transition-colors">{p.title}</h3>
                  <div className="text-lg font-black text-[#11233D] mt-0.5">
                    {p.score}
                    <span className="text-[11px] text-slate-400 font-medium">/100</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${p.score}%`, backgroundColor: p.barColor }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-slate-500">{p.metric}</span>
                    <span className={`px-1.5 py-0.5 rounded font-bold border ${p.statusColor}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drivers: Positive vs Penalties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Positive Drivers */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Positive Drivers (+27 pts)
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>

          <div className="space-y-3 mt-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  +15
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Academic Consistency</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">8.42 CGPA · Sem 1–6 · 0 Backlogs</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                CGPA Wt
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  +12
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">Verified Portfolio</h4>
                  <p className="text-[11px] text-emerald-800 font-medium">2 GitHub Repos · Next.js Cert</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                Projects Wt
              </span>
            </div>
          </div>
        </div>

        {/* Penalties & Quick Recovery */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Recoverable Deductions (-16 pts)
            </span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Recoverable
            </span>
          </div>

          <div className="space-y-3 mt-4">
            <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  -10
                </div>
                <div>
                  <h4 className="text-xs font-bold text-rose-950">Attendance Shortfall</h4>
                  <p className="text-[11px] text-rose-800 font-medium">68.4% (Cutoff: 75.0%)</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab("Permissions")}
                className="text-[10px] font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Book Lab (+6)
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  -6
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950">Missed Assessment</h4>
                  <p className="text-[11px] text-amber-800 font-medium">DBMS Indexing Quiz</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab("Interventions")}
                className="text-[10px] font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Attempt (+6)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator & Cohort Benchmarking Row */}
      <div id="score-simulator" className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* "What-If" Simulator (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#825FEF]" />
                <h3 className="text-base font-extrabold text-[#11233D]">
                  "What-If" Simulator
                </h3>
              </div>
              <button
                onClick={handleResetSimulator}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            <div className="space-y-4 mt-5">
              {/* Slider 1: Make-up Lab */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#11233D]">Make-up Lab Sessions</span>
                  <span className="font-bold text-emerald-600">+{attendanceRecovery} pts ({labSessions} labs)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={labSessions}
                  onChange={(e) => setLabSessions(Number(e.target.value))}
                  className="w-full accent-[#00CEE6] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 (Deficit)</span>
                  <span>2 (Clears 75%)</span>
                  <span>4 (Excellence)</span>
                </div>
              </div>

              {/* Slider 2: Coding Solves */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#11233D]">DSA Problem Solves</span>
                  <span className="font-bold text-emerald-600">+{dsaRecovery} pts ({dsaProblems} solved)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={dsaProblems}
                  onChange={(e) => setDsaProblems(Number(e.target.value))}
                  className="w-full accent-[#825FEF] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0</span>
                  <span>5 (Remedial Done)</span>
                  <span>10 (Mastery)</span>
                </div>
              </div>

              {/* Toggle 3: Certification */}
              <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#11233D]">AWS / Cloud Certification</h4>
                  <p className="text-[10px] text-slate-500">Verified credential upload</p>
                </div>
                <button
                  onClick={() => setCertVerified(!certVerified)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    certVerified
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {certVerified ? "+4 pts Active" : "Add (+4)"}
                </button>
              </div>
            </div>
          </div>

          {/* Simulator Result Footer */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-[#11233D] to-[#1E3A5F] text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#00CEE6] uppercase tracking-wider">
                Simulated Score
              </span>
              <div className="text-2xl font-black">
                {simulatedScore}
                <span className="text-xs font-bold text-slate-300 ml-1">/ 100</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                +{scoreDelta} pts gain
              </span>
              <p className="text-[10px] text-slate-300 font-medium mt-1">
                {simulatedScore >= 80 ? "Unlocks Tier-1 Drives" : "Approaching Tier-1"}
              </p>
            </div>
          </div>
        </div>

        {/* Cohort Benchmark Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00CEE6]" />
                <h3 className="text-base font-extrabold text-[#11233D]">Benchmark</h3>
              </div>
              <span className="text-xs font-bold text-slate-400">CSE Cohort</span>
            </div>

            <div className="h-48 w-full mt-4">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={benchmarkData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 9, fill: "#94A3B8" }}
                      axisLine={false}
                      tickLine={false}
                      ticks={[0, 25, 50, 75, 100]}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const item = payload[0].payload;
                          return (
                            <div className="bg-[#11233D] text-white p-2.5 rounded-xl shadow-lg text-xs">
                              <span className="font-bold text-[#00CEE6]">{item.label}</span>
                              <div className="font-extrabold text-sm">{item.score} / 100</div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {benchmarkData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  Loading...
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Department Rank</span>
            <span className="font-extrabold text-[#11233D]">#34 of 120</span>
          </div>
        </div>
      </div>

      {/* Quick Recovery Action Steps (Minimalist) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-[#11233D]">Quick Recovery</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">High-impact tasks</p>
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            +16 pts Potential
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Attendance
                </span>
                <span className="text-xs font-extrabold text-emerald-600">+6 pts</span>
              </div>
              <h4 className="text-xs font-bold text-[#11233D]">Make-up Lab Session</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Lab 4 · Slot: Saturday 10 AM</p>
            </div>
            <button
              onClick={() => onNavigateTab("Permissions")}
              className="mt-3 w-full py-2 bg-[#11233D] hover:bg-[#1E3A5F] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Book Slot</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Assessment
                </span>
                <span className="text-xs font-extrabold text-emerald-600">+6 pts</span>
              </div>
              <h4 className="text-xs font-bold text-[#11233D]">DBMS Indexing Quiz</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">15 mins · 10 MCQs</p>
            </div>
            <button
              onClick={() => onNavigateTab("Interventions")}
              className="mt-3 w-full py-2 bg-[#11233D] hover:bg-[#1E3A5F] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Start Quiz</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  Coding
                </span>
                <span className="text-xs font-extrabold text-emerald-600">+4 pts</span>
              </div>
              <h4 className="text-xs font-bold text-[#11233D]">DSA Sprint #4</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Trees & Graph problems</p>
            </div>
            <button
              onClick={() => onNavigateTab("Interventions")}
              className="mt-3 w-full py-2 bg-[#11233D] hover:bg-[#1E3A5F] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Solve Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
