"use client";

import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TaskList } from "@/components/dashboard/task-list";
import { RightPanel } from "@/components/dashboard/right-panel";
import { CollectionModal } from "@/components/dashboard/collection-modal";
import { useCollections } from "@/hooks/use-collections";
import { useDeleteTask, useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { TaskDetails } from "@/components/dashboard/task-details";
import { StatsDashboard } from "@/components/dashboard/stats-dashboard";
import { UpdateTaskDTO } from "@/types";

export default function Dashboard() {
  const { activeNav, setActiveNav, selectedTaskId, setSelectedTaskId } = useDashboardStore();

  const { data: collections = [], isLoading: loadingCollections } = useCollections();

  const selectedCollectionId = useMemo(() => {
    return activeNav.startsWith("collection-") ? activeNav.replace("collection-", "") : undefined;
  }, [activeNav]);

  const { data: tasks = [], isLoading: loadingTasks } = useTasks(selectedCollectionId);
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

  const selectedTask = useMemo(() => 
    tasks.find(t => t.id === selectedTaskId) || null
  , [tasks, selectedTaskId]);

  const navTitle = useMemo(() => {
    if (activeNav === "dashboard") return "Dashboard";
    if (activeNav === "tasks") return "Tasks";
    if (selectedCollectionId) {
      return collections.find(c => c.id === selectedCollectionId)?.title || "Collection";
    }
    return "Tasks";
  }, [activeNav, collections, selectedCollectionId]);

  if (loadingCollections || loadingTasks) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
      />
      
      <main className="flex flex-1 overflow-hidden">
        {activeNav === "dashboard" ? (
          <StatsDashboard />
        ) : (
          <>
            <TaskList title={navTitle} />
            <div className="hidden xl:block">
              <RightPanel />
            </div>
          </>
        )}
      </main>

      {selectedTask && (
        <div className={cn(
          "fixed inset-0 z-50 bg-background xl:hidden",
          "animate-in slide-in-from-right duration-300"
        )}>
          <TaskDetails
            task={selectedTask}
            collections={collections}
            onClose={handleMobileClose}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        </div>
      )}

      <CollectionModal />
    </div>
  );
}