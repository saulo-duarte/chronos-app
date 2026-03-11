"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  Plus,
  Link as LinkIcon,
  FileText,
  Check,
  Flag,
  Calendar as CalendarIcon,
  ChevronRight,
  Sparkles,
  Tag,
  UploadCloud,
  PenTool,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Priority, ResourceType } from "@/types";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  mobileQuickAddSchema,
  MobileQuickAddSchema,
  MobileTaskData,
} from "@/schemas/mobile-quick-add";

interface MobileQuickAddProps {
  onAddTask: (title: string, priority: Priority, date?: Date) => void;
  onAddResource: (
    title: string,
    path: string,
    type: ResourceType,
    tag?: string,
  ) => void;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  LOW: { label: "Low", color: "text-blue-400" },
  MEDIUM: { label: "Medium", color: "text-yellow-400" },
  HIGH: { label: "High", color: "text-red-400" },
};

export function MobileQuickAdd({
  onAddTask,
  onAddResource,
}: MobileQuickAddProps) {
  const { activeNav, contentType } = useDashboardStore();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"task" | "resource" | "drawing">("task");
  const [resType, setResType] = useState<ResourceType>("LINK");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCollectionId = activeNav.startsWith("collection-")
    ? activeNav.replace("collection-", "")
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<MobileQuickAddSchema>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(mobileQuickAddSchema) as any,
    defaultValues: {
      type: "task",
      title: "",
      priority: "MEDIUM",
    },
  });

  const formData = watch();
  const currentType = formData.type;
  const selectedPriority =
    currentType === "task" ? (formData as MobileTaskData).priority : "MEDIUM";

  useEffect(() => {
    const handleOpen = () => setOpen(true);
    window.addEventListener("open-quick-add", handleOpen);
    return () => window.removeEventListener("open-quick-add", handleOpen);
  }, []);

  useEffect(() => {
    if (open) {
      if (selectedCollectionId) {
        if (contentType === "drawings") {
          toggleMode("drawing");
        } else if (contentType === "resources") {
          toggleMode("resource");
        } else {
          toggleMode("task");
        }
      } else {
        toggleMode("task");
      }
    }
  }, [open, contentType, selectedCollectionId]);

  const onSubmit = (data: unknown) => {
    const validatedData = data as MobileQuickAddSchema;
    if (validatedData.type === "task") {
      onAddTask(
        validatedData.title,
        validatedData.priority,
        validatedData.date ? new Date(validatedData.date) : undefined,
      );
    } else {
      let path = validatedData.url ?? "";
      if (resType === "FILE") {
        path = selectedFile?.name ?? "uploaded-file";
      } else if (resType === "DRAWING") {
        path = JSON.stringify({ elements: [], appState: {} });
      }
      onAddResource(
        validatedData.title,
        path,
        validatedData.resourceType as ResourceType,
        validatedData.tag,
      );
    }
    setOpen(false);
    reset();
    setSelectedFile(null);
  };

  const toggleMode = useCallback(
    (newMode: "task" | "resource" | "drawing") => {
      setMode(newMode);
      if (newMode === "task") {
        setValue("type", "task");
      } else {
        setValue("type", "resource");
        if (newMode === "drawing") {
          setResType("DRAWING");
          setValue("resourceType", "DRAWING");
        } else {
          // Default to LINK if resource mode is clicked
          setResType("LINK");
          setValue("resourceType", "LINK");
        }
        if (selectedCollectionId) {
          setValue("collection_id", selectedCollectionId);
        }
      }
    },
    [selectedCollectionId, setValue],
  );

  const handleClose = () => {
    setOpen(false);
    reset();
    setSelectedFile(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="h-[100dvh] p-0 border-none bg-[#0f111a] text-white flex flex-col z-[100]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="rounded-full hover:bg-white/5"
          >
            <X className="size-5 text-muted-foreground" />
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-primary/50">
              Chronos
            </span>
            <span className="text-base font-bold">Quick Create</span>
          </div>
          <div className="size-10 invisible" />
        </header>

        {/* Mode Selector — only visible when in a collection */}
        {selectedCollectionId && (
          <div className="px-6 pt-6 pb-2 shrink-0">
            <div className="bg-[#1c1e2d] p-1 rounded-xl flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleMode("task")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
                  mode === "task"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                <Plus className="size-3.5" /> Task
              </button>
              <button
                type="button"
                onClick={() => toggleMode("resource")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
                  mode === "resource"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                <LinkIcon className="size-3.5" /> Resource
              </button>
              <button
                type="button"
                onClick={() => toggleMode("drawing")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200",
                  mode === "drawing"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-white",
                )}
              >
                <PenTool className="size-3.5" /> Quadro
              </button>
            </div>
          </div>
        )}

        {/* Form Content */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6"
        >
          <AnimatePresence mode="wait">
            {mode === "task" ? (
              <motion.div
                key="task-form"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    What needs to be done?
                  </label>
                  <Input
                    {...register("title")}
                    placeholder="e.g. Finish project report..."
                    className="h-12 text-base bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl"
                    autoFocus
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Flag className="size-4 text-muted-foreground" /> Priority
                  </label>
                  <div className="flex gap-2">
                    {(["LOW", "MEDIUM", "HIGH"] as Priority[]).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setValue("priority", p)}
                        className={cn(
                          "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-medium transition-all",
                          selectedPriority === p
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-[#1c1e2d]/40 border-white/8 text-muted-foreground hover:border-white/20",
                        )}
                      >
                        <span
                          className={cn(
                            "size-2 rounded-full inline-block",
                            PRIORITY_CONFIG[p].color.replace("text-", "bg-"),
                          )}
                        />
                        {PRIORITY_CONFIG[p].label}
                        {selectedPriority === p && (
                          <Check className="size-3 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <CalendarIcon className="size-4 text-muted-foreground" />{" "}
                    Due Date
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <Input
                    type="datetime-local"
                    {...(register as (name: string) => object)("date")}
                    className="h-12 bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl"
                  />
                </div>
              </motion.div>
            ) : mode === "resource" ? (
              <motion.div
                key="resource-form"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Resource Type Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Resource Type
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setResType("LINK");
                        setValue("resourceType", "LINK");
                      }}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2.5 py-4 rounded-xl border transition-all",
                        resType === "LINK"
                          ? "bg-blue-500/10 border-blue-500/70 text-white"
                          : "bg-[#1c1e2d]/40 border-white/8 text-muted-foreground hover:border-white/20",
                      )}
                    >
                      <LinkIcon
                        className={cn(
                          "size-5",
                          resType === "LINK" ? "text-blue-400" : "",
                        )}
                      />
                      <span className="text-sm font-semibold">Link</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setResType("FILE");
                        setValue("resourceType", "FILE");
                      }}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-2.5 py-4 rounded-xl border transition-all",
                        resType === "FILE"
                          ? "bg-purple-500/10 border-purple-500/70 text-white"
                          : "bg-[#1c1e2d]/40 border-white/8 text-muted-foreground hover:border-white/20",
                      )}
                    >
                      <FileText
                        className={cn(
                          "size-5",
                          resType === "FILE" ? "text-purple-400" : "",
                        )}
                      />
                      <span className="text-sm font-semibold">File</span>
                    </button>
                  </div>
                </div>

                {/* Resource Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Name
                  </label>
                  <Input
                    {...register("title")}
                    placeholder="e.g. System architecture diagram..."
                    className="h-12 text-base bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl"
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* URL or File Upload */}
                <AnimatePresence mode="wait">
                  {resType === "LINK" && (
                    <motion.div
                      key="link-input"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-foreground">
                        URL
                      </label>
                      <Input
                        {...(register as (name: string) => object)("url")}
                        placeholder="https://..."
                        className="h-12 text-sm bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl font-mono"
                      />
                    </motion.div>
                  )}
                  {resType === "FILE" && (
                    <motion.div
                      key="file-input"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="space-y-2"
                    >
                      <label className="text-sm font-semibold text-foreground">
                        File
                      </label>
                      {/* Hidden real input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setSelectedFile(file);
                        }}
                      />
                      {/* Custom clickable zone — NOT absolute */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={cn(
                          "w-full h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all",
                          selectedFile
                            ? "border-primary/60 bg-primary/5"
                            : "border-white/10 bg-[#1c1e2d]/20 hover:bg-[#1c1e2d]/40 hover:border-white/20",
                        )}
                      >
                        <UploadCloud
                          className={cn(
                            "size-6",
                            selectedFile
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}
                        />
                        <span className="text-xs text-muted-foreground text-center px-4">
                          {selectedFile
                            ? selectedFile.name
                            : "Tap to choose a file"}
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tag */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" /> Tag
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <Input
                    {...(register as (name: string) => object)("tag")}
                    placeholder="e.g. design, backend, reference..."
                    className="h-12 text-base bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="drawing-form"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-6"
              >
                {/* Resource Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Drawing Name
                  </label>
                  <Input
                    {...register("title")}
                    placeholder="e.g. Brainstorming session..."
                    className="h-12 text-base bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl"
                    autoFocus
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Tag */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" /> Tag
                    <span className="text-xs text-muted-foreground font-normal">
                      (optional)
                    </span>
                  </label>
                  <Input
                    {...(register as (name: string) => object)("tag")}
                    placeholder="e.g. ideas, draft, final..."
                    className="h-12 text-base bg-[#1c1e2d]/60 border-white/8 focus:border-primary/60 rounded-xl"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <div className="mt-auto pt-4 pb-10 shrink-0">
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl font-bold text-base shadow-xl shadow-primary/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="size-4" />
              {mode === "task"
                ? "Create Task"
                : mode === "drawing"
                  ? "Create Drawing"
                  : "Add Resource"}
              <ChevronRight className="size-4 opacity-60" />
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
