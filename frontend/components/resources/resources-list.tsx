"use client";

import { useState, useMemo } from "react";
import { Resource, UpdateResourceDTO } from "@/types";
import { ResourceCard } from "./resource-card";
import { EditResourceDialog } from "./edit-resource-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FolderOpen } from "lucide-react";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResourcesListProps {
  resources: Resource[];
  onUpdate: (id: string, updates: UpdateResourceDTO) => void;
  onDelete: (id: string) => void;
}

export function ResourcesList({
  resources,
  onUpdate,
  onDelete,
}: ResourcesListProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null,
  );

  const { searchTerm, selectedTag } = useDashboardStore();

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.tag?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = !selectedTag || resource.tag === selectedTag;
      return matchesSearch && matchesTag;
    });
  }, [resources, searchTerm, selectedTag]);

  const handleEdit = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (resource: Resource) => {
    setSelectedResource(resource);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedResource) {
      onDelete(selectedResource.id);
      setIsDeleteDialogOpen(false);
      setSelectedResource(null);
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full overflow-hidden">
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="px-4 py-2 pb-24 md:px-8 md:py-6 mx-auto w-full">
            {filteredResources.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                  <FolderOpen className="size-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-base font-medium text-foreground">
                  {searchTerm || selectedTag
                    ? "Nenhum resultado encontrado"
                    : "Nenhum resource ainda"}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm || selectedTag
                    ? "Tente ajustar seus filtros ou busca"
                    : "Adicione arquivos ou links para começar"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <EditResourceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        resource={selectedResource}
        onUpdate={onUpdate}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar {`"${selectedResource?.title}"`}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
