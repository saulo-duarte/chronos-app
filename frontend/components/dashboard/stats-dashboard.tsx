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
  Calendar
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { isBefore, parseISO, isToday, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  bg: string;
}

export function StatsDashboard() {
  const { data: tasks = [] } = useTasks();
  const { data: collections = [] } = useCollections();

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "DONE").length;
    const pending = total - completed;
    const overdue = tasks.filter(t => {
      if (t.status === "DONE" || !t.end_time) return false;
      return isBefore(parseISO(t.end_time), new Date());
    }).length;
    
    const todayTasks = tasks.filter(t => t.end_time && isToday(parseISO(t.end_time))).length;
    const weekTasks = tasks.filter(t => t.end_time && isThisWeek(parseISO(t.end_time))).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, overdue, todayTasks, weekTasks, completionRate };
  }, [tasks]);

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <header className="shrink-0 border-b border-border px-6 py-8 md:px-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Dashboard</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">Your productivity overview and statistics.</p>
      </header>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full w-full">
          <div className="p-6 md:p-10 space-y-10 max-w-7xl mx-auto pb-32">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Tasks" 
                value={stats.total} 
                icon={Target} 
                description="All categories"
                color="text-blue-500"
                bg="bg-blue-500/10"
              />
              <StatCard 
                title="Completed" 
                value={stats.completed} 
                icon={CheckCircle2} 
                description={`${stats.completionRate}% of target`}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
              />
              <StatCard 
                title="Pending" 
                value={stats.pending} 
                icon={Clock} 
                description="Active tasks"
                color="text-amber-500"
                bg="bg-amber-500/10"
              />
              <StatCard 
                title="Overdue" 
                value={stats.overdue} 
                icon={AlertCircle} 
                description="Needs attention"
                color="text-red-500"
                bg="bg-red-500/10"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[2.5rem] border border-border bg-card/40 p-8 flex flex-col justify-between overflow-hidden relative min-h-[240px]">
                  <div className="relative z-10">
                      <h3 className="text-xl font-bold flex items-center gap-2 tracking-tight">
                          <TrendingUp className="size-6 text-primary" />
                          Completion Rate
                      </h3>
                      <p className="text-sm font-medium text-muted-foreground">Overall progress of your activities</p>
                  </div>
                  
                  <div className="mt-auto relative z-10">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-6xl font-bold text-primary tracking-tighter">{stats.completionRate}%</span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] pb-2">Global Progress</span>
                    </div>
                    <div className="w-full bg-primary/10 rounded-full h-4 overflow-hidden border border-primary/5">
                        <div 
                            className="bg-primary h-full transition-all duration-1000 ease-in-out" 
                            style={{ width: `${stats.completionRate}%` }}
                        />
                    </div>
                  </div>
                  
                  <BarChart3 className="absolute -bottom-6 -right-6 size-48 text-primary/5 opacity-20 rotate-12" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                  <div className="rounded-[2rem] border border-border bg-card/40 p-6 flex items-center gap-5 hover:bg-muted/30 transition-all cursor-default group">
                      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Calendar className="size-7 text-primary" />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold leading-tight">For Today</h4>
                          <p className="text-sm font-medium text-muted-foreground">{stats.todayTasks} tasks due today</p>
                      </div>
                  </div>
                  
                  <div className="rounded-[2rem] border border-border bg-card/40 p-6 flex items-center gap-5 hover:bg-muted/30 transition-all cursor-default group">
                      <div className="size-14 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <BarChart3 className="size-7 text-purple-500" />
                      </div>
                      <div>
                          <h4 className="text-lg font-bold leading-tight">This Week</h4>
                          <p className="text-sm font-medium text-muted-foreground">{stats.weekTasks} tasks planned</p>
                      </div>
                  </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl font-bold tracking-tight">Collections</h3>
              </div>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {collections.map(collection => {
                  const collectionTasks = tasks.filter(t => t.collection_id === collection.id);
                  const completed = collectionTasks.filter(t => t.status === "DONE").length;
                  const total = collectionTasks.length;
                  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

                  return (
                    <div key={collection.id} className="p-6 rounded-[2rem] border border-border bg-card/60 hover:shadow-xl hover:-translate-y-1 transition-all group">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="size-4 rounded-full shadow-sm" style={{ backgroundColor: collection.color }} />
                        <span className="font-bold text-lg truncate tracking-tight">{collection.title}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">
                        <span>{completed} / {total} done</span>
                        <span className="text-foreground">{progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                        <div 
                          className="h-full transition-all duration-700" 
                          style={{ width: `${progress}%`, backgroundColor: collection.color }} 
                        />
                      </div>
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

function StatCard({ title, value, icon: Icon, description, color, bg }: StatCardProps) {
  return (
    <div className="rounded-[2rem] border border-border bg-card/40 p-6 transition-all hover:bg-card hover:shadow-lg group">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{title}</h3>
        <div className={cn("size-10 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12", bg)}>
          <Icon className={cn("size-5", color)} />
        </div>
      </div>
      <div>
        <div className="text-4xl font-bold tracking-tighter text-foreground">{value}</div>
        <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-tight opacity-70">
          {description}
        </p>
      </div>
    </div>
  );
}