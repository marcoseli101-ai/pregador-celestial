import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import {
  Sparkles,
  Save,
  Loader2,
  MessageCircleQuestion,
  Send,
  BookOpen,
  History,
  Trash2,
  ChevronRight,
  Maximize2,
  Sliders,
  Flame,
  Printer,
  Copy,
  Check,
  GraduationCap,
  Music,
  CheckSquare,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { streamSermon, streamSermonChat, type ChatMessage } from "@/lib/stream-chat";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentActions } from "@/components/ContentActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SermonContentRenderer } from "@/components/SermonContentRenderer";
import { PulpitModeModal } from "@/components/PulpitModeModal";
import { usePersistedState, clearPersistedState } from "@/hooks/usePersistedState";

export interface RegistroSermon {
  id: string;
  titulo: string;
  textoBase: string;
  conteudoMarkdown: string;
  dataCriacao: string;
  metodoHomiletico?: string;
  linhaDoutrinaria?: string;
  profundidade?: string;
  ocasiao?: string;
  ministracoes: Array<{
    id?: string;
    data: string;
    igreja: string;
    cidade: string;
    ocasiao: string;
    frutos: { conversoes: number; batismosEspirito: number };
    hinosUtilizados: string[];
    anotacoes: string;
  }>;
}

interface SavedSermon {
  id: string;
  title: string;
  tema: string | null;
  publico: string | null;
  tempo: string | null;
  nivel: string | null;
  content: string;
  created_at: string;
}

