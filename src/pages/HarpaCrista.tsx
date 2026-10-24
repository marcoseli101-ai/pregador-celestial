import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Music,
  Search,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Share2,
  Heart,
  Bookmark,
  Volume2,
  Sparkles,
  Sliders,
  Type,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  HARPA_HYMNS,
  getHymnByNumber,
  searchHymns,
  getHymnOfTheDay,
  type HarpHymn,
} from "@/data/harpaCrista";
import { usePersistedState } from "@/hooks/usePersistedState";

const POPULAR_HYMNS = [1, 15, 39, 77, 126, 141, 186, 192, 291, 300, 432, 545];

export default function HarpaCrista() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const hymnParam = searchParams.get("hino");
  const selectedNumber = hymnParam ? parseInt(hymnParam, 10) : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [fontSize, setFontSize] = usePersistedState<number>("harpa:fontSize", 18);
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = usePersistedState<number[]>("harpa:favorites", []);

  const selectedHymn = useMemo(() => {
    if (!selectedNumber) return null;
    return getHymnByNumber(selectedNumber) || null;
  }, [selectedNumber]);

  const filteredHymns = useMemo(() => {
    return searchHymns(searchQuery);
  }, [searchQuery]);

  const hymnOfTheDay = useMemo(() => getHymnOfTheDay(), []);

  const isFav = selectedHymn ? favorites.includes(selectedHymn.number) : false;

  const toggleFavorite = (num: number) => {
    if (favorites.includes(num)) {
      setFavorites(favorites.filter((f) => f !== num));
      toast.info(`Hino ${num} removido dos favoritos`);
    } else {
      setFavorites([...favorites, num]);
      toast.success(`Hino ${num} adicionado aos favoritos`);
    }
  };

  const handleSelectHymn = (num: number) => {
    setSearchParams({ hino: String(num) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSelection = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = () => {
    if (!selectedHymn) return;
    navigator.clipboard.writeText(
      `🎵 Harpa Cristã - Hino ${String(selectedHymn.number).padStart(3, "0")}: ${selectedHymn.title}\n\n${selectedHymn.fullText}\n\nVia Pregador Pro`
    );
    setCopied(true);
    toast.success("Letra copiada para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!selectedHymn) return;
    const text = `🎵 Harpa Cristã - Hino ${String(selectedHymn.number).padStart(3, "0")}: ${selectedHymn.title}\n\n${selectedHymn.fullText}`;
    if (navigator.share) {
      navigator.share({ title: `Harpa Cristã - Hino ${selectedHymn.number}`, text });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const goToHymn = (dir: number) => {
    if (!selectedHymn) return;
    const next = selectedHymn.number + dir;
    if (next >= 1 && next <= 640) {
      handleSelectHymn(next);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedHymn) return;
      if (e.key === "ArrowLeft") goToHymn(-1);
      if (e.key === "ArrowRight") goToHymn(1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedHymn]);

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* ============================================================
            HYMN READER VIEW
           ============================================================ */}
        {selectedHymn ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <Button
                variant="ghost"
                onClick={handleClearSelection}
                className="gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground rounded-full px-4"
              >
                <ArrowLeft className="h-4 w-4" /> Voltar ao índice de hinos
              </Button>

              <div className="flex items-center gap-2">
                {/* Font Size Selector */}
                <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-full border border-border/80">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground"
                    onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                    title="Diminuir fonte"
                  >
                    A-
                  </Button>
                  <span className="text-[11px] font-mono font-semibold px-1 text-muted-foreground">
                    {fontSize}px
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full text-xs font-bold text-muted-foreground hover:text-foreground"
                    onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                    title="Aumentar fonte"
                  >
                    A+
                  </Button>
                </div>

                {/* Favorite Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavorite(selectedHymn.number)}
                  className={`h-9 w-9 rounded-full border transition-all ${
                    isFav
                      ? "text-red-500 border-red-500/40 bg-red-500/10"
                      : "text-muted-foreground hover:text-red-500 hover:border-red-500/30"
                  }`}
                  title={isFav ? "Remover dos favoritos" : "Favoritar hino"}
                >
                  <Heart className={`h-4 w-4 ${isFav ? "fill-current" : ""}`} />
                </Button>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="h-9 w-9 rounded-full border border-border/80 text-muted-foreground hover:text-foreground"
                  title="Copiar letra"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </Button>

                {/* Share Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleShare}
                  className="h-9 w-9 rounded-full border border-border/80 text-muted-foreground hover:text-foreground"
                  title="Compartilhar"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Hymn Header & Title */}
            <div className="text-center pt-2 pb-6 border-b border-border/40">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-bold uppercase tracking-wider mb-3">
                <Music className="h-3 w-3" /> Harpa Cristã
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-foreground uppercase tracking-tight mb-2">
                <span className="text-gradient-gold mr-3">
                  {String(selectedHymn.number).padStart(3, "0")}
                </span>
                {selectedHymn.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground tracking-wide">
                Hino {selectedHymn.number} de 640 da Harpa Cristã
              </p>
            </div>

            {/* Sacred Lyrics Card */}
            <div className="glass-card watermark-cross-bg border border-border/80 shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 space-y-8">
              {/* Render verses and chorus */}
              {Object.entries(selectedHymn.verses).map(([vNum, vText], idx) => (
                <React.Fragment key={vNum}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-500 font-mono text-xs font-bold">
                        {vNum}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Estrofe {vNum}
                      </span>
                    </div>
                    <p
                      style={{ fontSize: `${fontSize}px` }}
                      className="font-reading leading-[1.8] text-foreground/90 whitespace-pre-line pl-8"
                    >
                      {vText}
                    </p>
                  </div>

                  {/* Chorus displayed after 1st verse (or repeated) */}
                  {selectedHymn.chorus && (idx === 0 || idx === 2) && (
                    <div className="my-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 shadow-xs">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 block mb-2">
                        ♪ Coro
                      </span>
                      <p
                        style={{ fontSize: `${fontSize + 1}px` }}
                        className="font-serif italic font-medium leading-[1.8] text-foreground whitespace-pre-line"
                      >
                        {selectedHymn.chorus}
                      </p>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Bottom Pagination */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => goToHymn(-1)}
                disabled={selectedHymn.number <= 1}
                className="gap-2 rounded-2xl border-border/80 text-xs sm:text-sm font-semibold h-11 px-4"
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>

              <div className="text-xs text-muted-foreground font-mono">
                {selectedHymn.number} / 640
              </div>

              <Button
                variant="outline"
                onClick={() => goToHymn(1)}
                disabled={selectedHymn.number >= 640}
                className="gap-2 rounded-2xl border-border/80 text-xs sm:text-sm font-semibold h-11 px-4"
              >
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          /* ============================================================
             CATALOG / LIST VIEW
             ============================================================ */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Catalog Hero */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                <Music className="h-3.5 w-3.5" /> Louvor & Adoração Pentecostal
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-black text-foreground tracking-tight uppercase">
                Harpa <span className="text-gradient-gold">Cristã</span>
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Catálogo completo com os 640 hinos clássicos para seu devocional, culto e ministrações.
              </p>
            </div>

            {/* Hymn of the Day Card */}
            <Card className="glass-card border border-amber-500/30 shadow-gold rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-gold" />
              <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30 text-[11px] font-bold uppercase tracking-wider">
                      ✨ Hino do Dia
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Para seu momento devocional hoje
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    <span className="text-amber-500 mr-2">
                      #{String(hymnOfTheDay.number).padStart(3, "0")}
                    </span>
                    {hymnOfTheDay.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground italic line-clamp-2">
                    "{Object.values(hymnOfTheDay.verses)[0]?.slice(0, 120)}..."
                  </p>
                </div>

                <Button
                  onClick={() => handleSelectHymn(hymnOfTheDay.number)}
                  className="bg-gradient-gold text-background hover:opacity-90 font-bold gap-2 rounded-2xl shadow-md shrink-0 w-full md:w-auto"
                >
                  <Music className="h-4 w-4" /> Abrir e Cantar
                </Button>
              </CardContent>
            </Card>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por número (ex: 15, 545) ou título do hino..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-13 text-base rounded-2xl glass-card border border-border/80 focus-visible:ring-amber-500/50 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              )}
            </div>

            {/* Quick Pills for Popular Hymns */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                Hinos Mais Cantados:
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_HYMNS.map((num) => {
                  const h = getHymnByNumber(num);
                  if (!h) return null;
                  return (
                    <button
                      key={num}
                      onClick={() => handleSelectHymn(num)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold glass-card border border-border/70 hover:border-amber-500/50 hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-all flex items-center gap-1.5"
                    >
                      <span className="font-mono text-amber-500 font-bold">{num}</span>
                      <span>{h.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hymns Count Info */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1 border-b border-border/40 pb-2">
              <span>{filteredHymns.length} hinos encontrados</span>
              <span>Total: 640 hinos</span>
            </div>

            {/* Hymns Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredHymns.map((h) => {
                const isFavorite = favorites.includes(h.number);
                return (
                  <div
                    key={h.number}
                    onClick={() => handleSelectHymn(h.number)}
                    className="group glass-card border border-border/80 hover:border-amber-500/40 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:shadow-gold flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-amber-500/10 text-amber-500 font-mono font-bold text-sm shrink-0 border border-amber-500/20 group-hover:scale-105 transition-transform">
                        {String(h.number).padStart(3, "0")}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-foreground group-hover:text-amber-500 transition-colors truncate">
                          {h.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {Object.values(h.verses)[0]?.slice(0, 50)}...
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(h.number);
                        }}
                        className={`p-2 rounded-lg transition-colors ${
                          isFavorite
                            ? "text-red-500"
                            : "text-muted-foreground/40 hover:text-red-500"
                        }`}
                        title={isFavorite ? "Remover dos favoritos" : "Favoritar"}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                      </button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
