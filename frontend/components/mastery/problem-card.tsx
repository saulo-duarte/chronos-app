"use client";

import { LeetCodeProblem, Difficulty } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Eye, CheckCircle2, Zap, Clock, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProblemCardProps {
  problem: LeetCodeProblem;
  onReview: () => void;
}

const difficultyColors: Record<Difficulty, string> = {
  Easy: "text-[#00af9b]",
  Medium: "text-[#ffb800]",
  Hard: "text-[#ff2d55]",
};

export function ProblemCard({ problem, onReview }: ProblemCardProps) {
  const [showInsight, setShowInsight] = useState(false);

  const getScoreStatus = (score: number) => {
    if (score >= 4) return { label: "Mastered", color: "bg-green-500/20 text-green-500" };
    if (score >= 2) return { label: "Reviewing", color: "bg-yellow-500/20 text-yellow-500" };
    return { label: "Learning", color: "bg-red-500/20 text-red-500" };
  };

  const status = getScoreStatus(problem.last_score);

  return (
    <Card className="border-[#333] bg-[#282828] shadow-2xl overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("text-xs font-bold tracking-wider uppercase", difficultyColors[problem.difficulty])}>
                {problem.difficulty}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-tight">{problem.pattern}</span>
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">{problem.title}</h2>
          </div>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-[#333] hover:bg-[#444] rounded-md transition-colors text-gray-400 hover:text-white"
          >
            <ExternalLink className="size-4" />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="size-3" />
              <span className="text-[10px] uppercase font-bold">Interval</span>
            </div>
            <p className="text-sm font-semibold text-white">{problem.interval} days</p>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <TrendingUp className="size-3" />
              <span className="text-[10px] uppercase font-bold">Ease</span>
            </div>
            <p className="text-sm font-semibold text-white">{problem.ease_factor.toFixed(2)}</p>
          </div>
          <div className="bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Zap className="size-3" />
              <span className="text-[10px] uppercase font-bold">Status</span>
            </div>
            <Badge className={cn("text-[10px] border-none px-2 h-5", status.color)}>
              {status.label}
            </Badge>
          </div>
        </div>

        {problem.insight_note && (
          <div className="space-y-3">
            <button
              onClick={() => setShowInsight(!showInsight)}
              className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-wider"
            >
              <Eye className="size-3" />
              {showInsight ? "Hide Solution Insight" : "Show Solution Insight"}
            </button>
            {showInsight && (
              <div className="text-sm leading-relaxed text-gray-300 bg-[#333] p-4 rounded-lg border-l-2 border-blue-500">
                {problem.insight_note}
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={onReview} 
          className="w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm gap-2"
        >
          <CheckCircle2 className="size-4" />
          Complete Review
        </Button>
      </div>
    </Card>
  );
}