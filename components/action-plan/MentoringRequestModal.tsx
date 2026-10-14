"use client";

import React, { useState } from "react";
import { X, Calendar, UserCheck, CheckCircle2, MessageSquare, Send } from "lucide-react";

interface MentoringRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: { mentor: string; topic: string; slot: string; note: string }) => void;
}

export default function MentoringRequestModal({
  isOpen,
  onClose,
  onSubmit,
}: MentoringRequestModalProps) {
  const [mentor, setMentor] = useState("Prof. S. Sharma (Placement & DSA)");
  const [topic, setTopic] = useState("Graph Traversal & Mock Interview Preparation");
  const [slot, setSlot] = useState("Thursday · 3:30 PM – 4:15 PM");
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ mentor, topic, slot, note });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-[32px] sm:rounded-[38px] shadow-[0_25px_60px_-15px_rgba(17,35,61,0.3),inset_0_2px_4px_rgba(255,255,255,0.95)] border-2 border-slate-300/80 overflow-hidden">
        {/* Header */}
        <div className="bg-[#11233D] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#825FEF]/20 border border-[#825FEF]/30 flex items-center justify-center text-[#825FEF]">
              <UserCheck className="w-5 h-5 text-[#00CEE6]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00CEE6] block">
                1-on-1 Guidance
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                Request Mentoring Session
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-black text-[#11233D]">
              Mentoring Session Requested!
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              A notification has been sent to {mentor}. You will receive a calendar confirmation on your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Select Faculty Mentor
              </label>
              <select
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              >
                <option value="Prof. S. Sharma (Placement & DSA)">Prof. S. Sharma (Placement & DSA)</option>
                <option value="Dr. Srinivas (DBMS & System Architecture)">Dr. Srinivas (DBMS & System Architecture)</option>
                <option value="Ms. Radhika (Soft Skills & Career Coach)">Ms. Radhika (Soft Skills & Career Coach)</option>
                <option value="Prof. K. Verma (Operating Systems)">Prof. K. Verma (Operating Systems)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Guidance Topic / Need
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              >
                <option value="Graph Traversal & Mock Interview Preparation">Graph Traversal & Mock Interview Preparation</option>
                <option value="DBMS Mid-Term Remedial Revision">DBMS Mid-Term Remedial Revision</option>
                <option value="Attendance Recovery Plan & Lab Clearance">Attendance Recovery Plan & Lab Clearance</option>
                <option value="Tier-1 Placement Resume ATS Tuning">Tier-1 Placement Resume ATS Tuning</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Available Office Slot
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              >
                <option value="Thursday · 3:30 PM – 4:15 PM">Thursday · 3:30 PM – 4:15 PM (Cabin 204)</option>
                <option value="Friday · 2:00 PM – 2:45 PM">Friday · 2:00 PM – 2:45 PM (Tech Block A)</option>
                <option value="Saturday · 11:00 AM – 11:45 AM">Saturday · 11:00 AM – 11:45 AM (Virtual Meet)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Specific Questions / Notes (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Briefly state which specific concepts or questions you would like help with..."
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3.5 py-2 text-xs font-medium text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6] resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-black bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
