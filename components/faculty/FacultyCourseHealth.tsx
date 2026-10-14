"use client";

import React from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  Users,
  Award,
  BarChart3,
  Layers,
} from "lucide-react";

interface FacultyCourseHealthProps {
  onNavigate?: (tab: string) => void;
}

export default function FacultyCourseHealth({ onNavigate }: FacultyCourseHealthProps) {
  const units = [
    { number: "Unit 1", title: "Linear Structures (Arrays, Stacks, Queues)", status: "completed", hours: "12/12 hrs" },
    { number: "Unit 2", title: "Non-Linear Structures (Trees, AVL, Heaps)", status: "completed", hours: "14/14 hrs" },
    { number: "Unit 3", title: "Graph Algorithms (BFS, DFS, Dijkstra)", status: "completed", hours: "10/10 hrs" },
    { number: "Unit 4", title: "Minimum Spanning Trees & Disjoint Sets", status: "active", hours: "6/10 hrs", progress: 60 },
    { number: "Unit 5", title: "Dynamic Programming & Greedy Approaches", status: "upcoming", hours: "0/12 hrs" },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#1A2E4C] to-[#11233D] text-white border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#825FEF]/25 text-[#825FEF] border border-[#825FEF]/40">
              Course Health & Syllabus
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              4 Credit Core
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            CS301 · Data Structures & Algorithms
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Section CSE-A · 64 Students · Semester 7
          </p>
        </div>

        {/* Next Lecture Pill */}
        <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-left shrink-0 max-w-xs">
          <div className="flex items-center gap-1.5 text-[#00CEE6] text-[11px] font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Next Lecture Slot</span>
          </div>
          <p className="text-xs font-black text-white mt-1">Tomorrow · 10:00 - 10:50 AM</p>
          <span className="text-[11px] text-slate-300 block">Room 304 · Minimum Spanning Trees</span>
        </div>
      </div>

      {/* 4 Metric Pods */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 block uppercase">Syllabus Covered</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#825FEF]">68%</span>
            <span className="text-xs font-bold text-slate-400">(42 / 58 hrs)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 block uppercase">Class Attendance</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600">81.4%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 block uppercase">CIA-1 Pass Rate</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#11233D]">91.6%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border-2 border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-extrabold text-slate-400 block uppercase">Lab Practicals</span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#00CEE6]">8 / 10</span>
            <span className="text-xs font-bold text-slate-400">Completed</span>
          </div>
        </div>
      </div>

      {/* Syllabus Progress Card */}
      <div className="bg-white rounded-[28px] border-2 border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-black text-[#11233D]">Syllabus Delivery Schedule</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tracking against 58-hour academic calendar</p>
          </div>
          <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-50 text-[#825FEF] border border-purple-200">
            Target Completion: Nov 15
          </span>
        </div>

        <div className="space-y-3">
          {units.map((u) => (
            <div
              key={u.number}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                u.status === "active"
                  ? "bg-purple-50/50 border-[#825FEF]/40 shadow-xs"
                  : u.status === "completed"
                  ? "bg-slate-50/60 border-slate-200"
                  : "bg-white border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    u.status === "completed"
                      ? "bg-emerald-500 text-white"
                      : u.status === "active"
                      ? "bg-[#825FEF] text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {u.status === "completed" ? "✓" : u.number.replace("Unit ", "")}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#11233D]">{u.title}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">{u.hours} delivered</span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {u.status === "completed" && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Completed
                  </span>
                )}
                {u.status === "active" && (
                  <span className="text-[11px] font-bold text-[#825FEF] bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200 animate-pulse">
                    Currently Teaching (60%)
                  </span>
                )}
                {u.status === "upcoming" && (
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    Upcoming (Nov 1)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation Pods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate?.("Mark Attendance")}
          className="p-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-left transition-all cursor-pointer shadow-xs group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-extrabold text-[#11233D] block group-hover:text-[#825FEF]">
              Mark Class Attendance →
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Take today&apos;s Period 2 attendance for CSE-A</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#825FEF] group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onNavigate?.("Internal Marks")}
          className="p-5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-200 text-left transition-all cursor-pointer shadow-xs group flex items-center justify-between"
        >
          <div>
            <span className="text-xs font-extrabold text-[#11233D] block group-hover:text-[#825FEF]">
              Open Course Gradebook →
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">Enter CIA 2 and lab practical assessment scores</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#825FEF] group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
