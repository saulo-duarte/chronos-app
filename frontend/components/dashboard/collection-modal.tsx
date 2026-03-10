"use client";

import { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  useCreateCollection,
  useUpdateCollection,
} from "@/hooks/use-collections";
import { Loader2 } from "lucide-react";
import { useCollectionModal } from "@/stores/use-collection-modal";
import {
  createCollectionSchema,
  CreateCollectionSchema,
} from "@/schemas/collections";

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
  const {
    isOpen,
    collection: collectionToEdit,
    onClose,
  } = useCollectionModal();

  const createCollection = useCreateCollection();
  const updateCollection = useUpdateCollection();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateCollectionSchema>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      title: "",
      description: "",
      color: COLORS[0],
      icon: "",
    },
  });

  const selectedColor = watch("color");

  useEffect(() => {
    if (isOpen) {
      reset({
        title: collectionToEdit?.title ?? "",
        description: collectionToEdit?.description ?? "",
        color: collectionToEdit?.color ?? COLORS[0],
        icon: collectionToEdit?.icon ?? "",
      });
    }
  }, [isOpen, collectionToEdit, reset]);

  const onSubmit: SubmitHandler<CreateCollectionSchema> = (data) => {
    if (collectionToEdit) {
      updateCollection.mutate(
        { id: collectionToEdit.id, dto: data },
        { onSuccess: onClose },
      );
    } else {
      createCollection.mutate(data, { onSuccess: onClose });
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

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Work, Personal, Fitness"
              {...register("title")}
              disabled={isPending}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What is this collection about?"
              {...register("description")}
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
                  onClick={() => setValue("color", color)}
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
        </form>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
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
