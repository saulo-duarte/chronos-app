"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeetCodeProblem } from "@/types";
import { useReviewProblem } from "@/hooks/use-leetcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Save, AlertCircle } from "lucide-react";
import { reviewSchema, ReviewSchema } from "@/schemas/leetcode";

interface ReviewModalProps {
  problem: LeetCodeProblem;
  open: boolean;
  onClose: () => void;
}

const scoreOptions = [
  {
    value: 1,
    label: "Forgot",
    color: "hover:bg-red-500/10 hover:text-red-500 border-red-500/20",
    active: "bg-red-500 text-white border-red-500",
  },
  {
    value: 2,
    label: "Hard",
    color: "hover:bg-orange-500/10 hover:text-orange-500 border-orange-500/20",
    active: "bg-orange-500 text-white border-orange-500",
  },
  {
    value: 3,
    label: "Ok",
    color: "hover:bg-yellow-500/10 hover:text-yellow-500 border-yellow-500/20",
    active: "bg-yellow-500 text-black border-yellow-500",
  },
  {
    value: 4,
    label: "Good",
    color: "hover:bg-blue-500/10 hover:text-blue-500 border-blue-500/20",
    active: "bg-blue-500 text-white border-blue-500",
  },
  {
    value: 5,
    label: "Easy",
    color: "hover:bg-green-500/10 hover:text-green-500 border-green-500/20",
    active: "bg-green-500 text-white border-green-500",
  },
];

export function ReviewModal({ problem, open, onClose }: ReviewModalProps) {
  const reviewMutation = useReviewProblem();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      score: 0,
      insight_note: problem.insight_note || "",
    },
  });

  const selectedScore = watch("score");

  useEffect(() => {
    if (open) {
      reset({
        score: 0,
        insight_note: problem.insight_note || "",
      });
    }
  }, [open, problem, reset]);

  const onSubmit: SubmitHandler<ReviewSchema> = async (data) => {
    await reviewMutation.mutateAsync({
      id: problem.id,
      dto: data,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] p-0 bg-[#282828] border-[#333] text-[#eff1f6]">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle className="size-5 text-orange-500" />
            Rate Performance
          </DialogTitle>
          <p className="text-sm text-gray-400 mt-1">{problem.title}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          <div className="space-y-4">
            <Label className="text-xs uppercase font-bold tracking-wider text-gray-500">
              How was the recall?
            </Label>
            <div className="flex gap-2">
              {scoreOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setValue("score", opt.value, { shouldValidate: true })
                  }
                  className={cn(
                    "flex-1 py-2.5 rounded border border-[#444] text-[13px] font-medium transition-all duration-200 bg-[#1a1a1a]",
                    selectedScore === opt.value
                      ? opt.active
                      : cn("text-gray-400", opt.color),
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {errors.score && (
              <p className="text-xs text-destructive">{errors.score.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-xs uppercase font-bold tracking-wider text-gray-500">
              Refined Insight
            </Label>
            <Textarea
              {...register("insight_note")}
              placeholder="What did you learn this time? Update the key takeaway..."
              className="resize-none h-32 bg-[#1a1a1a] border-[#444] focus-visible:ring-1 focus-visible:ring-orange-500 text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1 border border-[#444] text-gray-400 hover:bg-[#333] hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || reviewMutation.isPending}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold gap-2"
            >
              {reviewMutation.isPending ? (
                "Syncing..."
              ) : (
                <>
                  <Save className="size-4" /> Finish
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
