"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { 
  Task, 
  Priority,  
  Collection, 
  UpdateTaskDTO,
  Status
} from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  Calendar, 
  Flag, 
  Folder, 
  AlignLeft, 
  CheckCircle2, 
  Circle,
  Clock,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskDetailsProps {
  task: Task;
  collections: Collection[];
  onUpdate: (id: string, updates: UpdateTaskDTO) => void;
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
  const formatForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch { return ""; }
  };

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);
  const [collectionId, setCollectionId] = useState<string>(task.collection_id || "none");
  const [startTime, setStartTime] = useState<string>(formatForInput(task.start_time));
  const [endTime, setEndTime] = useState<string>(formatForInput(task.end_time));
  
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

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
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 shrink-0 border-b border-border/50 bg-background z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <ArrowLeft className="size-5" />
          </Button>
          <span className="text-sm font-semibold text-muted-foreground">Edit Task</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(task.id)} 
          className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 h-full w-full">
        <div className="flex flex-col gap-8 px-4 py-6 md:px-6 pb-40">
          <div className="space-y-2">
            <textarea
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleUpdate}
              placeholder="Task Title"
              className="w-full resize-none border-none bg-transparent p-0 text-3xl font-bold text-foreground placeholder:text-muted-foreground focus:ring-0 break-words overflow-hidden"
              rows={1}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Flag className="size-3" /> Priority
              </label>
              <Select value={priority} onValueChange={(v) => {
                setPriority(v as Priority);
                onUpdate(task.id, { priority: v as Priority });
              }}>
                <SelectTrigger className="h-7 border-none bg-transparent p-0 shadow-none focus:ring-0 text-sm font-semibold w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
              <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Folder className="size-3" /> Collection
              </label>
              <Select value={collectionId} onValueChange={(v) => {
                setCollectionId(v);
                onUpdate(task.id, { collection_id: v === "none" ? undefined : v });
              }}>
                <SelectTrigger className="h-7 border-none bg-transparent p-0 shadow-none focus:ring-0 text-sm font-semibold w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No collection</SelectItem>
                  {collections.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-4 p-4 rounded-2xl bg-muted/20 border border-dashed border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background shadow-sm">
                  <Clock className="size-4 text-primary" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Start Time</span>
                  <input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    onBlur={handleUpdate}
                    className="bg-transparent text-sm font-medium focus:outline-none w-full"
                  />
                </div>
              </div>
              
              <div className="h-px bg-border/50 w-full" />

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-background shadow-sm">
                  <Calendar className="size-4 text-destructive" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Due Date</span>
                  <input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    onBlur={handleUpdate}
                    className="bg-transparent text-sm font-medium focus:outline-none w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-muted-foreground px-1">
                <AlignLeft className="size-3.5" /> NOTES
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleUpdate}
                placeholder="Write some details here..."
                className="w-full min-h-[120px] resize-none rounded-2xl border-none bg-muted/30 p-4 text-base text-foreground focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 overflow-hidden"
                style={{ fieldSizing: 'content' }}
              />
            </div>
          </div>
          
          <div className="text-center">
             <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
              Created on {format(new Date(task.created_at), "PPP p")}
            </p>
          </div>
        </div>
      </ScrollArea>

      <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10 z-20">
        <Button
          onClick={toggleStatus}
          size="lg"
          className={cn(
            "w-full h-14 rounded-2xl text-base font-semibold shadow-xl",
            status === "DONE" 
              ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
              : "bg-primary hover:bg-primary/90 text-primary-foreground"
          )}
        >
          {status === "DONE" ? (
            <div className="flex items-center gap-2"><CheckCircle2 className="size-6" /> Completed</div>
          ) : (
            <div className="flex items-center gap-2"><Circle className="size-6" /> Mark as Complete</div>
          )}
        </Button>
      </div>
    </div>
  );
}