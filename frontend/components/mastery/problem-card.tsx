"use client";

import { LeetCodeProblem, Difficulty, Pattern } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProblemCardProps {
  problem: LeetCodeProblem;
  onReview: () => void;
}

const difficultyColors: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-500 border-green-500/20",
  Medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  Hard: "bg-red-500/10 text-red-500 border-red-500/20",
};

const patternColors: Record<Pattern, string> = {
  "Sliding Window": "bg-blue-500/10 text-blue-400",
  "Two Pointers": "bg-purple-500/10 text-purple-400",
  "Fast & Slow Pointers": "bg-indigo-500/10 text-indigo-400",
  "Merge Intervals": "bg-pink-500/10 text-pink-400",
  "Cyclic Sort": "bg-cyan-500/10 text-cyan-400",
  "In-place Reversal": "bg-teal-500/10 text-teal-400",
  "BFS": "bg-emerald-500/10 text-emerald-400",
  "DFS": "bg-lime-500/10 text-lime-400",
  "Two Heaps": "bg-orange-500/10 text-orange-400",
  "Subsets": "bg-amber-500/10 text-amber-400",
  "Binary Search": "bg-rose-500/10 text-rose-400",
  "Top K Elements": "bg-fuchsia-500/10 text-fuchsia-400",
  "K-way Merge": "bg-violet-500/10 text-violet-400",
  "Backtracking": "bg-sky-500/10 text-sky-400",
  "Dynamic Programming": "bg-blue-600/10 text-blue-300",
  "Greedy": "bg-green-600/10 text-green-300",
  "Graphs": "bg-purple-600/10 text-purple-300",
  "Trie": "bg-pink-600/10 text-pink-300",
  "Topological Sort": "bg-indigo-600/10 text-indigo-300",
  "Union Find": "bg-cyan-600/10 text-cyan-300",
  "Monotonic Stack": "bg-teal-600/10 text-teal-300",
  "Bit Manipulation": "bg-orange-600/10 text-orange-300",
};

export function ProblemCard({ problem, onReview }: ProblemCardProps) {
  const [showInsight, setShowInsight] = useState(false);

  const getScoreEmoji = (score: number) => {
    if (score === 0) return "🆕";
    if (score === 1) return "😰";
    if (score === 2) return "😕";
    if (score === 3) return "😐";
    if (score === 4) return "😊";
    if (score === 5) return "🎯";
    return "❓";
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{problem.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant="outline"
                className={cn("text-xs font-medium", difficultyColors[problem.difficulty])}
              >
                {problem.difficulty}
              </Badge>
              <span className="text-xl" title={`Last score: ${problem.last_score}`}>
                {getScoreEmoji(problem.last_score)}
              </span>
            </div>
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>

        {/* Pattern Badge */}
        <div>
          <Badge className={cn("text-xs font-medium", patternColors[problem.pattern])}>
            {problem.pattern}
          </Badge>
        </div>

        {/* Insight Section */}
        {problem.insight_note && (
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInsight(!showInsight)}
              className="w-full justify-start gap-2 text-xs h-8"
            >
              <Eye className="size-3" />
              {showInsight ? "Ocultar Sacada" : "Ver Sacada"}
            </Button>
            {showInsight && (
              <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md border border-border/50">
                {problem.insight_note}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span>Intervalo: {problem.interval}d</span>
          <span>Ease: {problem.ease_factor.toFixed(2)}</span>
        </div>

        {/* Review Button */}
        <Button onClick={onReview} className="w-full gap-2" size="sm">
          <CheckCircle2 className="size-4" />
          Revisar Agora
        </Button>
      </div>
    </Card>
  );
}
