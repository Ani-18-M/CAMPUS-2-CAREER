"use client";

import { useState } from "react";
import {
  PieChart,
  Users,
  Target,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Check,
  Zap,
  BookOpen,
  Award,
  ChevronDown,
  ChevronRight,
  Calendar,
} from "lucide-react";

interface FacultyMentorshipClustersProps {
  onNavigate: (tab: string) => void;
}

interface Student {
  name: string;
  rollNo: string;
  cgpa?: number;
  coding?: number;
  attendance?: number;
  goal?: string;
}

interface Cluster {
  id: string;
  name: string;
  count: number;
  criteria: string;
  action: string;
  progressLabel: string;
  progressValue: number;
  theme: {
    bg: string;
    badge: string;
    bar: string;
    icon: string;
    border: string;
    text: string;
    lightBg: string;
  };
  icon: React.ReactNode;
  students: Student[];
}

interface Pairing {
  student: string;
  rollNo: string;
  cluster: string;
  clusterColor: string;
  mentor: string;
  lastSession: string;
  status: "On Track" | "Needs Follow-up" | "Scheduled" | "Pending";
}

const clusters: Cluster[] = [
  {
    id: "tier1",
    name: "Tier-1 Fast Track",
    count: 18,
    criteria: "CGPA > 8.5 · Coding > 80% · 0 Backlogs",
    action: "Direct interview scheduling with top-tier recruiters",
    progressLabel: "Placement Readiness",
    progressValue: 85,
    theme: {
      bg: "bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-700",
      bar: "bg-emerald-500",
      icon: "text-emerald-600",
      border: "border-emerald-200",
      text: "text-emerald-700",
      lightBg: "bg-emerald-500",
    },
    icon: <Award size={20} />,
    students: [
      { name: "Ananya Krishnan", rollNo: "CS21001", cgpa: 9.2, coding: 92 },
      { name: "Rohan Mehta", rollNo: "CS21008", cgpa: 8.9, coding: 87 },
    ],
  },
  {
    id: "skillbridge",
    name: "Skill Bridge Program",
    count: 22,
    criteria: "CGPA > 7.5 · Coding < 60% · Needs DSA uplift",
    action: "Enroll in 6-week DSA bootcamp with weekly assessments",
    progressLabel: "Coding Readiness",
    progressValue: 52,
    theme: {
      bg: "bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
      bar: "bg-amber-500",
      icon: "text-amber-600",
      border: "border-amber-200",
      text: "text-amber-700",
      lightBg: "bg-amber-500",
    },
    icon: <BookOpen size={20} />,
    students: [
      { name: "Priya Nair", rollNo: "CS21015", cgpa: 7.8, coding: 48 },
      { name: "Karthik Raj", rollNo: "CS21022", cgpa: 8.1, coding: 55 },
    ],
  },
  {
    id: "attendance",
    name: "Attendance Recovery",
    count: 14,
    criteria: "High Skills · Attendance < 75% · At-risk",
    action: "Make-up lab assignments + OD credit compensations",
    progressLabel: "Attendance Compliance",
    progressValue: 68,
    theme: {
      bg: "bg-rose-50",
      badge: "bg-rose-100 text-rose-700",
      bar: "bg-rose-500",
      icon: "text-rose-600",
      border: "border-rose-200",
      text: "text-rose-700",
      lightBg: "bg-rose-500",
    },
    icon: <Target size={20} />,
    students: [
      { name: "Devansh Patel", rollNo: "CS21031", attendance: 68, cgpa: 8.3 },
      { name: "Sneha Iyer", rollNo: "CS21039", attendance: 71, cgpa: 7.9 },
    ],
  },
  {
    id: "alternative",
    name: "Alternative Pathways",
    count: 10,
    criteria: "GATE / GRE / Startup · Non-placement track",
    action: "Custom roadmap, exempt from placement penalty metrics",
    progressLabel: "Goal Alignment",
    progressValue: 70,
    theme: {
      bg: "bg-violet-50",
      badge: "bg-violet-100 text-violet-700",
      bar: "bg-[#825FEF]",
      icon: "text-[#825FEF]",
      border: "border-violet-200",
      text: "text-violet-700",
      lightBg: "bg-[#825FEF]",
    },
    icon: <Zap size={20} />,
    students: [
      { name: "Meera Sundar", rollNo: "CS21047", goal: "GATE 2025" },
      { name: "Arjun Das", rollNo: "CS21053", goal: "Startup Founder" },
    ],
  },
];

