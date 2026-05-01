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
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <header className="hidden md:flex flex-col border-b border-border/50 backdrop-blur-md transition-colors duration-500">
      <div className="px-4 py-2 md:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Título e Contador */}
          <div className="flex items-end gap-6">
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
            </div>

            {/* Tabs de Seleção */}
            {selectedCollectionId && (
              <Tabs
                value={contentType}
                onValueChange={(v) => {
                  setContentType(v as "tasks" | "resources" | "drawings");
                }}
                className="bg-muted/50 p-0.5 rounded-lg mb-0.5 shrink-0"
              >
                <TabsList className="h-8 bg-transparent border-none gap-1">
                  <TabsTrigger
                    value="tasks"
                    className="rounded-md px-3 text-xs font-semibold tracking-tight h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className="rounded-md px-3 text-xs font-semibold tracking-tight h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    Resources
                  </TabsTrigger>
                  <TabsTrigger
                    value="drawings"
                    className="rounded-md px-3 text-xs font-semibold tracking-tight h-7 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/20 transition-all"
                  >
                    Quadros
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Filtros Alinhados ao lado */}
          {contentType === "tasks" && (
            <div className="flex items-center gap-2">
              <Select
                value={filterPriority}
                onValueChange={(v) => setFilterPriority(v as Priority | "ALL")}
              >
                <SelectTrigger className="h-8 w-[130px] text-[11px] bg-background">
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
                <SelectTrigger className="h-8 w-[130px] text-[11px] bg-background">
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

          {/* Botões de Ação para Resources e Drawings */}
          {selectedCollectionId && contentType !== "tasks" && (
             <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="h-8 gap-2 rounded-md"
                  onClick={() => {
                    // This will now focus the QuickAdd input which we'll move to TaskList
                    (document.querySelector('#quick-add-input') as HTMLElement)?.focus();
                  }}
                >
                  <Plus className="size-4" />
                  {contentType === "resources" ? "Novo Link" : "Novo Quadro"}
                </Button>
             </div>
          )}
        </div>
      </div>
    </header>
  );
}
