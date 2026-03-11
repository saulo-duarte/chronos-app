import { LeetCodeProblem } from "@/types";
import {
  Trophy,
  Play,
  Edit2,
  Trash2,
  ExternalLink,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MasteryProblemTableProps {
  problems: LeetCodeProblem[];
  showActions: boolean;
  onReview: (problem: LeetCodeProblem) => void;
  onEdit: (problem: LeetCodeProblem) => void;
  onDelete: (id: string) => void;
}

export function MasteryProblemTable({
  problems,
  showActions,
  onReview,
  onEdit,
  onDelete,
}: MasteryProblemTableProps) {
  return (
    <div className="bg-[#282828] border border-[#333] rounded-lg overflow-hidden">
      <div className="grid grid-cols-[1fr_120px_150px_120px] px-8 py-3 border-b border-[#333] text-[12px] font-medium text-gray-500 uppercase tracking-wider">
        <div>Title</div>
        <div>Difficulty</div>
        <div>Pattern</div>
        <div className="text-right">Action</div>
      </div>

      <div className="divide-y divide-[#333]">
        {problems.map((problem) => (
          <ProblemItem
            key={problem.id}
            problem={problem}
            showActions={showActions}
            onReview={() => onReview(problem)}
            onEdit={() => onEdit(problem)}
            onDelete={() => onDelete(problem.id)}
          />
        ))}

        {problems.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            <Trophy className="size-8 mx-auto mb-3 opacity-20" />
            <p>No problems found in this section</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProblemItem({
  problem,
  onReview,
  onEdit,
  onDelete,
  showActions,
}: {
  problem: LeetCodeProblem;
  onReview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  showActions: boolean;
}) {
  return (
    <div className="grid grid-cols-[1fr_120px_150px_120px] items-center px-8 py-3 hover:bg-[#333] transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <h3 className="text-[14px] font-medium text-[#eff1f6] truncate group-hover:text-blue-400 transition-colors">
          {problem.title}
        </h3>
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-all"
        >
          <ExternalLink className="size-3" />
        </a>
      </div>

      <div>
        <span
          className={cn(
            "text-[12px] font-medium",
            problem.difficulty === "Easy" && "text-[#00af9b]",
            problem.difficulty === "Medium" && "text-[#ffb800]",
            problem.difficulty === "Hard" && "text-[#ff2d55]",
          )}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="truncate">
        <Badge
          variant="outline"
          className="text-[10px] font-normal border-[#444] text-gray-400 bg-transparent"
        >
          {problem.pattern}
        </Badge>
      </div>

      <div className="flex justify-end gap-2">
        {showActions ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-400 hover:text-white"
              >
                <MoreVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-[#282828] border-[#333] text-[#eff1f6]"
            >
              <DropdownMenuItem
                onClick={onReview}
                className="gap-2 cursor-pointer focus:bg-[#333] focus:text-white"
              >
                <Play className="size-4" /> Review
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onEdit}
                className="gap-2 cursor-pointer focus:bg-[#333] focus:text-white"
              >
                <Edit2 className="size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onDelete}
                className="gap-2 cursor-pointer focus:bg-red-500/10 focus:text-red-500"
              >
                <Trash2 className="size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReview}
            className="h-7 text-[12px] text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-3"
          >
            Review
          </Button>
        )}
      </div>
    </div>
  );
}
