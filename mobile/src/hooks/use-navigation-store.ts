import { create } from "zustand";

type FeatureContext = "TASK" | "COLLECTION_TASK" | "COLLECTION_RESOURCE" | "DASHBOARD" | "PROFILE";

interface NavigationState {
  activeContext: FeatureContext;
  setActiveContext: (context: FeatureContext) => void;
  // For collection details, we need to know WHICH collection
  currentCollectionId: string | null;
  setCurrentCollectionId: (id: string | null) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeContext: "TASK",
  setActiveContext: (context) => set({ activeContext: context }),
  currentCollectionId: null,
  setCurrentCollectionId: (id) => set({ currentCollectionId: id }),
}));
