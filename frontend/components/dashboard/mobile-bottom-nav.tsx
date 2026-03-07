"use client";

import { LayoutDashboard, ListTodo, Brain, Layers } from "lucide-react";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { cn } from "@/lib/utils";
import { MobileCollectionPicker } from "./mobile-collection-picker";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "collections", label: "Collections", icon: Layers },
  { id: "tasks", label: "Home", icon: ListTodo },
  { id: "mastery", label: "Mastery", icon: Brain },
];

export function MobileBottomNav() {
  const { activeNav, setActiveNav, isPickerOpen, setIsPickerOpen } =
    useDashboardStore();

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-primary/95 backdrop-blur-xl border-t border-border/50 px-6 pb-2 pt-3 transition-colors duration-500">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navItems.map((item) => {
            const isCollections = item.id === "collections";
            const isHome = item.id === "tasks";

            const isActive = isCollections
              ? isPickerOpen
              : isHome
                ? (activeNav === "tasks" ||
                    activeNav.startsWith("collection-")) &&
                  !isPickerOpen
                : activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isSelected(item.id, activeNav) && !isCollections) return;

                  if (isCollections) {
                    setIsPickerOpen(!isPickerOpen);
                  } else {
                    setActiveNav(item.id);
                    setIsPickerOpen(false);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-4 py-1 rounded-xl",
                  isActive
                    ? "text-gray-200 active-tab"
                    : "text-gray-400 hover:text-white",
                )}
              >
                <item.icon className={cn("size-6", isActive && "scale-110")} />
                <span className="text-[11px] font-bold tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <Sheet open={isPickerOpen} onOpenChange={setIsPickerOpen}>
        <SheetContent
          side="bottom"
          className="h-[100dvh] p-0 border-t-0 bg-background shadow-none flex flex-col justify-center transition-all duration-700"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div
            onClick={() => setIsPickerOpen(false)}
            className="flex-1 flex items-center justify-center"
          >
            <MobileCollectionPicker />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function isSelected(itemId: string, activeNav: string) {
  if (itemId === "tasks")
    return activeNav === "tasks" || activeNav.startsWith("collection-");
  return itemId === activeNav;
}
