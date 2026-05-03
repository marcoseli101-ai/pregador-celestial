import { useState, useCallback, useEffect } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import { Calendar, BookOpen, Heart, Loader2, Sparkles, Save, History, Trash2, ChevronLeft, Share2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ContentActions } from "@/components/ContentActions";
import { BibleVerseLink } from "@/components/BibleVerseLink";
import { useDailyDevotional, type DailyDevotional } from "@/hooks/useDailyDevotional";
import { usePersistedState } from "@/hooks/usePersistedState";

interface SavedDevotional {
  id: string;
  content: string;
  date_label: string;
  created_at: string;
}

type Tab = "hoje" | "historico" | "salvos";

const Devocional = () => {
  const { user } = useAuth();
  const { devotional, loading, generating, error } = useDailyDevotional();
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const [activeTab, setActiveTab] = usePersistedState<Tab>("dev:activeTab", "hoje");
  const [isSaving, setIsSaving] = useState(false);
  const [savedList, setSavedList] = useState<SavedDevotional[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [viewingDevotional, setViewingDevotional] = useState<SavedDevotional | null>(null);

  // History state (public daily devotionals)
  const [historyList, setHistoryList] = useState<DailyDevotional[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [viewingHistory, setViewingHistory] = useState<DailyDevotional | null>(null);

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

  const fetchHistory = useCallback(async () => {
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("devocional_diario" as any)
      .select("*")
      .order("data", { ascending: false })
      .limit(30);
    if (error) {
      console.error(error);
    } else {
      setHistoryList((data as unknown as DailyDevotional[]) ?? []);
    }
    setLoadingHistory(false);
  }, []);

  useEffect(() => {
    if (activeTab === "salvos") fetchSaved();
    if (activeTab === "historico") fetchHistory();
  }, [activeTab, fetchSaved, fetchHistory]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Faça login para salvar devocionais.");
      return;
    }
    if (!devotional && !viewingHistory) return;
    setIsSaving(true);
    const contentToSave = viewingHistory?.conteudo || devotional?.conteudo || "";
    const dateToSave = viewingHistory
      ? new Date(viewingHistory.data + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
      : today;
    const { error } = await supabase.from("saved_devotionals").insert({
      user_id: user.id,
      content: contentToSave,
      date_label: dateToSave,
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

  const renderFullDevotional = (text: string, dateTag?: string, showSaveBtn = true) => {
    const sections = parseContent(text);
    return (
      <Card className="shadow-celestial border-gold/20 overflow-hidden">
        <div className="h-2 bg-gradient-gold" />
        <CardContent className="p-8 space-y-6">
          {dateTag && (
            <div className="text-center">
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1 text-xs font-semibold text-accent uppercase tracking-widest">
                {dateTag}
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

          <div className="flex gap-3 pt-2 flex-wrap">
            <ContentActions content={text} title="Devocional Diário" contentType="devocional" />
            {user && showSaveBtn && (
              <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving} className="gap-1.5">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Salvar
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 border-[hsl(142,70%,45%/0.5)] text-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,45%/0.1)]"
              onClick={() => shareWhatsApp(text)}
            >
              <Share2 className="h-4 w-4" /> WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
          {renderFullDevotional(viewingDevotional.content, undefined, false)}
        </div>
      </div>
    );
  }

  // === VIEWING A HISTORY DEVOTIONAL ===
  if (viewingHistory) {
    const dateStr = new Date(viewingHistory.data + "T12:00:00").toLocaleDateString("pt-BR", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-2xl">
          <Button variant="ghost" onClick={() => setViewingHistory(null)} className="mb-4 gap-1">
            <ChevronLeft className="h-4 w-4" /> Voltar ao histórico
          </Button>
          <div className="text-center mb-6">
            {viewingHistory.titulo && (
              <h2 className="font-serif text-2xl font-bold mb-2">{viewingHistory.titulo}</h2>
            )}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{dateStr}</span>
            </div>
          </div>
          {renderFullDevotional(
            viewingHistory.conteudo,
            `Devocional de ${new Date(viewingHistory.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}`,
            true
          )}
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
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          <Button
            variant={activeTab === "hoje" ? "default" : "outline"}
            className={activeTab === "hoje" ? "bg-gradient-gold text-background" : ""}
            onClick={() => setActiveTab("hoje")}
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> Hoje
          </Button>
          <Button
            variant={activeTab === "historico" ? "default" : "outline"}
            className={activeTab === "historico" ? "bg-gradient-gold text-background" : ""}
            onClick={() => setActiveTab("historico")}
          >
            <Clock className="h-4 w-4 mr-1.5" /> Histórico
          </Button>
          {user && (
            <Button
              variant={activeTab === "salvos" ? "default" : "outline"}
              className={activeTab === "salvos" ? "bg-gradient-gold text-background" : ""}
              onClick={() => setActiveTab("salvos")}
            >
              <History className="h-4 w-4 mr-1.5" /> Meus Salvos
            </Button>
          )}
        </div>

        {/* === TODAY TAB === */}
        {activeTab === "hoje" && (
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

            {!loading && !generating && devotional && renderFullDevotional(
              devotional.conteudo,
              `Devocional de hoje — ${new Date(devotional.data + "T12:00:00").toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}`,
              true
            )}
          </>
        )}

        {/* === HISTORY TAB === */}
        {activeTab === "historico" && (
          <div className="space-y-3">
            {loadingHistory ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : historyList.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Nenhum devocional no histórico ainda.</p>
                  <p className="text-xs text-muted-foreground mt-1">Os devocionais são gerados automaticamente à meia-noite.</p>
                </CardContent>
              </Card>
            ) : (
              historyList.map((d) => {
                const dateStr = new Date(d.data + "T12:00:00").toLocaleDateString("pt-BR", {
                  weekday: "long", day: "numeric", month: "long",
                });
                const preview = d.conteudo.replace(/[#*_📖💛🙏❤✅]/g, "").slice(0, 120).trim();
                const isToday = d.data === devotional?.data;
                return (
                  <Card
                    key={d.id}
                    className={`cursor-pointer hover:shadow-celestial hover:border-celestial/30 transition-all ${isToday ? "border-accent/40 bg-accent/5" : ""}`}
                    onClick={() => setViewingHistory(d)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-semibold text-accent capitalize">{dateStr}</p>
                            {isToday && (
                              <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase">Hoje</span>
                            )}
                          </div>
                          {d.titulo && (
                            <p className="font-serif font-semibold text-sm mb-1">{d.titulo}</p>
                          )}
                          {d.versiculo_base && (
                            <p className="text-xs text-muted-foreground mb-1">📖 {d.versiculo_base}</p>
                          )}
                          <p className="text-sm text-muted-foreground truncate">{preview}...</p>
                        </div>
                        <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180 shrink-0 mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* === SAVED TAB === */}
        {activeTab === "salvos" && (
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
                  <Button variant="outline" className="mt-4" onClick={() => setActiveTab("hoje")}>
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
