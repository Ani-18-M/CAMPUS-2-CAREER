"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Filter,
  Trash2,
  Calendar,
  ExternalLink,
  ChevronDown,
  Info,
  Play,
  RotateCcw,
} from "lucide-react";

export interface PlanTask {
  id: string;
  title: string;
  category: "Academic" | "Placement" | "Attendance" | "LMS";
  reason: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  dueDate: string;
  status: "In Progress" | "Pending" | "Completed";
  isOverdue?: boolean;
  resourceLink?: string;
  actionType: "code" | "attend" | "lms" | "study";
}

interface ActivePlanTasksSectionProps {
  tasks: PlanTask[];
  onToggleComplete: (taskId: string) => void;
  onStartTask: (task: PlanTask) => void;
  onUpdateDueDate: (taskId: string, newDate: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export default function ActivePlanTasksSection({
  tasks,
  onToggleComplete,
  onStartTask,
  onUpdateDueDate,
  onDeleteTask,
}: ActivePlanTasksSectionProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [expandedReasonId, setExpandedReasonId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesStatus =
      statusFilter === "All"
        ? true
        : statusFilter === "In Progress"
        ? t.status === "In Progress"
        : statusFilter === "Pending"
        ? t.status === "Pending"
        : t.status === "Completed";

    const matchesCategory =
      categoryFilter === "All" || t.category === categoryFilter;

    return matchesStatus && matchesCategory;
  });

  return (
    <div className="bg-gradient-to-br from-[#EAF0F6] via-[#F4F7FA] to-[#DEE6EE] rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border-2 border-slate-200/90 shadow-[0_20px_50px_-12px_rgba(17,35,61,0.08),0_6px_20px_rgba(17,35,61,0.04),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(0,0,0,0.02)] space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-300/60 gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black text-[#11233D]">
            Active Tasks
          </h2>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
            {tasks.filter((t) => t.status !== "Completed").length} In Progress
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs Pod */}
          <div className="p-1.5 rounded-2xl bg-white/80 border-2 border-slate-200/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] flex items-center gap-1 text-xs font-bold">
            {["All", "In Progress", "Pending", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-gradient-to-b from-[#64748B] via-[#475569] to-[#334155] text-white shadow-[0_4px_12px_rgba(30,41,59,0.35),inset_0_2px_3px_rgba(255,255,255,0.35)] font-black"
                    : "text-slate-600 hover:text-[#11233D]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white/80 border-2 border-slate-200/80 shadow-[inset_0_2px_4px_rgba(255,255,255,0.9)] rounded-2xl px-3 py-1.5 text-xs font-bold text-[#11233D] focus:outline-none focus:ring-2 focus:ring-[#00CEE6] cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Placement">Placement</option>
            <option value="Attendance">Attendance</option>
            <option value="LMS">LMS</option>
          </select>
        </div>
      </div>

      {/* Tasks Table Card */}
      <div className="rounded-[28px] bg-white/95 border-2 border-slate-200/90 shadow-[0_10px_28px_rgba(17,35,61,0.05),inset_0_2px_4px_rgba(255,255,255,1)] overflow-hidden">
        {/* Desktop Column Headers */}
        <div className="hidden md:grid md:grid-cols-12 gap-3 px-6 py-3.5 bg-slate-100/90 text-xs font-black uppercase tracking-wider text-slate-500 border-b-2 border-slate-200/80">
          <div className="col-span-4">Task</div>
          <div className="col-span-2 text-center">Category</div>
          <div className="col-span-1 text-center">Priority</div>
          <div className="col-span-2 text-center">Due Date</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Tasks Table / Card List */}
        <div className="divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-bold">
              No action tasks match the selected filters.
            </div>
          ) : (
            filteredTasks.map((task) => {
            const isCompleted = task.status === "Completed";

            return (
              <div
                key={task.id}
                className={`p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-center transition-colors ${
                  isCompleted
                    ? "bg-slate-50/60 opacity-80"
                    : "bg-white hover:bg-[#F8FAFC]"
                }`}
              >
                {/* Col 1: Task Title & Checkbox + Clean Inline Reason (4 cols) */}
                <div className="md:col-span-4 flex items-start gap-3.5 min-w-0">
                  <button
                    onClick={() => onToggleComplete(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 border ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "border-slate-300 hover:border-[#00CEE6] bg-white shadow-2xs"
                    }`}
                    title={isCompleted ? "Mark Pending" : "Mark Completed"}
                  >
                    {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4
                        className={`text-sm sm:text-base font-black truncate ${
                          isCompleted ? "text-slate-400 line-through" : "text-[#11233D]"
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.isOverdue && (
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-rose-500 text-white animate-pulse shrink-0">
                          Overdue
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 font-medium truncate">
                      {task.reason}
                    </p>
                  </div>
                </div>

                {/* Col 2: Category (2 cols text-center) */}
                <div className="md:col-span-2 flex justify-start md:justify-center">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#11233D] text-[#00CEE6]">
                    {task.category}
                  </span>
                </div>

                {/* Col 3: Priority (1 col text-center) */}
                <div className="md:col-span-1 flex justify-start md:justify-center">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                      task.priority === "Critical"
                        ? "bg-rose-500 text-white border-rose-600"
                        : task.priority === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                {/* Col 4: Due Date (2 cols text-center) */}
                <div className="md:col-span-2 flex justify-start md:justify-center items-center gap-1.5 text-xs text-slate-600 font-bold">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {editingDateId === task.id ? (
                    <input
                      type="text"
                      defaultValue={task.dueDate}
                      onBlur={(e) => {
                        onUpdateDueDate(task.id, e.target.value);
                        setEditingDateId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          onUpdateDueDate(task.id, (e.target as HTMLInputElement).value);
                          setEditingDateId(null);
                        }
                      }}
                      autoFocus
                      className="bg-white border border-[#00CEE6] rounded px-1.5 py-0.5 text-xs font-bold text-[#11233D] w-20 text-center"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingDateId(task.id)}
                      className="hover:underline font-bold text-slate-600"
                      title="Click to reschedule"
                    >
                      {task.dueDate}
                    </button>
                  )}
                </div>

                {/* Col 5: Status (1 col text-center) */}
                <div className="md:col-span-1 flex justify-start md:justify-center">
                  <span
                    className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : task.status === "In Progress"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* Col 6: Actions (2 cols text-right) */}
                <div className="md:col-span-2 flex items-center justify-end gap-2">
                  {!isCompleted && (
                    <button
                      onClick={() => onStartTask(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black bg-[#11233D] hover:bg-[#00CEE6] hover:text-[#11233D] text-white transition-all cursor-pointer shadow-2xs shrink-0"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      <span>Start</span>
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    title="Remove task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  </div>
);
}
