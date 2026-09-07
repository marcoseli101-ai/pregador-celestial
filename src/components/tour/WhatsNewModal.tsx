import React from "react";
import {
  Sparkles,
  BookOpen,
  MessageCircleQuestion,
  GitCompare,
  Link2,
  ScrollText,
  X,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TODAY_FEATURES } from "@/config/featuresTour";

interface WhatsNewModalProps {
  open: boolean;
  onClose: () => void;
  onStartTour: () => void;
  onStartFullTour?: () => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  Sparkles,
  MessageCircleQuestion,
  GitCompare,
  Link2,
  ScrollText,
};

export function WhatsNewModal({
  open,
  onClose,
  onStartTour,
  onStartFullTour,
}: WhatsNewModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden border-accent/40 shadow-2xl bg-card/95 backdrop-blur-xl">
        {/* Header with decorative background */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-accent/20 via-background to-accent/10 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-md text-background">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold font-serif tracking-tight text-foreground">
                  Veja tudo o que preparamos de novo para você! 🎉
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Novas funcionalidades e ferramentas adicionadas neste deploy
                </DialogDescription>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Feature list */}
        <ScrollArea className="max-h-[55vh] px-6 py-4">
          <div className="space-y-3.5 pr-2">
            {TODAY_FEATURES.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || Sparkles;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-all p-4 space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          {item.title}
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-medium">
                            {item.badge}
                          </Badge>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                    {item.description}
                  </p>
                  <div className="pl-10 pt-1 flex items-center gap-1.5 text-[11px] text-accent font-medium">
                    <span className="font-semibold text-foreground/80">Como testar:</span>
                    <span className="text-muted-foreground">{item.howToTest}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 px-6 bg-muted/20 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onStartFullTour ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onStartFullTour}
              className="text-xs text-muted-foreground hover:text-foreground gap-1.5 order-3 sm:order-1"
            >
              <HelpCircle className="h-3.5 w-3.5 text-accent" />
              Ver Tutorial Geral
            </Button>
          ) : (
            <div className="order-3 sm:order-1" />
          )}

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs flex-1 sm:flex-none"
            >
              Explorar por conta própria
            </Button>
            <Button
              size="sm"
              onClick={onStartTour}
              className="text-xs bg-gradient-gold text-background hover:opacity-95 font-semibold gap-1.5 shadow-md flex-1 sm:flex-none"
            >
              Testar novidades agora
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