const pairings: Pairing[] = [
  {
    student: "Ananya Krishnan",
    rollNo: "CS21001",
    cluster: "Tier-1 Fast Track",
    clusterColor: "bg-emerald-100 text-emerald-700",
    mentor: "Dr. Suresh Babu",
    lastSession: "Oct 9, 2026",
    status: "On Track",
  },
  {
    student: "Priya Nair",
    rollNo: "CS21015",
    cluster: "Skill Bridge",
    clusterColor: "bg-amber-100 text-amber-700",
    mentor: "Prof. Kavitha M.",
    lastSession: "Oct 7, 2026",
    status: "Needs Follow-up",
  },
  {
    student: "Devansh Patel",
    rollNo: "CS21031",
    cluster: "Attendance Recovery",
    clusterColor: "bg-rose-100 text-rose-700",
    mentor: "Dr. Ramesh G.",
    lastSession: "Oct 5, 2026",
    status: "Scheduled",
  },
  {
    student: "Meera Sundar",
    rollNo: "CS21047",
    cluster: "Alt. Pathways",
    clusterColor: "bg-violet-100 text-violet-700",
    mentor: "Prof. Nandini K.",
    lastSession: "Oct 8, 2026",
    status: "On Track",
  },
  {
    student: "Karthik Raj",
    rollNo: "CS21022",
    cluster: "Skill Bridge",
    clusterColor: "bg-amber-100 text-amber-700",
    mentor: "Prof. Kavitha M.",
    lastSession: "Oct 3, 2026",
    status: "Pending",
  },
  {
    student: "Rohan Mehta",
    rollNo: "CS21008",
    cluster: "Tier-1 Fast Track",
    clusterColor: "bg-emerald-100 text-emerald-700",
    mentor: "Dr. Suresh Babu",
    lastSession: "Oct 10, 2026",
    status: "On Track",
  },
];

const statusStyles: Record<string, string> = {
  "On Track": "bg-emerald-100 text-emerald-700",
  "Needs Follow-up": "bg-amber-100 text-amber-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Pending: "bg-slate-100 text-slate-500",
};

