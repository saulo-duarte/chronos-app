import { create } from "zustand";
import { Priority, Status } from "@/types";

interface DashboardStore {
    activeNav: string;
    contentType: "tasks" | "resources";
    selectedTaskId: string | null;
    view: "day" | "week";
    filterPriority: Priority | "ALL";
    filterStatus: Status | "ALL";
    setActiveNav: (nav: string) => void;
    setContentType: (type: "tasks" | "resources") => void;
    setSelectedTaskId: (id: string | null) => void;
    setView: (view: "day" | "week") => void;
    setFilterPriority: (p: Priority | "ALL") => void;
    setFilterStatus: (s: Status | "ALL") => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
    activeNav: "today",
    contentType: "tasks",
    selectedTaskId: null,
    view: "day",
    filterPriority: "ALL",
    filterStatus: "ALL",
    setActiveNav: (nav) => set({ activeNav: nav, contentType: "tasks", selectedTaskId: null }),
    setContentType: (contentType) => set({ contentType }),
    setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
    setView: (view) => set({ view }),
    setFilterPriority: (filterPriority) => set({ filterPriority }),
    setFilterStatus: (filterStatus) => set({ filterStatus }),
}));