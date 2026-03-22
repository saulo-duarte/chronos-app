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
      className="flex md:hidden items-center justify-between px-4 py-3 bg-background/95 backdrop-blur-md z-10 sticky top-0 border-b border-border/40"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex flex-col min-w-0 mr-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 leading-none mb-1">
          Collection
        </span>
        <h2 className="text-lg font-extrabold tracking-tight text-foreground truncate max-w-[120px] xs:max-w-[180px]">
          {title}
        </h2>
      </div>

      <div className="flex bg-muted/30 p-1 rounded-xl shrink-0 border border-white/5">
        {TAB_ORDER.map((tab, i) => {
          const isActive = contentType === tab;
          return (
            <button
              key={tab}
              onClick={() => setContentType(tab)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all duration-300 relative",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="relative z-10">
                {["Tasks", "Resources", "Quadros"][i]}
              </span>
              {isActive && (
                <div 
                  className="absolute inset-0 bg-primary rounded-lg shadow-lg shadow-primary/20 animate-in fade-in zoom-in-95 duration-200" 
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
