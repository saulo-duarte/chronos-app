"use client";

import { Task, Collection } from "@/types";
import { UpdateTaskSchema } from "@/schemas/tasks";
import { format } from "date-fns";
import { TaskDetailsHeader } from "./task-details-header";
import { TaskDetailsForm } from "./task-details-form";
import { TaskDetailsFooter } from "./task-details-footer";

interface TaskDetailsProps {
  task: Task;
  collections: Collection[];
  onUpdate: (id: string, updates: UpdateTaskSchema) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TaskDetails({
  task,
  collections,
  onUpdate,
  onDelete,
  onClose,
}: TaskDetailsProps) {
  const toggleStatus = () => {
    const newStatus = task.status === "DONE" ? "PENDING" : "DONE";
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <TaskDetailsHeader onClose={onClose} onDelete={() => onDelete(task.id)} />

      <TaskDetailsForm
        task={task}
        collections={collections}
        onUpdate={onUpdate}
      />

      <div className="px-4 pb-4 shrink-0 text-center z-10">
        <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
          Created on {format(new Date(task.created_at), "PPP p")}
        </p>
      </div>

      <TaskDetailsFooter status={task.status} onToggleStatus={toggleStatus} />
    </div>
  );
}
