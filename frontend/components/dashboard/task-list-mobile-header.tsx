import { cn } from "@/lib/utils";

interface TaskListMobileHeaderProps {
  title: string;
  contentType: "tasks" | "resources";
  setContentType: (type: "tasks" | "resources") => void;
}

export function TaskListMobileHeader({
  title,
  contentType,
  setContentType,
}: TaskListMobileHeaderProps) {
  return (
    <div className="flex md:hidden items-center justify-between px-4 pt-3 pb-2 bg-background/95 backdrop-blur-sm z-10 sticky top-0 border-b border-border/50">
      <h2 className="text-lg font-bold tracking-tight text-foreground truncate mr-4">
        {title}
      </h2>
      <div className="flex bg-muted/50 p-0.5 rounded-lg shrink-0">
        <button
          onClick={() => setContentType("tasks")}
          className={cn(
            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
            contentType === "tasks"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Tasks
        </button>
        <button
          onClick={() => setContentType("resources")}
          className={cn(
            "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
            contentType === "resources"
              ? "bg-background text-primary shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Resources
        </button>
      </div>
    </div>
  );
}
