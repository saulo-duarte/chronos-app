import { useCallback, useMemo } from "react";
import { isSameDay, isSameWeek, isBefore, parseISO, format, startOfDay } from "date-fns";
import { Task, Priority, Status } from "@/types";
import { DashboardView } from "@/stores/use-dashboard-store";

export function useTaskGrouping(
  tasks: Task[],
  view: DashboardView,
  selectedDate: Date,
  filterPriority: Priority | "ALL",
  filterStatus: Status | "ALL"
) {
  const getGroupedTasks = useCallback(
    (tasksToGroup: Task[], currentView: DashboardView) => {
      const now = new Date();
      const priorityOrder: Record<string, number> = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2,
      };

      const filtered = tasksToGroup
        .filter((t) => {
          if (filterPriority !== "ALL" && t.priority !== filterPriority) return false;
          if (filterStatus !== "ALL" && filterStatus !== t.status) return false;

          if (currentView === "today") {
            if (!t.end_time) return false;
            return isSameDay(parseISO(t.end_time), now);
          }

          if (currentView === "week") {
            if (!t.end_time) return false;
            return isSameWeek(parseISO(t.end_time), selectedDate, { weekStartsOn: 0 });
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
          return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
        });

      const groups: Record<string, Task[]> = {};
      filtered.forEach((task) => {
        const dateKey = task.end_time ? format(parseISO(task.end_time), "yyyy-MM-dd") : "No Date";
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(task);
      });

      return groups;
    },
    [filterPriority, filterStatus, selectedDate]
  );

  const groupedTasks = useMemo(() => getGroupedTasks(tasks, view), [tasks, view, getGroupedTasks]);

  const allCategoryGroups = useMemo(() => {
    return {
      all: getGroupedTasks(tasks, "all"),
      today: getGroupedTasks(tasks, "today"),
      week: getGroupedTasks(tasks, "week"),
      overdue: getGroupedTasks(tasks, "overdue"),
    };
  }, [tasks, getGroupedTasks]);

  return { groupedTasks, allCategoryGroups };
}
