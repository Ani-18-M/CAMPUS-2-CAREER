"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  Plus,
  X,
  FileText,
  Clock,
  HeartHandshake,
} from "lucide-react";

interface FacultyMenteeGroupProps {
  onNavigate?: (tab: string) => void;
}

interface Mentee {
  roll: string;
  name: string;
  cgpa: number;
  attendance: number;
  targetRole: string;
  lastSession: string;
  status: "on-track" | "needs-attention" | "critical";
  notes: string;
}

const INITIAL_MENTEES: Mentee[] = [
  { roll: "21BCE1001", name: "Meera Krishnan", cgpa: 9.15, attendance: 91.0, targetRole: "Google / Cloud Arch", lastSession: "Oct 2", status: "on-track", notes: "Reviewed Research paper draft; target Day-1 campus drive." },
  { roll: "21BCE1012", name: "Karthik Raja", cgpa: 7.10, attendance: 74.0, targetRole: "Full Stack SDE", lastSession: "Sep 28", status: "needs-attention", notes: "Discussed attendance deficit. Advised Saturday lab makeup." },
  { roll: "21BCE1034", name: "Divya Menon", cgpa: 7.85, attendance: 80.0, targetRole: "Data Analyst", lastSession: "Oct 5", status: "on-track", notes: "Resume ATS evaluated; score 82/100." },
  { roll: "21BCE1042", name: "Rohan Sharma", cgpa: 8.92, attendance: 88.0, targetRole: "Competitive Coding / SDE", lastSession: "Oct 8", status: "on-track", notes: "Approved ICPC Regional qualifier attendance exemption." },
  { roll: "21BCE1064", name: "Ananya V.", cgpa: 8.42, attendance: 68.4, targetRole: "Tier-1 Software Engineer", lastSession: "Yesterday", status: "needs-attention", notes: "High CGPA but 68.4% attendance. Assisted in OD application." },
  { roll: "21BCE1105", name: "Vikram Patel", cgpa: 6.20, attendance: 59.2, targetRole: "Systems Engineer", lastSession: "Oct 1", status: "critical", notes: "Parent contacted regarding continuous absenteeism; remedial term planned." },
  { roll: "21BCE1135", name: "Sneha Reddy", cgpa: 7.60, attendance: 77.5, targetRole: "Frontend Engineer", lastSession: "Sep 22", status: "on-track", notes: "Cleared 2 mock coding assessments." },
  { roll: "21BCE1178", name: "Siddharth Verma", cgpa: 5.80, attendance: 54.0, targetRole: "IT Support / Services", lastSession: "Sep 15", status: "critical", notes: "2 active backlogs. Scheduled mandatory academic counseling." },
];

export default function FacultyMenteeGroup({ onNavigate }: FacultyMenteeGroupProps) {
  const [mentees, setMentees] = useState<Mentee[]>(INITIAL_MENTEES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [counselingNotes, setCounselingNotes] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenLogModal = (mentee: Mentee) => {
    setSelectedMentee(mentee);
    setCounselingNotes(mentee.notes);
    setIsModalOpen(true);
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentee) return;

    setMentees((prev) =>
      prev.map((m) =>
        m.roll === selectedMentee.roll
          ? { ...m, notes: counselingNotes, lastSession: "Today" }
          : m
      )
    );

    setIsModalOpen(false);
    setToastMessage(`✓ Counseling session logged for ${selectedMentee.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredMentees = mentees.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.targetRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Personal Mentorship Desk
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
              Group M4 · 18 Mentees
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Assigned Student Mentees
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Academic counseling, career progression check-ins, and parent correspondence.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center">
            <span className="text-xl font-black text-[#00CEE6] block">18</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase">Mentees</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-center">
            <span className="text-xl font-black text-amber-400 block">2</span>
            <span className="text-[10px] text-slate-300 font-bold uppercase">Critical</span>
          </div>
        </div>
      </div>

      {/* Search & Roster Card */}
      <div className="bg-white rounded-[28px] border-2 border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentee name, roll, or target role..."
              className="pl-8 pr-3 py-1.5 rounded-full border-2 border-slate-200 text-xs text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#825FEF] w-64 sm:w-80"
            />
          </div>

          <span className="text-xs text-slate-400 font-bold">
            Assigned Mentor: Prof. Rajesh Kumar
          </span>
        </div>

        {/* Mentee Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {filteredMentees.map((m) => (
            <div
              key={m.roll}
              className="p-5 rounded-2xl border-2 border-slate-100 hover:border-slate-200 bg-[#EFF4F7]/40 hover:bg-white transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h4 className="text-sm font-black text-[#11233D]">{m.name}</h4>
                    <span className="font-mono text-[10px] text-slate-400">{m.roll}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      m.status === "on-track"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : m.status === "needs-attention"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {m.status === "on-track"
                      ? "On Track"
                      : m.status === "needs-attention"
                      ? "Needs Attention"
                      : "Critical Risk"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-200/60 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">CGPA</span>
                    <span className="text-xs font-black text-[#11233D]">{m.cgpa.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Attendance</span>
                    <span
                      className={`text-xs font-black ${
                        m.attendance < 75 ? "text-rose-600" : "text-emerald-600"
                      }`}
                    >
                      {m.attendance}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Last Met</span>
                    <span className="text-xs font-black text-[#825FEF]">{m.lastSession}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/60 line-clamp-2">
                  <span className="font-bold text-slate-400 text-[10px] uppercase block">Latest Counseling Note:</span>
                  {m.notes}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-200/60">
                <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[160px]">
                  Goal: {m.targetRole}
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenLogModal(m)}
                  className="px-3.5 py-1.5 rounded-full bg-[#11233D] hover:bg-[#825FEF] text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Log Session</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Counseling Log Modal Subscreen */}
      {isModalOpen && selectedMentee && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 bg-[#11233D]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#11233D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#825FEF] bg-purple-50 px-2.5 py-0.5 rounded-full">
              Mentorship Counseling Record
            </span>

            <h3 className="text-xl font-black text-[#11233D] mt-2">
              {selectedMentee.name}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Roll No: {selectedMentee.roll} · CGPA: {selectedMentee.cgpa} · Attendance: {selectedMentee.attendance}%
            </p>

            <form onSubmit={handleSaveNotes} className="mt-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  1-on-1 Mentorship Discussion Notes
                </label>
                <textarea
                  rows={4}
                  value={counselingNotes}
                  onChange={(e) => setCounselingNotes(e.target.value)}
                  placeholder="Record student concerns, attendance recovery goals, career preparation..."
                  className="w-full p-3 rounded-xl border-2 border-slate-200 text-xs text-[#11233D] focus:outline-none focus:border-[#825FEF]"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#825FEF] hover:bg-[#724EE0] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Save & Update Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
