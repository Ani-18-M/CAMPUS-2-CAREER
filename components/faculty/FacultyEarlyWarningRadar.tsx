"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Zap,
  Calendar,
  Mail,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  ShieldAlert,
  TrendingDown,
  Filter,
} from "lucide-react";

interface FacultyEarlyWarningRadarProps {
  onNavigate: (tab: string) => void;
}

interface AtRiskStudent {
  id: string;
  name: string;
  roll: string;
  riskType: "critical" | "moderate";
  riskLabel: string;
  cgpa: number;
  attendance: number;
  score: number;
}

interface MatrixStudent {
  name: string;
  roll: string;
  flag: string;
}

const academicRiskStudents: MatrixStudent[] = [
  { name: "Riya Mehta",      roll: "CS21B041", flag: "CGPA 4.8 · 3 Backlogs" },
  { name: "Karan Desai",     roll: "CS21B012", flag: "CGPA 5.1 · Attendance 52%" },
  { name: "Preethi Suresh",  roll: "CS21B077", flag: "CGPA 5.6 · 1 Backlog" },
  { name: "Arnav Tiwari",    roll: "CS21B033", flag: "CGPA 6.2 · Attendance 58%" },
];

const placementRiskStudents: MatrixStudent[] = [
  { name: "Sneha Pillai",    roll: "CS21B055", flag: "Coding 38% · Score 44" },
  { name: "Dev Nambiar",     roll: "CS21B019", flag: "Score 51 · Aptitude Fail" },
  { name: "Ananya Joshi",    roll: "CS21B068", flag: "Coding 44% · Score 57" },
  { name: "Vikram Reddy",    roll: "CS21B007", flag: "Score 48 · 0 LeetCode" },
];

const atRiskStudents: AtRiskStudent[] = [
  { id: "s1", name: "Riya Mehta",      roll: "CS21B041", riskType: "critical",  riskLabel: "Academic + Placement", cgpa: 4.8,  attendance: 54, score: 42 },
  { id: "s2", name: "Sneha Pillai",    roll: "CS21B055", riskType: "critical",  riskLabel: "Placement Deficit",    cgpa: 6.9,  attendance: 73, score: 44 },
  { id: "s3", name: "Karan Desai",     roll: "CS21B012", riskType: "critical",  riskLabel: "Academic Failure",     cgpa: 5.1,  attendance: 52, score: 55 },
  { id: "s4", name: "Arnav Tiwari",    roll: "CS21B033", riskType: "moderate",  riskLabel: "Low Attendance",       cgpa: 6.2,  attendance: 58, score: 63 },
  { id: "s5", name: "Ananya Joshi",    roll: "CS21B068", riskType: "moderate",  riskLabel: "Skill Deficit",        cgpa: 7.1,  attendance: 74, score: 57 },
  { id: "s6", name: "Dev Nambiar",     roll: "CS21B019", riskType: "moderate",  riskLabel: "Score Below Threshold", cgpa: 6.8, attendance: 70, score: 51 },
];

type RiskFilter = "all" | "critical" | "moderate";
type DispatchKey = "bootcamp" | "makeup" | "hod";

