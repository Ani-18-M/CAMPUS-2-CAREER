"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Briefcase,
  Users,
  GraduationCap,
  Lightbulb,
  Settings,
  FileText,
  FlaskConical,
  UserCheck,
  Mic,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Globe,
  CheckCircle2,
  Compass,
} from "lucide-react";
import CareerPathCenterOrb from "@/components/action-plan/CareerPathCenterOrb";

interface Point {
  x: number;
  y: number;
}

interface WebSource {
  title: string;
  domain: string;
  url: string;
  category: string;
}

interface CleanPathwayData {
  id: string;
  name: string;
  query: string;
  badge: string;
  takeaways: { bold: string; text: string }[];
  sources: WebSource[];
  steps: { phase: string; title: string; detail: string }[];
}

interface PathwayOrbHubProps {
  selectedPathway: string | null;
  onSelectPathway: (id: string) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  voiceQuery?: string;
  onExploreDetails?: (id: string) => void;
}

const LEFT_TILES = [
  {
    id: "placements",
    name: "Placements & Jobs",
    sub: "Resume • Interviews • Job matches",
    Icon: Briefcase,
    color: "#00CEE6",
  },
  {
    id: "internships",
    name: "Internships",
    sub: "Experience • Industry projects",
    Icon: Users,
    color: "#00CEE6",
  },
  {
    id: "higher-studies",
    name: "Higher Studies",
    sub: "Masters • Study abroad • Scholarships",
    Icon: GraduationCap,
    color: "#825FEF",
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    sub: "Ideas • Incubators • Funding",
    Icon: Lightbulb,
    color: "#00CEE6",
  },
];

const RIGHT_TILES = [
  {
    id: "skills",
    name: "Skills & Certifications",
    sub: "Skill gaps • Learning paths",
    Icon: Settings,
    color: "#825FEF",
  },
  {
    id: "exams",
    name: "Competitive Exams",
    sub: "GATE • CAT • Government careers",
    Icon: FileText,
    color: "#00CEE6",
  },
  {
    id: "research",
    name: "Research & Innovation",
    sub: "Research • Hackathons • Projects",
    Icon: FlaskConical,
    color: "#825FEF",
  },
  {
    id: "mentors",
    name: "Mentors & Guidance",
    sub: "Career advice • Alumni connections",
    Icon: UserCheck,
    color: "#ACBACC",
  },
];

const ALL_TILES = [...LEFT_TILES, ...RIGHT_TILES];

