"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Check,
  X,
  Clock,
  Calendar,
  FileText,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  User,
  Filter,
  Search,
} from "lucide-react";

interface FacultyLeaveApprovalsProps {
  onNavigate: (tab: string) => void;
}

interface LeaveRequest {
  id: string;
  student: string;
  roll: string;
  type: string;
  event: string;
  dateRange: string;
  submitted: string;
  status: "pending" | "approved" | "rejected";
}

const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: "req-1",
    student: "Ananya V.",
    roll: "21BCE1089",
    type: "On-Duty (OD)",
    event: "National Hackathon 2026 – Smart India Hackathon",
    dateRange: "Oct 14 – Oct 16",
    submitted: "2h ago",
    status: "pending",
  },
  {
    id: "req-2",
    student: "Rohan Sharma",
    roll: "21BCE1042",
    type: "Hackathon Leave",
    event: "ICPC Regional Qualifier 2026",
    dateRange: "Oct 20 – Oct 21",
    submitted: "4h ago",
    status: "pending",
  },
  {
    id: "req-3",
    student: "Karthik Raja",
    roll: "21BCE1012",
    type: "Medical Leave",
    event: "Fever – Doctor Certificate Attached",
    dateRange: "Oct 10 – Oct 11",
    submitted: "1d ago",
    status: "pending",
  },
  {
    id: "req-4",
    student: "Meera Krishnan",
    roll: "21BCE1001",
    type: "On-Duty (OD)",
    event: "Research Symposium Presentation",
    dateRange: "Oct 8",
    submitted: "3d ago",
    status: "approved",
  },
  {
    id: "req-5",
    student: "Vikram Patel",
    roll: "21BCE1105",
    type: "Casual Leave",
    event: "Family Emergency",
    dateRange: "Oct 5 – Oct 6",
    submitted: "5d ago",
    status: "rejected",
  },
];

type TabKey = "all" | "pending" | "approved" | "rejected";
type TypeFilter = "All Types" | "OD" | "Medical Leave" | "Casual Leave" | "Hackathon";

const TYPE_BADGE_STYLES: Record<string, string> = {
  "On-Duty (OD)": "bg-violet-100 text-violet-700",
  "Hackathon Leave": "bg-cyan-100 text-cyan-700",
  "Medical Leave": "bg-blue-100 text-blue-700",
  "Casual Leave": "bg-slate-100 text-slate-600",
};

