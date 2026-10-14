"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Search,
} from "lucide-react";

interface FacultyODEndorsementsProps {
  onNavigate?: (tab: string) => void;
}

interface EndorsementRequest {
  id: string;
  student: string;
  roll: string;
  type: string;
  event: string;
  dateRange: string;
  courseAttendance: number;
  submitted: string;
  status: "pending" | "recommended" | "declined";
  comment?: string;
}

const INITIAL_REQUESTS: EndorsementRequest[] = [
  {
    id: "end-1",
    student: "Ananya V.",
    roll: "21BCE1064",
    type: "On-Duty (OD)",
    event: "Smart India Hackathon 2026 Finals (Misses CS301 Lab)",
    dateRange: "Oct 15 - Oct 17",
    courseAttendance: 68.4,
    submitted: "2h ago",
    status: "pending",
  },
  {
    id: "end-2",
    student: "Rohan Sharma",
    roll: "21BCE1042",
    type: "Hackathon OD",
    event: "ACM ICPC Regional Onsite Contest",
    dateRange: "Oct 20 - Oct 21",
    courseAttendance: 88.0,
    submitted: "5h ago",
    status: "pending",
  },
  {
    id: "end-3",
    student: "Karthik Raja",
    roll: "21BCE1012",
    type: "Medical Leave",
    event: "Viral Fever · Doctor Certificate Attached",
    dateRange: "Oct 10 - Oct 11",
    courseAttendance: 74.0,
    submitted: "1d ago",
    status: "recommended",
    comment: "Medical certificate verified. Recommended make-up lab on Saturday.",
  },
];

export default function FacultyODEndorsements({ onNavigate }: FacultyODEndorsementsProps) {
  const [requests, setRequests] = useState<EndorsementRequest[]>(INITIAL_REQUESTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAction = (id: string, status: "recommended" | "declined") => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              comment:
                status === "recommended"
                  ? "Endorsed by Course Instructor (Prof. Rajesh Kumar) · Forwarded to HOD for final pass issuance"
                  : "Declined due to critical attendance deficit (<75%)",
            }
          : r
      )
    );
    setToastMessage(
      status === "recommended"
        ? "✓ Request endorsed & forwarded to HOD Dr. Srinivas Rao"
        : "✕ Request declined by course teacher"
    );
    setTimeout(() => setToastMessage(null), 3500);
  };

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#11233D] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#00CEE6]" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#1A2E4C] to-[#11233D] text-white border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#825FEF]/25 text-[#825FEF] border border-[#825FEF]/40">
              Teacher Endorsement Desk
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              CS301 Lecture & Lab Hours
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Leave & On-Duty Endorsements
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Subject instructor sign-offs for student hackathons, competitions, and medical leaves before HOD approval.
          </p>
        </div>

        <div className="p-3.5 bg-white/10 rounded-2xl border border-white/15 text-center shrink-0">
          <span className="text-2xl font-black text-amber-400 block">{pendingCount}</span>
          <span className="text-[10px] text-slate-300 font-bold uppercase">Pending Endorsement</span>
        </div>
      </div>

      {/* Requests Queue Card */}
      <div className="bg-white rounded-[28px] border-2 border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-[#11233D]">Class OD Endorsement Queue</h3>
            <p className="text-xs text-slate-400 mt-0.5">Students requesting absence during CS301 sessions</p>
          </div>
          <span className="text-xs text-slate-400 font-bold">Role: Subject Teacher Endorsement</span>
        </div>

        <div className="divide-y divide-slate-100 mt-2">
          {requests.map((r) => (
            <div
              key={r.id}
              className="py-4 px-2 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    r.status === "pending"
                      ? "bg-amber-100 text-amber-800"
                      : r.status === "recommended"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-[#11233D]">{r.student}</h4>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">({r.roll})</span>
                    <span className="text-[10px] font-extrabold bg-[#00CEE6]/10 text-[#0099B8] px-2 py-0.5 rounded-full">
                      {r.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{r.event}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span>Dates: {r.dateRange}</span>
                    <span>•</span>
                    <span>Submitted: {r.submitted}</span>
                  </div>
                  {r.comment && (
                    <p className="text-[11px] text-[#825FEF] font-bold mt-1.5 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 inline-block">
                      {r.comment}
                    </p>
                  )}
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4 self-end md:self-auto shrink-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">CS301 Attendance</span>
                  <span
                    className={`text-xs font-black ${
                      r.courseAttendance < 75 ? "text-amber-600" : "text-emerald-600"
                    }`}
                  >
                    {r.courseAttendance}%
                  </span>
                </div>

                {r.status === "pending" ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction(r.id, "recommended")}
                      className="px-3.5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Endorse to HOD</span>
                    </button>
                    <button
                      onClick={() => handleAction(r.id, "declined")}
                      className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer flex items-center gap-1.5"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Decline</span>
                    </button>
                  </div>
                ) : (
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                      r.status === "recommended"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {r.status === "recommended" ? "Endorsed ✓" : "Declined ✕"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