export default function FacultyEarlyWarningRadar({ onNavigate }: FacultyEarlyWarningRadarProps) {
  const [dispatchState, setDispatchState] = useState<Record<DispatchKey, boolean>>({
    bootcamp: false,
    makeup: false,
    hod: false,
  });
  const [riskFilter, setRiskFilter] = useState<RiskFilter>("all");
  const [intervenedIds, setIntervenedIds] = useState<Set<string>>(new Set());

  const handleDispatch = (key: DispatchKey) => {
    setDispatchState((prev) => ({ ...prev, [key]: true }));
  };

  const handleIntervene = (id: string) => {
    setIntervenedIds((prev) => new Set(prev).add(id));
  };

  const filteredStudents = atRiskStudents.filter((s) => {
    if (riskFilter === "all") return true;
    return s.riskType === riskFilter;
  });

  return (
    <div className="min-h-screen bg-[#EEF3F6] p-6 space-y-6">

      {/* ── Header Banner ─────────────────────────────────────────── */}
      <div
        className="rounded-3xl p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
        style={{ background: "linear-gradient(135deg, #11233D 0%, #1a3560 100%)" }}
      >
        {/* Left */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="text-[#825FEF]" size={22} />
            <h1 className="text-white text-2xl font-bold tracking-tight">Early Warning Radar</h1>
          </div>
          <p className="text-[#ACBACC] text-sm">AI-Driven Risk Identification · CSE-A</p>

          {/* Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              46 Students Flagged
            </span>
            <span className="bg-rose-500/20 text-rose-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-500/30">
              14 Critical
            </span>
            <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/30">
              32 Moderate
            </span>
          </div>
        </div>

        {/* Dispatch All Button */}
        <button
          onClick={() => setDispatchState({ bootcamp: true, makeup: true, hod: true })}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold cursor-pointer transition-all hover:opacity-90 active:scale-95 self-start md:self-auto"
          style={{ background: "#825FEF" }}
        >
          <Zap size={16} />
          Dispatch All
        </button>
      </div>

      {/* ── Risk Summary Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Critical */}
        <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-rose-500 uppercase tracking-widest mb-1">Critical Risk</p>
              <p className="text-4xl font-bold text-rose-600">14</p>
              <p className="text-sm text-[#ACBACC] mt-1">Students · Score &lt; 60</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center">
              <AlertTriangle className="text-rose-500" size={20} />
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-rose-100 overflow-hidden">
            <div className="h-full w-[30%] bg-rose-500 rounded-full" />
          </div>
          <p className="text-xs text-[#ACBACC] mt-1.5">30% of section flagged</p>
        </div>

        {/* Moderate */}
        <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest mb-1">Moderate Risk</p>
              <p className="text-4xl font-bold text-amber-600">32</p>
              <p className="text-sm text-[#ACBACC] mt-1">Students · Score 60–74</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 flex items-center justify-center">
              <TrendingDown className="text-amber-500" size={20} />
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-amber-100 overflow-hidden">
            <div className="h-full w-[69%] bg-amber-400 rounded-full" />
          </div>
          <p className="text-xs text-[#ACBACC] mt-1.5">69% of flagged cohort</p>
        </div>

        {/* Remediation Pending */}
        <div className="bg-white rounded-2xl p-5 border border-violet-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-[#825FEF] uppercase tracking-widest mb-1">Remediation Pending</p>
              <p className="text-4xl font-bold" style={{ color: "#825FEF" }}>8</p>
              <p className="text-sm text-[#ACBACC] mt-1">Actions · Not Dispatched</p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-violet-50 flex items-center justify-center">
              <Clock size={20} style={{ color: "#825FEF" }} />
            </div>
          </div>
          <div className="mt-4 h-1.5 rounded-full bg-violet-100 overflow-hidden">
            <div className="h-full w-[17%] rounded-full" style={{ background: "#825FEF" }} />
          </div>
          <p className="text-xs text-[#ACBACC] mt-1.5">Awaiting faculty action</p>
        </div>
      </div>

      {/* ── Dual-Axis Risk Matrix ──────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EEF3F6]">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#825FEF20" }}>
            <Filter size={15} style={{ color: "#825FEF" }} />
          </div>
          <h2 className="text-[#11233D] font-bold text-base">Risk Axis Classification</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Academic Failure Risk */}
          <div className="rounded-2xl bg-rose-50 border border-rose-100 p-4">
            <p className="text-xs font-semibold text-rose-600 uppercase tracking-widest mb-3">
              Academic Failure Risk
            </p>
            <div className="space-y-2.5">
              {academicRiskStudents.map((s) => (
                <div key={s.roll} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-rose-100">
                  <div>
                    <p className="text-sm font-semibold text-[#11233D]">{s.name}</p>
                    <p className="text-[11px] text-[#ACBACC]">{s.roll}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">
                      {s.flag}
                    </span>
                  </div>
                  <button className="text-[11px] font-semibold text-rose-600 border border-rose-300 px-2.5 py-1 rounded-full cursor-pointer hover:bg-rose-50 transition-colors whitespace-nowrap">
                    1-click Intervene
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Placement Failure Risk */}
          <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest mb-3">
              Placement Failure Risk
            </p>
            <div className="space-y-2.5">
              {placementRiskStudents.map((s) => (
                <div key={s.roll} className="flex items-center justify-between bg-white rounded-xl px-3 py-2.5 border border-amber-100">
                  <div>
                    <p className="text-sm font-semibold text-[#11233D]">{s.name}</p>
                    <p className="text-[11px] text-[#ACBACC]">{s.roll}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                      {s.flag}
                    </span>
                  </div>
                  <button className="text-[11px] font-semibold text-amber-700 border border-amber-300 px-2.5 py-1 rounded-full cursor-pointer hover:bg-amber-50 transition-colors whitespace-nowrap">
                    1-click Intervene
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Remediation Actions Panel ──────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EEF3F6]">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#825FEF20" }}>
            <Zap size={15} style={{ color: "#825FEF" }} />
          </div>
          <h2 className="text-[#11233D] font-bold text-base">AI Remediation Dispatch</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Bootcamp Assignment */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Zap className="text-amber-600" size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#11233D]">Bootcamp Assignment</p>
              <p className="text-xs text-[#ACBACC] mt-0.5 leading-relaxed">
                Targets <span className="font-semibold text-amber-700">18 students</span> with identified skill deficits in DSA &amp; Aptitude
              </p>
            </div>
            <div className="mt-auto">
              {dispatchState.bootcamp ? (
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold">
                  <CheckCircle2 size={15} />
                  Dispatched ✓
                </div>
              ) : (
                <button
                  onClick={() => handleDispatch("bootcamp")}
                  className="w-full py-2 rounded-full text-xs font-semibold text-white bg-amber-500 cursor-pointer hover:bg-amber-600 transition-colors"
                >
                  Dispatch Now
                </button>
              )}
            </div>
          </div>

          {/* Make-up Lab */}
          <div className="rounded-2xl border border-[#00CEE6]/20 bg-cyan-50 p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00CEE6]/20 flex items-center justify-center">
              <Calendar className="text-[#00CEE6]" size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#11233D]">Make-up Lab Authorization</p>
              <p className="text-xs text-[#ACBACC] mt-0.5 leading-relaxed">
                Allows <span className="font-semibold text-[#00CEE6]">32 attendance-constrained</span> students to attend compensatory sessions
              </p>
            </div>
            <div className="mt-auto">
              {dispatchState.makeup ? (
                <div className="flex items-center gap-1.5 text-[#00CEE6] text-xs font-semibold">
                  <CheckCircle2 size={15} />
                  Dispatched ✓
                </div>
              ) : (
                <button
                  onClick={() => handleDispatch("makeup")}
                  className="w-full py-2 rounded-full text-xs font-semibold text-white cursor-pointer transition-colors"
                  style={{ background: "#00CEE6" }}
                >
                  Authorize
                </button>
              )}
            </div>
          </div>

          {/* HOD Counseling */}
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Mail className="text-rose-600" size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#11233D]">HOD Counseling Escalation</p>
              <p className="text-xs text-[#ACBACC] mt-0.5 leading-relaxed">
                Escalates <span className="font-semibold text-rose-600">14 critical risk</span> students to Head of Department for immediate counseling
              </p>
            </div>
            <div className="mt-auto">
              {dispatchState.hod ? (
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold">
                  <CheckCircle2 size={15} />
                  Dispatched ✓
                </div>
              ) : (
                <button
                  onClick={() => handleDispatch("hod")}
                  className="w-full py-2 rounded-full text-xs font-semibold text-white bg-rose-500 cursor-pointer hover:bg-rose-600 transition-colors"
                >
                  Escalate
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── At-Risk Student Table ──────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EEF3F6]">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#825FEF20" }}>
              <Users size={15} style={{ color: "#825FEF" }} />
            </div>
            <h2 className="text-[#11233D] font-bold text-base">At-Risk Student List</h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1.5 bg-[#EEF3F6] p-1 rounded-full">
            {(["all", "critical", "moderate"] as RiskFilter[]).map((f) => {
              const labels: Record<RiskFilter, string> = {
                all: "All At-Risk (46)",
                critical: "Critical (14)",
                moderate: "Moderate (32)",
              };
              return (
                <button
                  key={f}
                  onClick={() => setRiskFilter(f)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full cursor-pointer transition-all ${
                    riskFilter === f
                      ? "text-white shadow-sm"
                      : "text-[#ACBACC] hover:text-[#11233D]"
                  }`}
                  style={riskFilter === f ? { background: "#825FEF" } : {}}
                >
                  {labels[f]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-[#EEF3F6]">
                {["Student", "Risk Type", "CGPA", "Attendance", "Score", "Action"].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-[#ACBACC] uppercase tracking-widest pb-3 pr-4"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF3F6]">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[#EEF3F6]/50 transition-colors">
                  {/* Student */}
                  <td className="py-3.5 pr-4">
                    <p className="text-sm font-semibold text-[#11233D]">{s.name}</p>
                    <p className="text-[11px] text-[#ACBACC]">{s.roll}</p>
                  </td>

                  {/* Risk Type */}
                  <td className="py-3.5 pr-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                        s.riskType === "critical"
                          ? "bg-rose-100 text-rose-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s.riskType === "critical" ? (
                        <AlertTriangle size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      {s.riskLabel}
                    </span>
                  </td>

                  {/* CGPA */}
                  <td className="py-3.5 pr-4">
                    <span
                      className={`text-sm font-bold ${
                        s.cgpa < 6
                          ? "text-rose-600"
                          : s.cgpa < 7
                          ? "text-amber-600"
                          : "text-[#11233D]"
                      }`}
                    >
                      {s.cgpa.toFixed(1)}
                    </span>
                  </td>

                  {/* Attendance */}
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-[#EEF3F6] overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            s.attendance < 60
                              ? "bg-rose-500"
                              : s.attendance < 75
                              ? "bg-amber-400"
                              : "bg-emerald-400"
                          }`}
                          style={{ width: `${s.attendance}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          s.attendance < 60
                            ? "text-rose-600"
                            : s.attendance < 75
                            ? "text-amber-600"
                            : "text-[#11233D]"
                        }`}
                      >
                        {s.attendance}%
                      </span>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-3.5 pr-4">
                    <span
                      className={`text-sm font-bold ${
                        s.score < 55
                          ? "text-rose-600"
                          : s.score < 65
                          ? "text-amber-600"
                          : "text-[#11233D]"
                      }`}
                    >
                      {s.score}
                    </span>
                    <span className="text-[#ACBACC] text-xs">/100</span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5">
                    {intervenedIds.has(s.id) ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                        <CheckCircle2 size={13} />
                        Intervened
                      </div>
                    ) : (
                      <button
                        onClick={() => handleIntervene(s.id)}
                        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full cursor-pointer transition-all hover:opacity-90 active:scale-95 ${
                          s.riskType === "critical"
                            ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        Intervene
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[#EEF3F6] flex items-center justify-between">
          <p className="text-xs text-[#ACBACC]">
            Showing {filteredStudents.length} of {riskFilter === "all" ? 46 : riskFilter === "critical" ? 14 : 32} students
          </p>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
            style={{ color: "#825FEF" }}
            onClick={() => onNavigate("students")}
          >
            View All Students
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
