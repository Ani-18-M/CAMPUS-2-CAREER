"use client";

import React from "react";
import { UserCheck, Calendar, BookOpen, ExternalLink, MessageSquare, Clock, MapPin, CheckCircle2, ChevronRight } from "lucide-react";

export interface MentoringSession {
  id: string;
  mentor: string;
  role: string;
  topic: string;
  slot: string;
  location: string;
  status: "Confirmed" | "Pending Review";
}

interface SupportMentoringSectionProps {
  onOpenMentoringModal: () => void;
  sessions: MentoringSession[];
}

export default function SupportMentoringSection({
  onOpenMentoringModal,
  sessions,
}: SupportMentoringSectionProps) {
  const curatedResources = [
    {
      title: "DBMS Relational Normalization",
      provider: "NPTEL & Faculty",
      category: "Academic",
      link: "#",
    },
    {
      title: "Graph Algorithms & DP",
      provider: "KPMG Code Bank",
      category: "Placement",
      link: "#",
    },
    {
      title: "OS Virtual Memory & Paging",
      provider: "Knowledge Base",
      category: "Academic",
      link: "#",
    },
    {
      title: "Tier-1 SDE Resume Template",
      provider: "Placement Cell",
      category: "Career",
      link: "#",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-300/60 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#825FEF]/10 text-[#825FEF] border border-[#825FEF]/20 shadow-2xs">
              Faculty & Advisors
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#11233D] mt-0.5">
            Support & Mentoring
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Schedule 1-on-1 guidance with faculty mentors and placement advisors.
          </p>
        </div>

        <button
          onClick={onOpenMentoringModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer self-start sm:self-center shadow-sm"
        >
          <UserCheck className="w-4 h-4" />
          <span>Request Session</span>
        </button>
      </div>

      {/* 2-Column Split: Scheduled Mentoring & Curated Learning Library */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Scheduled Mentoring Sessions — Pebble Pods */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-black text-[#11233D] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#00CEE6]" />
              <span>Scheduled Mentoring Sessions</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">
              {sessions.length} Active Requests
            </span>
          </div>

          <div className="space-y-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="p-4 sm:p-5 rounded-[24px] sm:rounded-[26px] bg-white/95 border-2 border-slate-200/90 hover:border-[#00CEE6]/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_6px_18px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:shadow-[0_10px_24px_rgba(17,35,61,0.08),inset_0_2px_4px_rgba(255,255,255,1)]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-black text-[#11233D]">
                      {s.mentor}
                    </h4>
                    <span className="text-[10px] font-bold text-slate-500">
                      ({s.role})
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold">
                    {s.topic}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#00CEE6]" />
                      {s.slot}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#825FEF]" />
                      {s.location}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full border self-start sm:self-center shrink-0 shadow-2xs ${
                    s.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Curated Learning Resources — Pebble Card Container */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-black text-[#11233D] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#825FEF]" />
              <span>Curated Learning Resources</span>
            </h3>
          </div>

          <div className="divide-y divide-slate-100 rounded-[26px] sm:rounded-[28px] border-2 border-slate-200/90 bg-white/95 overflow-hidden shadow-[0_8px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
            {curatedResources.map((res, idx) => (
              <div
                key={idx}
                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
              >
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-black text-[#11233D] group-hover:text-[#00CEE6] transition-colors truncate">
                    {res.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium truncate">
                    {res.provider}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#11233D]/10 text-[#11233D]">
                    {res.category}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#11233D]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
