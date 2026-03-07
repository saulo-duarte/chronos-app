"use client";

import {
  Inbox,
  CalendarDays,
  CalendarRange,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, startOfWeek, endOfWeek, subWeeks, addWeeks } from "date-fns";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Priority, Status } from "@/types";
import { cn } from "@/lib/utils";

interface TaskListHeaderProps {
  title: string;
  selectedCollectionId?: string;
  incompleteCount: number;
}

export function TaskListHeader({
  title,
  selectedCollectionId,
  incompleteCount,
}: TaskListHeaderProps) {
  const {
    view,
    setView,
    contentType,
    setContentType,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
    selectedDate,
    setSelectedDate,
  } = useDashboardStore();

  const navItems = [
    { id: "all", label: "All", icon: Inbox },
    { id: "today", label: "Today", icon: CalendarDays },
    { id: "week", label: "Week", icon: CalendarRange },
    { id: "overdue", label: "Overdue", icon: AlertCircle },
  ];

  return (
    <header className="flex flex-col border-b border-border backdrop-blur-md transition-colors duration-500">
      <div className="px-4 py-4 md:px-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5 w-full">
            <div className="flex items-center justify-between md:block">
              <h1 className="text-xl font-bold tracking-tight text-primary md:text-foreground md:text-2xl">
                <span className="md:hidden font-bold tracking-tight">
                  Chronos
                </span>
                <span
                  className={cn(
                    "hidden md:inline",
                    selectedCollectionId && "text-primary font-extrabold",
                  )}
                >
                  {title}
                </span>
              </h1>
              <div className="md:hidden size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg ring-2 ring-primary/20">
                JD
              </div>
            </div>
            <p className="hidden md:block text-xs text-muted-foreground">
              {incompleteCount}{" "}
              {incompleteCount === 1 ? "task remaining" : "tasks remaining"}
            </p>
          </div>

          {selectedCollectionId && (
            <Tabs
              value={contentType}
              onValueChange={(v) => {
                setContentType(v as "tasks" | "resources");
                const scrollArea = document.getElementById(
                  "mobile-scroll-container",
                );
                if (scrollArea) {
                  const width = scrollArea.clientWidth;
                  scrollArea.scrollTo({
                    left: v === "tasks" ? 0 : width,
                    behavior: "smooth",
                  });
                }
              }}
              className="hidden md:block bg-muted/50 p-1 rounded-full"
            >
              <TabsList className="h-8 bg-transparent border-none">
                <TabsTrigger
                  value="tasks"
                  className="rounded-full px-4 text-xs"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="rounded-full px-4 text-xs"
                >
                  Resources
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {/* Mobile Category Tabs */}
        <div className="md:hidden mt-4 overflow-hidden border-b border-border/50">
          <div className="flex items-end gap-6 overflow-x-auto no-scrollbar pb-1 px-1">
            {navItems.map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as DashboardView);
                    const scrollArea = document.getElementById(
                      "mobile-scroll-container",
                    );
                    if (scrollArea && !selectedCollectionId) {
                      const width = scrollArea.clientWidth;
                      const index = navItems.findIndex((n) => n.id === item.id);
                      scrollArea.scrollTo({
                        left: width * index,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={cn(
                    "pb-2 text-lg font-medium transition-all relative whitespace-nowrap",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as DashboardView)}
            className="w-auto"
          >
            <TabsList className="bg-muted/30 p-1">
              {navItems.map((item) => (
                <TabsTrigger key={item.id} value={item.id} className="gap-2">
                  <item.icon className="size-3.5" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {view === "week" && (
            <div className="flex items-center gap-2 bg-muted/20 rounded-md p-1 border border-border/40">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-[11px] font-semibold min-w-[120px] text-center uppercase">
                {format(startOfWeek(selectedDate), "MMM dd")} -{" "}
                {format(endOfWeek(selectedDate), "dd")}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {contentType === "tasks" && (
        <div className="hidden md:flex items-center gap-2 px-4 pb-3 md:px-6">
          <Select
            value={filterPriority}
            onValueChange={(v) => setFilterPriority(v as Priority | "ALL")}
          >
            <SelectTrigger className="h-8 flex-1 text-[11px] bg-background md:max-w-[140px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as Status | "ALL")}
          >
            <SelectTrigger className="h-8 flex-1 text-[11px] bg-background md:max-w-[140px]">
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
  );
}
