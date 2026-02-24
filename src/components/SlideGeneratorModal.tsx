import { useState, useCallback, useEffect } from "react";
import { Presentation, ChevronLeft, ChevronRight, X, FileText, File, Loader2, Sun, Moon, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

type SlideType = "title" | "subtitle" | "content" | "verse" | "conclusion";
type ThemeKey = "light" | "dark" | "colorful";

interface Slide {
  type: SlideType;
  heading: string;
  bullets?: string[];
  verse?: string;
}

interface SlideData {
  title: string;
  slides: Slide[];
}

const GENERATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-slides`;

const THEMES: Record<ThemeKey, { label: string; icon: typeof Sun; colors: Record<SlideType, { bg: string; fg: string; accent: string; bulletFg: string }> }> = {
  light: {
    label: "Claro",
    icon: Sun,
    colors: {
      title:      { bg: "#f8f6f1", fg: "#1a1a1a", accent: "#b8860b", bulletFg: "#333" },
      subtitle:   { bg: "#f3f0ea", fg: "#222", accent: "#8b6914", bulletFg: "#444" },
      content:    { bg: "#ffffff", fg: "#1a1a1a", accent: "#1a365d", bulletFg: "#333" },
      verse:      { bg: "#faf8f3", fg: "#333", accent: "#8b6914", bulletFg: "#555" },
      conclusion: { bg: "#f8f6f1", fg: "#1a1a1a", accent: "#b8860b", bulletFg: "#333" },
    },
  },
  dark: {
    label: "Escuro",
    icon: Moon,
    colors: {
      title:      { bg: "#0f172a", fg: "#f1f5f9", accent: "#d4a017", bulletFg: "#cbd5e1" },
      subtitle:   { bg: "#1e293b", fg: "#e2e8f0", accent: "#c9961a", bulletFg: "#94a3b8" },
      content:    { bg: "#1a2332", fg: "#e2e8f0", accent: "#60a5fa", bulletFg: "#94a3b8" },
      verse:      { bg: "#1e2d3d", fg: "#cbd5e1", accent: "#fbbf24", bulletFg: "#94a3b8" },
      conclusion: { bg: "#0f172a", fg: "#f1f5f9", accent: "#d4a017", bulletFg: "#cbd5e1" },
    },
  },
  colorful: {
    label: "Colorido",
    icon: Palette,
    colors: {
      title:      { bg: "#1e3a5f", fg: "#ffffff", accent: "#fbbf24", bulletFg: "#e0e7ff" },
      subtitle:   { bg: "#7c3aed", fg: "#ffffff", accent: "#fde68a", bulletFg: "#e0e7ff" },
      content:    { bg: "#ffffff", fg: "#1e293b", accent: "#7c3aed", bulletFg: "#374151" },
      verse:      { bg: "#fef3c7", fg: "#78350f", accent: "#b45309", bulletFg: "#92400e" },
      conclusion: { bg: "#065f46", fg: "#ffffff", accent: "#6ee7b7", bulletFg: "#d1fae5" },
    },
  },
};

function SlidePreview({ slide, index, total, theme }: { slide: Slide; index: number; total: number; theme: ThemeKey }) {
  const c = THEMES[theme].colors[slide.type] || THEMES[theme].colors.content;
  const isCentered = slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion";

  return (
    <div
      className="w-full aspect-video rounded-xl shadow-2xl overflow-hidden relative flex flex-col justify-center select-none"
      style={{ background: c.bg }}
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: c.accent }} />

      <div className={`flex-1 flex flex-col ${isCentered ? "items-center justify-center text-center" : "justify-center"} px-8 md:px-14 py-8 overflow-auto`}>
        <h2
          className="font-bold leading-snug mb-4"
          style={{
            color: c.fg,
            fontSize: "clamp(1.2rem, 3.5vw, 2.2rem)",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {slide.heading}
        </h2>

        {slide.bullets && slide.bullets.length > 0 && (
          <ul className={`space-y-2 ${isCentered ? "max-w-[85%]" : "max-w-[95%]"}`}>
            {slide.bullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-3 leading-relaxed"
                style={{
                  color: c.bulletFg,
                  fontSize: "clamp(0.85rem, 2vw, 1.15rem)",
                  wordBreak: "break-word",
                  overflowWrap: "anywhere",
                }}
              >
                {!isCentered && (
                  <span className="mt-2 w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.accent }} />
                )}
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}

        {slide.verse && (
          <blockquote
            className={`mt-4 italic leading-relaxed ${isCentered ? "" : "border-l-4 pl-4"}`}
            style={{
              color: c.accent,
              borderColor: c.accent,
              fontSize: "clamp(0.8rem, 1.8vw, 1rem)",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
            }}
          >
            {slide.verse}
          </blockquote>
        )}
      </div>

      {/* Slide number */}
      <div className="absolute bottom-3 right-4 text-xs" style={{ color: c.bulletFg, opacity: 0.6 }}>
        {index + 1} / {total}
      </div>
    </div>
  );
}

interface SlideGeneratorModalProps {
  content: string;
  open: boolean;
  onClose: () => void;
}

export function SlideGeneratorModal({ content, open, onClose }: SlideGeneratorModalProps) {
  const [loading, setLoading] = useState(false);
  const [slideData, setSlideData] = useState<SlideData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [theme, setTheme] = useState<ThemeKey | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setSlideData(null);
      setCurrentSlide(0);
      setTheme(null);
      setLoading(false);
    }
  }, [open]);

  const generate = useCallback(async () => {
    if (content.length < 50) {
      toast({ title: "Conteúdo insuficiente", description: "É necessário mais conteúdo para gerar slides.", variant: "destructive" });
      onClose();
      return;
    }
    setLoading(true);
    setSlideData(null);
    setCurrentSlide(0);

    try {
      const resp = await fetch(GENERATE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(err.error || `Erro ${resp.status}`);
      }

      const data: SlideData = await resp.json();
      if (!data.slides?.length) throw new Error("Nenhum slide gerado");
      setSlideData(data);
    } catch (e: any) {
      toast({ title: "Erro ao gerar slides", description: e.message, variant: "destructive" });
      onClose();
    } finally {
      setLoading(false);
    }
  }, [content, onClose]);

  const handleThemeSelect = (t: ThemeKey) => {
    setTheme(t);
    generate();
  };

  const getColors = (slideType: SlideType) => {
    const t = theme || "light";
    return THEMES[t].colors[slideType] || THEMES[t].colors.content;
  };

  const downloadPDF = useCallback(() => {
    if (!slideData || !theme) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [254, 190.5] });

    slideData.slides.forEach((slide, i) => {
      if (i > 0) pdf.addPage();
      const c = getColors(slide.type);
      const isCentered = slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion";

      const hexToRgb = (hex: string) => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

      const [br, bg, bb] = hexToRgb(c.bg);
      pdf.setFillColor(br, bg, bb);
      pdf.rect(0, 0, 254, 190.5, "F");

      const [ar, ag, ab] = hexToRgb(c.accent);
      pdf.setFillColor(ar, ag, ab);
      pdf.rect(0, 0, 254, 3, "F");

      const [fr, fg, fb] = hexToRgb(c.fg);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(isCentered ? 28 : 22);
      pdf.setTextColor(fr, fg, fb);
      const headLines = pdf.splitTextToSize(slide.heading, 220);
      const startY = isCentered ? 50 : 18;
      pdf.text(headLines, isCentered ? 127 : 17, startY, isCentered ? { align: "center" } : undefined);

      const [bfr, bfg, bfb] = hexToRgb(c.bulletFg);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(13);
      pdf.setTextColor(bfr, bfg, bfb);
      let bulletY = startY + headLines.length * 11 + 8;
      slide.bullets?.forEach((bullet) => {
        const lines = pdf.splitTextToSize(`• ${bullet}`, 215);
        if (bulletY + lines.length * 6.5 < 175) {
          pdf.text(lines, isCentered ? 127 : 20, bulletY, isCentered ? { align: "center" } : undefined);
          bulletY += lines.length * 6.5 + 3;
        }
      });

      if (slide.verse) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(11);
        pdf.setTextColor(ar, ag, ab);
        const vLines = pdf.splitTextToSize(slide.verse, 200);
        pdf.text(vLines, isCentered ? 127 : 25, Math.min(bulletY + 5, 165), isCentered ? { align: "center" } : undefined);
      }

      pdf.setFontSize(9);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`${i + 1} / ${slideData.slides.length}`, 244, 185, { align: "right" });
    });

    pdf.save(`${slideData.title || "slides"}.pdf`);
    toast({ title: "PDF baixado com sucesso!" });
  }, [slideData, theme]);

  const downloadPPTX = useCallback(async () => {
    if (!slideData || !theme) return;
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";

    slideData.slides.forEach((slide) => {
      const c = getColors(slide.type);
      const isCentered = slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion";
      const pSlide = pptx.addSlide();
      pSlide.background = { color: c.bg.replace("#", "") };
      pSlide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: c.accent.replace("#", "") } });

      pSlide.addText(slide.heading, {
        x: 0.5, y: isCentered ? 1.5 : 0.3, w: "90%", h: isCentered ? 1.5 : 1,
        fontSize: isCentered ? 36 : 28, bold: true,
        color: c.fg.replace("#", ""),
        align: isCentered ? "center" : "left",
        valign: isCentered ? "middle" : "top",
        shrinkText: true,
      });

      const bulletText = (slide.bullets || []).map(b => ({
        text: b,
        options: {
          fontSize: 16,
          color: c.bulletFg.replace("#", ""),
          bullet: isCentered ? false : { type: "bullet" as const },
          breakLine: true,
        },
      }));
      if (bulletText.length) {
        pSlide.addText(bulletText, {
          x: 0.8, y: isCentered ? 3.2 : 1.5, w: "85%", h: 3.5,
          align: isCentered ? "center" : "left",
          valign: "top",
          shrinkText: true,
        });
      }

      if (slide.verse) {
        pSlide.addText(slide.verse, {
          x: 0.8, y: isCentered ? 5 : 4.5, w: "85%", h: 0.8,
          fontSize: 13, italic: true,
          color: c.accent.replace("#", ""),
          align: isCentered ? "center" : "left",
          shrinkText: true,
        });
      }
    });

    await pptx.writeFile({ fileName: `${slideData.title || "slides"}.pptx` });
    toast({ title: "PowerPoint baixado com sucesso!" });
  }, [slideData, theme]);

  if (!open) return null;

  // Theme selection screen
  if (!theme && !loading && !slideData) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Presentation className="h-5 w-5 text-primary" />
              Escolha o Tema dos Slides
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground text-center">Selecione um estilo visual antes de gerar a apresentação:</p>
            <div className="grid grid-cols-3 gap-4">
              {(Object.entries(THEMES) as [ThemeKey, typeof THEMES["light"]][]).map(([key, t]) => {
                const Icon = t.icon;
                const preview = t.colors.title;
                return (
                  <button
                    key={key}
                    onClick={() => handleThemeSelect(key)}
                    className="group flex flex-col items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary transition-all hover:shadow-lg"
                  >
                    <div
                      className="w-full aspect-video rounded-lg flex items-center justify-center shadow-md"
                      style={{ background: preview.bg }}
                    >
                      <Icon className="h-8 w-8" style={{ color: preview.accent }} />
                    </div>
                    <span className="text-sm font-semibold text-foreground">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Presentation className="h-5 w-5 text-primary" />
            {slideData ? slideData.title : "Gerando Slides..."}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">A IA está criando seus slides...</p>
            </div>
          ) : slideData && theme ? (
            <SlidePreview slide={slideData.slides[currentSlide]} index={currentSlide} total={slideData.slides.length} theme={theme} />
          ) : null}
        </div>

        {slideData && !loading && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" disabled={currentSlide === 0} onClick={() => setCurrentSlide(c => c - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                {currentSlide + 1} / {slideData.slides.length}
              </span>
              <Button variant="outline" size="icon" disabled={currentSlide === slideData.slides.length - 1} onClick={() => setCurrentSlide(c => c + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={downloadPDF} className="gap-2">
                <FileText className="h-4 w-4" /> PDF
              </Button>
              <Button onClick={downloadPPTX} className="gap-2">
                <File className="h-4 w-4" /> PowerPoint
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
