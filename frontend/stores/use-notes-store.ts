import { persist } from "zustand/middleware";
import { create } from "zustand";

const generateId = () => Math.random().toString(36).substring(2, 9);

export interface Note {
    id: string;
    folderId: string | null;
    title: string;
    content: string;
    createdAt: number;
    updatedAt: number;
}

export interface Folder {
    id: string;
    parentId: string | null;
    name: string;
    createdAt: number;
}

interface NotesState {
    folders: Folder[];
    notes: Note[];
    activeNoteId: string | null;
    expandedFolders: string[];

    // Actions
    addFolder: (name: string, parentId?: string | null) => void;
    deleteFolder: (id: string) => void;
    updateFolder: (id: string, name: string) => void;

    addNote: (title: string, folderId?: string | null) => void;
    deleteNote: (id: string) => void;
    updateNote: (id: string, updates: Partial<Note>) => void;

    setActiveNoteId: (id: string | null) => void;
    toggleFolder: (id: string) => void;
}

export const useNotesStore = create<NotesState>()(
    persist(
        (set, get) => ({
            folders: [],
            notes: [],
            activeNoteId: null,
            expandedFolders: [],

            addFolder: (name, parentId = null) => {
                const newFolder: Folder = {
                    id: generateId(),
                    parentId,
                    name,
                    createdAt: Date.now(),
                };
                set((state) => ({ folders: [...state.folders, newFolder] }));
            },

            deleteFolder: (id) => {
                // Recursive delete not implemented for brevity, but needed in real app
                // Here we just delete the folder and move notes to root or delete them?
                // Let's just filter out the folder and its children for now
                set((state) => {
                    const folderIdsToDelete = new Set<string>();
                    const collectFolderIds = (folderId: string) => {
                        folderIdsToDelete.add(folderId);
                        state.folders
                            .filter((f) => f.parentId === folderId)
                            .forEach((f) => collectFolderIds(f.id));
                    };
                    collectFolderIds(id);

                    return {
                        folders: state.folders.filter((f) => !folderIdsToDelete.has(f.id)),
                        notes: state.notes.filter((n) => n.folderId && !folderIdsToDelete.has(n.folderId)),
                        activeNoteId: state.activeNoteId && state.notes.find(n => n.id === state.activeNoteId)?.folderId && folderIdsToDelete.has(state.notes.find(n => n.id === state.activeNoteId)!.folderId!) ? null : state.activeNoteId
                    };
                });
            },

            updateFolder: (id, name) => {
                set((state) => ({
                    folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
                }));
            },

            addNote: (title, folderId = null) => {
                const newNote: Note = {
                    id: generateId(),
                    folderId,
                    title,
                    content: "",
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                set((state) => ({
                    notes: [...state.notes, newNote],
                    activeNoteId: newNote.id
                }));
            },

            deleteNote: (id) => {
                set((state) => ({
                    notes: state.notes.filter((n) => n.id !== id),
                    activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
                }));
            },

            updateNote: (id, updates) => {
                set((state) => ({
                    notes: state.notes.map((n) =>
                        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
                    ),
                }));
            },

            setActiveNoteId: (id) => set({ activeNoteId: id }),

            toggleFolder: (id) => {
                set((state) => ({
                    expandedFolders: state.expandedFolders.includes(id)
                        ? state.expandedFolders.filter((fid) => fid !== id)
                        : [...state.expandedFolders, id],
                }));
            },
        }),
        {
            name: "chronos-notes-storage",
        }
    )
);
