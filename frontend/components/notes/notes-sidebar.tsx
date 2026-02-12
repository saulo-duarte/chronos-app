"use client";

import { useNotesStore, Folder, Note } from "@/stores/use-notes-store";
import { cn } from "@/lib/utils";
import {
  ChevronRight,
  ChevronDown,
  Folder as FolderIcon,
  FileText,
  Plus,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FolderItemProps {
  folder: Folder;
  allFolders: Folder[];
  notes: Note[];
  depth?: number;
}

const FolderItem = ({ folder, allFolders, notes, depth = 0 }: FolderItemProps) => {
  const {
    expandedFolders,
    toggleFolder,
    activeNoteId,
    setActiveNoteId,
    addFolder,
    addNote,
    deleteFolder,
  } = useNotesStore();

  const isExpanded = expandedFolders.includes(folder.id);
  const childFolders = allFolders.filter((f) => f.parentId === folder.id);
  const childNotes = notes.filter((n) => n.folderId === folder.id);

  const handleCreateNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    addNote("Untitled Note", folder.id);
    toggleFolder(folder.id); // Ensure open
  };

  const handleCreateFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    addFolder("New Folder", folder.id);
    toggleFolder(folder.id); // Ensure open
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFolder(folder.id);
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "group flex items-center justify-between py-1 px-2 hover:bg-accent/50 rounded-md cursor-pointer text-sm text-foreground/80",
          isExpanded && "text-foreground"
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={() => toggleFolder(folder.id)}
      >
        <div className="flex items-center gap-1.5 overflow-hidden">
          <span className="text-muted-foreground transition-transform duration-200">
            {isExpanded ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </span>
          <FolderIcon className="size-4 text-blue-500/80 fill-blue-500/20" />
          <span className="truncate">{folder.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreVertical className="size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleCreateNote}>
                <Plus className="mr-2 size-3" /> New Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateFolder}>
                <Plus className="mr-2 size-3" /> New Folder
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 size-3" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isExpanded && (
        <div>
          {childFolders.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              allFolders={allFolders}
              notes={notes}
              depth={depth + 1}
            />
          ))}
          {childNotes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "group flex items-center justify-between py-1 px-2 hover:bg-accent/50 rounded-md cursor-pointer text-sm",
                activeNoteId === note.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
              )}
              style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}
              onClick={() => setActiveNoteId(note.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText className="size-3.5" />
                <span className="truncate">{note.title || "Untitled"}</span>
              </div>
            </div>
          ))}
          {childFolders.length === 0 && childNotes.length === 0 && (
            <div
              className="py-1 px-2 text-xs text-muted-foreground italic"
              style={{ paddingLeft: `${(depth + 1) * 12 + 24}px` }}
            >
              Empty
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function NotesSidebar() {
  const { folders, notes, addFolder, addNote, activeNoteId, setActiveNoteId } = useNotesStore();

  const rootFolders = folders.filter((f) => !f.parentId);
  const rootNotes = notes.filter((n) => !n.folderId);

  return (
    <div className="flex flex-col h-full bg-card/50 border-r border-border w-64">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <span className="font-semibold text-sm">Library</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => addFolder("New Folder")}
            title="New Root Folder"
          >
            <FolderIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={() => addNote("New Note")}
            title="New Root Note"
          >
            <FileText className="size-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {rootFolders.map((folder) => (
            <FolderItem
              key={folder.id}
              folder={folder}
              allFolders={folders}
              notes={notes}
            />
          ))}
          {rootNotes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "group flex items-center py-1 px-2 hover:bg-accent/50 rounded-md cursor-pointer text-sm ml-2",
                activeNoteId === note.id ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
              )}
              onClick={() => setActiveNoteId(note.id)}
            >
              <FileText className="size-3.5 mr-2" />
              <span className="truncate">{note.title || "Untitled"}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
