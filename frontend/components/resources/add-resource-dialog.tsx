"use client";

import { useState } from "react";
import { ResourceType } from "@/types";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Upload, Link as LinkIcon, Tag as TagIcon } from "lucide-react";

interface AddResourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionId: string;
  onAddFile: (file: File, title: string, description: string, tag: string) => void;
  onAddLink: (url: string, title: string, description: string, tag: string) => void;
}

export function AddResourceDialog({
  open,
  onOpenChange,
  onAddFile,
  onAddLink,
}: AddResourceDialogProps) {
  const [type, setType] = useState<ResourceType>("FILE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "FILE" && file) {
      onAddFile(file, title || file.name, description, tag);
    } else if (type === "LINK" && url) {
      onAddLink(url, title, description, tag);
    }

    setTitle("");
    setDescription("");
    setTag("");
    setUrl("");
    setFile(null);
    onOpenChange(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name);
      }
    }
  };

  const isValid = type === "FILE" ? !!file : !!url && !!title;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Resource</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <Tabs value={type} onValueChange={(v) => setType(v as ResourceType)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="FILE" className="gap-2">
                <Upload className="size-4" />
                Arquivo
              </TabsTrigger>
              <TabsTrigger value="LINK" className="gap-2">
                <LinkIcon className="size-4" />
                Link
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4 mt-4">
              {/* Campo de Tag compartilhado entre File e Link */}
              <div className="space-y-2">
                <Label htmlFor="resource-tag" className="flex items-center gap-2">
                  <TagIcon className="size-3" /> Tag (opcional)
                </Label>
                <Input
                  id="resource-tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Ex: Estudo, Trabalho, Importante..."
                />
              </div>

              <TabsContent value="FILE" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="file">Arquivo</Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                  {file && (
                    <p className="text-xs text-muted-foreground">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-title">Título (opcional)</Label>
                  <Input
                    id="file-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome do arquivo será usado se vazio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-description">Descrição (opcional)</Label>
                  <textarea
                    id="file-description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicione uma descrição..."
                  />
                </div>
              </TabsContent>

              <TabsContent value="LINK" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://exemplo.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link-title">Título</Label>
                  <Input
                    id="link-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nome do link"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link-description">Descrição (opcional)</Label>
                  <textarea
                    id="link-description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Adicione uma descrição..."
                  />
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid}>
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}