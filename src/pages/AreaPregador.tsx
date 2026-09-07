import { useState, useEffect, useCallback } from "react";
import {
  Trash2,
  Loader2,
  FileText,
  BookOpen,
  Sparkles,
  Search,
  FolderOpen,
  Calendar,
  MapPin,
  Flame,
  Music,
  Plus,
  Maximize2,
  Printer,
  ChevronDown,
  ChevronUp,
  X,
  Church,
  Award,
  Users,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";
import { ContentActions } from "@/components/ContentActions";
import { SermonContentRenderer } from "@/components/SermonContentRenderer";
import { PulpitModeModal } from "@/components/PulpitModeModal";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import type { RegistroSermon } from "@/pages/GeradorPregacoes";

interface SavedContentItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  created_at: string;
}

const typeLabels: Record<string, { label: string; icon: typeof FileText }> = {
  pregacao: { label: "Pregações", icon: Sparkles },
  devocional: { label: "Devocionais", icon: BookOpen },
  estudo: { label: "Estudos Bíblicos", icon: BookOpen },
  biblioteca: { label: "Biblioteca", icon: FileText },
  dicionario: { label: "Dicionário", icon: FileText },
  questionario: { label: "Questionários", icon: FileText },
  geral: { label: "Gerais", icon: FileText },
};

const OFFLINE_STORAGE_KEY = "pregador:sermoes_offline_v2";

