"use client";

import { useState, type KeyboardEvent, useRef } from "react";
import { Plus, Calendar, Flag, SendHorizontal, X } from "lucide-react";
import { Priority } from "@/types";
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
  onAddTask: (title: string, priority: Priority, startTime?: Date) => void;
}

export function QuickAdd({ onAddTask }: QuickAddProps) {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [startTime, setStartTime] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (value.trim()) {
      onAddTask(
        value.trim(),
        priority,
        startTime ? new Date(startTime) : undefined
      );
      setValue("");
      setPriority("MEDIUM");
      setStartTime("");
      setIsExpanded(false);
    }
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
        "group flex flex-col gap-3 rounded-xl border transition-all duration-200",
        isExpanded 
          ? "border-primary/50 bg-card shadow-sm p-4" 
          : "border-transparent bg-muted/30 p-2 hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors",
            isExpanded ? "bg-primary/10" : "bg-transparent"
          )}
        >
          <Plus className={cn("size-5", isExpanded ? "text-primary" : "text-muted-foreground")} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task..."
          className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none md:text-base"
        />

        {isExpanded && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleSubmit} 
            disabled={!value.trim()}
            className="size-8 rounded-full text-primary hover:bg-primary/10"
          >
            <SendHorizontal className="size-5" />
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="flex items-center justify-between pl-11 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as Priority)}
            >
              <SelectTrigger className="h-8 w-fit gap-2 border-none bg-muted/50 px-2 text-xs hover:bg-muted">
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
                  "h-8 w-[40px] rounded-md bg-muted/50 pl-8 text-[10px] outline-none transition-all hover:bg-muted md:w-[180px] md:text-xs",
                  startTime ? "w-[140px] md:w-[180px]" : "md:w-[130px]"
                )}
              />
            </div>
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
      )}
    </div>
  );
}