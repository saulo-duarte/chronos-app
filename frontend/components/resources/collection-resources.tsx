"use client";

import { useCallback } from "react";
import { ResourcesList } from "@/components/resources/resources-list";
import {
  useResources,
  useUpdateResource,
  useDeleteResource,
} from "@/hooks/use-resources";
import { UpdateResourceDTO } from "@/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollectionResourcesProps {
  collectionId: string;
}

export function CollectionResources({
  collectionId,
}: CollectionResourcesProps) {
  const { toast } = useToast();
  const { data: resources = [], isLoading } = useResources(collectionId);
  const updateMutation = useUpdateResource();
  const deleteMutation = useDeleteResource();

  const handleUpdate = useCallback(
    async (id: string, updates: UpdateResourceDTO) => {
      try {
        await updateMutation.mutateAsync({ id, dto: updates });

        toast({
          title: "Resource atualizado",
          description: "As alterações foram salvas com sucesso.",
        });
      } catch {
        toast({
          title: "Erro ao atualizar",
          description:
            "Não foi possível atualizar o resource. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [updateMutation, toast],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync({ id, collectionId });

        toast({
          title: "Resource deletado",
          description: "O resource foi removido com sucesso.",
        });
      } catch {
        toast({
          title: "Erro ao deletar",
          description: "Não foi possível deletar o resource. Tente novamente.",
          variant: "destructive",
        });
      }
    },
    [deleteMutation, collectionId, toast],
  );

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ResourcesList
      resources={resources}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