// ─────────────────────────────────────────────────────────────────────────────
// ULTRA-CLEAN, HIGH-CLARITY AI PATHWAY DATA (MINIMAL TEXT · ZERO CLUTTER)
// ─────────────────────────────────────────────────────────────────────────────
const CLEAN_PATHWAY_DATA: Record<string, CleanPathwayData> = {
  placements: {
    id: "placements",
    name: "Placements & Jobs",
    query: "Tier-1 Product Placements & High-CTC Roles",
    badge: "Placement Cockpit",
    takeaways: [
      { bold: "DSA Mastery", text: "Solve Blind 75 patterns (Trees, DP, Graphs) on LeetCode with optimal Big-O complexity." },
      { bold: "ATS Resume", text: "Highlight 2 production full-stack projects with live demo URLs and quantifiable metrics." },
      { bold: "Eligibility Benchmark", text: "Maintain ≥7.50 aggregate CGPA with zero active backlogs for Day-1 hiring drives." },
    ],
    sources: [
      { title: "Top 150 Interview Problem Set", domain: "leetcode.com", url: "https://leetcode.com/problemset/all/", category: "DSA" },
      { title: "Fresher Compensation & SDE Bands", domain: "levels.fyi", url: "https://www.levels.fyi/", category: "Salaries" },
      { title: "Campus Hiring & Direct Applications", domain: "linkedin.com", url: "https://www.linkedin.com/jobs/", category: "Jobs" },
      { title: "Core CS Revision (OS, DBMS, Networks)", domain: "geeksforgeeks.org", url: "https://www.geeksforgeeks.org/", category: "CS Core" },
    ],
    steps: [
      { phase: "Phase 1 (Weeks 1–4)", title: "Algorithmic Problem Solving", detail: "Speed coding on Arrays, Binary Trees, HashMaps, and Sliding Window." },
      { phase: "Phase 2 (Weeks 5–8)", title: "Core CS & Low-Level Design", detail: "Operating Systems threads, SQL indexing, and object-oriented design patterns." },
      { phase: "Phase 3 (Weeks 9–12)", title: "Mock Interviews & ATS Resume", detail: "6 peer mock interviews and finalization of 1-page single-column resume." },
    ],
  },

  internships: {
    id: "internships",
    name: "Internships",
    query: "Pre-Final Year Tech & Research Internships",
    badge: "Industry Exposure",
    takeaways: [
      { bold: "Recruitment Window", text: "Applications open 6–9 months ahead (August for MNCs, January for startups)." },
      { bold: "Proof of Work", text: "Merged GitHub pull requests and deployed web applications strongly boost shortlists." },
      { bold: "PPO Direct Conversion", text: "Over 72% of summer internships convert into direct full-time placement offers." },
    ],
    sources: [
      { title: "Verified Summer Tech Internships", domain: "internshala.com", url: "https://internshala.com/", category: "Internships" },
      { title: "Global Open Source Fellowships", domain: "github.com", url: "https://github.com/explore", category: "Open Source" },
      { title: "Cloud Credits & Developer Student Pack", domain: "github.com", url: "https://education.github.com/pack", category: "Dev Tools" },
      { title: "High-Growth Startup Opportunities", domain: "wellfound.com", url: "https://wellfound.com/", category: "Startups" },
    ],
    steps: [
      { phase: "Month 1", title: "Deploy Production Portfolio", detail: "Publish 1 full-stack app on Vercel/AWS with clear architecture documentation." },
      { phase: "Month 2", title: "Open Source & Cold Outreach", detail: "Contribute to 3 open issues and send personalized value emails to tech leads." },
      { phase: "Month 3", title: "Technical Pair Programming", detail: "Practice live coding rounds and clarify expectations for PPO conversion." },
    ],
  },

  "higher-studies": {
    id: "higher-studies",
    name: "Higher Studies",
    query: "MS in Computer Science (US, Germany & Global)",
    badge: "Graduate Admissions",
    takeaways: [
      { bold: "Academic Profile", text: "Target ≥8.20 CGPA and 165+ Quant on GRE for top 30 global computer science schools." },
      { bold: "Research Differentiation", text: "Co-authored conference papers with department faculty strongly elevate admissions." },
      { bold: "Funded Assistantships", text: "Submit by December priority deadlines for RA/TA tuition waiver scholarships." },
    ],
    sources: [
      { title: "Official GRE & TOEFL Test Bookings", domain: "ets.org", url: "https://www.ets.org/gre.html", category: "Testing" },
      { title: "Top Graduate Computer Science Schools", domain: "usnews.com", url: "https://www.usnews.com/best-graduate-schools/top-science-schools/computer-science-rankings", category: "Rankings" },
      { title: "Tuition-Free European Masters Portal", domain: "daad.de", url: "https://www.daad.de/en/", category: "Europe" },
      { title: "Global University Reputation Rankings", domain: "topuniversities.com", url: "https://www.topuniversities.com/", category: "QS Index" },
    ],
    steps: [
      { phase: "Sem 5–6", title: "GRE/TOEFL & Research Paper", detail: "Target 320+ GRE and submit a paper with your laboratory supervisor." },
      { phase: "Jul–Aug", title: "University Shortlisting & SOP", detail: "Select 8–10 universities (Dream, Target, Safe) and draft custom SOPs." },
      { phase: "Sep–Dec", title: "Faculty LORs & Submissions", detail: "Secure 3 signed faculty recommendations and submit before priority deadlines." },
    ],
  },

  entrepreneurship: {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    query: "Campus Startup Validation & Seed Grants",
    badge: "Venture Incubation",
    takeaways: [
      { bold: "Problem Validation", text: "Interview 30 prospective users before coding to confirm genuine willingness to pay." },
      { bold: "Zero Equity Incubation", text: "College incubator grants 24/7 prototyping lab access with 100% student IP ownership." },
      { bold: "Government Grants", text: "Apply for ₹5L–₹20L non-dilutive seed funding via Startup India SISFS and NIDHI." },
    ],
    sources: [
      { title: "Free Founder Curriculum & Lectures", domain: "ycombinator.com", url: "https://www.startupschool.org/", category: "YC School" },
      { title: "DPIIT Recognition & Seed Grants", domain: "startupindia.gov.in", url: "https://www.startupindia.gov.in/", category: "Govt Grants" },
      { title: "Premier Student Incubation Cohorts", domain: "nsrcel.org", url: "https://nsrcel.org/", category: "Incubators" },
      { title: "MVP Launch & Early User Acquisition", domain: "producthunt.com", url: "https://www.producthunt.com/", category: "Launches" },
    ],
    steps: [
      { phase: "Weeks 1–3", title: "Customer Problem Discovery", detail: "Conduct 30 user interviews and measure real demand with a waitlist page." },
      { phase: "Weeks 4–8", title: "Rapid MVP Sprint", detail: "Build and deploy a functional version 1.0 with 50 active campus beta testers." },
      { phase: "Weeks 9–12", title: "Seed Grants & Incubation", detail: "Pitch to college incubation board and register official DPIIT recognition." },
    ],
  },

  skills: {
    id: "skills",
    name: "Skills & Certifications",
    query: "Industry Cloud, DevOps & Full-Stack Certifications",
    badge: "Skill Specialization",
    takeaways: [
      { bold: "Hiring Acceleration", text: "Industry credentials (AWS SAA, CKA) increase fresher interview shortlists by +28%." },
      { bold: "Hands-on Verification", text: "Pair theoretical credentials with GitHub repositories showing automated CI/CD." },
      { bold: "Institutional Subsidy", text: "College academic council provides up to 100% reimbursement on approved exam fees." },
    ],
    sources: [
      { title: "AWS Solutions Architect Associate Track", domain: "aws.amazon.com", url: "https://aws.amazon.com/certification/", category: "Cloud" },
      { title: "Stanford & DeepLearning.AI Specialization", domain: "coursera.org", url: "https://www.coursera.org/", category: "AI / ML" },
      { title: "Full-Stack Developer Hands-on Curriculum", domain: "freecodecamp.org", url: "https://www.freecodecamp.org/", category: "Web Dev" },
      { title: "Certified Kubernetes Administrator (CKA)", domain: "cncf.io", url: "https://www.cncf.io/certification/cka/", category: "DevOps" },
    ],
    steps: [
      { phase: "Weeks 1–3", title: "Cloud Architecture Foundations", detail: "Build serverless microservices with AWS Lambda, DynamoDB, and API Gateway." },
      { phase: "Weeks 4–6", title: "Docker & Kubernetes Deployment", detail: "Containerize apps, deploy to a K8s cluster, and automate GitHub Actions." },
      { phase: "Weeks 7–8", title: "Practice Exam & Credential Badging", detail: "Score 85%+ on timed mock exams and publish verifiable Credly badges." },
    ],
  },

  exams: {
    id: "exams",
    name: "Competitive Exams",
    query: "GATE CSE & CAT Preparation Strategy",
    badge: "Public Sector & Management",
    takeaways: [
      { bold: "Direct PSU Recruitment", text: "Top 300 AIR in GATE unlocks ₹18–22 LPA officer roles in IOCL, ONGC, NTPC, and ISRO." },
      { bold: "High-Weightage Focus", text: "Discrete Math, Algorithms, OS, and DBMS account for ~65% of total GATE marks." },
      { bold: "Mock Simulation", text: "Solve 15 full-length timed tests on the official virtual calculator test environment." },
    ],
    sources: [
      { title: "GATE Official Syllabus & Previous Papers", domain: "gate2026.iit.ac.in", url: "https://gate.iitk.ac.in/", category: "GATE" },
      { title: "IIM CAT Eligibility & Cutoff Percentiles", domain: "iimcat.ac.in", url: "https://iimcat.ac.in/", category: "CAT" },
      { title: "UPSC Engineering & Civil Services", domain: "upsc.gov.in", url: "https://www.upsc.gov.in/", category: "UPSC" },
      { title: "Topic-Wise Notes & Solved Numericals", domain: "geeksforgeeks.org", url: "https://www.geeksforgeeks.org/gate-cs-notes-gq/", category: "Notes" },
    ],
    steps: [
      { phase: "Months 1–4", title: "Syllabus Coverage & PYQs", detail: "Complete theory and 10 years of previous questions for core subjects." },
      { phase: "Months 5–7", title: "Sectional Tests & Error Analysis", detail: "Take 2 sectional mock tests weekly and log every mistake in an error notebook." },
      { phase: "Final Month", title: "15 Full-Length Simulations", detail: "Simulate the exact 3-hour exam environment under strict time constraints." },
    ],
  },

  research: {
    id: "research",
    name: "Research & Innovation",
    query: "Academic Publishing & National Innovation Hackathons",
    badge: "Research & Patents",
    takeaways: [
      { bold: "Peer-Reviewed Impact", text: "Publishing 1 paper in IEEE/ACM conferences unlocks super-dream placement eligibility." },
      { bold: "National Hackathons", text: "Smart India Hackathon grand prize awards ₹1 Lakh with direct ministry pilot trials." },
      { bold: "Patent Filing Support", text: "College R&D cell funds 100% of filing and legal fees for student patent applications." },
    ],
    sources: [
      { title: "IEEE Xplore Conference Proceedings", domain: "ieeexplore.ieee.org", url: "https://ieeexplore.ieee.org/", category: "IEEE" },
      { title: "Open-Access Computer Science Preprints", domain: "arxiv.org", url: "https://arxiv.org/", category: "arXiv" },
      { title: "Smart India Hackathon Problem Statements", domain: "sih.gov.in", url: "https://www.sih.gov.in/", category: "Hackathons" },
      { title: "Kaggle Real-World Machine Learning Datasets", domain: "kaggle.com", url: "https://www.kaggle.com/", category: "Datasets" },
    ],
    steps: [
      { phase: "Month 1", title: "Topic Formulation & Literature Review", detail: "Review 15 recent IEEE papers to identify clear, quantifiable performance gaps." },
      { phase: "Months 2–3", title: "Benchmarking & SIH Hackathon", detail: "Run experiments on GPU clusters and submit team prototype to Smart India Hackathon." },
      { phase: "Month 4", title: "Manuscript Writing & Submission", detail: "Draft 6-page IEEE format paper with ablation studies and submit for review." },
    ],
  },

  mentors: {
    id: "mentors",
    name: "Mentors & Guidance",
    query: "Executive Alumni Mentorship & Referral Network",
    badge: "Alumni Advisory",
    takeaways: [
      { bold: "Internal Job Referrals", text: "Respectful warm outreach to alumni delivers 4x higher resume response rates from HR." },
      { bold: "Technical Mock Practice", text: "Conduct 1-on-1 mock interviews with senior engineers before campus placement drives." },
      { bold: "Direct Office Hours", text: "Book one-on-one advisory time with department faculty and alumni leaders via the portal." },
    ],
    sources: [
      { title: "Free 1-on-1 Global Tech Mentorship", domain: "adplist.org", url: "https://adplist.org/", category: "ADPList" },
      { title: "Institutional Alumni Directory & Network", domain: "alumni.nec.edu.in", url: "https://alumni.nec.edu.in/", category: "Alumni" },
      { title: "Specialized Mock Technical Interviews", domain: "topmate.io", url: "https://topmate.io/", category: "Mocks" },
      { title: "Professional Warm Outreach Playbook", domain: "linkedin.com", url: "https://www.linkedin.com/", category: "Networking" },
    ],
    steps: [
      { phase: "Week 1", title: "Alumni Directory Search", detail: "Identify 5 alumni in target companies and send concise 3-sentence introduction notes." },
      { phase: "Weeks 2–3", title: "1-on-1 Mock Interview & Resume Audit", detail: "Schedule 45-minute video call; implement specific feedback within 48 hours." },
      { phase: "Weeks 4–8", title: "Progress Update & Referral Requisition", detail: "Share milestone updates and request internal HR referral for active job IDs." },
    ],
  },
};

