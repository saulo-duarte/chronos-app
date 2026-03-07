"use client";

import { useState } from "react";
import { Plus, Flag, Calendar as CalendarIcon } from "lucide-react";
import { Priority } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { cn } from "@/lib/utils";

interface MobileAddTaskProps {
  onAddTask: (title: string, priority: Priority, date?: Date) => void;
}

export function MobileAddTask({ onAddTask }: MobileAddTaskProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAddTask(title.trim(), priority, date ? new Date(date) : undefined);
    setTitle("");
    setPriority("MEDIUM");
    setDate("");
    setOpen(false);
  };

  const priorityColors = {
    LOW: "text-blue-500",
    MEDIUM: "text-yellow-500",
    HIGH: "text-red-500",
  };

  return (
    <div className="md:hidden fixed bottom-24 right-6 z-[70]">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            size="icon"
            className="size-16 rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 transition-all bg-primary text-primary-foreground ring-4 ring-primary/20"
          >
            <Plus className="size-8" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="rounded-t-[32px] p-6 pb-12 min-h-[50vh] max-h-[90vh] flex flex-col gap-6 bg-background border-t-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out"
        >
          <SheetHeader>
            <SheetTitle>Nova Task</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                O que precisa ser feito?
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Finalizar planejamento"
                className="h-12 text-base"
                autoFocus={false}
              />
            </div>

            <div className="flex gap-4">
              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">Prioridade</label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
                >
                  <SelectTrigger className="h-12">
                    <div className="flex items-center gap-2">
                      <Flag
                        className={cn("size-4", priorityColors[priority])}
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1">
                <label className="text-sm font-medium">
                  Data/Hora (Opcional)
                </label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-12 pl-9 w-full"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="w-full h-12 text-base mt-4"
            >
              Criar Task
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
