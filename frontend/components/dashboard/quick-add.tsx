"use client";

import { useState, type KeyboardEvent, useRef } from "react";
import { Plus, Calendar, Flag, SendHorizontal, X } from "lucide-react";
import { Priority } from "@/types";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface QuickAddProps {
  onAddTask: (title: string, priority: Priority, startTime?: Date, description?: string) => void;
  onAddCollection: (title: string, color: string, description?: string) => void;
}

const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#22C55E", // Green
  "#F59E0B", // Amber
  "#6366F1", // Indigo
  "#8B5CF6", // Violet
  "#EC4899", // Pink
  "#06B6D4", // Cyan
];

export function QuickAdd({ onAddTask, onAddCollection }: QuickAddProps) {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [startTime, setStartTime] = useState<string>("");
  const [color, setColor] = useState(COLORS[0]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mode, setMode] = useState<"task" | "collection">("task");
  const inputRef = useRef<HTMLInputElement>(null);
  const { activeNav } = useDashboardStore();

  const isHome = activeNav === "tasks" || activeNav === "dashboard";

  const handleSubmit = () => {
    if (!value.trim()) return;

    if (mode === "task") {
      onAddTask(
        value.trim(),
        priority,
        startTime ? new Date(startTime) : undefined,
        description.trim() || undefined
      );
    } else {
      onAddCollection(value.trim(), color, description.trim() || undefined);
    }

    setValue("");
    setDescription("");
    setPriority("MEDIUM");
    setStartTime("");
    setColor(COLORS[0]);
    setIsExpanded(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
    if (e.key === "Escape") {
      setIsExpanded(false);
      inputRef.current?.blur();
    }
  };

  const priorityColors = {
    LOW: "text-blue-500",
    MEDIUM: "text-yellow-500",
    HIGH: "text-red-500",
  };

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-2xl border transition-all duration-300",
        isExpanded
          ? "border-primary/40 bg-card/60 backdrop-blur-md shadow-2xl p-6"
          : "border-border/50 bg-muted/20 backdrop-blur-sm p-4 hover:bg-muted/40 hover:border-primary/20 shadow-lg",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
            isExpanded ? "bg-primary/10" : "bg-transparent",
          )}
        >
          <Plus
            className={cn(
              "size-5",
              isExpanded ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder={mode === "task" ? "Add a task..." : "Add a collection..."}
          className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none md:text-base"
        />

        {isExpanded && (
          <div className="flex items-center gap-2">
            {isHome && (
              <div className="flex bg-muted/50 p-1 rounded-full border border-border/50">
                <button
                  onClick={() => setMode("task")}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase rounded-full transition-all",
                    mode === "task" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Task
                </button>
                <button
                  onClick={() => setMode("collection")}
                  className={cn(
                    "px-3 py-1 text-[10px] font-bold uppercase rounded-full transition-all",
                    mode === "collection" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
                  )}
                >
                  Col
                </button>
              </div>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="size-8 rounded-full text-primary hover:bg-primary/10"
            >
              <SendHorizontal className="size-5" />
            </Button>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-4 pl-11 animate-in fade-in slide-in-from-top-2 duration-200">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description (optional)..."
            className="w-full bg-transparent text-xs text-muted-foreground outline-none border-none py-1"
          />

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {mode === "task" ? (
                <>
                  <Select
                    value={priority}
                    onValueChange={(v) => setPriority(v as Priority)}
                  >
                    <SelectTrigger className="h-8 w-fit gap-2 border-none bg-muted/50 px-2 text-xs hover:bg-muted transition-colors">
                      <Flag className={cn("size-3.5", priorityColors[priority])} />
                      <span className="hidden md:inline">Priority</span>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <div className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2">
                      <Calendar className="size-3.5 text-muted-foreground" />
                    </div>
                    <input
                      type="datetime-local"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className={cn(
                        "h-8 rounded-md bg-muted/50 pl-8 text-[10px] outline-none transition-all hover:bg-muted md:text-xs border-none",
                        startTime ? "w-[160px]" : "w-[36px] md:w-[130px]",
                      )}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">Color</span>
                  <div className="flex items-center gap-1.5">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          "size-4 rounded-full transition-transform hover:scale-110",
                          color === c && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="size-7 rounded-full text-muted-foreground"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
