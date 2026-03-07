"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useCollections } from "@/hooks/use-collections";
import { useDashboardStore } from "@/stores/use-dashboard-store";
import { cn } from "@/lib/utils";
import { ChevronDown, Inbox } from "lucide-react";

export function MobileCollectionPicker() {
  const { data: collections = [] } = useCollections();
  const { activeNav, setActiveNav, setIsPickerOpen } = useDashboardStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

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

  const infiniteOptions = useMemo(
    () => [...options, ...options, ...options],
    [options],
  );
  const baseOffset = options.length;

  const currentId = activeNav.startsWith("collection-")
    ? activeNav.replace("collection-", "")
    : activeNav;

  // Initial scroll to current selection in the middle set
  useEffect(() => {
    const index = options.findIndex((opt) => opt.id === currentId);
    if (index !== -1 && scrollRef.current) {
      const targetIndex = index + baseOffset;
      const itemWidth = 80;

      const timeoutId = setTimeout(() => {
        setSelectedIndex(targetIndex);
        scrollRef.current?.scrollTo({
          left: targetIndex * itemWidth,
          behavior: "instant",
        });
        setIsReady(true);
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [options, currentId, baseOffset]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isReady) return;
    const { scrollLeft, scrollWidth, clientWidth } = e.currentTarget;
    const itemWidth = 80;
    const index = Math.round(scrollLeft / itemWidth);

    // Virtual infinite scroll jump
    if (scrollLeft <= 0) {
      scrollRef.current?.scrollTo({
        left: scrollLeft + options.length * itemWidth,
        behavior: "instant",
      });
    } else if (scrollLeft + clientWidth >= scrollWidth) {
      scrollRef.current?.scrollTo({
        left: scrollLeft - options.length * itemWidth,
        behavior: "instant",
      });
    }

    if (index !== selectedIndex) {
      setSelectedIndex(index);
    }
  };

  const handleScrollEnd = () => {
    if (!isReady) return;
    const realIndex = selectedIndex % options.length;
    const selected = options[realIndex];
    if (!selected) return;

    const newNav =
      selected.id === "tasks" ? "tasks" : `collection-${selected.id}`;
    if (activeNav !== newNav) {
      setActiveNav(newNav);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-0 bg-background transition-colors duration-700">
      <div className="w-full flex flex-col items-center gap-12 relative max-w-lg mx-auto">
        <div className="relative w-full">
          {/* Picker Wheel */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onScrollEnd={handleScrollEnd}
            className="flex items-center gap-0 overflow-x-auto snap-x snap-mandatory no-scrollbar px-[calc(50%-40px)] py-16"
          >
            {infiniteOptions.map((opt, i) => {
              const isSelected = selectedIndex === i;
              const distance = Math.abs(selectedIndex - i);

              // Scale and opacity for 5 items
              // highlighted item is 15% larger (1.15)
              const scale = isSelected ? 1.15 : 1.0;
              const opacity = Math.max(0.3, 1 - distance * 0.25);
              const isSystem = "isSystem" in opt;

              return (
                <div
                  key={`${opt.id}-${i}`}
                  className="w-[80px] shrink-0 snap-center flex flex-col items-center justify-center transition-all duration-300 ease-out"
                  style={{
                    transform: `scale(${scale})`,
                    opacity: opacity,
                  }}
                >
                  {/* Dot / Icon Container */}
                  <div
                    className={cn(
                      "size-12 rounded-full flex items-center justify-center transition-all duration-500 relative",
                      isSelected
                        ? "shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] ring-2 ring-primary/40"
                        : "ring-1 ring-border/20",
                    )}
                    style={{
                      backgroundColor: isSystem
                        ? "oklch(var(--primary) / 0.1)"
                        : `${opt.color}15`,
                      borderColor: isSystem
                        ? "oklch(var(--primary))"
                        : opt.color,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                  >
                    {isSystem ? (
                      <Inbox className="size-5 text-primary" />
                    ) : (
                      <div
                        className="size-4 rounded-full shadow-inner"
                        style={{ backgroundColor: opt.color }}
                      />
                    )}

                    {/* Outer animated ring for selected */}
                    {isSelected && (
                      <div className="absolute -inset-2 rounded-full border border-primary/20 animate-pulse" />
                    )}
                  </div>

                  {/* Name Label Below - Always visible but centered highlighted */}
                  <div
                    className={cn(
                      "mt-4 text-center transition-all duration-500 max-w-[70px]",
                      isSelected
                        ? "opacity-100 scale-100 font-bold"
                        : "opacity-60 scale-90 font-medium",
                    )}
                  >
                    <span className="text-[10px] tracking-tight text-foreground line-clamp-1">
                      {opt.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Superior Indicator Arrow */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce text-primary/40">
            <ChevronDown className="size-6" />
          </div>

          {/* Snap Indicator Overlay */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-4 size-20 border border-primary/10 rounded-full pointer-events-none ring-[12px] ring-primary/[0.02] shadow-inner" />
        </div>
      </div>
    </div>
  );
}
