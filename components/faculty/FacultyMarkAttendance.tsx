"use client";

import React, { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Search,
  Users,
  Check,
  X,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  MapPin,
  Layers,
} from "lucide-react";

interface FacultyMarkAttendanceProps {
  onNavigate?: (tab: string) => void;
}

type AttendanceStatus = "P" | "A" | null;

interface StudentAttendance {
  roll: string;
  name: string;
  status: AttendanceStatus;
  overallAttendance: number;
}

interface FacultySession {
  periodNumber: number;
  periodLabel: string;
  time: string;
  type: "Lecture" | "Lab" | "Tutorial" | "Remedial";
  room: string;
  topic: string;
}

const INITIAL_STUDENTS: StudentAttendance[] = [
  { roll: "21BCE1001", name: "Meera Krishnan", status: null, overallAttendance: 91.0 },
  { roll: "21BCE1012", name: "Karthik Raja", status: null, overallAttendance: 74.0 },
  { roll: "21BCE1034", name: "Divya Menon", status: null, overallAttendance: 80.0 },
  { roll: "21BCE1042", name: "Rohan Sharma", status: null, overallAttendance: 88.0 },
  { roll: "21BCE1064", name: "Ananya V.", status: null, overallAttendance: 68.4 },
  { roll: "21BCE1089", name: "Priya Nair", status: null, overallAttendance: 82.5 },
  { roll: "21BCE1105", name: "Vikram Patel", status: null, overallAttendance: 59.2 },
  { roll: "21BCE1120", name: "Aditya S.", status: null, overallAttendance: 86.0 },
  { roll: "21BCE1135", name: "Sneha Reddy", status: null, overallAttendance: 77.5 },
  { roll: "21BCE1150", name: "Rahul Verma", status: null, overallAttendance: 84.0 },
  { roll: "21BCE1178", name: "Siddharth Verma", status: null, overallAttendance: 54.0 },
  { roll: "21BCE1192", name: "Kavya Murthy", status: null, overallAttendance: 89.5 },
];

// Department Timetable mapping for CS301 (Data Structures & Algorithms) · CSE-A
const FACULTY_TIMETABLE: Record<string, FacultySession[]> = {
  mon: [
    {
      periodNumber: 2,
      periodLabel: "Period 2",
      time: "10:00 - 10:50 AM",
      type: "Lecture",
      room: "Class Room 304",
      topic: "Binary Search Trees & Rebalancing",
    },
    {
      periodNumber: 6,
      periodLabel: "Period 6",
      time: "02:20 - 03:10 PM",
      type: "Tutorial",
      room: "Class Room 304",
      topic: "AVL Tree Rotations Problem Set",
    },
  ],
  tue: [
    {
      periodNumber: 2,
      periodLabel: "Period 2",
      time: "10:00 - 10:50 AM",
      type: "Lecture",
      room: "Class Room 304",
      topic: "Red-Black Trees & Properties",
    },
    {
      periodNumber: 5,
      periodLabel: "Periods 5-7 (Lab)",
      time: "01:30 - 04:00 PM",
      type: "Lab",
      room: "Advanced Computing Lab 3",
      topic: "DSA Hands-on: Graph Representation & DFS/BFS",
    },
  ],
  wed: [
    {
      periodNumber: 2,
      periodLabel: "Period 2",
      time: "10:00 - 10:50 AM",
      type: "Lecture",
      room: "Class Room 304",
      topic: "B-Trees & Multiway Search Indexing",
    },
  ],
  thu: [
    {
      periodNumber: 1,
      periodLabel: "Period 1",
      time: "09:10 - 10:00 AM",
      type: "Lecture",
      room: "Class Room 304",
      topic: "Shortest Path Algorithms: Dijkstra & Bellman-Ford",
    },
  ],
  fri: [
    {
      periodNumber: 2,
      periodLabel: "Period 2",
      time: "10:00 - 10:50 AM",
      type: "Lecture",
      room: "Class Room 304",
      topic: "Minimum Spanning Trees: Kruskal & Prim",
    },
    {
      periodNumber: 6,
      periodLabel: "Period 6",
      time: "02:20 - 03:10 PM",
      type: "Tutorial",
      room: "Class Room 304",
      topic: "Dynamic Programming on Trees",
    },
  ],
  sat: [
    {
      periodNumber: 1,
      periodLabel: "Period 1",
      time: "09:10 - 10:00 AM",
      type: "Lecture",
      room: "Class Room 304",
      topic: "Trie Data Structure & Fast Autocomplete",
    },
    {
      periodNumber: 4,
      periodLabel: "Period 4",
      time: "11:50 - 12:40 PM",
      type: "Remedial",
      room: "Class Room 304",
      topic: "Remedial Lab for Borderline Students",
    },
  ],
  sun: [],
};

