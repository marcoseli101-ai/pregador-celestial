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
  ChevronDown,
  ChevronUp,
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
  const [showAllBackgrounds, setShowAllBackgrounds] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(true);

  // Hidden 1080p master export card reference
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
    img.onerror = () => setImageLoaded(true); // fallback to gradient
  }, [currentBgUrl]);

  // Calculate dynamic font size to fit short, medium and long verses
  const textLength = cleanVerseText.length;
  const baseFontSizeClass = useMemo(() => {
    if (format === "story") {
      if (textLength > 300) return "text-sm sm:text-base leading-relaxed";
      if (textLength > 180) return "text-base sm:text-lg leading-relaxed";
      if (textLength > 100) return "text-lg sm:text-xl leading-relaxed";
      return "text-xl sm:text-2xl leading-relaxed";
    } else {
      if (textLength > 300) return "text-xs sm:text-sm leading-relaxed";
      if (textLength > 180) return "text-sm sm:text-base leading-relaxed";
      if (textLength > 100) return "text-base sm:text-lg leading-relaxed";
      return "text-lg sm:text-xl leading-relaxed";
    }
  }, [textLength, format]);

  // Dynamic font size for master 1080p export
  const masterFontSizePx = useMemo(() => {
    let size = 44;
    if (format === "story") {
      if (textLength > 300) size = 34;
      else if (textLength > 180) size = 40;
      else if (textLength > 100) size = 48;
      else size = 56;
    } else {
      if (textLength > 300) size = 30;
      else if (textLength > 180) size = 36;
      else if (textLength > 100) size = 44;
      else size = 52;
    }
    return Math.max(22, size + fontSizeDelta * 4);
  }, [textLength, format, fontSizeDelta]);

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

    // Ensure asset is decoded
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

    // Enforce exact 1080x1080 or 1080x1920 output
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
          // Native file sharing not supported: download directly
          const link = document.createElement("a");
          link.download = filename;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          toast.success(
            "Imagem baixada em alta resolução! Você pode publicá-la em suas redes sociais."
          );
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

        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto glass-card border border-border/80 shadow-2xl rounded-3xl p-4 sm:p-7">
          <DialogHeader className="pb-2 border-b border-border/40">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="font-serif text-lg sm:text-2xl font-bold flex items-center gap-2 text-foreground">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Compartilhar Versículo
              </DialogTitle>
              <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px] font-mono font-bold">
                {format === "square" ? "1080 × 1080 px" : "1080 × 1920 px"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground text-left">
              Gere artes com fundos fotográficos bíblicos e fidelidade ao texto das Escrituras.
            </p>
          </DialogHeader>

          <div className="space-y-5 pt-3">
            {/* 1. Format Selection & Quick Customizations Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/40 p-2.5 rounded-2xl border border-border/60">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline mr-1">
                  Formato:
                </span>
                <button
                  type="button"
                  onClick={() => setFormat("square")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    format === "square"
                      ? "bg-gradient-gold text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  1:1 Feed / Card
                </button>
                <button
                  type="button"
                  onClick={() => setFormat("story")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    format === "story"
                      ? "bg-gradient-gold text-background shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  9:16 Stories
                </button>
              </div>

              {/* Contrast and Font Adjustment Tools */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/50 text-[11px]">
                  <SunMedium className="h-3.5 w-3.5 text-muted-foreground ml-1" />
                  <button
                    onClick={() => setContrastLevel("soft")}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                      contrastLevel === "soft"
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Contraste suave"
                  >
                    Suave
                  </button>
                  <button
                    onClick={() => setContrastLevel("normal")}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                      contrastLevel === "normal"
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Contraste equilibrado"
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setContrastLevel("high")}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-medium transition-all ${
                      contrastLevel === "high"
                        ? "bg-amber-500/20 text-amber-400 font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title="Alto contraste"
                  >
                    Forte
                  </button>
                </div>

                <div className="flex items-center gap-0.5 bg-background/60 p-1 rounded-xl border border-border/50 text-[11px]">
                  <Type className="h-3.5 w-3.5 text-muted-foreground ml-1 mr-0.5" />
                  <button
                    onClick={() => setFontSizeDelta((p) => Math.max(-2, p - 1))}
                    className="h-6 w-6 rounded-md hover:bg-accent/20 text-xs font-bold flex items-center justify-center text-muted-foreground hover:text-foreground"
                    title="Diminuir tamanho do texto"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeDelta((p) => Math.min(3, p + 1))}
                    className="h-6 w-6 rounded-md hover:bg-accent/20 text-xs font-bold flex items-center justify-center text-muted-foreground hover:text-foreground"
                    title="Aumentar tamanho do texto"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Visual Backgrounds Library */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Sliders className="h-3.5 w-3.5 text-amber-500" />
                  Biblioteca de Fundos Bíblicos
                </span>

                <button
                  type="button"
                  onClick={() => setShowAllBackgrounds(!showAllBackgrounds)}
                  className="text-xs font-semibold text-amber-500 hover:text-amber-400 flex items-center gap-1"
                >
                  {showAllBackgrounds ? (
                    <>
                      Ver compacto <ChevronUp className="h-3.5 w-3.5" />
                    </>
                  ) : (
                    <>
                      Ver todos (10) <ChevronDown className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {VERSE_BACKGROUND_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                      selectedCategory === cat.id
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/50 font-bold"
                        : "bg-card/60 text-muted-foreground border-border/60 hover:text-foreground hover:border-border"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Background Cards Grid / Horizontal Scroll */}
              <div
                className={`transition-all duration-300 ${
                  showAllBackgrounds
                    ? "grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-[280px] overflow-y-auto pr-1"
                    : "flex gap-2.5 overflow-x-auto pb-2 scrollbar-none"
                }`}
              >
                {filteredBackgrounds.map((bg) => {
                  const isSelected = selectedTheme.id === bg.id;
                  return (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setSelectedTheme(bg)}
                      className={`group relative rounded-2xl overflow-hidden border text-left transition-all duration-200 shrink-0 ${
                        showAllBackgrounds ? "w-full" : "w-[124px] sm:w-[136px]"
                      } ${
                        isSelected
                          ? "ring-2 ring-amber-500 border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]"
                          : "border-border/70 hover:border-amber-500/50 hover:scale-[1.01]"
                      }`}
                    >
                      {/* Thumbnail Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        <img
                          src={bg.thumbUrl}
                          alt={bg.name}
                          loading="lazy"
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback gradient if thumb image fails
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className={`absolute inset-0 ${bg.fallbackGradient} -z-10`} />

                        {/* Selected Indicator Checkmark */}
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-background shadow-md">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Theme Name Footer */}
                      <div className="p-2 bg-card/90 backdrop-blur-sm border-t border-border/50">
                        <span
                          className={`block text-[11px] font-bold truncate leading-tight ${
                            isSelected ? "text-amber-400" : "text-foreground"
                          }`}
                        >
                          {bg.name}
                        </span>
                        <span className="block text-[9px] text-muted-foreground truncate leading-tight mt-0.5">
                          {bg.tagline}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Live Preview Area */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block text-center">
                Pré-visualização Dinâmica:
              </span>

              <div className="overflow-hidden flex items-center justify-center p-3 sm:p-5 bg-black/40 rounded-3xl border border-border/60">
                <div
                  ref={previewCardRef}
                  className={`relative overflow-hidden rounded-3xl border border-border/80 shadow-2xl flex flex-col justify-between text-center transition-all duration-300 select-none ${
                    selectedTheme.fallbackGradient
                  } ${
                    format === "square"
                      ? "w-full max-w-[360px] aspect-square p-6 sm:p-8"
                      : "w-full max-w-[300px] aspect-[9/16] p-6 sm:p-8 py-12 sm:py-14"
                  }`}
                >
                  {/* Real Photo Background */}
                  <img
                    src={currentBgUrl}
                    alt={selectedTheme.name}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: imageLoaded ? 1 : 0.6 }}
                  />

                  {/* Contrast Protective Overlays */}
                  <div className={`absolute inset-0 ${selectedTheme.overlayClass}`} />
                  <div className={`absolute inset-0 ${contrastOverlayStyle}`} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

                  {/* Header: Sacred Brand Badge */}
                  <div className="relative z-10 flex items-center justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border text-[10px] font-black uppercase tracking-widest shadow-md ${selectedTheme.badgeBg}`}
                    >
                      <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" /> PREGADOR FIEL
                    </span>
                  </div>

                  {/* Verse Text (Quote with Auto-scaling) */}
                  <div className="relative z-10 my-auto py-3 px-2">
                    <blockquote
                      className={`font-serif italic font-medium leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] ${baseFontSizeClass} ${selectedTheme.quoteColor}`}
                    >
                      “{cleanVerseText}”
                    </blockquote>
                  </div>

                  {/* Footer: Scripture Reference & Watermark */}
                  <div className="relative z-10 space-y-1.5 pt-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-px bg-white/40" />
                      <p
                        className={`font-serif font-black tracking-wider uppercase text-sm sm:text-base drop-shadow-md ${selectedTheme.accentColor}`}
                      >
                        {resolvedReference}
                      </p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/40 border border-white/20 text-white font-bold backdrop-blur-xs">
                        {resolvedVersion}
                      </span>
                      <div className="w-5 h-px bg-white/40" />
                    </div>

                    <p className="text-[9px] uppercase tracking-widest text-white/70 font-semibold drop-shadow-sm">
                      pregador.site
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Action Buttons (Export PNG & Share) */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleDownload}
                disabled={generating}
                className="flex-1 bg-gradient-gold text-background hover:opacity-95 font-bold gap-2 rounded-2xl shadow-gold h-12 text-sm"
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
                className="gap-2 rounded-2xl border-border/80 h-12 px-6 hover:bg-accent/15 text-sm font-semibold"
                title="Compartilhar imagem"
              >
                <Share2 className="h-4 w-4" /> Compartilhar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====================================================================
          5. HIDDEN MASTER EXPORT ELEMENT (Strict 1080x1080 or 1080x1920 Stage)
          Ensures crystal-sharp 1080p output on every device.
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

        {/* Top Header Badge */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            paddingTop: format === "square" ? "75px" : "160px",
            display: "flex",
            justifyContent: "center",
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

        {/* Main Verse Quote */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            padding: format === "square" ? "0 90px" : "0 80px",
            margin: "auto 0",
          }}
        >
          <blockquote
            style={{
              fontFamily: "Merriweather, Cormorant Garamond, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: `${masterFontSizePx}px`,
              lineHeight: 1.6,
              color: "#ffffff",
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.95), 0 2px 6px rgba(0,0,0,0.8)",
              wordBreak: "break-word",
            }}
          >
            “{cleanVerseText}”
          </blockquote>
        </div>

        {/* Footer: Reference, Version and Watermark */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            paddingBottom: format === "square" ? "75px" : "150px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
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
