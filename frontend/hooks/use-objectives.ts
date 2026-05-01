import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { objectiveService } from "@/services/objectives";
import { CreateObjectiveSchema, UpdateObjectiveSchema } from "@/schemas/objectives";

export const objectiveKeys = {
  all: ["objectives"] as const,
  lists: () => [...objectiveKeys.all, "list"] as const,
  detail: (id: string) => [...objectiveKeys.all, "detail", id] as const,
};

export function useObjectives() {
  return useQuery({
    queryKey: objectiveKeys.lists(),
    queryFn: objectiveService.getObjectives,
  });
}

export function useCreateObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateObjectiveSchema) => objectiveService.createObjective(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() });
    },
  });
}

export function useUpdateObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateObjectiveSchema }) =>
      objectiveService.updateObjective(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(id) });
    },
  });
}

export function useDeleteObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => objectiveService.deleteObjective(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() });
    },
  });
}
