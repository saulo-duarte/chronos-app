"use client";

import { format, parseISO, startOfWeek, subWeeks, addWeeks } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ListChecks,
} from "lucide-react";
import { Task, Collection, Priority, Status, ResourceType } from "@/types";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { TaskItem } from "./task-item";
import { QuickAdd } from "./quick-add";
import { useTaskFilters } from "@/hooks/use-task-filters";

interface TaskListItemsProps {
  tasks: Task[];
  groups: Record<string, Task[]>;
  collections: Collection[];
  onToggleComplete: (id: string, status: Status) => void;
  onAddTask: (title: string, priority: Priority, date?: Date, description?: string) => void;
  onAddCollection: (title: string, color: string, description?: string) => void;
  onAddResource?: (title: string, url: string, type: ResourceType, tag?: string) => void;
}

export function TaskListItems({
  groups,
  collections,
  onToggleComplete,
  onAddTask,
  onAddCollection,
  onAddResource,
}: TaskListItemsProps) {
  const { currentFilter } = useTaskFilters();
  const { selectedDate, setSelectedDate, selectedTaskId, setSelectedTaskId } =
    useDashboardStore();
  const keys = Object.keys(groups).sort();

  return (
    <div className="px-4 py-2 md:px-8 md:py-6 mx-auto w-full max-w-full">
      {currentFilter === "week" && (
        <div className="md:hidden flex items-center justify-between mb-4 px-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-8"
            onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <span className="text-sm font-medium">
            {format(startOfWeek(selectedDate), "EEEE, MMM dd")}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full size-8"
            onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      )}



      <div className="space-y-8">
        {keys.length > 0 ? (
          keys.map((dateKey) => (
            <div key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-[1px] flex-1 bg-border/60" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary/85 whitespace-nowrap">
                  {dateKey === "No Date"
                    ? dateKey
                    : format(parseISO(dateKey), "EEEE, MMM dd")}
                </span>
                <div className="h-[1px] flex-1 bg-border/60" />
              </div>
              <div className="grid gap-3">
                {groups[dateKey].map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    collections={collections}
                    onToggleStatus={() =>
                      onToggleComplete(
                        task.id,
                        task.status === "DONE" ? "PENDING" : "DONE",
                      )
                    }
                    onSelect={() => setSelectedTaskId(task.id)}
                    isActive={selectedTaskId === task.id}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              {currentFilter === "overdue" ? (
                <AlertCircle className="size-8 text-emerald-500/70" />
              ) : (
                <ListChecks className="size-8 text-muted-foreground/50" />
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {currentFilter === "today"
                ? "No tasks for today"
                : currentFilter === "week"
                  ? "No tasks this week"
                  : currentFilter === "overdue"
                    ? "All caught up!"
                    : "No tasks found"}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
