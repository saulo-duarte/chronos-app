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

interface CreateProblemModalProps {
  open: boolean;
  onClose: () => void;
}

const patterns: Pattern[] = [
  "Sliding Window",
  "Two Pointers",
  "Fast & Slow Pointers",
  "Merge Intervals",
  "Cyclic Sort",
  "In-place Reversal",
  "BFS",
  "DFS",
  "Two Heaps",
  "Subsets",
  "Binary Search",
  "Top K Elements",
  "K-way Merge",
  "Backtracking",
  "Dynamic Programming",
  "Greedy",
  "Graphs",
  "Trie",
  "Topological Sort",
  "Union Find",
  "Monotonic Stack",
  "Bit Manipulation",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Problema</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Problema *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Two Sum"
              required
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label htmlFor="url">URL do LeetCode *</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://leetcode.com/problems/two-sum/"
              required
            />
          </div>

          {/* Pattern and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pattern">Padrão *</Label>
              <Select
                value={formData.pattern}
                onValueChange={(value) =>
                  setFormData({ ...formData, pattern: value as Pattern })
                }
              >
                <SelectTrigger id="pattern">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {patterns.map((pattern) => (
                    <SelectItem key={pattern} value={pattern}>
                      {pattern}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Dificuldade *</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData({ ...formData, difficulty: value as Difficulty })
                }
              >
                <SelectTrigger id="difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>
                      {diff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Insight Note */}
          <div className="space-y-2">
            <Label htmlFor="insight_note">A Sacada 💡 (Opcional)</Label>
            <Textarea
              id="insight_note"
              value={formData.insight_note}
              onChange={(e) =>
                setFormData({ ...formData, insight_note: e.target.value })
              }
              placeholder="Qual é o insight chave? Ex: 'Usar hashmap para O(1) lookup'"
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Criando..." : "Adicionar Problema"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
