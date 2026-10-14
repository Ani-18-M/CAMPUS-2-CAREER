"use client";

import React, { useState } from "react";
import {
  FileText,
  QrCode,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Download,
  MapPin,
  X,
  ExternalLink,
  ShieldCheck,
  Send,
  UserCheck,
  Sparkles,
  Paperclip,
  UploadCloud,
  FileCheck,
  Trash2,
} from "lucide-react";
import { SharedPermissionRequest, INITIAL_SHARED_PERMISSIONS } from "@/types/permissions";

interface StudentPermissionsViewProps {
  onOpenQR?: () => void;
  onNavigateTab?: (tab: string) => void;
  permissions?: SharedPermissionRequest[];
  onAddPermission?: (newReq: SharedPermissionRequest) => void;
}

export default function StudentPermissionsView({
  onOpenQR,
  onNavigateTab,
  permissions: externalPermissions,
  onAddPermission,
}: StudentPermissionsViewProps) {
  // Use passed shared permissions or local fallback
  const [internalPermissions, setInternalPermissions] = useState<SharedPermissionRequest[]>(
    INITIAL_SHARED_PERMISSIONS.filter(
      (r) => r.student === "Ananya V." || r.roll === "21BCE1089" || r.roll === "21BCE1064"
    )
  );

  const displayPermissions = externalPermissions || internalPermissions;

  const [activeTab, setActiveTab] = useState<"letters" | "passes">("letters");
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<SharedPermissionRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Request Form State (with Letter & Document Attachment)
  const [formType, setFormType] = useState<"On-Duty (OD)" | "Medical Leave" | "Lab Access">("On-Duty (OD)");
  const [formEvent, setFormEvent] = useState("");
  const [formDates, setFormDates] = useState("");
  const [formLetterText, setFormLetterText] = useState("");
  const [formFileName, setFormFileName] = useState("");
  const [formFileSize, setFormFileSize] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePrefillLetter = () => {
    const eventName = formEvent.trim() || "Smart India Hackathon 2026 Grand Finale";
    const dates = formDates.trim() || "Oct 24 – Oct 26, 2026";
    setFormEvent(eventName);
    setFormDates(dates);
    setFormLetterText(
      `Respected HOD Dr. Srinivas Rao Sir,\n\nI am writing to formally request On-Duty (OD) sanction for participating in ${eventName} scheduled during ${dates}.\n\nOur team has advanced to the offline finals, and our attendance at the designated venue is mandatory. I kindly request you to approve my leave and auto-credit attendance in the SIS portal for the missed lab and theory periods.\n\nAttached is the official finalist selection and invitation letter for your verification.\n\nThanking you,\nYours sincerely,\nAnanya V. (Roll: 21BCE1089)\nDepartment of Computer Science & Engineering`
    );
    if (!formFileName) {
      setFormFileName("SIH_Finals_Official_Invitation.pdf");
      setFormFileSize("280 KB");
    }
    showToast("Formal letter & document template pre-filled");
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEvent || !formDates) {
      showToast("Please specify event name and dates");
      return;
    }

    const newReq: SharedPermissionRequest = {
      id: `req-${Date.now().toString().slice(-4)}`,
      student: "Ananya V.",
      roll: "21BCE1089",
      type: formType,
      event: formEvent,
      dateRange: formDates,
      submitted: "Just now",
      status: "pending",
      attendanceCredit: true,
      letterText: formLetterText || `Formal application submitted for ${formEvent}. Awaiting HOD review.`,
      letterFileName: formFileName || undefined,
      letterFileSize: formFileSize || undefined,
      remarks: "Submitted to Admin & HOD Office for approval",
    };

    if (onAddPermission) {
      onAddPermission(newReq);
    } else {
      setInternalPermissions((prev) => [newReq, ...prev]);
    }

    setIsNewRequestModalOpen(false);
    setFormEvent("");
    setFormDates("");
    setFormLetterText("");
    setFormFileName("");
    setFormFileSize("");
    showToast("Leave request with letter submitted to Admin & HOD Desk!");
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#11233D] text-white px-5 py-3 rounded-full shadow-2xl border-2 border-[#00CEE6]/40 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-[#00CEE6] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Pebble Header Banner - Student Perspective */}
      <div className="p-7 sm:p-8 rounded-[36px] bg-gradient-to-r from-[#11233D] via-[#162D4D] to-[#0A1626] text-white border-2 border-white/15 shadow-[0_20px_45px_rgba(17,35,61,0.2),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#00CEE6]/20 text-[#00CEE6] border border-[#00CEE6]/40">
              Student Permissions Desk
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
              <ShieldCheck className="w-3 h-3 text-[#00CEE6]" />
              Ananya V. · 21BCE1089
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Leave & Permissions
          </h1>
          <p className="text-xs text-slate-300 mt-1 font-medium max-w-xl">
            Submit official On-Duty (OD) applications with attached letters, medical exemptions, and track real-time HOD approvals.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto relative z-10">
          <button
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-5 py-3 rounded-full bg-[#00CEE6] hover:bg-[#00BCD4] text-[#11233D] text-xs font-black transition-all cursor-pointer shadow-[0_4px_16px_rgba(0,206,230,0.35),inset_0_1.5px_2px_rgba(255,255,255,0.6)] flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Apply for Leave / OD</span>
          </button>
        </div>
      </div>

      {/* Main Pebble Content Card */}
      <div className="bg-white rounded-[36px] border-2 border-[#ACBACC]/35 shadow-[0_12px_36px_rgba(17,35,61,0.06),inset_0_2px_4px_rgba(255,255,255,0.9)] p-6 sm:p-8">
        {/* Pebble Sub-Tabs */}
        <div className="flex items-center gap-2 pb-5 border-b border-slate-100">
          <button
            onClick={() => setActiveTab("letters")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "letters"
                ? "bg-[#11233D] text-white shadow-sm"
                : "bg-[#EFF4F7] text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#00CEE6]" />
            <span>My Applications & Letters ({displayPermissions.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("passes")}
            className={`px-5 py-2.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "passes"
                ? "bg-[#11233D] text-white shadow-sm"
                : "bg-[#EFF4F7] text-slate-600 hover:bg-slate-200"
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-[#825FEF]" />
            <span>Digital Gate Pass</span>
          </button>
        </div>

        {/* Tab 1: Permission Letters List */}
        {activeTab === "letters" && (
          <div className="divide-y divide-slate-100 mt-3">
            {displayPermissions.map((p) => (
              <div
                key={p.id}
                className="py-4.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F8FAFC] rounded-2xl transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFF4F7] text-slate-700 flex items-center justify-center font-black text-sm shrink-0 border-2 border-[#ACBACC]/30 shadow-2xs mt-1 sm:mt-0">
                    <FileText className="w-5 h-5 text-[#825FEF]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-black text-[#11233D] truncate">
                        {p.event}
                      </h3>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#EFF4F7] text-slate-700 border border-slate-200">
                        {p.type}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                          p.status === "approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : p.status === "rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {p.status === "approved"
                          ? "Approved by HOD"
                          : p.status === "rejected"
                          ? "Declined"
                          : "Pending Admin Approval"}
                      </span>

                      {/* Letter Attached Indicator */}
                      {(p.letterText || p.letterFileName) && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 flex items-center gap-1">
                          <Paperclip className="w-2.5 h-2.5" />
                          <span>Letter Attached</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 flex-wrap">
                      <span className="font-semibold text-slate-600">{p.dateRange}</span>
                      <span>·</span>
                      <span className="text-slate-500 font-medium">{p.remarks || "Submitted to Dean Office"}</span>
                      {p.letterFileName && (
                        <>
                          <span>·</span>
                          <span className="text-[#825FEF] font-bold flex items-center gap-1">
                            <FileCheck className="w-3 h-3" />
                            {p.letterFileName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
                  <button
                    onClick={() => setSelectedLetter(p)}
                    className="h-9 px-4 rounded-full border-2 border-slate-200 bg-white hover:bg-slate-100 text-[#11233D] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Letter</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  {p.status === "approved" && (
                    <button
                      onClick={() => showToast(`Sanctioned PDF Letter downloaded for ${p.event}`)}
                      className="h-9 px-4 rounded-full bg-[#11233D] hover:bg-[#1E3A5F] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3 h-3 text-[#00CEE6]" />
                      <span>PDF</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Digital Gate Pass */}
        {activeTab === "passes" && (
          <div className="py-8 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 rounded-[24px] bg-[#EFF4F7] border-2 border-[#ACBACC]/40 flex items-center justify-center shadow-inner">
              <QrCode className="w-10 h-10 text-[#00CEE6]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#11233D]">Verified Gate Access Pass</h3>
              <p className="text-xs text-slate-500 mt-1">
                Approved OD and leaves are encoded in your encrypted dynamic QR code for campus turnstiles and security.
              </p>
            </div>
            <button
              onClick={() => onOpenQR?.()}
              className="px-6 py-2.5 rounded-full bg-[#11233D] hover:bg-[#1E3A5F] text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-[#00CEE6]" />
              <span>Launch Dynamic Gate QR</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal: View Submitted Application & Sanction Letter */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 bg-[#11233D]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-[36px] border-2 border-slate-200 p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedLetter(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#11233D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Head */}
            <div className="text-center pb-4 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#00CEE6] block">
                Official Leave / On-Duty Record
              </span>
              <h2 className="text-lg font-black text-[#11233D] mt-0.5">
                {selectedLetter.event}
              </h2>
              <p className="text-[11px] text-slate-400">Category: {selectedLetter.type} · Ref: {selectedLetter.id}</p>
            </div>

            {/* Status & Key Meta */}
            <div className="py-4 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Date Range:</span>
                <span className="font-black text-[#11233D]">{selectedLetter.dateRange}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Attendance Credit:</span>
                <span className="font-black text-emerald-600">Auto-Credited upon Verification</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="font-bold text-slate-400">Approval Status:</span>
                <span
                  className={`font-black uppercase text-[11px] ${
                    selectedLetter.status === "approved"
                      ? "text-emerald-600"
                      : selectedLetter.status === "rejected"
                      ? "text-rose-600"
                      : "text-amber-600"
                  }`}
                >
                  {selectedLetter.status === "approved"
                    ? "Approved & Stamped"
                    : selectedLetter.status === "rejected"
                    ? "Declined"
                    : "Under Admin Review"}
                </span>
              </div>
            </div>

            {/* Attached Letter Content */}
            {selectedLetter.letterText && (
              <div className="my-3 p-4 rounded-2xl bg-[#F8FAFC] border-2 border-slate-200/80">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#825FEF] block mb-1.5">
                  Application Letter Submitted to HOD
                </span>
                <p className="text-xs text-[#11233D] whitespace-pre-line leading-relaxed font-medium">
                  {selectedLetter.letterText}
                </p>
              </div>
            )}

            {/* Attached Document Pill */}
            {selectedLetter.letterFileName && (
              <div className="my-3 p-3.5 rounded-2xl bg-[#EFF4F7] border border-[#ACBACC]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-200">
                    PDF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#11233D]">{selectedLetter.letterFileName}</h4>
                    <span className="text-[10px] text-slate-500 font-medium">{selectedLetter.letterFileSize || "Verified File"}</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast(`Opening document: ${selectedLetter.letterFileName}`)}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-[#11233D] cursor-pointer"
                >
                  Preview File
                </button>
              </div>
            )}

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  showToast("Permission Letter saved as PDF");
                  setSelectedLetter(null);
                }}
                className="px-6 py-2.5 rounded-full bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Permission Request (With Letter & Document Upload) */}
      {isNewRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#11233D]/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[36px] border-2 border-slate-200 p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsNewRequestModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#11233D] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pr-8 mb-1">
              <h2 className="text-xl font-black text-[#11233D]">
                Apply for Permission / Leave
              </h2>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Submit your On-Duty, hackathon, or medical leave request directly to HOD Dr. Srinivas Rao.
            </p>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-extrabold text-[#11233D] block mb-1.5">
                    Category
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#ACBACC]/40 text-xs font-bold text-[#11233D] focus:outline-none focus:border-[#00CEE6] bg-[#F8FAFC]"
                  >
                    <option value="On-Duty (OD)">On-Duty (OD) – Hackathon / Event</option>
                    <option value="Medical Leave">Medical Leave (Certificate)</option>
                    <option value="Lab Access">Extended Lab Access</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-[#11233D] block mb-1.5">
                    Dates Required
                  </label>
                  <input
                    type="text"
                    value={formDates}
                    onChange={(e) => setFormDates(e.target.value)}
                    placeholder="e.g. Oct 24 – Oct 26, 2026"
                    className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#ACBACC]/40 text-xs text-[#11233D] focus:outline-none focus:border-[#00CEE6] bg-[#F8FAFC]"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-[#11233D] block mb-1.5">
                  Event / Reason
                </label>
                <input
                  type="text"
                  value={formEvent}
                  onChange={(e) => setFormEvent(e.target.value)}
                  placeholder="e.g. Smart India Hackathon Grand Finale"
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-[#ACBACC]/40 text-xs text-[#11233D] focus:outline-none focus:border-[#00CEE6] bg-[#F8FAFC]"
                />
              </div>

              {/* Application Letter Section */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-[#11233D]">
                    Formal Application Letter
                  </label>
                  <button
                    type="button"
                    onClick={handlePrefillLetter}
                    className="text-[11px] font-bold text-[#825FEF] hover:text-[#724ee6] flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-[#00CEE6]" />
                    <span>Pre-fill Official Letter</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formLetterText}
                  onChange={(e) => setFormLetterText(e.target.value)}
                  placeholder="Draft your formal letter to the Head of Department explaining the reason and dates..."
                  className="w-full p-3 rounded-2xl border-2 border-[#ACBACC]/40 text-xs text-[#11233D] focus:outline-none focus:border-[#00CEE6] bg-[#F8FAFC] leading-relaxed resize-none"
                />
              </div>

              {/* Document / Letter Attachment Pod */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-[#11233D] block">
                  Attach Supporting Letter / Proof (PDF/DOC)
                </label>

                {formFileName ? (
                  <div className="p-3 rounded-2xl bg-cyan-50/70 border-2 border-cyan-300 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="w-4 h-4 text-[#00CEE6]" />
                      <div>
                        <span className="text-xs font-bold text-[#11233D] block">{formFileName}</span>
                        <span className="text-[10px] text-slate-500">{formFileSize || "Attached File"}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFormFileName("");
                        setFormFileSize("");
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Remove attachment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="letter-file-upload"
                      className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-dashed border-[#ACBACC]/60 hover:border-[#00CEE6] bg-[#F8FAFC] text-slate-600 hover:text-[#11233D] text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-[#00CEE6]" />
                      <span>Upload Letter or Proof (.PDF)</span>
                    </label>
                    <input
                      type="file"
                      id="letter-file-upload"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormFileName(file.name);
                          const sizeKb = Math.round(file.size / 1024);
                          setFormFileSize(`${sizeKb} KB`);
                        }
                      }}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setFormFileName("Event_Sanction_Invitation.pdf");
                        setFormFileSize("195 KB");
                      }}
                      className="py-2.5 px-3 rounded-2xl bg-[#EFF4F7] hover:bg-slate-200 text-[#11233D] text-[11px] font-bold border border-slate-300 transition-colors cursor-pointer shrink-0"
                    >
                      Attach Sample PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Form Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewRequestModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#00CEE6] hover:bg-[#00BCD4] text-[#11233D] font-black flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
