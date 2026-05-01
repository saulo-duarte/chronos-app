"use client";

import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileBottomNav } from "@/components/dashboard/mobile-bottom-nav";
import { MobileFilters } from "@/components/dashboard/mobile-filters";
import { TaskList } from "@/components/dashboard/task-list";
import { CollectionModal } from "@/components/dashboard/collection-modal";
import { useCollections } from "@/hooks/use-collections";
import { useDeleteTask, useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { TaskDetails } from "@/components/dashboard/task-details";
import { useMe } from "@/hooks/use-auth";
import { UpdateTaskDTO } from "@/types";
import { MasteryQueue } from "@/components/mastery/mastery-queue";
import { StatGrid } from "@/components/dashboard/stat-grid";
import { TimeFilterTabs } from "@/components/dashboard/time-filter-tabs";
import { HorizontalCalendar } from "@/components/dashboard/horizontal-calendar";
import { useSearchParams } from "next/navigation";
import { RadialProgress } from "@/components/dashboard/radial-progress";

import { Header } from "@/components/dashboard/header";
import { Suspense } from "react";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { ObjectivesList } from "@/components/objectives/objectives-list";

function DashboardContent() {
  const {
    activeNav,
    setActiveNav,
    selectedTaskId,
    setSelectedTaskId,
    contentType,
  } = useDashboardStore();

  const searchParams = useSearchParams();
  const { data: user, isLoading: loadingUser } = useMe();
  const { data: collections = [] } = useCollections();

  const selectedCollectionId = useMemo(() => {
    return activeNav.startsWith("collection-")
      ? activeNav.replace("collection-", "")
      : undefined;
  }, [activeNav]);

  const { data: tasks = [] } = useTasks(selectedCollectionId);
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleMobileClose = () => {
    setSelectedTaskId(null);
  };

  const handleUpdateTask = (id: string, updates: UpdateTaskDTO) => {
    updateTaskMutation.mutate({ id, dto: updates });
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const selectedTask = useMemo(
    () => tasks.find((t) => t.id === selectedTaskId) || null,
    [tasks, selectedTaskId],
  );

  const navTitle = useMemo(() => {
    if (activeNav === "dashboard") return "Dashboard";
    if (activeNav === "tasks") return "Tasks";
    if (selectedCollectionId) {
      return (
        collections.find((c) => c.id === selectedCollectionId)?.title ||
        "Collection"
      );
    }
    return "Tasks";
  }, [activeNav, collections, selectedCollectionId]);

  if (!user && !loadingUser) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex flex-1 flex-col overflow-hidden">
        {activeNav === "dashboard" ? (
          <DashboardOverview />
        ) : activeNav === "tasks" || activeNav.startsWith("collection-") ? (
          <div className="flex flex-col h-full overflow-hidden">
            <Header />
            {contentType === "tasks" && <TimeFilterTabs />}
            {searchParams.get("filter") === "day" &&
              contentType === "tasks" && <HorizontalCalendar />}
            <div className="flex-1 overflow-hidden">
              <TaskList title={navTitle} />
            </div>
          </div>
        ) : activeNav === "mastery" ? (
          <MasteryQueue />
        ) : activeNav === "objectives" ? (
          <div className="flex flex-col h-full overflow-hidden">
            <Header />
            <div className="flex-1 overflow-auto">
              <ObjectivesList />
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-hidden">
            <TaskList title={navTitle} />
          </div>
        )}
      </main>

      {selectedTask && (
        <div
          className={cn(
            "fixed inset-0 z-[70] bg-background xl:hidden",
            "animate-in slide-in-from-right duration-300",
          )}
        >
          <TaskDetails
            key={selectedTask.id}
            task={selectedTask}
            collections={collections}
            onClose={handleMobileClose}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>
      )}

      <CollectionModal />
      <MobileFilters />
      {contentType === "tasks" && <RadialProgress />}
      <MobileBottomNav />
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
