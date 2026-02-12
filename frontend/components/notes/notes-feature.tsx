"use client";

import { useNotesStore } from "@/stores/use-notes-store";
import { Editor } from "./editor";
import { NotesSidebar } from "./notes-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

export function NotesFeature() {
  const { notes, activeNoteId, updateNote, addNote } = useNotesStore();
  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (activeNoteId) {
      updateNote(activeNoteId, { title: newTitle });
    }
  };

  const handleContentChange = (content: string) => {
    if (activeNoteId) {
      updateNote(activeNoteId, { content });
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      <NotesSidebar />
      
      <main className="flex-1 flex flex-col min-w-0 bg-card/30">
        {activeNote ? (
          <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-6 py-8">
            <Input
              value={activeNote?.title || ""}
              onChange={handleTitleChange}
              placeholder="Untitled Note"
              className="text-4xl font-bold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent h-auto py-2 mb-4 placeholder:text-muted-foreground/40"
            />
            <ScrollArea className="flex-1 -mx-4 px-4">
              <Editor
                key={activeNote.id} // crucial to remount editor when note changes to reset content properly
                content={activeNote.content}
                onChange={handleContentChange}
                className="pb-20"
              />
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
            <div className="text-lg">Select a note to view</div>
            <button 
              onClick={() => addNote("New Note")}
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Create New Note
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
