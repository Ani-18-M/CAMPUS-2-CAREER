"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  TrendingUp,
  Sliders,
  Download,
  RefreshCw,
  FileText,
  Check,
  ChevronRight,
  ArrowUpRight,
  Info,
  ShieldCheck,
  Building2,
  UserCheck,
  ExternalLink,
  Target,
  TrendingDown,
  Activity,
  GraduationCap,
  BookOpen,
  Award,
  Library,
  BookMarked,
  ChevronLeft,
  ChevronDown,
  X,
  Upload,
  Send,
} from "lucide-react";
import CareerAIOrb from "@/components/CareerAIOrb";

interface SubjectContribution {
  id: string;
  code: string;
  name: string;
  attended: number;
  total: number;
  color: string;
  faculty: string;
  credits: number;
  type: "Theory" | "Lab";
}

interface PeriodItem {
  periodNumber: number;
  time: string;
  subjectCode: string;
  subjectName: string;
  room: string;
  faculty: string;
  topic: string;
  status: "PRESENT" | "ABSENT" | "REMEDIAL_SCHEDULED" | "OD_PENDING";
  rfidTimestamp?: string;
  disputeStatus?: "NONE" | "SUBMITTED" | "APPROVED";
}

interface AttendanceDashboardProps {
  studentName?: string;
  rollNumber?: string;
  initialAttendanceRate?: string;
  onNavigateTab?: (tab: string) => void;
  onBookMakeUpLab?: () => void;
  onSubmitOD?: () => void;
}

