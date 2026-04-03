import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import { Sparkles, Save, Loader2, MessageCircleQuestion, Send, BookOpen, History, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { streamSermon, streamSermonChat, type ChatMessage } from "@/lib/stream-chat";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentActions } from "@/components/ContentActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BibleTextContent } from "@/components/BibleVerseLink";

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
  const [tema, setTema] = useState("");
  const [publico, setPublico] = useState("");
  const [tempo, setTempo] = useState("");
  const [nivel, setNivel] = useState("");
  const [estrutura, setEstrutura] = useState("");
  const [ocasiao, setOcasiao] = useState("");
  const [tom, setTom] = useState("");
  const [result, setResult] = useState(() => localStorage.getItem("lastSermon") || "");
  const [resultTema, setResultTema] = useState(() => localStorage.getItem("lastSermonTema") || "");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // History state
  const [history, setHistory] = useState<SavedSermon[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Q&A state
  const [activeTab, setActiveTab] = useState<"pregacao" | "perguntas">("pregacao");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Persist result to localStorage
  useEffect(() => {
    if (result) {
      localStorage.setItem("lastSermon", result);
      localStorage.setItem("lastSermonTema", resultTema || tema);
    }
  }, [result, resultTema, tema]);

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

  const handleGenerate = async () => {
    if (!tema.trim()) { toast.error("Digite um tema para a pregação"); return; }
    setResult("");
    setResultTema(tema);
    setLoading(true);
    setChatMessages([]);
    setActiveTab("pregacao");
    let accumulated = "";
    await streamSermon({
      tema, publico, tempo, nivel, estrutura, ocasiao, tom,
      onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
      onDone: () => setLoading(false),
      onError: (msg) => { toast.error(msg); setLoading(false); },
    });
  };

  const handleSave = async () => {
    if (!user) { toast.error("Faça login para salvar pregações"); return; }
    if (!result) return;
    const { error } = await supabase.from("saved_sermons").insert({
      user_id: user.id, title: resultTema || tema, tema: resultTema || tema, publico, tempo, nivel, content: result,
    });
    if (error) toast.error("Erro ao salvar");
    else { toast.success("Pregação salva!"); fetchHistory(); }
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
    <AnimatedPage className="container py-12">
      <AnimatedSection className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Gerador de Pregações <span className="text-gradient-gold">com IA</span></h1>
        <p className="text-muted-foreground">Gere esboços e sermões completos com inteligência artificial e base bíblica sólida.</p>
      </AnimatedSection>

      <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Left column: Config + History */}
        <div className="space-y-4">
          <Card className="shadow-celestial border-celestial/20">
            <CardHeader>
              <CardTitle className="font-serif">Configure sua Pregação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label>Tema da Mensagem</Label>
                <input type="text" value={tema} onChange={(e) => setTema(e.target.value)} placeholder="Ex: O poder da fé, A volta de Jesus..." className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <Label>Público-Alvo</Label>
                <Select value={publico} onValueChange={setPublico}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="igreja">Igreja</SelectItem>
                    <SelectItem value="jovens">Jovens</SelectItem>
                    <SelectItem value="cruzada">Cruzada Evangelística</SelectItem>
                    <SelectItem value="congresso">Congresso</SelectItem>
                    <SelectItem value="casais">Casais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tempo de Pregação</Label>
                <Select value={tempo} onValueChange={setTempo}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estilo da Pregação</Label>
                <Select value={nivel} onValueChange={setNivel}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="exortacao">Exortação</SelectItem>
                    <SelectItem value="avivamento">Avivamento</SelectItem>
                    <SelectItem value="ensino">Ensino Expositivo</SelectItem>
                    <SelectItem value="evangelismo">Evangelismo</SelectItem>
                    <SelectItem value="devocional">Devocional</SelectItem>
                    <SelectItem value="profetico">Profético</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estrutura Homilética</Label>
                <Select value={estrutura} onValueChange={setEstrutura}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="textual">Textual</SelectItem>
                    <SelectItem value="tematica">Temática</SelectItem>
                    <SelectItem value="expositiva">Expositiva</SelectItem>
                    <SelectItem value="narrativa">Narrativa</SelectItem>
                    <SelectItem value="topica">Tópica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ocasião / Evento</Label>
                <Select value={ocasiao} onValueChange={setOcasiao}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="culto_domingo">Culto de Domingo</SelectItem>
                    <SelectItem value="culto_oracao">Culto de Oração</SelectItem>
                    <SelectItem value="santa_ceia">Santa Ceia</SelectItem>
                    <SelectItem value="batismo">Batismo</SelectItem>
                    <SelectItem value="casamento">Casamento</SelectItem>
                    <SelectItem value="funeral">Funeral / Celebração de Vida</SelectItem>
                    <SelectItem value="dedicacao">Dedicação de Crianças</SelectItem>
                    <SelectItem value="vigilia">Vigília</SelectItem>
                    <SelectItem value="semana_santa">Semana Santa / Páscoa</SelectItem>
                    <SelectItem value="natal">Natal</SelectItem>
                    <SelectItem value="ano_novo">Ano Novo</SelectItem>
                    <SelectItem value="missoes">Conferência de Missões</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tom Emocional</Label>
                <Select value={tom} onValueChange={setTom}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione (opcional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="encorajamento">Encorajamento</SelectItem>
                    <SelectItem value="consolacao">Consolação</SelectItem>
                    <SelectItem value="confrontacao">Confrontação Amorosa</SelectItem>
                    <SelectItem value="celebracao">Celebração / Louvor</SelectItem>
                    <SelectItem value="urgencia">Urgência Espiritual</SelectItem>
                    <SelectItem value="reflexao">Reflexão Profunda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2 text-base" size="lg">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                {loading ? "Gerando..." : "Gerar Pregação"}
              </Button>
            </CardContent>
          </Card>

          {/* History Card */}
          {user && (
            <Card className="shadow-celestial border-celestial/20">
              <CardHeader className="cursor-pointer pb-3" onClick={() => { setShowHistory(!showHistory); if (!showHistory) fetchHistory(); }}>
                <CardTitle className="font-serif text-base flex items-center gap-2">
                  <History className="h-4 w-4 text-accent" />
                  Histórico de Pregações
                  <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${showHistory ? "rotate-90" : ""}`} />
                </CardTitle>
              </CardHeader>
              {showHistory && (
                <CardContent className="pt-0">
                  {historyLoading ? (
                    <div className="flex items-center gap-2 text-muted-foreground py-4 justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                    </div>
                  ) : history.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma pregação salva ainda.</p>
                  ) : (
                    <ScrollArea className="max-h-[300px]">
                      <div className="space-y-1.5">
                        {history.map((sermon) => (
                          <div
                            key={sermon.id}
                            onClick={() => handleLoadFromHistory(sermon)}
                            className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-accent/10 cursor-pointer group transition-colors border border-transparent hover:border-accent/20"
                          >
                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{sermon.title}</p>
                              <p className="text-[11px] text-muted-foreground">
                                {new Date(sermon.created_at).toLocaleDateString("pt-BR")}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 shrink-0 text-destructive hover:text-destructive"
                              onClick={(e) => handleDeleteFromHistory(sermon.id, e)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
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

        {/* Right column: Result (always visible if result exists) */}
        <div className="space-y-4">
          {/* Tabs */}
          {result && !loading && (
            <div className="flex gap-2">
              <Button variant={activeTab === "pregacao" ? "default" : "outline"} className={activeTab === "pregacao" ? "bg-gradient-gold text-background" : ""} onClick={() => setActiveTab("pregacao")} size="sm">
                <BookOpen className="h-4 w-4 mr-1.5" /> Pregação
              </Button>
              <Button variant={activeTab === "perguntas" ? "default" : "outline"} className={activeTab === "perguntas" ? "bg-gradient-gold text-background" : ""} onClick={() => setActiveTab("perguntas")} size="sm">
                <MessageCircleQuestion className="h-4 w-4 mr-1.5" /> Perguntas sobre a Pregação
              </Button>
            </div>
          )}

          {/* Loading state */}
          {loading && !result && (
            <Card className="shadow-celestial border-celestial/20">
              <CardContent className="py-12 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" /> Gerando pregação com IA...
              </CardContent>
            </Card>
          )}

          {/* Pregação Tab - always show if result exists */}
          {(result || loading) && activeTab === "pregacao" && (
            <Card className="shadow-celestial border-celestial/20">
              <CardHeader>
                <CardTitle className="font-serif">{displayTema ? `Pregação: ${displayTema}` : "Pregação Gerada"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {result ? <BibleTextContent content={result} /> : <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Gerando pregação com IA...</div>}
                </div>
                {result && !loading && (
                  <div className="flex gap-2 flex-wrap pt-4 border-t border-border">
                    <ContentActions content={result} title={`Pregação: ${displayTema}`} contentType="pregacao" />
                    <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-4 w-4" /> Salvar</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Perguntas Tab */}
          {activeTab === "perguntas" && result && !loading && (
            <Card className="shadow-celestial border-celestial/20">
              <CardHeader>
                <CardTitle className="font-serif flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5 text-accent" />
                  Perguntas sobre a Pregação
                </CardTitle>
                <p className="text-sm text-muted-foreground">Tire dúvidas teológicas, peça mais referências ou adapte a pregação.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageCircleQuestion className="h-10 w-10 mx-auto mb-3 opacity-40" />
                      <p className="text-sm">Faça uma pergunta sobre a pregação gerada.</p>
                      <div className="mt-3 flex flex-wrap gap-2 justify-center">
                        {["Quais outros versículos posso usar?", "Como adaptar para jovens?", "Explique o contexto histórico", "Dê mais ilustrações"].map((suggestion) => (
                          <Button key={suggestion} variant="outline" size="sm" className="text-xs" onClick={() => setChatInput(suggestion)}>
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`rounded-lg p-3 text-sm ${msg.role === "user" ? "bg-accent/10 border border-accent/20 ml-8" : "bg-muted mr-8"}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-muted-foreground">
                        {msg.role === "user" ? "Você" : "IA Teológica"}
                      </p>
                      <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"><BibleTextContent content={msg.content} /></div>
                    </div>
                  ))}
                  {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                    <div className="flex items-center gap-2 text-muted-foreground p-3">
                      <Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Pensando...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendQuestion()} placeholder="Pergunte algo sobre a pregação..." className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" disabled={chatLoading} />
                  <Button onClick={handleSendQuestion} disabled={chatLoading || !chatInput.trim()} size="icon" className="bg-gradient-gold text-background hover:opacity-90 shrink-0">
                    {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty state when no result */}
          {!result && !loading && (
            <Card className="shadow-celestial border-celestial/20">
              <CardContent className="py-16 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-serif mb-1">Nenhuma pregação gerada ainda</p>
                <p className="text-sm">Configure o tema ao lado e clique em "Gerar Pregação"</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default GeradorPregacoes;
