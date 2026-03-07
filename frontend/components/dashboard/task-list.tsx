"use client";

import { useMemo, useCallback } from "react";
import { useCollections } from "@/hooks/use-collections";
import {
  useTasks,
  useUpdateTaskStatus,
  useCreateTask,
} from "@/hooks/use-tasks";
import { CollectionResources } from "@/components/resources/collection-resources";
import { TaskCard } from "./task-card";
import { QuickAdd } from "./quick-add";
import { MobileAddTask } from "./mobile-add-task";
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
  Inbox,
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
  subWeeks,
  startOfDay,
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
    setSelectedDate,
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

  const getGroupedTasks = useCallback(
    (tasksToGroup: typeof tasks, currentView: DashboardView) => {
      const now = new Date();
      const priorityOrder: Record<string, number> = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2,
      };

      const filtered = tasksToGroup
        .filter((t) => {
          if (filterPriority !== "ALL" && t.priority !== filterPriority)
            return false;
          if (filterStatus !== "ALL" && filterStatus !== t.status) return false;

          if (currentView === "today") {
            if (!t.end_time) return false;
            return isSameDay(parseISO(t.end_time), now);
          }

          if (currentView === "week") {
            if (!t.end_time) return false;
            return isSameWeek(parseISO(t.end_time), selectedDate, {
              weekStartsOn: 0,
            });
          }

          if (currentView === "overdue") {
            if (t.status === "DONE" || !t.end_time) return false;
            return isBefore(parseISO(t.end_time), startOfDay(now));
          }

          return true;
        })
        .sort((a, b) => {
          if (a.end_time && b.end_time) {
            const dateA = new Date(a.end_time).getTime();
            const dateB = new Date(b.end_time).getTime();
            if (dateA !== dateB) return dateA - dateB;
          }
          return (
            (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2)
          );
        });

      const groups: Record<string, typeof tasksToGroup> = {};
      filtered.forEach((task) => {
        const dateKey = task.end_time
          ? format(parseISO(task.end_time), "yyyy-MM-dd")
          : "No Date";
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(task);
      });

      return groups;
    },
    [filterPriority, filterStatus, selectedDate],
  );

  const renderTaskListContent = (groups: Record<string, typeof tasks>) => {
    const keys = Object.keys(groups).sort();
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
        {view === "week" && (
          <div className="md:hidden flex items-center justify-between mb-4 bg-muted/20 rounded-lg p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(subWeeks(selectedDate, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="text-xs font-bold">
              {format(startOfWeek(selectedDate), "MMM dd")} -{" "}
              {format(endOfWeek(selectedDate), "MMM dd")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        )}

        <div className="hidden md:block mb-8">
          <QuickAdd onAddTask={handleAddTask} />
        </div>

        <div className="space-y-8">
          {keys.length > 0 ? (
            keys.map((dateKey) => (
              <div key={dateKey} className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-[1px] flex-1 bg-border/60" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary/85 whitespace-nowrap">
                    {dateKey === "No Date"
                      ? dateKey
                      : format(parseISO(dateKey), "EEEE, MMM dd")}
                  </span>
                  <div className="h-[1px] flex-1 bg-border/60" />
                </div>
                <div className="grid gap-3">
                  {groups[dateKey].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      collection={collections.find(
                        (c) => c.id === task.collection_id,
                      )}
                      onToggleComplete={handleToggleComplete}
                      onEdit={() => setSelectedTaskId(task.id)}
                      isActive={selectedTaskId === task.id}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in duration-500">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted/50 mb-4">
                {view === "overdue" ? (
                  <AlertCircle className="size-8 text-emerald-500/70" />
                ) : (
                  <ListChecks className="size-8 text-muted-foreground/50" />
                )}
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {view === "today"
                  ? "No tasks for today"
                  : view === "week"
                    ? "No tasks this week"
                    : view === "overdue"
                      ? "All caught up!"
                      : "No tasks found"}
              </h3>
            </div>
          )}
        </div>
      </div>
    );
  };

  const groupedTasks = useMemo(
    () => getGroupedTasks(tasks, view),
    [tasks, view, getGroupedTasks],
  );

  const allCategoryGroups = useMemo(() => {
    return {
      all: getGroupedTasks(tasks, "all"),
      today: getGroupedTasks(tasks, "today"),
      week: getGroupedTasks(tasks, "week"),
      overdue: getGroupedTasks(tasks, "overdue"),
    };
  }, [tasks, getGroupedTasks]);

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
            <div className="space-y-0.5 w-full">
              <div className="flex items-center justify-between md:block">
                <h1 className="text-xl font-bold tracking-tight text-primary md:text-foreground md:text-2xl">
                  <span className="md:hidden font-extrabold tracking-tight">
                    Chronos
                  </span>
                  <span className="hidden md:inline">{title}</span>
                </h1>
                <div className="md:hidden size-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg ring-2 ring-primary/20">
                  {/* Avatar Placeholder */}
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
          <div className="md:hidden mt-4 overflow-hidden">
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
                        const index = navItems.findIndex(
                          (n) => n.id === item.id,
                        );
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
            <div className="mt-2 text-[10px] text-muted-foreground/60 font-medium">
              Horizontal Scroll &gt;
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
          <>
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
            {/* Mobile Filters FAB is now fixed in its own component */}
          </>
        )}
      </header>

      <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary/40" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col relative w-full">
            {selectedCollectionId && (
              <div className="flex md:hidden justify-center items-center py-3 gap-2 border-b border-border/50 bg-background z-10 sticky top-0">
                <div className="flex bg-muted/50 p-1 rounded-full w-[240px]">
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
                      "flex-1 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                      contentType === "tasks"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Tasks
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
                      "flex-1 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300",
                      contentType === "resources"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    Resources
                  </button>
                </div>
              </div>
            )}

            <div
              id="mobile-scroll-container"
              className={cn(
                "flex flex-1 overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar scroll-smooth",
                // Removido overflow-x-hidden para permitir scroll horizontal das categorias na Home
              )}
              onScroll={(e) => {
                const { scrollLeft, clientWidth } = e.currentTarget;
                if (selectedCollectionId) {
                  const section =
                    scrollLeft < clientWidth / 2 ? "tasks" : "resources";
                  if (section !== contentType) {
                    setContentType(section);
                  }
                } else {
                  // Troca de categoria na Home por scroll com threshold menor (menos sensível)
                  // Só troca se passar de 70% do caminho para a próxima página
                  const exactIndex = scrollLeft / clientWidth;
                  const index = Math.round(exactIndex);

                  // Se o scroll estiver muito perto do meio, não troca ainda (threshold de 0.3)
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
                  {/* TASKS VIEW IN COLLECTION */}
                  <div
                    className={cn(
                      "w-full shrink-0 snap-center flex flex-col h-full",
                      contentType !== "tasks" ? "hidden md:flex" : "flex",
                    )}
                  >
                    <ScrollArea className="h-full pb-24 md:pb-6">
                      {renderTaskListContent(groupedTasks)}
                    </ScrollArea>
                  </div>

                  {/* RESOURCES VIEW */}
                  <div
                    className={cn(
                      "w-full shrink-0 snap-center flex flex-col h-full",
                      contentType !== "resources" ? "hidden md:flex" : "flex",
                    )}
                  >
                    <CollectionResources collectionId={selectedCollectionId} />
                  </div>
                </>
              ) : (
                <>
                  {/* HOME VIEWS SWIPE */}
                  {navItems.map((item) => (
                    <div
                      key={item.id}
                      className="w-full shrink-0 snap-center flex flex-col h-full"
                    >
                      <ScrollArea className="h-full pb-32 md:pb-6">
                        {renderTaskListContent(
                          allCategoryGroups[
                            item.id as keyof typeof allCategoryGroups
                          ],
                        )}
                      </ScrollArea>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Add Task FAB */}
      <MobileAddTask onAddTask={handleAddTask} />
    </div>
  );
}
