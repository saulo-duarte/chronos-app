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
import {
  CalendarDays,
  CalendarRange,
  ListChecks,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Inbox
} from "lucide-react";
import {
  isSameDay,
  isSameWeek,
  isBefore,
  parseISO,
  startOfWeek,
  endOfWeek,
  format,
  addWeeks,
  subWeeks
} from "date-fns";
import { Priority, Status } from "@/types";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
    activeNav,
    selectedDate,
    setSelectedDate
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

    const priorityOrder: Record<string, number> = {
      HIGH: 0,
      MEDIUM: 1,
      LOW: 2,
    };

    return tasks
      .filter((t) => {
        if (filterPriority !== "ALL" && t.priority !== filterPriority) return false;
        if (filterStatus !== "ALL" && filterStatus !== t.status) return false;

        if (view === "today") {
          if (!t.end_time) return false;
          const taskDate = parseISO(t.end_time);
          return isSameDay(taskDate, now);
        }

        if (view === "week") {
          if (!t.end_time) return false;
          const taskDate = parseISO(t.end_time);
          return isSameWeek(taskDate, selectedDate, { weekStartsOn: 0 });
        }

        if (view === "overdue") {
          if (t.status === "DONE") return false;
          if (!t.end_time) return false;
          const taskEndDate = parseISO(t.end_time);
          return isBefore(taskEndDate, now);
        }

        return true;
      })
      .sort((a, b) => {
        if (a.end_time && b.end_time) {
          const dateA = new Date(a.end_time).getTime();
          const dateB = new Date(b.end_time).getTime();
          if (dateA !== dateB) return dateA - dateB;
        } else if (a.end_time) {
          return -1;
        } else if (b.end_time) {
          return 1;
        }

        const pA = priorityOrder[a.priority] ?? 2;
        const pB = priorityOrder[b.priority] ?? 2;
        return pA - pB;
      });
  }, [tasks, filterPriority, filterStatus, view, selectedDate]);

  const incompleteTasks = filteredTasks.filter((t) => t.status === "PENDING");

  const handleToggleComplete = (id: string, currentStatus: Status) => {
    updateStatusMutation.mutate({ id, status: currentStatus });
  };

  const handleAddTask = (taskTitle: string, priority: Priority, date?: Date) => {
    createTaskMutation.mutate({
      title: taskTitle,
      priority,
      status: "PENDING",
      start_time: new Date().toISOString(),
      end_time: date ? date.toISOString() : undefined,
      collection_id: selectedCollectionId,
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
      <header className="flex flex-col border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-4 py-4 md:px-6">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{title}</h1>
              <p className="text-xs text-muted-foreground">
                {incompleteTasks.length} {incompleteTasks.length === 1 ? "task remaining" : "tasks remaining"}
              </p>
            </div>
            
            {selectedCollectionId && (
              <Tabs
                value={contentType}
                onValueChange={(v) => setContentType(v as "tasks" | "resources")}
                className="bg-muted/50 p-1 rounded-full"
              >
                <TabsList className="h-8 bg-transparent border-none">
                  <TabsTrigger value="tasks" className="rounded-full px-4 text-xs">Tasks</TabsTrigger>
                  <TabsTrigger value="resources" className="rounded-full px-4 text-xs">Resources</TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Tabs value={view} onValueChange={(v) => setView(v as DashboardView)} className="w-auto">
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
                <Button variant="ghost" size="icon" className="size-7" onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="text-[11px] font-semibold min-w-[120px] text-center uppercase">
                  {format(startOfWeek(selectedDate), "MMM dd")} - {format(endOfWeek(selectedDate), "dd")}
                </span>
                <Button variant="ghost" size="icon" className="size-7" onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {contentType === "tasks" && (
          <div className="flex items-center gap-2 px-4 pb-3 md:px-6">
            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as Priority | "ALL")}>
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

            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as Status | "ALL")}>
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

      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary/40" />
          </div>
        ) : contentType === "tasks" ? (
          <ScrollArea className="h-full pb-24 md:pb-6">
            <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
              {view === "week" && (
                <div className="md:hidden flex items-center justify-between mb-4 bg-muted/20 rounded-lg p-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}>
                    <ChevronLeft className="size-4" />
                  </Button>
                  <span className="text-xs font-bold">
                    {format(startOfWeek(selectedDate), "MMM dd")} - {format(endOfWeek(selectedDate), "MMM dd")}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}>
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              )}

              <div className="mb-6">
                <QuickAdd onAddTask={handleAddTask} />
              </div>

              <div className="grid gap-3">
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
                  <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                      {view === "overdue" ? (
                        <AlertCircle className="size-8 text-emerald-500/70" />
                      ) : (
                        <ListChecks className="size-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">
                      {view === "today" ? "No tasks for today" : view === "week" ? "No tasks this week" : view === "overdue" ? "All caught up!" : "No tasks found"}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        ) : (
          selectedCollectionId && <CollectionResources collectionId={selectedCollectionId} />
        )}
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border px-6 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navItems.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id as DashboardView)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all duration-200 relative px-3 py-1 rounded-xl",
                  isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("size-5", isActive && "scale-110")} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}