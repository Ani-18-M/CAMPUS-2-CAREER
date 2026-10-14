"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Home,
  Compass,
  Gauge,
  Target,
  UserCheck,
  KeyRound,
  Calendar,
  QrCode,
  Search,
  Activity,
  Bell,
  Mic,
  MicOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  TrendingUp,
  FolderGit2,
  Award,
  BookOpen,
  Check,
  FileText,
  Filter,
  Plus,
  RefreshCw,
  Send,
  Code,
  ChevronRight,
  Download,
  Building2,
  MapPin,
  CornerDownLeft,
  ChevronsUpDown,
  LayoutDashboard,
  Database,
  AlertTriangle,
  PieChart,
  BarChart3,
  Users,
  ShieldCheck,
  Layers,
  User,
  GraduationCap,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import OverviewDashboard from "@/components/overview/OverviewDashboard";
import PathwayOrbHub from "@/components/PathwayOrbHub";
import KPMGAnalyticsStudio from "@/components/kpmg/KPMGAnalyticsStudio";
import AttendanceDashboard from "@/components/attendance/AttendanceDashboard";
import ActionPlanStudio from "@/components/action-plan/ActionPlanStudio";
import UnifiedDataPipeline from "@/components/kpmg/UnifiedDataPipeline";
import AdminBatchCockpit from "@/components/kpmg/AdminBatchCockpit";
import AtRiskIdentificationMatrix from "@/components/kpmg/AtRiskIdentificationMatrix";
import SmartStudentSegmentation from "@/components/kpmg/SmartStudentSegmentation";
import CohortAnalyticsBenchmark from "@/components/kpmg/CohortAnalyticsBenchmark";
import LoginGateway from "@/components/auth/LoginGateway";
import FacultyClassPerformance from "@/components/faculty/FacultyClassPerformance";
import FacultyStudentRoster from "@/components/faculty/FacultyStudentRoster";
import FacultyEarlyWarningRadar from "@/components/faculty/FacultyEarlyWarningRadar";
import FacultyMarkAttendance from "@/components/faculty/FacultyMarkAttendance";
import FacultyGradebook from "@/components/faculty/FacultyGradebook";
import FacultyCourseHealth from "@/components/faculty/FacultyCourseHealth";
import FacultySubjectRisk from "@/components/faculty/FacultySubjectRisk";
import FacultyMenteeGroup from "@/components/faculty/FacultyMenteeGroup";
import FacultyBenchmarkInsights from "@/components/faculty/FacultyBenchmarkInsights";
import FacultyMentorshipClusters from "@/components/faculty/FacultyMentorshipClusters";
import AdminPermissionsGovernance from "@/components/kpmg/AdminPermissionsGovernance";
import StudentPermissionsView from "@/components/attendance/StudentPermissionsView";
import SuccessScoreScreen from "@/components/success-score/SuccessScoreScreen";
import AcademicPerformanceScreen from "@/components/academic/AcademicPerformanceScreen";
import { SharedPermissionRequest, INITIAL_SHARED_PERMISSIONS } from "@/types/permissions";
import { supabase } from "@/lib/supabaseClient";

