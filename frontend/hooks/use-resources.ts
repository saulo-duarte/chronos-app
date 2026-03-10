import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourceService } from "@/services/resources";
import { queryKeys } from "@/lib/query-keys";
import { CreateResourceDTO, UpdateResourceDTO } from "@/types";

export function useResources(collectionId: string) {
    return useQuery({
        queryKey: queryKeys.resources.list(collectionId),
        queryFn: () => resourceService.getResources(collectionId),
        enabled: !!collectionId,
    });
}

export function useResource(id: string) {
    return useQuery({
        queryKey: queryKeys.resources.detail(id),
        queryFn: () => resourceService.getResource(id),
        enabled: !!id,
    });
}

export function useCreateResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (dto: CreateResourceDTO) => resourceService.createResource(dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.resources.list(data.collection_id) });
        },
    });
}

export function useUpdateResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateResourceDTO }) => 
            resourceService.updateResource(id, dto),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.resources.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.resources.detail(data.id) });
        },
    });
}

export function useDeleteResource() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: string; collectionId: string }) => 
            resourceService.deleteResource(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.resources.list(variables.collectionId) });
        },
    });
}
