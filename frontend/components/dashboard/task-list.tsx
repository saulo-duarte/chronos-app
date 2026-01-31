"use client";

import { useMemo } from "react";
import { useCollections } from "@/hooks/use-collections";
import { useTasks, useUpdateTaskStatus, useCreateTask } from "@/hooks/use-tasks";
import { CollectionResources } from "@/components/resources/collection-resources";
import { TaskCard } from "./task-card";
import { QuickAdd } from "./quick-add";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays, CalendarRange, ListChecks, Loader2 } from "lucide-react";
import { isSameDay, isSameWeek, parseISO } from "date-fns";
import { Priority, Status } from "@/types";
import { useDashboardStore } from "@/stores/use-dashboard-store";

interface TaskListProps {
  title: string;
}

export function TaskList({ title }: TaskListProps) {
  const {
    view,
    setView,
    contentType,
    setContentType,
    selectedTaskId,
    setSelectedTaskId,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    activeNav
  } = useDashboardStore();

  const { data: collections = [] } = useCollections();

  const selectedCollectionId = useMemo(() => {
    return activeNav.startsWith("collection-") ? activeNav.replace("collection-", "") : undefined;
  }, [activeNav]);

  const { data: tasks = [], isLoading } = useTasks(selectedCollectionId);
  
  const updateStatusMutation = useUpdateTaskStatus();
  const createTaskMutation = useCreateTask();

  const filteredTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((t) => {
      if (filterPriority !== "ALL" && t.priority !== filterPriority) return false;
      if (filterStatus !== "ALL" && filterStatus !== t.status) return false;

      const taskDate = parseISO(t.start_time);
      if (view === "day") {
        if (!isSameDay(taskDate, now)) return false;
      } else if (view === "week") {
        if (!isSameWeek(taskDate, now)) return false;
      }

      return true;
    });
  }, [tasks, filterPriority, filterStatus, view]);

  const incompleteTasks = filteredTasks.filter((t) => t.status === "PENDING");

  const handleToggleComplete = (id: string, currentStatus: Status) => {
    updateStatusMutation.mutate({ id, status: currentStatus });
  };

  const handleAddTask = (taskTitle: string, priority: Priority, startTime?: Date) => {
    createTaskMutation.mutate({
      title: taskTitle,
      priority,
      status: "PENDING",
      start_time: (startTime || new Date()).toISOString(),
      collection_id: selectedCollectionId,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="flex flex-col gap-4 border-b border-border px-4 py-4 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground md:text-2xl">{title}</h1>
            <p className="text-xs text-muted-foreground md:text-sm">
              {incompleteTasks.length} task{incompleteTasks.length !== 1 ? "s" : ""} remaining
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <Tabs value={view} onValueChange={(v) => setView(v as "day" | "week")} className="shrink-0">
              <TabsList className="h-9">
                <TabsTrigger value="day" className="px-3 text-xs md:text-sm">
                  <CalendarDays className="mr-1.5 size-3.5" />
                  Day
                </TabsTrigger>
                <TabsTrigger value="week" className="px-3 text-xs md:text-sm">
                  <CalendarRange className="mr-1.5 size-3.5" />
                  Week
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {selectedCollectionId && (
              <Tabs
                value={contentType}
                onValueChange={(v) => setContentType(v as "tasks" | "resources")}
                className="shrink-0"
              >
                <TabsList className="h-9">
                  <TabsTrigger value="tasks" className="px-3 text-xs md:text-sm">Tasks</TabsTrigger>
                  <TabsTrigger value="resources" className="px-3 text-xs md:text-sm">Resources</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>

        {contentType === "tasks" && (
          <div className="flex items-center gap-2">
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as Priority | "ALL")}>
              <SelectTrigger className="h-8 flex-1 text-[11px] md:w-[130px] md:flex-none md:text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as Status | "ALL")}>
              <SelectTrigger className="h-8 flex-1 text-[11px] md:w-[130px] md:flex-none md:text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary/50" />
          </div>
        ) : contentType === "tasks" ? (
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6">
              <div className="mb-6">
                <QuickAdd onAddTask={handleAddTask} />
              </div>

              <div className="flex flex-col gap-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    collection={collections.find((c) => c.id === task.collection_id)}
                    onToggleComplete={handleToggleComplete}
                    onEdit={() => setSelectedTaskId(task.id)}
                    isActive={selectedTaskId === task.id}
                  />
                ))}

                {filteredTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center md:py-16">
                    <div className="flex size-14 items-center justify-center rounded-full bg-muted md:size-16">
                      <ListChecks className="size-7 text-muted-foreground md:size-8" />
                    </div>
                    <h3 className="mt-4 text-base font-medium text-foreground md:text-lg">
                      No tasks found
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                      Try adjusting your filters or add a new task
                    </p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          selectedCollectionId && <CollectionResources collectionId={selectedCollectionId} />
        )}
      </div>
    </div>
  );
}