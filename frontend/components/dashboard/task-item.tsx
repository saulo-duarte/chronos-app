"use client";

import { Task, Collection } from "@/types";
import { cn } from "@/lib/utils";
import { Clock, Check, Circle } from "lucide-react";
import { format, parseISO, isBefore } from "date-fns";
import { useMemo } from "react";

export function TaskItem({
  task,
  collections,
  isActive,
  onSelect,
  onToggleStatus,
}: {
  task: Task;
  collections: Collection[];
  isActive: boolean;
  onSelect: () => void;
  onToggleStatus: () => void;
}) {
  const isDone = task.status === "DONE";
  const isOverdue = useMemo(() => {
    if (isDone || !task.end_time) return false;
    return isBefore(parseISO(task.end_time), new Date());
  }, [task, isDone]);

  const collection = useMemo(() => {
    return collections.find((c) => c.id === task.collection_id);
  }, [collections, task.collection_id]);

  const priorityColors = {
    LOW: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    MEDIUM: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    HIGH: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all cursor-pointer border",
        isActive
          ? "bg-[#1c1e2d] border-primary/30 shadow-2xl shadow-primary/5"
          : "bg-[#1c1e2d]/40 border-white/5 hover:bg-[#1c1e2d] hover:border-white/10",
      )}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleStatus();
        }}
        className={cn(
          "size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          isDone
            ? "bg-primary border-primary text-primary-foreground"
            : "border-muted-foreground/30 hover:border-primary/50",
        )}
      >
        {isDone ? (
          <Check size={12} strokeWidth={3} />
        ) : (
          <Circle
            size={8}
            className="text-transparent group-hover:text-primary/30 fill-current"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={cn(
              "text-[14px] md:text-base font-semibold truncate transition-all",
              isDone
                ? "text-muted-foreground line-through opacity-50"
                : "text-slate-200",
            )}
          >
            {task.title}
          </span>
          {isOverdue && (
            <span className="shrink-0 px-1 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter bg-red-500/10 text-red-500 border border-red-500/20">
              Overdue
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest shrink-0">
            <Clock size={10} className="opacity-60" />
            {format(parseISO(task.start_time), "HH:mm")}
          </div>

          <div
            className={cn(
              "px-1.5 py-0.5 rounded-full text-[8px] font-bold border uppercase tracking-wider shrink-0",
              priorityColors[task.priority],
            )}
          >
            {task.priority}
          </div>

          {collection && (
            <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-bold text-slate-300 uppercase tracking-wider truncate max-w-[100px]">
              <div
                className="size-1 rounded-full shrink-0"
                style={{ backgroundColor: collection.color }}
              />
              <span className="truncate">{collection.title}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
