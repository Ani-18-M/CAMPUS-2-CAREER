"use client";

import React from "react";
import PathwayOrbHub from "@/components/PathwayOrbHub";

interface PathwayItem {
  id: string;
  name: string;
  position: string;
  description: string;
  tags: string[];
  stats: string;
}

interface CareerPathwayHubProps {
  pathways: PathwayItem[];
  selectedPathway: string | null;
  onSelectPathway: (id: string) => void;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  voiceQuery: string;
  onNavigateTab: (tab: string) => void;
}

export default function CareerPathwayHub({
  selectedPathway,
  onSelectPathway,
  isVoiceActive,
  onToggleVoice,
  voiceQuery,
  onNavigateTab,
}: CareerPathwayHubProps) {
  return (
    <PathwayOrbHub
      selectedPathway={selectedPathway}
      onSelectPathway={onSelectPathway}
      isVoiceActive={isVoiceActive}
      onToggleVoice={onToggleVoice}
      voiceQuery={voiceQuery}
      onExploreDetails={() => onNavigateTab("Career Paths")}
    />
  );
}
