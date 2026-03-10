"use client";

import { useCallback } from "react";
import { ResourcesList } from "@/components/resources/resources-list";
import {
  useResources,
  useUpdateResource,
  useDeleteResource,
  useCreateResource,
} from "@/hooks/use-resources";
import { UpdateResourceDTO } from "@/types";
import { Loader2, PenTool } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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
  const createMutation = useCreateResource();

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

  const handleCreateDrawing = useCallback(async () => {
    try {
      await createMutation.mutateAsync({
        collection_id: collectionId,
        title: "Novo Quadro",
        path: JSON.stringify({ elements: [], appState: {} }), // Empty drawing
        type: "DRAWING",
        size: 0,
      });
      toast({
        title: "Quadro criado",
        description: "Novo quadro do Excalidraw criado com sucesso.",
      });
    } catch {
      toast({
        title: "Erro ao criar",
        description: "Não foi possível criar o quadro. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [createMutation, collectionId, toast]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-end px-4 mb-2 z-10">
        <Button
          onClick={handleCreateDrawing}
          size="sm"
          className="gap-2 shadow-sm rounded-xl"
        >
          <PenTool className="size-4" />
          <span className="inline">Novo Quadro</span>
        </Button>
      </div>

      <ResourcesList
        resources={resources}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
