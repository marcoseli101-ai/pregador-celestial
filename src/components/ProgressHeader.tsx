import { Progress } from "@/components/ui/progress";
import { Flame, BookOpen, Trophy } from "lucide-react";

interface ProgressHeaderProps {
  percentage: number;
  completedCount: number;
  streak: number;
}

export function ProgressHeader({ percentage, completedCount, streak }: ProgressHeaderProps) {
  return (
    <div className="relative rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-5 space-y-4 overflow-hidden">
      {/* Subtle golden glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[hsl(var(--gold)/0.08)] blur-3xl pointer-events-none" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">{completedCount} <span className="text-muted-foreground font-normal text-sm">de 365 dias</span></p>
            <p className="text-xs text-muted-foreground">concluídos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-semibold text-orange-400">{streak}</span>
              <span className="text-xs text-orange-400/70 hidden sm:inline">dias seguidos</span>
            </div>
          )}
          {percentage >= 100 && (
            <Trophy className="h-6 w-6 text-[hsl(var(--gold))]" />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Progress value={percentage} className="h-2.5 bg-muted/60" />
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground">Progresso geral</p>
          <p className="text-sm font-bold text-primary">{percentage}%</p>
        </div>
      </div>
    </div>
  );
}