const ACADEMIC_MONTHS = [
  { name: "October", month: 9, year: 2026, tag: "Current" },
  { name: "November", month: 10, year: 2026, tag: "Mid-Term" },
  { name: "December", month: 11, year: 2026, tag: "Sem Finals" },
];

export default function FacultyMarkAttendance({ onNavigate }: FacultyMarkAttendanceProps) {
  // Calendar and Date Selection State
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [selectedDateId, setSelectedDateId] = useState<string>("2026-10-13"); // Default Today: Oct 13, 2026
  const [dateOffset, setDateOffset] = useState<number>(9); // Default to around Oct 12-15
  const [activePeriodIndex, setActivePeriodIndex] = useState<number>(0);
  const [isBigCalendarOpen, setIsBigCalendarOpen] = useState(false);

  // Multi-date attendance records map: key `${dateId}_p${periodNumber}` -> record of roll to status
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, Record<string, AttendanceStatus>>>(() => {
    // Seed realistic past records
    const seed: Record<string, Record<string, AttendanceStatus>> = {};

    // Oct 12 Period 2 (Monday - already synced)
    seed["2026-10-12_p2"] = {
      "21BCE1001": "P",
      "21BCE1012": "P",
      "21BCE1034": "P",
      "21BCE1042": "P",
      "21BCE1064": "A",
      "21BCE1089": "P",
      "21BCE1105": "A",
      "21BCE1120": "P",
      "21BCE1135": "P",
      "21BCE1150": "P",
      "21BCE1178": "A",
      "21BCE1192": "P",
    };

    // Oct 09 Period 2 (Friday - already synced)
    seed["2026-10-09_p2"] = {
      "21BCE1001": "P",
      "21BCE1012": "P",
      "21BCE1034": "P",
      "21BCE1042": "P",
      "21BCE1064": "P",
      "21BCE1089": "P",
      "21BCE1105": "A",
      "21BCE1120": "P",
      "21BCE1135": "P",
      "21BCE1150": "P",
      "21BCE1178": "A",
      "21BCE1192": "P",
    };

    return seed;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UNMARKED" | "P" | "A">("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Month date generator
  const currentMonthDates = useMemo(() => {
    const dates: Array<{
      id: string;
      label: string;
      dayOfWeek: number;
      timetableKey: string;
      dayName: string;
      dateFormatted: string;
      isSunday: boolean;
    }> = [];

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const daysCount = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    for (let d = 1; d <= daysCount; d++) {
      const dateObj = new Date(selectedYear, selectedMonth, d);
      const dow = dateObj.getDay();
      const isSunday = dow === 0;
      const dayKey = dayKeys[dow];
      const monthStr = monthNames[selectedMonth];
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const id = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${dayStr}`;

      dates.push({
        id,
        label: `${monthStr} ${dayStr}`,
        dayOfWeek: dow,
        timetableKey: dayKey,
        dayName: fullDayNames[dow],
        dateFormatted: `${fullDayNames[dow]}, ${monthStr} ${d}, ${selectedYear}`,
        isSunday,
      });
    }

    return dates;
  }, [selectedYear, selectedMonth]);

  // Full calendar matrix generator for the big calendar pop-up
  const fullCalendarDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const firstDayOfWeek = new Date(selectedYear, selectedMonth, 1).getDay();
    // Monday as first column (0 = Monday, 6 = Sunday)
    const startPadding = (firstDayOfWeek + 6) % 7;

    const days: Array<{
      dayNum?: number;
      isSunday?: boolean;
      dateId?: string;
      isToday?: boolean;
      timetableKey?: string;
      sessionsCount?: number;
      primarySessionLabel?: string;
    }> = [];

    for (let p = 0; p < startPadding; p++) {
      days.push({});
    }

    const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(selectedYear, selectedMonth, d);
      const dow = dateObj.getDay();
      const isSunday = dow === 0;
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const dateId = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${dayStr}`;
      const isToday = selectedYear === 2026 && selectedMonth === 9 && d === 13;
      const tKey = dayKeys[dow];
      const sessions = isSunday ? [] : FACULTY_TIMETABLE[tKey] || [];

      days.push({
        dayNum: d,
        isSunday,
        dateId,
        isToday,
        timetableKey: tKey,
        sessionsCount: sessions.length,
        primarySessionLabel: sessions[0]?.periodLabel || (isSunday ? "Holiday" : "No Class"),
      });
    }

    return days;
  }, [selectedYear, selectedMonth]);

  // Selected date object
  const activeDateItem = useMemo(() => {
    return currentMonthDates.find((d) => d.id === selectedDateId) || currentMonthDates[0];
  }, [currentMonthDates, selectedDateId]);

  // Available sessions for the selected day
  const availableSessions = useMemo(() => {
    if (!activeDateItem || activeDateItem.isSunday) return [];
    return FACULTY_TIMETABLE[activeDateItem.timetableKey] || [];
  }, [activeDateItem]);

  // Active session object
  const currentSession = availableSessions[activePeriodIndex] || availableSessions[0] || null;

  // Key for current date + session
  const currentSessionKey = useMemo(() => {
    if (!activeDateItem) return "default";
    const pNum = currentSession?.periodNumber || 1;
    return `${activeDateItem.id}_p${pNum}`;
  }, [activeDateItem, currentSession]);

  // Working student list reflecting the active date's attendance
  const studentsWithStatus: StudentAttendance[] = useMemo(() => {
    const activeSessionRecord = attendanceRecords[currentSessionKey] || {};
    return INITIAL_STUDENTS.map((st) => ({
      ...st,
      status: activeSessionRecord[st.roll] !== undefined ? activeSessionRecord[st.roll] : null,
    }));
  }, [attendanceRecords, currentSessionKey]);

  // Statistics for current session
  const total = studentsWithStatus.length;
  const presentCount = studentsWithStatus.filter((s) => s.status === "P").length;
  const absentCount = studentsWithStatus.filter((s) => s.status === "A").length;
  const unmarkedCount = studentsWithStatus.filter((s) => s.status === null).length;
  const markedCount = presentCount + absentCount;

  // Handlers
  const handleSelectDateFromCalendar = (dateId: string) => {
    setSelectedDateId(dateId);
    setActivePeriodIndex(0);
    const idx = currentMonthDates.findIndex((d) => d.id === dateId);
    if (idx >= 0) {
      const newOffset = Math.floor(idx / 4) * 4;
      setDateOffset(Math.min(Math.max(0, currentMonthDates.length - 4), newOffset));
    }
    setIsBigCalendarOpen(false);
  };

  const handlePrevDates = () => {
    const newOffset = Math.max(0, dateOffset - 4);
    setDateOffset(newOffset);
    if (currentMonthDates[newOffset]) {
      setSelectedDateId(currentMonthDates[newOffset].id);
      setActivePeriodIndex(0);
    }
  };

  const handleNextDates = () => {
    const nextOffset = Math.min(Math.max(0, currentMonthDates.length - 4), dateOffset + 4);
    setDateOffset(nextOffset);
    if (currentMonthDates[nextOffset]) {
      setSelectedDateId(currentMonthDates[nextOffset].id);
      setActivePeriodIndex(0);
    }
  };

  const visibleDates = currentMonthDates.slice(dateOffset, dateOffset + 4);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const setSingleStatus = (roll: string, status: "P" | "A") => {
    setAttendanceRecords((prev) => {
      const currentMap = prev[currentSessionKey] || {};
      return {
        ...prev,
        [currentSessionKey]: {
          ...currentMap,
          [roll]: status,
        },
      };
    });
  };

  const markAllPresent = () => {
    const newMap: Record<string, AttendanceStatus> = {};
    INITIAL_STUDENTS.forEach((s) => {
      newMap[s.roll] = "P";
    });
    setAttendanceRecords((prev) => ({
      ...prev,
      [currentSessionKey]: newMap,
    }));
    showToast("All students marked Present");
  };

  const markAllAbsent = () => {
    const newMap: Record<string, AttendanceStatus> = {};
    INITIAL_STUDENTS.forEach((s) => {
      newMap[s.roll] = "A";
    });
    setAttendanceRecords((prev) => ({
      ...prev,
      [currentSessionKey]: newMap,
    }));
    showToast("All students marked Absent");
  };

  const resetAllMarkings = () => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [currentSessionKey]: {},
    }));
    showToast("Attendance reset to unmarked");
  };

  const handleSubmit = () => {
    if (markedCount === 0) {
      showToast("Please mark attendance before submitting");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(
        `Attendance synchronized to SIS · ${activeDateItem?.dateFormatted} (${currentSession?.periodLabel || "Session"}) · ${presentCount} P, ${absentCount} A`
      );
    }, 700);
  };

  const filteredStudents = studentsWithStatus.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roll.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "UNMARKED"
        ? s.status === null
        : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isTodayActive = selectedDateId === "2026-10-13";
  const isSunday = activeDateItem?.isSunday;

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-[#11233D] text-white px-5 py-3.5 rounded-2xl shadow-2xl border-2 border-[#00CEE6]/40 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-[#00CEE6] shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. TOP BAR: TACTILE DATE SWITCHER & CALENDAR SELECTOR   */}
      {/* ======================================================== */}
      <div className="bg-white/90 backdrop-blur-md rounded-[32px] p-4 sm:p-5 border-2 border-slate-200/80 shadow-[0_4px_20px_rgba(17,35,61,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Standalone Calendar Trigger + 4-Date Switching Strip */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Big Standalone Calendar Button (Mirrors Student Attendance) */}
          <button
            type="button"
            onClick={() => setIsBigCalendarOpen(true)}
            title="Open Academic Calendar (Select Date)"
            className="h-14 sm:h-15 w-14 sm:w-15 rounded-[22px] sm:rounded-[26px] bg-[#11233D] hover:bg-[#1A365D] text-white border-2 border-slate-300 shadow-[0_4px_14px_rgba(17,35,61,0.2)] flex flex-col items-center justify-center transition-all cursor-pointer group shrink-0 active:scale-95"
          >
            <Calendar className="w-6 h-6 text-[#00CEE6] group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-wider mt-0.5">
              Dates
            </span>
          </button>

          {/* Tactile 4-Date Switching Bar */}
          <div className="h-14 sm:h-15 bg-[#EFF4F7] p-1.5 rounded-full border-2 border-slate-200/90 shadow-inner flex items-center gap-1.5 w-full max-w-[420px]">
            {/* Prev Dates Arrow */}
            <button
              type="button"
              onClick={handlePrevDates}
              disabled={dateOffset === 0}
              title="Previous 4 dates"
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* 4 Visible Date Pills */}
            <div className="flex-1 grid grid-cols-4 gap-1">
              {visibleDates.map((dateItem) => {
                const isSelected = selectedDateId === dateItem.id;
                const isCurrentToday = dateItem.id === "2026-10-13";

                return (
                  <button
                    key={dateItem.id}
                    type="button"
                    onClick={() => {
                      setSelectedDateId(dateItem.id);
                      setActivePeriodIndex(0);
                    }}
                    className={`h-10 px-1 rounded-full text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center text-center select-none ${
                      isSelected
                        ? "bg-[#11233D] text-white shadow-md border border-[#00CEE6] scale-[1.04]"
                        : isCurrentToday
                        ? "bg-white text-[#825FEF] border border-[#825FEF]/40 hover:bg-white"
                        : "text-slate-600 hover:text-[#11233D] hover:bg-white/80 border border-transparent"
                    }`}
                  >
                    <span className="text-[11px] leading-tight truncate">{dateItem.label}</span>
                    <span
                      className={`text-[8px] font-bold uppercase tracking-wider ${
                        isSelected
                          ? "text-[#00CEE6]"
                          : isCurrentToday
                          ? "text-[#825FEF]"
                          : "text-slate-400"
                      }`}
                    >
                      {dateItem.isSunday ? "Sun" : dateItem.timetableKey}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Next Dates Arrow */}
            <button
              type="button"
              onClick={handleNextDates}
              disabled={dateOffset + 4 >= currentMonthDates.length}
              title="Next 4 dates"
              className="w-10 h-10 rounded-full bg-white hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed flex items-center justify-center shrink-0 border border-slate-200 shadow-2xs transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right: Date Context + Period Switcher (if multi-period) */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {availableSessions.length > 1 && (
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
              {availableSessions.map((session, sIdx) => {
                const isSelectedPeriod = activePeriodIndex === sIdx;
                return (
                  <button
                    key={session.periodNumber}
                    type="button"
                    onClick={() => setActivePeriodIndex(sIdx)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer text-xs flex items-center gap-1.5 ${
                      isSelectedPeriod
                        ? "bg-[#11233D] text-white shadow-xs font-black"
                        : "text-slate-600 hover:text-[#11233D]"
                    }`}
                  >
                    <span>{session.periodLabel}</span>
                    <span
                      className={`text-[9px] px-1 rounded-full ${
                        isSelectedPeriod ? "bg-[#00CEE6]/25 text-[#00CEE6]" : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {session.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Quick Date Display Badge */}
          <div className="text-right hidden sm:block">
            <span className="text-xs font-black text-[#11233D] block">
              {activeDateItem?.dateFormatted}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {isSunday ? "Sunday · No Class Scheduled" : currentSession?.time || "Timetable Slot"}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. HEADER BANNER: COURSE & ACTIVE SESSION CONTEXT        */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-7 rounded-[32px] bg-gradient-to-r from-[#11233D] via-[#1A2E4C] to-[#11233D] text-white border-2 border-slate-700/60 shadow-[0_12px_36px_rgba(17,35,61,0.2)] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#825FEF]/25 text-[#825FEF] border border-[#825FEF]/40">
              Classroom Attendance Sheet
            </span>
            <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Calendar className="w-3 h-3 text-[#00CEE6]" />
              {isTodayActive ? "Today · Oct 13" : activeDateItem?.dateFormatted}
            </span>
            {!isSunday && currentSession && (
              <span className="text-[10px] font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#00CEE6]" />
                {currentSession.periodLabel} ({currentSession.time})
              </span>
            )}
            {isSunday && (
              <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-400/30">
                Institutional Holiday
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Data Structures & Algorithms
          </h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Course: CS301 · Section: CSE-A · Room: {currentSession?.room || "Class Room 304"} · Faculty: Prof. Rajesh Kumar
          </p>
          {currentSession?.topic && !isSunday && (
            <p className="text-[11px] text-[#00CEE6] mt-1 font-bold flex items-center gap-1">
              <BookOpen className="w-3 h-3 shrink-0" />
              <span>Topic: {currentSession.topic}</span>
            </p>
          )}
        </div>

        {/* Quick Batch Actions */}
        {!isSunday && (
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={markAllPresent}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-emerald-500/20 hover:border-emerald-400 text-white text-xs font-extrabold transition-all border border-white/15 cursor-pointer shadow-xs"
            >
              All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-400 text-white text-xs font-extrabold transition-all border border-white/15 cursor-pointer shadow-xs"
            >
              All Absent
            </button>
            <button
              onClick={resetAllMarkings}
              title="Reset to unmarked"
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold transition-all border border-white/15 cursor-pointer shadow-xs flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 text-slate-300" />
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-2xl bg-[#825FEF] hover:bg-[#724EE0] text-white text-xs font-extrabold transition-all shadow-[0_4px_16px_rgba(130,95,239,0.35)] cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Syncing..." : "Submit to SIS"}</span>
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. SUNDAY / HOLIDAY CALLOUT OR KPI PODS                  */}
      {/* ======================================================== */}
      {isSunday ? (
        <div className="p-8 rounded-[32px] bg-rose-50/50 border-2 border-rose-200 text-center space-y-2">
          <Calendar className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-black text-[#11233D]">Sunday — Campus Closed</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No regular lectures or lab sessions are scheduled on Sundays. Please select a working day (Monday – Saturday) from the calendar or date bar.
          </p>
          <button
            type="button"
            onClick={() => handleSelectDateFromCalendar("2026-10-13")}
            className="mt-3 px-5 py-2 rounded-full bg-[#11233D] text-white text-xs font-bold hover:bg-[#825FEF] transition-all cursor-pointer"
          >
            Jump to Today (Tuesday, Oct 13)
          </button>
        </div>
      ) : (
        <>
          {/* KPI Pods: Total, Present, Absent, Unmarked */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
            {/* Total Enrolled */}
            <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
                  Enrolled
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#11233D]">{total}</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-[#11233D] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Present Pod */}
            <div className="p-5 rounded-[24px] bg-white border-2 border-emerald-200/90 shadow-[0_4px_16px_rgba(16,185,129,0.06)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-emerald-700 block uppercase tracking-wider">
                  Present
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">{presentCount}</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            {/* Absent Pod */}
            <div className="p-5 rounded-[24px] bg-white border-2 border-rose-200/90 shadow-[0_4px_16px_rgba(244,63,94,0.06)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-rose-700 block uppercase tracking-wider">
                  Absent
                </span>
                <span className="text-2xl sm:text-3xl font-black text-rose-600">{absentCount}</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Unmarked / Pending Pod */}
            <div className="p-5 rounded-[24px] bg-white border-2 border-slate-200/80 shadow-[0_4px_16px_rgba(17,35,61,0.04)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-extrabold text-slate-400 block uppercase tracking-wider">
                  Unmarked
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-600">
                  {unmarkedCount}
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black text-xs">
                {markedCount}/{total}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 4. CLASSROOM ATTENDANCE TABLE CARD                       */}
          {/* ======================================================== */}
          <div className="bg-white rounded-[32px] border-2 border-slate-200/90 shadow-[0_4px_24px_rgba(15,23,42,0.05)] p-6 sm:p-7">
            {/* Controls Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search student or roll number..."
                    className="pl-10 pr-4 py-2 rounded-2xl border-2 border-slate-200 text-xs text-[#11233D] placeholder-slate-400 focus:outline-none focus:border-[#825FEF] w-56 sm:w-72 bg-slate-50/50"
                  />
                </div>

                {/* Filter Tabs: All / Unmarked / Present / Absent */}
                <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("ALL")}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                      statusFilter === "ALL"
                        ? "bg-white text-[#11233D] shadow-xs font-black"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    All ({total})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("UNMARKED")}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                      statusFilter === "UNMARKED"
                        ? "bg-white text-[#11233D] shadow-xs font-black"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Unmarked ({unmarkedCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("P")}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                      statusFilter === "P"
                        ? "bg-emerald-600 text-white shadow-xs font-black"
                        : "text-slate-500 hover:text-emerald-700"
                    }`}
                  >
                    Present ({presentCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("A")}
                    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer text-xs ${
                      statusFilter === "A"
                        ? "bg-rose-600 text-white shadow-xs font-black"
                        : "text-slate-500 hover:text-rose-700"
                    }`}
                  >
                    Absent ({absentCount})
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-bold self-end sm:self-auto">
                Showing {filteredStudents.length} of {total} Students
              </div>
            </div>

            {/* Student Roster: Big, High-Visibility Attendance Buttons */}
            <div className="divide-y divide-slate-100 mt-3">
              {filteredStudents.map((st) => {
                const isPresent = st.status === "P";
                const isAbsent = st.status === "A";

                return (
                  <div
                    key={st.roll}
                    className="py-4 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 rounded-2xl transition-all"
                  >
                    {/* Student Identity - Clean & Neutral */}
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-sm shrink-0 border-2 border-slate-200 shadow-2xs">
                        {st.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-black text-[#11233D] truncate">
                          {st.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs font-bold text-slate-400">
                            {st.roll}
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] font-bold text-slate-500">
                            {st.overallAttendance}% Course Avg
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Big, Clear, High-Visibility 2-Field Marking Controls */}
                    <div className="grid grid-cols-2 gap-3 w-full sm:w-auto shrink-0">
                      {/* PRESENT Big Button */}
                      <button
                        type="button"
                        onClick={() => setSingleStatus(st.roll, "P")}
                        className={`h-12 sm:h-13 px-5 sm:px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none ${
                          isPresent
                            ? "bg-emerald-600 text-white shadow-[0_6px_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500 scale-[1.02]"
                            : "bg-slate-100 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border-2 border-transparent hover:border-emerald-200"
                        }`}
                        title="Mark Present"
                      >
                        <Check className={`w-5 h-5 stroke-[2.5] ${isPresent ? "text-white" : "text-slate-400"}`} />
                        <span>PRESENT</span>
                      </button>

                      {/* ABSENT Big Button */}
                      <button
                        type="button"
                        onClick={() => setSingleStatus(st.roll, "A")}
                        className={`h-12 sm:h-13 px-5 sm:px-6 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer select-none ${
                          isAbsent
                            ? "bg-rose-600 text-white shadow-[0_6px_20px_rgba(244,63,94,0.35)] ring-2 ring-rose-500 scale-[1.02]"
                            : "bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-700 border-2 border-transparent hover:border-rose-200"
                        }`}
                        title="Mark Absent"
                      >
                        <X className={`w-5 h-5 stroke-[2.5] ${isAbsent ? "text-white" : "text-slate-400"}`} />
                        <span>ABSENT</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredStudents.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm font-bold text-slate-400">
                  No students found matching your criteria.
                </p>
              </div>
            )}

            {/* Bottom Synchronization Bar */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span>
                  Date: <strong className="text-[#11233D] font-bold">{activeDateItem?.dateFormatted}</strong> ·{" "}
                  Marked: <strong className="text-emerald-700 font-black">{presentCount} Present</strong>,{" "}
                  <strong className="text-rose-700 font-black">{absentCount} Absent</strong>
                  {unmarkedCount > 0 && (
                    <> · <strong className="text-slate-600 font-bold">{unmarkedCount} Unmarked</strong></>
                  )}
                </span>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#11233D] hover:bg-[#825FEF] text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#00CEE6]" />
                <span>Confirm & Sync Attendance</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* ======================================================== */}
      {/* 5. ACADEMIC CALENDAR POP-UP SCREEN (REFERENCE FROM STUDENT) */}
      {/* ======================================================== */}
      {isBigCalendarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-[#F8FAFC] via-white to-[#EDE8F5] rounded-[36px] sm:rounded-[44px] max-w-3xl w-full p-5 sm:p-8 border-2 border-slate-300/80 shadow-[0_25px_60px_-15px_rgba(17,35,61,0.3),inset_0_2px_4px_rgba(255,255,255,1)] relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            {/* Ambient glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#00CEE6]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#825FEF]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Header with Calendar Icon and Title */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#11233D] text-[#00CEE6] border border-slate-200 shadow-sm flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#11233D] tracking-tight">
                      Faculty Academic Calendar
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Timetable Schedule · CS301: Data Structures & Algorithms · CSE-A
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
                {ACADEMIC_MONTHS.map((m) => {
                  const isSelectedMonth = selectedYear === m.year && selectedMonth === m.month;
                  return (
                    <button
                      key={`${m.year}-${m.month}`}
                      type="button"
                      onClick={() => {
                        setSelectedYear(m.year);
                        setSelectedMonth(m.month);
                      }}
                      className={`px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer shrink-0 flex items-center gap-2 border select-none ${
                        isSelectedMonth
                          ? "bg-[#11233D] text-white border-[#11233D] shadow-md scale-[1.02]"
                          : "bg-white/80 hover:bg-white text-slate-600 hover:text-[#11233D] border-slate-200/80 shadow-2xs"
                      }`}
                    >
                      <span>{m.name} {m.year}</span>
                      {m.tag && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isSelectedMonth
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

              {/* 7-Column Calendar Grid (Monday - Sunday) */}
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

                    const isSun = item.isSunday;
                    const isSelected = selectedDateId === item.dateId;
                    const isToday = item.isToday;

                    if (isSun) {
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
                          {item.primarySessionLabel}
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
                    <span>Sunday (Holiday)</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedYear(2026);
                      setSelectedMonth(9);
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
