"use client";

import { LeetCodeProblem, Difficulty } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, EyeOff, CheckCircle2, Terminal, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ProblemReviewCardProps {
  problem: LeetCodeProblem;
  onReview: () => void;
}

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "text-[#00af9b]",
  Medium: "text-[#ffb800]",
  Hard: "text-[#ff2d55]",
};

export function ProblemReviewCard({ problem, onReview }: ProblemReviewCardProps) {
  const [showInsight, setShowInsight] = useState(false);

  return (
    <Card className="border-[#333] bg-[#282828] overflow-hidden shadow-2xl">
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className={cn("text-xs font-bold uppercase tracking-widest", difficultyStyles[problem.difficulty])}>
                {problem.difficulty}
              </span>
              <div className="size-1 rounded-full bg-gray-600" />
              <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                <Hash className="size-3" />
                {problem.pattern}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[#eff1f6] tracking-tight">{problem.title}</h2>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="border-[#444] bg-[#1a1a1a] hover:bg-[#333] text-gray-400"
          >
            <a href={problem.url} target="_blank" rel="noopener">
              <ExternalLink className="size-4 mr-2" /> 
              LeetCode
            </a>
          </Button>
        </div>

        <div className="relative group">
          <div className="absolute -top-3 left-4 px-2 bg-[#282828] text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <Terminal className="size-3" /> System Insight
          </div>
          <div className={cn(
            "rounded-lg border border-[#333] bg-[#1a1a1a] p-8 transition-all duration-300",
            !showInsight && "cursor-pointer hover:border-orange-500/50"
          )}
          onClick={() => !showInsight && setShowInsight(true)}
          >
            <div className="flex flex-col items-center justify-center min-h-[120px] space-y-4">
              {showInsight ? (
                <p className="text-[#eff1f6] text-center text-lg font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-2">
                  {problem.insight_note || "No custom logic recorded yet."}
                </p>
              ) : (
                <>
                  <EyeOff className="size-8 text-gray-700" />
                  <p className="text-sm text-gray-500 font-medium">Click to reveal the core strategy</p>
                </>
              )}
            </div>
          </div>
          {showInsight && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={(e) => { e.stopPropagation(); setShowInsight(false); }} 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-400 h-7"
            >
              Hide
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-0 border border-[#333] rounded-lg divide-x divide-[#333] bg-[#1a1a1a]">
          <div className="p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">Interval</p>
            <p className="text-sm font-mono text-white">{problem.interval}d</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">Ease</p>
            <p className="text-sm font-mono text-white">{problem.ease_factor.toFixed(2)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">Last</p>
            <p className="text-sm font-mono text-white">{problem.last_score || "—"}</p>
          </div>
        </div>

        <Button 
          onClick={onReview} 
          className="w-full h-14 text-sm font-bold bg-green-600 hover:bg-green-500 text-white rounded-md transition-all shadow-lg shadow-green-900/10"
        >
          <CheckCircle2 className="size-5 mr-2" /> MARK AS COMPLETED
        </Button>
      </div>
    </Card>
  );
}