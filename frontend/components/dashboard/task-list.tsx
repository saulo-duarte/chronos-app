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
import { parseISO } from "date-fns";
import { CollectionResources } from "@/components/resources/collection-resources";
import { MobileAddTask } from "./mobile-add-task";
import { MobileFilters } from "./mobile-filters";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";
import { Priority, Status } from "@/types";
import { TaskListSkeleton } from "./skeletons";
import { TaskListHeader } from "./task-list-header";
import { TaskListItems } from "./task-list-items";
import { useFilteredTasks } from "@/hooks/use-filtered-tasks";
import { TaskListMobileHeader } from "./task-list-mobile-header";

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

  const filteredTasks = useFilteredTasks(tasks, currentFilter, searchDate);

  const { groupedTasks } = useTaskGrouping(
    tasks,
    currentFilter as DashboardView,
    searchDate ? parseISO(searchDate) : new Date(),
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
        color: "#3b82f6",
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
              <TaskListMobileHeader
                title={title}
                contentType={contentType}
                setContentType={setContentType}
              />
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
