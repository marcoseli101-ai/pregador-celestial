import React, { useState, useRef, useEffect, useMemo } from "react";
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
  Sliders,
  Type,
  SunMedium,
} from "lucide-react";
import { toast } from "sonner";
import {
  VERSE_BACKGROUNDS,
  VERSE_BACKGROUND_CATEGORIES,
  VerseBackgroundTheme,
} from "@/data/verseBackgrounds";

export interface ShareVerseImageModalProps {
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
  const resolvedVersion = propTranslationCode || defaultVersion || "ARC";

  const [selectedTheme, setSelectedTheme] = useState<VerseBackgroundTheme>(
    VERSE_BACKGROUNDS[0]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [format, setFormat] = useState<"square" | "story">("square");
  const [contrastLevel, setContrastLevel] = useState<"normal" | "high" | "soft">("normal");
  const [fontSizeDelta, setFontSizeDelta] = useState<number>(0);
  const [generating, setGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  // References
  const exportCardRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);

  const cleanVerseText = useMemo(() => {
    return (resolvedVerseText || "").replace(/^[0-9]+\s*/, "").trim();
  }, [resolvedVerseText]);

  // Filter backgrounds based on active tab
  const filteredBackgrounds = useMemo(() => {
    if (selectedCategory === "todos") return VERSE_BACKGROUNDS;
    return VERSE_BACKGROUNDS.filter((bg) => bg.category === selectedCategory);
  }, [selectedCategory]);

  // Current background image URL based on selected format
  const currentBgUrl = useMemo(() => {
    return format === "square" ? selectedTheme.feedUrl : selectedTheme.storyUrl;
  }, [format, selectedTheme]);

  // Preload background image whenever it changes
  useEffect(() => {
    setImageLoaded(false);
    const img = new Image();
    img.src = currentBgUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, [currentBgUrl]);

  // Character count to dynamically scale font size
  const textLength = cleanVerseText.length;

  // Auto-calculated compact font size for preview card
  // Guarantees that even very long verses (e.g. 1 Coríntios 13:4-7 with ~290 chars)
  // fit comfortably without clipping or pushing the biblical reference out.
  const previewFontSize = useMemo(() => {
    let size = 13;
    if (format === "story") {
      if (textLength > 320) size = 9.5;
      else if (textLength > 240) size = 10.5;
      else if (textLength > 160) size = 12;
      else if (textLength > 90) size = 13.5;
      else size = 15.5;
    } else {
      // Square card
      if (textLength > 320) size = 8.5;
      else if (textLength > 240) size = 9.5;
      else if (textLength > 160) size = 11;
      else if (textLength > 90) size = 12.5;
      else size = 14.5;
    }
    return Math.max(7.5, size + fontSizeDelta * 0.75);
  }, [textLength, format, fontSizeDelta]);

  const previewLineHeight = useMemo(() => {
    if (textLength > 240) return 1.34;
    if (textLength > 160) return 1.42;
    return 1.48;
  }, [textLength]);

  // Auto-calculated font size for master 1080p export
  const masterFontSizePx = useMemo(() => {
    let size = 44;
    if (format === "story") {
      if (textLength > 320) size = 26;
      else if (textLength > 240) size = 30;
      else if (textLength > 160) size = 36;
      else if (textLength > 90) size = 44;
      else size = 54;
    } else {
      // Square 1080x1080
      if (textLength > 320) size = 22;
      else if (textLength > 240) size = 26;
      else if (textLength > 160) size = 32;
      else if (textLength > 90) size = 38;
      else size = 48;
    }
    return Math.max(18, size + fontSizeDelta * 3);
  }, [textLength, format, fontSizeDelta]);

  const masterLineHeight = useMemo(() => {
    if (textLength > 240) return 1.38;
    if (textLength > 160) return 1.46;
    return 1.55;
  }, [textLength]);

  // Overlay opacity based on contrast level
  const contrastOverlayStyle = useMemo(() => {
    if (contrastLevel === "high") return "bg-black/65";
    if (contrastLevel === "soft") return "bg-black/35";
    return "bg-black/45";
  }, [contrastLevel]);

  // Helper to preload image before capturing canvas
  const ensureImageReady = async (url: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      if (img.complete) return resolve(true);
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  const generateMasterCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!exportCardRef.current) return null;

    await ensureImageReady(currentBgUrl);

    const targetWidth = 1080;
    const targetHeight = format === "square" ? 1080 : 1920;

    const rawCanvas = await html2canvas(exportCardRef.current, {
      scale: 1,
      width: targetWidth,
      height: targetHeight,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
    });

    const exactCanvas = document.createElement("canvas");
    exactCanvas.width = targetWidth;
    exactCanvas.height = targetHeight;
    const ctx = exactCanvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(rawCanvas, 0, 0, targetWidth, targetHeight);
      return exactCanvas;
    }
    return rawCanvas;
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      const canvas = await generateMasterCanvas();
      if (!canvas) throw new Error("Falha ao gerar canvas.");

      const filename = `versiculo-${resolvedReference.replace(/[^a-zA-Z0-9]/g, "_")}-${format === "square" ? "feed" : "story"}.png`;
      const dataUrl = canvas.toDataURL("image/png", 1.0);

      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      link.click();

      toast.success(
        `Imagem exportada com sucesso em ${format === "square" ? "1080×1080 px (Feed)" : "1080×1920 px (Stories)"}!`
      );
    } catch (e) {
      console.error("Erro no download:", e);
      toast.error("Ocorreu um erro ao gerar a imagem. Tente novamente.");
    } finally {
      setGenerating(false);
    }
  };

  const handleShare = async () => {
    setGenerating(true);
    try {
      const canvas = await generateMasterCanvas();
      if (!canvas) throw new Error("Falha ao gerar canvas.");

      const filename = `versiculo-${resolvedReference.replace(/[^a-zA-Z0-9]/g, "_")}-${format === "square" ? "feed" : "story"}.png`;

      canvas.toBlob(async (blob) => {
        if (!blob) {
          handleDownload();
          return;
        }

        const file = new File([blob], filename, { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: `${resolvedReference} — Pregador Fiel`,
              text: `“${cleanVerseText}” — ${resolvedReference} (${resolvedVersion})\n\nEstudo Bíblico & Pregação no Pregador Fiel`,
            });
            toast.success("Arte compartilhada com sucesso!");
          } catch (err: any) {
            if (err?.name !== "AbortError") {
              handleDownload();
            }
          }
        } else {
          const link = document.createElement("a");
          link.download = filename;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          toast.success("Imagem baixada em alta resolução para compartilhamento!");
        }
      }, "image/png", 1.0);
    } catch (e) {
      console.error("Erro no compartilhamento:", e);
      handleDownload();
    } finally {
      setGenerating(false);
    }
  };

  return (
    <>
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

        <DialogContent className="w-[96vw] max-w-4xl max-h-[92vh] overflow-y-auto overflow-x-hidden glass-card border border-border/80 shadow-2xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6">
          {/* Dialog Header */}
          <DialogHeader className="pb-2.5 border-b border-border/40">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="font-serif text-base sm:text-xl font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="h-4 sm:h-5 w-4 sm:w-5 text-amber-500 shrink-0" />
                <span>Compartilhar Versículo</span>
              </DialogTitle>
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-mono font-bold shrink-0">
                {format === "square" ? "1080 × 1080 px" : "1080 × 1920 px"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground text-left line-clamp-1">
              Artes prontas para Feed e Stories com fundos fotográficos e fidelidade às Escrituras.
            </p>
          </DialogHeader>

          {/* Responsive 2-Column Desktop / 1-Column Mobile Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 pt-3 min-w-0">
            {/* =========================================================
                COLUMN 1 (Desktop Left / Mobile Top):
                Compact Preview & Export Action Buttons
               ========================================================= */}
            <div className="md:col-span-5 flex flex-col items-center justify-between gap-3 bg-muted/25 p-3 sm:p-4 rounded-2xl border border-border/50 min-w-0">
              {/* Format Toggle (Feed 1:1 vs Stories 9:16) */}
              <div className="flex items-center justify-center gap-1.5 w-full bg-background/70 p-1 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setFormat("square")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                    format === "square"
                      ? "bg-gradient-gold text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  1:1 Feed
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("story")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all text-center ${
                    format === "story"
                      ? "bg-gradient-gold text-background shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  9:16 Stories
                </button>
              </div>

              {/* Compact Preview Card Frame */}
              <div className="w-full flex items-center justify-center py-1 sm:py-2">
                <div
                  ref={previewCardRef}
                  style={{
                    width: format === "square" ? "230px" : "170px",
                    height: format === "square" ? "230px" : "302px",
                  }}
                  className={`relative overflow-hidden rounded-2xl border border-border/80 shadow-2xl flex flex-col justify-between text-center select-none shrink-0 transition-all duration-200 ${selectedTheme.fallbackGradient}`}
                >
                  {/* Background Photo */}
                  <img
                    src={currentBgUrl}
                    alt={selectedTheme.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: imageLoaded ? 1 : 0.6 }}
                  />

                  {/* Contrast Overlays */}
                  <div className={`absolute inset-0 ${selectedTheme.overlayClass}`} />
                  <div className={`absolute inset-0 ${contrastOverlayStyle}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

                  {/* 1. Header: Sacred Brand Badge (Strictly shrink-0) */}
                  <div className="relative z-10 shrink-0 pt-2.5 flex items-center justify-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full backdrop-blur-md border text-[9px] font-black uppercase tracking-widest shadow-md ${selectedTheme.badgeBg}`}
                    >
                      <Sparkles className="h-2.5 w-2.5 text-amber-300" /> PREGADOR FIEL
                    </span>
                  </div>

                  {/* 2. Verse Text: Middle Flex Area with Auto-fitting Font Size */}
                  <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-2.5 py-1 overflow-hidden">
                    <blockquote
                      style={{
                        fontSize: `${previewFontSize}px`,
                        lineHeight: previewLineHeight,
                      }}
                      className={`font-serif italic font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] text-center line-clamp-[10] ${selectedTheme.quoteColor}`}
                    >
                      “{cleanVerseText}”
                    </blockquote>
                  </div>

                  {/* 3. Footer: Scripture Reference & Watermark (Strictly shrink-0: NEVER CLIPPED) */}
                  <div className="relative z-10 shrink-0 pb-2.5 space-y-0.5">
                    <div className="flex items-center justify-center gap-1 px-1.5">
                      <div className="w-3.5 h-px bg-white/40 shrink-0" />
                      <p
                        className={`font-serif font-black tracking-wide uppercase text-[11px] truncate drop-shadow-md ${selectedTheme.accentColor}`}
                      >
                        {resolvedReference}
                      </p>
                      <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-black/50 border border-white/20 text-white font-bold shrink-0">
                        {resolvedVersion}
                      </span>
                      <div className="w-3.5 h-px bg-white/40 shrink-0" />
                    </div>

                    <p className="text-[8px] uppercase tracking-widest text-white/70 font-semibold drop-shadow-sm">
                      pregador.site
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons directly under preview */}
              <div className="w-full flex flex-col gap-2">
                <Button
                  onClick={handleDownload}
                  disabled={generating}
                  className="w-full bg-gradient-gold text-background hover:opacity-95 font-bold gap-2 rounded-xl shadow-gold h-10 text-xs sm:text-sm"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Baixar Imagem PNG ({format === "square" ? "1080×1080" : "1080×1920"})
                </Button>

                <Button
                  variant="outline"
                  onClick={handleShare}
                  disabled={generating}
                  className="w-full gap-2 rounded-xl border-border/80 h-9 hover:bg-accent/15 text-xs font-semibold"
                >
                  <Share2 className="h-3.5 w-3.5" /> Compartilhar
                </Button>
              </div>
            </div>

            {/* =========================================================
                COLUMN 2 (Desktop Right / Mobile Bottom):
                Backgrounds Library, Category Filters & Fine Controls
               ========================================================= */}
            <div className="md:col-span-7 flex flex-col justify-between gap-3 min-w-0">
              {/* Category Filter Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                    <Sliders className="h-3.5 w-3.5 text-amber-500" />
                    Biblioteca de Fundos ({VERSE_BACKGROUNDS.length})
                  </span>
                  <span className="text-[10px] text-muted-foreground hidden sm:inline">
                    Selecione um tema
                  </span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none max-w-full">
                  {VERSE_BACKGROUND_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border shrink-0 ${
                        selectedCategory === cat.id
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/50 font-bold"
                          : "bg-card/60 text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Backgrounds Grid: 5 columns on desktop/tablet, 2 on mobile */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-[260px] sm:max-h-[300px] md:max-h-[320px] overflow-y-auto pr-1">
                {filteredBackgrounds.map((bg) => {
                  const isSelected = selectedTheme.id === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedTheme(bg)}
                      className={`group relative rounded-xl overflow-hidden border text-left transition-all duration-150 ${
                        isSelected
                          ? "ring-2 ring-amber-500 border-amber-400 shadow-md shadow-amber-500/20 scale-[1.01]"
                          : "border-border/70 hover:border-amber-500/50 hover:scale-[1.01]"
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        <img
                          src={bg.thumbUrl}
                          alt={bg.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className={`absolute inset-0 ${bg.fallbackGradient} -z-10`} />

                        {isSelected && (
                          <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-background shadow-md">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Theme Name */}
                      <div className="p-1.5 bg-card/90 backdrop-blur-sm border-t border-border/50">
                        <span
                          className={`block text-[10px] font-bold truncate leading-tight ${
                            isSelected ? "text-amber-400" : "text-foreground"
                          }`}
                        >
                          {bg.name}
                        </span>
                        <span className="block text-[8px] text-muted-foreground truncate leading-tight mt-0.5">
                          {bg.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Adjustments: Contrast & Font Size */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                {/* Contrast Tool */}
                <div className="flex items-center gap-1 text-[11px]">
                  <SunMedium className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                  <span className="text-[10px] text-muted-foreground font-semibold mr-1">Contraste:</span>
                  <button
                    onClick={() => setContrastLevel("soft")}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      contrastLevel === "soft"
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Suave
                  </button>
                  <button
                    onClick={() => setContrastLevel("normal")}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      contrastLevel === "normal"
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setContrastLevel("high")}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                      contrastLevel === "high"
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Forte
                  </button>
                </div>

                {/* Font Adjustment Tool */}
                <div className="flex items-center gap-1 text-[11px]">
                  <Type className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                  <span className="text-[10px] text-muted-foreground font-semibold mr-1">Texto:</span>
                  <button
                    onClick={() => setFontSizeDelta((p) => Math.max(-2, p - 1))}
                    className="h-6 w-6 rounded bg-card/60 hover:bg-accent/20 border border-border/40 text-[10px] font-bold flex items-center justify-center text-muted-foreground hover:text-foreground"
                    title="Diminuir texto"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeDelta(0)}
                    className="px-1.5 h-6 rounded bg-card/60 hover:bg-accent/20 border border-border/40 text-[9px] font-bold flex items-center justify-center text-muted-foreground hover:text-foreground"
                    title="Restaurar tamanho automático"
                  >
                    Auto
                  </button>
                  <button
                    onClick={() => setFontSizeDelta((p) => Math.min(3, p + 1))}
                    className="h-6 w-6 rounded bg-card/60 hover:bg-accent/20 border border-border/40 text-[10px] font-bold flex items-center justify-center text-muted-foreground hover:text-foreground"
                    title="Aumentar texto"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================================
          HIDDEN MASTER EXPORT ELEMENT (Strict 1080x1080 or 1080x1920 Stage)
          Ensures crystal-sharp 1080p output on every device without clipping.
         ==================================================================== */}
      <div
        ref={exportCardRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "1080px",
          height: format === "square" ? "1080px" : "1920px",
          pointerEvents: "none",
          zIndex: -999,
          overflow: "hidden",
        }}
        className={`relative flex flex-col justify-between text-center select-none ${selectedTheme.fallbackGradient}`}
      >
        {/* Full Resolution Photo Background */}
        <img
          src={currentBgUrl}
          alt={selectedTheme.name}
          crossOrigin="anonymous"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Contrast Overlay Layers */}
        <div className={`absolute inset-0 ${selectedTheme.overlayClass}`} />
        <div className={`absolute inset-0 ${contrastOverlayStyle}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.7)_100%)]" />

        {/* Top Header Badge (Strictly flexShrink: 0) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            paddingTop: format === "square" ? "65px" : "140px",
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 28px",
              borderRadius: "9999px",
              backgroundColor: "rgba(0, 0, 0, 0.45)",
              border: "1.5px solid rgba(245, 158, 11, 0.45)",
              color: "#fbbf24",
              fontSize: "18px",
              fontWeight: 800,
              letterSpacing: "3px",
              textTransform: "uppercase",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <Sparkles style={{ width: "22px", height: "22px", color: "#fcd34d" }} />
            PREGADOR FIEL
          </div>
        </div>

        {/* Main Verse Quote (Middle Flex Area) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: format === "square" ? "0 80px" : "0 70px",
            flex: 1,
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <blockquote
            style={{
              fontFamily: "Merriweather, Cormorant Garamond, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: `${masterFontSizePx}px`,
              lineHeight: masterLineHeight,
              color: "#ffffff",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0,0,0,0.8)",
              wordBreak: "break-word",
              margin: 0,
              textAlign: "center",
            }}
          >
            “{cleanVerseText}”
          </blockquote>
        </div>

        {/* Footer: Reference, Version and Watermark (Strictly flexShrink: 0 - NEVER CLIPPED) */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            paddingBottom: format === "square" ? "65px" : "130px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "12px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "18px",
            }}
          >
            <div style={{ width: "40px", height: "2px", backgroundColor: "rgba(245, 158, 11, 0.7)" }} />
            <p
              style={{
                fontFamily: "Merriweather, serif",
                fontWeight: 900,
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontSize: "26px",
                color: "#fcd34d",
                textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
                margin: 0,
              }}
            >
              {resolvedReference}
            </p>
            <span
              style={{
                fontSize: "14px",
                fontFamily: "monospace",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "8px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
              }}
            >
              {resolvedVersion}
            </span>
            <div style={{ width: "40px", height: "2px", backgroundColor: "rgba(245, 158, 11, 0.7)" }} />
          </div>

          <p
            style={{
              fontSize: "15px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "rgba(255, 255, 255, 0.75)",
              fontWeight: 600,
              margin: 0,
              textShadow: "0 2px 6px rgba(0, 0, 0, 0.8)",
            }}
          >
            pregador.site
          </p>
        </div>
      </div>
    </>
  );
}
