"use client";

import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TaskList } from "@/components/dashboard/task-list";
import { RightPanel } from "@/components/dashboard/right-panel";
import { CollectionModal } from "@/components/dashboard/collection-modal";
import { useCollections } from "@/hooks/use-collections";
import { useTasks } from "@/hooks/use-tasks";
import { Loader2 } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const { activeNav, setActiveNav } = useDashboardStore();

  const { data: collections = [], isLoading: loadingCollections } = useCollections();

  const selectedCollectionId = useMemo(() => {
    return activeNav.startsWith("collection-") ? activeNav.replace("collection-", "") : undefined;
  }, [activeNav]);

  const { isLoading: loadingTasks } = useTasks(selectedCollectionId);

  const navTitle = useMemo(() => {
    if (activeNav === "inbox") return "Inbox";
    if (activeNav === "today") return "Today";
    if (activeNav === "upcoming") return "Upcoming";
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
        <TaskList title={navTitle} />
        
        <div className="hidden xl:block">
          <RightPanel />
        </div>
      </main>

      <CollectionModal />
    </div>
  );
}