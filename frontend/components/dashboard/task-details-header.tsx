import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";

interface TaskDetailsHeaderProps {
  onClose: () => void;
  onDelete: () => void;
}

export function TaskDetailsHeader({
  onClose,
  onDelete,
}: TaskDetailsHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 md:px-6 shrink-0 border-b border-border/50 bg-background z-10">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <span className="text-sm font-semibold text-muted-foreground">
          Edit Task
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
