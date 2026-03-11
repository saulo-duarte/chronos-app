import { z } from "zod";
import { resourceTypeSchema } from "./resources";

export const mobileQuickAddSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("task"),
    title: z.string().min(1, "O título é obrigatório"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
    date: z.string().optional(),
    collection_id: z.string().optional(),
  }),
  z.object({
    type: z.literal("resource"),
    resourceType: resourceTypeSchema,
    title: z.string().min(1, "O título é obrigatório"),
    url: z.string().url("URL inválida").optional(),
    tag: z.string().optional(),
    collection_id: z.string().min(1, "A coleção é obrigatória para recursos"),
  }),
]);

export type MobileQuickAddSchema = z.infer<typeof mobileQuickAddSchema>;
export type MobileTaskData = Extract<MobileQuickAddSchema, { type: "task" }>;
export type MobileResourceData = Extract<MobileQuickAddSchema, { type: "resource" }>;
