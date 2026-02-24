import { useState, useCallback } from "react";
import { Presentation, ChevronLeft, ChevronRight, Download, X, FileText, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

type SlideType = "title" | "subtitle" | "content" | "verse" | "conclusion";

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

function extractPageContent(): string {
  const main = document.querySelector("main");
  if (!main) return "";
  const clone = main.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("button, nav, header, footer, script, style, svg, img, input, select, textarea").forEach(el => el.remove());
  const text = clone.innerText || clone.textContent || "";
  return text.replace(/\s+/g, " ").trim();
}

const SLIDE_COLORS: Record<SlideType, { bg: string; accent: string }> = {
  title: { bg: "#1a365d", accent: "#d4a017" },
  subtitle: { bg: "#1e3a5f", accent: "#c9961a" },
  content: { bg: "#ffffff", accent: "#1a365d" },
  verse: { bg: "#f7f3e9", accent: "#8b6914" },
  conclusion: { bg: "#1a365d", accent: "#d4a017" },
};

function SlidePreview({ slide, index, total }: { slide: Slide; index: number; total: number }) {
  const colors = SLIDE_COLORS[slide.type] || SLIDE_COLORS.content;
  const isDark = slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion";

  return (
    <div
      className="w-full aspect-video rounded-lg shadow-xl overflow-hidden relative flex flex-col items-center justify-center p-8 md:p-12"
      style={{ background: colors.bg }}
    >
      {/* Decorative accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: colors.accent }} />

      {slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion" ? (
        <div className="text-center space-y-4 max-w-[85%]">
          <h2
            className="font-bold leading-tight"
            style={{
              color: isDark ? "#fff" : colors.accent,
              fontSize: "clamp(1.4rem, 4vw, 2.5rem)",
            }}
          >
            {slide.heading}
          </h2>
          {slide.bullets?.map((b, i) => (
            <p key={i} className="text-base md:text-lg" style={{ color: isDark ? "rgba(255,255,255,0.85)" : "#333" }}>
              {b}
            </p>
          ))}
          {slide.verse && (
            <p className="italic text-sm md:text-base mt-4" style={{ color: colors.accent }}>
              {slide.verse}
            </p>
          )}
        </div>
      ) : (
        <div className="w-full max-w-[90%] space-y-4">
          <h3
            className="font-bold text-lg md:text-2xl mb-4"
            style={{ color: colors.accent }}
          >
            {slide.heading}
          </h3>
          <ul className="space-y-2">
            {slide.bullets?.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm md:text-base" style={{ color: "#222" }}>
                <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors.accent }} />
                {b}
              </li>
            ))}
          </ul>
          {slide.verse && (
            <blockquote
              className="border-l-4 pl-4 italic text-sm md:text-base mt-4"
              style={{ borderColor: colors.accent, color: "#555" }}
            >
              {slide.verse}
            </blockquote>
          )}
        </div>
      )}

      <div className="absolute bottom-3 right-4 text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "#999" }}>
        {index + 1} / {total}
      </div>
    </div>
  );
}

export function SlideGenerator() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slideData, setSlideData] = useState<SlideData | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const generate = useCallback(async () => {
    const content = extractPageContent();
    if (content.length < 50) {
      toast({ title: "Conteúdo insuficiente", description: "Navegue até uma página com conteúdo para gerar slides.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setSlideData(null);
    setCurrentSlide(0);
    setOpen(true);

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
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const downloadPDF = useCallback(() => {
    if (!slideData) return;
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: [254, 190.5] });

    slideData.slides.forEach((slide, i) => {
      if (i > 0) pdf.addPage();
      const colors = SLIDE_COLORS[slide.type] || SLIDE_COLORS.content;
      const isDark = slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion";

      // Background
      const hex = colors.bg;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      pdf.setFillColor(r, g, b);
      pdf.rect(0, 0, 254, 190.5, "F");

      // Accent bar
      const ar = parseInt(colors.accent.slice(1, 3), 16);
      const ag = parseInt(colors.accent.slice(3, 5), 16);
      const ab = parseInt(colors.accent.slice(5, 7), 16);
      pdf.setFillColor(ar, ag, ab);
      pdf.rect(0, 0, 254, 3, "F");

      // Heading
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(isDark ? 28 : 22);
      pdf.setTextColor(isDark ? 255 : ar, isDark ? 255 : ag, isDark ? 255 : ab);
      const headLines = pdf.splitTextToSize(slide.heading, 220);
      const startY = isDark ? 60 : 20;
      pdf.text(headLines, isDark ? 127 : 17, startY, isDark ? { align: "center" } : undefined);

      // Bullets
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(isDark ? 230 : 50, isDark ? 230 : 50, isDark ? 230 : 50);
      let bulletY = startY + headLines.length * 12 + 10;
      slide.bullets?.forEach((bullet) => {
        const lines = pdf.splitTextToSize(`• ${bullet}`, 215);
        if (bulletY + lines.length * 7 < 175) {
          pdf.text(lines, isDark ? 127 : 20, bulletY, isDark ? { align: "center" } : undefined);
          bulletY += lines.length * 7 + 3;
        }
      });

      // Verse
      if (slide.verse) {
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(12);
        pdf.setTextColor(ar, ag, ab);
        const vLines = pdf.splitTextToSize(slide.verse, 200);
        pdf.text(vLines, isDark ? 127 : 25, Math.min(bulletY + 5, 165), isDark ? { align: "center" } : undefined);
      }

      // Page number
      pdf.setFontSize(9);
      pdf.setTextColor(isDark ? 150 : 180, isDark ? 150 : 180, isDark ? 150 : 180);
      pdf.text(`${i + 1} / ${slideData.slides.length}`, 244, 185, { align: "right" });
    });

    pdf.save(`${slideData.title || "slides"}.pdf`);
    toast({ title: "PDF baixado com sucesso!" });
  }, [slideData]);

  const downloadPPTX = useCallback(async () => {
    if (!slideData) return;
    const PptxGenJS = (await import("pptxgenjs")).default;
    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";

    slideData.slides.forEach((slide) => {
      const colors = SLIDE_COLORS[slide.type] || SLIDE_COLORS.content;
      const isDark = slide.type === "title" || slide.type === "subtitle" || slide.type === "conclusion";
      const pSlide = pptx.addSlide();

      pSlide.background = { color: colors.bg.replace("#", "") };

      // Accent bar
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: "100%", h: 0.08,
        fill: { color: colors.accent.replace("#", "") },
      });

      if (isDark) {
        pSlide.addText(slide.heading, {
          x: 0.5, y: 1.5, w: "90%", h: 1.5,
          fontSize: 36, bold: true, color: "FFFFFF",
          align: "center", valign: "middle",
        });
        const bulletText = (slide.bullets || []).map(b => ({ text: b, options: { fontSize: 18, color: "E6E6E6", bullet: false, breakLine: true } }));
        if (bulletText.length) {
          pSlide.addText(bulletText, { x: 0.8, y: 3.2, w: "85%", h: 2.5, align: "center", valign: "top" });
        }
      } else {
        pSlide.addText(slide.heading, {
          x: 0.5, y: 0.3, w: "90%", h: 1,
          fontSize: 28, bold: true, color: colors.accent.replace("#", ""),
          valign: "top",
        });
        const bulletText = (slide.bullets || []).map(b => ({
          text: b,
          options: { fontSize: 16, color: "333333", bullet: { type: "bullet" as const }, breakLine: true },
        }));
        if (bulletText.length) {
          pSlide.addText(bulletText, { x: 0.8, y: 1.5, w: "85%", h: 3.5, valign: "top" });
        }
      }

      if (slide.verse) {
        pSlide.addText(slide.verse, {
          x: 0.8, y: isDark ? 5 : 4.5, w: "85%", h: 0.7,
          fontSize: 13, italic: true, color: colors.accent.replace("#", ""),
          align: isDark ? "center" : "left",
        });
      }
    });

    await pptx.writeFile({ fileName: `${slideData.title || "slides"}.pptx` });
    toast({ title: "PowerPoint baixado com sucesso!" });
  }, [slideData]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={generate}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
        aria-label="Gerar Slides com IA"
      >
        <Presentation className="h-5 w-5" />
        <span className="hidden sm:inline text-sm font-medium">Gerar Slides com IA</span>
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Presentation className="h-5 w-5 text-primary" />
                {slideData ? slideData.title : "Gerando Slides..."}
              </h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">A IA está criando seus slides...</p>
                </div>
              ) : slideData ? (
                <SlidePreview
                  slide={slideData.slides[currentSlide]}
                  index={currentSlide}
                  total={slideData.slides.length}
                />
              ) : null}
            </div>

            {/* Footer controls */}
            {slideData && !loading && (
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentSlide === 0}
                    onClick={() => setCurrentSlide(c => c - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground min-w-[60px] text-center">
                    {currentSlide + 1} / {slideData.slides.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentSlide === slideData.slides.length - 1}
                    onClick={() => setCurrentSlide(c => c + 1)}
                  >
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
      )}
    </>
  );
}