export default function FacultyMentorshipClusters({
  onNavigate,
}: FacultyMentorshipClustersProps) {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [dispatchedActions, setDispatchedActions] = useState<Set<string>>(
    new Set()
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleAssignAction = (clusterId: string, clusterName: string) => {
    setDispatchedActions((prev) => new Set(prev).add(clusterId));
    setToastMsg(`Action dispatched for "${clusterName}"`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRecluster = () => {
    setToastMsg("Re-clustering in progress… AI model updating cohorts.");
    setTimeout(() => setToastMsg(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#EEF3F6] p-6 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[#11233D] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-fade-in">
          <Check size={16} className="text-[#00CEE6]" />
          {toastMsg}
        </div>
      )}

      {/* ── Header Banner ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#11233D] via-[#1a2f50] to-[#0d1e35] p-8">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #825FEF 0%, transparent 50%), radial-gradient(circle at 10% 80%, #00CEE6 0%, transparent 40%)",
          }}
        />
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#825FEF]/20 flex items-center justify-center border border-[#825FEF]/30">
              <PieChart size={26} className="text-[#825FEF]" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Mentorship Clusters
                </h1>
                <span className="px-3 py-1 rounded-full bg-[#825FEF]/20 border border-[#825FEF]/40 text-[#c4b0ff] text-xs font-semibold">
                  4 Active Clusters
                </span>
              </div>
              <p className="text-[#ACBACC] text-sm">
                AI-Segmented Cohorts · CSE-A · 64 Students
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">64</div>
              <div className="text-[#ACBACC] text-xs mt-0.5">Total Students</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#00CEE6]">4</div>
              <div className="text-[#ACBACC] text-xs mt-0.5">AI Clusters</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-[#825FEF]">23</div>
              <div className="text-[#ACBACC] text-xs mt-0.5">Interventions</div>
            </div>
            <button
              onClick={handleRecluster}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#825FEF] hover:bg-[#6f4de0] text-white text-sm font-semibold transition-all cursor-pointer shadow-lg shadow-[#825FEF]/30 ml-2"
            >
              <RefreshCw size={15} />
              Re-cluster
            </button>
          </div>
        </div>
      </div>

      {/* ── Cluster Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {clusters.map((cluster) => {
          const isExpanded = selectedCluster === cluster.id;
          const isDispatched = dispatchedActions.has(cluster.id);

          return (
            <div
              key={cluster.id}
              className={`bg-white rounded-3xl border shadow-sm transition-all duration-300 overflow-hidden ${cluster.theme.border} ${isExpanded ? "shadow-md" : "hover:shadow-md"}`}
            >
              {/* Card Header */}
              <div
                className={`${cluster.theme.bg} px-6 pt-5 pb-4 cursor-pointer`}
                onClick={() =>
                  setSelectedCluster(isExpanded ? null : cluster.id)
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${cluster.theme.badge}`}
                    >
                      <span className={cluster.theme.icon}>{cluster.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#11233D] text-base leading-tight">
                        {cluster.name}
                      </h3>
                      <p className={`text-xs mt-0.5 ${cluster.theme.text} font-medium`}>
                        {cluster.criteria}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${cluster.theme.badge}`}
                    >
                      {cluster.count} students
                    </span>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-[#ACBACC]" />
                    ) : (
                      <ChevronRight size={16} className="text-[#ACBACC]" />
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs text-[#ACBACC] font-medium">
                      {cluster.progressLabel}
                    </span>
                    <span className={`text-xs font-bold ${cluster.theme.text}`}>
                      {cluster.progressValue}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cluster.theme.bar}`}
                      style={{ width: `${cluster.progressValue}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4 space-y-4">
                {/* Recommended Action */}
                <div className="flex items-start gap-2">
                  <TrendingUp
                    size={14}
                    className={`mt-0.5 shrink-0 ${cluster.theme.icon}`}
                  />
                  <p className="text-xs text-[#ACBACC] leading-relaxed">
                    <span className="font-semibold text-[#11233D]">
                      Recommended:{" "}
                    </span>
                    {cluster.action}
                  </p>
                </div>

                {/* Expanded: Sample Students */}
                {isExpanded && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-semibold text-[#ACBACC] uppercase tracking-wide">
                      Sample Members
                    </p>
                    {cluster.students.map((s) => (
                      <div
                        key={s.rollNo}
                        className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${cluster.theme.bg} border ${cluster.theme.border}`}
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#11233D]">
                            {s.name}
                          </p>
                          <p className="text-xs text-[#ACBACC]">{s.rollNo}</p>
                        </div>
                        <div className="text-right text-xs">
                          {s.cgpa && (
                            <p className={`font-semibold ${cluster.theme.text}`}>
                              CGPA {s.cgpa}
                            </p>
                          )}
                          {s.coding !== undefined && (
                            <p className="text-[#ACBACC]">
                              Coding {s.coding}%
                            </p>
                          )}
                          {s.attendance !== undefined && (
                            <p className="text-[#ACBACC]">
                              Att. {s.attendance}%
                            </p>
                          )}
                          {s.goal && (
                            <p className={`font-semibold ${cluster.theme.text}`}>
                              {s.goal}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onNavigate("students")}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ACBACC]/40 text-xs font-semibold text-[#11233D] hover:border-[#825FEF] hover:text-[#825FEF] transition-all cursor-pointer"
                  >
                    <Users size={13} />
                    View Members
                    <ArrowRight size={12} />
                  </button>
                  <button
                    onClick={() =>
                      !isDispatched &&
                      handleAssignAction(cluster.id, cluster.name)
                    }
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      isDispatched
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : "bg-[#825FEF] text-white hover:bg-[#6f4de0] shadow-sm shadow-[#825FEF]/30"
                    }`}
                  >
                    {isDispatched ? (
                      <>
                        <Check size={13} />
                        Action Assigned
                      </>
                    ) : (
                      <>
                        <Zap size={13} />
                        Assign Action
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Cluster Insights Row ── */}
      <div className="grid grid-cols-3 gap-5">
        {[
          {
            label: "Segmentation Coverage",
            value: "100%",
            sub: "All 64 students assigned",
            icon: <PieChart size={18} className="text-[#00CEE6]" />,
            accent: "text-[#00CEE6]",
            bg: "bg-[#00CEE6]/10",
          },
          {
            label: "Assigned Mentors",
            value: "47 / 64",
            sub: "17 students pending",
            icon: <Users size={18} className="text-[#825FEF]" />,
            accent: "text-[#825FEF]",
            bg: "bg-[#825FEF]/10",
          },
          {
            label: "Active Interventions",
            value: "23",
            sub: "Across all clusters",
            icon: <Target size={18} className="text-emerald-600" />,
            accent: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl border border-[#EEF3F6] shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-xs text-[#ACBACC] font-medium mb-0.5">
                {stat.label}
              </p>
              <p className={`text-2xl font-bold ${stat.accent}`}>
                {stat.value}
              </p>
              <p className="text-xs text-[#ACBACC] mt-0.5">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mentorship Assignment Table ── */}
      <div className="bg-white rounded-3xl border border-[#EEF3F6] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#EEF3F6]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#825FEF]/10 flex items-center justify-center">
              <Award size={18} className="text-[#825FEF]" />
            </div>
            <div>
              <h2 className="font-bold text-[#11233D] text-base">
                Mentor-Student Pairings
              </h2>
              <p className="text-xs text-[#ACBACC]">
                Active pairings across all clusters
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate("mentors")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EEF3F6] text-xs font-semibold text-[#11233D] hover:bg-[#825FEF]/10 hover:text-[#825FEF] transition-all cursor-pointer"
          >
            View All <ArrowRight size={12} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#EEF3F6]/60">
                <th className="text-left px-7 py-3 text-xs font-semibold text-[#ACBACC] uppercase tracking-wide">
                  Student
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#ACBACC] uppercase tracking-wide">
                  Cluster
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#ACBACC] uppercase tracking-wide">
                  Assigned Mentor
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#ACBACC] uppercase tracking-wide">
                  Last Session
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[#ACBACC] uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pairings.map((p, i) => (
                <tr
                  key={i}
                  className="border-t border-[#EEF3F6] hover:bg-[#EEF3F6]/40 transition-colors"
                >
                  <td className="px-7 py-4">
                    <div>
                      <p className="font-semibold text-[#11233D]">{p.student}</p>
                      <p className="text-xs text-[#ACBACC]">{p.rollNo}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.clusterColor}`}
                    >
                      {p.cluster}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[#11233D] font-medium">
                    {p.mentor}
                  </td>
                  <td className="px-4 py-4 text-[#ACBACC] text-sm">
                    {p.lastSession}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[p.status]}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() =>
                        setToastMsg(
                          `Session scheduled with ${p.mentor} for ${p.student}`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#825FEF]/10 text-[#825FEF] text-xs font-semibold hover:bg-[#825FEF] hover:text-white transition-all cursor-pointer whitespace-nowrap"
                    >
                      <Calendar size={12} />
                      Schedule Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
