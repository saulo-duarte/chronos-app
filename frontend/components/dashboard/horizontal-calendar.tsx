"use client";

import { addDays, format, isSameDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HorizontalCalendar() {
  const { selectedDate, setDate } = useTaskFilters();
  const today = startOfToday();
  const [baseDate, setBaseDate] = useState(today);
  const activeDateRef = useRef<HTMLButtonElement>(null);

  // Generate 21 days (3 weeks) centered around baseDate
  const days = Array.from({ length: 21 }, (_, i) => addDays(baseDate, i - 10));

  const navigateWeeks = (weeks: number) => {
    setBaseDate((prev) => addDays(prev, weeks * 7));
  };

  const resetToToday = () => {
    setBaseDate(today);
    setDate(format(today, "yyyy-MM-dd"));
  };

  useEffect(() => {
    if (activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedDate, baseDate]);

  return (
    <div className="w-full py-4 border-b border-white/5 bg-background/30 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigateWeeks(-1)}
            className="p-1 hover:bg-white/5 rounded-md transition-colors"
            title="Previous Week"
          >
            <ChevronLeft className="size-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => navigateWeeks(1)}
            className="p-1 hover:bg-white/5 rounded-md transition-colors"
            title="Next Week"
          >
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>
        
        <button 
          onClick={resetToToday}
          className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-primary transition-colors"
        >
          Today
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 px-4 pb-2">
          {days.map((day) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const isSelected = selectedDate === dateStr;
            const isTodayDate = isSameDay(day, today);

            return (
              <button
                key={dateStr}
                ref={isSelected ? activeDateRef : null}
                onClick={() => setDate(dateStr)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[56px] h-20 rounded-2xl transition-all duration-300",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "bg-card/20 border border-white/5 hover:bg-card/40",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] uppercase font-black tracking-[0.2em]",
                    isSelected
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {format(day, "EEE")}
                </span>
                <span className="text-xl font-black mt-1">
                  {format(day, "d")}
                </span>
                {isTodayDate && !isSelected && (
                  <div className="mt-1 size-1 bg-primary rounded-full" />
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
