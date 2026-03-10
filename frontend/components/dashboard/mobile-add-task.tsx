"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Calendar as CalendarIcon } from "lucide-react";
import { Priority } from "@/types";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { z } from "zod";

const quickAddSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  url: z.string(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  date: z.string(),
});

type QuickAddSchema = z.infer<typeof quickAddSchema>;

interface MobileAddTaskProps {
  onAddTask: (title: string, priority: Priority, date?: Date) => void;
  onAddResource?: (title: string, url: string) => void;
}

export function MobileAddTask({
  onAddTask,
  onAddResource,
}: MobileAddTaskProps) {
  const { isPickerOpen, contentType } = useDashboardStore();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<QuickAddSchema>({
    resolver: zodResolver(quickAddSchema),
    defaultValues: {
      title: "",
      url: "",
      priority: "MEDIUM",
      date: "",
    },
  });

  const priority = watch("priority");
  const isResourceMode = contentType === "resources" && !isPickerOpen;

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-quick-add", handleOpen);
    return () => window.removeEventListener("open-quick-add", handleOpen);
  }, []);

  const onSubmit: SubmitHandler<QuickAddSchema> = (data) => {
    if (isResourceMode && onAddResource) {
      if (!data.url) return;
      onAddResource(data.title.trim(), data.url.trim());
    } else {
      onAddTask(
        data.title.trim(),
        data.priority as Priority,
        data.date ? new Date(data.date) : undefined,
      );
    }

    reset();
    setOpen(false);
  };

  const priorityColors = {
    LOW: "text-blue-500",
    MEDIUM: "text-yellow-500",
    HIGH: "text-red-500",
  };

  return (
    <div className="md:hidden fixed bottom-32 right-6 z-[80]">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[32px] p-6 pb-12 min-h-[40vh] max-h-[90vh] flex flex-col gap-6 bg-background border-t-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100] transition-transform duration-500 ease-out"
          onPointerDownOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>
              {isPickerOpen
                ? "Nova Coleção"
                : isResourceMode
                  ? "Novo Recurso"
                  : "Nova Task"}
            </SheetTitle>
          </SheetHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isPickerOpen
                  ? "Nome da coleção"
                  : isResourceMode
                    ? "Nome do recurso"
                    : "O que precisa ser feito?"}
              </label>
              <Input
                {...register("title")}
                placeholder={
                  isPickerOpen
                    ? "Ex: Trabalho, Estudo..."
                    : isResourceMode
                      ? "Ex: Guia do Projeto"
                      : "Ex: Finalizar planejamento"
                }
                className="h-12 text-base"
              />
              {errors.title && (
                <p className="text-xs text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {isResourceMode && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Link (URL)</label>
                <Input
                  {...register("url")}
                  placeholder="https://..."
                  className="h-12 text-base"
                />
              </div>
            )}

            {!isPickerOpen && !isResourceMode && (
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">Prioridade</label>
                  <Select
                    value={priority}
                    onValueChange={(v) => setValue("priority", v as Priority)}
                  >
                    <SelectTrigger className="h-12 w-full">
                      <div className="flex items-center gap-2">
                        <Flag
                          className={cn(
                            "size-4",
                            priorityColors[priority as Priority],
                          )}
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
                      {...register("date")}
                      className="h-12 pl-9 w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={!isValid || (isResourceMode && !watch("url")?.trim())}
              className="w-full h-12 text-base mt-4"
            >
              {isPickerOpen
                ? "Criar Coleção"
                : isResourceMode
                  ? "Salvar Recurso"
                  : "Criar Task"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
