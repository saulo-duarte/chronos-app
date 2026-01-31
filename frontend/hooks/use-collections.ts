import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { APIError } from "@/lib/api";
import { Collection, CreateCollectionDTO, UpdateCollectionDTO } from "@/types";

export function useCollections() {
    return useQuery<Collection[], APIError>({
        queryKey: ["collections"],
        queryFn: async () => {
            const res = await api.get<Collection[]>("/collections");
            return res.data;
        },
    });
}

export function useCollection(id: string) {
    return useQuery<Collection, APIError>({
        queryKey: ["collections", id],
        queryFn: async () => {
            const res = await api.get<Collection>(`/collections/${id}`);
            return res.data;
        },
        enabled: !!id,
    });
}

export function useCreateCollection() {
    const queryClient = useQueryClient();

    return useMutation<Collection, APIError, CreateCollectionDTO>({
        mutationFn: async (dto) => {
            const res = await api.post<Collection>("/collections", dto);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });
}

export function useUpdateCollection() {
    const queryClient = useQueryClient();

    return useMutation<Collection, APIError, { id: string; dto: UpdateCollectionDTO }>({
        mutationFn: async ({ id, dto }) => {
            const res = await api.put<Collection>(`/collections/${id}`, dto);
            return res.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
            queryClient.invalidateQueries({ queryKey: ["collections", data.id] });
        },
    });
}

export function useDeleteCollection() {
    const queryClient = useQueryClient();

    return useMutation<void, APIError, string>({
        mutationFn: async (id) => {
            await api.delete(`/collections/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["collections"] });
        },
    });
}
