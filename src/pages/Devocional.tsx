import { useState, useCallback, useEffect } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import { Calendar, BookOpen, Heart, Loader2, Sparkles, Save, History, Trash2, ChevronLeft, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ContentActions } from "@/components/ContentActions";
import { BibleVerseLink } from "@/components/BibleVerseLink";
import { useDailyDevotional } from "@/hooks/useDailyDevotional";

interface SavedDevotional {
  id: string;
  content: string;
  date_label: string;
  created_at: string;
}

const Devocional = () => {
  const { user } = useAuth();
  const { devotional, loading, generating, error } = useDailyDevotional();
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [savedList, setSavedList] = useState<SavedDevotional[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [viewingDevotional, setViewingDevotional] = useState<SavedDevotional | null>(null);

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    setLoadingSaved(true);
    const { data, error } = await supabase
      .from("saved_devotionals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setSavedList(data ?? []);
    }
    setLoadingSaved(false);
  }, [user]);

  useEffect(() => {
    if (showSaved) fetchSaved();
  }, [showSaved, fetchSaved]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Faça login para salvar devocionais.");
      return;
    }
    if (!devotional) return;
    setIsSaving(true);
    const { error } = await supabase.from("saved_devotionals").insert({
      user_id: user.id,
      content: devotional.conteudo,
      date_label: today,
    });
    if (error) {
      toast.error("Erro ao salvar devocional.");
      console.error(error);
    } else {
      toast.success("Devocional salvo com sucesso!");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("saved_devotionals").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir.");
    } else {
      setSavedList((prev) => prev.filter((d) => d.id !== id));
      if (viewingDevotional?.id === id) setViewingDevotional(null);
      toast.success("Devocional excluído.");
    }
  };

  const shareWhatsApp = (text: string) => {
    const cleaned = text.replace(/[#*_]/g, "").slice(0, 500);
    const url = `https://wa.me/?text=${encodeURIComponent(`📖 Devocional Diário\n\n${cleaned}\n\n🔗 Leia mais em: ${window.location.origin}/devocional`)}`;
    window.open(url, "_blank");
  };

  const parseContent = (text: string) => {
    const sections: { type: "verse" | "reflection" | "prayer" | "application" | "other"; content: string }[] = [];
    const parts = text.split(/##\s+/);
    for (const part of parts) {
      if (!part.trim()) continue;
      const lower = part.toLowerCase();
      if (lower.startsWith("📖") || lower.includes("versículo")) {
        sections.push({ type: "verse", content: part.replace(/^[📖\s]*versículo[^\n]*/i, "").trim() });
      } else if (lower.startsWith("💛") || lower.startsWith("❤") || lower.includes("reflexão")) {
        sections.push({ type: "reflection", content: part.replace(/^[💛❤\s]*reflexão[^\n]*/i, "").trim() });
      } else if (lower.startsWith("🙏") || lower.includes("oração")) {
        sections.push({ type: "prayer", content: part.replace(/^[🙏\s]*oração[^\n]*/i, "").trim() });
      } else if (lower.startsWith("✅") || lower.includes("aplicação")) {
        sections.push({ type: "application", content: part.replace(/^[✅\s]*aplicação[^\n]*/i, "").trim() });
      } else {
        sections.push({ type: "other", content: part.trim() });
      }
    }
    return sections;
  };

  const displayContent = viewingDevotional?.content || devotional?.conteudo || "";
  const sections = displayContent ? parseContent(displayContent) : [];

  const renderDevotionalCard = (text: string, showActions: boolean) => (
    <Card className="shadow-celestial border-gold/20 overflow-hidden">
      <div className="h-2 bg-gradient-gold" />
      <CardContent className="p-8 space-y-6">
        {/* Tag */}
        {!viewingDevotional && devotional && (
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold text-accent uppercase tracking-widest">
              Devocional de hoje — {new Date(devotional.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </span>
          </div>
        )}

        {sections.find((s) => s.type === "verse") && (
          <div className="text-center">
            <BookOpen className="h-8 w-8 mx-auto mb-3 text-accent" />
            <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">Versículo do Dia</p>
            <div className="text-lg font-serif italic leading-relaxed whitespace-pre-line">
              <BibleVerseLink text={sections.find((s) => s.type === "verse")!.content} />
            </div>
          </div>
        )}

        {sections.find((s) => s.type === "reflection") && (
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" /> Reflexão
            </h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              <BibleVerseLink text={sections.find((s) => s.type === "reflection")!.content} />
            </div>
          </div>
        )}

        {sections.find((s) => s.type === "prayer") && (
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3">🙏 Oração do Dia</h3>
            <p className="text-sm text-muted-foreground italic leading-relaxed whitespace-pre-line">
              {sections.find((s) => s.type === "prayer")!.content}
            </p>
          </div>
        )}

        {sections.find((s) => s.type === "application") && (
          <div>
            <h3 className="font-serif text-lg font-semibold mb-3">✅ Aplicação Prática</h3>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              <BibleVerseLink text={sections.find((s) => s.type === "application")!.content} />
            </div>
          </div>
        )}

        {sections.length === 0 && text && (
          <div className="text-sm leading-relaxed whitespace-pre-line">{text}</div>
        )}

        {sections.filter((s) => s.type === "other").map((s, i) => (
          <div key={i} className="text-sm leading-relaxed whitespace-pre-line">{s.content}</div>
        ))}

        {showActions && (
          <div className="flex gap-3 pt-2 flex-wrap">
            <ContentActions content={displayContent} title="Devocional Diário" contentType="devocional" />
            {user && !viewingDevotional && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-[hsl(142,70%,45%/0.5)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%/0.1)]"
              onClick={() => shareWhatsApp(displayContent)}
            >
              <Share2 className="h-4 w-4" /> WhatsApp
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // === VIEWING A SAVED DEVOTIONAL ===
  if (viewingDevotional) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <Button variant="ghost" onClick={() => setViewingDevotional(null)} className="mb-4 gap-1">
            <ChevronLeft className="h-4 w-4" /> Voltar aos salvos
          </Button>
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="capitalize">{viewingDevotional.date_label}</span>
          </div>
          {renderDevotionalCard(viewingDevotional.content, true)}
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage className="container py-12">
      <AnimatedSection className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Devocional <span className="text-gradient-gold">Diário</span>
        </h1>
        <p className="text-muted-foreground">Versículo do dia, reflexão, oração e aplicação prática — gerado automaticamente toda meia-noite.</p>
      </AnimatedSection>

      <div className="mx-auto max-w-2xl">
        {/* Tab toggle */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant={!showSaved ? "default" : "outline"}
            className={!showSaved ? "bg-gradient-gold text-background" : ""}
            onClick={() => setShowSaved(false)}
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Devocional de Hoje
          </Button>
          {user && (
            <Button
              variant={showSaved ? "default" : "outline"}
              className={showSaved ? "bg-gradient-gold text-background" : ""}
              onClick={() => setShowSaved(true)}
            >
              <History className="h-4 w-4 mr-1.5" /> Salvos
            </Button>
          )}
        </div>

        {/* === TODAY TAB === */}
        {!showSaved && (
          <>
            <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{today}</span>
            </div>

            {(loading || generating) && (
              <Card className="shadow-celestial border-celestial/20">
                <CardContent className="p-10 text-center space-y-4">
                  <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
                  <p className="text-sm text-muted-foreground">
                    {generating ? "Gerando o devocional de hoje com unção..." : "Carregando devocional do dia..."}
                  </p>
                </CardContent>
              </Card>
            )}

            {error && !loading && !generating && (
              <Card className="shadow-celestial border-destructive/20">
                <CardContent className="p-10 text-center space-y-4">
                  <p className="text-destructive font-medium">Não foi possível carregar o devocional.</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
              </Card>
            )}

            {!loading && !generating && devotional && renderDevotionalCard(devotional.conteudo, true)}
          </>
        )}

        {/* === SAVED TAB === */}
        {showSaved && (
          <div className="space-y-3">
            {loadingSaved ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : savedList.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <History className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Nenhum devocional salvo ainda.</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowSaved(false)}>
                    Ver devocional de hoje
                  </Button>
                </CardContent>
              </Card>
            ) : (
              savedList.map((d) => {
                const preview = d.content.replace(/[#*_📖💛🙏❤✅]/g, "").slice(0, 120).trim();
                return (
                  <Card
                    key={d.id}
                    className="cursor-pointer hover:shadow-celestial hover:border-celestial/30 transition-all"
                    onClick={() => setViewingDevotional(d)}
                  >
                    <CardContent className="p-4 flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-accent capitalize mb-1">{d.date_label}</p>
                        <p className="text-sm text-muted-foreground truncate">{preview}...</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default Devocional;
