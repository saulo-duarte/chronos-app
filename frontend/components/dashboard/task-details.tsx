"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Task, 
  Priority,  
  Collection, 
  UpdateTaskDTO,
  Status
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Calendar, Flag, Folder, AlignLeft, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailsProps {
  task: Task;
  collections: Collection[];
  onUpdate: (id: string, updates: UpdateTaskDTO) => void;
  onClose: () => void;
}

export function TaskDetails({
  task,
  collections,
  onUpdate,
  onClose,
}: TaskDetailsProps) {
  const formatForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  };

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);
  const [collectionId, setCollectionId] = useState<string>(task.collection_id || "none");
  const [startTime, setStartTime] = useState<string>(formatForInput(task.start_time));
  const [endTime, setEndTime] = useState<string>(formatForInput(task.end_time));

  const handleUpdate = () => {
    const updates: UpdateTaskDTO = {
      title,
      description: description || undefined,
      priority,
      status,
      collection_id: collectionId === "none" ? undefined : collectionId,
      start_time: startTime ? new Date(startTime).toISOString() : undefined,
      end_time: endTime ? new Date(endTime).toISOString() : undefined,
    };
    onUpdate(task.id, updates);
  };

  const toggleStatus = () => {
    const newStatus = status === "DONE" ? "PENDING" : "DONE";
    setStatus(newStatus);
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleStatus}
            className={cn(
              "size-8 transition-colors",
              status === "DONE" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {status === "DONE" ? (
              <CheckCircle2 className="size-5" />
            ) : (
              <Circle className="size-5" />
            )}
          </Button>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Task Details
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="size-8">
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Title input - Large and borderless-like */}
          <div className="space-y-1">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleUpdate}
              placeholder="Task title"
              className="w-full resize-none border-none bg-transparent px-0 text-xl font-bold text-foreground placeholder:text-muted-foreground focus:ring-0"
              rows={1}
              style={{ height: 'auto' }}
              onInputCapture={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = target.scrollHeight + 'px';
              }}
            />
          </div>

          <div className="space-y-4">
            {/* Status & Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Flag className="size-3.5" />
                  Priority
                </div>
                <Select
                  value={priority}
                  onValueChange={(v) => {
                    setPriority(v as Priority);
                    onUpdate(task.id, { priority: v as Priority });
                  }}
                >
                  <SelectTrigger className="h-9 border-none bg-muted/50 px-3 transition-colors hover:bg-muted">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Folder className="size-3.5" />
                  Collection
                </div>
                <Select
                  value={collectionId}
                  onValueChange={(v) => {
                    setCollectionId(v);
                    onUpdate(task.id, { collection_id: v === "none" ? undefined : v });
                  }}
                >
                  <SelectTrigger className="h-9 border-none bg-muted/50 px-3 transition-colors hover:bg-muted">
                    <SelectValue placeholder="Inbox" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No collection</SelectItem>
                    {collections.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: c.color }}
                          />
                          <span className="truncate">{c.title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-3 rounded-lg bg-muted/30 p-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Start Date
                </div>
                <Input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  onBlur={handleUpdate}
                  className="h-9 border-none bg-background/50"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <Calendar className="size-3.5" />
                  Due Date
                </div>
                <Input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  onBlur={handleUpdate}
                  className="h-9 border-none bg-background/50"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <AlignLeft className="size-3.5" />
                Description
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdate}
                placeholder="Add more details to this task..."
                className="min-h-[150px] w-full resize-none rounded-lg border-border bg-muted/20 p-3 text-sm text-foreground focus:border-border focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <p className="text-center text-[10px] text-muted-foreground">
          Created on {format(new Date(task.created_at), "PPP p")}
        </p>
      </div>
    </div>
  );
}
