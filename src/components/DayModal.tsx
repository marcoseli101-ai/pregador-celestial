import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ExternalLink, CheckCircle2 } from "lucide-react";
import type { DayEntry } from "@/data/biblicalPlan";

interface DayModalProps {
  entry: DayEntry | null;
  dateLabel: string;
  isCompleted: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: () => void;
}

export function DayModal({ entry, dateLabel, isCompleted, open, onOpenChange, onToggle }: DayModalProps) {
  if (!entry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Dia {entry.day}
          </DialogTitle>
          <DialogDescription>{dateLabel}</DialogDescription>
        </DialogHeader>

        {entry.period && (
          <Badge variant="outline" className="w-fit">{entry.period}</Badge>
        )}

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Leituras do dia:</h4>
          <div className="grid grid-cols-2 gap-2">
            {entry.references.map((ref, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm"
              >
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                {ref}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={onToggle}
            variant={isCompleted ? "outline" : "default"}
            className={isCompleted ? "border-emerald-600 text-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}
          >
            <CheckCircle2 className="h-4 w-4 mr-1" />
            {isCompleted ? "Desmarcar leitura" : "Marcar como lido"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a
              href={`https://www.bible.com/pt/bible/211/${entry.references[0]?.replace(/\s/g, ".").toLowerCase()}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Ler no Bible.com
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
