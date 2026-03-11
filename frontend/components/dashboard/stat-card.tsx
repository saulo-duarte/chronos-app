"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  count: number;
  color: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function StatCard({
  title,
  count,
  color,
  icon: Icon,
  onClick,
}: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 p-4 rounded-xl transition-all duration-300",
        "bg-card/40 border border-white/5 backdrop-blur-sm",
        "hover:bg-card/60 hover:scale-[1.02] active:scale-[0.98] group",
        "min-w-[120px]",
      )}
    >
      <div className="flex items-center justify-between w-full">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20`, color: color }}
        >
          <Icon size={18} />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground/90">
          {count}
        </span>
      </div>
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground/70 transition-colors truncate w-full text-left">
        {title}
      </span>
    </button>
  );
}
