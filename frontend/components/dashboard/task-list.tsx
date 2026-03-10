"use client";

import { useMemo } from "react";
import { useCollections, useCreateCollection } from "@/hooks/use-collections";
import { useCreateResource } from "@/hooks/use-resources";
import {
  useTasks,
  useUpdateTaskStatus,
  useCreateTask,
} from "@/hooks/use-tasks";
import { useTaskGrouping } from "@/hooks/use-task-grouping";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { isToday, isBefore, parseISO, isSameWeek, startOfDay } from "date-fns";
import { CollectionResources } from "@/components/resources/collection-resources";
import { MobileAddTask } from "./mobile-add-task";
import { MobileFilters } from "./mobile-filters";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";
import { Priority, Status } from "@/types";
import { cn } from "@/lib/utils";
import { TaskListSkeleton } from "./skeletons";
import { TaskListHeader } from "./task-list-header";
import { TaskListItems } from "./task-list-items";

interface TaskListProps {
  title: string;
}

export function TaskList({ title }: TaskListProps) {
  const {
    contentType,
    setContentType,
    filterPriority,
    filterStatus,
    activeNav,
    isPickerOpen,
  } = useDashboardStore();

  const { data: collections = [] } = useCollections();

  const selectedCollectionId = useMemo(() => {
    return activeNav.startsWith("collection-")
      ? activeNav.replace("collection-", "")
      : undefined;
  }, [activeNav]);

  const { data: tasks = [], isLoading } = useTasks(selectedCollectionId);
  const updateStatusMutation = useUpdateTaskStatus();
  const createTaskMutation = useCreateTask();
  const createCollectionMutation = useCreateCollection();
  const createResourceMutation = useCreateResource();

  const { currentFilter, selectedDate: searchDate } = useTaskFilters();

  const { groupedTasks } = useTaskGrouping(
    tasks,
    currentFilter as DashboardView,
    searchDate ? parseISO(searchDate) : new Date(),
    filterPriority,
    filterStatus,
  );

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (currentFilter === "today") {
      result = tasks.filter((t) => {
        if (!t.end_time) return false;
        const date = parseISO(t.end_time.split("T")[0]);
        return isToday(date);
      });
    } else if (currentFilter === "day" && searchDate) {
      result = tasks.filter((t) => {
        if (!t.end_time) return false;
        return t.end_time.split("T")[0] === searchDate;
      });
    } else if (currentFilter === "week") {
      result = tasks.filter((t) => {
        if (!t.end_time) return false;
        const date = parseISO(t.end_time.split("T")[0]);
        const targetWeekDate = searchDate ? parseISO(searchDate) : new Date();
        return isSameWeek(date, targetWeekDate, { weekStartsOn: 0 });
      });
    } else if (currentFilter === "overdue") {
      result = tasks.filter((t) => {
        if (t.status === "DONE" || !t.end_time) return false;
        const date = parseISO(t.end_time.split("T")[0]);
        return isBefore(date, startOfDay(new Date())) && !isToday(date);
      });
    } else if (currentFilter === "no-date") {
      result = tasks.filter((t) => !t.end_time);
    }

    return result;
  }, [tasks, currentFilter, searchDate]);

  const incompleteCount = useMemo(
    () => tasks.filter((t) => t.status === "PENDING").length,
    [tasks],
  );

  const handleToggleComplete = (id: string, currentStatus: Status) => {
    updateStatusMutation.mutate({ id, status: currentStatus });
  };

  const handleAddTask = (
    taskTitle: string,
    priority: Priority,
    date?: Date,
  ) => {
    if (isPickerOpen) {
      createCollectionMutation.mutate({
        title: taskTitle,
        color: "#3b82f6", // default color (blue-500)
      });
      return;
    }

    createTaskMutation.mutate({
      title: taskTitle,
      priority,
      status: "PENDING",
      start_time: new Date().toISOString(),
      end_time: date ? date.toISOString() : undefined,
      collection_id: selectedCollectionId,
    });
  };

  const handleAddResource = (titleRes: string, urlRes: string) => {
    if (!selectedCollectionId) return;
    createResourceMutation.mutate({
      collection_id: selectedCollectionId,
      title: titleRes,
      path: urlRes,
      type: "LINK",
      size: 0,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-background h-full overflow-hidden">
      <TaskListHeader
        title={title}
        selectedCollectionId={selectedCollectionId}
        incompleteCount={incompleteCount}
      />

      <main className="flex-1 relative overflow-auto flex flex-col min-h-0">
        {isLoading ? (
          <TaskListSkeleton />
        ) : (
          <div className="flex-1 min-h-0 flex flex-col relative w-full pb-36 md:pb-6">
            {selectedCollectionId && (
              <div className="flex md:hidden items-center justify-between px-4 pt-3 pb-2 bg-background/95 backdrop-blur-sm z-10 sticky top-0 border-b border-border/50">
                <h2 className="text-lg font-bold tracking-tight text-foreground truncate mr-4">
                  {title}
                </h2>
                <div className="flex bg-muted/50 p-0.5 rounded-lg shrink-0">
                  <button
                    onClick={() => setContentType("tasks")}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                      contentType === "tasks"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => setContentType("resources")}
                    className={cn(
                      "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
                      contentType === "resources"
                        ? "bg-background text-primary shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Resources
                  </button>
                </div>
              </div>
            )}

            <div className="w-full flex-1 flex flex-col min-h-0">
              {contentType === "tasks" || !selectedCollectionId ? (
                <TaskListItems
                  tasks={filteredTasks}
                  groups={groupedTasks}
                  collections={collections}
                  onToggleComplete={handleToggleComplete}
                  onAddTask={handleAddTask}
                />
              ) : (
                <div className="flex-1 px-0 py-2">
                  <CollectionResources collectionId={selectedCollectionId} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      {!isPickerOpen && activeNav !== "collections" && <MobileFilters />}
      <MobileAddTask
        onAddTask={handleAddTask}
        onAddResource={handleAddResource}
      />
    </div>
  );
}
