"use client";

import { useMe } from "@/hooks/use-auth";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  const { data: user } = useMe();
  const { theme, setTheme } = useTheme();

  if (!user) return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-white/5">
      <div className="flex items-center gap-4">
        <Avatar className="size-12 ring-2 ring-primary/20">
          <AvatarImage
            src={`https://avatar.vercel.sh/${user.id}`}
            alt={user.name || "User"}
          />
          <AvatarFallback className="bg-primary/20 text-primary font-bold">
            {(user.name || "U").charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium tracking-wide">
            Welcome back,
          </span>
          <span className="text-base font-bold text-foreground">
            {user.name || "User"}
          </span>
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
