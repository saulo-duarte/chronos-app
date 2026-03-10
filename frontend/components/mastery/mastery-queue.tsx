"use client";

import { useState, useMemo } from "react";
import {
  useDueProblems,
  useLeetCodeProblems,
  useDeleteProblem,
} from "@/hooks/use-leetcode";
import { LeetCodeProblem } from "@/types";
import { Button } from "@/components/ui/button";
import { Play, Calendar, LayoutGrid } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MasteryHeader } from "./mastery-header";
import { MasteryProblemTable } from "./mastery-problem-table";
import { MasteryReviewSession } from "./mastery-review-session";
import { ReviewModal } from "./review-modal";
import { ProblemModal } from "./create-problem-modal";

export function MasteryQueue() {
  const { data: dueProblems = [], isLoading: loadingDue } = useDueProblems();
  const { data: allProblems = [], isLoading: loadingAll } =
    useLeetCodeProblems();

  const [activeTab, setActiveTab] = useState<string>("queue");
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [reviewQueue, setReviewQueue] = useState<LeetCodeProblem[]>([]);
  const [selectedProblem, setSelectedProblem] =
    useState<LeetCodeProblem | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<LeetCodeProblem | null>(
    null,
  );

  const deleteProblemMutation = useDeleteProblem();

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
        weight += 30 - Math.min(problem.interval, 30);
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
      <MasteryHeader
        activeTab={activeTab}
        isReviewMode={isReviewMode}
        onTabChange={setActiveTab}
        onNewProblem={() => {
          setEditingProblem(null);
          setIsModalOpen(true);
        }}
      />

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          {isReviewMode ? (
            <MasteryReviewSession
              reviewQueue={reviewQueue}
              currentIndex={currentProblemIndex}
              onExit={() => setIsReviewMode(false)}
              onReview={handleOpenReviewModal}
            />
          ) : (
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
                  <Button
                    onClick={handleStartReview}
                    className="bg-green-600 hover:bg-green-500 text-white gap-2 rounded-md px-6 shadow-lg shadow-green-900/20"
                  >
                    <Play className="size-4 fill-current" /> Start Session
                  </Button>
                )}
              </div>

              <MasteryProblemTable
                problems={
                  activeTab === "queue" ? sortedDueProblems : sortedAllProblems
                }
                showActions={activeTab === "all"}
                onReview={handleReviewSpecific}
                onEdit={(p) => {
                  setEditingProblem(p);
                  setIsModalOpen(true);
                }}
                onDelete={(id) => {
                  if (
                    confirm("Are you sure you want to delete this problem?")
                  ) {
                    deleteProblemMutation.mutate(id);
                  }
                }}
              />
            </div>
          )}
        </ScrollArea>
      </div>

      {selectedProblem && (
        <ReviewModal
          problem={selectedProblem}
          open={isReviewOpen}
          onClose={handleCloseReview}
        />
      )}
      <ProblemModal
        open={isModalOpen}
        problem={editingProblem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProblem(null);
        }}
      />
    </div>
  );
}
