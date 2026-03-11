"use client";

import { useCollections } from "@/hooks/use-collections";
import { useTasks } from "@/hooks/use-tasks";
import { StatCard } from "./stat-card";
import {
  Briefcase,
  Folder,
  ListTodo,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function StatGrid() {
  const { data: collections = [] } = useCollections();
  const { data: tasks = [] } = useTasks();
  const [isExpanded, setIsExpanded] = useState(true);

  const collectionStats = useMemo(() => {
    return collections.map((col) => {
      const count = tasks.filter(
        (t) => t.collection_id === col.id && t.status !== "DONE",
      ).length;
      return {
        id: col.id,
        title: col.title,
        count,
        color: col.color,
        icon: col.title.toLowerCase().includes("work") ? Briefcase : Folder,
      };
    });
  }, [collections, tasks]);

  const totalPending = useMemo(() => {
    return tasks.filter((t) => t.status !== "DONE").length;
  }, [tasks]);

  return (
    <div className="w-full px-4 md:px-8 pt-4 pb-2 transition-all">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Overview
        </h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 rounded-full hover:bg-white/5"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>

      {isExpanded && (
        <ScrollArea className="w-full whitespace-nowrap animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="flex gap-3 pb-4 pt-1">
            <StatCard
              title="All Tasks"
              count={totalPending}
              color="#5E81AC"
              icon={ListTodo}
            />
            {collectionStats.map((stat) => (
              <StatCard
                key={stat.id}
                title={stat.title}
                count={stat.count}
                color={stat.color}
                icon={stat.icon}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="hidden" />
        </ScrollArea>
      )}
    </div>
  );
}
