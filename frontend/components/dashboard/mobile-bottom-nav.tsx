"use client";

import { useState } from "react";
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
  const { activeNav, setActiveNav } = useDashboardStore();
  const [showPicker, setShowPicker] = useState(false);

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 pb-6 pt-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navItems.map((item) => {
            const isCollections = item.id === "collections";
            const isHome = item.id === "tasks";

            // Ativo se for o item clicado OU se for Home e uma collection estiver selecionada
            const isActive = isCollections
              ? showPicker
              : isHome
                ? (activeNav === "tasks" ||
                    activeNav.startsWith("collection-")) &&
                  !showPicker
                : activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isSelected(item.id, activeNav) && !isCollections) return;

                  if (isCollections) {
                    setShowPicker(!showPicker);
                  } else {
                    setActiveNav(item.id);
                    setShowPicker(false);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-4 py-1 rounded-xl",
                  isActive
                    ? "text-primary active-tab"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className={cn("size-6", isActive && "scale-110")} />
                <span className="text-[11px] font-bold tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <Sheet open={showPicker} onOpenChange={setShowPicker}>
        <SheetContent
          side="bottom"
          className="h-[100dvh] p-0 border-t-0 bg-background/40 backdrop-blur-2xl shadow-none flex flex-col justify-center transition-all duration-700"
        >
          <div
            onClick={() => setShowPicker(false)}
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
