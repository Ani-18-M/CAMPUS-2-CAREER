"use client";

import React, { useState } from "react";
import { X, Target, Plus, CheckCircle2 } from "lucide-react";

export interface GoalItem {
  id: string;
  title: string;
  category: "Academic" | "Placement" | "Attendance" | "Skills";
  currentValue: number;
  targetValue: number;
  unit: string;
  targetDate: string;
  measure: string;
}

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: GoalItem) => void;
}

export default function CreateGoalModal({
  isOpen,
  onClose,
  onCreateGoal,
}: CreateGoalModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GoalItem["category"]>("Academic");
  const [currentValue, setCurrentValue] = useState(60);
  const [targetValue, setTargetValue] = useState(75);
  const [unit, setUnit] = useState("%");
  const [targetDate, setTargetDate] = useState("Nov 15");
  const [measure, setMeasure] = useState("Mid-term exam scores");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    onCreateGoal({
      id: `goal-${Date.now()}`,
      title,
      category,
      currentValue: Number(currentValue),
      targetValue: Number(targetValue),
      unit,
      targetDate,
      measure,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-[32px] sm:rounded-[38px] shadow-[0_25px_60px_-15px_rgba(17,35,61,0.3),inset_0_2px_4px_rgba(255,255,255,0.95)] border-2 border-slate-300/80 overflow-hidden">
        {/* Header */}
        <div className="bg-[#11233D] text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00CEE6]/20 border border-[#00CEE6]/30 flex items-center justify-center text-[#00CEE6]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#00CEE6] block">
                Personal Progress Target
              </span>
              <h3 className="text-lg font-black text-white leading-tight">
                Create Improvement Goal
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Goal Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Graph Traversal & Dynamic Programming"
              className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalItem["category"])}
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              >
                <option value="Academic">Academic</option>
                <option value="Placement">Placement</option>
                <option value="Attendance">Attendance</option>
                <option value="Skills">Skills</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Target Date
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="e.g. Nov 15"
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Current Level
              </label>
              <input
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(Number(e.target.value))}
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Target Level
              </label>
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Unit
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="%, pts"
                className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3 py-2 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-1.5">
              Progress Measure Metric
            </label>
            <input
              type="text"
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              placeholder="e.g. Latest assessment average score"
              className="w-full bg-[#EFF4F7] border border-[#ACBACC]/40 rounded-xl px-3.5 py-2 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-black bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Goal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
