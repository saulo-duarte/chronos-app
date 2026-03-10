"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTaskSchema, UpdateTaskSchema } from "@/schemas/tasks";
import { Task, Collection, Priority } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Flag, Folder, AlignLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

interface TaskDetailsFormProps {
  task: Task;
  collections: Collection[];
  onUpdate: (id: string, updates: UpdateTaskSchema) => void;
}

export function TaskDetailsForm({
  task,
  collections,
  onUpdate,
}: TaskDetailsFormProps) {
  const formatForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return format(date, "yyyy-MM-dd'T'HH:mm");
    } catch {
      return "";
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateTaskSchema>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      status: task.status,
      collection_id: task.collection_id || "none",
      start_time: formatForInput(task.start_time),
      end_time: formatForInput(task.end_time),
    },
  });

  const title = watch("title");
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.style.height = "auto";
      titleRef.current.style.height = `${titleRef.current.scrollHeight}px`;
    }
  }, [title]);

  const onSubmit: SubmitHandler<UpdateTaskSchema> = (data) => {
    const updates: UpdateTaskSchema = {
      ...data,
      collection_id:
        data.collection_id === "none" ? undefined : data.collection_id,
      start_time: data.start_time
        ? new Date(data.start_time).toISOString()
        : undefined,
      end_time: data.end_time
        ? new Date(data.end_time).toISOString()
        : undefined,
    };
    onUpdate(task.id, updates);
  };

  const handleBlur = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <ScrollArea className="flex-1 h-full w-full">
      <form
        onBlur={handleBlur}
        className="flex flex-col gap-8 px-4 py-6 md:px-6 pb-40"
      >
        <div className="space-y-2">
          <textarea
            {...register("title")}
            ref={(e) => {
              register("title").ref(e);
              titleRef.current = e;
            }}
            placeholder="Task Title"
            className="w-full resize-none border-none bg-transparent p-0 text-3xl font-bold text-foreground placeholder:text-muted-foreground focus:ring-0 break-words overflow-hidden"
            rows={1}
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-muted/40 border border-border/50">
            <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <Flag className="size-3" /> Priority
            </label>
            <Select
              value={watch("priority")}
              onValueChange={(v) => {
                setValue("priority", v as Priority);
                handleBlur();
              }}
            >
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
            <Select
              value={watch("collection_id")}
              onValueChange={(v) => {
                setValue("collection_id", v);
                handleBlur();
              }}
            >
              <SelectTrigger className="h-7 border-none bg-transparent p-0 shadow-none focus:ring-0 text-sm font-semibold w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No collection</SelectItem>
                {collections.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
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
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Start Time
                </span>
                <input
                  type="datetime-local"
                  {...register("start_time")}
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
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Due Date
                </span>
                <input
                  type="datetime-local"
                  {...register("end_time")}
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
              {...register("description")}
              placeholder="Write some details here..."
              className="w-full min-h-[120px] resize-none rounded-2xl border-none bg-muted/30 p-4 text-base text-foreground focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 overflow-hidden"
              style={{ fieldSizing: "content" }}
            />
          </div>
        </div>
      </form>
    </ScrollArea>
  );
}
