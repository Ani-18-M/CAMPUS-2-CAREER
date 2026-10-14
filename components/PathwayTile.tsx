"use client";

import React from "react";

export type PathwayShapeType =
  | "top-left" // Placements & Jobs (bottom-right beveled)
  | "mid-top-left" // Internships (right edge curves inward)
  | "mid-bottom-left" // Higher Studies (right edge curves outward)
  | "bottom-left" // Entrepreneurship (top-right beveled)
  | "top-right" // Mentors & Guidance (bottom-left beveled)
  | "mid-top-right" // Competitive Exams (left edge curves inward)
  | "mid-bottom-right" // Research & Innovation (left edge curves outward)
  | "bottom-right"; // Skills & Certifications (top-left beveled)

interface PathwayTileProps {
  id: string;
  name: string;
  shape: PathwayShapeType;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  className?: string;
}

export default function PathwayTile({
  name,
  shape,
  isSelected = false,
  isHovered = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = "",
}: PathwayTileProps) {
  // SVG Path geometries defined in 320 x 64 coordinate space
  const getPathData = (): string => {
    switch (shape) {
      case "top-left":
        // Left side full pill arc, bottom-right beveled at angle to hug top-left of orb
        return "M 32,0 L 285,0 Q 298,0 298,14 L 298,34 Q 298,44 288,52 L 268,62 Q 260,64 250,64 L 32,64 A 32 32 0 0 1 32 0 Z";

      case "mid-top-left":
        // Left side pill arc, right edge curves along upper-left equator of orb
        return "M 32,0 L 282,0 Q 296,0 295,14 L 286,50 Q 284,64 270,64 L 32,64 A 32 32 0 0 1 32 0 Z";

      case "mid-bottom-left":
        // Left side pill arc, right edge curves along lower-left equator of orb
        return "M 32,0 L 270,0 Q 284,0 286,14 L 295,50 Q 296,64 282,64 L 32,64 A 32 32 0 0 1 32 0 Z";

      case "bottom-left":
        // Left side pill arc, top-right beveled at angle to hug bottom-left of orb
        return "M 32,0 L 250,0 Q 260,0 268,2 L 288,12 Q 298,20 298,30 L 298,50 Q 298,64 285,64 L 32,64 A 32 32 0 0 1 32 0 Z";

      case "top-right":
        // Mirrored of top-left (bottom-left beveled)
        return "M 288,0 L 35,0 Q 22,0 22,14 L 22,34 Q 22,44 32,52 L 52,62 Q 60,64 70,64 L 288,64 A 32 32 0 0 0 288 0 Z";

      case "mid-top-right":
        // Mirrored of mid-top-left
        return "M 288,0 L 38,0 Q 24,0 25,14 L 34,50 Q 36,64 50,64 L 288,64 A 32 32 0 0 0 288 0 Z";

      case "mid-bottom-right":
        // Mirrored of mid-bottom-left
        return "M 288,0 L 50,0 Q 36,0 34,14 L 25,50 Q 24,64 38,64 L 288,64 A 32 32 0 0 0 288 0 Z";

      case "bottom-right":
        // Mirrored of bottom-left (top-left beveled)
        return "M 288,0 L 70,0 Q 60,0 52,2 L 32,12 Q 22,20 22,30 L 22,50 Q 22,64 35,64 L 288,64 A 32 32 0 0 0 288 0 Z";

      default:
        return "M 32,0 L 288,0 A 32 32 0 0 1 288 64 L 32,64 A 32 32 0 0 1 32 0 Z";
    }
  };

  const pathData = getPathData();

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`group relative flex items-center justify-center cursor-pointer transition-all duration-300 ease-out select-none ${className}`}
      style={{
        width: "100%",
        maxWidth: "320px",
        height: "64px",
        filter: isSelected
          ? "drop-shadow(0 8px 24px rgba(130, 95, 239, 0.35))"
          : isHovered
          ? "drop-shadow(0 10px 24px rgba(0, 206, 230, 0.3))"
          : "drop-shadow(0 6px 16px rgba(17, 35, 61, 0.06))",
        transform: isHovered ? "scale(1.035) translateY(-2px)" : isSelected ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Sculpted SVG Background Card */}
      <svg
        viewBox="0 0 320 64"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-300"
      >
        <path
          d={pathData}
          fill="#FFFFFF"
          stroke={isSelected ? "#825FEF" : isHovered ? "#00CEE6" : "#ACBACC"}
          strokeWidth={isSelected ? "2.5" : isHovered ? "2" : "1.2"}
          strokeOpacity={isSelected ? "1" : isHovered ? "1" : "0.5"}
          className="transition-colors duration-200"
        />
      </svg>

      {/* Button Content */}
      <span
        className={`relative z-10 font-bold text-sm md:text-[15px] tracking-tight transition-colors duration-200 px-6 ${
          isSelected
            ? "text-[#825FEF]"
            : isHovered
            ? "text-[#00CEE6]"
            : "text-[#11233D]"
        }`}
      >
        {name}
      </span>
    </button>
  );
}
