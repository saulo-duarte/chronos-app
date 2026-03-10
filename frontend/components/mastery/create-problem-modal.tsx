"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeetCodeProblem } from "@/types";
import { useCreateProblem, useUpdateProblem } from "@/hooks/use-leetcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Sparkles, Terminal, Layers, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createLeetCodeProblemSchema,
  CreateLeetCodeProblemSchema,
  patternSchema,
  difficultySchema,
} from "@/schemas/leetcode";

interface ProblemModalProps {
  open: boolean;
  onClose: () => void;
  problem?: LeetCodeProblem | null;
}

const patterns = patternSchema.options;
const difficulties = difficultySchema.options;

export function ProblemModal({ open, onClose, problem }: ProblemModalProps) {
  const createMutation = useCreateProblem();
  const updateMutation = useUpdateProblem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateLeetCodeProblemSchema>({
    resolver: zodResolver(createLeetCodeProblemSchema),
    defaultValues: {
      title: "",
      url: "",
      pattern: "Sliding Window",
      difficulty: "Medium",
      insight_note: "",
    },
  });

  const selectedPattern = watch("pattern");
  const selectedDifficulty = watch("difficulty");

  useEffect(() => {
    if (problem && open) {
      reset({
        title: problem.title,
        url: problem.url,
        pattern: problem.pattern,
        difficulty: problem.difficulty,
        insight_note: problem.insight_note || "",
      });
    } else if (open) {
      reset({
        title: "",
        url: "",
        pattern: "Sliding Window",
        difficulty: "Medium",
        insight_note: "",
      });
    }
  }, [problem, open, reset]);

  const onSubmit: SubmitHandler<CreateLeetCodeProblemSchema> = async (data) => {
    if (problem) {
      await updateMutation.mutateAsync({ id: problem.id, dto: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl bg-[#282828] border-[#333] text-[#eff1f6] p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-[#333]/30 border-b border-[#333]">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            {problem ? (
              <Save className="size-5 text-blue-500" />
            ) : (
              <Terminal className="size-5 text-orange-500" />
            )}
            {problem ? "Edit Challenge" : "New Challenge"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2"
            >
              Problem Title
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g. 3Sum"
              className="bg-[#1a1a1a] border-[#444] focus-visible:ring-orange-500/50 h-10 text-sm"
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2"
            >
              <Link2 className="size-3" /> Source URL
            </Label>
            <Input
              id="url"
              type="url"
              {...register("url")}
              placeholder="https://leetcode.com/problems/..."
              className="bg-[#1a1a1a] border-[#444] focus-visible:ring-orange-500/50 h-10 text-sm font-mono"
              disabled={isPending}
            />
            {errors.url && (
              <p className="text-xs text-destructive">{errors.url.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="pattern"
                className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2"
              >
                <Layers className="size-3" /> Pattern
              </Label>
              <Select
                value={selectedPattern}
                onValueChange={(value) => setValue("pattern", value as any)}
                disabled={isPending}
              >
                <SelectTrigger
                  id="pattern"
                  className="bg-[#1a1a1a] border-[#444] h-10 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#444] text-[#eff1f6]">
                  {patterns.map((pattern) => (
                    <SelectItem
                      key={pattern}
                      value={pattern}
                      className="focus:bg-orange-500/10 focus:text-orange-500 cursor-pointer"
                    >
                      {pattern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="difficulty"
                className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2"
              >
                Difficulty
              </Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value) => setValue("difficulty", value as any)}
                disabled={isPending}
              >
                <SelectTrigger
                  id="difficulty"
                  className="bg-[#1a1a1a] border-[#444] h-10 text-sm"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#444] text-[#eff1f6]">
                  {difficulties.map((diff) => (
                    <SelectItem
                      key={diff}
                      value={diff}
                      className={cn(
                        "focus:bg-opacity-10 cursor-pointer",
                        diff === "Easy" && "text-[#00af9b] focus:bg-[#00af9b]",
                        diff === "Medium" &&
                          "text-[#ffb800] focus:bg-[#ffb800]",
                        diff === "Hard" && "text-[#ff2d55] focus:bg-[#ff2d55]",
                      )}
                    >
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="insight_note"
              className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="size-3 text-orange-500" /> Key Insight
              </span>
            </Label>
            <Textarea
              id="insight_note"
              {...register("insight_note")}
              placeholder="Record the 'aha!' moment..."
              className="bg-[#1a1a1a] border-[#444] focus-visible:ring-orange-500/50 min-h-[120px] resize-none text-sm leading-relaxed"
              disabled={isPending}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-[#333]"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className={cn(
                "text-white",
                problem
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-orange-500 hover:bg-orange-600",
              )}
            >
              {isPending
                ? problem
                  ? "Saving..."
                  : "Integrating..."
                : problem
                  ? "Save Changes"
                  : "Add to Library"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
