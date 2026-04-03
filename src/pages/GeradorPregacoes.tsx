import { useState, useRef } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import { Sparkles, Save, Loader2, MessageCircleQuestion, Send, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { streamSermon, streamSermonChat, type ChatMessage } from "@/lib/stream-chat";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentActions } from "@/components/ContentActions";

const GeradorPregacoes = () => {
  const [tema, setTema] = useState("");
  const [publico, setPublico] = useState("");
  const [tempo, setTempo] = useState("");
  const [nivel, setNivel] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Q&A state
  const [activeTab, setActiveTab] = useState<"pregacao" | "perguntas">("pregacao");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleGenerate = async () => {
    if (!tema.trim()) { toast.error("Digite um tema para a pregação"); return; }
    setResult("");
    setLoading(true);
    setChatMessages([]);
    setActiveTab("pregacao");
    let accumulated = "";
    await streamSermon({
      tema, publico, tempo, nivel,
      onDelta: (chunk) => { accumulated += chunk; setResult(accumulated); },
      onDone: () => setLoading(false),
      onError: (msg) => { toast.error(msg); setLoading(false); },
    });
  };

  const handleSave = async () => {
    if (!user) { toast.error("Faça login para salvar pregações"); return; }
    if (!result) return;
    const { error } = await supabase.from("saved_sermons").insert({
      user_id: user.id, title: tema, tema, publico, tempo, nivel, content: result,
    });
    if (error) toast.error("Erro ao salvar"); else toast.success("Pregação salva!");
  };

  const handleSendQuestion = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    
    // Build context: include the sermon as the first message
    const contextMessages: ChatMessage[] = [
      { role: "user", content: `Aqui está a pregação gerada sobre "${tema}":\n\n${result}` },
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
      onDone: () => {
        setChatLoading(false);
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      },
      onError: (msg) => { toast.error(msg); setChatLoading(false); },
    });
  };

  return (
    <AnimatedPage className="container py-12">
      <AnimatedSection className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Gerador de Pregações <span className="text-gradient-gold">com IA</span></h1>
        <p className="text-muted-foreground">Gere esboços e sermões completos com inteligência artificial e base bíblica sólida.</p>
      </AnimatedSection>

      <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-[400px_1fr]">
        <Card className="shadow-celestial border-celestial/20 h-fit">
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
              <Label>Nível Espiritual</Label>
              <Select value={nivel} onValueChange={setNivel}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exortacao">Exortação</SelectItem>
                  <SelectItem value="avivamento">Avivamento</SelectItem>
                  <SelectItem value="ensino">Ensino</SelectItem>
                  <SelectItem value="evangelismo">Evangelismo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2 text-base" size="lg">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {loading ? "Gerando..." : "Gerar Pregação"}
            </Button>
          </CardContent>
        </Card>

        {(result || loading) && (
          <div className="space-y-4">
            {/* Tabs */}
            {result && !loading && (
              <div className="flex gap-2">
                <Button
                  variant={activeTab === "pregacao" ? "default" : "outline"}
                  className={activeTab === "pregacao" ? "bg-gradient-gold text-background" : ""}
                  onClick={() => setActiveTab("pregacao")}
                  size="sm"
                >
                  <BookOpen className="h-4 w-4 mr-1.5" />
                  Pregação
                </Button>
                <Button
                  variant={activeTab === "perguntas" ? "default" : "outline"}
                  className={activeTab === "perguntas" ? "bg-gradient-gold text-background" : ""}
                  onClick={() => setActiveTab("perguntas")}
                  size="sm"
                >
                  <MessageCircleQuestion className="h-4 w-4 mr-1.5" />
                  Perguntas sobre a Pregação
                </Button>
              </div>
            )}

            {/* Pregação Tab */}
            {activeTab === "pregacao" && (
              <Card className="shadow-celestial border-celestial/20">
                <CardHeader>
                  <CardTitle className="font-serif">Pregação Gerada</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {result || <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Gerando pregação com IA...</div>}
                  </div>
                  {result && !loading && (
                    <div className="flex gap-2 flex-wrap pt-4 border-t border-border">
                      <ContentActions content={result} title={`Pregação: ${tema}`} contentType="pregacao" />
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
                  {/* Chat messages */}
                  <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageCircleQuestion className="h-10 w-10 mx-auto mb-3 opacity-40" />
                        <p className="text-sm">Faça uma pergunta sobre a pregação gerada.</p>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                          {[
                            "Quais outros versículos posso usar?",
                            "Como adaptar para jovens?",
                            "Explique o contexto histórico",
                            "Dê mais ilustrações",
                          ].map((suggestion) => (
                            <Button
                              key={suggestion}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => { setChatInput(suggestion); }}
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
                        className={`rounded-lg p-3 text-sm ${
                          msg.role === "user"
                            ? "bg-accent/10 border border-accent/20 ml-8"
                            : "bg-muted mr-8"
                        }`}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 text-muted-foreground">
                          {msg.role === "user" ? "Você" : "IA Teológica"}
                        </p>
                        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                      <div className="flex items-center gap-2 text-muted-foreground p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Pensando...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendQuestion()}
                      placeholder="Pergunte algo sobre a pregação..."
                      className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      disabled={chatLoading}
                    />
                    <Button
                      onClick={handleSendQuestion}
                      disabled={chatLoading || !chatInput.trim()}
                      size="icon"
                      className="bg-gradient-gold text-background hover:opacity-90 shrink-0"
                    >
                      {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </AnimatedPage>
  );
};

export default GeradorPregacoes;