const GeradorPregacoes = () => {
  // Layer 2: Homiletical Parameters
  const [textoBase, setTextoBase] = usePersistedState("ger:textoBase", "");
  const [tema, setTema] = usePersistedState("ger:tema", "");
  const [metodoHomiletico, setMetodoHomiletico] = usePersistedState(
    "ger:metodoHomiletico",
    "Expositivo (Versículo por versículo)"
  );
  const [linhaDoutrinaria, setLinhaDoutrinaria] = usePersistedState(
    "ger:linhaDoutrinaria",
    "Pneumatologia & Avivamento Pentecostal"
  );
  const [profundidade, setProfundidade] = usePersistedState(
    "ger:profundidade",
    "Profundo / Acadêmico (Exegese no original com léxico Strong)"
  );
  const [ocasiao, setOcasiao] = usePersistedState("ger:ocasiao", "Culto de Ensino / Doutrina");

  // Toggles
  const [incluirOriginal, setIncluirOriginal] = usePersistedState("ger:incluirOriginal", true);
  const [incluirHarpa, setIncluirHarpa] = usePersistedState("ger:incluirHarpa", true);
  const [incluirCPAD, setIncluirCPAD] = usePersistedState("ger:incluirCPAD", true);

  // Output & UI State
  const [result, setResult] = usePersistedState<string>("ger:result", "");
  const [resultTema, setResultTema] = usePersistedState<string>("ger:resultTema", "");
  const [resultTextoBase, setResultTextoBase] = usePersistedState<string>("ger:resultTextoBase", "");
  const [loading, setLoading] = useState(false);
  const [pulpitOpen, setPulpitOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(18);
  const [copiedAll, setCopiedAll] = useState(false);

  const { user } = useAuth();
  const { requireLogin } = useLoginPrompt();

  // History state
  const [history, setHistory] = useState<SavedSermon[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Q&A state
  const [activeTab, setActiveTab] = usePersistedState<"pregacao" | "perguntas">("ger:activeTab", "pregacao");
  const [chatMessages, setChatMessages] = usePersistedState<ChatMessage[]>("ger:chatMessages", []);
  const [chatInput, setChatInput] = usePersistedState<string>("ger:chatInput", "");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    const { data, error } = await supabase
      .from("saved_sermons")
      .select("id, title, tema, publico, tempo, nivel, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setHistory(data);
    setHistoryLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) fetchHistory();
  }, [user, fetchHistory]);

  const saveToOfflineCache = (sermon: RegistroSermon) => {
    try {
      const existingRaw = localStorage.getItem("pregador:sermoes_offline_v2");
      const existing: RegistroSermon[] = existingRaw ? JSON.parse(existingRaw) : [];
      const updated = [sermon, ...existing.filter((s) => s.id !== sermon.id)];
      localStorage.setItem("pregador:sermoes_offline_v2", JSON.stringify(updated.slice(0, 100)));
    } catch (e) {
      console.error("Offline save error:", e);
    }
  };

  const autoSaveSermon = useCallback(
    async (content: string, sermonTema: string, sermonTextoBase: string) => {
      const sermonId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      const registro: RegistroSermon = {
        id: sermonId,
        titulo: sermonTema,
        textoBase: sermonTextoBase,
        conteudoMarkdown: content,
        dataCriacao: new Date().toISOString(),
        metodoHomiletico,
        linhaDoutrinaria,
        profundidade,
        ocasiao,
        ministracoes: [],
      };

      // Always save to offline cache
      saveToOfflineCache(registro);

      if (!user || !content) return;

      const { error } = await supabase.from("saved_sermons").insert({
        user_id: user.id,
        title: sermonTema,
        tema: sermonTema,
        content,
      });

      if (!error) {
        fetchHistory();
        toast.success("Pregação salva no acervo e cache offline!");
      }
    },
    [user, metodoHomiletico, linhaDoutrinaria, profundidade, ocasiao, fetchHistory]
  );

  const handleGenerate = async () => {
    if (!textoBase.trim()) {
      toast.error("Informe o Texto Base Bíblico (ex: Mateus 25:1-13)");
      return;
    }
    if (!tema.trim()) {
      toast.error("Informe o Tema Central da Pregação");
      return;
    }

    setResult("");
    setResultTema(tema);
    setResultTextoBase(textoBase);
    setLoading(true);
    setChatMessages([]);
    clearPersistedState("ger:chatMessages");
    setActiveTab("pregacao");

    let accumulated = "";
    const currentTema = tema;
    const currentTextoBase = textoBase;

    await streamSermon({
      tema: currentTema,
      textoBase: currentTextoBase,
      metodoHomiletico,
      linhaDoutrinaria,
      profundidade,
      ocasiao,
      analiseOriginal: incluirOriginal,
      incluirOriginal,
      sugerirHarpa: incluirHarpa,
      incluirHarpa,
      fundamentacaoCPAD: incluirCPAD,
      incluirCPAD,
      onDelta: (chunk) => {
        accumulated += chunk;
        setResult(accumulated);
      },
      onDone: () => {
        setLoading(false);
        autoSaveSermon(accumulated, currentTema, currentTextoBase);
      },
      onError: (msg) => {
        toast.error(msg);
        setLoading(false);
      },
    });
  };

  const handleSave = async () => {
    if (!requireLogin()) return;
    if (!result) return;
    const { error } = await supabase.from("saved_sermons").insert({
      user_id: user!.id,
      title: resultTema || tema,
      tema: resultTema || tema,
      content: result,
    });
    if (error) toast.error("Erro ao salvar");
    else {
      toast.success("Pregação salva no seu histórico!");
      fetchHistory();
    }
  };

  const handleCopyFullSermon = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopiedAll(true);
    toast.success("Esboço completo copiado com formatação!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleLoadFromHistory = (sermon: SavedSermon) => {
    setResult(sermon.content);
    setResultTema(sermon.title);
    setTema(sermon.tema || sermon.title);
    setChatMessages([]);
    setActiveTab("pregacao");
    setShowHistory(false);
    toast.success("Pregação carregada do histórico");
  };

  const handleDeleteFromHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("saved_sermons").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else {
      toast.success("Excluído");
      setHistory((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSendQuestion = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const displayTema = resultTema || tema;
    const contextMessages: ChatMessage[] = [
      {
        role: "user",
        content: `Aqui está o sermão homilético gerado sobre "${displayTema}":\n\n${result}`,
      },
      {
        role: "assistant",
        content:
          "Paz do Senhor! Analisei o sermão completo de acordo com as diretrizes da CGADB e CPAD. Pode me fazer qualquer pergunta para aprofundar a exegese, extrair mais ilustrações ou adaptar a ministração.",
      },
      ...chatMessages,
      userMsg,
    ];
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    let accumulated = "";
    await streamSermonChat({
      messages: contextMessages,
      onDelta: (chunk) => {
        accumulated += chunk;
        setChatMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: accumulated } : m));
          }
          return [...prev, { role: "assistant", content: accumulated }];
        });
      },
      onDone: () => {
        setChatLoading(false);
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      onError: (msg) => {
        toast.error(msg);
        setChatLoading(false);
      },
    });
  };

  const displayTema = resultTema || tema;

  return (
    <AnimatedPage className="container px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <AnimatedSection className="mb-8 text-center pulpit-hide-print">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
          Gerador de <span className="text-gradient-gold">Pregações & Esboços</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Motor Homilético Pentecostal Clássico (CGADB) com rigor exegético ARC, léxico no original e bibliografia CPAD.
        </p>
      </AnimatedSection>

      {/* Split View Container */}
      <div className="mx-auto w-full max-w-7xl grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)] items-start">
        {/* Left Column: Parameter Form & History */}
        <div className="space-y-4 pulpit-hide-print">
          <Card className="glass-card border-amber-500/20 shadow-xl rounded-2xl" data-tour="sermon-generator-form">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-foreground">
                <Sliders className="h-4 w-4 text-amber-500" />
                Parâmetros Homiléticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {/* 1. Texto Base */}
              <div>
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Texto Base Bíblico *</span>
                  <span className="text-[10px] text-amber-500 font-mono">ARC</span>
                </Label>
                <input
                  type="text"
                  value={textoBase}
                  onChange={(e) => setTextoBase(e.target.value)}
                  placeholder="Ex: Mateus 25:1-13 ou Romanos 8:31-39"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                />
              </div>

              {/* 2. Tema */}
              <div>
                <Label className="text-xs font-bold text-foreground">Tema da Mensagem *</Label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex: O Azeite da Vigilância e a Volta de Cristo"
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              {/* 3. Método Homilético */}
              <div>
                <Label className="text-xs font-bold text-foreground">Método Homilético</Label>
                <Select value={metodoHomiletico} onValueChange={setMetodoHomiletico}>
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Expositivo (Versículo por versículo)">
                      Expositivo (Versículo por versículo)
                    </SelectItem>
                    <SelectItem value="Textual">Textual (Divisões no texto)</SelectItem>
                    <SelectItem value="Temático">Temático (Progressão lógica de passagens)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 4. Linha Doutrinária (CGADB) */}
              <div>
                <Label className="text-xs font-bold text-foreground flex items-center justify-between">
                  <span>Linha Doutrinária (CGADB)</span>
                  <span className="text-[10px] text-amber-500 font-mono">Pentecostal</span>
                </Label>
                <Select value={linhaDoutrinaria} onValueChange={setLinhaDoutrinaria}>
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue placeholder="Selecione a linha doutrinária" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pneumatologia & Avivamento Pentecostal">
                      Pneumatologia & Avivamento Pentecostal
                    </SelectItem>
                    <SelectItem value="Escatologia Pré-Tribulacionista e Vigilância">
                      Escatologia Pré-Tribulacionista e Vigilância
                    </SelectItem>
                    <SelectItem value="Soteriologia, Graça e Novo Nascimento">
                      Soteriologia, Graça e Novo Nascimento
                    </SelectItem>
                    <SelectItem value="Santificação, Altar e Ética Cristã">
                      Santificação, Altar e Ética Cristã
                    </SelectItem>
                    <SelectItem value="Cristologia e a Obra Vicária da Cruz">
                      Cristologia e a Obra Vicária da Cruz
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 5 & 6. Profundidade e Ocasião */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-foreground">Profundidade</Label>
                  <Select value={profundidade} onValueChange={setProfundidade}>
                    <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Médio (Foco pastoral e exegético)">Médio (Pastoral)</SelectItem>
                      <SelectItem value="Profundo / Acadêmico (Exegese no original com léxico Strong)">
                        Profundo (Léxico Strong)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-foreground">Ocasião Litúrgica</Label>
                  <Select value={ocasiao} onValueChange={setOcasiao}>
                    <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Culto de Ensino / Doutrina">Culto de Ensino</SelectItem>
                      <SelectItem value="Culto Público Evangelístico">Culto Evangelístico</SelectItem>
                      <SelectItem value="Vigília">Vigília</SelectItem>
                      <SelectItem value="Santa Ceia">Santa Ceia</SelectItem>
                      <SelectItem value="Conferência Missionária">Conferência Missionária</SelectItem>
                      <SelectItem value="Culto da Família">Culto da Família</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 7. Toggles */}
              <div className="space-y-2.5 pt-2 border-t border-border/40">
                <label className="flex items-center gap-2.5 text-xs text-foreground/90 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={incluirOriginal}
                    onChange={(e) => setIncluirOriginal(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-background/80"
                  />
                  <span>Análise no original (Grego/Hebraico com Léxico Strong)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-foreground/90 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={incluirHarpa}
                    onChange={(e) => setIncluirHarpa(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-background/80"
                  />
                  <span>Sugerir hinos temáticos da Harpa Cristã</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-foreground/90 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={incluirCPAD}
                    onChange={(e) => setIncluirCPAD(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-amber-500 h-4 w-4 bg-background/80"
                  />
                  <span>Fundamentação CPAD (Bergstén, Pearlman, Gilberto)</span>
                </label>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-gold text-background hover:opacity-95 font-bold gap-2 text-base py-5 rounded-xl shadow-gold glow-btn-gold transition-all"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 animate-pulse" />
                )}
                {loading ? "Gerando Pregação Exegética..." : "Gerar Pregação Completa"}
              </Button>
            </CardContent>
          </Card>

          {/* History Card */}
          {user && (
            <Card className="glass-card border-border/80 shadow-md rounded-2xl">
              <CardHeader
                className="cursor-pointer py-3.5 px-4"
                onClick={() => {
                  setShowHistory(!showHistory);
                  if (!showHistory) fetchHistory();
                }}
              >
                <CardTitle className="font-serif text-sm flex items-center gap-2">
                  <History className="h-4 w-4 text-amber-500" />
                  Histórico de Sermões Salvos
                  <ChevronRight
                    className={`h-4 w-4 ml-auto transition-transform ${showHistory ? "rotate-90" : ""}`}
                  />
                </CardTitle>
              </CardHeader>
              {showHistory && (
                <CardContent className="pt-0 px-3 pb-3">
                  {historyLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground py-4 justify-center text-xs">
                      <Loader2 className="h-4 w-4 animate-spin" /> Carregando histórico...
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhuma pregação salva ainda.</p>
                  ) : (
                    <ScrollArea className="max-h-[260px]">
                      <div className="space-y-1">
                        {history.map((sermon) => (
                          <div
                            key={sermon.id}
                            onClick={() => handleLoadFromHistory(sermon)}
                            className="flex items-center gap-2 p-2 rounded-xl hover:bg-accent/10 cursor-pointer group transition-colors border border-transparent hover:border-accent/20"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate text-foreground">{sermon.title}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {new Date(sermon.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
                              onClick={(e) => handleDeleteFromHistory(sermon.id, e)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Live Result, Toolbar & Q&A */}
        <div className="space-y-4">
          {/* Header Action Bar */}
          {result && !loading && (
            <div className="flex items-center justify-between gap-2 flex-wrap pulpit-hide-print">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "pregacao" ? "default" : "outline"}
                  className={
                    activeTab === "pregacao" ? "bg-gradient-gold text-background font-semibold" : "rounded-xl"
                  }
                  onClick={() => setActiveTab("pregacao")}
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-1.5" /> Sermão Completo
                </Button>
                <Button
                  variant={activeTab === "perguntas" ? "default" : "outline"}
                  className={
                    activeTab === "perguntas" ? "bg-gradient-gold text-background font-semibold" : "rounded-xl"
                  }
                  onClick={() => setActiveTab("perguntas")}
                  size="sm"
                >
                  <MessageCircleQuestion className="h-4 w-4 mr-1.5" /> Assistente Teológico
                </Button>
              </div>

              {/* Dynamic Reading Toolbar */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Font Resizers */}
                <div className="flex items-center gap-1 bg-background/80 rounded-xl p-1 border border-border/80">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-bold"
                    onClick={() => setFontSize((prev) => Math.max(14, prev - 2))}
                    title="Diminuir Fonte"
                  >
                    A-
                  </Button>
                  <span className="text-[11px] font-mono text-muted-foreground px-1">{fontSize}px</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs font-bold"
                    onClick={() => setFontSize((prev) => Math.min(30, prev + 2))}
                    title="Aumentar Fonte"
                  >
                    A+
                  </Button>
                </div>

                {/* Copy Full Sermon */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyFullSermon}
                  className="rounded-xl gap-1.5 text-xs"
                  title="Copiar sermão completo"
                >
                  {copiedAll ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedAll ? "Copiado" : "Copiar"}
                </Button>

                {/* Print / PDF Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="rounded-xl gap-1.5 text-xs"
                  title="Imprimir sermão formatado em folha A4"
                >
                  <Printer className="h-3.5 w-3.5" /> Imprimir / PDF
                </Button>

                {/* Modo Púlpito Button */}
                <Button
                  size="sm"
                  onClick={() => setPulpitOpen(true)}
                  className="gap-1.5 bg-amber-600 text-white hover:bg-amber-500 font-bold shadow-md shadow-amber-600/25 rounded-xl text-xs border-none transition-all active:scale-95"
                >
                  <Maximize2 className="h-3.5 w-3.5" /> Modo Púlpito
                </Button>
              </div>
            </div>
          )}

          {/* Loading Skeleton Card */}
          {loading && !result && (
            <Card className="glass-card border-amber-500/30 rounded-2xl shadow-xl p-12 text-center skeleton-gold">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
                <p className="font-serif text-xl font-bold text-foreground">
                  Estruturando Exposição Homilética Pentecostal...
                </p>
                <p className="text-xs text-muted-foreground max-w-md">
                  Consultando exegese no original, referências cruzadas ARC e obras de Eurico Bergstén, Myer Pearlman e
                  Antonio Gilberto.
                </p>
              </div>
            </Card>
          )}

          {/* Pregação Result Card */}
          {(result || loading) && activeTab === "pregacao" && (
            <Card className="glass-card border-border/80 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/40 pb-4 pulpit-hide-print">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                      {displayTema ? `Sermão: ${displayTema}` : "Esboço Homilético"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {resultTextoBase ? `Texto Base: ${resultTextoBase} • ` : ""}
                      Pronto para ministração no púlpito.
                    </p>
                  </div>
                  {result && !loading && (
                    <Button
                      size="sm"
                      onClick={() => setPulpitOpen(true)}
                      className="gap-1.5 text-xs bg-amber-600 text-white hover:bg-amber-500 font-bold rounded-xl border-none shadow-sm shadow-amber-600/20 transition-all active:scale-95"
                    >
                      <Maximize2 className="h-3.5 w-3.5" /> Tela Cheia
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <SermonContentRenderer content={result} title={displayTema} fontSize={fontSize} />

                {result && !loading && (
                  <div className="flex gap-2 flex-wrap pt-6 border-t border-border/60 pulpit-hide-print">
                    <ContentActions content={result} title={`Pregação: ${displayTema}`} contentType="pregacao" />
                    <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5 rounded-xl">
                      <Save className="h-4 w-4" /> Salvar no Perfil
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 rounded-xl">
                      <Printer className="h-4 w-4" /> Imprimir A4
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Perguntas Tab */}
          {activeTab === "perguntas" && result && !loading && (
            <Card className="glass-card border-border/80 rounded-2xl shadow-xl pulpit-hide-print">
              <CardHeader className="border-b border-border/40">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5 text-amber-500" />
                  Perguntas sobre o Sermão
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Tire dúvidas teológicas, aprofunde o léxico Grego/Hebraico ou adapte para ocasiões especiais.
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircleQuestion className="h-10 w-10 mx-auto mb-3 opacity-30 text-amber-500" />
                      <p className="text-sm font-medium">Faça uma pergunta sobre o sermão gerado.</p>
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {[
                          "Aprofunde o termo no grego/hebraico",
                          "Como conduzir o momento do apelo?",
                          "Dê mais uma ilustração bíblica cruzada",
                          "Explique o contexto histórico aos ouvintes",
                        ].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            className="text-xs rounded-full bg-background/50 hover:bg-amber-500/10 hover:border-amber-500/40"
                            onClick={() => setChatInput(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-2xl p-4 text-sm ${
                        msg.role === "user"
                          ? "bg-amber-500/10 border border-amber-500/20 ml-6"
                          : "bg-muted/80 mr-6"
                      }`}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-muted-foreground">
                        {msg.role === "user" ? "Você" : "Assistente Teológico"}
                      </p>
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap break-words leading-relaxed">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                    <div className="flex items-center gap-2 text-muted-foreground p-3">
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                      <span className="text-xs">Consultando fontes teológicas...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="flex gap-2 pt-3 border-t border-border/50">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendQuestion()}
                    placeholder="Pergunte algo sobre este esboço..."
                    className="flex-1 rounded-xl border border-input bg-background/60 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    disabled={chatLoading}
                  />
                  <Button
                    onClick={handleSendQuestion}
                    disabled={chatLoading || !chatInput.trim()}
                    size="icon"
                    className="bg-gradient-gold text-background hover:opacity-90 shrink-0 rounded-xl"
                  >
                    {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state when no result */}
          {!result && !loading && (
            <Card className="glass-card border-border/80 rounded-2xl shadow-md p-12 text-center text-muted-foreground pulpit-hide-print">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-500/40" />
              <p className="text-xl font-serif font-bold text-foreground mb-1">Nenhum sermão gerado ainda</p>
              <p className="text-sm max-w-sm mx-auto">
                Preencha o Texto Base, Tema e Parâmetros Homiléticos ao lado e clique em "Gerar Pregação Completa".
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Fullscreen Pulpit Mode Modal */}
      <PulpitModeModal
        open={pulpitOpen}
        onClose={() => setPulpitOpen(false)}
        title={displayTema || "Esboço de Pregação"}
        content={result}
      />
    </AnimatedPage>
  );
};

export default GeradorPregacoes;


