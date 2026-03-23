"use client";

import { useMemo } from "react";
import { useTasks } from "@/hooks/use-tasks";
import { useCollections } from "@/hooks/use-collections";
import { useAllResources } from "@/hooks/use-resources";
import { Header } from "./header";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Folder,
  FileText,
  PenTool,
  Link as LinkIcon,
} from "lucide-react";
import { isBefore, startOfDay, isToday } from "date-fns";
import { ElementType } from "react";

export function DashboardOverview() {
  const { data: tasks = [] } = useTasks();
  const { data: collections = [] } = useCollections();
  const { data: resources = [] } = useAllResources();

  const metrics = useMemo(() => {
    const totalTasks = tasks.length;
    let doneTasks = 0;
    let overdueTasks = 0;
    let upcomingTasks = 0;

    const now = new Date();
    const todayStart = startOfDay(now);

    tasks.forEach((t) => {
      if (t.status === "DONE") {
        doneTasks++;
      } else {
        if (!t.end_time) {
          upcomingTasks++;
        } else {
          const date = new Date(t.end_time);
          if (isBefore(date, todayStart) && !isToday(date)) {
            overdueTasks++;
          } else {
            upcomingTasks++;
          }
        }
      }
    });

    const progress =
      totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

    let drawings = 0;
    let files = 0;
    let links = 0;

    resources.forEach((r) => {
      if (r.type === "DRAWING") drawings++;
      else if (r.type === "FILE") files++;
      else if (r.type === "LINK") links++;
    });

    return {
      totalTasks,
      doneTasks,
      overdueTasks,
      upcomingTasks,
      progress,
      totalCollections: collections.length,
      drawings,
      files,
      links,
      totalResources: resources.length,
    };
  }, [tasks, collections, resources]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <Header />
      <ScrollArea className="flex-1 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6 pb-24 md:pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
              <p className="text-muted-foreground mt-1">
                See how you are doing today.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
              <div>
                <p className="text-sm font-medium">Task Progress</p>
                <p className="text-xs text-muted-foreground">
                  {metrics.doneTasks} of {metrics.totalTasks} done
                </p>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              icon={ListTodo}
              label="Total Tasks"
              value={metrics.totalTasks}
              color="text-blue-500"
              bg="bg-blue-500/10"
            />
            <StatBox
              icon={CheckCircle2}
              label="Done"
              value={metrics.doneTasks}
              color="text-green-500"
              bg="bg-green-500/10"
            />
            <StatBox
              icon={Clock}
              label="Upcoming"
              value={metrics.upcomingTasks}
              color="text-yellow-500"
              bg="bg-yellow-500/10"
            />
            <StatBox
              icon={AlertCircle}
              label="Overdue"
              value={metrics.overdueTasks}
              color="text-red-500"
              bg="bg-red-500/10"
            />
          </div>

          <h2 className="text-xl font-bold tracking-tight pt-4">
            Collections & Resources
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox
              icon={Folder}
              label="Collections"
              value={metrics.totalCollections}
              color="text-indigo-500"
              bg="bg-indigo-500/10"
            />
            <StatBox
              icon={PenTool}
              label="Drawings"
              value={metrics.drawings}
              color="text-purple-500"
              bg="bg-purple-500/10"
            />
            <StatBox
              icon={FileText}
              label="Files"
              value={metrics.files}
              color="text-pink-500"
              bg="bg-pink-500/10"
            />
            <StatBox
              icon={LinkIcon}
              label="Links"
              value={metrics.links}
              color="text-teal-500"
              bg="bg-teal-500/10"
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function StatBox({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4 flex flex-col gap-3 transition-colors hover:bg-muted/50">
      <div className={`p-2 w-fit rounded-lg ${bg}`}>
        <Icon className={`size-5 ${color}`} />
      </div>
      <div>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}
