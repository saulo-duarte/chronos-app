import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { objectiveService, CreateObjectiveDTO, UpdateObjectiveDTO } from "../services/objective.service";
import { Alert } from "react-native";

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
    mutationFn: (dto: CreateObjectiveDTO) => objectiveService.createObjective(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() });
    },
    onError: (error: any) => {
      Alert.alert("Erro", "Não foi possível criar o objetivo.");
    },
  });
}

export function useUpdateObjective() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateObjectiveDTO }) =>
      objectiveService.updateObjective(id, dto),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: objectiveKeys.lists() });
      queryClient.invalidateQueries({ queryKey: objectiveKeys.detail(id) });
    },
    onError: () => {
      Alert.alert("Erro", "Não foi possível atualizar o objetivo.");
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
    onError: () => {
      Alert.alert("Erro", "Não foi possível excluir o objetivo.");
    },
  });
}
