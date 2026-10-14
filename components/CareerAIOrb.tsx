"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles, Mic } from "lucide-react";

interface CareerAIOrbProps {
  isVoiceActive: boolean;
  onToggleVoice: () => void;
  size?: number;
  label?: string;
  subtitle?: string;
  hideText?: boolean;
}

// 12 Vertices of standard Icosahedron normalized to unit sphere
const PHI = (1 + Math.sqrt(5)) / 2;
const SCALE_ICO = 1 / Math.sqrt(1 + PHI * PHI);

const ICO_VERTICES_BASE: [number, number, number][] = [
  [-1, PHI, 0],
  [1, PHI, 0],
  [-1, -PHI, 0],
  [1, -PHI, 0],
  [0, -1, PHI],
  [0, 1, PHI],
  [0, -1, -PHI],
  [0, 1, -PHI],
  [PHI, 0, -1],
  [PHI, 0, 1],
  [-PHI, 0, -1],
  [-PHI, 0, 1],
].map(([x, y, z]) => [x * SCALE_ICO, y * SCALE_ICO, z * SCALE_ICO]);

// 30 Edges of the Icosahedron
const ICO_EDGES: [number, number][] = [
  [0, 1], [0, 5], [0, 7], [0, 10], [0, 11],
  [1, 5], [1, 7], [1, 8], [1, 9],
  [2, 3], [2, 4], [2, 6], [2, 10], [2, 11],
  [3, 4], [3, 6], [3, 8], [3, 9],
  [4, 5], [4, 9], [4, 11],
  [5, 9], [5, 11],
  [6, 7], [6, 8], [6, 10],
  [7, 8], [7, 10],
  [8, 9], [10, 11],
];

// 20 Triangular Faces of the Icosahedron
const ICO_FACES: [number, number, number][] = [
  [0, 1, 5], [0, 1, 7], [0, 5, 11], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [1, 7, 8], [1, 8, 9],
  [2, 3, 4], [2, 3, 6], [2, 4, 11], [2, 6, 10], [2, 10, 11],
  [3, 4, 9], [3, 6, 8], [3, 8, 9],
  [4, 5, 9], [4, 5, 11],
  [6, 7, 8], [6, 7, 10],
];

// 6 Vertices of inner Octahedron
const OCT_VERTICES_BASE: [number, number, number][] = [
  [1, 0, 0], [-1, 0, 0],
  [0, 1, 0], [0, -1, 0],
  [0, 0, 1], [0, 0, -1],
];

const OCT_EDGES: [number, number][] = [
  [0, 2], [0, 3], [0, 4], [0, 5],
  [1, 2], [1, 3], [1, 4], [1, 5],
  [2, 4], [2, 5],
  [3, 4], [3, 5],
];

interface OrbitingRune {
  angle: number;
  speed: number;
  radiusFrac: number;
  size: number;
  tilt: number;
  color: string;
}

