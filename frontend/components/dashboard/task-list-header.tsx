"use client";

import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Priority, Status } from "@/types";
import { cn } from "@/lib/utils";

interface TaskListHeaderProps {
  title: string;
  selectedCollectionId?: string;
  incompleteCount: number;
}

export function TaskListHeader({
  title,
  selectedCollectionId,
  incompleteCount,
}: TaskListHeaderProps) {
  const {
    contentType,
    setContentType,
    filterPriority,
    setFilterPriority,
    filterStatus,
    setFilterStatus,
  } = useDashboardStore();

  return (
    <header className="hidden md:flex flex-col border-b border-border backdrop-blur-md transition-colors duration-500">
      <div className="px-4 py-4 md:px-6">
        <div className="flex items-end gap-6 mb-4">
          <div className="space-y-0.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              <span
                className={cn(
                  selectedCollectionId && "text-primary font-extrabold",
                )}
              >
                {title}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {incompleteCount}{" "}
              {incompleteCount === 1 ? "task remaining" : "tasks remaining"}
            </p>
          </div>

          {selectedCollectionId && (
            <Tabs
              value={contentType}
              onValueChange={(v) => {
                setContentType(v as "tasks" | "resources");
              }}
              className="bg-muted/50 p-1 rounded-full mb-0.5 shrink-0"
            >
              <TabsList className="h-7 bg-transparent border-none">
                <TabsTrigger
                  value="tasks"
                  className="rounded-full px-4 text-[10px] uppercase font-bold tracking-wider h-5"
                >
                  Tasks
                </TabsTrigger>
                <TabsTrigger
                  value="resources"
                  className="rounded-full px-4 text-[10px] uppercase font-bold tracking-wider h-5"
                >
                  Resources
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </div>

      {contentType === "tasks" && (
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
      )}
    </header>
  );
}
