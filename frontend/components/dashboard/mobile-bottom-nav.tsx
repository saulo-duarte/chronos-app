import { LayoutDashboard, ListTodo, Brain, Layers, Plus } from "lucide-react";
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-background/95 backdrop-blur-xl border-t border-white/5 px-6 pb-2 pt-3 transition-colors duration-500">
        <div className="flex items-center justify-between max-w-md mx-auto relative h-16">
          {navItems.slice(0, 2).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeNav={activeNav}
              isPickerOpen={isPickerOpen}
              setIsPickerOpen={setIsPickerOpen}
              setActiveNav={setActiveNav}
            />
          ))}

          <div className="flex flex-col items-center -mt-10">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-quick-add"));
              }}
              className={cn(
                "size-14 rounded-full bg-primary border-4 border-background text-primary-foreground shadow-2xl flex items-center justify-center transition-all duration-300",
                "hover:scale-110 active:scale-95 shadow-primary/20",
              )}
            >
              <Plus size={32} strokeWidth={3} />
            </button>
          </div>

          {navItems.slice(2).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeNav={activeNav}
              isPickerOpen={isPickerOpen}
              setIsPickerOpen={setIsPickerOpen}
              setActiveNav={setActiveNav}
            />
          ))}
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

interface NavItemProps {
  item: {
    id: string;
    label: string;
    icon: any;
  };
  activeNav: string;
  isPickerOpen: boolean;
  setIsPickerOpen: (v: boolean) => void;
  setActiveNav: (v: string) => void;
}

function NavItem({
  item,
  activeNav,
  isPickerOpen,
  setIsPickerOpen,
  setActiveNav,
}: NavItemProps) {
  const isCollections = item.id === "collections";
  const isHome = item.id === "tasks";

  const isActive = isCollections
    ? isPickerOpen
    : isHome
      ? (activeNav === "tasks" || activeNav.startsWith("collection-")) &&
        !isPickerOpen
      : activeNav === item.id;

  return (
    <button
      onClick={() => {
        if (isCollections) {
          setIsPickerOpen(!isPickerOpen);
        } else {
          setActiveNav(item.id);
          setIsPickerOpen(false);
        }
      }}
      className={cn(
        "flex flex-col items-center gap-1 transition-all duration-300 relative px-2 py-1",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <item.icon className={cn("size-6", isActive && "scale-110")} />
      <span className="text-[10px] font-bold tracking-tight uppercase">
        {item.label}
      </span>
    </button>
  );
}
