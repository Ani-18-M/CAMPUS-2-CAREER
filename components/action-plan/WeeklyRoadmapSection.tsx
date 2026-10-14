"use client";

import React, { useState } from "react";
import { Calendar, Clock, CheckCircle2, RotateCcw, Plus, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export interface RoadmapActivity {
  id: string;
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  activity: string;
  category: "Academic" | "Placement" | "Learning" | "Review";
  durationMinutes: number;
  completed: boolean;
  timeSlot: string;
}

export default function WeeklyRoadmapSection() {
  const [activities, setActivities] = useState<RoadmapActivity[]>([
    {
      id: "act-mon",
      day: "Monday",
      activity: "DBMS Normalization & BCNF",
      category: "Academic",
      durationMinutes: 45,
      completed: true,
      timeSlot: "5:00 PM – 5:45 PM",
    },
    {
      id: "act-tue",
      day: "Tuesday",
      activity: "Graph Traversal (BFS & DFS)",
      category: "Placement",
      durationMinutes: 60,
      completed: true,
      timeSlot: "6:00 PM – 7:00 PM",
    },
    {
      id: "act-wed",
      day: "Wednesday",
      activity: "OS Lab 3: Page Replacement",
      category: "Learning",
      durationMinutes: 45,
      completed: false,
      timeSlot: "4:30 PM – 5:15 PM",
    },
    {
      id: "act-thu",
      day: "Thursday",
      activity: "JP Morgan Aptitude Practice",
      category: "Placement",
      durationMinutes: 30,
      completed: false,
      timeSlot: "7:00 PM – 7:30 PM",
    },
    {
      id: "act-fri",
      day: "Friday",
      activity: "Quiz 2 Mistake Analysis",
      category: "Academic",
      durationMinutes: 30,
      completed: false,
      timeSlot: "5:30 PM – 6:00 PM",
    },
    {
      id: "act-sat",
      day: "Saturday",
      activity: "IoT Saturday Make-up Lab",
      category: "Academic",
      durationMinutes: 90,
      completed: false,
      timeSlot: "10:00 AM – 11:30 AM",
    },
  ]);

  const [selectedDay, setSelectedDay] = useState<string>("All");

  const toggleActivityComplete = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const adjustDuration = (id: string, delta: number) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, durationMinutes: Math.max(15, a.durationMinutes + delta) }
          : a
      )
    );
  };

  const shiftDay = (id: string) => {
    const days: RoadmapActivity["day"][] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const currentIdx = days.indexOf(a.day);
          const nextDay = days[(currentIdx + 1) % days.length];
          return { ...a, day: nextDay };
        }
        return a;
      })
    );
  };

  const totalMinutes = activities.reduce((sum, a) => sum + a.durationMinutes, 0);
  const completedCount = activities.filter((a) => a.completed).length;

  const filteredActivities =
    selectedDay === "All"
      ? activities
      : activities.filter((a) => a.day === selectedDay);

  return (
    <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-300/60 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              {completedCount} of {activities.length} Completed
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#11233D] mt-0.5">
            Weekly Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Scheduled study blocks aligned with upcoming milestones.
          </p>
        </div>

        <div className="text-right text-xs self-start sm:self-center">
          <span className="text-slate-400 font-medium">Planned: </span>
          <strong className="text-[#11233D] font-black text-sm">
            {(totalMinutes / 60).toFixed(1)} hrs
          </strong>
        </div>
      </div>

      {/* Day Filter Pills Pod */}
      <div className="p-1.5 rounded-2xl bg-white/80 border-2 border-slate-200/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-bold">
        {["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
          (d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shrink-0 ${
                selectedDay === d
                  ? "bg-gradient-to-b from-[#64748B] via-[#475569] to-[#334155] text-white font-black shadow-[0_4px_12px_rgba(30,41,59,0.35),inset_0_2px_3px_rgba(255,255,255,0.35)]"
                  : "text-slate-600 hover:text-[#11233D] hover:bg-slate-100"
              }`}
            >
              {d === "All" ? "All Week" : d.slice(0, 3)}
            </button>
          )
        )}
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map((act) => (
          <div
            key={act.id}
            className={`p-4 sm:p-5 rounded-[26px] sm:rounded-[28px] border-2 transition-all flex flex-col justify-between min-h-[175px] ${
              act.completed
                ? "bg-slate-100/80 border-slate-300/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] opacity-85"
                : "bg-white/95 border-slate-200/90 shadow-[0_8px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,1)] hover:border-[#00CEE6]/80 hover:shadow-[0_12px_28px_rgba(17,35,61,0.08),inset_0_2px_4px_rgba(255,255,255,1)]"
            }`}
          >
            <div>
              {/* Day & Category */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-black text-[#11233D]">
                  {act.day}
                </span>
                <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-[#11233D] text-[#00CEE6]">
                  {act.category}
                </span>
              </div>

              {/* Activity Title */}
              <h4
                className={`text-sm sm:text-base font-black leading-snug line-clamp-1 mt-1 ${
                  act.completed
                    ? "text-slate-400 line-through"
                    : "text-[#11233D]"
                }`}
              >
                {act.activity}
              </h4>

              {/* Time slot & Duration controls */}
              <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 font-medium">
                <span className="flex items-center gap-1 font-bold text-slate-600">
                  <Clock className="w-3 h-3 text-[#00CEE6]" />
                  {act.timeSlot}
                </span>

                {/* Duration Adjuster */}
                <div className="flex items-center gap-1 bg-[#EFF4F7] rounded-lg px-1.5 py-0.5 border border-slate-200">
                  <button
                    onClick={() => adjustDuration(act.id, -15)}
                    className="hover:text-[#11233D] font-black px-1 text-slate-400 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="font-black text-[#11233D] text-[10px]">
                    {act.durationMinutes}m
                  </span>
                  <button
                    onClick={() => adjustDuration(act.id, 15)}
                    className="hover:text-[#11233D] font-black px-1 text-slate-400 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => shiftDay(act.id)}
                className="text-[10px] font-bold text-slate-400 hover:text-[#00CEE6] transition-colors cursor-pointer flex items-center gap-1"
                title="Reschedule to next day"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Shift Day</span>
              </button>

              <button
                onClick={() => toggleActivityComplete(act.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  act.completed
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-[#11233D] text-white hover:bg-[#00CEE6] hover:text-[#11233D]"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{act.completed ? "Done" : "Complete"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
