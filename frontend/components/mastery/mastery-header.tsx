import { Brain, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MasteryHeaderProps {
  activeTab: string;
  isReviewMode: boolean;
  onTabChange: (tab: string) => void;
  onNewProblem: () => void;
}

export function MasteryHeader({
  activeTab,
  isReviewMode,
  onTabChange,
  onNewProblem,
}: MasteryHeaderProps) {
  return (
    <header className="px-8 py-4 border-b border-[#333] shrink-0 bg-[#282828]">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-orange-500/10 text-orange-500">
              <Brain className="size-5" />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-[#eff1f6]">
              Mastery Queue
            </h1>
          </div>

          {!isReviewMode && (
            <nav className="flex items-center gap-1">
              <button
                onClick={() => onTabChange("queue")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  activeTab === "queue"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white",
                )}
              >
                Problems
              </button>
              <button
                onClick={() => onTabChange("all")}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors rounded-md",
                  activeTab === "all"
                    ? "bg-[#333] text-white"
                    : "text-gray-400 hover:text-white",
                )}
              >
                Library
              </button>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={onNewProblem}
            size="sm"
            className="bg-[#333] hover:bg-[#404040] text-white border-none gap-2 h-8 px-4"
          >
            <Plus className="size-4" /> New
          </Button>
        </div>
      </div>
    </header>
  );
}
