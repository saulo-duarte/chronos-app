"use client";

import { useMe } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/use-tasks";
import { useMemo } from "react";
import { ListTodo, LayoutGrid } from "lucide-react";

export function Header() {
  const { data: user } = useMe();
  const { theme, setTheme } = useTheme();
  const { data: tasks = [] } = useTasks();
  const totalPending = useMemo(() => {
    return tasks.filter((t) => t.status !== "DONE").length;
  }, [tasks]);

  if (!user) return null;

  return (
    <header className="flex h-[72px] items-center justify-between px-4 md:px-8 bg-background/50 backdrop-blur-md border-b border-border/50 sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Avatar className="size-10 ring-2 ring-primary/20">
            <AvatarImage
              src={`https://avatar.vercel.sh/${user.id}`}
              alt={user.name || "User"}
            />
            <AvatarFallback className="bg-primary/20 text-primary font-bold">
              {(user.name || "U").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground leading-none">
              {user.name || "User"}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex h-8 w-[1px] bg-border/50" />

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 border border-primary/10">
            <ListTodo className="size-4 text-primary" />
            <span className="text-xs font-bold text-primary">
              {totalPending} PENDING
            </span>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/30 border border-border/50">
            <LayoutGrid className="size-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Overview
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full size-10 hover:bg-white/5"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 dark:hidden" />
          <Moon className="hidden h-5 w-5 dark:block" />
        </Button>
      </div>
    </header>
  );
}
