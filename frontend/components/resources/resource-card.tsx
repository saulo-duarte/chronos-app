"use client";

import { Resource } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Link as LinkIcon, 
  Download, 
  ExternalLink, 
  Trash2,
  Edit,
  File,
  FileImage,
  FileVideo,
  FileArchive,
  FileSpreadsheet,
  Tag as TagIcon,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";
import { cn, getTagColor } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ResourceCardProps {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

const getFileIcon = (mimeType?: string) => {
  if (!mimeType) return File;
  const mime = mimeType.toLowerCase();
  if (mime.startsWith("image/")) return FileImage;
  if (mime.startsWith("video/")) return FileVideo;
  if (mime.includes("pdf")) return FileText;
  if (mime.includes("sheet") || mime.includes("excel")) return FileSpreadsheet;
  if (mime.includes("zip") || mime.includes("rar")) return FileArchive;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  const isFile = resource.type === "FILE";
  const Icon = isFile ? getFileIcon(resource.mime_type) : LinkIcon;

  const handleAction = (e?: React.MouseEvent) => {
    if (e) {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[role="menuitem"]')) return;
    }
    window.open(resource.path, "_blank", isFile ? undefined : "noopener,noreferrer");
  };

  const tagStyles = resource.tag ? getTagColor(resource.tag) : null;

  return (
    <div 
      onClick={handleAction}
      className="group relative flex items-center gap-4 rounded-xl border border-border bg-card p-3 transition-all hover:bg-accent/50 hover:border-primary/30 cursor-pointer"
    >
      <div className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-lg border border-border/50 shadow-sm",
        isFile ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400"
      )}>
        <Icon className="size-6" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="font-medium text-sm text-foreground truncate">
            {resource.title}
          </h3>
          {resource.tag && (
            <Badge 
              variant="outline" 
              style={{ 
                backgroundColor: tagStyles?.bg, 
                color: tagStyles?.text, 
                borderColor: tagStyles?.border 
              }}
              className="h-4 px-1.5 text-[9px] font-bold uppercase tracking-tighter"
            >
              {resource.tag}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            {isFile ? formatFileSize(resource.size) : "Link Externo"}
          </span>
          <span className="size-1 rounded-full bg-border" />
          <span>{format(new Date(resource.created_at), "dd MMM yyyy")}</span>
        </div>
      </div>

      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleAction()} className="gap-2">
              {isFile ? <Download className="size-4" /> : <ExternalLink className="size-4" />}
              {isFile ? "Baixar" : "Abrir link"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(resource)} className="gap-2">
              <Edit className="size-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(resource)} 
              className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="size-4" />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}