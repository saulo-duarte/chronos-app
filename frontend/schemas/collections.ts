import { z } from "zod";

export const collectionSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string().default("#3b82f6"),
  icon: z.string().optional(),
  is_archived: z.boolean().default(false),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createCollectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  color: z.string(),
  icon: z.string().optional(),
});

export const updateCollectionSchema = createCollectionSchema.partial().extend({
  is_archived: z.boolean().optional(),
});

export type CollectionSchema = z.infer<typeof collectionSchema>;
export type CreateCollectionSchema = z.infer<typeof createCollectionSchema>;
export type UpdateCollectionSchema = z.infer<typeof updateCollectionSchema>;