export default function PathwayOrbHub({
  selectedPathway,
  onSelectPathway,
  isVoiceActive,
  onToggleVoice,
  voiceQuery = "",
  onExploreDetails,
}: PathwayOrbHubProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const activeId = selectedPathway || "placements";

  // ── CINEMATIC AI TRANSITION STATES ──
  const [isAiView, setIsAiView] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPathwayId, setCurrentPathwayId] = useState<string>("placements");

  // Sequential top-to-bottom "printing" animation step (0 to 4)
  const [printStep, setPrintStep] = useState(0);

  // Dynamic thread connection coordinates for 8-tile hub view
  const hubRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const leftDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rightDotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [threadCoords, setThreadCoords] = useState<{
    orb: Point;
    lefts: (Point | null)[];
    rights: (Point | null)[];
  } | null>(null);

  const updateCoords = useCallback(() => {
    if (!hubRef.current || !orbRef.current || isAiView) return;
    const hubRect = hubRef.current.getBoundingClientRect();
    const orbRect = orbRef.current.getBoundingClientRect();

    const orbPoint: Point = {
      x: orbRect.left - hubRect.left + orbRect.width / 2,
      y: orbRect.top - hubRect.top + orbRect.height / 2,
    };

    const lefts = leftDotRefs.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - hubRect.left + r.width / 2,
        y: r.top - hubRect.top + r.height / 2,
      };
    });

    const rights = rightDotRefs.current.map((el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - hubRect.left + r.width / 2,
        y: r.top - hubRect.top + r.height / 2,
      };
    });

    setThreadCoords({
      orb: orbPoint,
      lefts,
      rights,
    });
  }, [isAiView]);

  useEffect(() => {
    let rAF: number | null = null;
    const scheduleUpdate = () => {
      if (rAF !== null) cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(() => {
        updateCoords();
        rAF = null;
      });
    };

    scheduleUpdate();
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && hubRef.current) {
      ro = new ResizeObserver(() => {
        scheduleUpdate();
      });
      ro.observe(hubRef.current);
    }

    const t1 = setTimeout(scheduleUpdate, 100);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      if (ro) ro.disconnect();
      if (rAF !== null) cancelAnimationFrame(rAF);
      clearTimeout(t1);
    };
  }, [updateCoords]);

  // ── SEQUENTIAL PRINTING ANIMATION FROM TOP TO DOWN ──
  const startPrintingSequence = (pathwayId: string) => {
    onSelectPathway(pathwayId);
    setCurrentPathwayId(pathwayId);
    setIsAiView(true);
    setIsGenerating(true);
    setPrintStep(0);

    // Step 1: Search bar prints in (300ms)
    setTimeout(() => {
      setPrintStep(1);
    }, 300);

    // Step 2: Key takeaways print down (700ms)
    setTimeout(() => {
      setPrintStep(2);
    }, 700);

    // Step 3: Verified Web Sources print down (1200ms)
    setTimeout(() => {
      setPrintStep(3);
    }, 1200);

    // Step 4: 3-Phase Roadmap prints down (1600ms)
    setTimeout(() => {
      setPrintStep(4);
    }, 1600);

    // Step 5: Printing finished, orb quartic deceleration initiates (2000ms)
    setTimeout(() => {
      setIsGenerating(false);
      setPrintStep(5);
    }, 2000);
  };

  const handleTileClick = (pathwayId: string) => {
    startPrintingSequence(pathwayId);
  };

  // Exit AI mode back to 8-tile hub view
  const handleBackToHub = () => {
    setIsAiView(false);
    setIsGenerating(false);
    setPrintStep(0);
    setTimeout(() => {
      updateCoords();
    }, 350);
  };

  const activeAiData = CLEAN_PATHWAY_DATA[currentPathwayId] || CLEAN_PATHWAY_DATA.placements;

  return (
    <div
      className={`relative w-full min-h-[calc(100vh-130px)] flex flex-col justify-center rounded-3xl overflow-hidden select-none transition-all duration-700 ease-in-out ${
        isAiView
          ? "bg-white text-slate-800 shadow-[0_20px_60px_-15px_rgba(17,35,61,0.08)] border-2 border-slate-200/90"
          : "text-white shadow-2xl border border-[#ACBACC]/20"
      }`}
      style={{
        background: isAiView
          ? "#FFFFFF"
          : "linear-gradient(165deg, #091528 0%, #11233D 50%, #081426 100%)",
      }}
    >
      {/* ── Ambient Background Lighting ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700">
        {!isAiView ? (
          <>
            {/* Concentric Water Waves & Caustic Ripples radiating from center orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[420px] pointer-events-none opacity-45">
              <div className="absolute inset-0 rounded-full border border-[#00CEE6]/25 animate-water-wave-1" />
              <div className="absolute inset-0 rounded-full border border-[#00CEE6]/20 animate-water-wave-2" />
              <div className="absolute inset-0 rounded-full border border-[#825FEF]/20 animate-water-wave-3" />
            </div>

            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-[140px]"
              style={{ background: "radial-gradient(circle, rgba(0,206,230,0.14) 0%, transparent 70%)" }}
            />
            <div
              className="absolute top-1/4 left-1/4 w-[360px] h-[360px] rounded-full blur-[110px]"
              style={{ background: "rgba(130,95,239,0.12)" }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] rounded-full blur-[100px]"
              style={{ background: "rgba(0,206,230,0.10)" }}
            />
            {/* Subtle grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(#ACBACC 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </>
        ) : (
          <>
            {/* Soft, clean, slow-emerging white ambience with subtle AI glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[680px] h-64 bg-gradient-to-b from-[#00CEE6]/8 via-[#825FEF]/5 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div
              className="absolute inset-0 opacity-[0.015]"
              style={{
                backgroundImage: "radial-gradient(#64748B 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VIEW A: AI INFORMATION PAGE (SLOW WHITE EMERGENCE)            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {isAiView ? (
        <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-10 flex flex-col items-center animate-in fade-in duration-700">
          {/* Top Bar: Prominent Back to 8 Pathways Button */}
          <div className="w-full flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handleBackToHub}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-[#11233D] hover:text-white text-[#11233D] text-xs font-black transition-all cursor-pointer shadow-xs border border-slate-200 group active:scale-95"
              title="Back to 8 Pathways Hub"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5] group-hover:-translate-x-1 transition-transform" />
              <span>Back to 8 Pathways</span>
            </button>

            {/* Pathway Category Pill */}
            <span className="text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#00CEE6]/15 text-[#0099B8] border border-[#00CEE6]/30">
              {activeAiData.badge}
            </span>
          </div>

          {/* ── 1. CENTERED ORB: MOVED STRAIGHT UP & ROTATING WHILE ANSWERING (NO TEXT OR MIC BELOW) ── */}
          <div className="flex flex-col items-center justify-center my-3 text-center">
            {/* Perfectly Centered 3D Rotating Gyroscope Orb */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center relative mx-auto">
              <CareerPathCenterOrb
                isVoiceActive={isVoiceActive}
                onToggleVoice={onToggleVoice}
                scale={0.52}
                isGenerating={isGenerating}
                hideControls={true}
                hideText={true}
              />
            </div>
          </div>

          {/* ── 2. PRINT STEP 1: CLEAN SEARCH BAR (PRINTS FROM TOP) ── */}
          <div
            className={`w-full max-w-xl mx-auto my-3 transition-all duration-500 ${
              printStep >= 1
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="flex items-center bg-[#F8FAFD] rounded-full border-2 border-slate-200/90 shadow-xs px-4 py-2.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-xs mr-2.5">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-black text-[#11233D] flex-1 truncate">
                {activeAiData.query}
              </span>
            </div>
          </div>

          {/* ── 3. PRINT STEP 2: MINIMAL AI SYNTHESIS (PRINTING TOP TO DOWN) ── */}
          <div
            className={`w-full transition-all duration-500 mt-2 ${
              printStep >= 2
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-2 h-2 rounded-full bg-[#00CEE6] shadow-[0_0_8px_#00CEE6]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#11233D]">
                  Key Actionable Insights
                </h4>
              </div>

              {/* 3 Crisp, Punchy Bullet Takeaways — Ultra Clean & Spacious */}
              <div className="space-y-2.5 pt-1">
                {activeAiData.takeaways.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#F8FAFD] border border-slate-100"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      <strong className="text-[#11233D] font-black">{item.bold}:</strong>{" "}
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4. PRINT STEP 3: VERIFIED WEB SOURCES (SLIDES IN BELOW) ── */}
          <div
            className={`w-full transition-all duration-500 mt-4 ${
              printStep >= 3
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#00CEE6]" />
                Verified Web Links & Portals
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                Click to explore
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {activeAiData.sources.map((src, sIdx) => (
                <a
                  key={sIdx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-white border-2 border-slate-200/80 hover:border-[#00CEE6] hover:shadow-md transition-all group flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold text-slate-400 block truncate">
                      {src.domain}
                    </span>
                    <h5 className="text-xs font-black text-[#11233D] group-hover:text-[#825FEF] transition-colors truncate">
                      {src.title}
                    </h5>
                  </div>
                  <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-[#00CEE6]/15 text-slate-500 group-hover:text-[#0099B8] flex items-center justify-center shrink-0 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* ── 5. PRINT STEP 4: 3-PHASE EXECUTION MILESTONES (BOTTOM PRINT) ── */}
          <div
            className={`w-full transition-all duration-500 mt-4 ${
              printStep >= 4
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-[28px] p-5 sm:p-6 border-2 border-slate-200/80 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Compass className="w-4 h-4 text-[#825FEF]" />
                <h4 className="text-xs font-black uppercase tracking-wider text-[#11233D]">
                  3-Step Execution Plan
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {activeAiData.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-[#F8FAFD] border border-slate-100 flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#825FEF] block mb-1">
                        {st.phase}
                      </span>
                      <h5 className="text-xs font-black text-[#11233D] mb-1">
                        {st.title}
                      </h5>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {st.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions: Back to 8 Pathways & Quick Hopper */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={handleBackToHub}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-[#11233D] hover:text-white text-slate-700 text-xs font-extrabold transition-all cursor-pointer border border-slate-200 group active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to 8 Pathways</span>
            </button>

            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end">
              <span className="text-[11px] font-black text-slate-400 mr-1 uppercase tracking-wider">
                Explore Another:
              </span>
              {ALL_TILES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => startPrintingSequence(t.id)}
                  className={`px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer border select-none ${
                    t.id === currentPathwayId
                      ? "bg-[#11233D] text-white border-[#11233D] shadow-2xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600 border-transparent"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ═══════════════════════════════════════════════════════════════ */
        /* VIEW B: 8-TILE CAROUSEL HUB (DEFAULT DARK COSMIC STAGE)        */
        /* ═══════════════════════════════════════════════════════════════ */
        <div className="relative z-10 px-4 py-8 sm:px-8 sm:py-10 max-w-6xl w-full mx-auto flex flex-col justify-center flex-1 transition-opacity duration-500">
          {/* Top Header Text */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
              Choose a career path.{" "}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #A0F2FA 50%, #00CEE6 100%)",
                }}
              >
                Get AI insights & web links.
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              Click on any tile below to launch the rotating AI engine and explore roadmaps, web sources, and cutoffs.
            </p>
          </div>

          {/* Main Stage: Left 4 Tiles | Center 3D Gyroscope Orb | Right 4 Tiles */}
          <div ref={hubRef} className="relative flex flex-col lg:flex-row items-center justify-between gap-6 xl:gap-8">
            {/* Living Neural Threads (Connecting White Floating Tiles to AI Orb) */}
            {threadCoords && (
              <svg
                className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-10"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <filter id="thread-glow-strong" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="3.5" result="blur1" />
                    <feGaussianBlur stdDeviation="1.5" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur1" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="thread-glow-soft" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Left Threads */}
                {LEFT_TILES.map((item, idx) => {
                  const p = threadCoords.lefts[idx];
                  if (!p) return null;
                  const isSelected = activeId === item.id;
                  const isHovered = hoveredId === item.id;
                  const dx = threadCoords.orb.x - p.x;
                  const c1x = p.x + dx * 0.42;
                  const c1y = p.y;
                  const c2x = threadCoords.orb.x - dx * 0.28;
                  const c2y = threadCoords.orb.y;
                  const pathD = `M ${p.x},${p.y} C ${c1x},${c1y} ${c2x},${c2y} ${threadCoords.orb.x},${threadCoords.orb.y}`;

                  return (
                    <g key={`thread-left-${item.id}`}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={
                          isSelected
                            ? "#00CEE6"
                            : isHovered
                            ? "#00CEE6"
                            : "rgba(0, 206, 230, 0.32)"
                        }
                        strokeWidth={isSelected ? 2.8 : isHovered ? 2.2 : 1.4}
                        strokeDasharray={isSelected ? "none" : "5 4"}
                        filter={isSelected ? "url(#thread-glow-strong)" : isHovered ? "url(#thread-glow-soft)" : "none"}
                        className="transition-all duration-300"
                      />

                      {/* Flowing Energy Particles */}
                      {(isSelected || isHovered) && (
                        <g>
                          <circle r="4" fill="#FFFFFF" filter="url(#thread-glow-strong)">
                            <animateMotion
                              path={pathD}
                              dur={isSelected ? "2.2s" : "3.2s"}
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle r="2.5" fill="#00CEE6">
                            <animateMotion
                              path={pathD}
                              dur={isSelected ? "2.2s" : "3.2s"}
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Right Threads */}
                {RIGHT_TILES.map((item, idx) => {
                  const p = threadCoords.rights[idx];
                  if (!p) return null;
                  const isSelected = activeId === item.id;
                  const isHovered = hoveredId === item.id;
                  const dx = p.x - threadCoords.orb.x;
                  const c1x = p.x - dx * 0.42;
                  const c1y = p.y;
                  const c2x = threadCoords.orb.x + dx * 0.28;
                  const c2y = threadCoords.orb.y;
                  const pathD = `M ${p.x},${p.y} C ${c1x},${c1y} ${c2x},${c2y} ${threadCoords.orb.x},${threadCoords.orb.y}`;

                  return (
                    <g key={`thread-right-${item.id}`}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={
                          isSelected
                            ? "#00CEE6"
                            : isHovered
                            ? "#00CEE6"
                            : "rgba(0, 206, 230, 0.32)"
                        }
                        strokeWidth={isSelected ? 2.8 : isHovered ? 2.2 : 1.4}
                        strokeDasharray={isSelected ? "none" : "5 4"}
                        filter={isSelected ? "url(#thread-glow-strong)" : isHovered ? "url(#thread-glow-soft)" : "none"}
                        className="transition-all duration-300"
                      />

                      {/* Flowing Energy Particles */}
                      {(isSelected || isHovered) && (
                        <g>
                          <circle r="4" fill="#FFFFFF" filter="url(#thread-glow-strong)">
                            <animateMotion
                              path={pathD}
                              dur={isSelected ? "2.2s" : "3.2s"}
                              repeatCount="indefinite"
                            />
                          </circle>
                          <circle r="2.5" fill="#00CEE6">
                            <animateMotion
                              path={pathD}
                              dur={isSelected ? "2.2s" : "3.2s"}
                              repeatCount="indefinite"
                            />
                          </circle>
                        </g>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* LEFT 4 TILES */}
            <div className="flex flex-col gap-4 w-full lg:w-[320px] xl:w-[340px] shrink-0 z-20">
              {LEFT_TILES.map((item) => {
                const Icon = item.Icon;
                const isSelected = activeId === item.id;
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative group transition-transform duration-300"
                  >
                    {/* Water Caustic Reflection Pool */}
                    <div
                      className={`absolute -bottom-2.5 left-4 right-4 h-3.5 rounded-full pointer-events-none transition-all duration-500 blur-md ${
                        isSelected
                          ? "bg-[#00CEE6]/40 scale-x-105"
                          : isHovered
                          ? "bg-[#00CEE6]/30 scale-x-100"
                          : "bg-[#00CEE6]/18 scale-x-95"
                      }`}
                    />

                    {/* Main White Floating Card */}
                    <div
                      onClick={() => handleTileClick(item.id)}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 select-none"
                      style={{
                        background: isSelected
                          ? "#FFFFFF"
                          : isHovered
                          ? "#FFFFFF"
                          : "linear-gradient(145deg, #FFFFFF 0%, #F8FAFD 100%)",
                        border: isSelected
                          ? "2.5px solid #00CEE6"
                          : isHovered
                          ? "1.5px solid rgba(0,206,230,0.75)"
                          : "1px solid rgba(226,232,240,0.95)",
                        boxShadow: isSelected
                          ? "0 0 28px rgba(0,206,230,0.48), 0 16px 36px -6px rgba(10,25,45,0.28)"
                          : isHovered
                          ? "0 0 20px rgba(0,206,230,0.28), 0 14px 28px -4px rgba(10,25,45,0.22)"
                          : "0 10px 24px -4px rgba(10,25,45,0.18), 0 4px 10px -2px rgba(10,25,45,0.1)",
                        transform: isSelected
                          ? "scale(1.025)"
                          : isHovered
                          ? "scale(1.02)"
                          : "scale(1)",
                      }}
                    >
                      {/* Connecting Node on Right Edge */}
                      <span
                        ref={(el) => {
                          const idx = LEFT_TILES.findIndex((t) => t.id === item.id);
                          if (idx >= 0) leftDotRefs.current[idx] = el;
                        }}
                        className="hidden lg:block absolute -right-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-30 transition-all duration-300"
                        style={{
                          background: isSelected ? "#00CEE6" : isHovered ? "#00CEE6" : "#38BDF8",
                          boxShadow: isSelected ? "0 0 14px #00CEE6" : "none",
                          border: "2px solid #FFFFFF",
                        }}
                      />

                      {/* Icon Box */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, #00CEE6 0%, #00B4D8 100%)"
                            : "rgba(0, 206, 230, 0.12)",
                          color: isSelected ? "#11233D" : "#0099B8",
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Title & Subtitle */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-[15px] font-extrabold tracking-tight truncate leading-tight text-[#11233D]">
                          {item.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5 leading-tight font-semibold">
                          {item.sub}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0099B8] hover:text-[#00CEE6] mt-1">
                          <span>Ask AI Advisor</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CENTER: 3D HOLOGRAPHIC GYROSCOPE ORB (NO TEXT OR MIC BELOW) */}
            <div
              ref={orbRef}
              className="relative shrink-0 flex flex-col items-center justify-center my-6 lg:my-0 z-20"
            >
              <div className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px] flex items-center justify-center relative">
                <CareerPathCenterOrb
                  isVoiceActive={isVoiceActive}
                  onToggleVoice={onToggleVoice}
                  scale={0.78}
                  isGenerating={isGenerating}
                  hideControls={true}
                  hideText={true}
                />
              </div>
            </div>

            {/* RIGHT 4 TILES */}
            <div className="flex flex-col gap-4 w-full lg:w-[320px] xl:w-[340px] shrink-0 z-20">
              {RIGHT_TILES.map((item) => {
                const Icon = item.Icon;
                const isSelected = activeId === item.id;
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="relative group transition-transform duration-300"
                  >
                    {/* Water Caustic Reflection Pool */}
                    <div
                      className={`absolute -bottom-2.5 left-4 right-4 h-3.5 rounded-full pointer-events-none transition-all duration-500 blur-md ${
                        isSelected
                          ? "bg-[#00CEE6]/40 scale-x-105"
                          : isHovered
                          ? "bg-[#00CEE6]/30 scale-x-100"
                          : "bg-[#00CEE6]/18 scale-x-95"
                      }`}
                    />

                    {/* Main White Floating Card */}
                    <div
                      onClick={() => handleTileClick(item.id)}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="relative flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl cursor-pointer transition-all duration-300 select-none"
                      style={{
                        background: isSelected
                          ? "#FFFFFF"
                          : isHovered
                          ? "#FFFFFF"
                          : "linear-gradient(145deg, #FFFFFF 0%, #F8FAFD 100%)",
                        border: isSelected
                          ? "2.5px solid #00CEE6"
                          : isHovered
                          ? "1.5px solid rgba(0,206,230,0.75)"
                          : "1px solid rgba(226,232,240,0.95)",
                        boxShadow: isSelected
                          ? "0 0 28px rgba(0,206,230,0.48), 0 16px 36px -6px rgba(10,25,45,0.28)"
                          : isHovered
                          ? "0 0 20px rgba(0,206,230,0.28), 0 14px 28px -4px rgba(10,25,45,0.22)"
                          : "0 10px 24px -4px rgba(10,25,45,0.18), 0 4px 10px -2px rgba(10,25,45,0.1)",
                        transform: isSelected
                          ? "scale(1.025)"
                          : isHovered
                          ? "scale(1.02)"
                          : "scale(1)",
                      }}
                    >
                      {/* Connecting Node on Left Edge */}
                      <span
                        ref={(el) => {
                          const idx = RIGHT_TILES.findIndex((t) => t.id === item.id);
                          if (idx >= 0) rightDotRefs.current[idx] = el;
                        }}
                        className="hidden lg:block absolute -left-[7px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-30 transition-all duration-300"
                        style={{
                          background: isSelected ? "#00CEE6" : isHovered ? "#00CEE6" : "#38BDF8",
                          boxShadow: isSelected ? "0 0 14px #00CEE6" : "none",
                          border: "2px solid #FFFFFF",
                        }}
                      />

                      {/* Icon Box */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{
                          background: isSelected
                            ? "linear-gradient(135deg, #00CEE6 0%, #00B4D8 100%)"
                            : item.color === "#825FEF"
                            ? "rgba(130, 95, 239, 0.12)"
                            : "rgba(0, 206, 230, 0.12)",
                          color: isSelected
                            ? "#11233D"
                            : item.color === "#825FEF"
                            ? "#7C3AED"
                            : "#0099B8",
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Title & Subtitle */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm sm:text-[15px] font-extrabold tracking-tight truncate leading-tight text-[#11233D]">
                          {item.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5 leading-tight font-semibold">
                          {item.sub}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0099B8] hover:text-[#00CEE6] mt-1">
                          <span>Ask AI Advisor</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Voice Feedback Banner */}
          {voiceQuery && (
            <div
              className="relative z-20 mt-6 mx-auto max-w-lg rounded-2xl p-4 text-center animate-in fade-in"
              style={{
                background: "rgba(17,35,61,0.95)",
                border: "1px solid rgba(0,206,230,0.5)",
                boxShadow: "0 0 24px rgba(0,206,230,0.2)",
              }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00CEE6] flex items-center justify-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Career AI Voice Agent
              </span>
              <p className="text-xs text-white italic font-medium">{voiceQuery}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
