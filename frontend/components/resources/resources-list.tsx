"use client";

import { useState, useMemo } from "react";
import { Resource, UpdateResourceDTO } from "@/types";
import { ResourceCard } from "./resource-card";
import { AddResourceDialog } from "./add-resource-dialog";
import { EditResourceDialog } from "./edit-resource-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FolderOpen, Search, Filter } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface ResourcesListProps {
  collectionId: string;
  resources: Resource[];
  onAddFile: (file: File, title: string, description: string, tag: string) => void;
  onAddLink: (url: string, title: string, description: string, tag: string) => void;
  onUpdate: (id: string, updates: UpdateResourceDTO) => void;
  onDelete: (id: string) => void;
}

export function ResourcesList({
  collectionId,
  resources,
  onAddFile,
  onAddLink,
  onUpdate,
  onDelete,
}: ResourcesListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = resources
      .map((r) => r.tag)
      .filter((tag): tag is string => !!tag && tag.trim() !== "");
    return Array.from(new Set(tags));
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (resource.tag?.toLowerCase().includes(searchTerm.toLowerCase()));
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
    <div className="flex flex-col flex-1 min-h-0 h-full">
      <div className="border-b border-border px-6 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Resources</h2>
            <p className="text-sm text-muted-foreground">
              {filteredResources.length} {filteredResources.length === 1 ? "item" : "itens"}
              {selectedTag && ` em #${selectedTag}`}
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="size-4" />
            Adicionar
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por título ou tag..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <Filter className="size-4 text-muted-foreground mr-1" />
              <Badge 
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                Todas
              </Badge>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <FolderOpen className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                {searchTerm || selectedTag ? "Nenhum resultado encontrado" : "Nenhum resource ainda"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {searchTerm || selectedTag 
                  ? "Tente ajustar seus filtros ou busca" 
                  : "Adicione arquivos ou links para começar"}
              </p>
              {!searchTerm && !selectedTag && (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="mt-4 gap-2"
                  variant="outline"
                >
                  <Plus className="size-4" />
                  Adicionar Resource
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
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

      <AddResourceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        collectionId={collectionId}
        onAddFile={onAddFile}
        onAddLink={onAddLink}
      />

      <EditResourceDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        resource={selectedResource}
        onUpdate={onUpdate}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar "{selectedResource?.title}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}