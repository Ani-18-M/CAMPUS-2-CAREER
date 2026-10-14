"use client";

import React, { useState } from "react";
import {
  Award,
  Download,
  Send,
  Search,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  Users,
  Check,
  Calendar,
  Layers,
} from "lucide-react";

interface FacultyGradebookProps {
  onNavigate?: (tab: string) => void;
}

type AssessmentType = "cia1" | "cia2" | "lab";

interface StudentGrade {
  roll: string;
  name: string;
  cia1: number | null;
  cia2: number | null;
  lab: number | null;
  status: "published" | "draft";
}

const INITIAL_STUDENTS: StudentGrade[] = [
  { roll: "21BCE1001", name: "Meera Krishnan", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1012", name: "Karthik Raja", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1034", name: "Divya Menon", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1042", name: "Rohan Sharma", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1064", name: "Ananya V.", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1089", name: "Priya Nair", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1105", name: "Vikram Patel", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1120", name: "Aditya S.", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1135", name: "Sneha Reddy", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1150", name: "Rahul Verma", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1178", name: "Siddharth Verma", cia1: null, cia2: null, lab: null, status: "draft" },
  { roll: "21BCE1192", name: "Kavya Murthy", cia1: null, cia2: null, lab: null, status: "draft" },
];

export default function FacultyGradebook({ onNavigate }: FacultyGradebookProps) {
  const [grades, setGrades] = useState<StudentGrade[]>(INITIAL_STUDENTS);
  const [activeAssessment, setActiveAssessment] = useState<AssessmentType>("cia1");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "EVALUATED">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Assessment configurations
  const assessmentMeta: Record<AssessmentType, { title: string; maxMarks: number; passingMarks: number }> = {
    cia1: { title: "Continuous Internal Assessment 1 (CIA-1)", maxMarks: 50, passingMarks: 25 },
    cia2: { title: "Continuous Internal Assessment 2 (CIA-2)", maxMarks: 50, passingMarks: 25 },
    lab: { title: "Laboratory Practical Evaluation", maxMarks: 25, passingMarks: 13 },
  };

  const currentMeta = assessmentMeta[activeAssessment];

  // Statistics for current assessment
  const total = grades.length;
  const validScores = grades
    .map((g) => g[activeAssessment])
    .filter((v): v is number => v !== null && !isNaN(v));

  const evaluatedCount = validScores.length;
  const pendingCount = total - evaluatedCount;
  const classAvg =
    evaluatedCount > 0
      ? (validScores.reduce((acc, v) => acc + v, 0) / evaluatedCount).toFixed(1)
      : "--";
  const passCount = validScores.filter((v) => v >= currentMeta.passingMarks).length;
  const passRate = evaluatedCount > 0 ? Math.round((passCount / evaluatedCount) * 100) : 0;

  const handleScoreChange = (roll: string, field: AssessmentType, rawValue: string) => {
    let value: number | null = null;
    if (rawValue.trim() !== "") {
      const num = Number(rawValue);
      if (!isNaN(num)) {
        value = Math.max(0, Math.min(assessmentMeta[field].maxMarks, num));
      }
    }

    setGrades((prev) =>
      prev.map((g) => (g.roll === roll ? { ...g, [field]: value } : g))
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClearAll = () => {
    setGrades((prev) =>
      prev.map((g) => ({ ...g, [activeAssessment]: null }))
    );
    showToast(`Cleared all ${activeAssessment.toUpperCase()} scores`);
  };

  const handlePrefillSample = () => {
    const sampleScores: Record<string, number> = {
      "21BCE1001": activeAssessment === "lab" ? 24 : 48,
      "21BCE1012": activeAssessment === "lab" ? 18 : 34,
      "21BCE1034": activeAssessment === "lab" ? 21 : 40,
      "21BCE1042": activeAssessment === "lab" ? 23 : 46,
      "21BCE1064": activeAssessment === "lab" ? 20 : 41,
      "21BCE1089": activeAssessment === "lab" ? 22 : 43,
      "21BCE1105": activeAssessment === "lab" ? 12 : 22,
      "21BCE1120": activeAssessment === "lab" ? 20 : 39,
      "21BCE1135": activeAssessment === "lab" ? 19 : 37,
      "21BCE1150": activeAssessment === "lab" ? 22 : 44,
      "21BCE1178": activeAssessment === "lab" ? 11 : 19,
      "21BCE1192": activeAssessment === "lab" ? 25 : 47,
    };

    setGrades((prev) =>
      prev.map((g) => ({
        ...g,
        [activeAssessment]: sampleScores[g.roll] ?? null,
      }))
    );
    showToast(`Loaded sample scores for ${activeAssessment.toUpperCase()}`);
  };

  const handlePublishAll = () => {
    if (evaluatedCount === 0) {
      showToast("Please enter marks before publishing");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setGrades((prev) => prev.map((g) => ({ ...g, status: "published" })));
      showToast(`Synchronized ${evaluatedCount}/${total} marks to SIS portal`);
    }, 700);
  };

  const getScoreChip = (score: number | null, maxMarks: number) => {
    if (score === null) {
      return (
        <span className="text-xs font-bold text-slate-400">
          Not Entered
        </span>
      );
    }
    const pct = (score / maxMarks) * 100;
    if (pct >= 85) {
      return (
        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Top Score
        </span>
      );
    }
    if (pct >= 50) {
      return (
        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          Pass
        </span>
      );
    }
    return (
      <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        Below Cutoff
      </span>
    );
  };

  const filteredGrades = grades.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.roll.toLowerCase().includes(searchQuery.toLowerCase());
    const isEvaluated = g[activeAssessment] !== null;
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "EVALUATED"
        ? isEvaluated
        : !isEvaluated;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#11233D] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#00CEE6]/40 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#00CEE6] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#1A2E4C] to-[#11233D] text-white border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#825FEF]/25 text-[#825FEF] border border-[#825FEF]/40">
              Internal Evaluation Sheet
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#00CEE6]" />
              CS301 · Section CSE-A
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Gradebook & CIA Evaluation
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Course: Data Structures & Algorithms · Faculty: Prof. Rajesh Kumar
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handlePrefillSample}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition-all border border-white/15 cursor-pointer shadow-xs"
          >
            Sample Marks
          </button>
          <button
            onClick={handleClearAll}
            title="Clear all scores"
            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition-all border border-white/15 cursor-pointer shadow-xs flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4 text-slate-300" />
          </button>
          <button
            onClick={handlePublishAll}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-2xl bg-[#825FEF] hover:bg-[#724EE0] text-white text-xs font-extrabold transition-all shadow-[0_4px_16px_rgba(130,95,239,0.35)] cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Syncing..." : "Submit to SIS"}</span>
          </button>
        </div>
      </div>

      {/* KPI Pods: Enrolled, Evaluated, Class Average, Pass Rate */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Enrolled Pod */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
              Enrolled
            </span>
            <span className="text-2xl sm:text-3xl font-black text-[#11233D]">{total}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#11233D] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Evaluated Pod */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
              Evaluated
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#11233D]">{evaluatedCount}</span>
              <span className="text-xs font-bold text-slate-400">/ {total}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Class Average Pod */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
              Batch Average
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl sm:text-3xl font-black text-[#825FEF]">{classAvg}</span>
              <span className="text-xs font-bold text-slate-400">/ {currentMeta.maxMarks}</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#825FEF] flex items-center justify-center font-black">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Pass Rate Pod */}
        <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
              Pass Rate
            </span>
            <span
              className={`text-2xl sm:text-3xl font-black ${
                passRate >= 75 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {evaluatedCount > 0 ? `${passRate}%` : "--"}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grade Entry Table Card */}
      <div className="bg-white rounded-[32px] border-2 border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.05)] p-6 sm:p-7">
        {/* Assessment Switcher Tabs */}
        <div className="flex items-center gap-2 pb-5 border-b border-slate-100 flex-wrap">
          <span className="text-xs font-black uppercase text-slate-400 mr-1 tracking-wider">
            Assessment:
          </span>
          <button
            onClick={() => setActiveAssessment("cia1")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAssessment === "cia1"
                ? "bg-[#11233D] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            CIA-1 (Max 50)
          </button>
          <button
            onClick={() => setActiveAssessment("cia2")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAssessment === "cia2"
                ? "bg-[#11233D] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            CIA-2 (Max 50)
          </button>
          <button
            onClick={() => setActiveAssessment("lab")}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${
              activeAssessment === "lab"
                ? "bg-[#11233D] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Lab Continuous (Max 25)
          </button>
        </div>

        {/* Toolbar & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-slate-100">
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

            {/* Filter: All / Pending / Evaluated */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setStatusFilter("ALL")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  statusFilter === "ALL"
                    ? "bg-white text-[#11233D] shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                All ({total})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("PENDING")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  statusFilter === "PENDING"
                    ? "bg-white text-[#11233D] shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("EVALUATED")}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                  statusFilter === "EVALUATED"
                    ? "bg-white text-[#11233D] shadow-xs font-black"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Evaluated ({evaluatedCount})
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-bold self-end sm:self-auto">
            Showing {filteredGrades.length} of {total} Students
          </div>
        </div>

        {/* Student Rows with Large, High-Visibility Score Inputs */}
        <div className="divide-y divide-slate-100 mt-3">
          {filteredGrades.map((st) => {
            const currentScore = st[activeAssessment];
            const isEntered = currentScore !== null;

            return (
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
                    <h4 className="text-sm sm:text-base font-black text-[#11233D] truncate">
                      {st.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {st.roll}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score Input & Status Area */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto shrink-0">
                  {/* Status Tag */}
                  <div className="shrink-0">
                    {getScoreChip(currentScore, currentMeta.maxMarks)}
                  </div>

                  {/* Big High-Visibility Score Input */}
                  <div className="flex items-center gap-2">
                    <div className="h-12 sm:h-13 px-4 rounded-2xl border-2 border-slate-200 bg-slate-50 hover:bg-white focus-within:bg-white focus-within:border-[#825FEF] flex items-center gap-2 shadow-2xs transition-all">
                      <input
                        type="number"
                        min="0"
                        max={currentMeta.maxMarks}
                        value={currentScore ?? ""}
                        placeholder="--"
                        onChange={(e) =>
                          handleScoreChange(st.roll, activeAssessment, e.target.value)
                        }
                        className="w-16 sm:w-20 text-center font-black text-base sm:text-lg text-[#11233D] bg-transparent focus:outline-none placeholder-slate-300"
                      />
                      <span className="text-xs font-extrabold text-slate-400 select-none">
                        / {currentMeta.maxMarks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredGrades.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-400">
              No students found matching your search.
            </p>
          </div>
        )}

        {/* Bottom Submission Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>
              Evaluated: <strong className="text-[#11233D] font-black">{evaluatedCount} of {total} Students</strong>
              {pendingCount > 0 && (
                <> · <strong className="text-amber-700 font-bold">{pendingCount} Pending</strong></>
              )}
            </span>
          </div>

          <button
            onClick={handlePublishAll}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#11233D] hover:bg-[#825FEF] text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-[#00CEE6]" />
            <span>Confirm & Publish Marks</span>
          </button>
        </div>
      </div>
    </div>
  );
}
