import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "../services/task.service";
import { NotificationService } from "../services/notification.service";
import { queryKeys } from "../lib/query-keys";
import { CreateTaskDTO, UpdateTaskDTO, Status } from "../types";

export function useTasks(collectionId?: string) {
    return useQuery({
        queryKey: queryKeys.tasks.list(collectionId || "all"),
        queryFn: () => taskService.getTasks(collectionId),
    });
}

export function useTask(id: string) {
    return useQuery({
        queryKey: queryKeys.tasks.detail(id),
        queryFn: () => taskService.getTask(id),
        enabled: !!id,
    });
}

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateTaskDTO) => taskService.createTask(dto),
        onSuccess: () => {
            // Invalidation triggers useTaskNotifications to re-sync
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateTaskDTO }) => 
            taskService.updateTask(id, dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.id) });
        },
    });
}

export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: Status }) => 
            taskService.updateStatus(id, status),
        onSuccess: (data) => {
            // When a task is completed, its notifications will be cleaned up
            // by the next sync cycle triggered by invalidation
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.detail(data.id) });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => taskService.deleteTask(id),
        onSuccess: (_data, taskId) => {
            // Cancel notifications for the deleted task immediately
            NotificationService.cancelTaskNotifications(taskId);
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
        },
    });
}
