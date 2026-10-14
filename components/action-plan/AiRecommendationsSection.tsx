"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Sparkles, Eye, Plus, Check, X, ArrowRight } from "lucide-react";
import { EvidenceData } from "./EvidenceModal";
import CareerPathCenterOrb from "./CareerPathCenterOrb";

interface Point {
  x: number;
  y: number;
}

export interface AiRecommendationItem {
  id: string;
  category: "Academic" | "Placement" | "Attendance" | "LMS";
  title: string;
  detectedInsight: string;
  whyItMatters: string;
  recommendedAction: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  impact: string;
  evidence: EvidenceData;
}

interface AiRecommendationsSectionProps {
  onViewEvidence: (evidence: EvidenceData, recId: string) => void;
  onAddToPlan: (rec: AiRecommendationItem) => void;
  addedRecIds: string[];
}

export default function AiRecommendationsSection({
  onViewEvidence,
  onAddToPlan,
  addedRecIds,
}: AiRecommendationsSectionProps) {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAskingOrb, setIsAskingOrb] = useState(false);
  const [aiSpeech, setAiSpeech] = useState<string | null>(null);

  // Dynamic thread connection coordinates
  const hubRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const leftDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rightDotRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [threadCoords, setThreadCoords] = useState<{
    orb: Point;
    lefts: (Point | null)[];
    rights: (Point | null)[];
  } | null>(null);

  const [recommendations, setRecommendations] = useState<AiRecommendationItem[]>([
    {
      id: "rec-attendance",
      category: "Attendance",
      title: "Restore DBMS Attendance",
      detectedInsight: "DBMS attendance is 68.4% (15/22 classes). Tier-1 cutoff is 75%.",
      whyItMatters: "Institutional 75% cutoff required for Tier-1 placement drive eligibility.",
      recommendedAction: "Attend next 4 classes and complete Saturday make-up lab.",
      priority: "High",
      impact: "+6 pts",
      evidence: {
        title: "DBMS Attendance Shortfall Diagnostic",
        category: "Attendance",
        source: "Biometric Smart Turnstiles",
        detectedDate: "Oct 11, 2026",
        currentValue: "68.4% (15/22)",
        threshold: "75.0% Min",
        insight: "Deficit of 2 sessions to reach 75% placement cutoff.",
        explainability: "Institutional guidelines require ≥ 75% to appear for Day-1 interviews. Saturday make-up lab adds 4 attendance credits, restoring eligibility to 76.2%.",
        metrics: [
          { label: "Conducted Classes", value: "22 Hours", benchmark: "30 Total", status: "safe" },
          { label: "Attended Sessions", value: "15 Hours", benchmark: "17 Min", status: "risk" },
          { label: "Make-up Lab Credit", value: "+4 Hours", benchmark: "+4 Hours", status: "safe" },
        ],
      },
    },
    {
      id: "rec-assignments",
      category: "LMS",
      title: "Complete 2 Pending Assignments",
      detectedInsight: "OS Lab 3 & DS Assignment 2 approaching lock dates.",
      whyItMatters: "Continuous internal evaluation (CIE) contributes 40% to SGPA.",
      recommendedAction: "Submit assignment write-ups before the Oct 16 deadline.",
      priority: "Medium",
      impact: "+4 pts",
      evidence: {
        title: "LMS Submission Diagnostic",
        category: "LMS",
        source: "Institutional Moodle LMS",
        detectedDate: "Oct 10, 2026",
        currentValue: "2 Incomplete",
        threshold: "0 Incomplete",
        insight: "OS Lab 3 due in 72 hours; late submissions incur 10% daily penalty.",
        explainability: "Completing assignments on time preserves internal grade eligibility.",
        metrics: [
          { label: "Completed (Sem 7)", value: "8 of 10", benchmark: "100%", status: "warning" },
          { label: "OS Lab 3 Deadline", value: "16 Oct", benchmark: "Strict", status: "warning" },
        ],
      },
    },
    {
      id: "rec-coding",
      category: "Placement",
      title: "Strengthen Algorithmic Coding",
      detectedInsight: "Latest mock score is 45/100 (Tier-1 cutoff: 70+). Weak in Graphs.",
      whyItMatters: "Top software recruiters heavily filter on BFS/DFS graph traversals.",
      recommendedAction: "Complete 5 assigned graph problems and retake diagnostic test.",
      priority: "High",
      impact: "+8 pts",
      evidence: {
        title: "Algorithmic Screening Report",
        category: "Placement",
        source: "KPMG Campus Code Judge",
        detectedDate: "Oct 08, 2026",
        currentValue: "45 / 100",
        threshold: "70 / 100",
        insight: "Passed 3/10 test cases on Graph Cycle Detection.",
        explainability: "Raising coding score from 45 to 65 unlocks 18 additional tier-1 campus drives.",
        metrics: [
          { label: "Arrays Mastery", value: "92 / 100", benchmark: "80+", status: "safe" },
          { label: "Graph Traversal", value: "24 / 100", benchmark: "70+", status: "risk" },
          { label: "Dynamic Prog.", value: "35 / 100", benchmark: "65+", status: "risk" },
        ],
      },
    },
    {
      id: "rec-academic",
      category: "Academic",
      title: "Review DBMS Normalization",
      detectedInsight: "Mid-term assessment in DBMS is 62% (Target: 75%). Weak in 3NF.",
      whyItMatters: "Decomposition concepts account for 20% of end-semester exam weightage.",
      recommendedAction: "Access curated NPTEL revision modules and schedule faculty doubt clearing.",
      priority: "Medium",
      impact: "+5 pts",
      evidence: {
        title: "DBMS Mid-Term Paper Analysis",
        category: "Academic",
        source: "Controller of Examinations (CoE)",
        detectedDate: "Oct 05, 2026",
        currentValue: "62%",
        threshold: "75% Target",
        insight: "Normalization and indexing caused 16-mark drop.",
        explainability: "Remediating indexing concepts ensures readiness for end-semester university exams.",
        metrics: [
          { label: "SQL Queries Score", value: "85%", benchmark: "75%", status: "safe" },
          { label: "Normalization Score", value: "42%", benchmark: "70%", status: "risk" },
        ],
      },
    },
  ]);

  const handleGenerateAiRecommendations = async () => {
    setIsGenerating(true);
    const startTime = Date.now();
    try {
      const res = await fetch("/api/action-plan-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "generate_recommendations" }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setDismissedIds([]);
        setTimeout(updateCoords, 100);
      }
    } catch (err) {
      console.error("Failed to generate recommendations:", err);
    } finally {
      // Ensure the high-speed gyroscopic spin runs for at least 1800ms so the user experiences the full effect
      const elapsed = Date.now() - startTime;
      if (elapsed < 1800) {
        await new Promise((resolve) => setTimeout(resolve, 1800 - elapsed));
      }
      setIsGenerating(false);
    }
  };

  const handleAskOrb = async (customQuery?: string) => {
    setIsAskingOrb(true);
    const queryText =
      customQuery || "How can I raise my Success Score to above 85 before placement drives?";
    try {
      const res = await fetch("/api/action-plan-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "ask_orb", query: queryText }),
      });
      const data = await res.json();
      if (data.success && data.answer) {
        setAiSpeech(data.answer);
      }
    } catch (err) {
      console.error("Orb query failed:", err);
    } finally {
      setIsAskingOrb(false);
    }
  };

  const handleToggleVoiceOrb = () => {
    const nextState = !isVoiceActive;
    setIsVoiceActive(nextState);
    if (nextState && !aiSpeech) {
      handleAskOrb("What is my top priority action to reach 85+ Success Score?");
    }
  };

  const visibleRecommendations = recommendations.filter(
    (r) => !dismissedIds.includes(r.id)
  );

  const leftRecommendations = visibleRecommendations.slice(0, 2);
  const rightRecommendations = visibleRecommendations.slice(2, 4);

  // Measure exact coordinates relative to hubRef
  const updateCoords = useCallback(() => {
    if (!hubRef.current) return;
    const hubRect = hubRef.current.getBoundingClientRect();

    // Use exact center of the AI sphere
    const targetEl = sphereRef.current || orbRef.current;
    if (!targetEl) return;
    const sphereRect = targetEl.getBoundingClientRect();

    const orbPoint: Point = {
      x: sphereRect.left - hubRect.left + sphereRect.width / 2,
      y: sphereRect.top - hubRect.top + sphereRect.height / 2,
    };

    const lefts = leftRecommendations.map((_, idx) => {
      const el = leftDotRefs.current[idx];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: r.left - hubRect.left + r.width / 2,
        y: r.top - hubRect.top + r.height / 2,
      };
    });

    const rights = rightRecommendations.map((_, idx) => {
      const el = rightDotRefs.current[idx];
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
  }, [leftRecommendations.length, rightRecommendations.length]);

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
      if (sphereRef.current) {
        ro.observe(sphereRef.current);
      }
    }

    const t1 = setTimeout(scheduleUpdate, 100);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      if (ro) ro.disconnect();
      if (rAF !== null) cancelAnimationFrame(rAF);
      clearTimeout(t1);
    };
  }, [updateCoords, visibleRecommendations.length]);

  if (visibleRecommendations.length === 0) return null;

  return (
    <div
      className="relative w-full rounded-3xl overflow-hidden select-none shadow-2xl border border-[#ACBACC]/20 p-5 sm:p-7 transition-all"
      style={{
        background: "linear-gradient(165deg, #091528 0%, #11233D 50%, #081426 100%)",
      }}
    >
      {/* ── Ambient Background Lighting (Matching Career Paths Stage) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Concentric Water Waves & Caustic Ripples radiating from center orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] h-[420px] pointer-events-none opacity-45">
          <div className="absolute inset-0 rounded-full border border-[#00CEE6]/25 animate-water-wave-1" />
          <div className="absolute inset-0 rounded-full border border-[#00CEE6]/20 animate-water-wave-2" />
          <div className="absolute inset-0 rounded-full border border-[#825FEF]/20 animate-water-wave-3" />
        </div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-[140px]"
          style={{ background: "radial-gradient(circle, rgba(0,206,230,0.18) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/4 left-1/4 w-[360px] h-[360px] rounded-full blur-[110px]"
          style={{ background: "rgba(130,95,239,0.15)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] rounded-full blur-[100px]"
          style={{ background: "rgba(0,206,230,0.12)" }}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ACBACC 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Top Header Text ── */}
      <div className="relative z-20 flex items-center justify-between pb-4 border-b border-[#ACBACC]/15 text-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00CEE6]/20 border border-[#00CEE6]/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-[#00CEE6]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white leading-tight">
              AI Action Recommendations
            </h3>
            <span className="text-xs text-[#A0F2FA]/80 font-bold block mt-0.5">
              Live data-driven interventions synthesized by AI Intelligence.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live AI Intelligence
          </span>

          <button
            onClick={handleGenerateAiRecommendations}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#00CEE6]/20 hover:bg-[#00CEE6]/30 text-[#00CEE6] border border-[#00CEE6]/40 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="Synthesize fresh interventions with AI"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
            <span>{isGenerating ? "Synthesizing..." : "Regenerate AI"}</span>
          </button>
        </div>
      </div>

      {/* ── Main Stage: Left Cards | Center 3D Gyroscope Orb | Right Cards ── */}
      <div
        ref={hubRef}
        className="relative z-20 mt-6 flex flex-col xl:flex-row items-center justify-between gap-6 xl:gap-8"
      >
        {/* ── Living Neural Threads (Connecting Action Cards to Center Gyroscope Orb) ── */}
        {threadCoords && (
          <svg
            className="hidden xl:block absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ overflow: "visible" }}
          >
            <defs>
              <filter id="thread-glow-strong-ap" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur1" />
                <feGaussianBlur stdDeviation="1.5" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="thread-glow-soft-ap" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Left Threads */}
            {leftRecommendations.map((item, idx) => {
              const p = threadCoords.lefts[idx];
              if (!p) return null;
              const isHovered = hoveredId === item.id;
              const isAdded = addedRecIds.includes(item.id);
              const dx = threadCoords.orb.x - p.x;
              const c1x = p.x + dx * 0.45;
              const c1y = p.y;
              const c2x = threadCoords.orb.x - dx * 0.25;
              const c2y = threadCoords.orb.y;
              // Radiant Conduit from Orb center outward to Card
              const pathD = `M ${threadCoords.orb.x},${threadCoords.orb.y} C ${c2x},${c2y} ${c1x},${c1y} ${p.x},${p.y}`;

              return (
                <g key={`thread-left-${item.id}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      isAdded
                        ? "#10B981"
                        : isHovered
                        ? "#00CEE6"
                        : "rgba(0, 206, 230, 0.45)"
                    }
                    strokeWidth={isHovered ? 2.8 : 1.8}
                    strokeDasharray={isHovered ? "none" : "6 4"}
                    filter={isHovered ? "url(#thread-glow-strong-ap)" : "url(#thread-glow-soft-ap)"}
                    className="transition-all duration-300"
                  />

                  {/* Flowing Energy Particles streaming from AI Orb outward to cards */}
                  <g>
                    <circle r="4" fill="#FFFFFF" filter="url(#thread-glow-strong-ap)">
                      <animateMotion
                        path={pathD}
                        dur={isHovered ? "1.8s" : "3.0s"}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2.5" fill={isAdded ? "#10B981" : "#00CEE6"}>
                      <animateMotion
                        path={pathD}
                        dur={isHovered ? "1.8s" : "3.0s"}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Terminal Anchor Glow right at the card dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4.5}
                    fill={isAdded ? "#10B981" : "#00CEE6"}
                    filter="url(#thread-glow-strong-ap)"
                    className="transition-all duration-300"
                  />
                  <circle cx={p.x} cy={p.y} r={isHovered ? 3 : 2} fill="#FFFFFF" />
                </g>
              );
            })}

            {/* Right Threads */}
            {rightRecommendations.map((item, idx) => {
              const p = threadCoords.rights[idx];
              if (!p) return null;
              const isHovered = hoveredId === item.id;
              const isAdded = addedRecIds.includes(item.id);
              const dx = p.x - threadCoords.orb.x;
              const c1x = p.x - dx * 0.45;
              const c1y = p.y;
              const c2x = threadCoords.orb.x + dx * 0.25;
              const c2y = threadCoords.orb.y;
              // Radiant Conduit from Orb center outward to Card
              const pathD = `M ${threadCoords.orb.x},${threadCoords.orb.y} C ${c2x},${c2y} ${c1x},${c1y} ${p.x},${p.y}`;

              return (
                <g key={`thread-right-${item.id}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      isAdded
                        ? "#10B981"
                        : isHovered
                        ? "#00CEE6"
                        : "rgba(0, 206, 230, 0.45)"
                    }
                    strokeWidth={isHovered ? 2.8 : 1.8}
                    strokeDasharray={isHovered ? "none" : "6 4"}
                    filter={isHovered ? "url(#thread-glow-strong-ap)" : "url(#thread-glow-soft-ap)"}
                    className="transition-all duration-300"
                  />

                  {/* Flowing Energy Particles streaming from AI Orb outward to cards */}
                  <g>
                    <circle r="4" fill="#FFFFFF" filter="url(#thread-glow-strong-ap)">
                      <animateMotion
                        path={pathD}
                        dur={isHovered ? "1.8s" : "3.0s"}
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle r="2.5" fill={isAdded ? "#10B981" : "#825FEF"}>
                      <animateMotion
                        path={pathD}
                        dur={isHovered ? "1.8s" : "3.0s"}
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>

                  {/* Terminal Anchor Glow right at the card dot */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 6 : 4.5}
                    fill={isAdded ? "#10B981" : "#825FEF"}
                    filter="url(#thread-glow-strong-ap)"
                    className="transition-all duration-300"
                  />
                  <circle cx={p.x} cy={p.y} r={isHovered ? 3 : 2} fill="#FFFFFF" />
                </g>
              );
            })}
          </svg>
        )}

        {/* ── LEFT CARDS (2 Recommendation Cards) ── */}
        <div className="flex flex-col gap-4 w-full xl:max-w-[340px] xl:flex-1 shrink-0 z-20">
          {leftRecommendations.map((item, idx) => {
            const isAdded = addedRecIds.includes(item.id);
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group transition-transform duration-300 w-full"
              >
                {/* Connection Anchor Dot for Neural Threads (Right Edge) */}
                <span
                  ref={(el) => {
                    leftDotRefs.current[idx] = el;
                  }}
                  className={`hidden xl:block absolute -right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white z-30 pointer-events-none transition-transform duration-300 group-hover:scale-125 ${
                    isAdded
                      ? "bg-emerald-500 shadow-[0_0_12px_#10B981]"
                      : "bg-[#00CEE6] shadow-[0_0_12px_#00CEE6]"
                  }`}
                />

                {/* Card Body (High-end White Floating Card with Fixed Height & Aligned Fields) */}
                <div
                  className="relative p-5 rounded-3xl bg-white border text-left transition-all duration-300 select-none shadow-xl flex flex-col justify-between min-h-[195px]"
                  style={{
                    border: isHovered
                      ? "2px solid #00CEE6"
                      : "1.5px solid rgba(226,232,240,0.9)",
                    boxShadow: isHovered
                      ? "0 0 28px rgba(0,206,230,0.35), 0 16px 36px -6px rgba(10,25,45,0.22)"
                      : "0 10px 24px -4px rgba(10,25,45,0.18)",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div>
                    {/* Field 1: Category & Priority Red Dot Indicator */}
                    <div className="flex items-center justify-between gap-1.5 h-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#11233D] text-[#00CEE6]">
                          {item.category}
                        </span>
                        {item.priority === "Critical" ? (
                          <span className="relative flex h-2.5 w-2.5 ml-0.5" title="Critical Priority">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 shadow-[0_0_8px_#E11D48]" />
                          </span>
                        ) : item.priority === "High" ? (
                          <span className="relative flex h-2 w-2 ml-0.5 rounded-full bg-rose-500 shadow-[0_0_6px_#F43F5E]" title="High Priority" />
                        ) : null}
                      </div>
                    </div>

                    {/* Field 2: Title */}
                    <h4 className="text-sm sm:text-base font-black text-[#11233D] leading-tight line-clamp-1 mt-2.5">
                      {item.title}
                    </h4>

                    {/* Field 3: Detected Insight */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 mt-1.5">
                      {item.detectedInsight}
                    </p>
                  </div>

                  {/* Field 4: Action Controls */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewEvidence(item.evidence, item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#11233D] hover:text-[#00CEE6] transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#00CEE6]" />
                      <span>Evidence</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDismissedIds([...dismissedIds, item.id])}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        disabled={isAdded}
                        onClick={() => onAddToPlan(item)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-500 text-white cursor-default shadow-xs"
                            : "bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white shadow-xs"
                        }`}
                        title={isAdded ? "Added to Plan" : "Add to Plan"}
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CENTER: THE EXACT 3D GYROSCOPE ORB & FLOOR PEDESTAL FROM CAREER PATHS ── */}
        <div ref={orbRef} className="shrink-0 flex flex-col items-center justify-center z-20 my-4 xl:my-0 w-[270px]">
          <CareerPathCenterOrb
            isVoiceActive={isVoiceActive || isAskingOrb}
            onToggleVoice={handleToggleVoiceOrb}
            scale={0.68}
            centerRef={sphereRef}
            isGenerating={isGenerating}
          />

          {/* Live AI Speech HUD (Interactive Action AI Decision Bubble) */}
          {aiSpeech && (
            <div className="mt-3 p-3 max-w-[270px] rounded-2xl bg-[#091528]/95 backdrop-blur-md border border-[#00CEE6]/50 shadow-[0_0_24px_rgba(0,206,230,0.35)] text-left text-xs text-white animate-in zoom-in-95 z-30">
              <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-white/10 text-[10px] text-[#00CEE6] font-black uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#00CEE6]" />
                  Action AI Intelligence
                </span>
                <button
                  onClick={() => setAiSpeech(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <p className="leading-snug font-medium text-slate-100 text-[11px]">
                {aiSpeech}
              </p>
            </div>
          )}

          {/* Interactive AI Prompt Quick Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 max-w-[270px]">
            {["Score to 85+?", "DBMS vs Coding?", "Saturday Lab?"].map((p, i) => (
              <button
                key={i}
                disabled={isAskingOrb}
                onClick={() => handleAskOrb(p)}
                className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#00CEE6]/20 text-[#A0F2FA] hover:text-white border border-[#ACBACC]/20 hover:border-[#00CEE6]/40 transition-all cursor-pointer truncate disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── RIGHT CARDS (2 Recommendation Cards) ── */}
        <div className="flex flex-col gap-4 w-full xl:max-w-[340px] xl:flex-1 shrink-0 z-20">
          {rightRecommendations.map((item, idx) => {
            const isAdded = addedRecIds.includes(item.id);
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="relative group transition-transform duration-300 w-full"
              >
                {/* Connection Anchor Dot for Neural Threads (Left Edge) */}
                <span
                  ref={(el) => {
                    rightDotRefs.current[idx] = el;
                  }}
                  className={`hidden xl:block absolute -left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white z-30 pointer-events-none transition-transform duration-300 group-hover:scale-125 ${
                    isAdded
                      ? "bg-emerald-500 shadow-[0_0_12px_#10B981]"
                      : "bg-[#825FEF] shadow-[0_0_12px_#825FEF]"
                  }`}
                />

                {/* Card Body (High-end White Floating Card with Fixed Height & Aligned Fields) */}
                <div
                  className="relative p-5 rounded-3xl bg-white border text-left transition-all duration-300 select-none shadow-xl flex flex-col justify-between min-h-[195px]"
                  style={{
                    border: isHovered
                      ? "2px solid #00CEE6"
                      : "1.5px solid rgba(226,232,240,0.9)",
                    boxShadow: isHovered
                      ? "0 0 28px rgba(0,206,230,0.35), 0 16px 36px -6px rgba(10,25,45,0.22)"
                      : "0 10px 24px -4px rgba(10,25,45,0.18)",
                    transform: isHovered ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div>
                    {/* Field 1: Category & Priority Red Dot Indicator */}
                    <div className="flex items-center justify-between gap-1.5 h-6">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#11233D] text-[#00CEE6]">
                          {item.category}
                        </span>
                        {item.priority === "Critical" ? (
                          <span className="relative flex h-2.5 w-2.5 ml-0.5" title="Critical Priority">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600 shadow-[0_0_8px_#E11D48]" />
                          </span>
                        ) : item.priority === "High" ? (
                          <span className="relative flex h-2 w-2 ml-0.5 rounded-full bg-rose-500 shadow-[0_0_6px_#F43F5E]" title="High Priority" />
                        ) : null}
                      </div>
                    </div>

                    {/* Field 2: Title */}
                    <h4 className="text-sm sm:text-base font-black text-[#11233D] leading-tight line-clamp-1 mt-2.5">
                      {item.title}
                    </h4>

                    {/* Field 3: Detected Insight */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 mt-1.5">
                      {item.detectedInsight}
                    </p>
                  </div>

                  {/* Field 4: Action Controls */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onViewEvidence(item.evidence, item.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-[#11233D] hover:text-[#00CEE6] transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-[#00CEE6]" />
                      <span>Evidence</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDismissedIds([...dismissedIds, item.id])}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <button
                        disabled={isAdded}
                        onClick={() => onAddToPlan(item)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                          isAdded
                            ? "bg-emerald-500 text-white cursor-default shadow-xs"
                            : "bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white shadow-xs"
                        }`}
                        title={isAdded ? "Added to Plan" : "Add to Plan"}
                      >
                        {isAdded ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <Plus className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
