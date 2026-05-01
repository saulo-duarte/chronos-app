import { z } from "zod";

export const StatusEnum = z.enum(["PENDING", "DONE"]);

export const ObjectiveSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  status: StatusEnum,
  target_month: z.number().min(1).max(12),
  target_year: z.number().min(2024),
  created_at: z.string(),
});

export const CreateObjectiveSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  target_month: z.number().min(1).max(12),
  target_year: z.number().min(2024),
});

export const UpdateObjectiveSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().max(500).optional(),
  status: StatusEnum.optional(),
  target_month: z.number().min(1).max(12).optional(),
  target_year: z.number().min(2024).optional(),
});

export type ObjectiveSchema = z.infer<typeof ObjectiveSchema>;
export type CreateObjectiveSchema = z.infer<typeof CreateObjectiveSchema>;
export type UpdateObjectiveSchema = z.infer<typeof UpdateObjectiveSchema>;
