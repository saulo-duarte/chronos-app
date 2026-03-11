import { LeetCodeProblem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ProblemReviewCard } from "./problem-review-card";

interface MasteryReviewSessionProps {
  reviewQueue: LeetCodeProblem[];
  currentIndex: number;
  onExit: () => void;
  onReview: () => void;
}

export function MasteryReviewSession({
  reviewQueue,
  currentIndex,
  onExit,
  onReview,
}: MasteryReviewSessionProps) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">
            Session Progress
          </div>
          <Badge
            variant="outline"
            className="bg-orange-500/10 text-orange-500 border-none px-2 py-0"
          >
            {currentIndex + 1} / {reviewQueue.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 gap-2"
        >
          <X className="size-4" /> Exit
        </Button>
      </div>

      <div className="w-full h-1 bg-[#333] rounded-full">
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{
            width: `${((currentIndex + 1) / reviewQueue.length) * 100}%`,
          }}
        />
      </div>

      {reviewQueue[currentIndex] && (
        <ProblemReviewCard
          problem={reviewQueue[currentIndex]}
          onReview={onReview}
        />
      )}
    </div>
  );
}
