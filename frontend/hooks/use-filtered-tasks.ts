import { useMemo } from "react";
import { isToday, isBefore, parseISO, isSameWeek, startOfDay, format } from "date-fns";
import { Task } from "@/types";
import { FilterType } from "./use-task-filters";

export function useFilteredTasks(tasks: Task[], currentFilter: FilterType, searchDate: string) {
  return useMemo(() => {
    let result = tasks;

    if (currentFilter === "today") {
      result = tasks.filter((t) => {
        if (!t.end_time) return false;
        const date = new Date(t.end_time);
        return isToday(date);
      });
    } else if (currentFilter === "day" && searchDate) {
      result = tasks.filter((t) => {
        if (!t.end_time) return false;
        const date = new Date(t.end_time);
        return format(date, "yyyy-MM-dd") === searchDate;
      });
    } else if (currentFilter === "week") {
      result = tasks.filter((t) => {
        if (!t.end_time) return false;
        const date = new Date(t.end_time);
        const targetWeekDate = searchDate ? parseISO(searchDate) : new Date();
        return isSameWeek(date, targetWeekDate, { weekStartsOn: 0 });
      });
    } else if (currentFilter === "overdue") {
      result = tasks.filter((t) => {
        if (t.status === "DONE" || !t.end_time) return false;
        const date = new Date(t.end_time);
        return isBefore(date, startOfDay(new Date())) && !isToday(date);
      });
    } else if (currentFilter === "no-date") {
      result = tasks.filter((t) => !t.end_time);
    }

    return result;
  }, [tasks, currentFilter, searchDate]);
}
