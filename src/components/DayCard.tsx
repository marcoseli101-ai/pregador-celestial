import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
}: DayCardProps) {
  return (
    <Card
      data-day={day}
      className={cn(
        "p-3 cursor-pointer transition-all duration-300 border-2",
        isCompleted && "bg-emerald-950/40 border-emerald-600/50",
        isToday && !isCompleted && "border-blue-500 shadow-blue-500/20 shadow-md",
        !isCompleted && !isToday && "border-border/50 hover:border-border",
        justCompleted && "animate-pulse ring-2 ring-emerald-400"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={(e) => {
            e && e.valueOf(); // prevent propagation
            onToggle();
          }}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "mt-0.5 shrink-0",
            isCompleted && "border-emerald-500 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
          )}
        />
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">Dia {day}</span>
            <span className="text-xs text-muted-foreground">{dateLabel}</span>
            {isToday && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-600/20 text-blue-400 border-blue-500/30">
                HOJE
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {references.join(" | ")}
          </p>
          {period && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 mt-0.5">
              {period}
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
