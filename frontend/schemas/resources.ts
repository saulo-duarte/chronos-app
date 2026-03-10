import { z } from "zod";

export const resourceTypeSchema = z.enum(["FILE", "LINK", "DRAWING"]);

export const resourceSchema = z.object({
  id: z.string(),
  collection_id: z.string(),
  user_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  path: z.string().min(1, "Path or URL is required"),
  type: resourceTypeSchema,
  tag: z.string().optional(),
  size: z.number().default(0),
  mime_type: z.string().optional(),
  created_at: z.string(),
});

export const createResourceSchema = z.object({
  collection_id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  path: z.string().min(1, "Path or URL is required"),
  type: resourceTypeSchema,
  tag: z.string().optional(),
  size: z.number().default(0),
  mime_type: z.string().optional(),
});

export const updateResourceSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tag: z.string().optional(),
});

export type ResourceSchema = z.infer<typeof resourceSchema>;
export type CreateResourceSchema = z.infer<typeof createResourceSchema>;
export type UpdateResourceSchema = z.infer<typeof updateResourceSchema>;
