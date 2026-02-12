"use client";

import { useState, useMemo } from "react";
import { useDueProblems, useLeetCodeProblems } from "@/hooks/use-leetcode";
import { LeetCodeProblem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Play, ExternalLink, X, Brain, List as ListIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-background text-foreground overflow-hidden">
      <header className="px-6 py-6 border-b shrink-0 bg-card/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Brain className="size-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Mastery System</h1>
                <p className="text-sm text-muted-foreground">
                  {dueProblems.length} due for review • {allProblems.length} total problems
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setIsCreateOpen(true)} size="sm" variant="outline" className="gap-2">
                <Plus className="size-4" /> New Problem
              </Button>
            </div>
          </div>

          {!isReviewMode && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-muted/50">
                <TabsTrigger value="queue" className="gap-2">
                  <Play className="size-4" /> Queue
                </TabsTrigger>
                <TabsTrigger value="all" className="gap-2">
                  <ListIcon className="size-4" /> All Problems
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>
      </header>

      <div className="flex-1 min-h-0 bg-muted/10">
        {isReviewMode ? (
          <ScrollArea className="h-full">
            <div className="max-w-2xl mx-auto py-12 px-6 space-y-8 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary/70">Session Progress</span>
                  <div className="text-sm font-medium text-muted-foreground">
                    Problem {currentProblemIndex + 1} of {reviewQueue.length}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsReviewMode(false)} className="hover:bg-destructive/10 hover:text-destructive gap-2">
                  <X className="size-4" /> End Session
                </Button>
              </div>
              
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-700 ease-out"
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
            <div className="max-w-5xl mx-auto p-6">
              {activeTab === "queue" ? (
                <div className="space-y-6">
                  {dueProblems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Trophy className="size-10 text-primary" />
                      </div>
                      <h2 className="text-2xl font-bold">Queue Cleared! 🎉</h2>
                      <p className="text-muted-foreground mt-2 mb-8 max-w-sm">
                        You ve completed all your reviews for today. Great job keeping up with your learning!
                      </p>
                      <Button onClick={() => setActiveTab("all")} variant="secondary" className="rounded-full px-8">
                        View All Problems
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                          Daily Review <Badge variant="secondary" className="rounded-full">{dueProblems.length}</Badge>
                        </h2>
                        <Button onClick={handleStartReview} className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20">
                          <Play className="size-4 fill-current" /> Start Session
                        </Button>
                      </div>

                      <div className="grid gap-3">
                        {sortedDueProblems.map((problem) => (
                          <ProblemItem 
                            key={problem.id} 
                            problem={problem} 
                            onReview={() => handleReviewSpecific(problem)} 
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold">
                      Library <Badge variant="outline" className="ml-2 font-mono">{allProblems.length}</Badge>
                    </h2>
                  </div>
                  
                  {allProblems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed rounded-3xl">
                      <Plus className="size-12 text-muted-foreground/30 mb-4" />
                      <h3 className="text-lg font-medium">No problems yet</h3>
                      <p className="text-muted-foreground mt-1 mb-6">Start your journey by adding your first LeetCode problem.</p>
                      <Button onClick={() => setIsCreateOpen(true)} variant="outline">
                        Add Problem
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-3">
                      {sortedAllProblems.map((problem) => (
                        <ProblemItem 
                          key={problem.id} 
                          problem={problem} 
                          onReview={() => handleReviewSpecific(problem)} 
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
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
    <div className="group flex items-center justify-between p-4 rounded-2xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200">
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-3 mb-1.5 font-medium">
          <h3 className="truncate group-hover:text-primary transition-colors">{problem.title}</h3>
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px] uppercase font-bold px-2 py-0 border-none bg-muted/50",
              problem.difficulty === "Easy" && "text-green-500 bg-green-500/5",
              problem.difficulty === "Medium" && "text-yellow-500 bg-yellow-500/5",
              problem.difficulty === "Hard" && "text-red-500 bg-red-500/5"
            )}
          >
            {problem.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider">
          <span className="flex items-center gap-1.5"><Brain className="size-3" /> {problem.pattern}</span>
          <span className="flex items-center gap-1.5 opacity-60">Next: {problem.interval}d</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
        <a 
          href={problem.url} 
          target="_blank" 
          rel="noopener" 
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
          title="Open in LeetCode"
        >
          <ExternalLink className="size-4" />
        </a>
        <Button size="sm" onClick={onReview} className="rounded-full px-5 font-bold">
          Review
        </Button>
      </div>
    </div>
  );
}