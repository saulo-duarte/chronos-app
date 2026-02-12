"use client";

import { LeetCodeProblem, Difficulty } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProblemReviewCardProps {
  problem: LeetCodeProblem;
  onReview: () => void;
}

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "text-green-600 bg-green-50 border-green-100",
  Medium: "text-yellow-600 bg-yellow-50 border-yellow-100",
  Hard: "text-red-600 bg-red-50 border-red-100",
};

export function ProblemReviewCard({ problem, onReview }: ProblemReviewCardProps) {
  const [showInsight, setShowInsight] = useState(false);

  return (
    <Card className="p-8 border-2">
      <div className="space-y-8">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Badge variant="outline" className={cn("font-medium", difficultyStyles[problem.difficulty])}>
                {problem.difficulty}
              </Badge>
              <Badge variant="secondary" className="font-medium">
                {problem.pattern}
              </Badge>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight leading-none">{problem.title}</h2>
          </div>
          <Button variant="outline" size="icon" asChild className="rounded-full">
            <a href={problem.url} target="_blank" rel="noopener">
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>

        <div className="bg-muted/30 rounded-xl p-6 border border-dashed">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Insight</span>
            <Button variant="ghost" size="sm" onClick={() => setShowInsight(!showInsight)} className="h-8 text-xs">
              <Eye className="size-3 mr-2" />
              {showInsight ? "Hide" : "Reveal"}
            </Button>
          </div>
          <div className="min-h-[100px] flex items-center justify-center text-center">
            {showInsight ? (
              <p className="text-lg font-medium animate-in fade-in duration-300">
                {problem.insight_note || "No insight recorded for this problem."}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Insight is hidden. Focus on the solution first.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase mb-1">Interval</p>
            <p className="font-medium">{problem.interval} days</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase mb-1">Ease Factor</p>
            <p className="font-medium">{problem.ease_factor.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase mb-1">Last Score</p>
            <p className="font-medium">{problem.last_score || "New"}</p>
          </div>
        </div>

        <Button onClick={onReview} className="w-full h-12 text-base font-medium" size="lg">
          <CheckCircle2 className="size-5 mr-2" /> Complete & Rate
        </Button>
      </div>
    </Card>
  );
}