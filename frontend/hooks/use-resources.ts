import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { APIError } from "@/lib/api";
import { Resource, CreateResourceDTO, UpdateResourceDTO } from "@/types";

export function useResources(collectionId: string) {
    return useQuery<Resource[], APIError>({
        queryKey: ["resources", collectionId],
        queryFn: async () => {
            const res = await api.get<Resource[]>(`/resources/collection/${collectionId}`);
            return res.data;
        },
        enabled: !!collectionId,
    });
}

export function useResource(id: string) {
    return useQuery<Resource, APIError>({
        queryKey: ["resources", id],
        queryFn: async () => {
            const res = await api.get<Resource>(`/resources/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateResource() {
    const queryClient = useQueryClient();

    return useMutation<Resource, APIError, CreateResourceDTO | FormData>({
        mutationFn: async (data) => {
            const res = await api.post<Resource>("/resources", data);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["resources", data.collection_id] });
        },
    });
}

export function useUpdateResource() {
    const queryClient = useQueryClient();

    return useMutation<Resource, APIError, { id: string; dto: UpdateResourceDTO }>({
        mutationFn: async ({ id, dto }) => {
            const res = await api.put<Resource>(`/resources/${id}`, dto);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["resources", data.collection_id] });
            queryClient.invalidateQueries({ queryKey: ["resources", data.id] });
        },
    });
}

export function useDeleteResource() {
    const queryClient = useQueryClient();

    return useMutation<void, APIError, { id: string; collectionId: string }>({
        mutationFn: async ({ id }) => {
            await api.delete(`/resources/${id}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["resources", variables.collectionId] });
        },
    });
}
