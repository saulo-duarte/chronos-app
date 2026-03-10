import { z } from "zod";

export const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const statusSchema = z.enum(["PENDING", "DONE"]);

export const taskSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: statusSchema,
  priority: prioritySchema,
  collection_id: z.string().optional(),
  start_time: z.string(),
  end_time: z.string().optional(),
  finished_at: z.string().optional(),
  created_at: z.string(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: statusSchema.default("PENDING"),
  priority: prioritySchema.default("MEDIUM"),
  collection_id: z.string().optional(),
  start_time: z.string(),
  end_time: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type TaskSchema = z.infer<typeof taskSchema>;
export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
export type UpdateTaskSchema = z.infer<typeof updateTaskSchema>;
