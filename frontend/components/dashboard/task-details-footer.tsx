import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Status } from "@/types";

interface TaskDetailsFooterProps {
  status: Status;
  onToggleStatus: () => void;
}

export function TaskDetailsFooter({
  status,
  onToggleStatus,
}: TaskDetailsFooterProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-10 z-20">
      <Button
        onClick={onToggleStatus}
        size="lg"
        className={cn(
          "w-full h-14 rounded-2xl text-base font-semibold shadow-xl",
          status === "DONE"
            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
            : "bg-primary hover:bg-primary/90 text-primary-foreground",
        )}
      >
        {status === "DONE" ? (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-6" /> Completed
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Circle className="size-6" /> Mark as Complete
          </div>
        )}
      </Button>
    </div>
  );
}
