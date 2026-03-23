"use client";

import { addDays, format, isSameDay, startOfToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useTaskFilters } from "@/hooks/use-task-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function HorizontalCalendar() {
  const { selectedDate, setDate } = useTaskFilters();
  const today = startOfToday();
  const activeDateRef = useRef<HTMLButtonElement>(null);

  // Generate 30 days starting from today (effectively or previous if needed)
  // Let's do 7 days before and 30 days after for context
  const days = Array.from({ length: 45 }, (_, i) => addDays(today, i - 14));

  useEffect(() => {
    if (activeDateRef.current) {
      activeDateRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [selectedDate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full py-4 border-b border-white/5 bg-background/30"
    >
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
    </motion.div>
  );
}
