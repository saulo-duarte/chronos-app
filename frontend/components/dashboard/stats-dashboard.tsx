"use client";

import { useMemo } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useCollections } from "@/hooks/use-collections";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Target,
  BarChart3,
  Calendar,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isBefore, parseISO, isToday, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";
import { StatsDashboardSkeleton } from "./skeletons";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  bg: string;
}

export function StatsDashboard() {
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: collections = [], isLoading: collectionsLoading } =
    useCollections();

  const isLoading = tasksLoading || collectionsLoading;

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "DONE").length;
    const pending = total - completed;
    const overdue = tasks.filter((t) => {
      if (t.status === "DONE" || !t.end_time) return false;
      return isBefore(parseISO(t.end_time), new Date());
    }).length;

    const todayTasks = tasks.filter(
      (t) => t.end_time && isToday(parseISO(t.end_time)),
    ).length;
    const weekTasks = tasks.filter(
      (t) => t.end_time && isThisWeek(parseISO(t.end_time)),
    ).length;

    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      todayTasks,
      weekTasks,
      completionRate,
    };
  }, [tasks]);

  if (isLoading) return <StatsDashboardSkeleton />;

  return (
    <div className="flex flex-col h-full w-full bg-modern-gradient overflow-hidden">
      <header className="shrink-0 border-b border-border px-6 py-8 md:px-10 backdrop-blur-md">
        <h1 className="text-3xl font-black tracking-tight text-foreground md:text-5xl uppercase">
          Dashboard
        </h1>
        <p className="text-sm font-bold text-muted-foreground mt-1 uppercase tracking-widest opacity-70">
          Neural productivity overview
        </p>
      </header>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          <div className="p-6 md:p-10 space-y-12 max-w-7xl mx-auto pb-32">
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Tasks"
                value={stats.total}
                icon={Target}
                description="Global ecosystem"
                color="text-blue-500"
                bg="bg-blue-500/10"
              />
              <StatCard
                title="Completed"
                value={stats.completed}
                icon={CheckCircle2}
                description={`${stats.completionRate}% optimize`}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={Clock}
                description="Active focus"
                color="text-amber-500"
                bg="bg-amber-500/10"
              />
              <StatCard
                title="Overdue"
                value={stats.overdue}
                icon={AlertCircle}
                description="Critical sync"
                color="text-red-500"
                bg="bg-red-500/10"
              />
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              <div className="rounded-[3rem] border border-border/40 bg-card/40 backdrop-blur-xl p-10 flex flex-col justify-between overflow-hidden relative min-h-[320px] shadow-2xl group transition-all duration-700 hover:shadow-primary/5">
                <div className="relative z-10">
                  <h3 className="text-2xl font-black flex items-center gap-3 tracking-tighter uppercase">
                    <TrendingUp className="size-8 text-primary animate-pulse" />
                    Evolution Rate
                  </h3>
                  <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                    Cognitive throughput analytics
                  </p>
                </div>

                <div className="mt-auto relative z-10">
                  <div className="flex justify-between items-end mb-6">
                    <span className="text-8xl font-black text-primary tracking-tighter group-hover:scale-105 transition-transform duration-700">
                      {stats.completionRate}%
                    </span>
                    <div className="flex flex-col items-end pb-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em]">
                        Performance
                      </span>
                      <span className="text-[10px] font-black text-primary/60">
                        SYSTEM STATUS
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-primary/5 rounded-full h-6 overflow-hidden border border-primary/10 p-1.5 backdrop-blur-sm">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_30px_rgba(var(--primary),0.4)]"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                <BarChart3 className="absolute -bottom-12 -right-12 size-72 text-primary/5 opacity-30 rotate-[15deg] group-hover:rotate-[25deg] transition-all duration-1000" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-xl p-8 flex items-center gap-8 hover:bg-card/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default group shadow-xl">
                  <div className="size-20 rounded-[2rem] bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 shadow-lg">
                    <Calendar className="size-10 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tight uppercase">
                      Neural Focus
                    </h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {stats.todayTasks} objectives today
                    </p>
                  </div>
                </div>

                <div className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-xl p-8 flex items-center gap-8 hover:bg-card/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-default group shadow-xl">
                  <div className="size-20 rounded-[2rem] bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 shadow-lg">
                    <BarChart3 className="size-10 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black tracking-tight uppercase">
                      Velocity
                    </h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                      {stats.weekTasks} goals in queue
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-2xl font-black tracking-tight uppercase tracking-[0.2em]">
                  Neural Clusters
                </h3>
              </div>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map((collection) => {
                  const collectionTasks = tasks.filter(
                    (t) => t.collection_id === collection.id,
                  );
                  const completed = collectionTasks.filter(
                    (t) => t.status === "DONE",
                  ).length;
                  const total = collectionTasks.length;
                  const progress =
                    total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div
                      key={collection.id}
                      className="p-8 rounded-[3rem] border border-border/30 bg-card/20 backdrop-blur-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                    >
                      <div className="flex items-center gap-4 mb-8 relative z-10">
                        <div
                          className="size-5 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                          style={{ backgroundColor: collection.color }}
                        />
                        <span className="font-black text-xl truncate tracking-tighter uppercase whitespace-nowrap">
                          {collection.title}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black text-muted-foreground mb-4 uppercase tracking-[0.2em] relative z-10">
                        <span>
                          {completed} / {total} sync
                        </span>
                        <span className="text-foreground font-black">
                          {progress}%
                        </span>
                      </div>
                      <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden border border-border/20 p-0.5 relative z-10">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: collection.color,
                          }}
                        />
                      </div>
                      <div
                        className="absolute top-0 right-0 size-32 opacity-5 blur-3xl transition-opacity duration-700 group-hover:opacity-10"
                        style={{ backgroundColor: collection.color }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color,
  bg,
}: StatCardProps) {
  return (
    <div className="rounded-[2.5rem] border border-border/30 bg-card/30 backdrop-blur-xl p-8 transition-all duration-700 hover:bg-card/50 hover:shadow-2xl hover:-translate-y-2 group shadow-xl">
      <div className="flex items-center justify-between pb-6">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-70">
          {title}
        </h3>
        <div
          className={cn(
            "size-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-[15deg] group-hover:scale-110 shadow-lg",
            bg,
          )}
        >
          <Icon className={cn("size-7", color)} />
        </div>
      </div>
      <div>
        <div className="text-6xl font-black tracking-tighter text-foreground group-hover:scale-105 transition-transform duration-700 origin-left">
          {value}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div
            className={cn(
              "size-2 rounded-full animate-pulse",
              color.replace("text-", "bg-"),
            )}
          />
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.1em] opacity-80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
