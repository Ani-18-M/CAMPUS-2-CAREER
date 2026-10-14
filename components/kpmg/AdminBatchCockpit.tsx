"use client";

import React, { useState } from "react";
import {
  Users,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter,
  Search,
  ArrowRight,
  Zap,
  Mail,
  Calendar,
  Sparkles,
  Layers,
  Building2,
  ShieldAlert,
} from "lucide-react";
import CohortAnalyticsBenchmark from "./CohortAnalyticsBenchmark";
import SmartStudentSegmentation from "./SmartStudentSegmentation";

interface AdminBatchCockpitProps {
  onDrilldownStudent: (studentRoll: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function AdminBatchCockpit({
  onDrilldownStudent,
  onNavigateTab,
}: AdminBatchCockpitProps) {
  const [riskFilter, setRiskFilter] = useState<"all" | "critical" | "moderate" | "safe">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // 180 Student Roster Sample Data (KPMG Cohort)
  const students = [
    {
      roll: "21BCE1089",
      name: "Ananya V.",
      cgpa: 8.42,
      attendance: 68.4,
      coding: 76,
      score: 74,
      riskLevel: "moderate" as const,
      riskCategory: "Attendance Deficit (-6.6% Cutoff)",
      segment: "High Skill · Attendance-Constrained",
      actionNeeded: "Assign Make-up Lab 4 & Condonation Review",
    },
    {
      roll: "21BCE1105",
      name: "Vikram Patel",
      cgpa: 6.20,
      attendance: 59.2,
      coding: 44,
      score: 51,
      riskLevel: "critical" as const,
      riskCategory: "Dual Academic & Attendance Risk",
      segment: "Critical Intervention Required",
      actionNeeded: "Mandatory HOD Counseling & Credit Review",
    },
    {
      roll: "21BCE1042",
      name: "Rohan Sharma",
      cgpa: 8.92,
      attendance: 88.0,
      coding: 89,
      score: 92,
      riskLevel: "safe" as const,
      riskCategory: "Cleared for Super-Dream (28 LPA)",
      segment: "Tier-1 Super-Dream Ready",
      actionNeeded: "Fast-Track Cloud Engineering Drive",
    },
    {
      roll: "21BCE1156",
      name: "Priya Nair",
      cgpa: 8.70,
      attendance: 82.5,
      coding: 54,
      score: 71,
      riskLevel: "moderate" as const,
      riskCategory: "Placement Coding Skill Gap",
      segment: "Skill-Deficit High Achiever",
      actionNeeded: "Enroll in 3-Week DSA Array/Graph Bootcamp",
    },
    {
      roll: "21BCE1012",
      name: "Karthik Raja",
      cgpa: 7.10,
      attendance: 74.0,
      coding: 68,
      score: 69,
      riskLevel: "moderate" as const,
      riskCategory: "Borderline Attendance & Aptitude Deficit",
      segment: "Moderate All-Round",
      actionNeeded: "Schedule Mock Technical Assessment",
    },
    {
      roll: "21BCE1178",
      name: "Siddharth Verma",
      cgpa: 5.80,
      attendance: 54.0,
      coding: 40,
      score: 48,
      riskLevel: "critical" as const,
      riskCategory: "2 Active Backlogs · Attendance Barred",
      segment: "Critical Intervention Required",
      actionNeeded: "Parent-Faculty Conference & Remedial Term",
    },
    {
      roll: "21BCE1064",
      name: "Meera Krishnan",
      cgpa: 9.15,
      attendance: 91.0,
      coding: 92,
      score: 96,
      riskLevel: "safe" as const,
      riskCategory: "Top 2% of Department · 0 Backlogs",
      segment: "Tier-1 Super-Dream Ready",
      actionNeeded: "Research Publication Travel Grant",
    },
  ];

  const filteredStudents = students.filter((s) => {
    if (riskFilter !== "all" && s.riskLevel !== riskFilter) return false;
    if (
      searchQuery &&
      !s.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.roll.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !s.riskCategory.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleBulkAction = (actionTitle: string) => {
    setActionNotice(`✓ Executed: ${actionTitle}. Real-time notifications dispatched to assigned student dashboards.`);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-16">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#162D4D] to-[#0D1C30] text-white border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-32 bg-[#825FEF]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#00CEE6]/20 text-[#00CEE6] border border-[#00CEE6]/40">
                KPMG Enterprise Suite
              </span>
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                CSE Batch 2026 · Semester 7
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Faculty & Administrator Command Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              AI-driven cohort monitoring, predictive at-risk triage, and decision intelligence for 180 Computer Science undergraduates.
            </p>
          </div>

          <button
            onClick={() => handleBulkAction("Generated Department KPMG Compliance Audit Report (PDF)")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-xs font-black transition-all cursor-pointer shadow-md shrink-0 self-start md:self-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export KPMG Audit Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Action Notice Toast */}
      {actionNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/40 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <span>{actionNotice}</span>
          <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full">Active</span>
        </div>
      )}

      {/* 2. Top 4 Executive KPI Pods */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-5 rounded-[26px] bg-white border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Cohort Success Score</span>
            <Sparkles className="w-4 h-4 text-[#00CEE6]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#11233D]">71.4</span>
            <span className="text-xs font-bold text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">
            +3.8 pts vs Sem 6 average
          </p>
        </div>

        {/* KPI 2 */}
        <div className="p-5 rounded-[26px] bg-white border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-[#825FEF]" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#11233D]">180</span>
            <span className="text-xs font-bold text-slate-400">Students</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            100% profile integration
          </p>
        </div>

        {/* KPI 3 */}
        <div className="p-5 rounded-[26px] bg-white border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>At-Risk Triage</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600">46</span>
            <span className="text-xs font-bold text-slate-400">(25.5%)</span>
          </div>
          <p className="text-[11px] text-rose-600 font-bold mt-1">
            14 Critical · 32 Moderate
          </p>
        </div>

        {/* KPI 4 */}
        <div className="p-5 rounded-[26px] bg-white border-2 border-slate-200/90 shadow-[0_4px_16px_rgba(15,23,42,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            <span>Placement Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#11233D]">68.2%</span>
            <span className="text-xs font-bold text-slate-400">Ready</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Target: 85% by Oct 30
          </p>
        </div>
      </div>

      {/* 3. Decision Intelligence: Administrator 1-Click Action Dispatcher */}
      <div className="p-6 rounded-[28px] bg-gradient-to-r from-[#CAD5E2]/60 via-[#E1E9F0]/60 to-[#C3D0DD]/60 border-2 border-slate-300/80 shadow-[0_4px_20px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/80">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#008DA3] bg-[#00CEE6]/15 px-2.5 py-0.5 rounded-full border border-[#00CEE6]/30">
              KPMG Decision Intelligence Bar
            </span>
            <h3 className="text-base font-black text-[#11233D] mt-1">
              Automated Batch Remediation Triggers
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Converts predictive flags into targeted actions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          <button
            onClick={() => handleBulkAction("Assigned 3-Week DSA Remedial Bootcamp to 18 Skill-Deficit Students")}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#11233D] hover:text-white border-2 border-slate-200/90 text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#11233D] group-hover:text-white">
                Dispatch Coding Bootcamp
              </span>
              <Zap className="w-4 h-4 text-amber-500 group-hover:text-[#00CEE6]" />
            </div>
            <p className="text-[11px] text-slate-500 group-hover:text-slate-300 mt-1">
              Targets 18 students with CGPA &gt; 8.0 but low coding readiness.
            </p>
          </button>

          <button
            onClick={() => handleBulkAction("Generated Make-up Lab 4 Pass Sessions for 32 Attendance-At-Risk Students")}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#11233D] hover:text-white border-2 border-slate-200/90 text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#11233D] group-hover:text-white">
                Authorize Make-up Labs
              </span>
              <Calendar className="w-4 h-4 text-[#825FEF] group-hover:text-[#00CEE6]" />
            </div>
            <p className="text-[11px] text-slate-500 group-hover:text-slate-300 mt-1">
              Conditional clearance for 32 students below the 75% cutoff.
            </p>
          </button>

          <button
            onClick={() => handleBulkAction("Dispatched Academic Alert Notices to 14 Critical Risk Students & Parents")}
            className="p-3.5 rounded-2xl bg-white hover:bg-[#11233D] hover:text-white border-2 border-slate-200/90 text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#11233D] group-hover:text-white">
                HOD Counseling Escalation
              </span>
              <Mail className="w-4 h-4 text-rose-500 group-hover:text-white" />
            </div>
            <p className="text-[11px] text-slate-500 group-hover:text-slate-300 mt-1">
              Notifies mentors and schedules formal academic triage sessions.
            </p>
          </button>
        </div>
      </div>

      {/* 4. Interactive Student Roster & At-Risk Triage Table */}
      <div className="p-6 rounded-[28px] bg-white border-2 border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
        {/* Table Header with Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-[#11233D]">
              Student 360° Cohort Triage Table
            </h3>
            <p className="text-xs text-slate-400">
              Click &quot;Inspect Student&quot; on any row to drill down into their individual explainable dashboard.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, roll, or risk..."
                className="pl-8 pr-3 py-1.5 rounded-full border-2 border-slate-200 text-xs text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#00CEE6] w-48 sm:w-56"
              />
            </div>

            {/* Risk Filter Buttons */}
            <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 text-xs font-bold">
              <button
                onClick={() => setRiskFilter("all")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  riskFilter === "all" ? "bg-white text-[#11233D] shadow-2xs font-black" : "text-slate-500"
                }`}
              >
                All (180)
              </button>
              <button
                onClick={() => setRiskFilter("critical")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  riskFilter === "critical" ? "bg-white text-rose-700 shadow-2xs font-black" : "text-slate-500"
                }`}
              >
                Critical (14)
              </button>
              <button
                onClick={() => setRiskFilter("moderate")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  riskFilter === "moderate" ? "bg-white text-amber-700 shadow-2xs font-black" : "text-slate-500"
                }`}
              >
                Moderate (32)
              </button>
              <button
                onClick={() => setRiskFilter("safe")}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  riskFilter === "safe" ? "bg-white text-emerald-700 shadow-2xs font-black" : "text-slate-500"
                }`}
              >
                Safe (134)
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-[10px] font-black uppercase tracking-wider text-slate-400">
                <th className="py-2.5 px-3">Student / Roll No</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Coding %</th>
                <th className="py-2.5 px-3">Success Score</th>
                <th className="py-2.5 px-3">Risk Category / Status</th>
                <th className="py-2.5 px-3 text-right">Drill Down Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((st) => (
                <tr key={st.roll} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-extrabold text-[#11233D]">{st.name}</div>
                    <div className="font-mono text-[10px] text-slate-400">{st.roll}</div>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-[#11233D]">{st.cgpa.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-extrabold ${
                        st.attendance < 65
                          ? "text-rose-600"
                          : st.attendance < 75
                          ? "text-amber-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {st.attendance}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-extrabold text-[#11233D]">{st.coding}%</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm text-[#11233D]">{st.score}</span>
                      <span className="text-[10px] text-slate-400">/ 100</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          st.riskLevel === "critical"
                            ? "bg-rose-500 shadow-[0_0_6px_#F43F5E]"
                            : st.riskLevel === "moderate"
                            ? "bg-amber-500 shadow-[0_0_6px_#F59E0B]"
                            : "bg-emerald-500 shadow-[0_0_6px_#10B981]"
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-700 truncate max-w-[200px]" title={st.riskCategory}>
                        {st.riskCategory}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onDrilldownStudent(st.roll)}
                      className={`px-3 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer inline-flex items-center gap-1 ${
                        st.roll === "21BCE1089"
                          ? "bg-[#11233D] text-[#00CEE6] hover:bg-[#00CEE6] hover:text-[#11233D] shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      <span>Inspect Student</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Cohort Analytics & Benchmark Preview */}
      <CohortAnalyticsBenchmark />

      {/* 6. Smart Student Segmentation Matrix */}
      <SmartStudentSegmentation />
    </div>
  );
}
