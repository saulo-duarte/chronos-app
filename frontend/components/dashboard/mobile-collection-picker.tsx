"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useCollections } from "@/hooks/use-collections";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { cn } from "@/lib/utils";
import { ChevronDown, Inbox } from "lucide-react";

export function MobileCollectionPicker() {
  const { data: collections = [] } = useCollections();
  const { activeNav, setActiveNav } = useDashboardStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // All collections + "All Tasks" option
  const options = useMemo(
    () => [
      {
        id: "tasks",
        title: "Entrada",
        color: "oklch(var(--primary))",
        isSystem: true,
      },
      ...collections,
    ],
    [collections],
  );

  const currentId = activeNav.startsWith("collection-")
    ? activeNav.replace("collection-", "")
    : activeNav;

  // Initial scroll to current selection
  useEffect(() => {
    const index = options.findIndex((opt) => opt.id === currentId);
    if (index !== -1 && scrollRef.current) {
      // Usando timeout curto para evitar renderização em cascata imediata no mount
      const timeoutId = setTimeout(() => {
        setSelectedIndex(index);
        const itemWidth = 100;
        scrollRef.current?.scrollTo({
          left: index * itemWidth,
          behavior: "instant",
        });
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [options, currentId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollLeft } = e.currentTarget;
    const itemWidth = 100;
    const index = Math.round(scrollLeft / itemWidth);

    if (index !== selectedIndex && index >= 0 && index < options.length) {
      setSelectedIndex(index);
    }
  };

  const handleScrollEnd = () => {
    if (selectedIndex !== -1) {
      const selected = options[selectedIndex];
      const newNav =
        selected.id === "tasks" ? "tasks" : `collection-${selected.id}`;
      if (activeNav !== newNav) {
        setActiveNav(newNav);
      }
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 pb-20">
      <div className="w-full flex flex-col items-center gap-8 relative max-w-sm mx-auto">
        {/* Superior Indicator Arrow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce text-primary">
          <ChevronDown className="size-8 opacity-50" />
        </div>

        <div className="relative w-full">
          {/* Picker Wheel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onScrollEnd={handleScrollEnd}
            className="flex items-start gap-0 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[calc(50%-50px)] py-10"
          >
            {options.map((opt, i) => {
              const isSelected = selectedIndex === i;
              const distance = Math.abs(selectedIndex - i);
              const scale = isSelected
                ? 1.4
                : Math.max(0.6, 1 - distance * 0.2);
              const opacity = Math.max(0.3, 1 - distance * 0.4);
              const isSystem = "isSystem" in opt;

              return (
                <div
                  key={opt.id}
                  className="w-[100px] shrink-0 snap-center flex flex-col items-center justify-center transition-all duration-500"
                  style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                  }}
                >
                  {/* Dot / Icon Container */}
                  <div
                    className={cn(
                      "size-14 rounded-full flex items-center justify-center transition-all duration-500 relative",
                      isSelected
                        ? "ring-4 ring-primary/20 shadow-[0_0_25px_rgba(var(--primary-rgb),0.2)]"
                        : "",
                    )}
                    style={{
                      backgroundColor: isSystem
                        ? "oklch(var(--primary) / 0.1)"
                        : `${opt.color}20`,
                      border: `2px solid ${isSystem ? "oklch(var(--primary))" : opt.color}`,
                    }}
                  >
                    {isSystem ? (
                      <Inbox className="size-6 text-primary" />
                    ) : (
                      <div
                        className="size-4 rounded-full"
                        style={{ backgroundColor: opt.color }}
                      />
                    )}

                    {/* Ring for selected */}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full border-2 border-primary/40 animate-pulse" />
                    )}
                  </div>

                  {/* Name Label Below */}
                  <div
                    className={cn(
                      "mt-4 text-center transition-all duration-300",
                      isSelected
                        ? "translate-y-2 scale-90"
                        : "scale-75 opacity-0",
                    )}
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground whitespace-nowrap">
                      {opt.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Central Snap Indicator Overlay (Minimalist) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 w-20 h-20 border border-primary/10 rounded-full pointer-events-none ring-[20px] ring-primary/[0.02]" />
        </div>
      </div>
    </div>
  );
}
