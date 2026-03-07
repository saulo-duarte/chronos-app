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
import { CollectionResources } from "@/components/resources/collection-resources";
import { MobileAddTask } from "./mobile-add-task";
import { MobileFilters } from "./mobile-filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox, CalendarDays, CalendarRange, AlertCircle } from "lucide-react";
import { Priority, Status } from "@/types";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";
import { cn } from "@/lib/utils";
import { TaskListSkeleton } from "./skeletons";
import { TaskListHeader } from "./task-list-header";
import { TaskListItems } from "./task-list-items";

interface TaskListProps {
  title: string;
}

export function TaskList({ title }: TaskListProps) {
  const {
    view,
    setView,
    contentType,
    setContentType,
    filterPriority,
    filterStatus,
    activeNav,
    selectedDate,
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

  const { groupedTasks, allCategoryGroups } = useTaskGrouping(
    tasks,
    view,
    selectedDate,
    filterPriority,
    filterStatus,
  );

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

  const navItems = [
    { id: "all", label: "All", icon: Inbox },
    { id: "today", label: "Today", icon: CalendarDays },
    { id: "week", label: "Week", icon: CalendarRange },
    { id: "overdue", label: "Overdue", icon: AlertCircle },
  ];

  return (
    <div className="flex flex-1 flex-col bg-background h-full overflow-hidden">
      <TaskListHeader
        title={title}
        selectedCollectionId={selectedCollectionId}
        incompleteCount={incompleteCount}
      />

      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {isLoading ? (
          <TaskListSkeleton />
        ) : (
          <div className="flex-1 min-h-0 flex flex-col relative w-full">
            {selectedCollectionId && (
              <div className="flex md:hidden flex-col gap-4 px-4 pt-2 pb-0 border-b border-border/50 bg-background z-10 sticky top-0">
                <h2 className="text-2xl font-medium tracking-tight text-foreground">
                  {title}
                </h2>
                <div className="flex items-end gap-6 overflow-x-auto no-scrollbar px-1">
                  <button
                    onClick={() => {
                      setContentType("tasks");
                      const scrollArea = document.getElementById(
                        "mobile-scroll-container",
                      );
                      if (scrollArea)
                        scrollArea.scrollTo({ left: 0, behavior: "smooth" });
                    }}
                    className={cn(
                      "pb-2 text-lg font-medium transition-all relative whitespace-nowrap",
                      contentType === "tasks"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Task
                    {contentType === "tasks" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setContentType("resources");
                      const scrollArea = document.getElementById(
                        "mobile-scroll-container",
                      );
                      if (scrollArea)
                        scrollArea.scrollTo({
                          left: scrollArea.clientWidth,
                          behavior: "smooth",
                        });
                    }}
                    className={cn(
                      "pb-2 text-lg font-medium transition-all relative whitespace-nowrap",
                      contentType === "resources"
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    Resources
                    {contentType === "resources" && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div
              id="mobile-scroll-container"
              className="flex flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth"
              onScroll={(e) => {
                const { scrollLeft, clientWidth } = e.currentTarget;
                if (selectedCollectionId) {
                  const section =
                    scrollLeft < clientWidth / 2 ? "tasks" : "resources";
                  if (section !== contentType) {
                    setContentType(section);
                  }
                } else {
                  const exactIndex = scrollLeft / clientWidth;
                  const index = Math.round(exactIndex);
                  const diff = Math.abs(exactIndex - index);
                  if (diff < 0.3) {
                    const newView = navItems[index]?.id as DashboardView;
                    if (newView && newView !== view) {
                      setView(newView);
                    }
                  }
                }
              }}
            >
              {selectedCollectionId ? (
                <>
                  <div
                    className={cn(
                      "w-full shrink-0 snap-center flex flex-col h-full",
                      contentType === "resources" ? "md:hidden" : "md:flex",
                    )}
                  >
                    <ScrollArea className="h-full pb-24 md:pb-6">
                      <TaskListItems
                        tasks={tasks}
                        groups={groupedTasks}
                        collections={collections}
                        onToggleComplete={handleToggleComplete}
                        onAddTask={handleAddTask}
                      />
                    </ScrollArea>
                  </div>

                  <div
                    className={cn(
                      "w-full shrink-0 snap-center flex flex-col h-full",
                      contentType === "tasks" ? "md:hidden" : "md:flex",
                    )}
                  >
                    <CollectionResources collectionId={selectedCollectionId} />
                  </div>
                </>
              ) : (
                <>
                  {navItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-full shrink-0 snap-center flex flex-col h-full"
                    >
                      <ScrollArea className="h-full pb-32 md:pb-6">
                        <TaskListItems
                          tasks={tasks}
                          groups={
                            allCategoryGroups[
                              item.id as keyof typeof allCategoryGroups
                            ]
                          }
                          collections={collections}
                          onToggleComplete={handleToggleComplete}
                          onAddTask={handleAddTask}
                        />
                      </ScrollArea>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </main>
      {/* Mobile Action Buttons (FABs) */}
      {!isPickerOpen && activeNav !== "collections" && <MobileFilters />}
      <MobileAddTask
        onAddTask={handleAddTask}
        onAddResource={handleAddResource}
      />
    </div>
  );
}