export default function StudentDashboard() {
  // Navigation State
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedPathway, setSelectedPathway] = useState<string>("placements");
  const [exploredPathwayModal, setExploredPathwayModal] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceQuery, setVoiceQuery] = useState("");
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [activeQRPassData, setActiveQRPassData] = useState({
    title: "Electronics Lab 03 · Slot 10:00 AM - 12:00 PM",
    facility: "Electronics & IoT Lab",
    time: "Today, Oct 12 · 10:00 AM - 12:00 PM",
    id: "PASS-C2C-2026-8947-EL3",
  });

  // Success Score & Attendance Dynamic States
  const [successScore, setSuccessScore] = useState(74);
  const [attendanceRate, setAttendanceRate] = useState("68.4%");
  const [selectedFacultyStudent, setSelectedFacultyStudent] = useState<string | null>(null);

  // Top Bar Search & Notifications State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchIdx, setSelectedSearchIdx] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      title: "Attendance Risk Flag (68.4%)",
      description: "2 Remedial make-up lab sessions required to clear eligibility.",
      time: "10m ago",
      type: "risk" as const,
      unread: true,
      tab: "Interventions",
    },
    {
      id: "notif-2",
      title: "Enterprise Cloud Campus Drive",
      description: "Super-Dream 28 LPA drive opens Oct 18. Review roadmap.",
      time: "2h ago",
      type: "opportunity" as const,
      unread: true,
      tab: "Career Paths",
      pathwayId: "placements",
    },
    {
      id: "notif-3",
      title: "National Hackathon OD Request",
      description: "In review with HOD Dr. Srinivas. Status: Pending approval.",
      time: "Yesterday",
      type: "approval" as const,
      unread: true,
      tab: "Permissions",
    },
  ]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

  // Authenticated Session State (Gateway Access)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Authenticated Persona State (Admin vs Faculty vs Student)
  const [userRole, setUserRole] = useState<"admin" | "faculty" | "student">("student");

  // Restore Supabase authenticated session on mount & subscribe to auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const metaRole = session.user.user_metadata?.role as "admin" | "faculty" | "student" | undefined;
        if (metaRole && ["admin", "faculty", "student"].includes(metaRole)) {
          setUserRole(metaRole);
          setActiveNav(metaRole === "student" ? "Overview" : "Batch Cockpit");
        }
        setIsAuthenticated(true);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const metaRole = session.user.user_metadata?.role as "admin" | "faculty" | "student" | undefined;
        if (metaRole && ["admin", "faculty", "student"].includes(metaRole)) {
          setUserRole(metaRole);
        }
        setIsAuthenticated(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const personas = {
    admin: {
      name: "Dr. Srinivas Rao",
      role: "HOD & Institutional Admin",
      badge: "HOD · Level 3",
      avatarBg: "bg-[#11233D]",
      id: "HOD-CSE-01",
      dept: "Computer Science & Engineering",
    },
    faculty: {
      name: "Prof. Rajesh Kumar",
      role: "Course Instructor & Mentor",
      badge: "Asst. Professor",
      avatarBg: "bg-[#825FEF]",
      id: "FAC-CSE-204",
      dept: "Computer Science & Engineering",
    },
    student: {
      name: "Ananya V.",
      role: "Undergraduate Student",
      badge: "Student · Level 1",
      avatarBg: "bg-[#00CEE6]",
      id: "STU-2026-8947",
      rollNo: "21BCE1089",
      dept: "CSE (Semester 7)",
    },
  };

  // Global Keyboard Shortcuts (⌘K / Ctrl+K, Escape) & Click Outside Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 10);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
      if (
        notificationsContainerRef.current &&
        !notificationsContainerRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notif: (typeof notifications)[0]) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, unread: false } : n))
    );
    setActiveNav(notif.tab);
    if (notif.pathwayId) setSelectedPathway(notif.pathwayId);
    setIsNotificationsOpen(false);
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // 360 Record Sub-tab
  const [profileTab, setProfileTab] = useState<"academics" | "attendance" | "projects" | "clearance">("academics");

  // Interventions State
  const [dsaTaskStatus, setDsaTaskStatus] = useState<"pending" | "completed">("pending");
  const [makeupLabTaskStatus, setMakeupLabTaskStatus] = useState<"pending" | "completed">("pending");
  const [isDsaModalOpen, setIsDsaModalOpen] = useState(false);
  const [dsaTestStep, setDsaTestStep] = useState<"idle" | "running" | "passed">("idle");

  // Permissions & Passes State (Synchronized between Student & Admin)
  const [sharedPermissions, setSharedPermissions] = useState<SharedPermissionRequest[]>(INITIAL_SHARED_PERMISSIONS);

  const handleAddPermission = (newReq: SharedPermissionRequest) => {
    setSharedPermissions((prev) => [newReq, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Leave Applied: ${newReq.event}`,
        description: `${newReq.student} (${newReq.roll}) applied for ${newReq.type} with attached letter.`,
        time: "Just now",
        type: "approval" as const,
        unread: true,
        tab: "Permissions",
      },
      ...prev,
    ]);
  };

  const handleApprovePermission = (id: string) => {
    setSharedPermissions((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved" as const,
              remarks: "Officially stamped & approved by HOD Dr. Srinivas Rao",
            }
          : r
      )
    );
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Leave Approved by HOD",
        description: "Official permission stamped; SIS attendance credit authorized.",
        time: "Just now",
        type: "approval" as const,
        unread: true,
        tab: "Permissions",
      },
      ...prev,
    ]);
  };

  const handleRejectPermission = (id: string) => {
    setSharedPermissions((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected" as const,
              remarks: "Declined by HOD Office - unverified event documentation",
            }
          : r
      )
    );
  };

  const [permissionsTab, setPermissionsTab] = useState<"requests" | "bookings">("requests");
  const [permissionsFilter, setPermissionsFilter] = useState<"all" | "pending" | "approved">("all");
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [newLeaveType, setNewLeaveType] = useState("On-Duty (OD)");
  const [newLeaveTitle, setNewLeaveTitle] = useState("");
  const [newLeaveFrom, setNewLeaveFrom] = useState("2026-10-20");
  const [newLeaveTo, setNewLeaveTo] = useState("2026-10-22");
  const [newLeaveApprover, setNewLeaveApprover] = useState("HOD (CSE Dept)");
  const [newLeaveReason, setNewLeaveReason] = useState("");

  // Bookings State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookings, setBookings] = useState([
    {
      id: "b-1",
      labCode: "LAB 3",
      title: "Electronics & IoT Lab",
      slot: "Today, Oct 12 · 10:00 AM - 12:00 PM · Block C - Room 301",
      status: "APPROVED",
      passId: "PASS-C2C-2026-8947-EL3",
    },
  ]);
  const [newBookingLab, setNewBookingLab] = useState("Attendance Make-up Lab (Lab 4 - Saturday)");
  const [newBookingSlot, setNewBookingSlot] = useState("Saturday, Oct 17 · 10:00 AM - 12:00 PM");
  const [newBookingPurpose, setNewBookingPurpose] = useState("Attendance Deficit Remedial Session");


  // The 8 Pathways Data (Ordered to match the reference layout)
  const pathways = [
    {
      id: "placements",
      name: "Placements & Jobs",
      position: "left",
      description: "Resume ATS evaluation, role-specific mock interviews, and tailored corporate job matching.",
      tags: ["Resume", "Mock Interviews", "Job Matching"],
      stats: "78 active drives",
      milestones: [
        { title: "ATS Resume Verification", status: "Completed", note: "Score 88/100 · Verified by Dr. Rao" },
        { title: "DSA & Algorithmic Practice", status: dsaTaskStatus === "completed" ? "Completed" : "In Progress", note: dsaTaskStatus === "completed" ? "Cleared 5 LeetCode-style questions" : "Assigned by Prof. Sharma · 2 Tasks Due" },
        { title: "Mock Technical Interview", status: "Scheduled", note: "Technical Interview Booth B · Tomorrow" },
        { title: "Tier-1 Recruiter Applications", status: "Active", note: "78 companies currently shortlisting" },
      ],
    },
    {
      id: "internships",
      name: "Internships",
      position: "left",
      description: "Summer & winter internships, stipend tracking, and industry capstone project experience.",
      tags: ["Experience", "Industry Projects", "Stipends"],
      stats: "34 companies hiring",
      milestones: [
        { title: "Capstone Project Review", status: "Completed", note: "Campus Navigator IoT App verified" },
        { title: "Industry Partner Matching", status: "In Progress", note: "34 recruiters hiring CSE interns" },
        { title: "OD Leave Clearance", status: "Active", note: "Automated On-Duty routing for onsite drives" },
        { title: "Stipend & Offer Verification", status: "Scheduled", note: "Average stipend: ₹45,000/month" },
      ],
    },
    {
      id: "higher-studies",
      name: "Higher Studies",
      position: "left",
      description: "Guidance for Masters (M.Tech, MS, MBA), study abroad application timelines, and scholarship trackers.",
      tags: ["Masters", "Study Abroad", "Scholarships"],
      stats: "120+ Universities",
      milestones: [
        { title: "Transcript & CGPA Verification", status: "Completed", note: "8.42 CGPA meets top 10% cutoff" },
        { title: "SOP & LOR Portfolio", status: "In Progress", note: "Drafting recommendations with Dr. Rao" },
        { title: "GRE & TOEFL Readiness", status: "Active", note: "Curated vocabulary & quant concept reels" },
        { title: "University Shortlisting", status: "Scheduled", note: "120+ partnered global universities" },
      ],
    },
    {
      id: "entrepreneurship",
      name: "Entrepreneurship",
      position: "left",
      description: "Startup idea validation, campus incubation center access, and seed grant funding programs.",
      tags: ["Ideation", "Incubators", "Seed Grants"],
      stats: "5 Incubation Programs",
      milestones: [
        { title: "Idea Pitch & Validation", status: "Completed", note: "Campus Navigator pitch deck approved" },
        { title: "Incubation Center Workspace", status: "In Progress", note: "Bookable hardware & robotics workbench" },
        { title: "Seed Grant Application", status: "Active", note: "5 government & alumni grant programs open" },
        { title: "Startup Registration Support", status: "Scheduled", note: "Mentorship from campus incubator head" },
      ],
    },
    {
      id: "mentors",
      name: "Mentors & Guidance",
      position: "right",
      description: "1-on-1 counseling sessions with industry experts and direct college alumni mentorship.",
      tags: ["Career Advice", "Alumni Network", "1-on-1"],
      stats: "42 Mentors Online",
      milestones: [
        { title: "Academic Advisor Match", status: "Completed", note: "Dr. K. Srinivas Rao (Advisor)" },
        { title: "Placement Coordinator Guidance", status: "Active", note: "Prof. S. Sharma (Placement Head)" },
        { title: "Alumni 1-on-1 Session", status: "Scheduled", note: "Tier-1 SDE mentor available on Saturday" },
        { title: "Career Progression Review", status: "In Progress", note: "Quarterly milestone feedback log" },
      ],
    },
    {
      id: "exams",
      name: "Competitive Exams",
      position: "right",
      description: "Curated preparation schedules and mock tests for GATE, CAT, UPSC, and PSU technical recruitments.",
      tags: ["GATE", "CAT", "Government Jobs"],
      stats: "Next Mock: Sunday",
      milestones: [
        { title: "GATE CS Syllabus Analysis", status: "Completed", note: "Coverage: 78% of core CS subjects" },
        { title: "Weekly Mock Test Series", status: "Active", note: "Next full-length mock: Sunday 10:00 AM" },
        { title: "Concept Refresher Modules", status: "In Progress", note: "Rapid concept revision modules" },
        { title: "PSU Technical Recruitment", status: "Scheduled", note: "Eligibility tracking for IOCL/ISRO/BARC" },
      ],
    },
    {
      id: "research",
      name: "Research & Innovation",
      position: "right",
      description: "Journal paper publications, patent guidance, hackathon team formation, and research projects.",
      tags: ["Papers", "Hackathons", "Patents"],
      stats: "3 Ongoing Hackathons",
      milestones: [
        { title: "Distributed Systems Paper", status: "In Progress", note: "Drafting draft with faculty advisor" },
        { title: "National Hackathon 2026", status: "Active", note: "OD Leave submitted & in review with HOD" },
        { title: "Patent Filing Evaluation", status: "Scheduled", note: "IoT positioning algorithm review" },
        { title: "Research Grant Application", status: "Scheduled", note: "Campus R&D innovation fund" },
      ],
    },
    {
      id: "skills",
      name: "Skills & Certifications",
      position: "right",
      description: "Automated skill-gap analyzer mapped to target job roles, with curated learning tracks.",
      tags: ["Skill Gaps", "Learning Paths", "Certifications"],
      stats: "15 Recommended Courses",
      milestones: [
        { title: "Algorithmic Problem Solving", status: dsaTaskStatus === "completed" ? "Completed" : "In Progress", note: dsaTaskStatus === "completed" ? "Remedial DSA cleared" : "Array & Graph Traversal practice due" },
        { title: "Full Stack & Cloud Architecture", status: "Completed", note: "Verified Next.js & AWS certifications" },
        { title: "System Design Concepts", status: "In Progress", note: "Architecture & system design review" },
        { title: "Mock Technical Assessments", status: "Active", note: "Next live mock test scheduled" },
      ],
    },
  ];

  // Calculate pending interventions count
  const pendingInterventionsCount =
    (dsaTaskStatus === "pending" ? 1 : 0) + (makeupLabTaskStatus === "pending" ? 1 : 0);

  // Voice recognition simulation
  const handleVoiceToggle = () => {
    if (!isVoiceActive) {
      setIsVoiceActive(true);
      setVoiceQuery("Listening... speak your career goal or question");

      if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        try {
          const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setVoiceQuery(`"${transcript}"`);
            setIsVoiceActive(false);
          };
          recognition.onerror = () => {
            setIsVoiceActive(false);
          };
          recognition.start();
          return;
        } catch (e) {
          console.error(e);
        }
      }

      setTimeout(() => {
        setVoiceQuery('"How can I improve my Success Score from 74 to above 85 before placement drives?"');
        setIsVoiceActive(false);
      }, 3000);
    } else {
      setIsVoiceActive(false);
      setVoiceQuery("");
    }
  };

  // DSA Practice Submission Handler
  const handleRunDsaTests = () => {
    setDsaTestStep("running");
    setTimeout(() => {
      setDsaTestStep("passed");
    }, 1200);
  };

  const handleSubmitDsaModule = () => {
    setDsaTaskStatus("completed");
    setSuccessScore((prev) => Math.min(100, prev + 8));
    setIsDsaModalOpen(false);
    setDsaTestStep("idle");
  };

  // Leave / OD Form Submission Handler (Integrated with shared permissions)
  const handleCreateLeaveRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveTitle.trim()) return;

    const newReq: SharedPermissionRequest = {
      id: `req-${Date.now()}`,
      student: "Ananya V.",
      roll: "21BCE1089",
      type: (newLeaveType as any) || "On-Duty (OD)",
      event: newLeaveTitle,
      dateRange: `${newLeaveFrom} - ${newLeaveTo}`,
      status: "pending",
      submitted: "Today",
      attendanceCredit: true,
      letterText: newLeaveReason || `Formal leave application for ${newLeaveTitle}.`,
      remarks: "Submitted to Admin & HOD Office",
    };

    handleAddPermission(newReq);
    setNewLeaveTitle("");
    setNewLeaveReason("");
    setIsLeaveModalOpen(false);
  };

  // Lab Booking Submission Handler
  const handleCreateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PASS-C2C-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking = {
      id: `b-${Date.now()}`,
      labCode: newBookingLab.includes("Make-up") ? "LAB 4" : "LAB 2",
      title: newBookingLab,
      slot: `${newBookingSlot} · Block B`,
      status: "APPROVED",
      passId: newId,
    };

    setBookings([newBooking, ...bookings]);

    // If it was the make-up lab, resolve the attendance deficit!
    if (newBookingLab.includes("Make-up")) {
      setMakeupLabTaskStatus("completed");
      setAttendanceRate("75.2% (Recovered)");
      setSuccessScore((prev) => Math.min(100, prev + 6));
    }

    setPermissionsTab("bookings");
    setIsBookingModalOpen(false);
  };

  // Export 360 PDF Handler
  const handleExportPDF = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  // Search Navigation Options with Icons & Descriptions
  const searchResults = [
    { label: "Overview Dashboard", category: "Navigation", tab: "Overview", icon: Home, desc: "Main student cockpit & KPI metrics" },
    { label: "Career Paths & Roadmap (8 Pathways)", category: "Pathway Hub", tab: "Career Paths", icon: Compass, desc: "Interactive orbit graph & milestones" },
    { label: "Placements & Jobs Pathway", category: "Pathway", tab: "Career Paths", pathwayId: "placements", icon: Target, desc: "Drive eligibility, resume & CTC" },
    { label: "Internships Pathway", category: "Pathway", tab: "Career Paths", pathwayId: "internships", icon: Sparkles, desc: "Applications, stipends & dates" },
    { label: "My Success Score & XAI", category: "Analytics", tab: "Success Score", icon: Gauge, desc: "XAI explainability & 4 pillars" },
    { label: "Academic Performance", category: "Academics", tab: "Academic Performance", icon: Award, desc: "8.42 CGPA, SGPA & course transcripts" },
    { label: "Attendance Intelligence", category: "Attendance", tab: "Attendance", icon: UserCheck, desc: "68.4% subject breakdown & OD dispute" },
    { label: "Action Plan Studio", category: "Recovery", tab: "Interventions", icon: Target, desc: "Assigned interventions & personalized tasks" },
    { label: "Make-up Lab Session", category: "Facilities", tab: "Permissions", icon: Calendar, desc: "Pass generation & slot reservation" },
    { label: "My Profile & 360 Records", category: "Profile", tab: "360 Record", icon: FileText, desc: "Skills radar, credentials & clearance" },
    { label: "Manage Leave & On-Duty", category: "Approvals", tab: "Permissions", icon: KeyRound, desc: "OD slips & approval status" },
    { label: "Reserve Lab & Gate Pass QR", category: "Facilities", tab: "Permissions", icon: QrCode, desc: "Access pass & verification" },
  ].filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // If session is logged out, render the Role-Based Access Gateway
  if (!isAuthenticated) {
    return (
      <LoginGateway
        onLogin={(role) => {
          setUserRole(role);
          setActiveNav(role === "student" ? "Overview" : "Batch Cockpit");
          setIsAuthenticated(true);
        }}
      />
    );
  }

  // Active selected pathway data
  const currentPathwayData = pathways.find((p) => p.id === selectedPathway) || pathways[0];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#EFF4F7] font-sans antialiased text-[#11233D] selection:bg-[#00CEE6]/20">
      {/* ======================================================== */}
      {/* 1. SIDEBAR (Midnight Navy: #11233D, Cyan: #00CEE6)        */}
      {/* ======================================================== */}
      <aside
        style={{ width: "280px", minWidth: "280px" }}
        className="w-[280px] h-screen bg-[#11233D] border-r border-[#ACBACC]/20 text-white flex flex-col justify-between py-6 px-4 shrink-0 select-none shadow-2xl z-30 overflow-y-auto scrollbar-none"
      >
        <div>
          {/* Official Brand Header with Full C2C Phoenix Logo */}
          <div className="px-1 mb-5 flex justify-center">
            <button
              onClick={() => setActiveNav("Overview")}
              style={{ maxHeight: "76px" }}
              className="w-full h-[76px] rounded-xl bg-white p-2 flex items-center justify-center shadow-md shadow-black/30 ring-1 ring-white/20 hover:ring-[#00CEE6]/60 hover:scale-[1.02] transition-all cursor-pointer group overflow-hidden"
              title="Campus 2 Career - Return to Overview"
            >
              <img
                src="/brand/logo-full-clean.png"
                alt="Campus 2 Career - Student Success Platform"
                style={{ maxHeight: "60px", maxWidth: "100%", objectFit: "contain" }}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
              />
            </button>
          </div>



          {/* Navigation Links */}
          <nav className="space-y-1.5 text-sm">
            {(userRole === "admin"
              ? [
                  {
                    id: "Batch Cockpit",
                    label: "Batch Cockpit",
                    iconImg: "/icons/custom/admin-cockpit.png",
                    iconLucide: null,
                    isActive: activeNav === "Batch Cockpit" || activeNav === "Overview",
                    onClick: () => setActiveNav("Batch Cockpit"),
                  },
                  {
                    id: "Cohort Analytics",
                    label: "Dept Analytics",
                    iconImg: "/icons/custom/admin-analytics.png",
                    iconLucide: null,
                    isActive: activeNav === "Cohort Analytics" || activeNav === "Benchmark Insights",
                    onClick: () => setActiveNav("Cohort Analytics"),
                  },
                  {
                    id: "At-Risk Matrix",
                    label: "Student Risk",
                    iconImg: "/icons/custom/admin-risk.png",
                    iconLucide: null,
                    isActive: activeNav === "At-Risk Matrix",
                    onClick: () => setActiveNav("At-Risk Matrix"),
                  },
                  {
                    id: "Segmentation",
                    label: "Mentorship",
                    iconImg: "/icons/custom/admin-mentorship.png",
                    iconLucide: null,
                    isActive: activeNav === "Segmentation",
                    onClick: () => setActiveNav("Segmentation"),
                  },
                  {
                    id: "Data Pipelines",
                    label: "Data Feeds",
                    iconImg: "/icons/custom/admin-data.png",
                    iconLucide: null,
                    isActive: activeNav === "Data Pipelines",
                    onClick: () => setActiveNav("Data Pipelines"),
                  },
                  {
                    id: "Permissions",
                    label: "Leave & OD",
                    iconImg: "/icons/custom/admin-permissions.png",
                    iconLucide: null,
                    isActive: activeNav === "Permissions",
                    onClick: () => setActiveNav("Permissions"),
                  },
                ]
              : userRole === "faculty"
              ? [
                  {
                    id: "Mark Attendance",
                    label: "Attendance",
                    iconImg: "/icons/custom/faculty-attendance.png",
                    iconLucide: null,
                    isActive: activeNav === "Mark Attendance" || activeNav === "Overview" || activeNav === "Batch Cockpit",
                    onClick: () => setActiveNav("Mark Attendance"),
                  },
                  {
                    id: "Internal Marks",
                    label: "CIA Grades",
                    iconImg: "/icons/custom/faculty-grades.png",
                    iconLucide: null,
                    isActive: activeNav === "Internal Marks",
                    onClick: () => setActiveNav("Internal Marks"),
                  },
                  {
                    id: "My Course",
                    label: "Course Health",
                    iconImg: "/icons/custom/faculty-course-health.png",
                    iconLucide: null,
                    isActive: activeNav === "My Course",
                    onClick: () => setActiveNav("My Course"),
                  },
                  {
                    id: "Subject Risk",
                    label: "Subject Risk",
                    iconImg: "/icons/custom/faculty-subject-risk.png",
                    iconLucide: null,
                    isActive: activeNav === "Subject Risk",
                    onClick: () => setActiveNav("Subject Risk"),
                  },
                  {
                    id: "My Mentees",
                    label: "My Mentees",
                    iconImg: "/icons/custom/faculty-mentees.png",
                    iconLucide: null,
                    isActive: activeNav === "My Mentees",
                    onClick: () => setActiveNav("My Mentees"),
                  },
                ]
              : [
                  {
                    id: "Overview",
                    label: "Overview",
                    iconImg: "/brand/icons/overview-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Overview" || activeNav === "Batch Cockpit",
                    onClick: () => setActiveNav("Overview"),
                  },
                  {
                    id: "Career Paths",
                    label: "Career Paths",
                    iconImg: "/brand/icons/pathways-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Career Paths" || activeNav === "Career Pathways",
                    onClick: () => setActiveNav("Career Paths"),
                  },
                  {
                    id: "Success Score",
                    label: "My Success Score",
                    iconImg: "/brand/icons/score-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Success Score",
                    onClick: () => setActiveNav("Success Score"),
                  },
                  {
                    id: "Academic Performance",
                    label: "Academic Performance",
                    iconImg: "/brand/icons/academic-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Academic Performance",
                    onClick: () => {
                      setActiveNav("Academic Performance");
                      setProfileTab("academics");
                    },
                  },
                  {
                    id: "Attendance",
                    label: "Attendance",
                    iconImg: "/brand/icons/attendance-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Attendance",
                    onClick: () => {
                      setActiveNav("Attendance");
                      setProfileTab("attendance");
                    },
                  },
                  {
                    id: "Interventions",
                    label: "Action Plan",
                    iconImg: "/brand/icons/action-plan-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Interventions",
                    onClick: () => setActiveNav("Interventions"),
                  },
                  {
                    id: "360 Record",
                    label: "My Profile",
                    iconImg: "/brand/icons/record-light.png",
                    iconLucide: null,
                    isActive: activeNav === "360 Record",
                    onClick: () => setActiveNav("360 Record"),
                  },
                  {
                    id: "Permissions",
                    label: "Permissions",
                    iconImg: "/brand/icons/permissions-light.png",
                    iconLucide: null,
                    isActive: activeNav === "Permissions",
                    onClick: () => setActiveNav("Permissions"),
                  },
                ]
            ).map((item) => {
              const LucideIcon = item.iconLucide as React.ElementType | null;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className={`group relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer select-none ${
                    item.isActive
                      ? userRole === "admin"
                        ? "bg-slate-700/40 text-white font-black border border-slate-500/50 shadow-[0_2px_14px_rgba(148,163,184,0.25)]"
                        : userRole === "faculty"
                        ? "bg-purple-500/20 text-white font-black border border-purple-400/50 shadow-[0_2px_14px_rgba(168,85,247,0.25)]"
                        : "bg-[#00CEE6]/15 text-white font-black border border-[#00CEE6]/40 shadow-[0_2px_14px_rgba(0,210,234,0.2)]"
                      : "text-slate-200 hover:text-white hover:bg-white/[0.08] border border-transparent"
                  }`}
                >
                  {/* Active Indicator Bar on Left Edge */}
                  {item.isActive && (
                    <span
                      className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full shadow-lg ${
                        userRole === "admin"
                          ? "bg-slate-300 shadow-[0_0_12px_#CBD5E1]"
                          : userRole === "faculty"
                          ? "bg-purple-400 shadow-[0_0_12px_#A855F7]"
                          : "bg-[#00CEE6] shadow-[0_0_12px_#00CEE6]"
                      }`}
                    />
                  )}

                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Icon: Either Lucide Icon or Brand PNG */}
                    <div className="w-7 h-7 flex items-center justify-center shrink-0">
                      {LucideIcon ? (
                        <LucideIcon
                          className={`w-[24px] h-[24px] shrink-0 transition-all ${
                            item.isActive
                              ? userRole === "admin"
                                ? "text-slate-200 drop-shadow-[0_0_8px_rgba(203,213,225,0.8)] scale-110"
                                : userRole === "faculty"
                                ? "text-purple-300 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] scale-110"
                                : "text-[#00CEE6] drop-shadow-[0_0_8px_rgba(0,210,234,0.8)] scale-110"
                              : "text-slate-300 group-hover:text-white group-hover:scale-105"
                          }`}
                        />
                      ) : (
                        <img
                          src={item.iconImg}
                          alt={item.label}
                          className={`w-[26px] h-[26px] max-w-[26px] max-h-[26px] object-contain shrink-0 transition-all ${
                            item.isActive
                              ? userRole === "faculty"
                                ? "filter drop-shadow-[0_0_10px_rgba(168,85,247,0.85)] opacity-100 scale-110"
                                : userRole === "admin"
                                ? "filter drop-shadow-[0_0_10px_rgba(203,213,225,0.85)] opacity-100 scale-110"
                                : "filter drop-shadow-[0_0_10px_rgba(0,210,234,0.85)] opacity-100 scale-110"
                              : "opacity-80 group-hover:opacity-100 group-hover:scale-105"
                          }`}
                        />
                      )}
                    </div>

                    {/* Bulky Typography */}
                    <span
                      className={`text-[14.5px] tracking-tight truncate ${
                        item.isActive
                          ? "text-white font-black drop-shadow-[0_1px_4px_rgba(0,0,0,0.4)]"
                          : "font-bold"
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ======================================================== */}
        {/* ======================================================== */}
        {/* SIDEBAR FOOTER: LOGOUT ACTION                            */}
        {/* ======================================================== */}
        <div className="pt-3 border-t border-[#334155]">
          <button
            type="button"
            onClick={async () => {
              try {
                await supabase.auth.signOut();
              } catch {
                // Ignore signout network errors
              }
              setIsAuthenticated(false);
            }}
            className="group relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-200 cursor-pointer select-none bg-white/[0.06] hover:bg-rose-500/20 border border-white/10 hover:border-rose-400/40 text-slate-200 hover:text-white shadow-sm"
            title="Log Out of Session"
          >
            {/* Custom Logout Icon (~24px) */}
            <img
              src="/brand/icons/logout-light.png"
              alt="Logout"
              className="w-[24px] h-[24px] object-contain shrink-0 transition-transform group-hover:scale-110 filter drop-shadow-[0_0_8px_rgba(0,206,230,0.8)]"
            />

            {/* Logout Typography */}
            <span className="text-[15.5px] font-bold tracking-tight">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. MAIN WORKSPACE CANVAS                                  */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar Bar - Slate Grey & Pebble Theme */}
        <header className="px-6 lg:px-10 py-3.5 shrink-0 bg-gradient-to-r from-[#CAD5E2] via-[#E1E9F0] to-[#C3D0DD] backdrop-blur-xl border-b-2 border-slate-300/90 shadow-[0_8px_24px_rgba(51,65,85,0.08),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.03)] relative z-40">
          {/* Ambient Slate Grey & Soft Pebble Glows (Self-contained) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 left-1/4 w-96 h-28 bg-[#94A3B8]/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 right-1/4 w-72 h-20 bg-white/50 rounded-full blur-2xl" />
          </div>

          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-6 relative z-10">
            {/* 1. Search Input with Dynamic Navigation Dropdown - Crisp White Pebble Capsule */}
            <div ref={searchContainerRef} className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                  setSelectedSearchIdx(0);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedSearchIdx((prev) => (prev + 1) % Math.max(1, searchResults.length));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedSearchIdx((prev) => (prev - 1 + searchResults.length) % Math.max(1, searchResults.length));
                  } else if (e.key === "Enter" && searchResults[selectedSearchIdx]) {
                    e.preventDefault();
                    const item = searchResults[selectedSearchIdx];
                    setActiveNav(item.tab);
                    if (item.pathwayId) setSelectedPathway(item.pathwayId);
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  } else if (e.key === "Escape") {
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="Search pathways, skill analytics, or press ⌘K..."
                className="w-full bg-white pl-11 pr-24 py-2.5 rounded-full border-2 border-slate-300/80 text-sm text-[#0F1E36] placeholder-slate-400 shadow-[0_4px_16px_rgba(15,23,42,0.05),inset_0_2px_4px_rgba(255,255,255,1)] hover:border-slate-400 focus:outline-none focus:border-[#00CEE6] focus:ring-2 focus:ring-[#00CEE6]/30 transition-all"
              />

              {/* Clear Search & Keyboard Shortcut Keycap Pill */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="w-5 h-5 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <kbd
                    onClick={() => {
                      setIsSearchOpen(true);
                      searchInputRef.current?.focus();
                    }}
                    className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-extrabold text-slate-500 bg-slate-100 hover:bg-slate-200 border border-slate-300/80 rounded-md shadow-2xs font-mono select-none cursor-pointer transition-colors"
                    title="Shortcut: ⌘K or Ctrl+K"
                  >
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Quick Search Jump Results - Fully Visible Pebble Command Palette */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(15,23,42,0.22),0_4px_16px_rgba(15,23,42,0.08)] border-2 border-slate-200 p-2 z-[60] animate-in fade-in overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Quick Navigation Results</span>
                    <span>{searchResults.length} Match{searchResults.length === 1 ? "" : "es"}</span>
                  </div>

                  <div className="max-h-[340px] overflow-y-auto py-1 space-y-1 scrollbar-thin">
                    {searchResults.length > 0 ? (
                      searchResults.slice(0, 6).map((item, idx) => {
                        const Icon = item.icon || Compass;
                        const isSelected = selectedSearchIdx === idx;
                        return (
                          <button
                            key={idx}
                            onMouseEnter={() => setSelectedSearchIdx(idx)}
                            onClick={() => {
                              setActiveNav(item.tab);
                              if (item.pathwayId) setSelectedPathway(item.pathwayId);
                              setIsSearchOpen(false);
                              setSearchQuery("");
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-[16px] flex items-center justify-between gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? "bg-slate-100/90 border-2 border-slate-300/80 shadow-[0_2px_8px_rgba(15,23,42,0.04),inset_0_1px_2px_rgba(255,255,255,1)]"
                                : "hover:bg-slate-50 border-2 border-transparent"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-[12px] flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-white text-[#00CEE6] shadow-2xs" : "bg-slate-100 text-slate-500"
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#11233D] truncate">{item.label}</p>
                                <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300/60">
                                {item.category}
                              </span>
                              {isSelected && (
                                <span className="text-[10px] font-bold text-slate-400 hidden sm:flex items-center gap-0.5">
                                  <CornerDownLeft className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        <p className="font-bold text-[#11233D]">No results found</p>
                        <p className="text-[11px] text-slate-400 mt-1">Try searching for &quot;attendance&quot;, &quot;placement&quot;, &quot;scores&quot;, or &quot;tasks&quot;.</p>
                      </div>
                    )}
                  </div>

                  {/* Command Palette Keyboard Hints Footer */}
                  <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 bg-slate-50/50 rounded-b-[20px]">
                    <span>Navigate with <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-mono text-slate-600">↑</kbd> <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-mono text-slate-600">↓</kbd></span>
                    <span>Select <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-mono text-slate-600">↵</kbd></span>
                    <span>Close <kbd className="px-1 py-0.5 bg-white rounded border border-slate-200 font-mono text-slate-600">ESC</kbd></span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Right Controls - Notification Bell Pod */}
            <div className="flex items-center gap-3 relative">
              <div ref={notificationsContainerRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative w-10 h-10 rounded-full bg-white border-2 border-slate-300/80 shadow-[0_4px_14px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,1)] flex items-center justify-center text-[#0F1E36] hover:text-slate-700 hover:border-slate-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute -top-1 -right-1 px-1.5 min-w-[19px] h-[19px] rounded-full bg-amber-500 text-[10px] font-black text-white flex items-center justify-center border-2 border-white shadow-[0_2px_6px_rgba(245,158,11,0.5)]">
                      {notifications.filter((n) => n.unread).length}
                    </span>
                  )}
                </button>

                {/* Notifications Popover - Fully Visible Floating Pebble Card */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 top-12 w-84 sm:w-96 bg-white rounded-[28px] shadow-[0_20px_50px_rgba(15,23,42,0.22),0_4px_16px_rgba(15,23,42,0.08)] border-2 border-slate-200 p-4 z-[60] animate-in fade-in space-y-3">
                    {/* Popover Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#11233D]">Active Notifications</span>
                        {notifications.filter((n) => n.unread).length > 0 && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-300/60 px-2 py-0.5 rounded-full">
                            {notifications.filter((n) => n.unread).length} New
                          </span>
                        )}
                      </div>
                      {notifications.some((n) => n.unread) && (
                        <button
                          type="button"
                          onClick={handleMarkAllNotificationsRead}
                          className="text-[11px] font-bold text-slate-500 hover:text-[#11233D] flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          <Check className="w-3 h-3 text-emerald-500" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full border border-slate-200/80 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setNotificationFilter("all")}
                        className={`flex-1 py-1 rounded-full text-center transition-all cursor-pointer ${
                          notificationFilter === "all"
                            ? "bg-white text-[#11233D] shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        All ({notifications.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setNotificationFilter("unread")}
                        className={`flex-1 py-1 rounded-full text-center transition-all cursor-pointer ${
                          notificationFilter === "unread"
                            ? "bg-white text-[#11233D] shadow-2xs font-black"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        Unread ({notifications.filter((n) => n.unread).length})
                      </button>
                    </div>

                    {/* Notification Cards List */}
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0.5">
                      {(notificationFilter === "unread"
                        ? notifications.filter((n) => n.unread)
                        : notifications
                      ).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => handleNotificationClick(notif)}
                          className={`p-3 rounded-[18px] transition-all cursor-pointer text-left border-2 flex items-start gap-3 ${
                            notif.unread
                              ? "bg-white border-slate-300/90 shadow-[0_4px_12px_rgba(15,23,42,0.06),inset_0_2px_4px_rgba(255,255,255,1)] hover:border-[#00CEE6]"
                              : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/90 opacity-80 hover:opacity-100"
                          }`}
                        >
                          {/* Status Color Dot */}
                          <span
                            className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                              notif.type === "risk"
                                ? "bg-amber-500 shadow-[0_0_8px_#F59E0B]"
                                : notif.type === "opportunity"
                                ? "bg-[#00CEE6] shadow-[0_0_8px_#00CEE6]"
                                : "bg-purple-500 shadow-[0_0_8px_#A855F7]"
                            } ${notif.unread ? "animate-pulse" : ""}`}
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-xs font-bold text-[#11233D] truncate">{notif.title}</p>
                              <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                              {notif.description}
                            </p>
                            <span className="inline-block mt-1 text-[10px] font-bold text-[#008DA3] hover:underline">
                              Jump to module →
                            </span>
                          </div>
                        </div>
                      ))}

                      {(notificationFilter === "unread"
                        ? notifications.filter((n) => n.unread).length === 0
                        : notifications.length === 0) && (
                        <div className="py-6 text-center text-xs text-slate-400">
                          <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5 opacity-80" />
                          <p className="font-bold text-slate-600">All caught up!</p>
                          <p className="text-[11px]">No unread notifications right now.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic View Content Based on Selected Tab */}
        <main className="flex-1 px-6 lg:px-10 pt-6 pb-16 flex flex-col overflow-y-auto overflow-x-hidden">
          {/* ======================================================== */}
          {/* FACULTY VIEW 1: MARK ATTENDANCE                           */}
          {/* ======================================================== */}
          {userRole === "faculty" && (activeNav === "Mark Attendance" || activeNav === "Overview" || activeNav === "Batch Cockpit") && (
            <FacultyMarkAttendance
              onNavigate={(tab) => setActiveNav(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* FACULTY VIEW 2: GRADEBOOK & INTERNAL EVALUATIONS          */}
          {/* ======================================================== */}
          {userRole === "faculty" && activeNav === "Internal Marks" && (
            <FacultyGradebook
              onNavigate={(tab) => setActiveNav(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* FACULTY VIEW 3: MY COURSE HEALTH & SYLLABUS               */}
          {/* ======================================================== */}
          {userRole === "faculty" && activeNav === "My Course" && (
            <FacultyCourseHealth
              onNavigate={(tab) => setActiveNav(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* FACULTY VIEW 4: SUBJECT RISK ALERTS                       */}
          {/* ======================================================== */}
          {userRole === "faculty" && activeNav === "Subject Risk" && (
            <FacultySubjectRisk
              onNavigate={(tab) => setActiveNav(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* FACULTY VIEW 5: MY MENTEE GROUP (18 STUDENTS)             */}
          {/* ======================================================== */}
          {userRole === "faculty" && activeNav === "My Mentees" && (
            <FacultyMenteeGroup
              onNavigate={(tab) => setActiveNav(tab)}
            />
          )}


          {/* ======================================================== */}
          {/* ADMIN VIEW 1: COHORT COMMAND COCKPIT                      */}
          {/* ======================================================== */}
          {userRole === "admin" && (activeNav === "Batch Cockpit" || activeNav === "Overview") && (
            <AdminBatchCockpit
              onDrilldownStudent={(rollNumber) => {
                setUserRole("student");
                setActiveNav("Overview");
              }}
              onNavigateTab={(tab) => setActiveNav(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* ADMIN VIEW 2: DEPARTMENT BENCHMARK INSIGHTS               */}
          {/* ======================================================== */}
          {userRole === "admin" && (activeNav === "Cohort Analytics" || activeNav === "Benchmark Insights") && (
            <FacultyBenchmarkInsights />
          )}

          {/* ======================================================== */}
          {/* ADMIN VIEW 3: EARLY WARNING RISK MATRIX                   */}
          {/* ======================================================== */}
          {userRole === "admin" && activeNav === "At-Risk Matrix" && (
            <FacultyEarlyWarningRadar
              onNavigate={(tab: string) => {
                if (tab === "students") setActiveNav("Batch Cockpit");
                else setActiveNav(tab);
              }}
            />
          )}

          {/* ======================================================== */}
          {/* ADMIN VIEW 4: MENTORSHIP CLUSTERS & SEGMENTATION          */}
          {/* ======================================================== */}
          {userRole === "admin" && activeNav === "Segmentation" && (
            <FacultyMentorshipClusters
              onNavigate={(tab: string) => {
                if (tab === "students") setActiveNav("Batch Cockpit");
                else setActiveNav(tab);
              }}
            />
          )}

          {/* ======================================================== */}
          {/* ADMIN VIEW 5: UNIFIED DATA PIPELINES (30%)                */}
          {/* ======================================================== */}
          {userRole === "admin" && activeNav === "Data Pipelines" && (
            <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
              <div className="bg-gradient-to-r from-[#11233D] to-[#1E3A5F] text-white p-6 rounded-3xl shadow-lg border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#00CEE6]">
                    KPMG Criterion 1 · 30% Weightage
                  </span>
                  <h2 className="text-2xl font-black mt-1">Multi-Source Data Pipelines & Cleansing</h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Unified real-time ingestion from 7 campus silos (SIS Academics, Biometric Attendance, LMS Portal, HackerRank, and Feedback) into standardized schema.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav("Batch Cockpit")}
                  className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto shrink-0"
                >
                  <span>← Return to Cockpit</span>
                </button>
              </div>
              <UnifiedDataPipeline />
            </div>
          )}

          {/* ======================================================== */}
          {/* STUDENT VIEW A: OVERVIEW COCKPIT DASHBOARD                */}
          {/* ======================================================== */}
          {userRole === "student" && activeNav === "Overview" && (
            <OverviewDashboard
              studentName="Ananya V."
              department="Computer Science & Engineering"
              semester="7th Semester"
              pathways={pathways}
              selectedPathway={selectedPathway}
              onSelectPathway={(id) => setSelectedPathway(id)}
              isVoiceActive={isVoiceActive}
              onToggleVoice={handleVoiceToggle}
              voiceQuery={voiceQuery}
              onNavigateTab={(tab) => setActiveNav(tab)}
              onOpenQR={() => setIsQRModalOpen(true)}
              successScore={successScore}
              attendanceRate={attendanceRate}
            />
          )}

          {/* ======================================================== */}
          {/* VIEW B: CAREER PATHS STUDIO                               */}
          {/* ======================================================== */}
          {(activeNav === "Career Paths" || activeNav === "Career Pathways") && (
            <div className="w-full flex-1 flex flex-col justify-center animate-in fade-in duration-200">
              <PathwayOrbHub
                selectedPathway={selectedPathway}
                onSelectPathway={(id) => setSelectedPathway(id)}
                isVoiceActive={isVoiceActive}
                onToggleVoice={handleVoiceToggle}
                voiceQuery={voiceQuery}
                onExploreDetails={(id) => setExploredPathwayModal(id)}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW C: MY SUCCESS SCORE                                  */}
          {/* ======================================================== */}
          {activeNav === "Success Score" && (
            userRole === "admin" ? (
              <KPMGAnalyticsStudio onNavigateTab={(tab) => setActiveNav(tab)} />
            ) : (
              <SuccessScoreScreen
                onNavigateTab={(tab) => {
                  if (tab === "Permissions") {
                    setNewBookingLab("Attendance Make-up Lab (Lab 4 - Saturday)");
                    setPermissionsTab("bookings");
                  }
                  setActiveNav(tab);
                }}
                baseScore={successScore}
                attendanceRate={attendanceRate}
              />
            )
          )}

          {/* ======================================================== */}
          {/* VIEW D: MY ACTION PLAN & INTERVENTIONS                    */}
          {/* ======================================================== */}
          {activeNav === "Interventions" && (
            <ActionPlanStudio
              onNavigateTab={(tab) => {
                if (tab === "Permissions") {
                  setNewBookingLab("Attendance Make-up Lab (Lab 4 - Saturday)");
                  setPermissionsTab("bookings");
                }
                setActiveNav(tab);
              }}
              successScore={successScore}
              onOpenDsaModal={() => setIsDsaModalOpen(true)}
            />
          )}


          {/* ======================================================== */}
          {/* VIEW: DEDICATED ATTENDANCE MANAGEMENT SYSTEM              */}
          {/* ======================================================== */}
          {activeNav === "Attendance" && (
            <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-200">
              <AttendanceDashboard
                studentName="Ananya V."
                rollNumber="21BCE1089"
                initialAttendanceRate={attendanceRate}
                onNavigateTab={(tab) => {
                  if (tab === "Interventions") {
                    setActiveNav("Interventions");
                  } else if (tab === "Permissions") {
                    setActiveNav("Permissions");
                  } else if (tab === "360 Record") {
                    setActiveNav("360 Record");
                  } else {
                    setActiveNav(tab);
                  }
                }}
                onBookMakeUpLab={() => {
                  setActiveNav("Permissions");
                  setPermissionsTab("bookings");
                  setIsBookingModalOpen(true);
                }}
                onSubmitOD={() => {
                  setActiveNav("Permissions");
                  setPermissionsTab("requests");
                  setIsLeaveModalOpen(true);
                }}
              />
            </div>
          )}

          {/* ======================================================== */}
          {/* VIEW E: STUDENT 360° PROFILE / ACADEMIC PERFORMANCE      */}
          {/* ── Academic Performance ───────────────────────────────── */}
          {activeNav === "Academic Performance" && (
            <AcademicPerformanceScreen
              onNavigateTab={(tab) => {
                if (tab === "Interventions") setActiveNav("Interventions");
                else if (tab === "Attendance") setActiveNav("Attendance");
                else if (tab === "Success Score") setActiveNav("Success Score");
                else setActiveNav(tab);
              }}
            />
          )}

          {/* ======================================================== */}
          {(activeNav === "360 Record" ||
            (activeNav === "Student Roster" && (userRole === "admin" || (userRole === "faculty" && selectedFacultyStudent)))) && (
            <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
              {/* Administrative & Faculty Inspection Banner */}
              {(userRole === "admin" || userRole === "faculty") && (
                <div className="bg-purple-900/10 border-2 border-purple-400/50 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-purple-950 shadow-sm">
                  <div className="flex items-center gap-3.5">
                    <span className="w-10 h-10 rounded-2xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      360°
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-black uppercase tracking-wider text-purple-950">
                          {userRole === "admin" ? "Administrative Audit Desk · Student Drilldown" : "Faculty Inspection Desk · Student Drilldown"}
                        </h4>
                        <span className="text-[10px] font-extrabold bg-purple-200/80 text-purple-900 px-2 py-0.5 rounded-full">
                          {userRole === "admin" ? "Office of the Registrar" : "Dr. Srinivas Rao (HOD)"}
                        </span>
                      </div>
                      <p className="text-xs text-purple-800 mt-0.5">
                        Inspecting {selectedFacultyStudent ? `student ${selectedFacultyStudent}` : "Ananya V. (21BCE1089)"}&apos;s individual record, predictive risk flags, and intervention history.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
                    {userRole === "faculty" && (
                      <button
                        onClick={() => setSelectedFacultyStudent(null)}
                        className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>← Back to Class Roster</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserRole("student");
                        setActiveNav("Overview");
                      }}
                      className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                    >
                      <span>Switch to Student View</span>
                    </button>
                    <button
                      onClick={() => setActiveNav("Batch Cockpit")}
                      className="px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold transition-all cursor-pointer"
                    >
                      ← Back to Cockpit
                    </button>
                  </div>
                </div>
              )}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 ring-2 ring-[#00D2EA]">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=160"
                        alt="Ananya V"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-xl font-bold text-[#11233D]">Ananya V.</h2>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          Enrolled · Year 4
                        </span>
                        <span className="bg-[#00CEE6]/20 text-[#11233D] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-[#00CEE6]/40">
                          Segment 3: High Skill · Attendance-Constrained
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Roll: <strong>21BCE1089</strong> · Computer Science & Engineering · Section B
                      </p>
                      <p className="text-xs text-[#7C5CFC] font-semibold mt-0.5">
                        Mentor: Dr. K. Srinivas Rao · Academic Advisor
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src="/brand/logo-transparent.png"
                      alt="Campus 2 Career Logo"
                      className="h-10 w-auto object-contain hidden md:block opacity-90"
                    />
                    <button
                      onClick={handleExportPDF}
                      className="bg-slate-100 hover:bg-slate-200 text-[#0F1E36] px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-[#825FEF]" />
                      <span>Export 360° PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveQRPassData({
                          title: "Student Identity Pass · Roll 21BCE1089",
                          facility: "Campus-Wide Gate & Academic Entry",
                          time: "Enrolled Valid Through 2026",
                          id: "STU-ID-21BCE1089",
                        });
                        setIsQRModalOpen(true);
                      }}
                      className="bg-[#00D2EA] hover:bg-[#00BCD4] text-[#0F1E36] px-4 py-2 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Student ID QR</span>
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-b border-slate-100 text-xs font-bold text-slate-500">
                  <button
                    onClick={() => {
                      setActiveNav("Academic Performance");
                    }}
                    className="pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 border-transparent hover:text-[#0F1E36]"
                  >
                    <img src="/brand/icons/academic.png" alt="Academic Performance" className="w-4 h-4 object-contain inline-block" />
                    <span>Academics & GPA</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveNav("Attendance");
                      setProfileTab("attendance");
                    }}
                    className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
                      profileTab === "attendance" ? "border-[#00D2EA] text-[#0F1E36]" : "border-transparent hover:text-[#0F1E36]"
                    }`}
                  >
                    <img src="/brand/icons/attendance.png" alt="Attendance" className="w-4 h-4 object-contain inline-block" />
                    <span>Attendance Records</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileTab("projects");
                      if (activeNav !== "360 Record") setActiveNav("360 Record");
                    }}
                    className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer ${
                      profileTab === "projects" ? "border-[#00D2EA] text-[#0F1E36]" : "border-transparent hover:text-[#0F1E36]"
                    }`}
                  >
                    Verified Projects (Portfolio)
                  </button>
                  <button
                    onClick={() => {
                      setProfileTab("clearance");
                      if (activeNav !== "360 Record") setActiveNav("360 Record");
                    }}
                    className={`pb-3 px-3 transition-colors border-b-2 cursor-pointer ${
                      profileTab === "clearance" ? "border-[#00D2EA] text-[#0F1E36]" : "border-transparent hover:text-[#0F1E36]"
                    }`}
                  >
                    Placement Clearance
                  </button>
                </div>

                {/* Sub-tab views */}
                {profileTab === "academics" && (
                  <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F5F8FA] border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Cumulative CGPA</span>
                      <p className="text-2xl font-black text-[#0F1E36] mt-1">8.42</p>
                      <span className="text-[10px] text-emerald-600 font-bold">First Class Distinction</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F5F8FA] border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Active Backlogs</span>
                      <p className="text-2xl font-black text-emerald-600 mt-1">0</p>
                      <span className="text-[10px] text-slate-400">All cleared</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F5F8FA] border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Earned Credits</span>
                      <p className="text-2xl font-black text-[#0F1E36] mt-1">146 / 160</p>
                      <span className="text-[10px] text-slate-400">91% complete</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#F5F8FA] border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Sem 6 SGPA</span>
                      <p className="text-2xl font-black text-[#7C5CFC] mt-1">8.75</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">+0.3 increase</span>
                    </div>
                  </div>
                )}

                {profileTab === "attendance" && (
                  <div className="pt-6 space-y-6">
                    <AttendanceDashboard
                      studentName="Ananya V."
                      rollNumber="21BCE1089"
                      initialAttendanceRate={attendanceRate}
                      onNavigateTab={(tab) => {
                        if (tab === "Interventions") {
                          setActiveNav("Interventions");
                        } else if (tab === "Permissions") {
                          setActiveNav("Permissions");
                        } else if (tab === "360 Record") {
                          setActiveNav("360 Record");
                        } else {
                          setActiveNav(tab);
                        }
                      }}
                      onBookMakeUpLab={() => {
                        setActiveNav("Permissions");
                        setPermissionsTab("bookings");
                        setIsBookingModalOpen(true);
                      }}
                      onSubmitOD={() => {
                        setActiveNav("Permissions");
                        setPermissionsTab("requests");
                        setIsLeaveModalOpen(true);
                      }}
                    />
                  </div>
                )}

                {profileTab === "projects" && (
                  <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#F5F8FA] border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#0F1E36]">Campus Navigator IoT App</h4>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          Faculty Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Indoor beacon positioning for university navigation and automated lab attendance.
                      </p>
                      <div className="flex gap-1.5 mt-3">
                        <span className="bg-white border border-slate-200 text-[#0F1E36] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          React Native
                        </span>
                        <span className="bg-white border border-slate-200 text-[#0F1E36] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Node.js
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#F5F8FA] border border-slate-200">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#0F1E36]">Career AI Recommender</h4>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                          Faculty Verified
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Personalized career milestone tracker with Next.js, AI Decision Engine, and PostgreSQL.
                      </p>
                      <div className="flex gap-1.5 mt-3">
                        <span className="bg-white border border-slate-200 text-[#0F1E36] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Next.js
                        </span>
                        <span className="bg-white border border-slate-200 text-[#0F1E36] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          PostgreSQL
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {profileTab === "clearance" && (
                  <div className="pt-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-700 font-semibold">Institutional Status</span>
                      <h4 className="text-base font-bold text-amber-950">
                        {attendanceRate.includes("75")
                          ? "Tier-1 Placement Eligibility: Cleared"
                          : "Tier-1 Placement Eligibility: Conditional"}
                      </h4>
                      <p className="text-xs text-amber-800 mt-0.5">
                        {attendanceRate.includes("75")
                          ? "All academic and attendance benchmarks cleared. Student eligible for all Super-Dream corporate drives."
                          : "Academics cleared (8.42 CGPA > 7.0 bar). Clearance conditional upon completing attendance make-up labs."}
                      </p>
                    </div>
                    {attendanceRate.includes("75") ? (
                      <span className="bg-emerald-200 text-emerald-900 text-xs font-bold px-3 py-1.5 rounded-full">
                        Eligible
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveNav("Interventions")}
                        className="bg-amber-200 hover:bg-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer"
                      >
                        Resolve in Interventions
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* KPMG Requirement 1: Unified Student Data Integration */}
              <UnifiedDataPipeline />
            </div>
          )}




          {/* ======================================================== */}
          {/* ADMIN VIEW: OFFICIAL PERMISSION LETTERS & GOVERNANCE     */}
          {/* ======================================================== */}
          {userRole === "admin" && activeNav === "Permissions" && (
            <AdminPermissionsGovernance
              requests={sharedPermissions}
              onApprove={handleApprovePermission}
              onReject={handleRejectPermission}
              onNavigate={(tab) => setActiveNav(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* STUDENT VIEW: MY PERMISSION LETTERS & CAMPUS PASSES       */}
          {/* ======================================================== */}
          {userRole === "student" && activeNav === "Permissions" && (
            <StudentPermissionsView
              permissions={sharedPermissions.filter(
                (r) => r.student === "Ananya V." || r.roll === "21BCE1089" || r.roll === "21BCE1064"
              )}
              onAddPermission={handleAddPermission}
              onOpenQR={() => setIsQRModalOpen(true)}
              onNavigateTab={(tab) => setActiveNav(tab)}
            />
          )}
        </main>
      </div>

      {/* ======================================================== */}
      {/* 3. MODALS (QR Access Pass, Pathway Modal, Practice, Bookings) */}
      {/* ======================================================== */}

      {/* Pathway Modal */}
      {exploredPathwayModal && (
        <div
          onClick={() => setExploredPathwayModal(null)}
          className="fixed inset-0 bg-[#11233D]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative"
          >
            <button
              onClick={() => setExploredPathwayModal(null)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#11233D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {(() => {
              const current = pathways.find((p) => p.id === exploredPathwayModal);
              if (!current) return null;
              return (
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#00CEE6]/15 text-[#11233D] text-xs font-bold mb-3 border border-[#00CEE6]/30">
                    Pathway Module
                  </div>
                  <h3 className="text-2xl font-bold text-[#11233D]">{current.name}</h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{current.description}</p>
                  <div className="my-5 p-4 rounded-2xl bg-[#EFF4F7] border border-slate-100">
                    <p className="text-xs font-bold text-[#825FEF] uppercase tracking-wider mb-2">Key Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {current.tags.map((tag) => (
                        <span key={tag} className="bg-white border border-slate-200 text-[#11233D] text-xs px-2.5 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500 font-medium">{current.stats}</span>
                    <button
                      onClick={() => {
                        setSelectedPathway(current.id);
                        setExploredPathwayModal(null);
                        setActiveNav("Career Paths");
                      }}
                      className="bg-[#11233D] text-white hover:bg-[#00CEE6] hover:text-[#11233D] px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore Pathway</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Remedial DSA Practice Module Modal */}
      {isDsaModalOpen && (
        <div
          onClick={() => setIsDsaModalOpen(false)}
          className="fixed inset-0 bg-[#11233D]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative space-y-4"
          >
            <button
              onClick={() => setIsDsaModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#11233D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 uppercase tracking-wider">
                Assigned Remedial Module · Prof. S. Sharma
              </span>
              <h3 className="text-xl font-bold text-[#0F1E36] mt-1">
                Remedial DSA Practice: Arrays & Graph Traversal
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pass test suites to restore placement coding eligibility and earn <strong>+8 Points</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0F1E36] text-white space-y-2 font-mono text-xs shadow-inner">
              <div className="flex justify-between items-center text-slate-400 text-[10px] pb-1 border-b border-white/10">
                <span>Problem 1 of 5: Rotated Sorted Array BFS</span>
                <span className="text-[#00D2EA]">TypeScript 5.0</span>
              </div>
              <pre className="text-[11px] text-emerald-400 overflow-x-auto py-1">
{`function findMinInRotated(nums: number[]): number {
  let [left, right] = [0, nums.length - 1];
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] > nums[right]) left = mid + 1;
    else right = mid;
  }
  return nums[left];
}`}
              </pre>
            </div>

            {/* Test Case Execution Output */}
            <div className="p-3.5 rounded-2xl bg-[#F5F8FA] border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#11233D]">Test Suite Execution</span>
                <span className="text-[10px] font-mono text-slate-400">
                  {dsaTestStep === "passed" ? "5 of 5 Passed" : dsaTestStep === "running" ? "Running..." : "Not run"}
                </span>
              </div>

              {dsaTestStep === "running" && (
                <div className="flex items-center gap-2 py-2 text-xs text-slate-600">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#00CEE6]" />
                  <span>Executing edge test cases on virtual sandbox...</span>
                </div>
              )}

              {dsaTestStep === "passed" && (
                <div className="space-y-1 text-[11px] text-emerald-700 font-semibold py-1">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test 1: Single element array [1] ➔ Passed (0ms)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test 2: Rotated 4 times [4,5,6,7,0,1,2] ➔ Passed (1ms)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test 3: Graph BFS pathfinder with cycle ➔ Passed (2ms)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRunDsaTests}
                disabled={dsaTestStep === "running"}
                className="bg-slate-100 hover:bg-slate-200 text-[#0F1E36] px-4 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Run 5 Test Cases</span>
              </button>

              <button
                onClick={handleSubmitDsaModule}
                disabled={dsaTestStep !== "passed"}
                className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 cursor-pointer ${
                  dsaTestStep === "passed"
                    ? "bg-[#00D2EA] hover:bg-[#00BCD4] text-[#0F1E36] shadow-md hover:scale-105"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                <span>Submit & Claim +8 Points</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book a Lab Modal */}
      {isBookingModalOpen && (
        <div
          onClick={() => setIsBookingModalOpen(false)}
          className="fixed inset-0 bg-[#11233D]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative space-y-4"
          >
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#11233D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-bold border border-cyan-200 uppercase tracking-wider">
                Facility & Lab Reservation
              </span>
              <h3 className="text-xl font-bold text-[#0F1E36] mt-1">Book a Lab Session</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Reserve project labs, make-up sessions, or interview booths with instant QR passes.
              </p>
            </div>

            <form onSubmit={handleCreateBooking} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-[#11233D] mb-1">Select Facility / Room</label>
                <select
                  value={newBookingLab}
                  onChange={(e) => setNewBookingLab(e.target.value)}
                  className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
                >
                  <option value="Attendance Make-up Lab (Lab 4 - Saturday)">
                    Attendance Make-up Lab (Lab 4 - Saturday) · Clears Deficit
                  </option>
                  <option value="Electronics & IoT Lab (Lab 3)">Electronics & IoT Lab (Lab 3)</option>
                  <option value="AI & High-Performance Computing (Lab 1)">AI & HPC Lab (Lab 1)</option>
                  <option value="Mock Technical Interview Booth (Booth B)">Mock Interview Booth (Booth B)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#11233D] mb-1">Time Slot & Date</label>
                <select
                  value={newBookingSlot}
                  onChange={(e) => setNewBookingSlot(e.target.value)}
                  className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
                >
                  <option value="Saturday, Oct 17 · 10:00 AM - 12:00 PM">
                    Saturday, Oct 17 · 10:00 AM - 12:00 PM
                  </option>
                  <option value="Tomorrow, Oct 13 · 02:00 PM - 04:00 PM">
                    Tomorrow, Oct 13 · 02:00 PM - 04:00 PM
                  </option>
                  <option value="Monday, Oct 19 · 11:00 AM - 01:00 PM">
                    Monday, Oct 19 · 11:00 AM - 01:00 PM
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#11233D] mb-1">Purpose / Course Ref</label>
                <input
                  type="text"
                  value={newBookingPurpose}
                  onChange={(e) => setNewBookingPurpose(e.target.value)}
                  className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
                  placeholder="e.g. Compensatory Attendance Lab"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Leave / OD Request Modal */}
      {isLeaveModalOpen && (
        <div
          onClick={() => setIsLeaveModalOpen(false)}
          className="fixed inset-0 bg-[#11233D]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative space-y-4"
          >
            <button
              onClick={() => setIsLeaveModalOpen(false)}
              className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#11233D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 uppercase tracking-wider">
                Institutional Permissions
              </span>
              <h3 className="text-xl font-bold text-[#0F1E36] mt-1">Submit Leave / On-Duty Request</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Requests are routed automatically to your Academic Advisor and HOD.
              </p>
            </div>

            <form onSubmit={handleCreateLeaveRequest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#11233D] mb-1">Permission Type</label>
                <select
                  value={newLeaveType}
                  onChange={(e) => setNewLeaveType(e.target.value)}
                  className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
                >
                  <option value="On-Duty (OD)">On-Duty (Hackathon / Conference / Project)</option>
                  <option value="Placement Drive OD">Placement Drive Off-Campus OD</option>
                  <option value="Medical Leave">Medical Leave</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#11233D] mb-1">Event / Subject Title</label>
                <input
                  type="text"
                  value={newLeaveTitle}
                  onChange={(e) => setNewLeaveTitle(e.target.value)}
                  className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
                  placeholder="e.g. Smart India Hackathon Grand Finale"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#11233D] mb-1">From Date</label>
                  <input
                    type="date"
                    value={newLeaveFrom}
                    onChange={(e) => setNewLeaveFrom(e.target.value)}
                    className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#11233D]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#11233D] mb-1">To Date</label>
                  <input
                    type="date"
                    value={newLeaveTo}
                    onChange={(e) => setNewLeaveTo(e.target.value)}
                    className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#11233D]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#11233D] mb-1">Approver</label>
                <select
                  value={newLeaveApprover}
                  onChange={(e) => setNewLeaveApprover(e.target.value)}
                  className="w-full bg-[#F5F8FA] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#11233D]"
                >
                  <option value="HOD (CSE Dept)">HOD (CSE Dept) · Dr. Srinivas</option>
                  <option value="Academic Advisor">Academic Advisor · Dr. Rao</option>
                  <option value="Placement Head">Placement Head · Prof. Sharma</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#00D2EA] hover:bg-[#00BCD4] text-[#0F1E36] px-5 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Verified QR Access Pass Modal */}
      {isQRModalOpen && (
        <div
          onClick={() => setIsQRModalOpen(false)}
          className="fixed inset-0 bg-[#11233D]/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center relative"
          >
            <button
              onClick={() => setIsQRModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-[#11233D] flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full mb-3 border border-emerald-200">
              Ready to Scan · Verified Pass
            </span>
            <h4 className="text-xl font-bold text-[#0F1E36]">{activeQRPassData.title}</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">{activeQRPassData.time}</p>

            <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#00D2EA] inline-block shadow-inner mb-4">
              <QRCodeSVG
                value={`https://campus2career.edu/verify/pass/${activeQRPassData.id}`}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#0F1E36"}
                level={"H"}
              />
            </div>

            <p className="text-[11px] text-[#7C5CFC] font-mono font-semibold">ID: {activeQRPassData.id}</p>

            <button
              onClick={() => setIsQRModalOpen(false)}
              className="w-full mt-4 bg-[#0F1E36] text-white hover:bg-[#00CEE6] hover:text-[#0F1E36] text-xs font-bold py-2.5 rounded-full transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
