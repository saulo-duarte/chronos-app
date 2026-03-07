"use client";

import {
  Filter,
  CalendarDays,
  CalendarRange,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardView, useDashboardStore } from "@/stores/use-dashboard-store";
import { Priority, Status } from "@/types";
import { cn } from "@/lib/utils";

export function MobileFilters() {
  const {
    view,
    setView,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
  } = useDashboardStore();

  const views = [
    { id: "all", label: "All", icon: Inbox },
    { id: "today", label: "Today", icon: CalendarDays },
    { id: "week", label: "Week", icon: CalendarRange },
    { id: "overdue", label: "Overdue", icon: AlertCircle },
  ] as const;

  return (
    <div className="md:hidden fixed bottom-44 right-6 z-[70]">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="size-14 rounded-full shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/30 transition-all bg-card text-primary ring-4 ring-primary/10 border-border/50"
          >
            <Filter className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="rounded-t-2xl p-6 min-h-[50vh] flex flex-col gap-6"
        >
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">
                Visualização
              </label>
              <div className="grid grid-cols-2 gap-2">
                {views.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant="outline"
                      onClick={() => setView(item.id as DashboardView)}
                      className={cn(
                        "justify-start gap-2 h-12",
                        isActive
                          ? "border-primary bg-primary/10 text-primary"
                          : "text-muted-foreground",
                      )}
                    >
                      <item.icon className="size-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">
                Prioridade
              </label>
              <Select
                value={filterPriority}
                onValueChange={(v) => setFilterPriority(v as Priority | "ALL")}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Todas as Prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas as Prioridades</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80">
                Status
              </label>
              <Select
                value={filterStatus}
                onValueChange={(v) => setFilterStatus(v as Status | "ALL")}
              >
                <SelectTrigger className="h-12 w-full">
                  <SelectValue placeholder="Todos os Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos os Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
