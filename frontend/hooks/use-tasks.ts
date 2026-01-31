import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { APIError } from "@/lib/api";
import { Task, CreateTaskDTO, UpdateTaskDTO, Status } from "@/types";

export function useTasks(collectionId?: string) {
    return useQuery<Task[], APIError>({
        queryKey: collectionId ? ["tasks", { collectionId }] : ["tasks"],
        queryFn: async () => {
            const url = collectionId ? `/tasks/collection/${collectionId}` : "/tasks";
            const res = await api.get<Task[]>(url);
            return res.data;
        },
    });
}

export function useTask(id: string) {
    return useQuery<Task, APIError>({
        queryKey: ["tasks", id],
        queryFn: async () => {
            const res = await api.get<Task>(`/tasks/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation<Task, APIError, CreateTaskDTO>({
        mutationFn: async (dto) => {
            const res = await api.post<Task>("/tasks", dto);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation<Task, APIError, { id: string; dto: UpdateTaskDTO }>({
        mutationFn: async ({ id, dto }) => {
            const res = await api.put<Task>(`/tasks/${id}`, dto);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
        },
    });
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation<Task, APIError, { id: string; status: Status }>({
        mutationFn: async ({ id, status }) => {
            const res = await api.patch<Task>(`/tasks/${id}/status`, { status });
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["tasks", data.id] });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation<void, APIError, string>({
        mutationFn: async (id) => {
            await api.delete(`/tasks/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
    });
}
