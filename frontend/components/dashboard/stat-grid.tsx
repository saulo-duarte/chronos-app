"use client";

import { useCollections } from "@/hooks/use-collections";
import { useTasks } from "@/hooks/use-tasks";
import { StatCard } from "./stat-card";
import { Briefcase, Folder, ListTodo } from "lucide-react";
import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function StatGrid() {
  const { data: collections = [] } = useCollections();
  const { data: tasks = [] } = useTasks();

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
    <div className="w-full px-4 pt-4 pb-2 transition-all">
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
    </div>
  );
}
