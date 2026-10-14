"use client";

import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  ShieldCheck,
  PieChart,
  BarChart3,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface FacultyClassPerformanceProp {
  onNavigate: (tab: string) => void;
}

interface KPICard {
  label: string;
  value: string;
  sub: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  accent: string;
  iconBg: string;
  icon: React.ReactNode;
}

interface SubjectRow {
  subject: string;
  faculty: string;
  avgInternal: number;
  avgAttendance: string;
  concern: "Low" | "Moderate" | "High" | "Critical";
}

interface ActivityItem {
  text: string;
  time: string;
  icon: React.ReactNode;
  iconBg: string;
}

interface QuickNavCard {
  title: string;
  sub: string;
  icon: React.ReactNode;
  bg: string;
  iconColor: string;
  border: string;
  tab: string;
}

const subjectData: SubjectRow[] = [
  {
    subject: "Data Structures",
    faculty: "Dr. Patel",
    avgInternal: 72,
    avgAttendance: "74%",
    concern: "Moderate",
  },
  {
    subject: "DBMS",
    faculty: "Dr. Kumar",
    avgInternal: 68,
    avgAttendance: "69%",
    concern: "High",
  },
  {
    subject: "Operating Systems",
    faculty: "Dr. Rao",
    avgInternal: 81,
    avgAttendance: "85%",
    concern: "Low",
  },
  {
    subject: "Computer Networks",
    faculty: "Dr. Sharma",
    avgInternal: 65,
    avgAttendance: "62%",
    concern: "Critical",
  },
  {
    subject: "Machine Learning",
    faculty: "Dr. Meera",
    avgInternal: 77,
    avgAttendance: "82%",
    concern: "Low",
  },
  {
    subject: "Software Engineering",
    faculty: "Dr. Arun",
    avgInternal: 71,
    avgAttendance: "78%",
    concern: "Moderate",
  },
];

const concernConfig: Record<
  SubjectRow["concern"],
  { bg: string; text: string; dot: string }
> = {
  Low: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  Moderate: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  High: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-500",
  },
  Critical: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

const internalColor = (score: number) => {
  if (score >= 78) return "text-emerald-600";
  if (score >= 68) return "text-amber-600";
  return "text-red-500";
};

const attendanceColor = (att: string) => {
  const val = parseInt(att);
  if (val >= 80) return "text-emerald-600";
  if (val >= 70) return "text-amber-600";
  return "text-red-500";
};

