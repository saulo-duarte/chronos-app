import { create } from "zustand";
import { Collection } from "@/types";

interface CollectionModalStore {
  isOpen: boolean;
  collection?: Collection;
  onOpen: (collection?: Collection) => void;
  onClose: () => void;
}

export const useCollectionModal = create<CollectionModalStore>((set) => ({
  isOpen: false,
  collection: undefined,
  onOpen: (collection) => set({ isOpen: true, collection }),
  onClose: () => set({ isOpen: false, collection: undefined }),
}));