"use client";

import { useState, useMemo } from "react";
import { useDueProblems, useLeetCodeProblems } from "@/hooks/use-leetcode";
import { LeetCodeProblem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Play, ExternalLink, X, Brain, LayoutGrid, Calendar } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ProblemReviewCard } from "./problem-review-card";
import { ReviewModal } from "./review-modal";
import { CreateProblemModal } from "./create-problem-modal";
import { cn } from "@/lib/utils";

export function MasteryQueue() {
  const { data: dueProblems = [], isLoading: loadingDue } = useDueProblems();
  const { data: allProblems = [], isLoading: loadingAll } = useLeetCodeProblems();
  
  const [activeTab, setActiveTab] = useState<string>("queue");
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [reviewQueue, setReviewQueue] = useState<LeetCodeProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<LeetCodeProblem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const sortedDueProblems = useMemo(() => {
    return [...dueProblems].sort((a, b) => {
      if (a.ease_factor !== b.ease_factor) return a.ease_factor - b.ease_factor;
      return a.interval - b.interval;
    });
  }, [dueProblems]);

  const sortedAllProblems = useMemo(() => {
    return [...allProblems].sort((a, b) => a.title.localeCompare(b.title));
  }, [allProblems]);

  const shuffleWeighted = (problems: LeetCodeProblem[]) => {
    return [...problems]
      .map((problem) => {
        let weight = (5 - problem.ease_factor) * 10;
        weight += (30 - Math.min(problem.interval, 30));
        if (problem.last_score <= 1) weight *= 2;
        const sortValue = Math.pow(Math.random(), 1 / Math.max(weight, 0.1));
        return { problem, sortValue };
      })
      .sort((a, b) => b.sortValue - a.sortValue)
      .map((item) => item.problem);
  };

  const handleStartReview = () => {
    if (dueProblems.length > 0) {
      setReviewQueue(shuffleWeighted(dueProblems));
      setIsReviewMode(true);
      setCurrentProblemIndex(0);
    }
  };

  const handleReviewSpecific = (problem: LeetCodeProblem) => {
    setReviewQueue([problem]);
    setIsReviewMode(true);
    setCurrentProblemIndex(0);
  };

  const handleOpenReviewModal = () => {
    const current = reviewQueue[currentProblemIndex];
    if (current) {
      setSelectedProblem(current);
      setIsReviewOpen(true);
    }
  };

  const handleCloseReview = () => {
    setIsReviewOpen(false);
    if (currentProblemIndex < reviewQueue.length - 1) {
      setCurrentProblemIndex(currentProblemIndex + 1);
    } else {
      setIsReviewMode(false);
      setReviewQueue([]);
    }
    setSelectedProblem(null);
  };

  if (loadingDue || loadingAll) {
    return (
      <div className="flex h-full items-center justify-center bg-[#1a1a1a]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#1a1a1a] text-[#eff1f6] overflow-hidden font-sans">
      <header className="px-8 py-4 border-b border-[#333] shrink-0 bg-[#282828]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded bg-orange-500/10 text-orange-500">
                <Brain className="size-5" />
              </div>
              <h1 className="text-lg font-semibold tracking-tight">Mastery Queue</h1>
            </div>
            
            {!isReviewMode && (
              <nav className="flex items-center gap-1">
                <button 
                  onClick={() => setActiveTab("queue")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    activeTab === "queue" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  Problems
                </button>
                <button 
                  onClick={() => setActiveTab("all")}
                  className={cn(
                    "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    activeTab === "all" ? "bg-[#333] text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  Library
                </button>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setIsCreateOpen(true)} 
              size="sm" 
              className="bg-[#333] hover:bg-[#404040] text-white border-none gap-2 h-8 px-4"
            >
              <Plus className="size-4" /> New
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0">
        {isReviewMode ? (
          <ScrollArea className="h-full">
            <div className="max-w-3xl mx-auto py-12 px-6 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="text-xs font-medium text-gray-500 uppercase tracking-widest">
                    Session Progress
                  </div>
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-none px-2 py-0">
                    {currentProblemIndex + 1} / {reviewQueue.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsReviewMode(false)} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 gap-2">
                  <X className="size-4" /> Exit
                </Button>
              </div>
              
              <div className="w-full h-1 bg-[#333] rounded-full">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${((currentProblemIndex + 1) / reviewQueue.length) * 100}%` }}
                />
              </div>

              {reviewQueue[currentProblemIndex] && (
                <ProblemReviewCard
                  problem={reviewQueue[currentProblemIndex]}
                  onReview={handleOpenReviewModal}
                />
              )}
            </div>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-full">
            <div className="max-w-6xl mx-auto p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="size-4" />
                    <span>{dueProblems.length} due today</span>
                  </div>
                  <div className="h-4 w-[1px] bg-gray-700" />
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <LayoutGrid className="size-4" />
                    <span>{allProblems.length} total</span>
                  </div>
                </div>
                {activeTab === "queue" && dueProblems.length > 0 && (
                   <Button onClick={handleStartReview} className="bg-green-600 hover:bg-green-500 text-white gap-2 rounded-md px-6 shadow-lg shadow-green-900/20">
                    <Play className="size-4 fill-current" /> Start Session
                  </Button>
                )}
              </div>

              <div className="bg-[#282828] border border-[#333] rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_120px_150px_120px] px-6 py-3 border-b border-[#333] text-[12px] font-medium text-gray-500 uppercase tracking-wider">
                  <div>Title</div>
                  <div>Difficulty</div>
                  <div>Pattern</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-[#333]">
                  {(activeTab === "queue" ? sortedDueProblems : sortedAllProblems).map((problem) => (
                    <ProblemItem 
                      key={problem.id} 
                      problem={problem} 
                      onReview={() => handleReviewSpecific(problem)} 
                    />
                  ))}
                  
                  {(activeTab === "queue" ? dueProblems : allProblems).length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                       <Trophy className="size-8 mx-auto mb-3 opacity-20" />
                       <p>No problems found in this section</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </div>

      {selectedProblem && (
        <ReviewModal
          problem={selectedProblem}
          open={isReviewOpen}
          onClose={handleCloseReview}
        />
      )}
      <CreateProblemModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

function ProblemItem({ problem, onReview }: { problem: LeetCodeProblem, onReview: () => void }) {
  return (
    <div className="grid grid-cols-[1fr_120px_150px_120px] items-center px-6 py-3 hover:bg-[#333] transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <h3 className="text-[14px] font-medium text-[#eff1f6] truncate group-hover:text-blue-400 transition-colors">
          {problem.title}
        </h3>
        <a 
          href={problem.url} 
          target="_blank" 
          rel="noopener" 
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all"
        >
          <ExternalLink className="size-3" />
        </a>
      </div>

      <div>
        <span className={cn(
          "text-[12px] font-medium",
          problem.difficulty === "Easy" && "text-[#00af9b]",
          problem.difficulty === "Medium" && "text-[#ffb800]",
          problem.difficulty === "Hard" && "text-[#ff2d55]"
        )}>
          {problem.difficulty}
        </span>
      </div>

      <div className="truncate">
        <Badge variant="outline" className="text-[10px] font-normal border-[#444] text-gray-400 bg-transparent">
          {problem.pattern}
        </Badge>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onReview}
          className="h-7 text-[12px] text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-3"
        >
          Review
        </Button>
      </div>
    </div>
  );
}