export default function FacultyClassPerformance({
  onNavigate,
}: FacultyClassPerformanceProp) {
  const kpiCards: KPICard[] = [
    {
      label: "Batch Avg CGPA",
      value: "7.84",
      sub: "Out of 10.0",
      trend: "up",
      trendLabel: "+0.3 this sem",
      accent: "text-emerald-600",
      iconBg: "bg-emerald-50",
      icon: <BarChart3 size={20} className="text-emerald-600" />,
    },
    {
      label: "Avg Attendance",
      value: "76.2%",
      sub: "Below 80% threshold",
      trend: "down",
      trendLabel: "Needs attention",
      accent: "text-amber-600",
      iconBg: "bg-amber-50",
      icon: <Users size={20} className="text-amber-600" />,
    },
    {
      label: "Placement Ready",
      value: "43 / 64",
      sub: "67.1% of batch",
      trend: "up",
      trendLabel: "+5 this week",
      accent: "text-[#825FEF]",
      iconBg: "bg-[#825FEF]/10",
      icon: <CheckCircle2 size={20} className="text-[#825FEF]" />,
    },
    {
      label: "Avg Success Score",
      value: "71.4",
      sub: "Out of 100",
      trend: "neutral",
      trendLabel: "Stable",
      accent: "text-[#00CEE6]",
      iconBg: "bg-[#00CEE6]/10",
      icon: <Activity size={20} className="text-[#00CEE6]" />,
    },
  ];

  const activityFeed: ActivityItem[] = [
    {
      text: "Attendance alert dispatched · Karthik Raja",
      time: "2h ago",
      icon: <AlertTriangle size={14} className="text-amber-600" />,
      iconBg: "bg-amber-50",
    },
    {
      text: "21BCE1105 flagged as critical risk",
      time: "5h ago",
      icon: <Activity size={14} className="text-red-500" />,
      iconBg: "bg-red-50",
    },
    {
      text: "OD request submitted · Ananya V.",
      time: "6h ago",
      icon: <ShieldCheck size={14} className="text-[#825FEF]" />,
      iconBg: "bg-[#825FEF]/10",
    },
    {
      text: "Bootcamp assignment sent to 18 students",
      time: "1d ago",
      icon: <CheckCircle2 size={14} className="text-[#00CEE6]" />,
      iconBg: "bg-[#00CEE6]/10",
    },
    {
      text: "Mentorship session logged · Cluster B",
      time: "1d ago",
      icon: <Users size={14} className="text-emerald-600" />,
      iconBg: "bg-emerald-50",
    },
  ];

  const quickNavCards: QuickNavCard[] = [
    {
      title: "Early Warning Radar",
      sub: "46 students flagged",
      icon: <AlertTriangle size={22} className="text-[#825FEF]" />,
      bg: "bg-[#825FEF]/5",
      iconColor: "text-[#825FEF]",
      border: "border-[#825FEF]/20",
      tab: "At-Risk Matrix",
    },
    {
      title: "Leave & OD Approvals",
      sub: "1 pending approval",
      icon: <ShieldCheck size={22} className="text-amber-600" />,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "border-amber-200",
      tab: "Permissions",
    },
    {
      title: "Mentorship Clusters",
      sub: "4 active cohorts",
      icon: <PieChart size={22} className="text-[#00CEE6]" />,
      bg: "bg-[#00CEE6]/5",
      iconColor: "text-[#00CEE6]",
      border: "border-[#00CEE6]/20",
      tab: "Segmentation",
    },
  ];

  return (
    <div className="min-h-screen bg-[#EEF3F6] pb-12">
      {/* ── Header Banner ─────────────────────────────────────────────── */}
      <div className="bg-[#11233D] px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Left */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#825FEF]/20 flex items-center justify-center">
                <LayoutDashboard size={18} className="text-[#825FEF]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Class Performance
              </h1>
            </div>
            <p className="text-[#ACBACC] text-sm font-medium pl-12">
              CSE-A &nbsp;·&nbsp; Semester 7 &nbsp;·&nbsp; 64 Students
            </p>
            {/* Pills */}
            <div className="flex items-center gap-2 pl-12 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live · 2026-10-14
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#825FEF]/20 text-[#825FEF] text-xs font-semibold border border-[#825FEF]/30">
                HOD View
              </span>
            </div>
          </div>

          {/* Export Button */}
          <button className="cursor-pointer self-start sm:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#825FEF] text-white text-sm font-semibold hover:bg-[#6f4ed4] transition-colors shadow-lg shadow-[#825FEF]/30">
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-8 flex flex-col gap-6">
        {/* ── KPI Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card) => (
            <div
              key={card.label}
              className="bg-white rounded-3xl p-5 shadow-sm border border-[#EEF3F6] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#ACBACC] uppercase tracking-wider">
                  {card.label}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center`}
                >
                  {card.icon}
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${card.accent}`}>
                  {card.value}
                </p>
                <p className="text-xs text-[#ACBACC] mt-0.5">{card.sub}</p>
              </div>
              {card.trend && (
                <div className="flex items-center gap-1">
                  {card.trend === "up" && (
                    <TrendingUp size={13} className="text-emerald-500" />
                  )}
                  {card.trend === "down" && (
                    <TrendingDown size={13} className="text-amber-500" />
                  )}
                  {card.trend === "neutral" && (
                    <Activity size={13} className="text-[#ACBACC]" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      card.trend === "up"
                        ? "text-emerald-600"
                        : card.trend === "down"
                        ? "text-amber-600"
                        : "text-[#ACBACC]"
                    }`}
                  >
                    {card.trendLabel}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Main Content Grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Subject Table + Quick Nav */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Subject Health Monitor */}
            <div className="bg-white rounded-3xl shadow-sm border border-[#EEF3F6] overflow-hidden">
              {/* Card Header */}
              <div className="px-6 py-5 border-b border-[#EEF3F6] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#825FEF]/10 flex items-center justify-center">
                    <BarChart3 size={16} className="text-[#825FEF]" />
                  </div>
                  <h2 className="text-base font-bold text-[#11233D]">
                    Subject Health Monitor
                  </h2>
                </div>
                <span className="text-xs text-[#ACBACC] font-medium">
                  Semester 7 · CSE-A
                </span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#EEF3F6]/60">
                      <th className="text-left px-6 py-3.5 text-xs font-semibold text-[#ACBACC] uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="text-left px-4 py-3.5 text-xs font-semibold text-[#ACBACC] uppercase tracking-wider">
                        Faculty
                      </th>
                      <th className="text-center px-4 py-3.5 text-xs font-semibold text-[#ACBACC] uppercase tracking-wider">
                        Avg Internal
                      </th>
                      <th className="text-center px-4 py-3.5 text-xs font-semibold text-[#ACBACC] uppercase tracking-wider">
                        Avg Attendance
                      </th>
                      <th className="text-center px-4 py-3.5 text-xs font-semibold text-[#ACBACC] uppercase tracking-wider">
                        Concern Level
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEF3F6]">
                    {subjectData.map((row) => {
                      const concern = concernConfig[row.concern];
                      return (
                        <tr
                          key={row.subject}
                          className="hover:bg-[#EEF3F6]/40 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <span className="text-sm font-semibold text-[#11233D]">
                              {row.subject}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm text-[#ACBACC] font-medium">
                              {row.faculty}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`text-sm font-bold ${internalColor(
                                row.avgInternal
                              )}`}
                            >
                              {row.avgInternal}
                            </span>
                            <span className="text-xs text-[#ACBACC] ml-0.5">
                              /100
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`text-sm font-bold ${attendanceColor(
                                row.avgAttendance
                              )}`}
                            >
                              {row.avgAttendance}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${concern.bg} ${concern.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${concern.dot}`}
                              />
                              {row.concern}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Navigation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickNavCards.map((card) => (
                <button
                  key={card.title}
                  onClick={() => onNavigate(card.tab)}
                  className={`cursor-pointer text-left rounded-3xl p-5 border ${card.bg} ${card.border} group hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                      {card.icon}
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-[#ACBACC] group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-bold text-[#11233D] leading-snug">
                    {card.title}
                  </p>
                  <p className="text-xs text-[#ACBACC] font-medium mt-1">
                    {card.sub}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Activity Feed */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl shadow-sm border border-[#EEF3F6] h-full">
              {/* Feed Header */}
              <div className="px-5 py-5 border-b border-[#EEF3F6] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-[#00CEE6]/10 flex items-center justify-center">
                    <Activity size={14} className="text-[#00CEE6]" />
                  </div>
                  <h2 className="text-sm font-bold text-[#11233D]">
                    Recent Activity
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-[#ACBACC] font-medium">
                  <Clock size={11} />
                  Today
                </span>
              </div>

              {/* Feed Items */}
              <div className="px-5 py-4 flex flex-col gap-1">
                {activityFeed.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 py-3 border-b border-[#EEF3F6] last:border-0"
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5 ${item.iconBg}`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <p className="text-xs font-medium text-[#11233D] leading-snug">
                        {item.text}
                      </p>
                      <span className="text-[11px] text-[#ACBACC] font-medium">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5">
                <button className="cursor-pointer w-full py-2.5 rounded-2xl border border-[#EEF3F6] text-xs font-semibold text-[#825FEF] hover:bg-[#825FEF]/5 transition-colors">
                  View all activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
