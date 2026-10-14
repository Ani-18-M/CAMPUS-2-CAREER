"use client";

import React, { useState } from "react";
import {
  Zap,
  Calendar,
  Mail,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Users,
  TrendingDown,
  RotateCcw,
  Check,
  Activity,
  BookOpen,
} from "lucide-react";

interface FacultySubjectRiskProps {
  onNavigate?: (tab: string) => void;
}

interface RiskStudent {
  roll: string;
  name: string;
  attendance: number;
  cia1: number;
  missingLabs: number;
  reason: string;
  severity: "critical" | "moderate";
  actionTaken: boolean;
}

const INITIAL_RISK_STUDENTS: RiskStudent[] = [
  {
    roll: "21BCE1105",
    name: "Vikram Patel",
    attendance: 59.2,
    cia1: 22,
    missingLabs: 3,
    reason: "Low Attendance & Failed CIA-1",
    severity: "critical",
    actionTaken: false,
  },
  {
    roll: "21BCE1178",
    name: "Siddharth Verma",
    attendance: 54.0,
    cia1: 18,
    missingLabs: 4,
    reason: "Critical Attendance & CIA Deficit",
    severity: "critical",
    actionTaken: false,
  },
  {
    roll: "21BCE1064",
    name: "Ananya V.",
    attendance: 68.4,
    cia1: 41,
    missingLabs: 1,
    reason: "Attendance Below 75% Cutoff",
    severity: "moderate",
    actionTaken: false,
  },
  {
    roll: "21BCE1012",
    name: "Karthik Raja",
    attendance: 74.0,
    cia1: 34,
    missingLabs: 2,
    reason: "Borderline Attendance & Lab Lag",
    severity: "moderate",
    actionTaken: false,
  },
  {
    roll: "21BCE1135",
    name: "Sneha Reddy",
    attendance: 71.5,
    cia1: 36,
    missingLabs: 1,
    reason: "Borderline Attendance",
    severity: "moderate",
    actionTaken: true,
  },
];

