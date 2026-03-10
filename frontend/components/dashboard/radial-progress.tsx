"use client";

import { useTasks } from "@/hooks/use-tasks";
import { useMemo } from "react";

export function RadialProgress() {
  const { data: tasks = [] } = useTasks();

  const percentage = useMemo(() => {
    const total = tasks.length;
    if (total === 0) return 0;
    const completed = tasks.filter((t) => t.status === "DONE").length;
    return Math.round((completed / total) * 100);
  }, [tasks]);

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="fixed bottom-24 right-6 z-[50] group cursor-default">
      <div className="relative size-20 flex items-center justify-center bg-[#1c1e2d]/80 backdrop-blur-xl rounded-full shadow-2xl border border-white/5 transition-transform duration-500 hover:scale-110">
        <svg className="size-16 -rotate-90">
          {/* Background Circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            className="text-white/5"
          />
          {/* Progress Circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="url(#gradient)"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5E81AC" />
              <stop offset="100%" stopColor="#81A1C1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black tracking-tighter tabular-nums text-foreground">
            {percentage}%
          </span>
          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-50 -mt-1">
            Done
          </span>
        </div>
      </div>
    </div>
  );
}
