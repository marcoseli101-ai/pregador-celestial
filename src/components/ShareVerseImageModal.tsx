import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Share2,
  Image as ImageIcon,
  Check,
  Loader2,
  Sparkles,
  Layers,
  Palette,
} from "lucide-react";
import { toast } from "sonner";

interface ShareVerseImageModalProps {
  verseText?: string;
  reference?: string;
  translationCode?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultVerseText?: string;
  defaultReference?: string;
  defaultVersion?: string;
}

const THEMES = [
  {
    id: "gold-celestial",
    name: "Dourado Celestial",
    bgClass: "bg-gradient-to-br from-[#0b132b] via-[#1c2541] to-[#0b132b]",
    borderClass: "border-amber-500/40",
    textClass: "text-white",
    quoteClass: "text-amber-300",
    accentClass: "text-amber-400",
  },
  {
    id: "sunset-mount",
    name: "Monte ao Entardecer",
    bgClass: "bg-gradient-to-br from-[#2b1055] via-[#75225b] to-[#b83b5e]",
    borderClass: "border-pink-400/40",
    textClass: "text-white",
    quoteClass: "text-amber-200",
    accentClass: "text-amber-300",
  },
  {
    id: "deep-emerald",
    name: "Oliveiras & Vida",
    bgClass: "bg-gradient-to-br from-[#062c20] via-[#0f4c3a] to-[#062c20]",
    borderClass: "border-emerald-400/40",
    textClass: "text-white",
    quoteClass: "text-emerald-200",
    accentClass: "text-amber-300",
  },
  {
    id: "parchment-sacred",
    name: "Pergaminho Sagrado",
    bgClass: "bg-gradient-to-br from-[#fbf8f1] via-[#f4eee1] to-[#e8dec8]",
    borderClass: "border-amber-700/30",
    textClass: "text-[#1f1b16]",
    quoteClass: "text-[#b45309]",
    accentClass: "text-[#92400e]",
  },
];

export function ShareVerseImageModal({
  verseText: propVerseText,
  reference: propReference,
  translationCode: propTranslationCode,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  defaultVerseText,
  defaultReference,
  defaultVersion,
}: ShareVerseImageModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen! : setInternalOpen;

  const resolvedVerseText =
    propVerseText ||
    defaultVerseText ||
    "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.";
  const resolvedReference = propReference || defaultReference || "Salmos 119:105";
  const resolvedVersion = propTranslationCode || defaultVersion || "ACF";

  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [format, setFormat] = useState<"square" | "story">("square");
  const [generating, setGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const cleanVerseText = (resolvedVerseText || "").replace(/^[0-9]+\s*/, "").trim();

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `versiculo-${resolvedReference.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Imagem baixada com alta resolução!");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao gerar imagem.");
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `versiculo-${resolvedReference}.png`, { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: resolvedReference,
            text: `"${cleanVerseText}" — ${resolvedReference} (${resolvedVersion})`,
          });
        } else {
          // Fallback download
          handleDownload();
        }
      });
    } catch (e) {
      console.error(e);
      handleDownload();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl border-amber-500/40 text-amber-500 hover:bg-amber-500/10"
          >
            <ImageIcon className="h-4 w-4" /> Compartilhar imagem
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-lg glass-card border border-border/80 shadow-2xl rounded-3xl p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" /> Compartilhar Versículo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-3">
          {/* Format Selection (1:1 or 9:16) */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Formato:
            </span>
            <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-xl border border-border/70">
              <button
                onClick={() => setFormat("square")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  format === "square"
                    ? "bg-amber-500 text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                1:1 Feed / Card
              </button>
              <button
                onClick={() => setFormat("story")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  format === "story"
                    ? "bg-amber-500 text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                9:16 Stories
              </button>
            </div>
          </div>

          {/* Theme Palette Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Estilo Visual:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-2 rounded-xl text-left border text-xs font-medium transition-all ${
                    selectedTheme.id === theme.id
                      ? "border-amber-500 bg-amber-500/15 text-foreground shadow-xs"
                      : "border-border/70 hover:border-amber-500/40 text-muted-foreground"
                  }`}
                >
                  <div
                    className={`h-4 w-full rounded-md mb-1.5 ${theme.bgClass}`}
                  />
                  <span className="truncate block text-[11px] font-bold">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Card Preview (Captured by html2canvas) */}
          <div className="overflow-hidden flex items-center justify-center p-2 bg-black/20 rounded-2xl border border-border/50">
            <div
              ref={cardRef}
              className={`${selectedTheme.bgClass} ${selectedTheme.borderClass} ${selectedTheme.textClass} border shadow-2xl rounded-3xl p-8 flex flex-col justify-between text-center relative overflow-hidden transition-all duration-300 ${
                format === "square"
                  ? "w-full max-w-[380px] aspect-square"
                  : "w-full max-w-[340px] aspect-[9/16] py-14"
              }`}
            >
              {/* Sacred subtle watermark */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.4)_0%,transparent_60%)] pointer-events-none" />

              {/* Header inside card */}
              <div className="relative z-10 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-widest text-white/90">
                  <Sparkles className="h-3 w-3 text-amber-300" /> Pregador Fiel
                </span>
              </div>

              {/* Verse Quote */}
              <div className="relative z-10 my-auto py-4">
                <blockquote
                  className={`font-serif italic font-medium leading-relaxed ${
                    format === "square" ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
                  } ${selectedTheme.quoteClass} drop-shadow-md`}
                >
                  “{cleanVerseText}”
                </blockquote>
              </div>

              {/* Footer inside card */}
              <div className="relative z-10 space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-6 h-px bg-white/30" />
                  <p className={`font-serif font-black tracking-wider uppercase text-sm sm:text-base ${selectedTheme.accentClass}`}>
                    {resolvedReference}
                  </p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white/10 text-white/80 font-bold">
                    {resolvedVersion}
                  </span>
                  <div className="w-6 h-px bg-white/30" />
                </div>
                <p className="text-[9px] uppercase tracking-widest text-white/60">
                  pregador.site
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDownload}
              disabled={generating}
              className="flex-1 bg-gradient-gold text-background hover:opacity-90 font-bold gap-2 rounded-2xl shadow-md h-12"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Baixar Imagem PNG
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              disabled={generating}
              className="gap-2 rounded-2xl border-border/80 h-12 px-5"
              title="Compartilhar"
            >
              <Share2 className="h-4 w-4" /> Compartilhar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
