"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  ListTodo,
  Plus,
  Clock,
  ChevronDown,
  ChevronRight,
  Menu,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
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
  { id: "mastery", label: "Mastery", icon: Brain },
];

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const { data: collections = [] } = useCollections();
  const { onOpen } = useCollectionModal();
  const { sidebarCollapsed, setSidebarCollapsed } = useDashboardStore();
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);
  const [open, setOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavChange(id);
    setOpen(false);
  };

  const SidebarContent = (isCollapsedDesktop?: boolean) => (
    <div className="flex h-full flex-col bg-sidebar">
      <div className={cn(
        "flex items-center gap-2 border-b border-border px-4 py-5",
        isCollapsedDesktop && "justify-center px-0"
      )}>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary shrink-0">
          <Clock className="size-4 text-primary-foreground" />
        </div>
        {!isCollapsedDesktop && (
          <span className="text-lg font-semibold text-foreground tracking-tight">Chronos</span>
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
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  isCollapsedDesktop && "justify-center px-0"
                )}
              >
                <Icon className={cn("size-4 shrink-0", isActive && "text-primary")} />
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
              <div className="mt-1 space-y-1">
                {collections.map((collection) => (
                  <CollectionItem
                    key={collection.id}
                    collection={collection}
                    isActive={activeNav === `collection-${collection.id}`}
                    onClick={() => handleNavClick(`collection-${collection.id}`)}
                    onEdit={(c) => onOpen(c)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className={cn("p-3 border-t border-border/50", isCollapsedDesktop && "px-0 flex flex-col items-center")}>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground hover:text-foreground mb-2",
            isCollapsedDesktop && "justify-center p-0 size-8"
          )}
          onClick={() => {
            onOpen();
            setOpen(false);
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
            isCollapsedDesktop ? "justify-center" : "justify-start px-3"
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
      <div className="fixed bottom-20 right-6 z-50 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="size-12 rounded-full shadow-2xl ring-4 ring-background">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r-0">
            {SidebarContent(false)}
          </SheetContent>
        </Sheet>
      </div>

      <aside className={cn(
        "hidden h-full flex-col border-r border-border bg-sidebar lg:flex transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        {SidebarContent(sidebarCollapsed)}
      </aside>
    </>
  );
}