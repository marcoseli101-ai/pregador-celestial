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
  const [tema, setTema] = usePersistedState("ger:tema", "");
  const [textoBase, setTextoBase] = usePersistedState("ger:textoBase", "");
  const [publico, setPublico] = usePersistedState("ger:publico", "");
  const [tempo, setTempo] = usePersistedState("ger:tempo", "");
  const [nivel, setNivel] = usePersistedState("ger:nivel", "");
  const [estrutura, setEstrutura] = usePersistedState("ger:estrutura", "");
  const [ocasiao, setOcasiao] = usePersistedState("ger:ocasiao", "");
  const [tom, setTom] = usePersistedState("ger:tom", "");
  const [referencias, setReferencias] = usePersistedState("ger:referencias", "");
  const [result, setResult] = usePersistedState<string>("ger:result", "");
  const [resultTema, setResultTema] = usePersistedState<string>("ger:resultTema", "");
  const [loading, setLoading] = useState(false);
  const [pulpitOpen, setPulpitOpen] = useState(false);
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

  const autoSaveSermon = useCallback(async (content: string, sermonTema: string) => {
    if (!user || !content) return;
    const { error } = await supabase.from("saved_sermons").insert({
      user_id: user.id, title: sermonTema, tema: sermonTema, publico, tempo, nivel, content,
    });
    if (!error) { fetchHistory(); toast.success("Pregação salva automaticamente!"); }
  }, [user, publico, tempo, nivel, fetchHistory]);

  const handleGenerate = async () => {
    if (!tema.trim()) { toast.error("Digite um tema para a pregação"); return; }
    if (!publico) { toast.error("Selecione o público-alvo"); return; }
    if (!tempo) { toast.error("Selecione o tempo de pregação"); return; }
    if (!nivel) { toast.error("Selecione o estilo da pregação"); return; }
    if (!estrutura) { toast.error("Selecione a estrutura homilética"); return; }
    setResult("");
    setResultTema(tema);
    setLoading(true);
    setChatMessages([]);
    clearPersistedState("ger:chatMessages");
    setActiveTab("pregacao");
    let accumulated = "";
    const currentTema = tema;
    await streamSermon({
      tema, textoBase, publico, tempo, nivel, estrutura, ocasiao, tom, referencias,
      onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
      onDone: () => { setLoading(false); autoSaveSermon(accumulated, currentTema); },
      onError: (msg) => { toast.error(msg); setLoading(false); },
    });
  };

  const handleSave = async () => {
    if (!requireLogin()) return;
    if (!result) return;
    const { error } = await supabase.from("saved_sermons").insert({
      user_id: user!.id, title: resultTema || tema, tema: resultTema || tema, publico, tempo, nivel, content: result,
    });
    if (error) toast.error("Erro ao salvar");
    else { toast.success("Pregação salva no seu histórico!"); fetchHistory(); }
  };

  const handleLoadFromHistory = (sermon: SavedSermon) => {
    setResult(sermon.content);
    setResultTema(sermon.title);
    setTema(sermon.tema || sermon.title);
    if (sermon.publico) setPublico(sermon.publico);
    if (sermon.tempo) setTempo(sermon.tempo);
    if (sermon.nivel) setNivel(sermon.nivel);
    setChatMessages([]);
    setActiveTab("pregacao");
    setShowHistory(false);
    toast.success("Pregação carregada do histórico");
  };

  const handleDeleteFromHistory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from("saved_sermons").delete().eq("id", id);
    if (error) toast.error("Erro ao excluir");
    else { toast.success("Excluído"); setHistory(prev => prev.filter(s => s.id !== id)); }
  };

  const handleSendQuestion = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    const displayTema = resultTema || tema;
    const contextMessages: ChatMessage[] = [
      { role: "user", content: `Aqui está a pregação gerada sobre "${displayTema}":\n\n${result}` },
      { role: "assistant", content: "Entendi! Li a pregação completa. Pode me fazer qualquer pergunta sobre ela — teologia, aplicação, referências bíblicas, como adaptar para outro público, etc." },
      ...chatMessages,
      userMsg,
    ];
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    let accumulated = "";
    await streamSermonChat({
      messages: contextMessages,
      onDelta: (chunk) => {
        accumulated += chunk;
        setChatMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: accumulated } : m);
          }
          return [...prev, { role: "assistant", content: accumulated }];
        });
      },
      onDone: () => { setChatLoading(false); chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); },
      onError: (msg) => { toast.error(msg); setChatLoading(false); },
    });
  };

  const displayTema = resultTema || tema;

  return (
    <AnimatedPage className="container px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <AnimatedSection className="mb-8 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
          Gerador de <span className="text-gradient-gold">Esboço de Pregação</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Crie sermões bíblicos profundos, com exegese rigorosa, estrutura homilética clara e aplicações práticas para o púlpito.
        </p>
      </AnimatedSection>

      {/* Split View Container */}
      <div className="mx-auto w-full max-w-7xl grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[420px_minmax(0,1fr)] items-start">
        {/* Left Column: Parameter Form & History */}
        <div className="space-y-4">
          <Card className="glass-card border-border/80 shadow-lg rounded-2xl" data-tour="sermon-generator-form">
            <CardHeader className="pb-3 border-b border-border/40">
              <CardTitle className="font-serif text-lg font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-amber-500" />
                Parâmetros da Pregação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div>
                <Label className="text-xs font-semibold text-foreground/90">Tema da Mensagem *</Label>
                <input
                  type="text"
                  value={tema}
                  onChange={(e) => setTema(e.target.value)}
                  placeholder="Ex: O poder da fé, A volta de Jesus..."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-foreground/90">Texto Base (Opcional)</Label>
                <input
                  type="text"
                  value={textoBase}
                  onChange={(e) => setTextoBase(e.target.value)}
                  placeholder="Ex: Romanos 8:35-39, Salmos 23..."
                  className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Público-Alvo *</Label>
                  <Select value={publico} onValueChange={setPublico}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="igreja">Igreja Geral</SelectItem>
                      <SelectItem value="jovens">Jovens</SelectItem>
                      <SelectItem value="cruzada">Cruzada Evangelística</SelectItem>
                      <SelectItem value="congresso">Congresso / Obreiros</SelectItem>
                      <SelectItem value="casais">Casais</SelectItem>
                      <SelectItem value="criancas">Crianças</SelectItem>
                      <SelectItem value="idosos">Idosos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Duração *</Label>
                  <Select value={tempo} onValueChange={setTempo}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 min (rápido)</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="20">20 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Estilo *</Label>
                  <Select value={nivel} onValueChange={setNivel}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exortacao">Exortação</SelectItem>
                      <SelectItem value="ensino">Ensino Expositivo</SelectItem>
                      <SelectItem value="tematico">Temático</SelectItem>
                      <SelectItem value="textual">Textual</SelectItem>
                      <SelectItem value="doutrinario">Doutrinário</SelectItem>
                      <SelectItem value="evangelismo">Evangelismo</SelectItem>
                      <SelectItem value="devocional">Devocional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Estrutura *</Label>
                  <Select value={estrutura} onValueChange={setEstrutura}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="textual">Textual</SelectItem>
                      <SelectItem value="tematica">Temática</SelectItem>
                      <SelectItem value="expositiva">Expositiva</SelectItem>
                      <SelectItem value="doutrinaria">Doutrinária</SelectItem>
                      <SelectItem value="narrativa">Narrativa</SelectItem>
                      <SelectItem value="topica">Tópica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Ocasião</Label>
                  <Select value={ocasiao} onValueChange={setOcasiao}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Opcional" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="culto_domingo">Culto de Domingo</SelectItem>
                      <SelectItem value="culto_oracao">Culto de Oração</SelectItem>
                      <SelectItem value="santa_ceia">Santa Ceia</SelectItem>
                      <SelectItem value="batismo">Batismo</SelectItem>
                      <SelectItem value="casamento">Casamento</SelectItem>
                      <SelectItem value="funeral">Funeral</SelectItem>
                      <SelectItem value="dedicacao">Apresentação</SelectItem>
                      <SelectItem value="vigilia">Vigília</SelectItem>
                      <SelectItem value="semana_santa">Páscoa</SelectItem>
                      <SelectItem value="natal">Natal</SelectItem>
                      <SelectItem value="ano_novo">Ano Novo</SelectItem>
                      <SelectItem value="missoes">Missões</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-foreground/90">Tom</Label>
                  <Select value={tom} onValueChange={setTom}>
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Opcional" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="encorajamento">Encorajamento</SelectItem>
                      <SelectItem value="consolacao">Consolação</SelectItem>
                      <SelectItem value="confrontacao">Confrontação</SelectItem>
                      <SelectItem value="celebracao">Celebração</SelectItem>
                      <SelectItem value="urgencia">Urgência</SelectItem>
                      <SelectItem value="reflexao">Reflexão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-gradient-gold text-background hover:opacity-90 font-bold gap-2 text-base py-5 rounded-xl shadow-gold"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {loading ? "Gerando Esboço..." : "Gerar Pregação"}
              </Button>
            </CardContent>
          </Card>

          {/* History Card */}
          {user && (
            <Card className="glass-card border-border/80 shadow-md rounded-2xl">
              <CardHeader
                className="cursor-pointer py-3.5 px-4"
                onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchHistory(); }}
              >
                <CardTitle className="font-serif text-sm flex items-center gap-2">
                  <History className="h-4 w-4 text-amber-500" />
                  Histórico de Sermões Salvos
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${showHistory ? "rotate-90" : ""}`} />
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

        {/* Right Column: Live Result & Pulpit Mode */}
        <div className="space-y-4">
          {/* Header Action Bar */}
          {result && !loading && (
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "pregacao" ? "default" : "outline"}
                  className={activeTab === "pregacao" ? "bg-gradient-gold text-background font-semibold" : "rounded-xl"}
                  onClick={() => setActiveTab("pregacao")}
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-1.5" /> Esboço Completo
                </Button>
                <Button
                  variant={activeTab === "perguntas" ? "default" : "outline"}
                  className={activeTab === "perguntas" ? "bg-gradient-gold text-background font-semibold" : "rounded-xl"}
                  onClick={() => setActiveTab("perguntas")}
                  size="sm"
                >
                  <MessageCircleQuestion className="h-4 w-4 mr-1.5" /> Assistente Teológico
                </Button>
              </div>

              {/* Modo Púlpito Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPulpitOpen(true)}
                className="gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-500 font-bold hover:bg-amber-500/20 rounded-xl"
              >
                <Maximize2 className="h-4 w-4" /> Modo Púlpito (Tela Cheia)
              </Button>
            </div>
          )}

          {/* Loading Skeleton Card */}
          {loading && !result && (
            <Card className="glass-card border-border/80 rounded-2xl shadow-lg p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
                <p className="font-serif text-lg font-bold text-foreground">Estruturando Exposição Homilética...</p>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Consultando hermenêutica bíblica, referências cruzadas e organizando tópicos pregáveis.
                </p>
              </div>
            </Card>
          )}

          {/* Pregação Result Card */}
          {(result || loading) && activeTab === "pregacao" && (
            <Card className="glass-card border-border/80 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <CardTitle className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                      {displayTema ? `Sermão: ${displayTema}` : "Esboço Homilético"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pronto para ministração com divisões claras e versículos integrados.
                    </p>
                  </div>
                  {result && !loading && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPulpitOpen(true)}
                      className="gap-1.5 text-xs text-amber-500 border-amber-500/30 font-semibold rounded-xl"
                    >
                      <Maximize2 className="h-3.5 w-3.5" /> Púlpito
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <SermonContentRenderer content={result} title={displayTema} />

                {result && !loading && (
                  <div className="flex gap-2 flex-wrap pt-6 border-t border-border/60">
                    <ContentActions content={result} title={`Pregação: ${displayTema}`} contentType="pregacao" />
                    <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5 rounded-xl">
                      <Save className="h-4 w-4" /> Salvar no Perfil
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Perguntas Tab */}
          {activeTab === "perguntas" && result && !loading && (
            <Card className="glass-card border-border/80 rounded-2xl shadow-xl">
              <CardHeader className="border-b border-border/40">
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5 text-amber-500" />
                  Perguntas sobre a Pregação
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Tire dúvidas teológicas, solicite mais ilustrações ou adapte o sermão para contextos específicos.
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircleQuestion className="h-10 w-10 mx-auto mb-3 opacity-30 text-amber-500" />
                      <p className="text-sm font-medium">Faça uma pergunta sobre o sermão gerado.</p>
                      <div className="mt-4 flex flex-wrap gap-2 justify-center">
                        {["Quais outros versículos posso usar?", "Como adaptar para jovens?", "Explique o contexto histórico", "Dê mais ilustrações"].map((suggestion) => (
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
            <Card className="glass-card border-border/80 rounded-2xl shadow-md p-12 text-center text-muted-foreground">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-amber-500/40" />
              <p className="text-xl font-serif font-bold text-foreground mb-1">Nenhum esboço gerado ainda</p>
              <p className="text-sm max-w-sm mx-auto">
                Preencha o tema e as preferências ao lado e clique em "Gerar Pregação".
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

