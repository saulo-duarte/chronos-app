import { useRef } from "react";
import { cn } from "@/lib/utils";

type ContentType = "tasks" | "resources" | "drawings";

const TAB_ORDER: ContentType[] = ["tasks", "resources", "drawings"];

interface TaskListMobileHeaderProps {
  title: string;
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
}

export function TaskListMobileHeader({
  title,
  contentType,
  setContentType,
}: TaskListMobileHeaderProps) {
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;

    const threshold = 60;
    if (Math.abs(deltaX) < threshold) return;

    const currentIndex = TAB_ORDER.indexOf(contentType);
    if (deltaX > 0 && currentIndex < TAB_ORDER.length - 1) {
      // Swipe left → next tab
      setContentType(TAB_ORDER[currentIndex + 1]);
    } else if (deltaX < 0 && currentIndex > 0) {
      // Swipe right → previous tab
      setContentType(TAB_ORDER[currentIndex - 1]);
    }
  };

  return (
    <div
      className="flex md:hidden items-center justify-between px-4 pt-3 pb-2 bg-background/95 backdrop-blur-sm z-10 sticky top-0 border-b border-border/50"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h2 className="text-lg font-bold tracking-tight text-foreground truncate mr-4">
        {title}
      </h2>
      <div className="flex bg-muted/50 p-0.5 rounded-lg shrink-0">
        {TAB_ORDER.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setContentType(tab)}
            className={cn(
              "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
              contentType === tab
                ? "bg-background text-primary shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {["Tasks", "Resources", "Quadros"][i]}
          </button>
        ))}
      </div>
    </div>
  );
}
