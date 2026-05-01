import api from "../lib/api";
import { 
    Task, 
    CreateTaskDTO, 
    UpdateTaskDTO, 
    Status 
} from "../types";

export const taskService = {
    getTasks: async (collectionId?: string): Promise<Task[]> => {
        const url = collectionId ? `/tasks/collection/${collectionId}` : "/tasks";
        const response = await api.get(url);
        return response as any; // Interceptor already returns data
    },

    getTask: async (id: string): Promise<Task> => {
        const response = await api.get(`/tasks/${id}`);
        return response as any;
    },

    createTask: async (dto: CreateTaskDTO): Promise<Task> => {
        const response = await api.post("/tasks", dto);
        return response as any;
    },

    updateTask: async (id: string, dto: UpdateTaskDTO): Promise<Task> => {
        const response = await api.patch(`/tasks/${id}`, dto);
        return response as any;
    },

    deleteTask: async (id: string): Promise<void> => {
        await api.delete(`/tasks/${id}`);
    },

    updateStatus: async (id: string, status: Status): Promise<Task> => {
        const response = await api.patch(`/tasks/${id}/status`, { status });
        return response as any;
    },
};
