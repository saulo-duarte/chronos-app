"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { format } from "date-fns";

export type FilterType = "today" | "day" | "week" | "no-date" | "overdue";

export function useTaskFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentFilter = (searchParams.get("filter") as FilterType) || "today";
  const selectedDate = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");

  const setFilter = useCallback((filter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", filter);
    // Overdue doesn't need a specific date usually, it's relative to now
    // No-date also doesn't
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const setDate = useCallback((date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", "day");
    params.set("date", date);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  return {
    currentFilter,
    selectedDate,
    setFilter,
    setDate,
  };
}
