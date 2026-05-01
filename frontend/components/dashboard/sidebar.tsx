"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  ListTodo,
  Plus,
  Clock,
  ChevronDown,
  ChevronRight,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
  Target,
} from "lucide-react";
import { useCollections } from "@/hooks/use-collections";
import { CollectionItem } from "./collection-item";
import { useCollectionModal } from "@/stores/use-collection-modal";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";

interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string, view?: DashboardView) => void;
}

const navItems = [
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "objectives", label: "Objectives", icon: Target },
  { id: "mastery", label: "Mastery", icon: Brain },
];

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const { data: collections = [], isLoading } = useCollections();
  const { onOpen } = useCollectionModal();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);

  const handleNavClick = (id: string) => {
    onNavChange(id);
  };

  const SidebarContent = (isCollapsedDesktop?: boolean) => (
    <div className="flex h-full flex-col bg-transparent">
      <div
        className={cn(
          "flex h-[72px] items-center gap-2 border-b border-border/50 px-4",
          isCollapsedDesktop && "justify-center px-0",
        )}
      >
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary shrink-0 shadow-lg shadow-primary/20">
          <Clock className="size-5 text-primary-foreground" />
        </div>
        {!isCollapsedDesktop && (
          <span className="text-lg font-semibold text-foreground tracking-tight">
            Chronos
          </span>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isCollapsedDesktop ? item.label : undefined}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary",
                  isCollapsedDesktop && "justify-center px-0",
                )}
              >
                <Icon
                  className={cn("size-4 shrink-0", isActive && "text-primary")}
                />
                {!isCollapsedDesktop && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!isCollapsedDesktop && (
          <div className="mt-8">
            <button
              onClick={() => setCollectionsExpanded(!collectionsExpanded)}
              className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70"
            >
              <span>Collections</span>
              {collectionsExpanded ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
            </button>

            {collectionsExpanded && (
              <ScrollArea className="mt-1 max-h-[300px] pr-3">
                <div className="space-y-1">
                  {isLoading ? (
                    <div className="space-y-2 p-3">
                      <div className="h-4 w-3/4 rounded bg-muted/20 animate-pulse" />
                      <div className="h-4 w-1/2 rounded bg-muted/20 animate-pulse" />
                      <div className="h-4 w-2/3 rounded bg-muted/20 animate-pulse" />
                    </div>
                  ) : (
                    collections.map((collection) => (
                      <CollectionItem
                        key={collection.id}
                        collection={collection}
                        isActive={activeNav === `collection-${collection.id}`}
                        onClick={() =>
                          handleNavClick(`collection-${collection.id}`)
                        }
                        onEdit={(c) => onOpen(c)}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </ScrollArea>

      <div
        className={cn(
          "p-4 border-t border-border/40 backdrop-blur-md",
          isCollapsedDesktop && "px-0 flex flex-col items-center",
        )}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-foreground mb-2",
            isCollapsedDesktop && "justify-center p-0 size-8",
          )}
          onClick={() => {
            onOpen();
          }}
          title={isCollapsedDesktop ? "New Collection" : undefined}
        >
          <Plus className="size-4 shrink-0" />
          {!isCollapsedDesktop && "New Collection"}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-full text-muted-foreground hover:text-foreground hidden lg:flex items-center",
            isCollapsedDesktop ? "justify-center" : "justify-start px-3",
          )}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="size-4 shrink-0" />
              {!isCollapsedDesktop && <span className="ml-2">Collapse</span>}
            </>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden h-full flex-col glass-sidebar lg:flex transition-all duration-500 ease-in-out",
          sidebarCollapsed ? "w-20" : "w-72",
        )}
      >
        {SidebarContent(sidebarCollapsed)}
      </aside>
    </>
  );
}
