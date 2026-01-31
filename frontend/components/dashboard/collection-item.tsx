"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Collection } from "@/types";
import { useDeleteCollection } from "@/hooks/use-collections";

interface CollectionItemProps {
  collection: Collection;
  isActive: boolean;
  onClick: () => void;
  onEdit: (collection: Collection) => void;
}

export function CollectionItem({
  collection,
  isActive,
  onClick,
  onEdit,
}: CollectionItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const deleteCollection = useDeleteCollection();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir "${collection.title}"?`)) {
      deleteCollection.mutate(collection.id);
    }
    setIsMenuOpen(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(collection);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={cn(
        "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <button onClick={onClick} className="flex flex-1 items-center gap-3 min-w-0">
        <span
          className="size-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: collection.color }}
        />
        <span className="flex-1 truncate text-left">{collection.title}</span>
      </button>

      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              "flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-opacity",
              isMenuOpen && "opacity-100"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="size-3.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 size-3.5" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 size-3.5" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
