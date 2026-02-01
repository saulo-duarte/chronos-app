"use client";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";

import { Task, Status, Collection } from "@/types";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  collection?: Collection;
  onToggleComplete: (id: string, status: Status) => void;
  onEdit: () => void;
  isActive?: boolean;
}

const priorityStyles: Record<string, string> = {
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH: "bg-red-100 text-red-700 border-red-200",
};

const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Med",
  HIGH: "High",
};

export function TaskCard({ task, collection, onToggleComplete, onEdit, isActive }: TaskCardProps) {
  const isCompleted = task.status === "DONE";
  
  // Date Logic
  const endDate = task.end_time ? new Date(task.end_time) : null;
  const finishedDate = task.finished_at ? new Date(task.finished_at) : null;
  
  const isOverdue = endDate && new Date() > endDate && !isCompleted;
  // Near deadline if within 24 hours
  const isNearDeadline = endDate && new Date() < endDate && (endDate.getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000 && !isCompleted;

  const formatDate = (date: Date) => {
    // If today, show time Only? Or "Today, hh:mm"
    // For simplicity, using a nice format
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm cursor-pointer",
        isCompleted && "opacity-60",
        isOverdue && "border-red-200 bg-red-50/50 dark:bg-red-900/10",
        isNearDeadline && "border-amber-200 bg-amber-50/50 dark:bg-amber-900/10",
        isActive && "border-primary/40 ring-1 ring-primary/40 bg-accent/30"
      )}
      onClick={onEdit}
    >
      <div onClick={(e) => e.stopPropagation()} className="flex">
        <Checkbox
            checked={isCompleted}
            onCheckedChange={(checked) => 
              onToggleComplete(task.id, checked ? "DONE" : "PENDING")
            }
            className="mt-0.5 size-5 rounded-full"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium text-foreground transition-all",
            isCompleted && "line-through text-muted-foreground",
             isOverdue && !isCompleted && "text-red-700 dark:text-red-400",
             isNearDeadline && !isCompleted && "text-amber-700 dark:text-amber-400"
          )}
        >
          {task.title}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0", priorityStyles[task.priority])}
          >
            {priorityLabels[task.priority]}
          </Badge>

          {collection && (
            <span
              className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: `${collection.color}20`,
                color: collection.color,
              }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: collection.color }}
              />
              {collection.title}
            </span>
          )}

          {endDate && !isCompleted && (
            <span className={cn(
                "inline-flex items-center gap-1 text-[10px]",
                isOverdue ? "text-red-600 font-medium" : 
                isNearDeadline ? "text-amber-600 font-medium" : "text-muted-foreground"
            )}>
              <Clock className="size-3" />
              {isOverdue ? "Overdue: " : "Due: "}
              {formatDate(endDate)}
            </span>
          )}

           {finishedDate && isCompleted && (
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <CheckCircle2 className="size-3" />
              Finished: {formatDate(finishedDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