export default function AttendanceDashboard({
  studentName = "Ananya V.",
  rollNumber = "21BCE1089",
  initialAttendanceRate = "68.4%",
  onNavigateTab,
  onBookMakeUpLab,
  onSubmitOD,
}: AttendanceDashboardProps) {
  // ----------------------------------------------------
  // 1. Core Subject Attendance Data (Sums to 171 / 250 = 68.4%)
  // Based on Narasaraopeta Eng. College III B.Tech [CSE-C6] Time Table
  // ----------------------------------------------------
  const [subjects, setSubjects] = useState<SubjectContribution[]>([
    {
      id: "dwdm",
      code: "DWDM",
      name: "Data Warehousing & Mining",
      attended: 42,
      total: 50,
      color: "#00CEE6", // Cyan Phoenix
      faculty: "Prof. Ramesh Abbari",
      credits: 4,
      type: "Theory",
    },
    {
      id: "cn",
      code: "CN",
      name: "Computer Networks",
      attended: 36,
      total: 48,
      color: "#825FEF", // Royal Purple
      faculty: "Prof. A. Rebecca",
      credits: 4,
      type: "Theory",
    },
    {
      id: "flat",
      code: "FLAT",
      name: "Formal Languages & Automata",
      attended: 35,
      total: 45,
      color: "#F59E0B", // Amber Gold
      faculty: "Prof. Thota Rajani",
      credits: 4,
      type: "Theory",
    },
    {
      id: "ooad",
      code: "OOAD",
      name: "OO Analysis & Design",
      attended: 38,
      total: 46,
      color: "#10B981", // Emerald Green
      faculty: "Prof. Pallapu Lakshmi Priyanka",
      credits: 4,
      type: "Theory",
    },
    {
      id: "mc",
      code: "MC",
      name: "Mobile Computing",
      attended: 20,
      total: 61,
      color: "#F43F5E", // Rose Red (At-Risk subject pulling down total)
      faculty: "Dr. CH Seshu Kumar",
      credits: 3,
      type: "Theory",
    },
  ]);

  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  // Derived Totals
  const totalAttended = subjects.reduce((sum, s) => sum + s.attended, 0); // 171
  const totalConducted = subjects.reduce((sum, s) => sum + s.total, 0); // 250
  const currentRate = (totalAttended / totalConducted) * 100; // 68.4%
  const targetThreshold = 75.0; // Institutional requirement

  // Mathematical Requirement to reach 75%:
  // (totalAttended + N) / (totalConducted + N) >= 0.75
  // N >= (0.75 * totalConducted - totalAttended) / (1 - 0.75) = 4 * (187.5 - 171) = 66 periods
  const requiredPeriodsTo75 = Math.max(
    0,
    Math.ceil((0.75 * totalConducted - totalAttended) / 0.25)
  );
  const periodsPerDay = 7; // 7 periods per day (9:10 AM - 4:00 PM)
  const requiredDaysTo75 = Math.ceil(requiredPeriodsTo75 / periodsPerDay); // 10 days
  const rateIncreasePerPeriod =
    ((totalAttended + 1) / (totalConducted + 1) - totalAttended / totalConducted) *
    100; // ~ +0.126% per period
  const rateIncreasePerDay = rateIncreasePerPeriod * periodsPerDay; // ~ +0.88% per day
  const rateReductionPerPeriod =
    (totalAttended / totalConducted - totalAttended / (totalConducted + 1)) *
    100; // ~ -0.273% drop per missed period
  const rateReductionPerDay =
    (totalAttended / totalConducted - totalAttended / (totalConducted + periodsPerDay)) *
    100; // ~ -1.87% drop per missed day

  // ----------------------------------------------------
  // 2. AI What-If Simulator State
  // ----------------------------------------------------
  const [simulatedDays, setSimulatedDays] = useState<number>(10);
  const [includeMakeUpLabs, setIncludeMakeUpLabs] = useState<boolean>(true); // 2 labs = 10 periods
  const [includeODWaiver, setIncludeODWaiver] = useState<boolean>(false); // 12 periods waiver

  const extraSimulatedPeriods =
    simulatedDays * periodsPerDay +
    (includeMakeUpLabs ? 10 : 0) +
    (includeODWaiver ? 12 : 0);

  const projectedAttended = totalAttended + extraSimulatedPeriods;
  const projectedTotal = totalConducted + (simulatedDays * periodsPerDay + (includeMakeUpLabs ? 10 : 0));
  const projectedRate = Math.min(100, (projectedAttended / projectedTotal) * 100);

  // ----------------------------------------------------
  // AI Advisory Orb State
  // ----------------------------------------------------
  const [isOrbActive, setIsOrbActive] = useState(false);
  const [aiInputQuery, setAiInputQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<{
    headline: string;
    advice: string;
    source: string;
    latencyMs?: number;
    query?: string;
  }>({
    headline: "CSE-C6 Attendance Recovery Roadmap",
    advice: `• Priority Course: MC (Mobile Computing) with Dr. CH Seshu Kumar is at 32.8% (attended 20/61 periods).\n• Attend all 7 upcoming MC periods and complete Saturday FSD-2 / DM&CN Lab make-up sessions (+10 periods).\n• This targeted recovery raises your overall rate to 75.2% within 10 college days.`,
    source: "ai-advisor",
    latencyMs: 180,
    query: "How fast can I reach 75%?",
  });

  const handleAskAi = async (overridePrompt?: string) => {
    const q = (overridePrompt || aiInputQuery || "").trim();
    if (!q) return;
    setIsAiLoading(true);
    setIsOrbActive(true);

    try {
      const atRisk = subjects
        .filter((s) => s.attended / s.total < 0.75)
        .map((s) => `${s.code} ${s.name} (${((s.attended / s.total) * 100).toFixed(0)}%)`);

      const res = await fetch("/api/attendance-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: q,
          currentRate: parseFloat(currentRate.toFixed(1)),
          targetRate: 75.0,
          requiredDays: requiredDaysTo75,
          requiredPeriods: requiredPeriodsTo75,
          rateIncreasePerPeriod: parseFloat(rateIncreasePerPeriod.toFixed(3)),
          studentName,
          atRiskSubjects: atRisk,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiAdvice({
          headline: data.headline || "Attendance AI Advisory",
          advice: data.advice || "Advice generated based on your attendance records.",
          source: data.source || "ai-advisor",
          latencyMs: data.latencyMs || 180,
          query: q,
        });
      }
    } catch (err) {
      console.error("Failed to query AI advisor:", err);
    } finally {
      setIsAiLoading(false);
      setTimeout(() => setIsOrbActive(false), 1200);
      setAiInputQuery("");
    }
  };


  // ----------------------------------------------------
  // 3. Switchable View Mode (Daily First Preference)
  // ----------------------------------------------------
  const [attendanceViewMode, setAttendanceViewMode] = useState<"daily" | "subject">("daily");

  // Daily records map based on Narasaraopeta Engineering College III B.Tech [CSE - C6] Time Table
  const dailyPeriods: Record<string, { label: string; fullDay: string; periods: PeriodItem[] }> = {
    mon: {
      label: "Mon",
      fullDay: "Monday · Class Room 2303",
      periods: [
        {
          periodNumber: 1,
          time: "09:10 - 10:00",
          subjectCode: "MC",
          subjectName: "Mobile Computing",
          room: "Room 2303",
          faculty: "Dr. CH Seshu Kumar",
          topic: "Mobile IP Architecture & Cellular Wireless Networks",
          status: "PRESENT",
        },
        {
          periodNumber: 2,
          time: "10:00 - 10:50",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. A. Rebecca",
          topic: "Data Link Layer Framing & Error Control",
          status: "PRESENT",
        },
        {
          periodNumber: 3,
          time: "11:00 - 11:50",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. M. Murali Krishna",
          topic: "Multidimensional Data Models & OLAP Operations",
          status: "PRESENT",
        },
        {
          periodNumber: 4,
          time: "11:50 - 12:40",
          subjectCode: "APTITUDE",
          subjectName: "Quantitative Aptitude & Training",
          room: "Room 2303",
          faculty: "Placement Training",
          topic: "Time & Work, Permutations & Probability",
          status: "PRESENT",
        },
        {
          periodNumber: 5,
          time: "01:30 - 02:20",
          subjectCode: "MC",
          subjectName: "Mobile Computing",
          room: "Room 2303",
          faculty: "Dr. CH Seshu Kumar",
          topic: "Medium Access Control & IEEE 802.11 Protocols",
          status: "ABSENT",
        },
        {
          periodNumber: 6,
          time: "02:20 - 03:10",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. A. Rebecca",
          topic: "Sliding Window Protocols & Go-Back-N ARQ",
          status: "PRESENT",
        },
        {
          periodNumber: 7,
          time: "03:10 - 04:00",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. M. Vineela Rani",
          topic: "Routing Algorithms & Shortest Path Routing",
          status: "PRESENT",
        },
      ],
    },
    tue: {
      label: "Tue",
      fullDay: "Tuesday · Class Room 2303 & 2302 Lab",
      periods: [
        {
          periodNumber: 1,
          time: "09:10 - 10:00",
          subjectCode: "FLUTTER LAB",
          subjectName: "Flutter Mobile Application Lab",
          room: "2302 LAB",
          faculty: "Prof. Pallapu Lakshmi Priyanka",
          topic: "Stateful & Stateless Widgets, Navigation Routing",
          status: "PRESENT",
        },
        {
          periodNumber: 2,
          time: "10:00 - 10:50",
          subjectCode: "FLUTTER LAB",
          subjectName: "Flutter Mobile Application Lab",
          room: "2302 LAB",
          faculty: "Prof. Pallapu Lakshmi Priyanka",
          topic: "REST API Integration & JSON Serialization",
          status: "PRESENT",
        },
        {
          periodNumber: 3,
          time: "11:00 - 11:50",
          subjectCode: "DM&CN LAB",
          subjectName: "Data Mining & Computer Networks Lab",
          room: "2302 LAB",
          faculty: "Prof. Ramesh Abbari",
          topic: "Packet Sniffing with Wireshark & CRC Implementation",
          status: "PRESENT",
        },
        {
          periodNumber: 4,
          time: "11:50 - 12:40",
          subjectCode: "DM&CN LAB",
          subjectName: "Data Mining & Computer Networks Lab",
          room: "2302 LAB",
          faculty: "Prof. Ramesh Abbari",
          topic: "WEKA Tool Classification & Clustering Experiments",
          status: "REMEDIAL_SCHEDULED",
        },
        {
          periodNumber: 5,
          time: "01:30 - 02:20",
          subjectCode: "MC",
          subjectName: "Mobile Computing",
          room: "Room 2303",
          faculty: "Dr. CH Seshu Kumar",
          topic: "GSM Architecture, Entities & Call Routing",
          status: "ABSENT",
        },
        {
          periodNumber: 6,
          time: "02:20 - 03:10",
          subjectCode: "MC",
          subjectName: "Mobile Computing",
          room: "Room 2303",
          faculty: "Dr. CH Seshu Kumar",
          topic: "GPRS Protocol Architecture & Network Nodes",
          status: "ABSENT",
        },
        {
          periodNumber: 7,
          time: "03:10 - 04:00",
          subjectCode: "MC",
          subjectName: "Mobile Computing",
          room: "Room 2303",
          faculty: "Prof. M. Murali Krishna",
          topic: "Mobile Ad-hoc Networks (MANET) Routing Protocols",
          status: "OD_PENDING",
        },
      ],
    },
    wed: {
      label: "Wed",
      fullDay: "Wednesday · Class Room 2303",
      periods: [
        {
          periodNumber: 1,
          time: "09:10 - 10:00",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. G. Manasa",
          topic: "IPv4 Addressing Subnetting & CIDR Notation",
          status: "PRESENT",
        },
        {
          periodNumber: 2,
          time: "10:00 - 10:50",
          subjectCode: "OOAD",
          subjectName: "Object Oriented Analysis & Design",
          room: "Room 2303",
          faculty: "Prof. G. Manasa",
          topic: "UML Class Diagrams & Structural Modeling",
          status: "PRESENT",
        },
        {
          periodNumber: 3,
          time: "11:00 - 11:50",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. Ramesh Abbari",
          topic: "Data Preprocessing: Cleaning & Integration",
          status: "PRESENT",
        },
        {
          periodNumber: 4,
          time: "11:50 - 12:40",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. A. Rebecca",
          topic: "Distance Vector Routing & Link State Routing",
          status: "PRESENT",
        },
        {
          periodNumber: 5,
          time: "01:30 - 02:20",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. Ramesh Abbari",
          topic: "Association Rule Mining & Apriori Algorithm",
          status: "PRESENT",
        },
        {
          periodNumber: 6,
          time: "02:20 - 03:10",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. M. Vineela Rani",
          topic: "FP-Growth Tree Construction & Frequent Itemsets",
          status: "PRESENT",
        },
        {
          periodNumber: 7,
          time: "03:10 - 04:00",
          subjectCode: "FLAT",
          subjectName: "Formal Languages & Automata Theory",
          room: "Room 2303",
          faculty: "Prof. Thota Rajani",
          topic: "Deterministic Finite Automata (DFA) Minimization",
          status: "PRESENT",
        },
      ],
    },
    thu: {
      label: "Thu",
      fullDay: "Thursday · 2202 Lab & Room 2303",
      periods: [
        {
          periodNumber: 1,
          time: "09:10 - 10:00",
          subjectCode: "TECHNICAL",
          subjectName: "Technical Training (Coding)",
          room: "2202 LAB",
          faculty: "Technical Trainer",
          topic: "Data Structures: Trees, Graphs & Dynamic Programming",
          status: "PRESENT",
        },
        {
          periodNumber: 2,
          time: "10:00 - 10:50",
          subjectCode: "TECHNICAL",
          subjectName: "Technical Training (Coding)",
          room: "2202 LAB",
          faculty: "Technical Trainer",
          topic: "LeetCode & Competitive Coding Challenges",
          status: "PRESENT",
        },
        {
          periodNumber: 3,
          time: "11:00 - 11:50",
          subjectCode: "TECHNICAL",
          subjectName: "Technical Training (Coding)",
          room: "2202 LAB",
          faculty: "Technical Trainer",
          topic: "Algorithm Optimization & Complexity Analysis",
          status: "PRESENT",
        },
        {
          periodNumber: 4,
          time: "11:50 - 12:40",
          subjectCode: "TECHNICAL",
          subjectName: "Technical Training (Coding)",
          room: "2202 LAB",
          faculty: "Technical Trainer",
          topic: "Mock Coding Assessments & Technical Interview Prep",
          status: "PRESENT",
        },
        {
          periodNumber: 5,
          time: "01:30 - 02:20",
          subjectCode: "FLAT",
          subjectName: "Formal Languages & Automata Theory",
          room: "Room 2303",
          faculty: "Prof. Thota Rajani",
          topic: "NFA to DFA Equivalence & Subset Construction",
          status: "PRESENT",
        },
        {
          periodNumber: 6,
          time: "02:20 - 03:10",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. A. Rebecca",
          topic: "Transport Layer: TCP vs UDP & Congestion Control",
          status: "PRESENT",
        },
        {
          periodNumber: 7,
          time: "03:10 - 04:00",
          subjectCode: "CN",
          subjectName: "Computer Networks",
          room: "Room 2303",
          faculty: "Prof. A. Rebecca",
          topic: "Application Layer Protocols: DNS, HTTP, SMTP",
          status: "PRESENT",
        },
      ],
    },
    fri: {
      label: "Fri",
      fullDay: "Friday · Class Room 2303",
      periods: [
        {
          periodNumber: 1,
          time: "09:10 - 10:00",
          subjectCode: "OOAD",
          subjectName: "Object Oriented Analysis & Design",
          room: "Room 2303",
          faculty: "Prof. Pallapu Lakshmi Priyanka",
          topic: "Sequence Diagrams, Collaboration Diagrams & Interaction",
          status: "PRESENT",
        },
        {
          periodNumber: 2,
          time: "10:00 - 10:50",
          subjectCode: "OOAD",
          subjectName: "Object Oriented Analysis & Design",
          room: "Room 2303",
          faculty: "Prof. Pallapu Lakshmi Priyanka",
          topic: "State Machine Diagrams & Activity Diagrams",
          status: "PRESENT",
        },
        {
          periodNumber: 3,
          time: "11:00 - 11:50",
          subjectCode: "FLAT",
          subjectName: "Formal Languages & Automata Theory",
          room: "Room 2303",
          faculty: "Prof. Thota Rajani",
          topic: "Regular Expressions & Arden's Theorem",
          status: "PRESENT",
        },
        {
          periodNumber: 4,
          time: "11:50 - 12:40",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. Ramesh Abbari",
          topic: "Classification by Decision Tree Induction (ID3/C4.5)",
          status: "PRESENT",
        },
        {
          periodNumber: 5,
          time: "01:30 - 02:20",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. Ramesh Abbari",
          topic: "Bayesian Classification & Naive Bayes Classifier",
          status: "PRESENT",
        },
        {
          periodNumber: 6,
          time: "02:20 - 03:10",
          subjectCode: "DWDM",
          subjectName: "Data Warehousing & Data Mining",
          room: "Room 2303",
          faculty: "Prof. Ramesh Abbari",
          topic: "Cluster Analysis: K-Means Partitioning Method",
          status: "PRESENT",
        },
        {
          periodNumber: 7,
          time: "03:10 - 04:00",
          subjectCode: "FLAT",
          subjectName: "Formal Languages & Automata Theory",
          room: "Room 2303",
          faculty: "Prof. Thota Rajani",
          topic: "Pumping Lemma for Regular Languages",
          status: "PRESENT",
        },
      ],
    },
    sat: {
      label: "Sat",
      fullDay: "Saturday · Room 2303 & 2302 Lab",
      periods: [
        {
          periodNumber: 1,
          time: "09:10 - 10:00",
          subjectCode: "SOFT SKILLS",
          subjectName: "Soft Skills & Communication Lab",
          room: "Room 2303",
          faculty: "Prof. M. Chandra Mouli",
          topic: "Professional Presentation & Group Discussion",
          status: "PRESENT",
        },
        {
          periodNumber: 2,
          time: "10:00 - 10:50",
          subjectCode: "FLAT",
          subjectName: "Formal Languages & Automata Theory",
          room: "Room 2303",
          faculty: "Prof. Thota Rajani",
          topic: "Context-Free Grammars (CFG) & Derivation Trees",
          status: "PRESENT",
        },
        {
          periodNumber: 3,
          time: "11:00 - 11:50",
          subjectCode: "OOAD",
          subjectName: "Object Oriented Analysis & Design",
          room: "Room 2303",
          faculty: "Prof. Pallapu Lakshmi Priyanka",
          topic: "Design Patterns: Creational, Structural & Behavioral",
          status: "PRESENT",
        },
        {
          periodNumber: 4,
          time: "11:50 - 12:40",
          subjectCode: "FLAT",
          subjectName: "Formal Languages & Automata Theory",
          room: "Room 2303",
          faculty: "Prof. Thota Rajani",
          topic: "Pushdown Automata (PDA) Design & Transitions",
          status: "PRESENT",
        },
        {
          periodNumber: 5,
          time: "01:30 - 02:20",
          subjectCode: "FSD -2 LAB",
          subjectName: "Full Stack Development - II Lab",
          room: "2302 LAB",
          faculty: "Prof. Venkata Rao Marella",
          topic: "React Full Stack Application Development",
          status: "PRESENT",
        },
        {
          periodNumber: 6,
          time: "02:20 - 03:10",
          subjectCode: "FSD -2 LAB",
          subjectName: "Full Stack Development - II Lab",
          room: "2302 LAB",
          faculty: "Prof. Venkata Rao Marella",
          topic: "Node.js Express Backend & MongoDB Integration",
          status: "PRESENT",
        },
        {
          periodNumber: 7,
          time: "03:10 - 04:00",
          subjectCode: "FSD -2 LAB",
          subjectName: "Full Stack Development - II Lab",
          room: "2302 LAB",
          faculty: "Prof. Venkata Rao Marella",
          topic: "End-to-End Authentication & Deployment",
          status: "PRESENT",
        },
      ],
    },
  };

  // ----------------------------------------------------
  // 3b. Academic Month & 4-Date Rolling Window Schedule
  // ----------------------------------------------------
  interface AcademicMonth {
    year: number;
    month: number; // 0-indexed: 6 = Jul, 7 = Aug, 8 = Sep, 9 = Oct, 10 = Nov, 11 = Dec, 0 = Jan
    name: string;
    tag?: string;
  }

  const academicMonths: AcademicMonth[] = [
    { year: 2026, month: 6, name: "Jul", tag: "Sem Start" },
    { year: 2026, month: 7, name: "Aug", tag: "Mid-1 Prep" },
    { year: 2026, month: 8, name: "Sep", tag: "Mid-1 Exams" },
    { year: 2026, month: 9, name: "Oct", tag: "Current" },
    { year: 2026, month: 10, name: "Nov", tag: "Mid-2 Prep" },
    { year: 2026, month: 11, name: "Dec", tag: "Lab Exams" },
    { year: 2027, month: 0, name: "Jan", tag: "End Sem" },
  ];

  function getDaysInMonth(year: number, month: number) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const roomMap: Record<string, string> = {
      mon: "Class Room 2303",
      tue: "Room 2303 & 2302 Lab",
      wed: "Class Room 2303",
      thu: "2202 Lab & Room 2303",
      fri: "Class Room 2303",
      sat: "Room 2303 & 2302 Lab",
    };

    const dates: {
      id: string;
      label: string;
      fullDisplay: string;
      timetableDayKey: "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
    }[] = [];
    const daysCount = new Date(year, month + 1, 0).getDate();

    for (let d = 1; d <= daysCount; d++) {
      const dateObj = new Date(year, month, d);
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0) continue; // Skip Sunday

      const timetableKey = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][dayOfWeek] as "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
      const monthStr = monthNames[month];
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const id = `${year}-${String(month + 1).padStart(2, "0")}-${dayStr}`;

      dates.push({
        id,
        label: `${monthStr} ${dayStr}`,
        fullDisplay: `${monthStr} ${dayStr} · ${roomMap[timetableKey] || "Class Room 2303"}`,
        timetableDayKey: timetableKey,
      });
    }
    return dates;
  }

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // Oct (0-indexed: 9 = Oct)
  const [isBigCalendarOpen, setIsBigCalendarOpen] = useState(false);

  // Full calendar matrix generator for the big calendar pop-up
  const fullCalendarDays = React.useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
    const startPadding = (firstDayOfWeek + 6) % 7;

    const days: Array<{
      dayNum?: number;
      isSunday?: boolean;
      dateId?: string;
      isToday?: boolean;
      timetableKey?: "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
    }> = [];

    for (let p = 0; p < startPadding; p++) {
      days.push({});
    }

    const dayKeys: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat")[] = [
      "mon",
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
    ];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(selectedYear, selectedMonth, d);
      const dow = dateObj.getDay();
      const isSunday = dow === 0;
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const dateId = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${dayStr}`;
      const isToday = selectedYear === 2026 && selectedMonth === 9 && d === 13;

      days.push({
        dayNum: d,
        isSunday,
        dateId,
        isToday,
        timetableKey: isSunday ? undefined : dayKeys[dow],
      });
    }

    return days;
  }, [selectedYear, selectedMonth]);

  const handleSelectDateFromCalendar = (dateId: string) => {
    setSelectedDateId(dateId);
    const idx = currentMonthDates.findIndex((d) => d.id === dateId);
    if (idx >= 0) {
      const newOffset = Math.floor(idx / 4) * 4;
      setDateOffset(Math.min(Math.max(0, currentMonthDates.length - 4), newOffset));
    }
    setIsBigCalendarOpen(false);
  };

  // Generate working dates for the selected month
  const currentMonthDates = React.useMemo(() => {
    return getDaysInMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  // Default dateOffset to 9 (Oct 12 - Oct 15) with Oct 13 selected
  const [dateOffset, setDateOffset] = useState<number>(9);
  const [selectedDateId, setSelectedDateId] = useState<string>("2026-10-13");

  const currentMonthObj =
    academicMonths.find((m) => m.year === selectedYear && m.month === selectedMonth) || academicMonths[3];

  const handleSelectMonth = (year: number, month: number) => {
    setSelectedYear(year);
    setSelectedMonth(month);

    const newDates = getDaysInMonth(year, month);
    if (year === 2026 && month === 9) {
      setDateOffset(9);
      setSelectedDateId("2026-10-13");
    } else {
      setDateOffset(0);
      setSelectedDateId(newDates[0]?.id || "");
    }
  };

  const handlePrevDates = () => {
    const nextOffset = Math.max(0, dateOffset - 4);
    setDateOffset(nextOffset);
    if (currentMonthDates[nextOffset]) {
      setSelectedDateId(currentMonthDates[nextOffset].id);
    }
  };

  const handleNextDates = () => {
    const nextOffset = Math.min(Math.max(0, currentMonthDates.length - 4), dateOffset + 4);
    setDateOffset(nextOffset);
    if (currentMonthDates[nextOffset]) {
      setSelectedDateId(currentMonthDates[nextOffset].id);
    }
  };

  const visibleDates = currentMonthDates.slice(dateOffset, dateOffset + 4);
  const activeDateItem =
    currentMonthDates.find((d) => d.id === selectedDateId) || visibleDates[0] || currentMonthDates[0];
  const activePeriods = activeDateItem
    ? dailyPeriods[activeDateItem.timetableDayKey]?.periods || []
    : [];

  // ----------------------------------------------------
  // 4. Dispute Modal State
  // ----------------------------------------------------
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedDisputePeriod, setSelectedDisputePeriod] = useState<PeriodItem | null>(null);
  const [disputeReason, setDisputeReason] = useState("Biometric Turnstile Glitch");
  const [disputeNotes, setDisputeNotes] = useState("");
  const [uploadedProof, setUploadedProof] = useState<{ name: string; size: string } | null>(null);
  const [isDisputeSuccess, setIsDisputeSuccess] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeKB = (file.size / 1024).toFixed(0);
      const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${sizeKB} KB`;
      setUploadedProof({ name: file.name, size: sizeStr });
    }
  };

  const handleOpenDispute = (period: PeriodItem) => {
    setSelectedDisputePeriod(period);
    setDisputeReason("Biometric Turnstile Glitch");
    setDisputeNotes("");
    setUploadedProof(null);
    setIsDisputeSuccess(false);
    setIsDisputeModalOpen(true);
  };

  const handleConfirmDispute = () => {
    setIsDisputeSuccess(true);
    setTimeout(() => {
      setIsDisputeModalOpen(false);
    }, 1500);
  };

  // ----------------------------------------------------
  // 5. SVG Donut Math for Subject Segmented Ring
  // ----------------------------------------------------
  // Radius and Circumference
  const radius = 100;
  const circumference = 2 * Math.PI * radius; // ~628.32
  // Arc represents the 100% capacity.
  // The student's filled portion covers currentRate / 100 * circumference.
  // We divide the filled portion into segments proportional to each subject's attended periods!
  let accumulatedLength = 0;
  const segments = subjects.map((sub) => {
    // Length of this subject segment on the circumference:
    // (sub.attended / totalConducted) * circumference
    const length = (sub.attended / totalConducted) * circumference;
    const startOffset = accumulatedLength;
    accumulatedLength += length;
    const contributionToStudent = ((sub.attended / totalAttended) * 100).toFixed(1);
    const contributionToOverall = ((sub.attended / totalConducted) * 100).toFixed(1);
    const subjectRate = ((sub.attended / sub.total) * 100).toFixed(1);

    return {
      ...sub,
      length,
      startOffset,
      contributionToStudent,
      contributionToOverall,
      subjectRate,
    };
  });

  // 75% threshold point on circumference
  const thresholdOffset = 0.75 * circumference;
  // Calculate angle for 75% marker (starting from -90 deg at top)
  const thresholdAngle = 0.75 * 360 - 90; // 180 degrees (bottom)
  const thresholdRad = (thresholdAngle * Math.PI) / 180;
  const thresholdX = 130 + (radius + 2) * Math.cos(thresholdRad);
  const thresholdY = 130 + (radius + 2) * Math.sin(thresholdRad);

  return (
    <div className="font-attendance max-w-6xl mx-auto space-y-4 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* ======================================================== */}
      {/* SECTION 0: CLEAN ATTENDANCE HERO BANNER (PEBBLE SLATE)   */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#D2E4EA] via-[#BFDBE3] to-[#A8D3DD] p-4 sm:p-7 lg:p-8 rounded-3xl sm:rounded-[48px] border-2 border-[#00CEE6]/40 shadow-[0_20px_50px_-12px_rgba(0,180,216,0.25),0_6px_20px_rgba(17,35,61,0.07),inset_0_2px_4px_rgba(255,255,255,0.85),inset_0_-2px_4px_rgba(0,180,216,0.2)]">
        {/* Deeper Slate Cyan Ambient Glow Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00CEE6]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ACBACC]/40 rounded-full blur-2xl pointer-events-none" />

        {/* Academic / Study Motif Watermarks Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Graduation Cap in upper-right */}
          <GraduationCap className="absolute -top-4 right-10 w-36 h-36 text-[#00CEE6]/20 rotate-12 stroke-[1.2]" />
          {/* Open Knowledge Book in bottom-right */}
          <BookOpen className="absolute -bottom-8 right-60 w-32 h-32 text-[#11233D]/12 -rotate-12 stroke-[1.2]" />
          {/* Academic Award / Medal in upper-center */}
          <Award className="absolute -top-4 left-1/2 -translate-x-8 w-24 h-24 text-[#825FEF]/16 -rotate-6 stroke-[1.3]" />
          {/* Classical Library / University Pillars in bottom-left */}
          <Library className="absolute -bottom-5 left-52 w-24 h-24 text-[#ACBACC]/45 rotate-6 stroke-[1.2]" />
          {/* BookMarked Notebook in center-right */}
          <BookMarked className="absolute top-5 right-1/4 w-20 h-20 text-[#00CEE6]/18 rotate-6 stroke-[1.3]" />
        </div>

        <div className="relative z-10 flex items-center gap-3.5 sm:gap-5">
          {/* Enlarged Graduate Student Photo Avatar with Pebble Curvature */}
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-2xl sm:rounded-[36px] overflow-hidden ring-2 ring-[#00CEE6] shadow-md shrink-0 bg-[#11233D]">
            <img
              src="/brand/hero-graduate.jpg"
              alt="Student Profile"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#11233D] tracking-tight">
                Attendance
              </h1>
              <span className="bg-white/85 text-slate-700 text-[10px] sm:text-xs font-black px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/90 shadow-2xs">
                III B.Tech [CSE - C6] · Room 2303 · NEC
              </span>
            </div>
          </div>
        </div>

        {/* Pebble Theme Cockpit Bar with 4 Rounded Pod Capsules */}
        <div className="mt-5 pt-4 border-t border-[#00CEE6]/25 relative z-10">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#0C1B2E] via-[#11233D] to-[#0C1B2E] rounded-[24px] sm:rounded-full p-1.5 sm:p-2 border-2 border-white/20 shadow-[0_12px_28px_-6px_rgba(17,35,61,0.5),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5)] grid grid-cols-2 lg:grid-cols-4 gap-2">
            {/* Pod 1: Overall Rate */}
            <div className="rounded-[18px] sm:rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] transition-all duration-300 py-2 sm:py-2.5 px-3 flex flex-col items-center justify-center text-center cursor-default group">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00CEE6] shrink-0 shadow-[0_0_8px_#00CEE6]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Overall Rate
                </span>
              </div>
              <div className="mt-0.5 text-center">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight group-hover:scale-[1.03] transition-transform inline-block">
                  {currentRate.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Pod 2: Target Goal */}
            <div className="rounded-[18px] sm:rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] transition-all duration-300 py-2 sm:py-2.5 px-3 flex flex-col items-center justify-center text-center cursor-default group">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#825FEF] shrink-0 shadow-[0_0_8px_#825FEF]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Target Goal
                </span>
              </div>
              <div className="mt-0.5 text-center">
                <span className="text-xl sm:text-2xl font-black text-[#C4B5FD] tracking-tight group-hover:scale-[1.03] transition-transform inline-block">
                  75.0%
                </span>
              </div>
            </div>

            {/* Pod 3: Period Gain */}
            <div className="rounded-[18px] sm:rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] transition-all duration-300 py-2 sm:py-2.5 px-3 flex flex-col items-center justify-center text-center cursor-default group">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#00CEE6] shrink-0 shadow-[0_0_8px_#00CEE6]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Period Gain
                </span>
              </div>
              <div className="mt-0.5 text-center">
                <span className="text-xl sm:text-2xl font-black text-[#00CEE6] tracking-tight group-hover:scale-[1.03] transition-transform inline-block">
                  +{rateIncreasePerPeriod.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Pod 4: Absence Drop */}
            <div className="rounded-[18px] sm:rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-white/20 shadow-[inset_0_1px_2px_rgba(255,255,255,0.12)] transition-all duration-300 py-2 sm:py-2.5 px-3 flex flex-col items-center justify-center text-center cursor-default group">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Absence Drop
                </span>
              </div>
              <div className="mt-0.5 text-center">
                <span className="text-xl sm:text-2xl font-black text-rose-400 tracking-tight group-hover:scale-[1.03] transition-transform inline-block">
                  -{rateReductionPerPeriod.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* ATTENDANCE SECTION: OVERALL PEBBLE SLATE CARD            */}
      {/* ======================================================== */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] p-3.5 sm:p-6 lg:p-8 rounded-3xl sm:rounded-[48px] border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)]">
        {/* Soft Pebble Slate Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ACBACC]/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-stretch">

          {/* LEFT SIDE: PEBBLE THEMED TOTAL ATTENDANCE POD (MATCHING STATIC HEIGHT ON DESKTOP) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-4 sm:p-6 rounded-2xl sm:rounded-[38px] bg-white/95 border-2 border-slate-200/80 shadow-[0_10px_30px_-6px_rgba(17,35,61,0.05),inset_0_2px_4px_rgba(255,255,255,1)] relative overflow-hidden min-h-0 lg:min-h-[760px] h-full">
            {/* Ambient Pod Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#00CEE6]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#825FEF]/8 rounded-full blur-2xl pointer-events-none" />

            {/* Top section: Header & Radial Gauge */}
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2 bg-slate-100/90 px-3.5 py-1.5 rounded-full border border-slate-200/80 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#00CEE6] animate-pulse" />
                  <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    Total Attendance
                  </span>
                </div>
              </div>

              {/* Radial Donut Gauge Visualizer */}
              <div className="relative w-[170px] h-[170px] sm:w-[220px] sm:h-[220px] flex items-center justify-center my-1 sm:my-2 relative z-10">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
                  {/* 1. Background full track representing 100% maximum capacity */}
                  <circle
                    cx="130"
                    cy="130"
                    r={radius}
                    stroke="#CBD5E1"
                    strokeWidth="20"
                    fill="transparent"
                    className="opacity-60"
                  />

                  {/* 2. 75% Criteria Cutoff Target Dashed Ring */}
                  <circle
                    cx="130"
                    cy="130"
                    r={radius}
                    stroke="#94A3B8"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    fill="transparent"
                    className="opacity-50"
                  />

                  {/* 3. Segmented colored arcs per subject filling the 68.4% total */}
                  {segments.map((seg) => {
                    const isHovered = hoveredSubject === seg.id;
                    return (
                      <circle
                        key={seg.id}
                        cx="130"
                        cy="130"
                        r={radius}
                        stroke={seg.color}
                        strokeWidth={isHovered ? "24" : "20"}
                        strokeDasharray={`${seg.length} ${circumference}`}
                        strokeDashoffset={-seg.startOffset}
                        strokeLinecap="butt"
                        fill="transparent"
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredSubject(seg.id)}
                        onMouseLeave={() => setHoveredSubject(null)}
                      />
                    );
                  })}

                  {/* 4. 75% Indicator Notch */}
                  <line
                    x1="130"
                    y1="10"
                    x2="130"
                    y2="30"
                    stroke="#11233D"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    transform="rotate(270 130 130)"
                    className="filter drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
                  />
                </svg>

                {/* Center Readout inside the Circle - Pebble Core */}
                <div className="absolute inset-4 sm:inset-5 rounded-full bg-slate-50/95 shadow-[0_6px_20px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,1)] flex flex-col items-center justify-center text-center p-3 select-none pointer-events-none border border-slate-200/70">
                  <span className="text-3xl sm:text-4xl font-black text-[#11233D] tracking-tight">
                    {currentRate.toFixed(1)}%
                  </span>
                  <span className="text-[11px] sm:text-xs font-extrabold text-slate-500 mt-0.5">
                    {totalAttended} / {totalConducted} Periods
                  </span>
                  <div className="mt-1.5 inline-flex items-center gap-1 bg-amber-100/90 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                    <span>-6.6% to Cutoff</span>
                  </div>
                </div>
              </div>

              {/* Quick mini color pills */}
              <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-600 font-bold relative z-10">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onMouseEnter={() => setHoveredSubject(s.id)}
                    onMouseLeave={() => setHoveredSubject(null)}
                    onClick={() => setAttendanceViewMode("subject")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition-all ${
                      hoveredSubject === s.id
                        ? "bg-white text-[#11233D] shadow-xs scale-105 font-black border border-slate-300"
                        : "bg-white/80 hover:bg-white border border-slate-200/80 shadow-2xs"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span>{s.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lower section: 4-Metric Pebble Pod (Clean, non-duplicate metrics) */}
            <div className="w-full mt-4 pt-4 border-t border-slate-200/80 space-y-3 relative z-10">
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                {/* Metric 1: Deficit Periods */}
                <div className="p-3 rounded-[20px] bg-slate-50/90 border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Deficit
                  </span>
                  <span className="text-base sm:text-lg font-black text-rose-600">
                    17 <span className="text-[11px] text-slate-500 font-bold">Periods</span>
                  </span>
                </div>

                {/* Metric 2: Required Consecutive */}
                <div className="p-3 rounded-[20px] bg-slate-50/90 border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Required
                  </span>
                  <span className="text-base sm:text-lg font-black text-amber-600">
                    66 <span className="text-[11px] text-slate-500 font-bold">Periods</span>
                  </span>
                </div>

                {/* Metric 3: Recovery Days */}
                <div className="p-3 rounded-[20px] bg-slate-50/90 border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Recovery
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#00CEE6]">
                    9.4 <span className="text-[11px] text-slate-500 font-bold">Days</span>
                  </span>
                </div>

                {/* Metric 4: Daily Pace */}
                <div className="p-3 rounded-[20px] bg-slate-50/90 border border-slate-200/80 shadow-2xs text-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Daily Pace
                  </span>
                  <span className="text-base sm:text-lg font-black text-[#825FEF]">
                    7 <span className="text-[11px] text-slate-500 font-bold">/ Day</span>
                  </span>
                </div>
              </div>

              {/* Recovery Velocity Strip (Clean progress, no duplicate 68.4% or 75.0%) */}
              <div className="p-3.5 rounded-[22px] bg-[#11233D] text-white shadow-md space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-300">Recovery Progress</span>
                  <span className="text-[#00CEE6] font-black">{((currentRate / 75) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00CEE6] to-[#825FEF] rounded-full"
                    style={{ width: `${(currentRate / 75) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SCHEDULE & BREAKDOWN CARD - SLATE GREY PEBBLE CARD */}
          <div className="lg:col-span-8 bg-gradient-to-br from-[#D5DEE7] via-[#E4EBF2] to-[#CBD6E2] rounded-2xl sm:rounded-[38px] border-2 border-slate-300/90 p-4 sm:p-6 shadow-[0_12px_36px_-8px_rgba(71,85,105,0.15),inset_0_2px_4px_rgba(255,255,255,0.95)] relative overflow-hidden flex flex-col justify-between min-h-0 lg:min-h-[760px] h-full">
            {/* Ambient soft slate grey & cyan glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#94A3B8]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col flex-1 justify-between gap-4">
              {/* Header with Segmented Control */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-300/70">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#475569] shadow-[0_0_8px_rgba(71,85,105,0.5)]" />
                  <h3 className="text-lg font-black text-[#11233D] tracking-tight">
                    {attendanceViewMode === "daily" ? "Daily Schedule" : "Subject Breakdown"}
                  </h3>
                </div>

                {/* Segmented Control Tabs - Bulky Pebble Pills */}
                <div className="flex items-center bg-white/70 p-1 rounded-full border border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setAttendanceViewMode("daily")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      attendanceViewMode === "daily"
                        ? "bg-[#11233D] text-white shadow-sm"
                        : "text-slate-600 hover:text-[#11233D]"
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5 text-[#00CEE6]" />
                    <span>Daily</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendanceViewMode("subject")}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
                      attendanceViewMode === "subject"
                        ? "bg-[#11233D] text-white shadow-sm"
                        : "text-slate-600 hover:text-[#11233D]"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5 text-[#475569]" />
                    <span>Subject-Wise</span>
                  </button>
                </div>
              </div>

              {/* TAB CONTENT 1: DAILY ATTENDANCE (FIRST PREFERENCE / DEFAULT) */}
              {attendanceViewMode === "daily" && (
                <div className="space-y-3.5 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
                  {/* Top Bar Area: Separate Calendar Logo Button + Big Bulky Dates Switching Bar */}
                  <div className="w-full flex flex-col items-center gap-2">
                    <div className="w-full flex items-center justify-center gap-3 flex-wrap sm:flex-nowrap">
                      {/* Separate Standalone Calendar Button using the Sidebar Brand Logo */}
                      <button
                        type="button"
                        onClick={() => setIsBigCalendarOpen(true)}
                        title={`Open Academic Calendar (${currentMonthObj.name} 2026)`}
                        className="h-14 sm:h-16 w-14 sm:w-16 rounded-[24px] sm:rounded-[28px] bg-white/90 hover:bg-white border-2 border-slate-300/90 shadow-[0_4px_16px_rgba(71,85,105,0.1),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center justify-center transition-all cursor-pointer group shrink-0 active:scale-95"
                      >
                        <img
                          src="/brand/icons/attendance-light.png"
                          alt="Academic Calendar"
                          className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-[0_0_10px_rgba(0,210,234,0.6)] group-hover:scale-110 transition-transform"
                        />
                      </button>

                      {/* Dates Switching Bar: Decreased length, increased height (h-14 sm:h-16) for bulky tactile view */}
                      <div className="h-14 sm:h-16 bg-white/85 p-1.5 sm:p-2 rounded-full border-2 border-slate-300/90 shadow-[0_4px_16px_rgba(71,85,105,0.1),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center gap-1 sm:gap-2 w-full max-w-[420px] sm:max-w-[440px]">
                        {/* Prev 4 Dates Arrow Button */}
                        <button
                          type="button"
                          onClick={handlePrevDates}
                          disabled={dateOffset === 0}
                          title="Previous 4 dates"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#11233D] disabled:opacity-25 disabled:hover:bg-slate-100 disabled:cursor-not-allowed flex items-center justify-center shrink-0 border border-slate-200 shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                        </button>

                        {/* 4 Date Switching Buttons - Grey Pebble Theme for Active Date */}
                        <div className="flex-1 grid grid-cols-4 gap-1 sm:gap-1.5">
                          {visibleDates.map((dateItem) => {
                            const isSelected = selectedDateId === dateItem.id;
                            return (
                              <button
                                key={dateItem.id}
                                type="button"
                                onClick={() => setSelectedDateId(dateItem.id)}
                                className={`h-10 sm:h-11 px-1 sm:px-2 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-1 text-center select-none ${
                                  isSelected
                                    ? "bg-gradient-to-b from-[#64748B] via-[#475569] to-[#334155] text-white shadow-[0_4px_12px_rgba(30,41,59,0.35),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.3)] border border-slate-400/60 scale-[1.04]"
                                    : "text-slate-600 hover:text-[#11233D] hover:bg-slate-200/60 border border-transparent"
                                }`}
                              >
                                {isSelected && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00CEE6] shrink-0 shadow-[0_0_6px_#00CEE6]" />
                                )}
                                <span className="truncate">{dateItem.label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Next 4 Dates Arrow Button */}
                        <button
                          type="button"
                          onClick={handleNextDates}
                          disabled={dateOffset + 4 >= currentMonthDates.length}
                          title="Next 4 dates"
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-[#11233D] disabled:opacity-25 disabled:hover:bg-slate-100 disabled:cursor-not-allowed flex items-center justify-center shrink-0 border border-slate-200 shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                        </button>
                      </div>
                    </div>

                    {/* Day Context Subtitle */}
                    <div className="w-full max-w-xl mx-auto flex items-center justify-between px-3 pt-0.5 text-xs text-slate-600 font-bold">
                      <span className="text-[#11233D] font-black flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#00CEE6]" />
                        {activeDateItem.fullDisplay}
                      </span>
                      <span className="text-slate-500 font-semibold text-[11px] sm:text-xs">
                        {activePeriods.length} Periods
                      </span>
                    </div>
                  </div>

                  {/* Period Cards List - Default White Color with Roundy Curves & Edges */}
                  <div className="w-full max-w-xl mx-auto space-y-2 sm:space-y-2.5">
                    {activePeriods.map((period) => {
                      const isPresent = period.status === "PRESENT";
                      const isAbsent = period.status === "ABSENT";
                      const isRemedial = period.status === "REMEDIAL_SCHEDULED";
                      const isOD = period.status === "OD_PENDING";

                      return (
                        <div
                          key={period.periodNumber}
                          className="p-3.5 sm:py-4 sm:px-5 rounded-[22px] sm:rounded-[26px] border-2 bg-white/95 border-slate-200/90 shadow-[0_4px_16px_rgba(17,35,61,0.04)] hover:shadow-md hover:border-slate-300 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-slate-800">
                            {/* Period Time & Subject Info */}
                            <div className="flex items-center gap-3.5">
                              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[16px] bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-[#11233D] font-black text-xs sm:text-sm shadow-2xs">
                                P{period.periodNumber}
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs sm:text-sm font-black text-[#11233D]">
                                    {period.subjectCode}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {period.subjectName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
                                  <span>{period.time}</span>
                                  <span>·</span>
                                  <span className="font-semibold text-slate-600">{period.room}</span>
                                </div>
                              </div>
                            </div>

                            {/* Status Icon & Action */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                              {isPresent && (
                                <div
                                  title="Present"
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300/80 flex items-center justify-center shadow-2xs"
                                >
                                  <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] text-emerald-600" />
                                </div>
                              )}
                              {isAbsent && (
                                <div className="flex items-center gap-2">
                                  <div
                                    title="Absent"
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-50 text-rose-700 border border-rose-300/80 flex items-center justify-center shadow-2xs"
                                  >
                                    <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3] text-rose-600" />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenDispute(period)}
                                    title="Dispute Attendance"
                                    className="h-9 sm:h-10 px-3.5 rounded-full bg-rose-100/90 hover:bg-rose-200 text-rose-700 border border-rose-200 text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center"
                                  >
                                    <span>Dispute</span>
                                  </button>
                                </div>
                              )}
                              {isRemedial && (
                                <div
                                  title="Remedial Scheduled"
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-50 text-purple-700 border border-purple-300/80 flex items-center justify-center shadow-2xs"
                                >
                                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                                </div>
                              )}
                              {isOD && (
                                <div
                                  title="On-Duty Pending"
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-50 text-amber-700 border border-amber-300/80 flex items-center justify-center shadow-2xs"
                                >
                                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: SUBJECT-WISE BREAKDOWN (STATIC HEIGHT PARITY) */}
              {attendanceViewMode === "subject" && (
                <div className="space-y-4 animate-in fade-in duration-200 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5">
                    {segments.map((seg) => {
                      const isHovered = hoveredSubject === seg.id;
                      const isAtRisk = parseFloat(seg.subjectRate) < 75;

                      return (
                        <div
                          key={seg.id}
                          onMouseEnter={() => setHoveredSubject(seg.id)}
                          onMouseLeave={() => setHoveredSubject(null)}
                          className={`p-3.5 sm:p-4 rounded-[22px] sm:rounded-[26px] border-2 transition-all cursor-pointer shadow-[0_2px_10px_rgba(17,35,61,0.03),inset_0_1px_2px_rgba(255,255,255,0.95)] ${
                            isHovered
                              ? "bg-white border-[#825FEF] shadow-md scale-[1.008]"
                              : "bg-white/95 border-slate-200/90 hover:border-slate-300 hover:shadow-xs"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-slate-800">
                            <div className="flex items-center gap-3">
                              <span
                                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                                style={{ backgroundColor: seg.color }}
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-black text-[#11233D]">
                                    {seg.code}
                                  </span>
                                  <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {seg.name}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">
                                  {seg.type}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-extrabold text-slate-500">
                                {seg.attended} / {seg.total}
                              </span>
                              <span
                                className={`text-xs font-black px-3 py-1 rounded-full shadow-2xs ${
                                  isAtRisk
                                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                }`}
                              >
                                {seg.subjectRate}%
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar reflecting share */}
                          <div className="mt-2.5 w-full bg-slate-100/90 h-2 rounded-full overflow-hidden p-0.5 border border-slate-200/40">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${seg.subjectRate}%`,
                                backgroundColor: seg.color,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Academic Subject Summary Pod - Clean & Minimal */}
                  <div className="p-4 sm:p-5 rounded-[24px] bg-white/80 border border-slate-300/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-800">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00CEE6]" />
                        <span className="text-xs font-black text-[#11233D] uppercase tracking-wider">
                          Advisory
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        FLAT & MC require consecutive attendance to clear the cutoff.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttendanceViewMode("daily")}
                      className="px-4 py-2 rounded-full text-xs font-black bg-[#11233D] text-white hover:bg-[#1A365D] transition-all cursor-pointer shadow-sm shrink-0 flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-[#00CEE6]" />
                      <span>Daily Schedule</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* REQUIREMENT 2: AI ADVISORY & MINI ORB                    */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-[#0B1728] via-[#11233D] to-[#162744] text-white p-6 sm:p-7 rounded-3xl shadow-xl border border-white/10 relative overflow-hidden">
        {/* Glow ambient effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#825FEF]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header with Title and Target Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00CEE6] animate-pulse" />
              <h3 className="text-xl font-black text-white tracking-tight">
                AI Attendance Advisor
              </h3>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-amber-500/20 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300">
                {requiredDaysTo75} Days to Goal
              </div>
            </div>
          </div>

          {/* Main Grid: Mini Orb on the Left, AI Interaction on the Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left: Mini Orb (No tiles, clean & centered) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-3">
              <div className="relative">
                <CareerAIOrb
                  size={165}
                  isVoiceActive={isOrbActive || isAiLoading}
                  onToggleVoice={() => {
                    if (!isAiLoading) {
                      handleAskAi("How can I restore my 75% attendance criteria?");
                    }
                  }}
                  label="ATTENDANCE AI"
                  subtitle={isAiLoading ? "Analyzing..." : "Tap to Consult"}
                />
              </div>

              {/* Status pill beneath the orb */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-300 bg-white/5 px-3.5 py-1 rounded-full border border-white/10">
                <span className={`w-2 h-2 rounded-full ${isAiLoading ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                <span>{isAiLoading ? "Analyzing..." : "Ready"}</span>
              </div>
            </div>

            {/* Right: Clean AI Response + Direct Query Bar */}
            <div className="lg:col-span-8 space-y-3.5">
              {/* Quick Prompt Chips */}
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: "💡 Fast-track", prompt: "How fast can I reach 75%?" },
                  { label: "⚠️ Lab Risk", prompt: "Will missing Friday's lab drop my tier-1 eligibility?" },
                  { label: "📝 Draft OD", prompt: "Draft an OD leave note for HOD" },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAskAi(item.prompt)}
                    disabled={isAiLoading}
                    className="text-xs bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 hover:border-[#00CEE6]/40 text-slate-200 px-3.5 py-1.5 rounded-full transition-all cursor-pointer select-none flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Live AI Response Card (Glassmorphic, crisp, no boilerplate text) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.06] border border-white/15 backdrop-blur-md relative overflow-hidden transition-all duration-300">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00CEE6]" />
                    <h4 className="text-sm font-bold text-white">{aiAdvice.headline}</h4>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="bg-[#00CEE6]/10 text-[#00CEE6] px-2 py-0.5 rounded-full border border-[#00CEE6]/25 font-bold">
                      AI Advisor
                    </span>
                  </div>
                </div>

                <div className="pt-3 text-xs text-slate-200 space-y-1.5 leading-relaxed whitespace-pre-line font-medium">
                  {isAiLoading ? (
                    <div className="py-4 flex items-center justify-center gap-2 text-slate-300">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#00CEE6]" />
                      <span>AI is calculating optimal attendance recovery path...</span>
                    </div>
                  ) : (
                    aiAdvice.advice
                  )}
                </div>

                {/* Quick Action Buttons inside Response Card */}
                {!isAiLoading && (
                  <div className="pt-3 mt-3 border-t border-white/10 flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        if (onBookMakeUpLab) onBookMakeUpLab();
                        else if (onNavigateTab) onNavigateTab("Permissions");
                      }}
                      className="bg-[#00CEE6] hover:bg-[#00BCD4] text-[#0F1E36] px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Make-up Lab</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onSubmitOD) onSubmitOD();
                        else if (onNavigateTab) onNavigateTab("Permissions");
                      }}
                      className="bg-white/10 hover:bg-white/15 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#C4B5FD]" />
                      <span>OD Proof</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Ask Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi();
                }}
                className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-[#00CEE6]/60 rounded-full p-1.5 transition-all"
              >
                <input
                  type="text"
                  value={aiInputQuery}
                  onChange={(e) => setAiInputQuery(e.target.value)}
                  placeholder="Ask AI Advisor..."
                  className="flex-1 bg-transparent px-3.5 py-1.5 text-xs text-white placeholder-slate-400 outline-none"
                  disabled={isAiLoading}
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiInputQuery.trim()}
                  title="Ask AI Advisor"
                  className="w-8 h-8 rounded-full bg-[#00CEE6] hover:bg-[#00BCD4] disabled:opacity-40 text-[#0F1E36] flex items-center justify-center transition-all cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Compact What-If Simulation Strip (Clean Look, No Verbose Text) */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Simulate:</span>
                  <span className="text-[#00CEE6]">
                    +{simulatedDays} Days
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={simulatedDays}
                  onChange={(e) => setSimulatedDays(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00CEE6]"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIncludeMakeUpLabs(!includeMakeUpLabs)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    includeMakeUpLabs
                      ? "bg-[#00CEE6]/20 border-[#00CEE6] text-[#00CEE6]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  +10 Lab
                </button>
                <button
                  type="button"
                  onClick={() => setIncludeODWaiver(!includeODWaiver)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                    includeODWaiver
                      ? "bg-[#825FEF]/25 border-[#825FEF] text-[#C4B5FD]"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  +12 OD
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex items-center justify-end gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <div className="text-right">
                <span className="text-lg font-black text-[#00CEE6] tracking-tight">
                  {projectedRate.toFixed(1)}%
                </span>
              </div>
              <div
                className={`px-2.5 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 ${
                  projectedRate >= 75
                    ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/40"
                    : "bg-amber-500/25 text-amber-300 border border-amber-400/40"
                }`}
              >
                {projectedRate >= 75 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Eligible</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#F59E0B] shrink-0" />
                    <span>{(75 - projectedRate).toFixed(1)}% Deficit</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* ======================================================== */}
      {/* DISPUTE REGULARIZATION MODAL: PEBBLE SLATE THEME         */}
      {/* ======================================================== */}
      {isDisputeModalOpen && selectedDisputePeriod && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] max-w-2xl sm:max-w-3xl w-full p-6 sm:p-8 border-2 border-slate-300/80 shadow-[0_25px_60px_-15px_rgba(17,35,61,0.25),inset_0_2px_4px_rgba(255,255,255,0.95)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Ambient pebble glow inside dispute modal */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#825FEF]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 sm:space-y-5">
              {/* Header: Clean, professional, no warning hazard logos */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                    <img
                      src="/brand/icons/attendance-light.png"
                      alt="Regularization"
                      className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(0,210,234,0.5)]"
                    />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#11233D] tracking-tight">
                      Attendance Regularization
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Dispute & permission verification
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDisputeModalOpen(false)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-[#11233D] border border-slate-200/80 flex items-center justify-center shadow-2xs transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isDisputeSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-[22px] border-2 border-emerald-300 flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-black text-[#11233D]">
                      Dispute Ticket Dispatched
                    </h4>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium">
                      Your correction ticket for <span className="font-bold text-[#11233D]">{selectedDisputePeriod.subjectCode}</span> has been routed to <span className="font-bold text-[#11233D]">{selectedDisputePeriod.faculty}</span> for biometric cross-audit.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="px-6 py-2.5 rounded-full text-xs font-black bg-[#11233D] hover:bg-[#1A365D] text-white transition-all cursor-pointer shadow-sm"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Period Details Pebble Card - Minimal text */}
                  <div className="p-4 bg-white/90 rounded-[22px] border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[14px] bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xs text-[#11233D] shrink-0">
                        P{selectedDisputePeriod.periodNumber}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#11233D]">
                            {selectedDisputePeriod.subjectCode}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-slate-800">
                            {selectedDisputePeriod.subjectName}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {selectedDisputePeriod.time} · {selectedDisputePeriod.room} · {selectedDisputePeriod.faculty}
                        </div>
                      </div>
                    </div>
                    <span className="self-start sm:self-center px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black">
                      Marked Absent
                    </span>
                  </div>

                  {/* Student Types Exact Reason */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">
                      Reason for Regularization
                    </label>
                    <input
                      type="text"
                      value={disputeReason}
                      onChange={(e) => setDisputeReason(e.target.value)}
                      placeholder="Type your exact reason (e.g., Biometric sensor glitch at Gate 2)..."
                      className="w-full text-xs sm:text-sm font-bold p-3.5 sm:p-4 rounded-[20px] border-2 border-slate-200/80 bg-white/95 text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#00CEE6] focus:ring-2 focus:ring-[#00CEE6]/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] transition-all"
                    />
                    {/* Quick Suggestion Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2">
                      {[
                        "Biometric Turnstile Glitch",
                        "Campus Hackathon / On-Duty",
                        "Medical Exemption",
                        "Late Punch (Within 5 mins)",
                      ].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setDisputeReason(chip)}
                          className={`text-[11px] font-bold px-3 py-1 rounded-full border transition-all cursor-pointer ${
                            disputeReason === chip
                              ? "bg-[#11233D] text-white border-[#11233D] shadow-xs"
                              : "bg-white/80 text-slate-600 hover:text-[#11233D] border-slate-200 hover:bg-white"
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload Proofs of Permission / Medical Slip */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">
                      Attach Permission Proof / Slip
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    />

                    {uploadedProof ? (
                      <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-[22px] bg-emerald-50/90 border-2 border-emerald-300 text-xs font-bold text-emerald-900 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="block font-black text-[#11233D] truncate max-w-sm sm:max-w-md">
                              {uploadedProof.name}
                            </span>
                            <span className="text-[11px] text-emerald-700 font-semibold">
                              {uploadedProof.size} · Upload Ready
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setUploadedProof(null)}
                          className="text-xs font-black text-rose-600 hover:text-rose-800 px-3 py-1.5 rounded-full hover:bg-rose-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="p-5 sm:p-6 rounded-[22px] border-2 border-dashed border-slate-300 hover:border-[#00CEE6] bg-white/70 hover:bg-white transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 group-hover:bg-[#00CEE6]/10 text-slate-500 group-hover:text-[#00CEE6] flex items-center justify-center transition-all mb-1.5 shadow-2xs">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="text-xs sm:text-sm font-black text-[#11233D] group-hover:text-[#00CEE6] transition-colors">
                          Click to Upload Permission Slip or Medical Proof
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400 mt-0.5">
                          PDF, PNG, JPG up to 10MB
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Remarks Notes with Pebble Styling */}
                  <div>
                    <label className="text-xs font-black text-slate-700 block mb-1.5 uppercase tracking-wider">
                      Remarks (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={disputeNotes}
                      onChange={(e) => setDisputeNotes(e.target.value)}
                      className="w-full text-xs sm:text-sm font-medium p-3.5 sm:p-4 rounded-[20px] border-2 border-slate-200/80 bg-white/95 text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#00CEE6] focus:ring-2 focus:ring-[#00CEE6]/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)] transition-all resize-none"
                      placeholder="Add any specific details for faculty audit..."
                    />
                  </div>

                  {/* Bulky Pebble Action Buttons */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsDisputeModalOpen(false)}
                      className="px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black text-slate-600 hover:text-[#11233D] bg-white/80 hover:bg-white border border-slate-200/80 shadow-2xs transition-all cursor-pointer active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDispute}
                      className="px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-black bg-[#11233D] hover:bg-[#1A365D] text-white border border-white/10 shadow-[0_4px_14px_rgba(17,35,61,0.25)] flex items-center gap-2 group transition-all cursor-pointer active:scale-95"
                    >
                      <span>Submit Ticket</span>
                      <ArrowUpRight className="w-4 h-4 text-[#00CEE6] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BIG ACADEMIC CALENDAR POP-UP SCREEN                      */}
      {/* ======================================================== */}
      {isBigCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#EDE8F5] rounded-[36px] sm:rounded-[44px] max-w-3xl w-full p-5 sm:p-8 border-2 border-slate-300/80 shadow-[0_25px_60px_-15px_rgba(17,35,61,0.3),inset_0_2px_4px_rgba(255,255,255,1)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#825FEF]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Header with Sidebar Calendar Brand Logo */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                    <img
                      src="/brand/icons/attendance-light.png"
                      alt="Academic Calendar"
                      className="w-8 h-8 object-contain drop-shadow-[0_0_8px_rgba(0,210,234,0.5)]"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#11233D] tracking-tight">
                      Academic Calendar
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      NEC · III B.Tech [CSE - C6]
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBigCalendarOpen(false)}
                  className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-500 hover:text-[#11233D] border border-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Month Switcher Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {academicMonths.map((m) => {
                  const isSelected = selectedYear === m.year && selectedMonth === m.month;
                  return (
                    <button
                      key={`${m.year}-${m.month}`}
                      type="button"
                      onClick={() => handleSelectMonth(m.year, m.month)}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-2 border select-none ${
                        isSelected
                          ? "bg-[#11233D] text-white border-[#11233D] shadow-md scale-[1.02]"
                          : "bg-white/80 hover:bg-white text-slate-600 hover:text-[#11233D] border-slate-200/80 shadow-2xs"
                      }`}
                    >
                      <span>{m.name} {m.year}</span>
                      {m.tag && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isSelected
                              ? "bg-[#00CEE6]/20 text-[#00CEE6]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {m.tag}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 7-Column Calendar Grid */}
              <div className="bg-white/80 rounded-[28px] p-4 sm:p-5 border border-slate-200/80 shadow-2xs">
                {/* Day of Week Headers (Mon - Sun) */}
                <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-black">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => (
                    <div
                      key={day}
                      className={`py-1.5 rounded-xl uppercase tracking-wider text-[11px] ${
                        idx === 6 ? "text-rose-500 bg-rose-50/60" : "text-slate-600 bg-slate-100/60"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days Matrix */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {fullCalendarDays.map((item, idx) => {
                    if (!item.dayNum) {
                      return <div key={`empty-${idx}`} className="h-14 sm:h-16" />;
                    }

                    const isSunday = item.isSunday;
                    const isSelected = selectedDateId === item.dateId;
                    const isToday = item.isToday;

                    if (isSunday) {
                      return (
                        <div
                          key={item.dateId || idx}
                          className="h-14 sm:h-16 rounded-[18px] bg-rose-50/40 border border-rose-100 flex flex-col items-center justify-center text-center p-1 cursor-not-allowed opacity-60"
                        >
                          <span className="text-xs sm:text-sm font-extrabold text-rose-400">
                            {item.dayNum}
                          </span>
                          <span className="text-[9px] font-bold text-rose-300">Holiday</span>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={item.dateId}
                        type="button"
                        onClick={() => handleSelectDateFromCalendar(item.dateId!)}
                        className={`h-14 sm:h-16 rounded-[18px] transition-all flex flex-col items-center justify-center p-1 cursor-pointer select-none group relative border ${
                          isSelected
                            ? "bg-[#11233D] text-white border-[#00CEE6] shadow-md shadow-[#11233D]/25 scale-[1.03] z-10"
                            : isToday
                            ? "bg-[#EDE8F5] hover:bg-[#E5DEF0] text-[#11233D] border-[#825FEF]/50 ring-1 ring-[#825FEF]/30"
                            : "bg-white hover:bg-slate-50 text-slate-700 hover:text-[#11233D] border-slate-200/80 hover:border-slate-300 shadow-2xs"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs sm:text-sm font-black">
                            {item.dayNum}
                          </span>
                          {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#825FEF]" />
                          )}
                        </div>
                        <span
                          className={`text-[9px] font-bold truncate max-w-full px-1 ${
                            isSelected
                              ? "text-[#00CEE6]"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                        >
                          {item.timetableKey === "tue"
                            ? "Flutter"
                            : item.timetableKey === "thu"
                            ? "Tech Lab"
                            : item.timetableKey === "sat"
                            ? "FSD-2"
                            : "7 Periods"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer info & Legend */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs font-bold text-slate-500">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#11233D] border border-[#00CEE6]" />
                    <span>Selected Date</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#825FEF]" />
                    <span>Today (Oct 13)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <span>Sunday (No Class)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectMonth(2026, 9);
                      handleSelectDateFromCalendar("2026-10-13");
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition-all cursor-pointer"
                  >
                    Go to Today
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBigCalendarOpen(false)}
                    className="px-4 py-1.5 rounded-full bg-[#11233D] text-white hover:bg-[#1A365D] text-xs font-black transition-all cursor-pointer shadow-2xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
