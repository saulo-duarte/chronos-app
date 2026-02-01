"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ProgressRing } from "./progress-ring";
import { PanelRightClose, PanelRight, CheckCircle2 } from "lucide-react";
import { TaskDetails } from "./task-details";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useCollections } from "@/hooks/use-collections";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { UpdateTaskDTO } from "@/types";

export function RightPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const { selectedTaskId, setSelectedTaskId, activeNav } = useDashboardStore();
  
  const selectedCollectionId = activeNav.startsWith("collection-") 
    ? activeNav.replace("collection-", "") 
    : undefined;

  const { data: tasks = [] } = useTasks(selectedCollectionId);
  const { data: collections = [] } = useCollections();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const completedTasks = useMemo(() => tasks.filter((t) => t.status === "DONE"), [tasks]);
  const totalTasks = tasks.length;
  const completedCount = completedTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const handleUpdateTask = useCallback((id: string, updates: UpdateTaskDTO) => {
    updateTaskMutation.mutate({ id, dto: updates });
  }, [updateTaskMutation]);

  const handleDeleteTask = useCallback((id: string) => {
    deleteTaskMutation.mutate(id);
    setSelectedTaskId(null);
  }, [deleteTaskMutation, setSelectedTaskId]);

  const selectedTask = useMemo(() => 
    tasks.find(t => t.id === selectedTaskId) || null
  , [tasks, selectedTaskId]);

  if (collapsed && !selectedTask) {
    return (
      <div className="flex w-12 flex-col items-center border-l border-border bg-sidebar py-4 h-full shrink-0">
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(false)} className="size-8">
          <PanelRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <aside className="flex h-screen w-80 flex-col border-l border-border bg-sidebar shrink-0 overflow-hidden relative">
      {selectedTask ? (
        <TaskDetails
          task={selectedTask}
          collections={collections}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
        />
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-4 shrink-0">
            <h3 className="text-sm font-semibold text-foreground">Weekly Progress</h3>
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="size-7">
              <PanelRightClose className="size-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 w-full">
            <div className="p-4 space-y-8 pb-10">
              <div className="flex flex-col items-center py-6">
                <ProgressRing progress={progress} />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{completedCount}</span> de{" "}
                  <span className="font-medium text-foreground">{totalTasks}</span> tarefas
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/50 p-3 text-center border border-border/50">
                  <p className="text-2xl font-bold text-foreground">{totalTasks - completedCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Restantes</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center border border-border/50">
                  <p className="text-2xl font-bold text-primary">{completedCount}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Feitas</p>
                </div>
              </div>

              <div className="">
                <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
                  Recently Completed
                </h4>
                <div className="space-y-1.5">
                  {completedTasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="group flex items-center gap-3 rounded-lg bg-muted/20 p-2.5 transition-all hover:bg-muted/40 cursor-pointer border border-transparent hover:border-border/50"
                      onClick={() => setSelectedTaskId(task.id)}
                    >
                      <CheckCircle2 className="size-4 text-primary shrink-0 opacity-70 group-hover:opacity-100" />
                      <p className="truncate text-xs text-muted-foreground line-through decoration-muted-foreground/50">
                        {task.title}
                      </p>
                    </div>
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center">
                      <p className="text-xs text-muted-foreground">Nada concluído ainda</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </aside>
  );
}