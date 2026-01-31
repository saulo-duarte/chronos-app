"use client";

import { useCallback } from "react";
import { ResourcesList } from "@/components/resources/resources-list";
import { useResources, useCreateResource, useUpdateResource, useDeleteResource } from "@/hooks/use-resources";
import { UpdateResourceDTO } from "@/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollectionResourcesProps {
  collectionId: string;
}

export function CollectionResources({ collectionId }: CollectionResourcesProps) {
  const { toast } = useToast();
  const { data: resources = [], isLoading } = useResources(collectionId);
  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();
  const deleteMutation = useDeleteResource();

  const handleAddFile = useCallback(async (file: File, title: string, description: string, tag: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection_id", collectionId);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tag", tag);
      formData.append("type", "FILE");
      
      await createMutation.mutateAsync(formData);

      toast({
        title: "Arquivo adicionado",
        description: `${title} foi adicionado com sucesso.`,
      });
    } catch {
      toast({
        title: "Erro ao adicionar arquivo",
        description: "Não foi possível adicionar o arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [collectionId, createMutation, toast]);

  const handleAddLink = useCallback(async (url: string, title: string, description: string, tag: string) => {
    try {
      await createMutation.mutateAsync({
        collection_id: collectionId,
        title,
        description: description || undefined,
        path: url,
        type: "LINK",
        size: 0,
        tag,
      });

      toast({
        title: "Link adicionado",
        description: `${title} foi adicionado com sucesso.`,
      });
    } catch {
      toast({
        title: "Erro ao adicionar link",
        description: "Não foi possível adicionar o link. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [collectionId, createMutation, toast]);

  const handleUpdate = useCallback(async (id: string, updates: UpdateResourceDTO) => {
    try {
      await updateMutation.mutateAsync({ id, dto: updates });

      toast({
        title: "Resource atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar o resource. Tente novamente.",
        variant: "destructive",
      });
    }
  }, [updateMutation, toast]);

  const handleDelete = useCallback(async (id: string) => {
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
  }, [deleteMutation, collectionId, toast]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ResourcesList
      collectionId={collectionId}
      resources={resources}
      onAddFile={handleAddFile}
      onAddLink={handleAddLink}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
