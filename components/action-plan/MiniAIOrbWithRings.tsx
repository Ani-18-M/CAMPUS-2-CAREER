"use client";

import React, { useState } from "react";
import CareerAIOrb from "@/components/CareerAIOrb";
import { Sparkles } from "lucide-react";

interface MiniAIOrbWithRingsProps {
  size?: number; // Outer container dimension
  orbSize?: number; // Core sphere dimension
  label?: string;
  isVoiceActive?: boolean;
  onToggleVoice?: () => void;
}

export default function MiniAIOrbWithRings({
  size = 180,
  orbSize = 100,
  label = "AI ENGINE",
  isVoiceActive = false,
  onToggleVoice = () => {},
}: MiniAIOrbWithRingsProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── 1. Shimmering Ambient Caustic Halo Pool ── */}
      <div
        className="absolute inset-0 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(0,206,230,0.35) 0%, rgba(130,95,239,0.25) 45%, rgba(0,0,0,0) 75%)",
          opacity: isHovered ? 1 : 0.75,
        }}
      />

      {/* ── 2. Concentric Pulsing Wavefront Rings ── */}
      <div className="absolute inset-2 rounded-full border border-[#00CEE6]/25 animate-orb-ripple-1 pointer-events-none" />
      <div className="absolute inset-4 rounded-full border border-[#825FEF]/20 animate-orb-ripple-2 pointer-events-none" />

      {/* ── 3. 3D GYROSCOPE RING 1: Electric Cyan & Titanium (Inclined Vertical CW) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative rounded-full animate-polar-vertical-cw"
          style={{
            width: size - 16,
            height: size - 16,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cyan Ring Glass Tube SVG */}
          <svg className="w-full h-full" viewBox="0 0 160 160" style={{ overflow: "visible" }}>
            <defs>
              <filter id="mini-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="mini-cyan-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00CEE6" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00CEE6" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* Glowing Ring Path */}
            <circle
              cx="80"
              cy="80"
              r="74"
              fill="none"
              stroke="url(#mini-cyan-grad)"
              strokeWidth="2.5"
              filter="url(#mini-glow-cyan)"
            />

            {/* Specular Optic Node (Traveling Glint) */}
            <circle cx="80" cy="6" r="3" fill="#FFFFFF" filter="url(#mini-glow-cyan)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 80 80"
                to="360 80 80"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* ── 4. 3D GYROSCOPE RING 2: Royal Violet & Magenta (Opposing CCW) ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative rounded-full animate-polar-vertical-ccw"
          style={{
            width: size - 28,
            height: size - 28,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Violet Ring Tube SVG */}
          <svg className="w-full h-full" viewBox="0 0 140 140" style={{ overflow: "visible" }}>
            <defs>
              <filter id="mini-glow-purple" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="mini-purple-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#825FEF" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#00CEE6" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#825FEF" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            <circle
              cx="70"
              cy="70"
              r="64"
              fill="none"
              stroke="url(#mini-purple-grad)"
              strokeWidth="2"
              strokeDasharray="18 10"
              filter="url(#mini-glow-purple)"
            />

            {/* Orbiting Quantum Bead */}
            <circle cx="70" cy="6" r="2.5" fill="#00CEE6" filter="url(#mini-glow-purple)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 70 70"
                to="0 70 70"
                dur="5.5s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>

      {/* ── 5. Central 3D Quantum Crystal Core Orb ── */}
      <div className="relative z-20 flex items-center justify-center">
        <CareerAIOrb
          size={orbSize}
          isVoiceActive={isVoiceActive}
          onToggleVoice={onToggleVoice}
          label={label}
          subtitle="AI Planner"
        />
      </div>

      {/* ── 6. Bottom Holographic Status Pill ── */}
      <div className="absolute -bottom-2 z-30 pointer-events-none">
        <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#11233D]/90 backdrop-blur-md border border-[#00CEE6]/40 shadow-[0_0_12px_rgba(0,206,230,0.3)]">
          <Sparkles className="w-3 h-3 text-[#00CEE6] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider text-white">
            Active Synthesis
          </span>
        </div>
      </div>
    </div>
  );
}
