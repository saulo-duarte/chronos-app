import api from "@/lib/api";
import { 
  TaskSchema, 
  CreateTaskSchema, 
  UpdateTaskSchema 
} from "@/schemas/tasks";
import { Status } from "@/types";

export const taskService = {
  getTasks: async (collectionId?: string) => {
    const url = collectionId ? `/tasks/collection/${collectionId}` : "/tasks";
    const res = await api.get<TaskSchema[]>(url);
    return res.data;
  },

  getTask: async (id: string) => {
    const res = await api.get<TaskSchema>(`/tasks/${id}`);
    return res.data;
  },

  createTask: async (dto: CreateTaskSchema) => {
    const res = await api.post<TaskSchema>("/tasks", dto);
    return res.data;
  },

  updateTask: async (id: string, dto: UpdateTaskSchema) => {
    const res = await api.patch<TaskSchema>(`/tasks/${id}`, dto);
    return res.data;
  },

  updateStatus: async (id: string, status: Status) => {
    const res = await api.patch<TaskSchema>(`/tasks/${id}/status`, { status });
    return res.data;
  },

  deleteTask: async (id: string) => {
    await api.delete(`/tasks/${id}`);
  },
};
