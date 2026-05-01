import { create } from "zustand";

type QuickAddType = "TASK" | "COLLECTION" | "RESOURCE";

interface QuickAddStore {
  isOpen: boolean;
  type: QuickAddType;
  collectionId?: string;
  selectedColor: string;
  open: (type?: QuickAddType, collectionId?: string) => void;
  close: () => void;
  setSelectedColor: (color: string) => void;
}

export const useQuickAddStore = create<QuickAddStore>((set) => ({
  isOpen: false,
  type: "TASK",
  selectedColor: "#00ADD8", // Default frontend color
  open: (type = "TASK", collectionId) => set({ isOpen: true, type, collectionId }),
  close: () => set({ isOpen: false }),
  setSelectedColor: (color) => set({ selectedColor: color }),
}));
