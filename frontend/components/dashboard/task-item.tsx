"use client";

import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Flag } from "lucide-react";
import { format, parseISO } from "date-fns";

export function TaskItem({ task, isActive, onSelect, onToggleStatus }: { task: Task; isActive: boolean; onSelect: () => void; onToggleStatus: () => void }) {
  const isDone = task.status === "DONE";

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-4 py-3 transition-all cursor-pointer border border-transparent",
        isActive ? "bg-accent/80 border-border shadow-sm" : "hover:bg-accent/40"
      )}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isDone} 
          onCheckedChange={onToggleStatus} 
          className="size-5 rounded-full border-muted-foreground/30 data-[state=checked]:bg-primary" 
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("text-sm font-medium truncate transition-all", isDone && "text-muted-foreground line-through opacity-60")}>
            {task.title}
          </span>
          {task.priority === "HIGH" && !isDone && <Flag className="size-3 text-red-500 fill-red-500" />}
        </div>
        
        <div className="flex items-center gap-3 mt-1">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            <Clock className="size-3" />
            {format(parseISO(task.start_time), "HH:mm")}
          </div>
          {task.description && <span className="text-[11px] text-muted-foreground/70 truncate">— {task.description}</span>}
        </div>
      </div>
    </div>
  );
}