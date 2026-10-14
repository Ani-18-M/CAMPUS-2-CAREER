"use client";

import React from "react";
import { Users, Layers, Award, BookOpen, Rocket } from "lucide-react";

export default function SmartStudentSegmentation() {
  const segments = [
    {
      id: "seg-1",
      name: "Tier-1 Super-Dream Ready",
      share: "28% (50 Students)",
      traits: "CGPA > 8.5 · Coding > 80% · 0 Backlogs",
      action: "Direct fast-track interview scheduling with Day-1 recruiters",
      isCurrent: false,
      color: "border-slate-200 bg-white text-slate-500",
    },
    {
      id: "seg-2",
      name: "Skill-Deficit High Achievers",
      share: "34% (61 Students)",
      traits: "CGPA > 8.0 · Low Mock Coding Score",
      action: "Automated routing to 3-week DSA & algorithmic bootcamp",
      isCurrent: false,
      color: "border-slate-200 bg-white text-slate-500",
    },
    {
      id: "seg-3",
      name: "High Skill · Attendance-Constrained",
      share: "18% (32 Students)",
      traits: "High Practical Portfolio (88) · Attendance < 75%",
      action: "Assigned make-up lab modules + conditional HOD clearance waiver",
      isCurrent: true,
      color: "border-[#00CEE6] bg-cyan-50/50 text-[#11233D] shadow-md ring-2 ring-[#00CEE6]/40",
    },
    {
      id: "seg-4",
      name: "Alternative Career Trajectory",
      share: "20% (37 Students)",
      traits: "GATE / GRE / Startup Incubation Aspirants",
      action: "Custom roadmap; exempt from corporate placement penalty rules",
      isCurrent: false,
      color: "border-slate-200 bg-white text-slate-500",
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ACBACC]/20 gap-3">
        <div>
          <span className="text-xs font-bold text-[#825FEF] uppercase tracking-wider">
            KPMG Requirement 5 · Smart Student Segmentation
          </span>
          <h3 className="text-xl font-extrabold text-[#11233D] mt-0.5">
            Cohort Clustering Engine
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-[#00CEE6]/20 text-[#11233D] px-3 py-1 rounded-full border border-[#00CEE6]/40">
            Active Segment: High Skill · Attendance-Constrained
          </span>
        </div>
      </div>

      {/* 4 Segment Cluster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        {segments.map((seg) => (
          <div
            key={seg.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${seg.color}`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-extrabold text-[#11233D]">{seg.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-[#ACBACC]/40 text-[#11233D]">
                  {seg.share}
                </span>
              </div>
              <p className="text-xs text-[#ACBACC] font-medium">{seg.traits}</p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#ACBACC]/20 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-semibold">{seg.action}</span>
              {seg.isCurrent && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-[#11233D] text-[#00CEE6] px-2 py-0.5 rounded-md shrink-0 ml-2">
                  Student Assigned
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
