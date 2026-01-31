import { create } from "zustand";
import { Priority, Status } from "@/types";

export type DashboardView = "all" | "today" | "week" | "overdue";

interface DashboardStore {
    activeNav: string;
    contentType: "tasks" | "resources";
    selectedTaskId: string | null;
    view: DashboardView;
    selectedDate: Date;
    filterPriority: Priority | "ALL";
    filterStatus: Status | "ALL";
    setActiveNav: (nav: string, view?: DashboardView) => void;
    setContentType: (type: "tasks" | "resources") => void;
    setSelectedTaskId: (id: string | null) => void;
    setView: (view: DashboardView) => void;
    setSelectedDate: (date: Date) => void;
    setFilterPriority: (p: Priority | "ALL") => void;
    setFilterStatus: (s: Status | "ALL") => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    activeNav: "tasks",
    contentType: "tasks",
    selectedTaskId: null,
    view: "today",
    selectedDate: new Date(),
    filterPriority: "ALL",
    filterStatus: "ALL",
    setActiveNav: (nav, view) => set((state) => ({
        activeNav: nav,
        contentType: "tasks",
        selectedTaskId: null,
        view: view || (nav.startsWith("collection-") ? "all" : state.view)
    })),
    setContentType: (contentType) => set({ contentType }),
    setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
    setView: (view) => set({ view }),
    setSelectedDate: (selectedDate) => set({ selectedDate }),
    setFilterPriority: (filterPriority) => set({ filterPriority }),
    setFilterStatus: (filterStatus) => set({ filterStatus }),
}));