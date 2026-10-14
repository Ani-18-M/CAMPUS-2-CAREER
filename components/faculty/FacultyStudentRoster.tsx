"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Download,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  BarChart3,
  Send,
  Zap,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FacultyStudentRosterProps {
  onViewStudent: (roll: string) => void;
  onNavigate: (tab: string) => void;
}

type RiskLevel = "safe" | "moderate" | "critical";

interface Student {
  roll: string;
  name: string;
  cgpa: number;
  attendance: number;
  coding: number;
  score: number;
  risk: RiskLevel;
  segment: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const STUDENTS: Student[] = [
  { roll: "21BCE1001", name: "Meera Krishnan",   cgpa: 9.15, attendance: 91, coding: 92, score: 96, risk: "safe",     segment: "Super-Dream Ready" },
  { roll: "21BCE1042", name: "Rohan Sharma",      cgpa: 8.92, attendance: 88, coding: 89, score: 92, risk: "safe",     segment: "Super-Dream Ready" },
  { roll: "21BCE1089", name: "Ananya V.",          cgpa: 8.42, attendance: 68, coding: 76, score: 74, risk: "moderate", segment: "Attendance-Constrained" },
  { roll: "21BCE1156", name: "Priya Nair",         cgpa: 8.70, attendance: 82, coding: 54, score: 71, risk: "moderate", segment: "Skill-Deficit Achiever" },
  { roll: "21BCE1012", name: "Karthik Raja",       cgpa: 7.10, attendance: 74, coding: 68, score: 69, risk: "moderate", segment: "Borderline" },
  { roll: "21BCE1105", name: "Vikram Patel",       cgpa: 6.20, attendance: 59, coding: 44, score: 51, risk: "critical", segment: "Critical - HOD" },
  { roll: "21BCE1178", name: "Siddharth Verma",    cgpa: 5.80, attendance: 54, coding: 40, score: 48, risk: "critical", segment: "Critical - Barred" },
  { roll: "21BCE1034", name: "Divya Menon",        cgpa: 7.85, attendance: 80, coding: 71, score: 76, risk: "moderate", segment: "On Track" },
];

type SortKey = "score" | "cgpa" | "attendance";

const RISK_CONFIG: Record<RiskLevel, { label: string; pill: string; dot: string }> = {
  safe:     { label: "Safe",     pill: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  moderate: { label: "Moderate", pill: "bg-amber-50 text-amber-700 border border-amber-200",       dot: "bg-amber-500"   },
  critical: { label: "Critical", pill: "bg-rose-50 text-rose-700 border border-rose-200",           dot: "bg-rose-500"    },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ value, risk }: { value: number; risk: RiskLevel }) {
  const color = risk === "safe" ? "bg-emerald-400" : risk === "moderate" ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-sm font-medium text-[#11233D]">{value}</span>
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cfg = RISK_CONFIG[risk];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FacultyStudentRoster({ onViewStudent, onNavigate }: FacultyStudentRosterProps) {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<"all" | RiskLevel>("all");
  const [sortKey, setSortKey] = useState<SortKey>("score");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STUDENTS
      .filter((s) => {
        const matchesSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.roll.toLowerCase().includes(q) ||
          s.segment.toLowerCase().includes(q);
        const matchesRisk = riskFilter === "all" || s.risk === riskFilter;
        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => b[sortKey] - a[sortKey]);
  }, [search, riskFilter, sortKey]);

  const riskCounts = useMemo(
    () => ({
      all: STUDENTS.length,
      critical: STUDENTS.filter((s) => s.risk === "critical").length,
      moderate:  STUDENTS.filter((s) => s.risk === "moderate").length,
      safe:      STUDENTS.filter((s) => s.risk === "safe").length,
    }),
    []
  );

  const riskPills: { key: "all" | RiskLevel; label: string; count: number; active: string; inactive: string }[] = [
    { key: "all",      label: "All",      count: riskCounts.all,      active: "bg-[#825FEF] text-white",                        inactive: "bg-white text-[#11233D] border border-[#ACBACC]/40" },
    { key: "critical", label: "Critical", count: riskCounts.critical, active: "bg-rose-500 text-white",                          inactive: "bg-white text-rose-600 border border-rose-200" },
    { key: "moderate", label: "Moderate", count: riskCounts.moderate, active: "bg-amber-500 text-white",                         inactive: "bg-white text-amber-600 border border-amber-200" },
    { key: "safe",     label: "Safe",     count: riskCounts.safe,     active: "bg-emerald-500 text-white",                       inactive: "bg-white text-emerald-600 border border-emerald-200" },
  ];

  return (
    <div className="min-h-screen bg-[#EEF3F6] font-sans">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-[#11233D] via-[#1a3254] to-[#11233D] px-8 pt-10 pb-8">
        <div className="max-w-7xl mx-auto flex items-start justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#825FEF]/20 border border-[#825FEF]/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#825FEF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Student 360° Roster</h1>
              <p className="text-[#ACBACC] text-sm mt-0.5">CSE-A &nbsp;·&nbsp; 64 Students &nbsp;·&nbsp; Sem 7</p>
            </div>
          </div>

          <button
            onClick={() => {}}
            className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* ── Filters Row ───────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#EEF3F6] px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">

          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ACBACC]" />
            <input
              type="text"
              placeholder="Search student, roll, segment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ACBACC]/30 bg-[#EEF3F6]/60 text-sm text-[#11233D] placeholder:text-[#ACBACC] focus:outline-none focus:ring-2 focus:ring-[#825FEF]/30 focus:border-[#825FEF]"
            />
          </div>

          {/* Risk pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-[#ACBACC]" />
            {riskPills.map((p) => (
              <button
                key={p.key}
                onClick={() => setRiskFilter(p.key)}
                className={`cursor-pointer px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${riskFilter === p.key ? p.active : p.inactive}`}
              >
                {p.label} <span className="opacity-80">({p.count})</span>
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-[#ACBACC] font-medium">Sort by</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="cursor-pointer text-sm text-[#11233D] border border-[#ACBACC]/30 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#825FEF]/30"
            >
              <option value="score">Success Score</option>
              <option value="cgpa">CGPA</option>
              <option value="attendance">Attendance</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">

        {/* ── Table Card ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-[#EEF3F6] overflow-hidden">

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#EEF3F6]">
                  {["Student / Roll", "CGPA", "Attendance", "Coding %", "Success Score", "Risk", "Segment", "Action"].map((col) => (
                    <th
                      key={col}
                      className="px-5 py-4 text-left text-xs font-semibold text-[#ACBACC] uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3F6]">
                {filtered.map((s) => (
                  <tr
                    key={s.roll}
                    className="hover:bg-[#EEF3F6]/40 transition-colors group"
                  >
                    {/* Student / Roll */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#825FEF]/20 to-[#00CEE6]/10 flex items-center justify-center shrink-0">
                          <span className="text-[#825FEF] text-xs font-bold">
                            {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#11233D]">{s.name}</p>
                          <p className="text-xs text-[#ACBACC] font-mono">{s.roll}</p>
                        </div>
                      </div>
                    </td>

                    {/* CGPA */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-[#11233D]">{s.cgpa.toFixed(2)}</span>
                    </td>

                    {/* Attendance */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ScoreBar value={s.attendance} risk={s.risk} />
                    </td>

                    {/* Coding % */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <ScoreBar value={s.coding} risk={s.risk} />
                    </td>

                    {/* Success Score */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-extrabold"
                          style={{ color: s.risk === "safe" ? "#10b981" : s.risk === "moderate" ? "#f59e0b" : "#f43f5e" }}
                        >
                          {s.score}
                        </span>
                        <span className="text-[10px] text-[#ACBACC]">/ 100</span>
                      </div>
                    </td>

                    {/* Risk */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <RiskBadge risk={s.risk} />
                    </td>

                    {/* Segment */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs text-[#11233D] bg-[#EEF3F6] px-2.5 py-1 rounded-lg font-medium">
                        {s.segment}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <button
                        onClick={() => onViewStudent(s.roll)}
                        className="cursor-pointer flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#825FEF] border border-[#825FEF]/30 bg-[#825FEF]/5 hover:bg-[#825FEF] hover:text-white transition-all group-hover:border-[#825FEF]/60"
                      >
                        View Profile
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-16 text-center text-[#ACBACC] text-sm">
              No students match your filters.
            </div>
          )}

          {/* Batch Action Bar */}
          <div className="px-6 py-4 border-t border-[#EEF3F6] bg-[#EEF3F6]/30 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-[#ACBACC] uppercase tracking-wider mr-2">Batch Actions</span>

            <button className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
              <Zap className="w-4 h-4" />
              Dispatch Bootcamp Assignment
            </button>

            <button className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">
              <Send className="w-4 h-4" />
              Send Attendance Alert
            </button>

            <button className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-[#825FEF] text-white hover:bg-[#6d4fd4] transition-all">
              <Download className="w-4 h-4" />
              Generate Roster PDF
            </button>
          </div>
        </div>

        {/* ── Summary Stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              icon: <BarChart3 className="w-5 h-5 text-[#825FEF]" />,
              label: "Avg CGPA",
              value: "7.84",
              sub: "across 64 students",
              bg: "bg-[#825FEF]/5",
            },
            {
              icon: <CheckCircle2 className="w-5 h-5 text-[#00CEE6]" />,
              label: "Avg Attendance",
              value: "76.2%",
              sub: "semester to date",
              bg: "bg-[#00CEE6]/5",
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
              label: "Placement Eligible",
              value: "43",
              sub: "67% of class",
              bg: "bg-emerald-50",
            },
            {
              icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
              label: "Avg Score",
              value: "71.4",
              sub: "success score",
              bg: "bg-amber-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-[#EEF3F6] shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-[#ACBACC] font-medium">{stat.label}</p>
                <p className="text-xl font-extrabold text-[#11233D] leading-tight">{stat.value}</p>
                <p className="text-[11px] text-[#ACBACC]">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
