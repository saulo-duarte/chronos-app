import { z } from "zod";

export const patternSchema = z.enum([
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
]);

export const difficultySchema = z.enum(["Easy", "Medium", "Hard"]);

export const leetCodeProblemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
  pattern: patternSchema,
  difficulty: difficultySchema,
  last_score: z.number(),
  next_review: z.string(),
  ease_factor: z.number(),
  interval: z.number(),
  insight_note: z.string().optional(),
  created_at: z.string(),
});

export const createLeetCodeProblemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
  pattern: patternSchema,
  difficulty: difficultySchema,
  insight_note: z.string().optional(),
});

export const updateLeetCodeProblemSchema = createLeetCodeProblemSchema.partial();

export const reviewSchema = z.object({
  score: z.number().min(0).max(5),
  insight_note: z.string().optional(),
});

export type LeetCodeProblemSchema = z.infer<typeof leetCodeProblemSchema>;
export type CreateLeetCodeProblemSchema = z.infer<typeof createLeetCodeProblemSchema>;
export type UpdateLeetCodeProblemSchema = z.infer<typeof updateLeetCodeProblemSchema>;
export type ReviewSchema = z.infer<typeof reviewSchema>;
