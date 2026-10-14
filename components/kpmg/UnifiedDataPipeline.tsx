"use client";

import React, { useState } from "react";
import { Database, RefreshCw, CheckCircle2, GitBranch, Server, BookOpen, Briefcase } from "lucide-react";

export default function UnifiedDataPipeline() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState("Just now");

  const sources = [
    {
      id: "erp",
      name: "Institutional ERP / SIS",
      icon: Server,
      dataTypes: "CGPA (8.42), 146 Credits, Biometric Attendance",
      status: "Synced",
      syncAgo: "12m ago",
      records: "1,420 Data Points",
    },
    {
      id: "lms",
      name: "LMS (Moodle / Canvas)",
      icon: BookOpen,
      dataTypes: "Lab Submissions, Internal Quizzes, Faculty Feedback",
      status: "Synced",
      syncAgo: "45m ago",
      records: "28 Assessments",
    },
    {
      id: "coding",
      name: "Coding APIs (GitHub & LeetCode)",
      icon: GitBranch,
      dataTypes: "2 Verified Repositories, 312 Algorithmic Solves",
      status: "Live Connected",
      syncAgo: "Real-time",
      records: "Continuous Stream",
    },
    {
      id: "tp",
      name: "T&P Corporate Drive Hub",
      icon: Briefcase,
      dataTypes: "Eligibility Cutoffs, Drive Registrations, ATS Resume",
      status: "Synced",
      syncAgo: "1h ago",
      records: "78 Active Drives",
    },
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSyncTime("Just now");
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#ACBACC]/30 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.04)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#ACBACC]/20 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00CEE6] animate-pulse" />
            <span className="text-xs font-bold text-[#825FEF] uppercase tracking-wider">
              KPMG Requirement 1 · Data Ingestion Engine
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[#11233D] mt-0.5">
            Unified Student Data Integration
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#ACBACC] font-medium hidden md:inline">
            Pipeline Health: <strong className="text-emerald-600">100% Operational</strong>
          </span>
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#00CEE6]" : ""}`} />
            <span>{isSyncing ? "Syncing Pipelines..." : "Sync All Data"}</span>
          </button>
        </div>
      </div>

      {/* 4 Pipeline Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {sources.map((src) => {
          const Icon = src.icon;
          return (
            <div
              key={src.id}
              className="p-5 rounded-2xl bg-[#EFF4F7]/60 border border-[#ACBACC]/25 hover:border-[#00CEE6] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#ACBACC]/30 flex items-center justify-center text-[#11233D] shadow-xs">
                    <Icon className="w-4 h-4 text-[#825FEF]" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {src.status}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-[#11233D]">{src.name}</h4>
                <p className="text-[11px] text-[#ACBACC] mt-1 font-medium leading-relaxed">
                  {src.dataTypes}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#ACBACC]/20 flex items-center justify-between text-[10px] text-[#ACBACC]">
                <span>{src.records}</span>
                <span className="font-semibold text-[#11233D]">{src.syncAgo}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
