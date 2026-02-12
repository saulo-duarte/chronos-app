"use client";

import { useState } from "react";
import { Pattern, Difficulty, CreateLeetCodeProblemDTO } from "@/types";
import { useCreateProblem } from "@/hooks/use-leetcode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link2, Sparkles, Terminal, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateProblemModalProps {
  open: boolean;
  onClose: () => void;
}

const patterns: Pattern[] = [
  "Sliding Window", "Two Pointers", "Fast & Slow Pointers", "Merge Intervals",
  "Cyclic Sort", "In-place Reversal", "BFS", "DFS", "Two Heaps", "Subsets",
  "Binary Search", "Top K Elements", "K-way Merge", "Backtracking",
  "Dynamic Programming", "Greedy", "Graphs", "Trie", "Topological Sort",
  "Union Find", "Monotonic Stack", "Bit Manipulation",
];

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard"];

export function CreateProblemModal({ open, onClose }: CreateProblemModalProps) {
  const [formData, setFormData] = useState<CreateLeetCodeProblemDTO>({
    title: "",
    url: "",
    pattern: "Sliding Window",
    difficulty: "Medium",
    insight_note: "",
  });

  const createMutation = useCreateProblem();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMutation.mutateAsync({
      ...formData,
      insight_note: formData.insight_note?.trim() || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: "",
      url: "",
      pattern: "Sliding Window",
      difficulty: "Medium",
      insight_note: "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl bg-[#282828] border-[#333] text-[#eff1f6] p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-[#333]/30 border-b border-[#333]">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Terminal className="size-5 text-orange-500" />
            New Challenge
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
              Problem Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. 3Sum"
              className="bg-[#1a1a1a] border-[#444] focus-visible:ring-orange-500/50 h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url" className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
              <Link2 className="size-3" /> Source URL
            </Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://leetcode.com/problems/..."
              className="bg-[#1a1a1a] border-[#444] focus-visible:ring-orange-500/50 h-10 text-sm font-mono"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pattern" className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
                <Layers className="size-3" /> Pattern
              </Label>
              <Select
                value={formData.pattern}
                onValueChange={(value) => setFormData({ ...formData, pattern: value as Pattern })}
              >
                <SelectTrigger id="pattern" className="bg-[#1a1a1a] border-[#444] h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#444] text-[#eff1f6]">
                  {patterns.map((pattern) => (
                    <SelectItem key={pattern} value={pattern} className="focus:bg-orange-500/10 focus:text-orange-500 cursor-pointer">
                      {pattern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
                Difficulty
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => setFormData({ ...formData, difficulty: value as Difficulty })}
              >
                <SelectTrigger id="difficulty" className="bg-[#1a1a1a] border-[#444] h-10 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#282828] border-[#444] text-[#eff1f6]">
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff} className={cn(
                      "focus:bg-opacity-10 cursor-pointer",
                      diff === "Easy" && "text-[#00af9b] focus:bg-[#00af9b]",
                      diff === "Medium" && "text-[#ffb800] focus:bg-[#ffb800]",
                      diff === "Hard" && "text-[#ff2d55] focus:bg-[#ff2d55]"
                    )}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="insight_note" className="text-[10px] uppercase font-bold text-gray-500 tracking-widest flex items-center gap-2">
              <Sparkles className="size-3 text-orange-500" /> Key Insight
            </Label>
            <Textarea
              id="insight_note"
              value={formData.insight_note}
              onChange={(e) => setFormData({ ...formData, insight_note: e.target.value })}
              placeholder="Record the 'aha!' moment..."
              className="bg-[#1a1a1a] border-[#444] focus-visible:ring-orange-500/50 min-h-[120px] resize-none text-sm leading-relaxed"
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClose}
              className="text-gray-400 hover:text-white hover:bg-[#333]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createMutation.isPending}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {createMutation.isPending ? "Integrating..." : "Add to Library"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}