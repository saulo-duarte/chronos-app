import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { collectionService } from "../services/collection.service";
import { queryKeys } from "../lib/query-keys";
import { CreateCollectionDTO, UpdateCollectionDTO } from "../types";

export function useCollections() {
  return useQuery({
    queryKey: queryKeys.collections.all,
    queryFn: () => collectionService.getCollections(),
  });
}

export function useCollection(id: string) {
  return useQuery({
    queryKey: queryKeys.collections.detail(id),
    queryFn: () => collectionService.getCollection(id),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCollectionDTO) => collectionService.createCollection(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
    },
  });
}

export function useUpdateCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCollectionDTO }) =>
      collectionService.updateCollection(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.detail(data.id) });
    },
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
    },
  });
}