const STATUS_CONFIG = {
  pending: { label: "Pending", dot: "bg-amber-400", pill: "bg-amber-50 text-amber-700 border border-amber-200" },
  approved: { label: "Approved", dot: "bg-emerald-400", pill: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  rejected: { label: "Rejected", dot: "bg-rose-400", pill: "bg-rose-50 text-rose-700 border border-rose-200" },
};

function matchesTypeFilter(type: string, filter: TypeFilter): boolean {
  if (filter === "All Types") return true;
  if (filter === "OD") return type.includes("OD");
  if (filter === "Medical Leave") return type === "Medical Leave";
  if (filter === "Casual Leave") return type === "Casual Leave";
  if (filter === "Hackathon") return type.toLowerCase().includes("hackathon");
  return true;
}

export default function FacultyLeaveApprovals({ onNavigate }: FacultyLeaveApprovalsProps) {
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const counts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const odCount = requests.filter((r) => r.type.includes("OD")).length;
  const leaveCount = requests.length - odCount;

  const filteredRequests = requests.filter((r) => {
    const tabMatch =
      activeTab === "all" || r.status === activeTab;
    const typeMatch = matchesTypeFilter(r.type, typeFilter);
    const searchMatch =
      searchQuery === "" ||
      r.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.roll.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.event.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && typeMatch && searchMatch;
  });

  function handleApprove(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" } : r))
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => prev ? { ...prev, status: "approved" } : null);
    }
  }

  function handleReject(id: string) {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r))
    );
    if (selectedRequest?.id === id) {
      setSelectedRequest((prev) => prev ? { ...prev, status: "rejected" } : null);
    }
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Requests" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const TYPE_FILTERS: TypeFilter[] = [
    "All Types",
    "OD",
    "Medical Leave",
    "Casual Leave",
    "Hackathon",
  ];

  return (
    <div className="min-h-screen bg-[#EEF3F6] font-sans">
      {/* ── Header Banner ── */}
      <div className="bg-[#11233D] px-8 pt-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#825FEF]/20 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#825FEF]" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold leading-tight">
                  Leave & OD Approvals
                </h1>
                <p className="text-[#ACBACC] text-sm mt-0.5">
                  Faculty Approval Center · CSE-A
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400/10 border border-amber-400/30">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-300 text-sm font-semibold">
                  3 Pending Review
                </span>
              </span>
              <div className="flex gap-4 text-sm text-[#ACBACC]">
                <div className="flex flex-col items-end">
                  <span className="text-white font-semibold">12</span>
                  <span className="text-xs">Approved This Month</span>
                </div>
                <div className="w-px bg-white/10 self-stretch" />
                <div className="flex flex-col items-end">
                  <span className="text-white font-semibold">4h</span>
                  <span className="text-xs">Avg Response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        {/* ── KPI Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Pending */}
          <div className="bg-white rounded-2xl p-5 border border-[#EEF3F6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#ACBACC] uppercase tracking-wide">
                Pending Review
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <p className="text-3xl font-bold text-[#11233D]">{counts.pending}</p>
            <p className="text-xs text-[#ACBACC] mt-1">Awaiting action</p>
          </div>

          {/* Approved this week */}
          <div className="bg-white rounded-2xl p-5 border border-[#EEF3F6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#ACBACC] uppercase tracking-wide">
                Approved This Week
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-[#11233D]">8</p>
            <p className="text-xs text-[#ACBACC] mt-1">Oct 7 – Oct 13</p>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-2xl p-5 border border-[#EEF3F6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#ACBACC] uppercase tracking-wide">
                Rejected
              </span>
              <X className="w-4 h-4 text-rose-500" />
            </div>
            <p className="text-3xl font-bold text-[#11233D]">{counts.rejected}</p>
            <p className="text-xs text-[#ACBACC] mt-1">This week</p>
          </div>

          {/* OD vs Leave */}
          <div className="bg-white rounded-2xl p-5 border border-[#EEF3F6] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[#ACBACC] uppercase tracking-wide">
                OD Requests
              </span>
              <Calendar className="w-4 h-4 text-[#825FEF]" />
            </div>
            <p className="text-3xl font-bold text-[#11233D]">{odCount}</p>
            <p className="text-xs text-[#ACBACC] mt-1">
              vs {leaveCount} Leave requests
            </p>
          </div>
        </div>

        {/* ── Filter / Tab Bar ── */}
        <div className="bg-white rounded-2xl border border-[#EEF3F6] shadow-sm px-5 py-4 space-y-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-[#825FEF] text-white shadow-sm"
                    : "text-[#ACBACC] hover:text-[#11233D] hover:bg-[#EEF3F6]"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                    activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-[#EEF3F6] text-[#ACBACC]"
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}

            {/* Search */}
            <div className="ml-auto flex items-center gap-2 bg-[#EEF3F6] rounded-full px-4 py-2">
              <Search className="w-3.5 h-3.5 text-[#ACBACC]" />
              <input
                type="text"
                placeholder="Search student, roll…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-[#11233D] placeholder:text-[#ACBACC] outline-none w-40"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-[#ACBACC]" />
            <span className="text-xs text-[#ACBACC]">Type:</span>
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setTypeFilter(f)}
                className={`cursor-pointer px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  typeFilter === f
                    ? "bg-[#825FEF]/10 text-[#825FEF] border-[#825FEF]/30"
                    : "bg-transparent text-[#ACBACC] border-[#EEF3F6] hover:border-[#ACBACC]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Approval Queue ── */}
        <div className="bg-white rounded-2xl border border-[#EEF3F6] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EEF3F6] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#11233D]">
              Approval Queue
            </h2>
            <span className="text-xs text-[#ACBACC]">
              {filteredRequests.length} request{filteredRequests.length !== 1 ? "s" : ""}
            </span>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <CheckCircle2 className="w-10 h-10 text-[#ACBACC]" />
              <p className="text-[#ACBACC] text-sm">No requests match the current filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#EEF3F6]">
              {filteredRequests.map((req) => {
                const statusCfg = STATUS_CONFIG[req.status];
                const typeBadge =
                  TYPE_BADGE_STYLES[req.type] ?? "bg-slate-100 text-slate-600";

                return (
                  <div
                    key={req.id}
                    className="px-6 py-5 flex items-start gap-4 hover:bg-[#EEF3F6]/40 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-[#825FEF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-5 h-5 text-[#825FEF]" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#11233D]">
                          {req.student}
                        </span>
                        <span className="text-xs text-[#ACBACC]">{req.roll}</span>
                        <span
                          className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${typeBadge}`}
                        >
                          {req.type}
                        </span>
                      </div>
                      <p className="text-sm text-[#ACBACC] mt-1 truncate">
                        {req.event}
                      </p>
                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#ACBACC]">
                          <Calendar className="w-3.5 h-3.5" />
                          {req.dateRange}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#ACBACC]">
                          <Clock className="w-3.5 h-3.5" />
                          {req.submitted}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                      {req.status === "pending" ? (
                        <>
                          <button
                            onClick={() => handleApprove(req.id)}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req.id)}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold hover:bg-rose-100 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusCfg.pill}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                          {statusCfg.label}
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EEF3F6] text-[#ACBACC] border border-transparent text-xs font-medium hover:text-[#11233D] hover:border-[#ACBACC]/40 transition-colors"
                      >
                        View Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Attendance Impact Note ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Attendance Auto-Credit Notice
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              OD approvals auto-credit attendance. Verify event documentation
              before approval.
            </p>
          </div>
        </div>
      </div>

      {/* ── Detail Modal / Slide-over ── */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#11233D] px-6 py-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[#ACBACC] text-xs mb-1">Request Details</p>
                <h3 className="text-white text-lg font-bold">
                  {selectedRequest.student}
                </h3>
                <p className="text-[#ACBACC] text-sm">{selectedRequest.roll}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="cursor-pointer w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Type + Status */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    TYPE_BADGE_STYLES[selectedRequest.type] ??
                    "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedRequest.type}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                    STATUS_CONFIG[selectedRequest.status].pill
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      STATUS_CONFIG[selectedRequest.status].dot
                    }`}
                  />
                  {STATUS_CONFIG[selectedRequest.status].label}
                </span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#EEF3F6] rounded-2xl px-4 py-3">
                  <p className="text-xs text-[#ACBACC] mb-1">Date Range</p>
                  <p className="text-sm font-semibold text-[#11233D] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#825FEF]" />
                    {selectedRequest.dateRange}
                  </p>
                </div>
                <div className="bg-[#EEF3F6] rounded-2xl px-4 py-3">
                  <p className="text-xs text-[#ACBACC] mb-1">Submitted</p>
                  <p className="text-sm font-semibold text-[#11233D] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#825FEF]" />
                    {selectedRequest.submitted}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-[#EEF3F6] rounded-2xl px-4 py-3">
                <p className="text-xs text-[#ACBACC] mb-1">Reason / Event</p>
                <p className="text-sm text-[#11233D]">{selectedRequest.event}</p>
              </div>

              {/* Document Placeholder */}
              <div className="border-2 border-dashed border-[#ACBACC]/40 rounded-2xl px-4 py-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#825FEF]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-[#825FEF]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#11233D]">
                    Supporting Document
                  </p>
                  <p className="text-xs text-[#ACBACC]">
                    {selectedRequest.type === "Medical Leave"
                      ? "doctor_certificate.pdf · 128 KB"
                      : selectedRequest.type.includes("OD") ||
                        selectedRequest.type.includes("Hackathon")
                      ? "event_invitation.pdf · 84 KB"
                      : "No document attached"}
                  </p>
                </div>
                {(selectedRequest.type === "Medical Leave" ||
                  selectedRequest.type.includes("OD") ||
                  selectedRequest.type.includes("Hackathon")) && (
                  <button className="cursor-pointer ml-auto text-xs font-semibold text-[#825FEF] hover:underline">
                    Preview
                  </button>
                )}
              </div>

              {/* OD Attendance Note */}
              {selectedRequest.type.includes("OD") && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    Approving this OD will auto-credit attendance for the listed dates.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex items-center gap-3">
              {selectedRequest.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest.id)}
                    className="cursor-pointer flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject Request
                  </button>
                </>
              ) : (
                <div
                  className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold ${
                    STATUS_CONFIG[selectedRequest.status].pill
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      STATUS_CONFIG[selectedRequest.status].dot
                    }`}
                  />
                  Decision recorded: {STATUS_CONFIG[selectedRequest.status].label}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
