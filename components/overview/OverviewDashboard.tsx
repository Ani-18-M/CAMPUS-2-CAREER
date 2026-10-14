"use client";

import React from "react";
import OverviewHero from "./OverviewHero";
import KpiMetricsGrid from "./KpiMetricsGrid";
import TargetTrackSnapshot from "./TargetTrackSnapshot";
import TodayCampusPulse from "./TodayCampusPulse";
import InterventionsCard from "./InterventionsCard";
import UpcomingDrivesCard from "./UpcomingDrivesCard";

interface PathwayItem {
  id: string;
  name: string;
  position: string;
  description: string;
  tags: string[];
  stats: string;
}

interface OverviewDashboardProps {
  studentName?: string;
  department?: string;
  semester?: string;
  pathways: PathwayItem[];
  selectedPathway: string | null;
  onSelectPathway: (id: string) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  voiceQuery: string;
  onNavigateTab: (tab: string) => void;
  onOpenQR: () => void;
  successScore?: number;
  attendanceRate?: string;
}

export default function OverviewDashboard({
  studentName = "Ananya V.",
  department = "Computer Science & Engineering",
  semester = "7th Semester",
  pathways,
  selectedPathway,
  onSelectPathway,
  isVoiceActive,
  onToggleVoice,
  voiceQuery,
  onNavigateTab,
  onOpenQR,
  successScore = 74,
  attendanceRate = "68.4%",
}: OverviewDashboardProps) {
  return (
    <div className="max-w-6xl mx-auto w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* 1. SaaS Hero Greeting */}
      <OverviewHero
        studentName={studentName}
        department={department}
        semester={semester}
        isVoiceActive={isVoiceActive}
        onToggleVoice={onToggleVoice}
        onNavigateTab={onNavigateTab}
      />

      {/* 2. Key Operational Metrics (4 High-Signal Cards) */}
      <KpiMetricsGrid
        onNavigateTab={onNavigateTab}
        successScore={successScore}
        attendanceRate={attendanceRate}
      />

      {/* 3. Primary Mission Row: Target Track Snapshot + Today's Campus Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-7">
          <TargetTrackSnapshot
            onNavigateTab={onNavigateTab}
            successScore={successScore}
          />
        </div>
        <div className="lg:col-span-5">
          <TodayCampusPulse
            onOpenQR={onOpenQR}
            onNavigateTab={onNavigateTab}
          />
        </div>
      </div>

      {/* 4. Action & Opportunity Row: Remedial Action Plan + Upcoming Campus Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        <div className="lg:col-span-6">
          <InterventionsCard onNavigateTab={onNavigateTab} />
        </div>
        <div className="lg:col-span-6">
          <UpcomingDrivesCard onNavigateTab={onNavigateTab} />
        </div>
      </div>
    </div>
  );
}
