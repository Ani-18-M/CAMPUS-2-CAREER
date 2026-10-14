"use client";

import React, { useEffect, useRef } from "react";
import CareerAIOrb from "@/components/CareerAIOrb";
import { Mic, MicOff, Sparkles } from "lucide-react";

interface CareerPathCenterOrbProps {
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  scale?: number;
  centerRef?: React.Ref<HTMLDivElement>;
  isGenerating?: boolean;
  hideControls?: boolean;
  hideText?: boolean;
}

export default function CareerPathCenterOrb({
  isVoiceActive,
  onToggleVoice,
  scale = 0.72,
  centerRef,
  isGenerating = false,
  hideControls = false,
  hideText = false,
}: CareerPathCenterOrbProps) {
  // ── Hardware-Accelerated 3D Gyroscopic Physics Engine ──
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);

  // Angular state (degrees)
  const angle1Ref = useRef(0);
  const angle2Ref = useRef(0);

  // Angular velocity state (degrees/sec)
  // Standard speeds: Ring 1 = +20 deg/s (18s / rev), Ring 2 = -15 deg/s (24s / rev)
  const speed1Ref = useRef(20);
  const speed2Ref = useRef(-15);

  // Deceleration state when returning to normal
  const prevGeneratingRef = useRef(isGenerating);
  const decelStateRef = useRef<{
    startTime: number;
    initialSpeed1: number;
    initialSpeed2: number;
  } | null>(null);

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const NORMAL_SPEED_1 = 20; // 360 deg / 18s = +20 deg/s (clockwise)
    const NORMAL_SPEED_2 = -15; // -360 deg / 24s = -15 deg/s (counter-clockwise)
    const FAST_SPEED_1 = 300; // 360 deg / 1.2s = +300 deg/s
    const FAST_SPEED_2 = -240; // -360 deg / 1.5s = -240 deg/s
    const DECEL_DURATION = 3800; // 3.8s for butter-smooth, luxurious deceleration

    // Ease-out quartic curve: smooth initial descent, tangent transition at arrival (0 jerk)
    const easeOutQuartic = (t: number) => 1 - Math.pow(1 - t, 4);

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Detect transition when isGenerating switches from true -> false
      if (prevGeneratingRef.current && !isGenerating) {
        decelStateRef.current = {
          startTime: now,
          initialSpeed1: speed1Ref.current,
          initialSpeed2: speed2Ref.current,
        };
      } else if (!prevGeneratingRef.current && isGenerating) {
        decelStateRef.current = null;
      }
      prevGeneratingRef.current = isGenerating;

      if (isGenerating) {
        // Swift, fluid acceleration to fast speed
        const accelRate = 4.0;
        speed1Ref.current += (FAST_SPEED_1 - speed1Ref.current) * Math.min(1, dt * accelRate);
        speed2Ref.current += (FAST_SPEED_2 - speed2Ref.current) * Math.min(1, dt * accelRate);
      } else if (decelStateRef.current) {
        // Butter-smooth deceleration curve back to normal speed
        const elapsed = now - decelStateRef.current.startTime;
        const progress = Math.min(1, elapsed / DECEL_DURATION);
        const ease = easeOutQuartic(progress);

        speed1Ref.current =
          decelStateRef.current.initialSpeed1 +
          (NORMAL_SPEED_1 - decelStateRef.current.initialSpeed1) * ease;
        speed2Ref.current =
          decelStateRef.current.initialSpeed2 +
          (NORMAL_SPEED_2 - decelStateRef.current.initialSpeed2) * ease;

        if (progress >= 1) {
          decelStateRef.current = null;
          speed1Ref.current = NORMAL_SPEED_1;
          speed2Ref.current = NORMAL_SPEED_2;
        }
      } else {
        speed1Ref.current = NORMAL_SPEED_1;
        speed2Ref.current = NORMAL_SPEED_2;
      }

      // Continuously integrate angles (zero teleportation or snapping)
      angle1Ref.current = (angle1Ref.current + speed1Ref.current * dt) % 360;
      angle2Ref.current = (angle2Ref.current + speed2Ref.current * dt) % 360;

      // Apply 3D matrix transforms directly to GPU layers
      if (ring1Ref.current) {
        ring1Ref.current.style.transform = `rotateX(72deg) rotateZ(28deg) rotateY(${angle1Ref.current.toFixed(2)}deg)`;
      }
      if (ring2Ref.current) {
        ring2Ref.current.style.transform = `rotateX(-22deg) rotateZ(14deg) rotateY(${angle2Ref.current.toFixed(2)}deg)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isGenerating]);
  return (
    <div
      className="relative shrink-0 flex flex-col items-center justify-center select-none"
      style={{
        width: Math.round(380 * scale),
        height: Math.round(380 * scale),
      }}
    >
      {/* Scaled Wrapper to maintain exact SVG math, 3D perspective, and lighting from Career Paths */}
      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: 380,
          height: 380,
        }}
      >
        {/* 3D Gyroscope Perspective Container */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 380,
            height: 380,
            perspective: "1100px",
          }}
        >
          {/* Gyroscope & Orb Container */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ── ULTRA-REALISTIC SAPPHIRE QUARTZ TORUS 1 (Electric Cyan & Brushed Titanium) ── */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={ring1Ref}
                className="relative w-[352px] h-[352px] rounded-full pointer-events-none"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(72deg) rotateZ(28deg) rotateY(0deg)",
                  willChange: "transform",
                }}
              >
                {/* SVG 1A: Rear Volumetric Glass Facet & Ambient Occlusion (translateZ -8px) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: "translateZ(-8px)", transformStyle: "preserve-3d" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 352 352" style={{ overflow: "visible" }}>
                    <defs>
                      <filter id="tube-shadow-cyan-ap" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4.5" />
                      </filter>
                    </defs>
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="rgba(2, 6, 16, 0.75)"
                      strokeWidth="30"
                      filter="url(#tube-shadow-cyan-ap)"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="24"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="rgba(0, 206, 230, 0.22)"
                      strokeWidth="20"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="152"
                      fill="none"
                      stroke="rgba(0, 240, 255, 0.35)"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="176"
                      fill="none"
                      stroke="rgba(0, 206, 230, 0.45)"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>

                {/* SVG 1B: Fiber-Optic Waveguide with Total Internal Reflection (translateZ 0px) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 352 352" style={{ overflow: "visible" }}>
                    <defs>
                      <filter id="neon-glow-cyan-ap" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur1" />
                        <feGaussianBlur stdDeviation="1.5" result="blur2" />
                        <feMerge>
                          <feMergeNode in="blur1" />
                          <feMergeNode in="blur2" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="tir-photon-cyan-ap" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00CEE6" stopOpacity="0" />
                        <stop offset="40%" stopColor="#00F0FF" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="60%" stopColor="#00F0FF" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#00CEE6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="#00CEE6"
                      strokeWidth="7"
                      opacity="0.82"
                      filter="url(#neon-glow-cyan-ap)"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.4"
                      opacity="0.95"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="url(#tir-photon-cyan-ap)"
                      strokeWidth="6"
                      strokeDasharray="40 280"
                      className="animate-fiber-optic-1"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="3.2"
                      strokeDasharray="16 380"
                      className="animate-fiber-surge-1"
                      strokeLinecap="round"
                      filter="url(#neon-glow-cyan-ap)"
                    />
                  </svg>
                </div>

                {/* SVG 1C: Front Dual-Chamfered Polished Sapphire Facet (translateZ +8px) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: "translateZ(8px)", transformStyle: "preserve-3d" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 352 352" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="glass-specular-cyan-ap" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                        <stop offset="38%" stopColor="#00CEE6" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.98" />
                        <stop offset="82%" stopColor="#00CEE6" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.18)"
                      strokeWidth="24"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="176"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.90)"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="176"
                      fill="none"
                      stroke="rgba(0, 240, 255, 0.75)"
                      strokeWidth="1.2"
                      strokeDasharray="6 34"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="152"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.65)"
                      strokeWidth="1.4"
                    />
                    <circle
                      cx="176"
                      cy="176"
                      r="164"
                      fill="none"
                      stroke="url(#glass-specular-cyan-ap)"
                      strokeWidth="24"
                      strokeDasharray="120 460"
                      className="animate-glass-glare-1"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Titanium Magnetic Gimbal & Micro-Prism */}
                  <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-8 flex items-center justify-center pointer-events-none">
                    <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-[#F8FAFC] via-[#CBD5E1] to-[#94A3B8] p-[1.5px] shadow-[0_0_24px_rgba(0,240,255,0.9),inset_0_1px_2px_#ffffff]">
                      <div className="w-full h-full rounded-full bg-[#081528] flex items-center justify-center border border-white/40">
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#00F0FF]/50 animate-gimbal-prism" />
                        <div className="w-3 h-3 rounded-[3px] bg-gradient-to-tr from-[#00F0FF] via-[#FFFFFF] to-[#A0F2FA] rotate-45 shadow-[0_0_12px_#00F0FF] animate-gimbal-prism flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── ULTRA-REALISTIC SAPPHIRE QUARTZ TORUS 2 (Amethyst & White Gold) ── */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-full"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                ref={ring2Ref}
                className="relative w-[318px] h-[318px] rounded-full pointer-events-none"
                style={{
                  transformStyle: "preserve-3d",
                  transform: "rotateX(-22deg) rotateZ(14deg) rotateY(0deg)",
                  willChange: "transform",
                }}
              >
                {/* SVG 2A: Rear Volumetric Glass Facet & Ambient Occlusion (translateZ -7px) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: "translateZ(-7px)", transformStyle: "preserve-3d" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 318 318" style={{ overflow: "visible" }}>
                    <defs>
                      <filter id="tube-shadow-violet-ap" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                      </filter>
                    </defs>
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="rgba(2, 6, 16, 0.70)"
                      strokeWidth="28"
                      filter="url(#tube-shadow-violet-ap)"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.10)"
                      strokeWidth="22"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="rgba(130, 95, 239, 0.22)"
                      strokeWidth="18"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="136"
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.35)"
                      strokeWidth="1.2"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="158"
                      fill="none"
                      stroke="rgba(130, 95, 239, 0.45)"
                      strokeWidth="1.2"
                    />
                  </svg>
                </div>

                {/* SVG 2B: Fiber-Optic Waveguide with Total Internal Reflection (translateZ 0px) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: "translateZ(0px)", transformStyle: "preserve-3d" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 318 318" style={{ overflow: "visible" }}>
                    <defs>
                      <filter id="neon-glow-violet-ap" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3.5" result="blur1" />
                        <feGaussianBlur stdDeviation="1.5" result="blur2" />
                        <feMerge>
                          <feMergeNode in="blur1" />
                          <feMergeNode in="blur2" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="tir-photon-violet-ap" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#825FEF" stopOpacity="0" />
                        <stop offset="40%" stopColor="#A855F7" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
                        <stop offset="60%" stopColor="#A855F7" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#825FEF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="#825FEF"
                      strokeWidth="6.5"
                      opacity="0.82"
                      filter="url(#neon-glow-violet-ap)"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.2"
                      opacity="0.95"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="url(#tir-photon-violet-ap)"
                      strokeWidth="5.5"
                      strokeDasharray="35 240"
                      className="animate-fiber-optic-2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeWidth="2.8"
                      strokeDasharray="14 340"
                      className="animate-fiber-surge-2"
                      strokeLinecap="round"
                      filter="url(#neon-glow-violet-ap)"
                    />
                  </svg>
                </div>

                {/* SVG 2C: Front Dual-Chamfered Polished Sapphire Facet (translateZ +7px) */}
                <div
                  className="absolute inset-0 w-full h-full"
                  style={{ transform: "translateZ(7px)", transformStyle: "preserve-3d" }}
                >
                  <svg className="w-full h-full" viewBox="0 0 318 318" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="glass-specular-violet-ap" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                        <stop offset="38%" stopColor="#825FEF" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.98" />
                        <stop offset="82%" stopColor="#825FEF" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.16)"
                      strokeWidth="22"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="158"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.88)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="158"
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.70)"
                      strokeWidth="1.2"
                      strokeDasharray="5 30"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="136"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.60)"
                      strokeWidth="1.3"
                    />
                    <circle
                      cx="159"
                      cy="159"
                      r="147"
                      fill="none"
                      stroke="url(#glass-specular-violet-ap)"
                      strokeWidth="22"
                      strokeDasharray="100 420"
                      className="animate-glass-glare-2"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* White-Gold Magnetic Gimbal */}
                  <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 flex items-center justify-center pointer-events-none">
                    <div className="relative w-6.5 h-6.5 rounded-full bg-gradient-to-br from-[#FFFFFF] via-[#E2E8F0] to-[#94A3B8] p-[1.5px] shadow-[0_0_22px_rgba(130,95,239,0.9),inset_0_1px_2px_#ffffff]">
                      <div className="w-full h-full rounded-full bg-[#0B132B] flex items-center justify-center border border-white/40">
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#A855F7]/50 animate-gimbal-prism" />
                        <div className="w-2.5 h-2.5 rounded-[2.5px] bg-gradient-to-tr from-[#A855F7] via-[#FFFFFF] to-[#C084FC] rotate-45 shadow-[0_0_10px_#A855F7] animate-gimbal-prism flex items-center justify-center">
                          <span className="w-1.2 h-1.2 rounded-full bg-white shadow-[0_0_6px_#ffffff]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Central Living Rotating AI Sphere ── */}
            <div ref={centerRef} className="relative z-20 rounded-full">
              <CareerAIOrb
                size={220}
                isVoiceActive={isVoiceActive || isGenerating}
                onToggleVoice={onToggleVoice}
                label={isGenerating ? "SYNTHESIZING..." : "ACTION AI"}
                subtitle={isGenerating ? "Generating vectors" : "Live decision engine"}
                hideText={hideText}
              />
            </div>
          </div>
        </div>

        {/* ── Dynamic Water Stage Caustic Light Pool & Glass Torus Ground Shadow ── */}
        <div className="absolute -bottom-6 w-[360px] h-[70px] pointer-events-none z-10 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full blur-xl"
            style={{
              background: "radial-gradient(ellipse at center, rgba(2,6,16,0.85) 0%, rgba(2,6,16,0.4) 50%, transparent 70%)",
              transform: "scaleY(0.35)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full blur-md animate-caustic-shimmer"
            style={{
              background: "radial-gradient(ellipse at center, rgba(0,240,255,0.45) 0%, rgba(130,95,239,0.30) 45%, transparent 70%)",
            }}
          />
          <div
            className="absolute w-[280px] h-[40px] rounded-full border border-[#00CEE6]/40 blur-[1px] animate-water-ripple"
            style={{ transform: "scaleY(0.35)" }}
          />
        </div>

        {/* ── Holographic Floor Pedestal & Voice Controls ── */}
        {!hideControls && (
          <div className="relative -mt-6 flex flex-col items-center justify-center z-30">
            <div className="relative w-44 h-8 flex items-center justify-center pointer-events-none">
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{
                  background: "linear-gradient(90deg, rgba(0,206,230,0.5), rgba(130,95,239,0.5), rgba(0,206,230,0.5))",
                  transform: "scaleY(0.38)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full border border-[#00CEE6]/60 shadow-[0_0_16px_#00CEE6]"
                style={{ transform: "scaleY(0.38)" }}
              />
              <div
                className="absolute inset-1.5 rounded-full border border-[#825FEF]/50"
                style={{ transform: "scaleY(0.38)" }}
              />
            </div>

            <button
              onClick={onToggleVoice}
              className="relative -mt-3.5 w-11 h-11 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95"
              style={{
                background: isVoiceActive
                  ? "linear-gradient(135deg, #EF4444, #DC2626)"
                  : "linear-gradient(135deg, #00CEE6, #00B4D8)",
                color: isVoiceActive ? "#FFFFFF" : "#11233D",
                boxShadow: isVoiceActive
                  ? "0 0 28px rgba(239,68,68,0.85)"
                  : "0 0 26px rgba(0,206,230,0.85)",
              }}
              title={isVoiceActive ? "Stop Voice Listening" : "Speak to Action AI"}
            >
              {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