export default function FacultySubjectRisk({ onNavigate }: FacultySubjectRiskProps) {
  const [students, setStudents] = useState<RiskStudent[]>(INITIAL_RISK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<"ALL" | "CRITICAL" | "MODERATE" | "REMEDIATED">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalFlagged = students.length;
  const criticalCount = students.filter((s) => s.severity === "critical").length;
  const moderateCount = students.filter((s) => s.severity === "moderate").length;
  const remediatedCount = students.filter((s) => s.actionTaken).length;
  const pendingCount = totalFlagged - remediatedCount;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleIntervene = (roll: string, actionType: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.roll === roll ? { ...s, actionTaken: true } : s))
    );
    showToast(`✓ Remedial action dispatched to ${roll}`);
  };

  const handleBatchSchedule = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, actionTaken: true })));
    showToast("✓ Saturday Remedial Session (Oct 17, 10 AM) scheduled for all flagged students");
  };

  const handleResetActions = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, actionTaken: false })));
    showToast("Remedial actions reset");
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterSeverity === "ALL"
        ? true
        : filterSeverity === "CRITICAL"
        ? s.severity === "critical"
        : filterSeverity === "MODERATE"
        ? s.severity === "moderate"
        : s.actionTaken;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#11233D] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#00CEE6] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#1A2E4C] to-[#11233D] text-white border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#00CEE6] border border-white/15">
              Subject Academic Support
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#00CEE6]" />
              CS301 · Section CSE-A
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Classroom Early Warning Alerts
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Course: Data Structures & Algorithms · Target Threshold: 75% Attendance / 25 CIA Marks
          </p>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleResetActions}
            title="Reset all remedial statuses"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition-all border border-white/15 cursor-pointer shadow-xs flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={handleBatchSchedule}
            className="px-5 py-2.5 rounded-2xl bg-[#00CEE6] hover:bg-[#00BCD4] text-[#11233D] text-xs font-extrabold transition-all shadow-[0_4px_16px_rgba(0,206,230,0.3)] cursor-pointer flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Remediate All ({pendingCount})</span>
          </button>
        </div>
      </div>

      {/* KPI Pods: Neutral Outlines, No Warning Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Total Flagged */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
              Flagged
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#11233D]">{totalFlagged}</span>
              <span className="text-xs font-bold text-slate-400">/ 64</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#11233D] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Critical Risk */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 block uppercase tracking-wider">
              Critical Deficit
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600">{criticalCount}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
            <TrendingDown className="w-5 h-5 text-rose-600" />
          </div>
        </div>

        {/* Moderate Risk */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-500 block uppercase tracking-wider">
              Moderate Deficit
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600">{moderateCount}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
        </div>

        {/* Remediated Pod */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
              Remediated
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                {remediatedCount}
              </span>
              <span className="text-xs font-bold text-slate-400">/ {totalFlagged}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3 Action Tiles: Neutral Outlines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-5">
        {/* Makeup Problem Set */}
        <div className="p-5 rounded-[28px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#11233D] uppercase tracking-wider">
                Makeup Lab Credit
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#11233D] flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#00CEE6]" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              3 practice problem sets on Binary Trees for attendance recovery.
            </p>
          </div>
          <button
            onClick={() => handleIntervene("21BCE1064", "Makeup Problem Set")}
            className="mt-4 w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#11233D] text-xs font-black transition-all cursor-pointer border border-slate-200"
          >
            Dispatch Problem Sets
          </button>
        </div>

        {/* Saturday Tutorial */}
        <div className="p-5 rounded-[28px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#11233D] uppercase tracking-wider">
                Saturday Tutorial
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#825FEF] flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Reserve Lab 4 (Oct 17, 10 AM) for Graph Traversal revision.
            </p>
          </div>
          <button
            onClick={() => handleIntervene("21BCE1105", "Lab 4 Session Reserved")}
            className="mt-4 w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#11233D] text-xs font-black transition-all cursor-pointer border border-slate-200"
          >
            Authorize Lab Session
          </button>
        </div>

        {/* Academic Advisory */}
        <div className="p-5 rounded-[28px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-[#11233D] uppercase tracking-wider">
                Academic Notice
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-[#11233D] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Escalate to academic mentor for critical-tier students (&lt;60%).
            </p>
          </div>
          <button
            onClick={() => handleIntervene("21BCE1178", "Academic Notice")}
            className="mt-4 w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-[#11233D] text-xs font-black transition-all cursor-pointer border border-slate-200"
          >
            Send Mentor Advisory
          </button>
        </div>
      </div>

      {/* Flagged Students Card: Neutral Outlines */}
      <div className="bg-white rounded-[32px] border-2 border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.04)] p-6 sm:p-7">
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student or roll number..."
                className="pl-10 pr-4 py-2 rounded-2xl border-2 border-slate-200 text-xs text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#825FEF] w-56 sm:w-72 bg-slate-50/50"
              />
            </div>

            {/* Severity Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterSeverity("ALL")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  filterSeverity === "ALL"
                    ? "bg-white text-[#11233D] shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All ({totalFlagged})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity("CRITICAL")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  filterSeverity === "CRITICAL"
                    ? "bg-[#11233D] text-white shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Critical ({criticalCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity("MODERATE")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  filterSeverity === "MODERATE"
                    ? "bg-[#11233D] text-white shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Moderate ({moderateCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterSeverity("REMEDIATED")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  filterSeverity === "REMEDIATED"
                    ? "bg-emerald-600 text-white shadow-xs font-black"
                    : "text-slate-500 hover:text-emerald-700"
                }`}
              >
                Remediated ({remediatedCount})
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-bold self-end sm:self-auto">
            Showing {filteredStudents.length} of {totalFlagged} Flagged
          </div>
        </div>

        {/* Student Roster: Clean Neutral Profiles & Big Remedial Actions */}
        <div className="divide-y divide-slate-100 mt-3">
          {filteredStudents.map((st) => (
            <div
              key={st.roll}
              className="py-4 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-2xl transition-all"
            >
              {/* Student Identity - Clean & Neutral */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm shrink-0 border-2 border-slate-200 shadow-2xs">
                  {st.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm sm:text-base font-black text-[#11233D] truncate">
                      {st.name}
                    </h4>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                        st.severity === "critical"
                          ? "bg-rose-50 text-rose-700"
                          : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {st.severity === "critical" ? "Critical" : "Moderate"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {st.roll}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-medium text-slate-500 truncate">
                      {st.reason}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats & Action Area */}
              <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto shrink-0">
                {/* Attendance Stat */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase">
                    Attendance
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      st.attendance < 65 ? "text-rose-600" : "text-amber-600"
                    }`}
                  >
                    {st.attendance}%
                  </span>
                </div>

                {/* CIA-1 Stat */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-extrabold uppercase">
                    CIA-1 Marks
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      st.cia1 < 25 ? "text-rose-600" : "text-[#11233D]"
                    }`}
                  >
                    {st.cia1} <span className="text-slate-400 font-bold text-[10px]">/ 50</span>
                  </span>
                </div>

                {/* Big Action Button */}
                <div className="shrink-0 min-w-[130px] flex justify-end">
                  {st.actionTaken ? (
                    <span className="h-11 px-4 rounded-2xl bg-emerald-50 text-emerald-700 border border-slate-200 text-xs font-black flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Remediated</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleIntervene(st.roll, "Remedial Plan")}
                      className="h-11 px-5 rounded-2xl bg-[#11233D] hover:bg-[#825FEF] text-white text-xs font-black transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#00CEE6]" />
                      <span>Remediate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredStudents.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-400">
              No students found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
