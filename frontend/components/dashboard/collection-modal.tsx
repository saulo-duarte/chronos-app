"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCollection, useUpdateCollection } from "@/hooks/use-collections";
import { Loader2 } from "lucide-react";
import { useCollectionModal } from "@/stores/use-collection-modal";

const COLORS = [
  "#00ADD8",
  "#F97316",
  "#8B5CF6",
  "#22C55E",
  "#EF4444",
  "#3B82F6",
  "#F59E0B",
  "#EC4899",
];

export function CollectionModal() {
  const { isOpen, collection: collectionToEdit, onClose } = useCollectionModal();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  useEffect(() => {
    if (isOpen) {
      setTitle(collectionToEdit?.title ?? "");
      setDescription(collectionToEdit?.description ?? "");
      setSelectedColor(collectionToEdit?.color ?? COLORS[0]);
    }
  }, [isOpen, collectionToEdit]);

  const handleSave = () => {
    if (!title) return;

    const payload = { title, description, color: selectedColor };

    if (collectionToEdit) {
      updateCollection.mutate(
        { id: collectionToEdit.id, dto: payload },
        { onSuccess: onClose }
      );
    } else {
      createCollection.mutate(payload, { onSuccess: onClose });
    }
  };

  const isPending = createCollection.isPending || updateCollection.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {collectionToEdit ? "Edit Collection" : "New Collection"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Work, Personal, Fitness"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isPending}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What is this collection about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`size-7 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110 ring-2 ring-primary/20"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={isPending}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!title || isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : collectionToEdit ? (
              "Save Changes"
            ) : (
              "Create Collection"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}