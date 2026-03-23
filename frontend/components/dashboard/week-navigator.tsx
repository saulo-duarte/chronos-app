"use client";

import { useTaskFilters } from "@/hooks/use-task-filters";
import { addWeeks, subWeeks, parseISO, format, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WeekNavigator() {
  const { selectedDate, setWeekDate } = useTaskFilters();
  const currentDate = parseISO(selectedDate);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 0 });

  const goPrevWeek = () => {
    const prev = subWeeks(currentDate, 1);
    setWeekDate(format(prev, "yyyy-MM-dd"));
  };

  const goNextWeek = () => {
    const next = addWeeks(currentDate, 1);
    setWeekDate(format(next, "yyyy-MM-dd"));
  };

  const goCurrentWeek = () => {
    setWeekDate(format(new Date(), "yyyy-MM-dd"));
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card/30 border-b border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2 text-muted-foreground">
        <CalendarRange className="size-4" />
        <span className="text-sm font-medium capitalize">
          {format(weekStart, "d MMM", { locale: ptBR })} - {format(weekEnd, "d MMM, yyyy", { locale: ptBR })}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={goPrevWeek} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={goCurrentWeek} className="h-8 text-xs text-muted-foreground hover:text-foreground">
          Hoje
        </Button>
        <Button variant="ghost" size="icon" onClick={goNextWeek} className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
