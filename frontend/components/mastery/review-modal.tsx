"use client";

import { useState } from "react";
import { LeetCodeProblem } from "@/types";
import { useReviewProblem } from "@/hooks/use-leetcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  problem: LeetCodeProblem;
  open: boolean;
  onClose: () => void;
}

const scoreOptions = [
  { value: 1, label: "Forgot", color: "hover:border-red-500" },
  { value: 2, label: "Struggled", color: "hover:border-orange-500" },
  { value: 3, label: "Hesitant", color: "hover:border-yellow-500" },
  { value: 4, label: "Confident", color: "hover:border-blue-500" },
  { value: 5, label: "Perfect", color: "hover:border-green-500" },
];

export function ReviewModal({ problem, open, onClose }: ReviewModalProps) {
  const [score, setScore] = useState<number | null>(null);
  const [insightNote, setInsightNote] = useState(problem.insight_note || "");
  const reviewMutation = useReviewProblem();

  const handleSubmit = async () => {
    if (score === null) return;
    await reviewMutation.mutateAsync({
      id: problem.id,
      dto: { score, insight_note: insightNote.trim() || undefined },
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-lg font-medium">{problem.title}</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">How well did you do?</Label>
            <div className="flex gap-2">
              {scoreOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setScore(opt.value)}
                  className={cn(
                    "flex-1 py-3 px-1 rounded-md border text-xs font-medium transition-all",
                    opt.color,
                    score === opt.value ? "bg-primary text-primary-foreground border-primary" : "bg-card"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Insight Note</Label>
            <Textarea
              value={insightNote}
              onChange={(e) => setInsightNote(e.target.value)}
              placeholder="Key takeaway..."
              className="resize-none h-32 focus-visible:ring-1"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              disabled={score === null || reviewMutation.isPending}
              className="flex-1"
            >
              {reviewMutation.isPending ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}