const AreaPregador = () => {
  const { user } = useAuth();
  const { openLogin } = useLoginPrompt();

  // Tab State: "sermoes" vs "outros"
  const [activeTab, setActiveTab] = useState<"sermoes" | "outros">("sermoes");

  // Sermons & Ministration State
  const [sermons, setSermons] = useState<RegistroSermon[]>([]);
  const [otherItems, setOtherItems] = useState<SavedContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("todos");

  // Expanded View & Pulpit Mode
  const [expandedSermonId, setExpandedSermonId] = useState<string | null>(null);
  const [pulpitSermon, setPulpitSermon] = useState<{ title: string; content: string } | null>(null);

  // Ministration Modal State
  const [minModalOpen, setMinModalOpen] = useState(false);
  const [targetSermon, setTargetSermon] = useState<RegistroSermon | null>(null);
  const [minData, setMinData] = useState({
    igreja: "",
    cidade: "",
    data: new Date().toISOString().split("T")[0],
    ocasiao: "Culto de Domingo",
    conversoes: 0,
    batismosEspirito: 0,
    hinosUtilizados: "",
    anotacoes: "",
  });

  // Offline status
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Helper to load offline cache
  const getOfflineSermons = (): RegistroSermon[] => {
    try {
      const raw = localStorage.getItem(OFFLINE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  // Helper to save offline cache
  const persistOfflineSermons = (data: RegistroSermon[]) => {
    try {
      localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Local storage error:", e);
    }
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);

    // 1. Get offline cache first for instant responsiveness
    const localSermons = getOfflineSermons();

    if (!user) {
      setSermons(localSermons);
      setLoading(false);
      return;
    }

    try {
      // 2. Fetch saved_sermons from Supabase
      const { data: dbSermons, error: sermonError } = await supabase
        .from("saved_sermons")
        .select("id, title, tema, content, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!sermonError && dbSermons) {
        // Merge DB sermons with local ministration records
        const merged: RegistroSermon[] = dbSermons.map((dbS) => {
          const matchedLocal = localSermons.find((ls) => ls.id === dbS.id || ls.titulo === dbS.title);
          return {
            id: dbS.id,
            titulo: dbS.title,
            textoBase: matchedLocal?.textoBase || "",
            conteudoMarkdown: dbS.content,
            dataCriacao: dbS.created_at,
            metodoHomiletico: matchedLocal?.metodoHomiletico || "Expositivo",
            linhaDoutrinaria: matchedLocal?.linhaDoutrinaria || "Pneumatologia & Avivamento Pentecostal",
            profundidade: matchedLocal?.profundidade || "Profundo / Acadêmico",
            ocasiao: matchedLocal?.ocasiao || "Culto de Ensino",
            ministracoes: matchedLocal?.ministracoes || [],
          };
        });

        // Add any local-only sermons
        localSermons.forEach((ls) => {
          if (!merged.some((m) => m.id === ls.id || m.titulo === ls.titulo)) {
            merged.push(ls);
          }
        });

        setSermons(merged);
        persistOfflineSermons(merged);
      } else {
        setSermons(localSermons);
      }

      // 3. Fetch other contents (devotionals, studies, etc.)
      const { data: dbOther } = await supabase
        .from("saved_content")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (dbOther) {
        setOtherItems(dbOther);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setSermons(localSermons);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Open Ministration Modal for a sermon
  const handleOpenMinModal = (sermon: RegistroSermon) => {
    setTargetSermon(sermon);
    setMinData({
      igreja: "",
      cidade: "",
      data: new Date().toISOString().split("T")[0],
      ocasiao: sermon.ocasiao || "Culto de Domingo",
      conversoes: 0,
      batismosEspirito: 0,
      hinosUtilizados: "",
      anotacoes: "",
    });
    setMinModalOpen(true);
  };

  // Save new ministration
  const handleSaveMinistration = () => {
    if (!targetSermon) return;
    if (!minData.igreja.trim()) {
      toast.error("Informe o nome da igreja ou congregação");
      return;
    }

    const novaMinistracao = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      data: minData.data,
      igreja: minData.igreja.trim(),
      cidade: minData.cidade.trim(),
      ocasiao: minData.ocasiao,
      frutos: {
        conversoes: Number(minData.conversoes) || 0,
        batismosEspirito: Number(minData.batismosEspirito) || 0,
      },
      hinosUtilizados: minData.hinosUtilizados
        ? minData.hinosUtilizados.split(",").map((h) => h.trim()).filter(Boolean)
        : [],
      anotacoes: minData.anotacoes.trim(),
    };

    const updatedSermons = sermons.map((s) => {
      if (s.id === targetSermon.id) {
        return {
          ...s,
          ministracoes: [novaMinistracao, ...(s.ministracoes || [])],
        };
      }
      return s;
    });

    setSermons(updatedSermons);
    persistOfflineSermons(updatedSermons);
    setMinModalOpen(false);
    toast.success("Ministração registrada no histórico com sucesso!");
  };

  // Delete Sermon
  const handleDeleteSermon = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta pregação?")) {
      if (user) {
        await supabase.from("saved_sermons").delete().eq("id", id);
      }
      const updated = sermons.filter((s) => s.id !== id);
      setSermons(updated);
      persistOfflineSermons(updated);
      toast.success("Pregação excluída.");
    }
  };

  // Delete Other Item
  const handleDeleteOtherItem = async (id: string) => {
    const { error } = await supabase.from("saved_content").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir.");
    } else {
      setOtherItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Conteúdo excluído.");
    }
  };

  // Calculate Impact Metrics
  const totalSermons = sermons.length;
  const totalMinistracoes = sermons.reduce((acc, s) => acc + (s.ministracoes?.length || 0), 0);
  const totalConversoes = sermons.reduce(
    (acc, s) => acc + (s.ministracoes?.reduce((sub, m) => sub + (m.frutos?.conversoes || 0), 0) || 0),
    0
  );
  const totalBatismos = sermons.reduce(
    (acc, s) =>
      acc + (s.ministracoes?.reduce((sub, m) => sub + (m.frutos?.batismosEspirito || 0), 0) || 0),
    0
  );

  // Filtered lists
  const filteredSermons = sermons.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.titulo.toLowerCase().includes(q) ||
      (s.textoBase && s.textoBase.toLowerCase().includes(q)) ||
      s.conteudoMarkdown.toLowerCase().includes(q) ||
      (s.linhaDoutrinaria && s.linhaDoutrinaria.toLowerCase().includes(q))
    );
  });

  const filteredOtherItems = otherItems.filter((item) => {
    if (filterType !== "todos" && item.content_type !== filterType) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
  });

  if (!user && sermons.length === 0) {
    return (
      <AnimatedPage className="container py-12 px-4">
        <div className="mx-auto max-w-lg text-center space-y-6">
          <FolderOpen className="h-16 w-16 mx-auto text-amber-500/50" />
          <h1 className="font-serif text-3xl font-bold text-foreground">Área do Pregador PRO</h1>
          <p className="text-muted-foreground">
            Acesse seu acervo bíblico completo, histórico de ministrações no altar e frutos espirituais colhidos.
          </p>
          <Button onClick={() => openLogin()} className="bg-gradient-gold text-background hover:opacity-90 font-bold px-8 py-5 rounded-xl shadow-gold">
            Entrar no Meu Perfil
          </Button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage className="container px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <AnimatedSection className="mb-8 text-center pulpit-hide-print">
        <div className="flex items-center justify-center gap-2 mb-2">
          {isOffline && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <WifiOff className="h-3 w-3" /> Modo Offline Ativo (Púlpito)
            </span>
          )}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight">
          Área do <span className="text-gradient-gold">Pregador PRO</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Gestão completa de sermões exegéticos, diário de ministrações no altar e relatórios de frutos colhidos.
        </p>
      </AnimatedSection>

      {/* Impact Dashboard Stats */}
      <AnimatedSection className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-6xl mx-auto pulpit-hide-print">
        <Card className="glass-card border-amber-500/20 shadow-md rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sermões Salvos</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">{totalSermons}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/20 shadow-md rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Church className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ministrações</p>
              <h3 className="font-serif text-2xl font-bold text-foreground">{totalMinistracoes}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/20 shadow-md rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Almas / Decisões</p>
              <h3 className="font-serif text-2xl font-bold text-emerald-400">{totalConversoes}</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-amber-500/20 shadow-md rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Flame className="h-6 w-6 text-amber-500 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Batismos c/ Espírito</p>
              <h3 className="font-serif text-2xl font-bold text-amber-400">{totalBatismos}</h3>
            </div>
          </CardContent>
        </Card>
      </AnimatedSection>

      {/* Main Tabs & Search */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pulpit-hide-print">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-background/80 rounded-2xl border border-border/80 w-full sm:w-auto">
            <Button
              variant={activeTab === "sermoes" ? "default" : "ghost"}
              className={activeTab === "sermoes" ? "bg-gradient-gold text-background font-bold shadow-sm" : "rounded-xl"}
              onClick={() => setActiveTab("sermoes")}
              size="sm"
            >
              <Sparkles className="h-4 w-4 mr-1.5" /> Sermões & Ministrações ({sermons.length})
            </Button>
            <Button
              variant={activeTab === "outros" ? "default" : "ghost"}
              className={activeTab === "outros" ? "bg-gradient-gold text-background font-bold shadow-sm" : "rounded-xl"}
              onClick={() => setActiveTab("outros")}
              size="sm"
            >
              <FolderOpen className="h-4 w-4 mr-1.5" /> Outros Conteúdos ({otherItems.length})
            </Button>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar no acervo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-input bg-background/60 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            />
          </div>
        </div>

        {/* ========================================================
            TAB 1: SERMÕES & MINISTRAÇÕES NO ALTAR
           ======================================================== */}
        {activeTab === "sermoes" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : filteredSermons.length === 0 ? (
              <Card className="glass-card border-border/80 rounded-2xl p-12 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-3 text-amber-500/40" />
                <h3 className="font-serif text-lg font-bold text-foreground">Nenhuma pregação encontrada</h3>
                <p className="text-sm max-w-sm mx-auto mt-1">
                  Gere e salve seus sermões no "Gerador de Esboços" para registrar suas ministrações aqui.
                </p>
              </Card>
            ) : (
              <div className="grid gap-5">
                {filteredSermons.map((sermon) => {
                  const isExpanded = expandedSermonId === sermon.id;
                  const preview = sermon.conteudoMarkdown
                    .replace(/[#*_`]/g, "")
                    .slice(0, 180)
                    .trim();

                  return (
                    <Card
                      key={sermon.id}
                      className="glass-card border-border/80 hover:border-amber-500/40 transition-all rounded-2xl shadow-lg overflow-hidden"
                    >
                      <CardContent className="p-5 sm:p-6 space-y-4">
                        {/* Top Preaching Info */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="badge-strong text-[10px]">
                                {sermon.metodoHomiletico || "Expositivo"}
                              </span>
                              {sermon.linhaDoutrinaria && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  <Flame className="h-3 w-3" />
                                  {sermon.linhaDoutrinaria}
                                </span>
                              )}
                              {sermon.textoBase && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  📖 {sermon.textoBase}
                                </span>
                              )}
                            </div>
                            <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                              {sermon.titulo}
                            </h2>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => handleDeleteSermon(sermon.id)}
                            title="Excluir pregação"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Expanded Content or Preview */}
                        {isExpanded ? (
                          <div className="pt-3 border-t border-border/40">
                            <SermonContentRenderer content={sermon.conteudoMarkdown} title={sermon.titulo} />
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {preview}...
                          </p>
                        )}

                        {/* Ministrations Log Section */}
                        <div className="pt-4 border-t border-border/40 space-y-3">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                              <Church className="h-3.5 w-3.5" />
                              Histórico de Ministrações ({sermon.ministracoes?.length || 0})
                            </h4>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenMinModal(sermon)}
                              className="h-7 text-xs rounded-lg gap-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/15"
                            >
                              <Plus className="h-3.5 w-3.5" /> Registrar Onde Preguei
                            </Button>
                          </div>

                          {sermon.ministracoes && sermon.ministracoes.length > 0 ? (
                            <div className="grid gap-2 sm:grid-cols-2">
                              {sermon.ministracoes.map((min, mIdx) => (
                                <div
                                  key={min.id || mIdx}
                                  className="p-3 rounded-xl bg-background/50 border border-border/60 text-xs space-y-1.5"
                                >
                                  <div className="flex items-center justify-between font-semibold text-foreground">
                                    <span className="flex items-center gap-1 truncate">
                                      <Church className="h-3 w-3 text-amber-500 shrink-0" />
                                      {min.igreja}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground shrink-0">
                                      {new Date(min.data).toLocaleDateString("pt-BR")}
                                    </span>
                                  </div>
                                  {min.cidade && (
                                    <p className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                      <MapPin className="h-2.5 w-2.5" /> {min.cidade}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 pt-1 text-[11px]">
                                    <span className="text-emerald-400 font-bold">
                                      👤 {min.frutos.conversoes} Conversões
                                    </span>
                                    <span className="text-amber-400 font-bold">
                                      🔥 {min.frutos.batismosEspirito} Batismos
                                    </span>
                                  </div>
                                  {min.anotacoes && (
                                    <p className="text-muted-foreground italic text-[10px] pt-1 border-t border-border/40">
                                      "{min.anotacoes}"
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">
                              Nenhuma ministração registrada ainda para este sermão.
                            </p>
                          )}
                        </div>

                        {/* Bottom Action Toolbar */}
                        <div className="flex items-center justify-between pt-3 border-t border-border/40 gap-2 flex-wrap">
                          <button
                            onClick={() => setExpandedSermonId(isExpanded ? null : sermon.id)}
                            className="text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3.5 w-3.5" /> Recolher Esboço
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3.5 w-3.5" /> Ver Esboço Completo
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setPulpitSermon({
                                  title: sermon.titulo,
                                  content: sermon.conteudoMarkdown,
                                });
                              }}
                              className="h-8 text-xs rounded-xl gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-400 font-semibold hover:bg-amber-500/20"
                            >
                              <Maximize2 className="h-3 w-3" /> Modo Púlpito
                            </Button>

                            <ContentActions
                              content={sermon.conteudoMarkdown}
                              title={sermon.titulo}
                              contentType="pregacao"
                              compact
                              hideSave
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: OUTROS CONTEÚDOS SALVOS
           ======================================================== */}
        {activeTab === "outros" && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {["todos", "devocional", "estudo", "biblioteca", "dicionario"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterType(cat)}
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    filterType === cat
                      ? "bg-amber-500 text-background border-amber-500 shadow-sm"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  {cat === "todos" ? "Todos os Tipos" : typeLabels[cat]?.label || cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              </div>
            ) : filteredOtherItems.length === 0 ? (
              <Card className="glass-card max-w-md mx-auto p-8 text-center text-muted-foreground rounded-2xl">
                <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <h3 className="font-serif text-lg font-bold text-foreground">Nenhum item salvo</h3>
                <p className="text-xs">Salve devocionais e estudos através das ferramentas do site.</p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredOtherItems.map((item) => {
                  const meta = typeLabels[item.content_type] || typeLabels.geral;
                  const Icon = meta.icon;
                  const preview = item.content.replace(/[#*_]/g, "").slice(0, 140).trim();

                  return (
                    <Card key={item.id} className="glass-card border-border/80 hover:border-amber-500/30 transition-all rounded-2xl">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-gold text-background">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                                {meta.label}
                              </span>
                              <h3 className="font-serif text-sm font-semibold truncate text-foreground">
                                {item.title}
                              </h3>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="shrink-0 text-muted-foreground hover:text-destructive h-7 w-7"
                            onClick={() => handleDeleteOtherItem(item.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">{preview}...</p>

                        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] text-muted-foreground">
                          <span>{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
                          <ContentActions
                            content={item.content}
                            title={item.title}
                            contentType={item.content_type}
                            compact
                            hideSave
                          />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: REGISTRAR MINISTRAÇÃO NO ALTAR
         ======================================================== */}
      {minModalOpen && targetSermon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <Card className="glass-card border-amber-500/30 max-w-lg w-full rounded-2xl shadow-2xl">
            <CardHeader className="border-b border-border/40 pb-3 flex flex-row items-center justify-between">
              <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-foreground">
                <Church className="h-5 w-5 text-amber-500" />
                Registrar Ministração
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => setMinModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <p className="text-xs text-muted-foreground font-serif font-semibold">Pregação:</p>
                <p className="text-sm font-bold text-foreground truncate">{targetSermon.titulo}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-foreground">Data da Ministração *</Label>
                  <input
                    type="date"
                    value={minData.data}
                    onChange={(e) => setMinData({ ...minData, data: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-foreground">Ocasião Litúrgica</Label>
                  <input
                    type="text"
                    value={minData.ocasiao}
                    onChange={(e) => setMinData({ ...minData, ocasiao: e.target.value })}
                    placeholder="Ex: Culto de Ensino, Vigília"
                    className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-foreground">Igreja / Congregação *</Label>
                <input
                  type="text"
                  value={minData.igreja}
                  onChange={(e) => setMinData({ ...minData, igreja: e.target.value })}
                  placeholder="Ex: AD Belém - Templo Sede"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-foreground">Cidade / Estado</Label>
                <input
                  type="text"
                  value={minData.cidade}
                  onChange={(e) => setMinData({ ...minData, cidade: e.target.value })}
                  placeholder="Ex: São Paulo / SP"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Users className="h-3 w-3 text-emerald-400" /> Conversões / Decisões
                  </Label>
                  <input
                    type="number"
                    min="0"
                    value={minData.conversoes}
                    onChange={(e) => setMinData({ ...minData, conversoes: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-foreground flex items-center gap-1">
                    <Flame className="h-3 w-3 text-amber-500" /> Batismos c/ Espírito
                  </Label>
                  <input
                    type="number"
                    min="0"
                    value={minData.batismosEspirito}
                    onChange={(e) => setMinData({ ...minData, batismosEspirito: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-foreground flex items-center gap-1">
                  <Music className="h-3 w-3 text-amber-400" /> Hinos da Harpa Utilizados
                </Label>
                <input
                  type="text"
                  value={minData.hinosUtilizados}
                  onChange={(e) => setMinData({ ...minData, hinosUtilizados: e.target.value })}
                  placeholder="Ex: Hino 187, Hino 15, Hino 300"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-foreground">Anotações & Testemunhos do Altar</Label>
                <textarea
                  rows={2}
                  value={minData.anotacoes}
                  onChange={(e) => setMinData({ ...minData, anotacoes: e.target.value })}
                  placeholder="Ex: Forte presença de Deus no apelo, renovação espiritual dos obreiros..."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border/40">
                <Button variant="ghost" onClick={() => setMinModalOpen(false)} className="rounded-xl text-xs">
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveMinistration}
                  className="bg-gradient-gold text-background hover:opacity-90 font-bold rounded-xl text-xs shadow-gold"
                >
                  Salvar Ministração
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Fullscreen Pulpit Mode Modal */}
      {pulpitSermon && (
        <PulpitModeModal
          open={Boolean(pulpitSermon)}
          onClose={() => setPulpitSermon(null)}
          title={pulpitSermon.title}
          content={pulpitSermon.content}
        />
      )}
    </AnimatedPage>
  );
};

export default AreaPregador;

