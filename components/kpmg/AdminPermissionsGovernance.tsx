"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Search,
  Users,
  Download,
  Check,
  X,
  ExternalLink,
  Printer,
  Sparkles,
  Paperclip,
  FileCheck,
} from "lucide-react";
import { SharedPermissionRequest, INITIAL_SHARED_PERMISSIONS } from "@/types/permissions";

interface AdminPermissionsGovernanceProps {
  onNavigate?: (tab: string) => void;
  requests?: SharedPermissionRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function AdminPermissionsGovernance({
  onNavigate,
  requests: externalRequests,
  onApprove,
  onReject,
}: AdminPermissionsGovernanceProps) {
  const [internalRequests, setInternalRequests] = useState<SharedPermissionRequest[]>(INITIAL_SHARED_PERMISSIONS);
  const requests = externalRequests || internalRequests;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "pending" | "approved" | "rejected">("ALL");
  const [selectedRequest, setSelectedRequest] = useState<SharedPermissionRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const total = requests.length;
  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (id: string) => {
    if (onApprove) {
      onApprove(id);
    } else {
      setInternalRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
      );
    }
    showToast("Official Permission Letter stamped and synchronized to SIS");
  };

  const handleReject = (id: string) => {
    if (onReject) {
      onReject(id);
    } else {
      setInternalRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
      );
    }
    showToast("Permission request declined with notification dispatched to student");
  };

  const handleApproveAllPending = () => {
    requests.filter((r) => r.status === "pending").forEach((r) => {
      if (onApprove) onApprove(r.id);
    });
    if (!onApprove) {
      setInternalRequests((prev) =>
        prev.map((r) => (r.status === "pending" ? { ...r, status: "approved" } : r))
      );
    }
    showToast(`Approved and stamped all ${pendingCount} pending permission requests`);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#11233D] text-white px-5 py-3 rounded-full shadow-2xl border-2 border-[#00CEE6]/40 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#00CEE6] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner - Admin Governance */}
      <div className="p-7 sm:p-8 rounded-[36px] bg-gradient-to-r from-[#11233D] via-[#1E3A5F] to-[#11233D] text-white border-2 border-white/15 shadow-[0_20px_45px_rgba(17,35,61,0.2),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#00CEE6]/20 text-[#00CEE6] border border-[#00CEE6]/40">
              Institutional Admin Desk
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00CEE6]" />
              Dr. Srinivas Rao (HOD CSE)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Permission & Leave Governance
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-medium max-w-xl">
            Review student leave applications with attached letters, inspect verification proofs, and issue stamped approvals syncing with SIS attendance.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto relative z-10">
          {pendingCount > 0 && (
            <button
              onClick={handleApproveAllPending}
              className="px-5 py-3 rounded-full bg-[#00CEE6] hover:bg-[#00BCD4] text-[#11233D] text-xs font-black transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,206,230,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.6)] flex items-center gap-2 active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Approve All Pending ({pendingCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 Metric Pods */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05),inset_0_2px_4px_rgba(255,255,255,0.85)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Requests</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-[#11233D]">{total}</div>
            <p className="text-[11px] text-slate-500 font-medium">All Semester submissions</p>
          </div>
          <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full self-start">
            Current Semester
          </span>
        </div>

        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05),inset_0_2px_4px_rgba(255,255,255,0.85)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-700">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Requires HOD endorsement</p>
          </div>
          <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 self-start">
            Action Required
          </span>
        </div>

        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05),inset_0_2px_4px_rgba(255,255,255,0.85)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Approved & Stamped</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-emerald-600">{approvedCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Attendance auto-credited</p>
          </div>
          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start">
            SIS Synced
          </span>
        </div>

        <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_-2px_rgba(17,35,61,0.05),inset_0_2px_4px_rgba(255,255,255,0.85)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-700">Declined</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="my-2">
            <div className="text-3xl font-black text-rose-600">{rejectedCount}</div>
            <p className="text-[11px] text-slate-500 font-medium">Unverified justification</p>
          </div>
          <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 self-start">
            Notice Sent
          </span>
        </div>
      </div>

      {/* Main Governance Table & Filters */}
      <div className="bg-white rounded-[36px] border-2 border-[#ACBACC]/35 shadow-[0_12px_36px_rgba(17,35,61,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] p-6 sm:p-8">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by student name, roll, or event..."
              className="w-full bg-[#F8FAFC] pl-10 pr-4 py-2.5 rounded-full border-2 border-[#ACBACC]/40 text-xs text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#00CEE6] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {(["ALL", "pending", "approved", "rejected"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === filter
                    ? "bg-[#11233D] text-white shadow-xs"
                    : "bg-[#EFF4F7] text-slate-600 hover:bg-slate-200"
                }`}
              >
                {filter === "ALL" ? "All Requests" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="divide-y divide-slate-100 mt-3">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="py-4.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] rounded-2xl transition-all"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#EFF4F7] text-slate-700 flex items-center justify-center font-black text-sm shrink-0 border-2 border-[#ACBACC]/30 shadow-2xs mt-1 sm:mt-0">
                  <FileText className="w-5 h-5 text-[#825FEF]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-[#11233D]">
                      {req.student}
                    </h3>
                    <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                      {req.roll}
                    </span>
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EFF4F7] text-slate-700 border border-slate-200">
                      {req.type}
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        req.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : req.status === "rejected"
                          ? "bg-rose-50 text-rose-700 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      {req.status === "approved"
                        ? "Official Stamped"
                        : req.status === "rejected"
                        ? "Declined"
                        : "Awaiting HOD Sign-Off"}
                    </span>

                    {/* Letter Attached Indicator */}
                    {(req.letterText || req.letterFileName) && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                        <Paperclip className="w-2.5 h-2.5" />
                        <span>Letter Attached</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-500">
                    <span className="font-bold text-[#11233D]">{req.event}</span>
                    <span>·</span>
                    <span className="font-semibold text-slate-600 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#00CEE6]" />
                      {req.dateRange}
                    </span>
                    {req.letterFileName && (
                      <>
                        <span>·</span>
                        <span className="text-[#825FEF] font-bold flex items-center gap-1">
                          <FileCheck className="w-3 h-3" />
                          {req.letterFileName}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="h-9 px-4 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-100 text-[#11233D] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-slate-500" />
                  <span>Review Letter</span>
                </button>

                {req.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="h-9 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all cursor-pointer shadow-xs flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="h-9 px-3.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black transition-all cursor-pointer border border-rose-200"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredRequests.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm font-bold text-slate-400">
              No permission requests found matching your filter.
            </p>
          </div>
        )}
      </div>

      {/* Official Sanctioned Letter & Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 bg-[#11233D]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[36px] border-2 border-slate-200 p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRequest(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#11233D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Head */}
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00CEE6] block">
                Official Department Review Desk
              </span>
              <h2 className="text-lg font-black text-[#11233D] mt-0.5">
                Department of Computer Science & Engineering
              </h2>
              <p className="text-[11px] text-slate-400">Ref: CSE/2026/OD-{selectedRequest.id.toUpperCase()}</p>
            </div>

            {/* Student & Event Meta */}
            <div className="py-4 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Student Name:</span>
                <span className="font-black text-[#11233D]">{selectedRequest.student}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Roll Number:</span>
                <span className="font-mono font-bold text-[#11233D]">{selectedRequest.roll}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Category:</span>
                <span className="font-bold text-[#11233D]">{selectedRequest.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Event:</span>
                <span className="font-bold text-[#11233D]">{selectedRequest.event}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Date Range:</span>
                <span className="font-bold text-[#11233D]">{selectedRequest.dateRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Status:</span>
                <span
                  className={`font-black uppercase text-[11px] ${
                    selectedRequest.status === "approved"
                      ? "text-emerald-600"
                      : selectedRequest.status === "rejected"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            {/* Attached Student Application Letter */}
            {selectedRequest.letterText && (
              <div className="my-3 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-slate-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#825FEF] block mb-1.5">
                  Submitted Student Letter
                </span>
                <p className="text-xs text-[#11233D] whitespace-pre-line leading-relaxed font-medium">
                  {selectedRequest.letterText}
                </p>
              </div>
            )}

            {/* Attached Verification Document Chip */}
            {selectedRequest.letterFileName && (
              <div className="my-3 p-3.5 rounded-2xl bg-[#EFF4F7] border border-[#ACBACC]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-200">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#11233D]">{selectedRequest.letterFileName}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{selectedRequest.letterFileSize || "Uploaded Attachment"}</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Previewing verified document: ${selectedRequest.letterFileName}`)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#11233D] cursor-pointer"
                >
                  Inspect Document
                </button>
              </div>
            )}

            {/* Digital Stamp Notice */}
            <div className="my-3 p-3.5 rounded-2xl bg-[#EFF4F7]/70 border border-[#ACBACC]/30 text-center">
              <p className="text-[11px] text-slate-600 font-medium">
                Approving this request signs with Dr. Srinivas Rao&apos;s digital credential and auto-credits lecture attendance in SIS.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              {selectedRequest.status === "pending" && (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black transition-all cursor-pointer"
                  >
                    Decline Request
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#00CEE6] hover:bg-[#00BCD4] text-[#11233D] text-xs font-black transition-all cursor-pointer shadow-sm"
                  >
                    Stamp & Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
