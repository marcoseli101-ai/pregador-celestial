import { Progress } from "@/components/ui/progress";
import { Flame, BookOpen } from "lucide-react";

interface ProgressHeaderProps {
  percentage: number;
  completedCount: number;
  streak: number;
}

export function ProgressHeader({ percentage, completedCount, streak }: ProgressHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          {completedCount} de 365 dias concluídos
        </span>
        {streak > 0 && (
          <span className="flex items-center gap-1 text-orange-400 font-medium">
            <Flame className="h-4 w-4" />
            {streak} dias seguidos
          </span>
        )}
      </div>
      <Progress value={percentage} className="h-3 bg-muted" />
      <p className="text-xs text-center text-muted-foreground font-medium">{percentage}%</p>
    </div>
  );
}