export default function CareerAIOrb({
  isVoiceActive,
  onToggleVoice,
  size = 240,
  label = "CAREER AI",
  subtitle = "Click or speak to guide",
  hideText = false,
}: CareerAIOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);
  const [isHovered, setIsHovered] = useState(false);

  // Real-world interactive cursor parallax physics
  const mouseTargetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseCurrentRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const isVoiceActiveRef = useRef(isVoiceActive);
  isVoiceActiveRef.current = isVoiceActive;
  const isHoveredRef = useRef(isHovered);
  isHoveredRef.current = isHovered;

  /* ── Canvas: Real-World Quantum Crystal Hyper-Core ─────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 2, 2) : 2;
    const S = size * dpr;
    canvas.width = S;
    canvas.height = S;
    const cx = S / 2;
    const cy = S / 2;
    const R = S * 0.44; // Outer optical glass sphere radius (strictly circular)

    // Cached bounding rect to avoid layout thrashing on every pointermove
    let cachedRect: DOMRect | null = null;
    const updateCachedRect = () => {
      if (canvas) cachedRect = canvas.getBoundingClientRect();
    };
    updateCachedRect();

    // Interactive pointer parallax tracking (zero synchronous layout recalculation)
    const handlePointerMove = (e: PointerEvent) => {
      if (!cachedRect) updateCachedRect();
      if (!cachedRect) return;
      const orbCenterX = cachedRect.left + cachedRect.width / 2;
      const orbCenterY = cachedRect.top + cachedRect.height / 2;
      const dx = (e.clientX - orbCenterX) / (window.innerWidth * 0.45);
      const dy = (e.clientY - orbCenterY) / (window.innerHeight * 0.45);
      mouseTargetRef.current = {
        x: Math.max(-1, Math.min(1, dx)),
        y: Math.max(-1, Math.min(1, dy)),
      };
    };

    const handlePointerLeave = () => {
      mouseTargetRef.current = { x: 0, y: 0 };
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", updateCachedRect, { passive: true });
    window.addEventListener("scroll", updateCachedRect, { passive: true });

    // Orbiting micro-diamonds in dual inclined bands
    const runes: OrbitingRune[] = [];
    for (let i = 0; i < 22; i++) {
      runes.push({
        angle: (i / 22) * Math.PI * 2,
        speed: (0.007 + (i % 3) * 0.004) * (i % 2 === 0 ? 1 : -0.85),
        radiusFrac: 0.76 + (i % 4) * 0.04,
        size: (2 + (i % 3)) * dpr,
        tilt: (i % 2 === 0 ? 0.38 : -0.44),
        color: i % 2 === 0 ? "#00F0FF" : "#A855F7",
      });
    }

    let t = 0;
    let smoothScale = 1.0;

    const rotateVec3D = (
      v: [number, number, number],
      cosX: number, sinX: number,
      cosY: number, sinY: number,
      cosZ: number, sinZ: number,
      radius: number
    ): [number, number, number] => {
      // 3D Euler Transformation
      const y1 = v[1] * cosX - v[2] * sinX;
      const z1 = v[1] * sinX + v[2] * cosX;
      const x2 = v[0] * cosY + z1 * sinY;
      const z2 = -v[0] * sinY + z1 * cosY;
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;
      return [x3 * radius, y3 * radius, z2 * radius];
    };

    let isRunning = true;
    const render = () => {
      if (!isRunning) return;
      // Skip expensive drawing when tab is hidden/backgrounded
      if (document.hidden) {
        animRef.current = requestAnimationFrame(render);
        return;
      }

      // 1. Organic Harmonic Physics & Spring Interpolation
      const speedMultiplier = isVoiceActiveRef.current ? 2.3 : isHoveredRef.current ? 1.5 : 1.0;
      const organicBreathing = 1 + 0.16 * Math.sin(t * 0.65) * Math.cos(t * 0.42);
      const dt = 0.011 * speedMultiplier * organicBreathing;
      t += dt;

      // Spring damper for interactive mouse tilt (lerp)
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.055;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.055;
      const mx = mouseCurrentRef.current.x;
      const my = mouseCurrentRef.current.y;

      // Organic respiratory expansion
      const targetScale = isVoiceActiveRef.current ? 1.08 : isHoveredRef.current ? 1.04 : (1.0 + Math.sin(t * 1.1) * 0.018);
      smoothScale += (targetScale - smoothScale) * 0.08;

      ctx.clearRect(0, 0, S, S);

      /* ── 2. SPHERE BASE (Strict circular boundary clip) ── */
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // Deep space quantum vacuum base (rich optical depth)
      const bg = ctx.createRadialGradient(
        cx - R * 0.2 + mx * R * 0.1, cy - R * 0.25 + my * R * 0.1, R * 0.05,
        cx, cy, R
      );
      bg.addColorStop(0, "#081C38");
      bg.addColorStop(0.38, "#051328");
      bg.addColorStop(0.72, "#030A18");
      bg.addColorStop(1, "#01040C");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, S, S);

      // Core parallax shift (quantum core shifts towards cursor)
      const coreShiftX = cx + mx * R * 0.16;
      const coreShiftY = cy + my * R * 0.16;

      /* ── 3. VOLUMETRIC LASER GOD-RAYS ── */
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const beamCount = 6;
      for (let b = 0; b < beamCount; b++) {
        const bAngle = t * 0.35 + (b / beamCount) * Math.PI * 2 + mx * 0.2;
        const bLength = R * 1.08;
        const bx = coreShiftX + Math.cos(bAngle) * bLength;
        const by = coreShiftY + Math.sin(bAngle) * bLength;

        const bGrad = ctx.createLinearGradient(coreShiftX, coreShiftY, bx, by);
        const bAlpha = (Math.sin(t * 1.6 + b) * 0.14 + 0.24) * (isVoiceActive ? 1.8 : 1);
        bGrad.addColorStop(0, `rgba(255, 255, 255, ${bAlpha * 1.4})`);
        bGrad.addColorStop(0.22, `rgba(0, 240, 255, ${bAlpha})`);
        bGrad.addColorStop(0.60, `rgba(130, 95, 239, ${bAlpha * 0.45})`);
        bGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.strokeStyle = bGrad;
        ctx.lineWidth = (5 + Math.sin(t * 1.9 + b) * 3) * dpr;
        ctx.beginPath();
        ctx.moveTo(coreShiftX, coreShiftY);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();

      /* ── 4. SUBSURFACE SCATTERING (SSS) INTERNAL MIST ── */
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const sssPulse = Math.sin(t * 1.3) * 0.08 + 0.45;
      const sssGrad = ctx.createRadialGradient(coreShiftX, coreShiftY, R * 0.08, cx, cy, R * 0.78);
      sssGrad.addColorStop(0, `rgba(0, 240, 255, ${sssPulse * 0.40})`);
      sssGrad.addColorStop(0.40, `rgba(130, 95, 239, ${sssPulse * 0.25})`);
      sssGrad.addColorStop(0.75, `rgba(255, 77, 141, ${sssPulse * 0.08})`);
      sssGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sssGrad;
      ctx.fillRect(0, 0, S, S);
      ctx.restore();

      /* ── 5. 3D ROTATION OF ICOSAHEDRON (Organic + Interactive Mouse Tilt) ── */
      const tiltPitch = my * 0.38; // interactive vertical cursor tilt
      const tiltYaw = mx * 0.45;   // interactive horizontal cursor tilt
      const zeroGWobble = Math.sin(t * 0.5) * 0.08;

      const rotX1 = t * 0.65 + tiltPitch + 0.25;
      const rotY1 = t * 0.88 + tiltYaw;
      const rotZ1 = t * 0.38 + zeroGWobble;

      const cosX1 = Math.cos(rotX1), sinX1 = Math.sin(rotX1);
      const cosY1 = Math.cos(rotY1), sinY1 = Math.sin(rotY1);
      const cosZ1 = Math.cos(rotZ1), sinZ1 = Math.sin(rotZ1);

      const icoRadius = R * 0.68 * smoothScale;
      const projectedIco: { x: number; y: number; z: number }[] = ICO_VERTICES_BASE.map((v, idx) => {
        // Acoustic cymatic micro-vibration when voice is active
        const cymaticVibe = isVoiceActive ? Math.sin(t * 22 + idx * 2.1) * 0.04 : 0;
        const vertexR = icoRadius * (1 + cymaticVibe);

        const [rx, ry, rz] = rotateVec3D(v, cosX1, sinX1, cosY1, sinY1, cosZ1, sinZ1, vertexR);
        // 3D Perspective Projection
        const pz = rz + R * 2.3;
        const scale = (R * 2.3) / pz;
        return {
          x: coreShiftX + rx * scale,
          y: coreShiftY + ry * scale,
          z: rz,
        };
      });

      /* ── 6. DEPTH-OF-FIELD: REAR EDGES (Milky Subsurface Blur) ── */
      ctx.save();
      for (let e = 0; e < ICO_EDGES.length; e++) {
        const [iA, iB] = ICO_EDGES[e];
        const pA = projectedIco[iA];
        const pB = projectedIco[iB];
        const avgZ = (pA.z + pB.z) / (2 * icoRadius);

        // Render only rear edges in background pass (soft-focus blur)
        if (avgZ <= 0) {
          const edgeAlpha = Math.max(0.12, 0.32 + avgZ * 0.28);
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.strokeStyle = `rgba(0, 206, 230, ${edgeAlpha * 0.40})`;
          ctx.lineWidth = 1.8 * dpr; // thicker diffuse line
          ctx.shadowColor = "#00CEE6";
          ctx.shadowBlur = 8 * dpr;
          ctx.stroke();
        }
      }
      ctx.restore();

      /* ── 7. RENDER IRIDESCENT CRYSTAL FACETS (Front-Facing Prism Surfaces) ── */
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let f = 0; f < ICO_FACES.length; f++) {
        const [iA, iB, iC] = ICO_FACES[f];
        const pA = projectedIco[iA];
        const pB = projectedIco[iB];
        const pC = projectedIco[iC];

        // Surface normal Z calculation
        const vAx = pB.x - pA.x;
        const vAy = pB.y - pA.y;
        const vBx = pC.x - pA.x;
        const vBy = pC.y - pA.y;
        const normalZ = vAx * vBy - vAy * vBx;

        if (normalZ > 0) {
          const avgZ = (pA.z + pB.z + pC.z) / (3 * icoRadius);
          const facetIntensity = Math.min(1, Math.max(0, normalZ / 7500 + avgZ * 0.45));

          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.lineTo(pC.x, pC.y);
          ctx.closePath();

          // Prismatic chromatic dispersion across facets
          if (f % 3 === 0) {
            ctx.fillStyle = `rgba(0, 240, 255, ${facetIntensity * 0.24})`;
          } else if (f % 3 === 1) {
            ctx.fillStyle = `rgba(168, 85, 247, ${facetIntensity * 0.22})`;
          } else {
            ctx.fillStyle = `rgba(255, 77, 141, ${facetIntensity * 0.18})`;
          }
          ctx.fill();

          // Crisp diamond edge highlight
          ctx.strokeStyle = `rgba(255, 255, 255, ${facetIntensity * 0.50})`;
          ctx.lineWidth = 0.9 * dpr;
          ctx.stroke();
        }
      }
      ctx.restore();

      /* ── 8. DEPTH-OF-FIELD: FRONT LASER EDGES (Ultra-Sharp Diamond Clarity) ── */
      ctx.save();
      for (let e = 0; e < ICO_EDGES.length; e++) {
        const [iA, iB] = ICO_EDGES[e];
        const pA = projectedIco[iA];
        const pB = projectedIco[iB];
        const avgZ = (pA.z + pB.z) / (2 * icoRadius);

        if (avgZ > 0) {
          const edgeAlpha = Math.min(1, 0.45 + avgZ * 0.55);
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.strokeStyle = e % 2 === 0
            ? `rgba(0, 240, 255, ${edgeAlpha * 0.98})`
            : `rgba(168, 85, 247, ${edgeAlpha * 0.92})`;
          ctx.lineWidth = (1.8 + avgZ * 0.9) * dpr;
          ctx.shadowColor = e % 2 === 0 ? "#00F0FF" : "#A855F7";
          ctx.shadowBlur = 10 * dpr;
          ctx.stroke();
        }
      }
      ctx.restore();

      /* ── 9. VERTEX DIAMOND CRYSTAL NODES (With Starburst Flares) ── */
      for (let i = 0; i < projectedIco.length; i++) {
        const p = projectedIco[i];
        const zNorm = p.z / icoRadius;

        if (zNorm > -0.35) {
          const depth = (zNorm + 0.35) / 1.35;
          const nodeSize = (2.2 + depth * 3.8) * dpr;

          // Vertex Diamond Photon
          ctx.beginPath();
          ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
          ctx.fillStyle = depth > 0.62 ? "#FFFFFF" : "#00F0FF";
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 14 * dpr;
          ctx.fill();

          // Diamond crosshair starburst glint on closest vertices
          if (depth > 0.72) {
            ctx.save();
            ctx.strokeStyle = "rgba(255, 255, 255, 0.90)";
            ctx.lineWidth = 1.3 * dpr;
            const glintLen = nodeSize * 2.4;
            ctx.beginPath();
            ctx.moveTo(p.x - glintLen, p.y);
            ctx.lineTo(p.x + glintLen, p.y);
            ctx.moveTo(p.x, p.y - glintLen);
            ctx.lineTo(p.x, p.y + glintLen);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      /* ── 10. INNER COUNTER-ROTATING OCTAHEDRAL QUANTUM CORE ── */
      const rotX2 = -t * 1.1 - tiltPitch * 0.5;
      const rotY2 = -t * 1.35 - tiltYaw * 0.5;
      const rotZ2 = t * 0.55;
      const cosX2 = Math.cos(rotX2), sinX2 = Math.sin(rotX2);
      const cosY2 = Math.cos(rotY2), sinY2 = Math.sin(rotY2);
      const cosZ2 = Math.cos(rotZ2), sinZ2 = Math.sin(rotZ2);

      const octRadius = R * (0.34 + Math.sin(t * 2.2) * 0.02) * smoothScale;
      const projectedOct: { x: number; y: number; z: number }[] = OCT_VERTICES_BASE.map((v) => {
        const [rx, ry, rz] = rotateVec3D(v, cosX2, sinX2, cosY2, sinY2, cosZ2, sinZ2, octRadius);
        return {
          x: coreShiftX + rx,
          y: coreShiftY + ry,
          z: rz,
        };
      });

      // Octahedron laser filaments
      ctx.save();
      for (let e = 0; e < OCT_EDGES.length; e++) {
        const [iA, iB] = OCT_EDGES[e];
        const pA = projectedOct[iA];
        const pB = projectedOct[iB];

        ctx.beginPath();
        ctx.moveTo(pA.x, pA.y);
        ctx.lineTo(pB.x, pB.y);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.90)";
        ctx.lineWidth = 1.7 * dpr;
        ctx.shadowColor = "#825FEF";
        ctx.shadowBlur = 12 * dpr;
        ctx.stroke();
      }
      ctx.restore();

      /* ── 11. CENTRAL QUANTUM SINGULARITY (White-Hot Pulsing Core) ── */
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const singPulse = Math.sin(t * 2.8) * 0.15 + 0.85;
      const singRadius = R * (0.24 + (isVoiceActive ? 0.09 : 0)) * smoothScale;
      const singGrad = ctx.createRadialGradient(coreShiftX, coreShiftY, 0, coreShiftX, coreShiftY, singRadius);
      singGrad.addColorStop(0, `rgba(255, 255, 255, ${singPulse * 0.98})`);
      singGrad.addColorStop(0.28, `rgba(0, 240, 255, ${singPulse * 0.88})`);
      singGrad.addColorStop(0.62, `rgba(130, 95, 239, ${singPulse * 0.45})`);
      singGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = singGrad;
      ctx.beginPath();
      ctx.arc(coreShiftX, coreShiftY, singRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      /* ── 12. ORBITING MICRO-DIAMONDS & QUANTUM PARTICLES ── */
      for (let i = 0; i < runes.length; i++) {
        const r = runes[i];
        r.angle += r.speed * speedMultiplier;

        const rad = R * r.radiusFrac * smoothScale;
        const rx = coreShiftX + Math.cos(r.angle) * rad;
        const ry = coreShiftY + Math.sin(r.angle) * rad * Math.cos(r.tilt);

        ctx.save();
        ctx.translate(rx, ry);
        ctx.rotate(r.angle + t);
        ctx.beginPath();
        ctx.moveTo(0, -r.size);
        ctx.lineTo(r.size * 0.7, 0);
        ctx.lineTo(0, r.size);
        ctx.lineTo(-r.size * 0.7, 0);
        ctx.closePath();
        ctx.fillStyle = r.color;
        ctx.shadowColor = r.color;
        ctx.shadowBlur = 7 * dpr;
        ctx.fill();
        ctx.restore();
      }

      /* ── 13. CYMATICS & ACOUSTIC SHOCKWAVE PULSES (Voice Active) ── */
      if (isVoiceActive) {
        for (let w = 1; w <= 3; w++) {
          const wPhase = (t * 2.5 + w * 0.65) % 2;
          const wRad = R * (0.18 + wPhase * 0.75);
          const wAlpha = Math.max(0, 1 - wPhase / 2);

          ctx.beginPath();
          ctx.arc(coreShiftX, coreShiftY, wRad, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 240, 255, ${wAlpha * 0.9})`;
          ctx.lineWidth = (3.2 - w * 0.6) * dpr;
          ctx.shadowColor = "#00F0FF";
          ctx.shadowBlur = 14 * dpr;
          ctx.stroke();
        }
      }

      /* ── 14. LIQUID-GLASS IRIDESCENCE & DIAMOND SPECULAR GLINTS ── */
      ctx.globalCompositeOperation = "source-over";

      // Prismatic Rainbow Dispersion Rim (Fresnel Dispersion)
      const fresnelRim = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R);
      fresnelRim.addColorStop(0, "rgba(0, 0, 0, 0)");
      fresnelRim.addColorStop(0.60, "rgba(0, 206, 230, 0.22)");
      fresnelRim.addColorStop(0.80, "rgba(130, 95, 239, 0.48)");
      fresnelRim.addColorStop(0.93, "rgba(0, 240, 255, 0.88)");
      fresnelRim.addColorStop(1, "rgba(255, 255, 255, 0.98)");
      ctx.fillStyle = fresnelRim;
      ctx.fillRect(0, 0, S, S);

      // Diamond-Cut Sharp Specular Keylight (Upper-Left Glass Dome)
      ctx.save();
      ctx.translate(cx - R * 0.32, cy - R * 0.36);
      ctx.rotate(-Math.PI / 4.2);
      const specGrad1 = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.52);
      specGrad1.addColorStop(0, "rgba(255, 255, 255, 0.92)");
      specGrad1.addColorStop(0.20, "rgba(255, 255, 255, 0.48)");
      specGrad1.addColorStop(0.55, "rgba(0, 240, 255, 0.16)");
      specGrad1.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = specGrad1;
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 0.46, R * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Top Rim Specular Glint
      ctx.beginPath();
      ctx.ellipse(R * 0.15, R * 0.08, R * 0.28, R * 0.08, 0.12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 255, 255, 0.42)";
      ctx.fill();
      ctx.restore();

      // Lower-Right Aquatic Caustic Bounce Highlight
      ctx.save();
      ctx.translate(cx + R * 0.32, cy + R * 0.34);
      const specGrad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.40);
      specGrad2.addColorStop(0, "rgba(0, 206, 230, 0.34)");
      specGrad2.addColorStop(0.50, "rgba(130, 95, 239, 0.18)");
      specGrad2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = specGrad2;
      ctx.beginPath();
      ctx.ellipse(0, 0, R * 0.36, R * 0.14, Math.PI / 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore(); // End sphere clip

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", updateCachedRect);
      window.removeEventListener("scroll", updateCachedRect);
    };
  }, [size]);

  const orbD = size;

  return (
    <div
      className="relative flex items-center justify-center select-none cursor-pointer rounded-full group"
      style={{ width: orbD, height: orbD }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggleVoice}
      title={isVoiceActive ? "Listening... click to pause" : "Click to speak with Career AI"}
    >
      {/* ── 1. Perfectly Circular Quantum Crystal Aura (Real-world Photon Emission) ── */}
      <div
        className="absolute -inset-9 rounded-full pointer-events-none blur-3xl transition-opacity duration-500"
        style={{
          background: isVoiceActive
            ? "radial-gradient(circle, rgba(0,240,255,0.45) 0%, rgba(130,95,239,0.30) 40%, rgba(255,77,141,0.15) 65%, transparent 75%)"
            : "radial-gradient(circle, rgba(0,240,255,0.30) 0%, rgba(130,95,239,0.20) 40%, rgba(255,77,141,0.08) 65%, transparent 75%)",
          opacity: isHovered ? 1 : 0.88,
        }}
      />

      {/* ── 2. Crystalline 3D Canvas Sphere ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none transition-transform duration-500 rounded-full overflow-hidden"
        style={{
          width: orbD,
          height: orbD,
          transform: isHovered ? "scale(1.04)" : "scale(1)",
        }}
      />

      {/* ── 3. High-End Holographic Quantum Crystal Badge ── */}
      {!hideText && (
        <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none text-center px-4">
          {/* Holographic Glowing Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#081528]/80 backdrop-blur-md border border-[#00F0FF]/45 shadow-[0_0_22px_rgba(0,240,255,0.4),inset_0_0_8px_rgba(255,255,255,0.2)] group-hover:border-[#00F0FF]/90 transition-all duration-300">
            <Sparkles className="w-3.5 h-3.5 text-[#00F0FF] animate-pulse" />
            <span
              className="text-[11px] sm:text-xs font-black tracking-widest text-white uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{ textShadow: "0 0 12px rgba(0,240,255,0.85)" }}
            >
              {label}
            </span>
          </div>

          {/* Dynamic Status / Voice Indicator */}
          {isVoiceActive ? (
            <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#11233D]/90 border border-[#00CEE6] shadow-[0_0_24px_#00CEE6] animate-pulse">
              {["-0.3s", "-0.15s", "0s", "-0.2s"].map((delay, idx) => (
                <span
                  key={idx}
                  className="w-0.5 rounded-full animate-bounce"
                  style={{
                    height: [14, 20, 10, 16][idx],
                    animationDelay: delay,
                    backgroundColor: idx % 2 === 0 ? "#00F0FF" : "#A855F7",
                  }}
                />
              ))}
              <span className="text-[10px] font-bold text-white ml-0.5">Listening…</span>
            </div>
          ) : (
            <p
              className="text-[10px] font-semibold text-[#A0F2FA]/80 mt-1.5 tracking-wide drop-shadow-md transition-opacity duration-300 group-hover:text-white"
            >
              {subtitle}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
