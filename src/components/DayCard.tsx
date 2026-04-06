import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayCardProps {
  day: number;
  dateLabel: string;
  references: string[];
  period?: string;
  isCompleted: boolean;
  isToday: boolean;
  onToggle: () => void;
  onClick: () => void;
  justCompleted: boolean;
  readProgress?: number;
}

export function DayCard({
  day,
  dateLabel,
  references,
  period,
  isCompleted,
  isToday,
  onToggle,
  onClick,
  justCompleted,
  readProgress = 0,
}: DayCardProps) {
  return (
    <Card
      data-day={day}
      className={cn(
        "group p-4 cursor-pointer transition-all duration-300 border rounded-xl hover:shadow-md",
        isCompleted && "bg-emerald-950/30 border-emerald-600/40 hover:border-emerald-500/60",
        isToday && !isCompleted && "border-primary/60 shadow-lg shadow-primary/10 ring-1 ring-primary/20",
        !isCompleted && !isToday && "border-border/40 hover:border-border/80",
        justCompleted && "animate-pulse ring-2 ring-emerald-400/60"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggle()}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "mt-1 shrink-0 h-5 w-5 rounded-md",
            isCompleted && "border-emerald-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          )}
        />
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base tracking-tight">Dia {day}</span>
            <span className="text-xs text-muted-foreground/80 font-medium">{dateLabel}</span>
            {isToday && (
              <Badge className="text-[10px] px-2 py-0.5 bg-primary/15 text-primary border-primary/30 font-bold tracking-wider">
                HOJE
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <BookOpen className="h-3 w-3 shrink-0 opacity-60" />
            <p className="text-sm leading-relaxed line-clamp-2" style={{ fontFamily: "'Inter', sans-serif", letterSpacing: "0.01em" }}>
              {references.join("  •  ")}
            </p>
          </div>

          {readProgress > 0 && !isCompleted && (
            <div className="w-full bg-muted/40 rounded-full h-1.5 mt-1">
              <div
                className="h-1.5 rounded-full bg-emerald-500/60 transition-all duration-500"
                style={{ width: `${readProgress}%` }}
              />
            </div>
          )}

          {period && (
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 mt-0.5 font-medium opacity-70">
              {period}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
