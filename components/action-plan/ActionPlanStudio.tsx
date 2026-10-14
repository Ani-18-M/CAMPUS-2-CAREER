"use client";

import React, { useState } from "react";
import ActionPlanHeader from "./ActionPlanHeader";
import AiRecommendationsSection, { AiRecommendationItem } from "./AiRecommendationsSection";
import ActivePlanTasksSection, { PlanTask } from "./ActivePlanTasksSection";
import RiskBasedActionsSection from "./RiskBasedActionsSection";
import WeeklyRoadmapSection from "./WeeklyRoadmapSection";
import GoalsTrackingSection from "./GoalsTrackingSection";
import ImpactMeasurementSection from "./ImpactMeasurementSection";
import SupportMentoringSection, { MentoringSession } from "./SupportMentoringSection";
import EvidenceModal, { EvidenceData } from "./EvidenceModal";
import MentoringRequestModal from "./MentoringRequestModal";
import CreateGoalModal, { GoalItem } from "./CreateGoalModal";
import { CheckSquare, Calendar, Target } from "lucide-react";

interface ActionPlanStudioProps {
  onNavigateTab: (tab: string) => void;
  successScore?: number;
  onOpenDsaModal?: () => void;
}

export default function ActionPlanStudio({
  onNavigateTab,
  successScore = 74,
  onOpenDsaModal,
}: ActionPlanStudioProps) {
  // Navigation Sub-tab
  const [activeSubTab, setActiveSubTab] = useState<"tasks" | "roadmap" | "risk" | "goals">("tasks");

  // Tasks State
  const [tasks, setTasks] = useState<PlanTask[]>([
    {
      id: "task-1",
      title: "DBMS Normalization & Indexing",
      category: "Academic",
      reason: "Mid-term score 62% vs 75% benchmark.",
      priority: "High",
      dueDate: "18 Oct",
      status: "In Progress",
      actionType: "study",
    },
    {
      id: "task-2",
      title: "5 Graph Traversal Problems",
      category: "Placement",
      reason: "Diagnostic score 45/100; Tier-1 cutoff 70+.",
      priority: "High",
      dueDate: "20 Oct",
      status: "In Progress",
      actionType: "code",
    },
    {
      id: "task-3",
      title: "OS Lab 3: Page Replacement",
      category: "LMS",
      reason: "Moodle submission due within 72 hrs.",
      priority: "High",
      dueDate: "16 Oct",
      status: "Pending",
      isOverdue: false,
      actionType: "lms",
    },
    {
      id: "task-4",
      title: "Saturday Make-up Lab (IoT 03)",
      category: "Attendance",
      reason: "Compensates 4 hrs to reach 76.2%.",
      priority: "High",
      dueDate: "15 Oct",
      status: "In Progress",
      actionType: "attend",
    },
    {
      id: "task-5",
      title: "JP Morgan Aptitude & Reasoning",
      category: "Placement",
      reason: "Drive Oct 26; 80% cutoff.",
      priority: "Medium",
      dueDate: "24 Oct",
      status: "Pending",
      actionType: "study",
    },
    {
      id: "task-6",
      title: "Lab Clearance Verification",
      category: "Academic",
      reason: "Required for exam hall ticket.",
      priority: "Low",
      dueDate: "28 Oct",
      status: "Completed",
      actionType: "study",
    },
  ]);

  // Added Recommendations tracking
  const [addedRecIds, setAddedRecIds] = useState<string[]>([]);

  // Personal Goals State
  const [goals, setGoals] = useState<GoalItem[]>([
    {
      id: "goal-1",
      title: "Internal Assessment Average",
      category: "Academic",
      currentValue: 62,
      targetValue: 75,
      unit: "%",
      targetDate: "Nov 15",
      measure: "Mid-Term Exam 2 score average",
    },
    {
      id: "goal-2",
      title: "Overall Biometric Attendance",
      category: "Attendance",
      currentValue: 68.4,
      targetValue: 75.0,
      unit: "%",
      targetDate: "Oct 30",
      measure: "Official turnstile biometric log",
    },
    {
      id: "goal-3",
      title: "Placement Coding Diagnostic Score",
      category: "Placement",
      currentValue: 45,
      targetValue: 65,
      unit: "/100",
      targetDate: "Nov 05",
      measure: "Campus Code Judge Re-test",
    },
  ]);

  // Mentoring Sessions State
  const [mentoringSessions, setMentoringSessions] = useState<MentoringSession[]>([
    {
      id: "sess-1",
      mentor: "Prof. S. Sharma",
      role: "Placement Coordinator",
      topic: "Graph Traversal & Mock Technical Interview",
      slot: "Thursday · 3:30 PM – 4:15 PM",
      location: "Cabin 204 (Admin Block)",
      status: "Confirmed",
    },
    {
      id: "sess-2",
      mentor: "Dr. Srinivas",
      role: "HOD & DBMS Faculty",
      topic: "Relational Normalization & SQL Optimization Review",
      slot: "Friday · 2:00 PM – 2:45 PM",
      location: "Tech Block A (Seminar Hall)",
      status: "Pending Review",
    },
  ]);

  // Modals State
  const [evidenceModalData, setEvidenceModalData] = useState<EvidenceData | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [activeRecForEvidence, setActiveRecForEvidence] = useState<AiRecommendationItem | null>(null);

  const [isMentoringModalOpen, setIsMentoringModalOpen] = useState(false);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);

  // Handlers
  const handleToggleComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: t.status === "Completed" ? "In Progress" : "Completed",
            }
          : t
      )
    );
  };

  const handleUpdateDueDate = (taskId: string, newDate: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, dueDate: newDate } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleStartTask = (task: PlanTask) => {
    if (task.actionType === "code" && onOpenDsaModal) {
      onOpenDsaModal();
    } else if (task.actionType === "attend") {
      onNavigateTab("Permissions");
    } else if (task.actionType === "lms") {
      alert("Redirecting to Institutional Moodle LMS for OS Lab 3 submission...");
    } else {
      alert(`Opening study resources for "${task.title}"...`);
    }
  };

  const handleAddToPlan = (rec: AiRecommendationItem) => {
    if (addedRecIds.includes(rec.id)) return;

    const newTask: PlanTask = {
      id: `task-${Date.now()}`,
      title: rec.title,
      category: rec.category,
      reason: rec.whyItMatters,
      priority: rec.priority,
      dueDate: "22 Oct",
      status: "Pending",
      actionType: rec.category === "Placement" ? "code" : rec.category === "Attendance" ? "attend" : "study",
    };

    setTasks((prev) => [newTask, ...prev]);
    setAddedRecIds((prev) => [...prev, rec.id]);
  };

  const handleViewEvidence = (evidence: EvidenceData, recId: string) => {
    setEvidenceModalData(evidence);
    setIsEvidenceModalOpen(true);
  };

  const handleRequestMentoringSubmit = (request: {
    mentor: string;
    topic: string;
    slot: string;
    note: string;
  }) => {
    const newSession: MentoringSession = {
      id: `sess-${Date.now()}`,
      mentor: request.mentor.split(" (")[0],
      role: request.mentor.includes("(") ? request.mentor.split("(")[1].replace(")", "") : "Faculty Mentor",
      topic: request.topic,
      slot: request.slot,
      location: "Department Office",
      status: "Pending Review",
    };
    setMentoringSessions((prev) => [newSession, ...prev]);
  };

  const handleCreateGoalSubmit = (newGoal: GoalItem) => {
    setGoals((prev) => [...prev, newGoal]);
  };

  // KPI Calculations
  const activeActionsCount = tasks.filter((t) => t.status !== "Completed").length;
  const completedActionsCount = tasks.filter((t) => t.status === "Completed").length;
  const overdueActionsCount = tasks.filter((t) => t.isOverdue).length;

  const subTabs = [
    {
      id: "tasks" as const,
      label: "Actions & AI",
      badge: `${activeActionsCount} Active`,
      icon: CheckSquare,
    },
    {
      id: "roadmap" as const,
      label: "Roadmap",
      badge: "7 Days",
      icon: Calendar,
    },
    {
      id: "risk" as const,
      label: "Risk Diagnostics",
      badge: "3 Factors",
      icon: null,
      dotColor: "bg-amber-400 shadow-[0_0_6px_#FBBF24]",
    },
    {
      id: "goals" as const,
      label: "Goals & Mentoring",
      badge: `${goals.length} Goals`,
      icon: Target,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Permanent Header & KPI Summary Strip */}
      <ActionPlanHeader
        successScore={successScore}
        activeActionsCount={activeActionsCount}
        completedActionsCount={completedActionsCount}
        overdueActionsCount={overdueActionsCount}
        nextDeadline="16 Oct · OS Lab 3"
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Sub-Tab Navigation Bar — Pebble Pod Theme */}
      <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] p-2 rounded-[24px] sm:rounded-full border-2 border-slate-200/90 shadow-[0_10px_24px_rgba(17,35,61,0.06),inset_0_2px_4px_rgba(255,255,255,0.95)] flex items-center gap-2 overflow-x-auto scrollbar-none">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-[18px] sm:rounded-full text-xs font-black transition-all cursor-pointer shrink-0 ${
                isActive
                  ? "bg-gradient-to-b from-[#64748B] via-[#475569] to-[#334155] text-white shadow-[0_6px_16px_rgba(30,41,59,0.35),inset_0_2px_3px_rgba(255,255,255,0.35)]"
                  : "text-slate-600 hover:text-[#11233D] hover:bg-white/60"
              }`}
            >
              {tab.dotColor ? (
                <span className={`w-2.5 h-2.5 rounded-full ${tab.dotColor} shrink-0`} />
              ) : Icon ? (
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#00CEE6]" : "text-slate-400"}`} />
              ) : null}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-[#00CEE6] shadow-2xs"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Dynamic Minimalist View Content */}
      <div className="space-y-6">
        {/* SUB-TAB 1: ACTION TASKS & AI RECOMMENDATIONS */}
        {activeSubTab === "tasks" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Section 2: AI Recommendations (Collapsible Banner) */}
            <AiRecommendationsSection
              onViewEvidence={handleViewEvidence}
              onAddToPlan={handleAddToPlan}
              addedRecIds={addedRecIds}
            />

            {/* Section 3: Active Action Plan Tasks */}
            <ActivePlanTasksSection
              tasks={tasks}
              onToggleComplete={handleToggleComplete}
              onStartTask={handleStartTask}
              onUpdateDueDate={handleUpdateDueDate}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}

        {/* SUB-TAB 2: PERSONALIZED WEEKLY ROADMAP */}
        {activeSubTab === "roadmap" && (
          <div className="animate-in fade-in duration-200">
            {/* Section 5: Weekly Roadmap Planner */}
            <WeeklyRoadmapSection />
          </div>
        )}

        {/* SUB-TAB 3: RISK-BASED RECOMMENDATIONS & IMPACT MEASUREMENT */}
        {activeSubTab === "risk" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Section 4: 5-Part Explainability Risk Diagnostics */}
            <RiskBasedActionsSection
              onImplementAction={(title) => {
                alert(`Action initiated for: "${title}". Added to Active Plan.`);
              }}
            />

            {/* Section 7: Measured Impact & Progression Timeline Line Chart */}
            <ImpactMeasurementSection />
          </div>
        )}

        {/* SUB-TAB 4: GOAL SETTING & SUPPORT MENTORING */}
        {activeSubTab === "goals" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Section 6: Personal Goals & Progress Meters */}
            <GoalsTrackingSection
              goals={goals}
              onOpenCreateGoal={() => setIsCreateGoalModalOpen(true)}
            />

            {/* Section 8: Support & Mentoring Hub */}
            <SupportMentoringSection
              onOpenMentoringModal={() => setIsMentoringModalOpen(true)}
              sessions={mentoringSessions}
            />
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        data={evidenceModalData}
        onAddToPlan={() => {
          if (activeRecForEvidence) {
            handleAddToPlan(activeRecForEvidence);
          }
        }}
      />

      <MentoringRequestModal
        isOpen={isMentoringModalOpen}
        onClose={() => setIsMentoringModalOpen(false)}
        onSubmit={handleRequestMentoringSubmit}
      />

      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onCreateGoal={handleCreateGoalSubmit}
      />
    </div>
  );
}
