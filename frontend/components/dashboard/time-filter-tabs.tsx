"use client";

import { cn } from "@/lib/utils";
import { useTaskFilters, FilterType } from "@/hooks/use-task-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

const tabs: { id: FilterType; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "day", label: "Day" },
  { id: "week", label: "Week" },
  { id: "no-date", label: "No Date" },
];

export function TimeFilterTabs() {
  const { currentFilter, setFilter } = useTaskFilters();
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentFilter]);

  return (
    <div className="w-full border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-20">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex px-4 items-center h-14">
          {tabs.map((tab) => {
            const isActive = currentFilter === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                onClick={() => setFilter(tab.id)}
                className={cn(
                  "relative h-14 px-6 flex items-center justify-center text-sm font-semibold transition-all",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_10px_rgba(94,129,172,0.4)]" />
                )}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="hidden" />
      </ScrollArea>
    </div>
  );
}
