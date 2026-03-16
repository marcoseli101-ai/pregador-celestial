import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, ChevronRight, CheckCircle2, Lock, MessageCircle, Send, Loader2, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

/* ─── Módulos do curso ─── */
const modules = [
  {
    id: 1, title: "Introdução à Teologia", lessons: [
      { id: "1.1", title: "O que é Teologia?", content: "Teologia é o estudo sistemático de Deus, da Sua natureza, dos Seus atributos e da Sua relação com a humanidade e o universo. A palavra vem do grego *theós* (Deus) + *lógos* (estudo/palavra).\n\n**Divisões principais:**\n- **Teologia Bíblica** — estuda os temas da Bíblia em ordem canônica\n- **Teologia Sistemática** — organiza doutrinas por tópicos\n- **Teologia Histórica** — acompanha o desenvolvimento das doutrinas ao longo dos séculos\n- **Teologia Prática** — aplica a doutrina ao ministério e à vida\n\n**Referência:** 2 Timóteo 2:15 — *\"Procura apresentar-te a Deus aprovado, como obreiro que não tem de que se envergonhar, que maneja bem a palavra da verdade.\"*" },
      { id: "1.2", title: "Revelação Geral e Especial", content: "Deus Se revela de duas formas fundamentais:\n\n### Revelação Geral\nÉ o conhecimento de Deus acessível a todas as pessoas por meio da criação, da consciência moral e da providência divina.\n- **Salmo 19:1** — *\"Os céus declaram a glória de Deus...\"*\n- **Romanos 1:20** — *\"Os atributos invisíveis de Deus... se tornam claramente vistos\"*\n\n### Revelação Especial\nÉ a comunicação direta e específica de Deus registrada nas Escrituras e culminada em Jesus Cristo.\n- **Hebreus 1:1-2** — *\"Deus... falou-nos pelo Filho\"*\n- **2 Timóteo 3:16** — *\"Toda a Escritura é divinamente inspirada\"*\n\nA Revelação Especial é necessária porque o pecado obscureceu a capacidade humana de compreender Deus apenas pela natureza." },
      { id: "1.3", title: "A Inspiração e Inerrância das Escrituras", content: "### Inspiração\nA doutrina da inspiração afirma que Deus guiou os autores bíblicos de modo que o que escreveram é a Palavra de Deus.\n\n- **Inspiração Verbal Plenária**: cada palavra da Escritura original é inspirada\n- **2 Pedro 1:21** — *\"Homens santos de Deus falaram inspirados pelo Espírito Santo\"*\n\n### Inerrância\nA Bíblia não contém erros em seus manuscritos originais em tudo o que afirma.\n\n### Autoridade\nPor ser Palavra de Deus, a Bíblia é a regra suprema de fé e prática.\n- **Isaías 40:8** — *\"A palavra do nosso Deus subsiste eternamente\"*" },
    ],
  },
  {
    id: 2, title: "Teologia Própria (Deus)", lessons: [
      { id: "2.1", title: "A Existência de Deus", content: "### Argumentos Clássicos\n\n1. **Cosmológico** — Tudo que existe tem uma causa; a causa primeira é Deus\n2. **Teleológico** — O design do universo aponta para um Designer inteligente\n3. **Moral** — A existência de leis morais universais aponta para um Legislador\n4. **Ontológico** — A própria ideia de um Ser perfeito implica Sua existência\n\n**Romanos 1:19-20** — A existência de Deus é evidente na criação.\n\n**Salmo 14:1** — *\"Disse o néscio no seu coração: Não há Deus.\"*" },
      { id: "2.2", title: "Os Atributos de Deus", content: "### Atributos Incomunicáveis\nCaracterísticas exclusivas de Deus:\n- **Aseidade** — Deus existe por Si mesmo (João 5:26)\n- **Imutabilidade** — Deus não muda (Malaquias 3:6)\n- **Eternidade** — Deus está acima do tempo (Salmo 90:2)\n- **Onipresença** — Presente em toda parte (Salmo 139:7-10)\n- **Onisciência** — Sabe todas as coisas (1 João 3:20)\n- **Onipotência** — Todo-poderoso (Apocalipse 19:6)\n\n### Atributos Comunicáveis\nReflexos limitados em nós:\n- Amor, Santidade, Justiça, Bondade, Sabedoria, Verdade" },
      { id: "2.3", title: "A Trindade", content: "### Definição\nUm só Deus existindo eternamente em três Pessoas distintas — Pai, Filho e Espírito Santo — iguais em essência, poder e glória.\n\n### Base Bíblica\n- **Mateus 28:19** — Batismo em nome do Pai, Filho e Espírito Santo\n- **2 Coríntios 13:13** — Bênção trinitária de Paulo\n- **Gênesis 1:26** — *\"Façamos o homem à nossa imagem\"*\n- **João 1:1** — O Verbo era Deus\n- **Atos 5:3-4** — O Espírito Santo é chamado Deus\n\n### Distinções\n- O Pai planeja a redenção\n- O Filho executa a redenção\n- O Espírito aplica a redenção" },
    ],
  },
  {
    id: 3, title: "Cristologia (Cristo)", lessons: [
      { id: "3.1", title: "A Pessoa de Cristo", content: "### As Duas Naturezas\nJesus Cristo é plenamente Deus e plenamente homem, unidas em uma só Pessoa — a **união hipostática**.\n\n**Divindade de Cristo:**\n- João 1:1 — *\"O Verbo era Deus\"*\n- Colossenses 2:9 — *\"Nele habita toda a plenitude da Divindade\"*\n- Hebreus 1:3 — *\"A expressão exata do Seu ser\"*\n\n**Humanidade de Cristo:**\n- Filipenses 2:7 — *\"Esvaziou-se... feito semelhante aos homens\"*\n- Hebreus 4:15 — *\"Tentado em tudo... mas sem pecado\"*\n- Lucas 2:52 — Jesus crescia em sabedoria e estatura" },
      { id: "3.2", title: "A Obra Redentora de Cristo", content: "### Os Três Ofícios\n1. **Profeta** — Revelou a vontade de Deus (Deuteronômio 18:15; João 6:14)\n2. **Sacerdote** — Ofereceu-Se como sacrifício perfeito (Hebreus 7:27; 9:12)\n3. **Rei** — Reina sobre Seu povo e virá em glória (Apocalipse 19:16)\n\n### Teorias da Expiação\n- **Substituição Penal** — Cristo tomou nosso lugar no castigo (Isaías 53:5)\n- **Resgate** — Pagou o preço para nos libertar (Marcos 10:45)\n- **Vitória** — Triunfou sobre o pecado e a morte (Colossenses 2:15)\n\n**Romanos 5:8** — *\"Cristo morreu por nós, sendo nós ainda pecadores.\"*" },
    ],
  },
  {
    id: 4, title: "Pneumatologia (Espírito Santo)", lessons: [
      { id: "4.1", title: "A Pessoa do Espírito Santo", content: "O Espírito Santo não é uma força impessoal — é a terceira Pessoa da Trindade.\n\n### Evidências de Personalidade\n- Ele **ensina** (João 14:26)\n- Ele **intercede** (Romanos 8:26)\n- Ele pode ser **entristecido** (Efésios 4:30)\n- Ele pode ser **resistido** (Atos 7:51)\n\n### Evidências de Divindade\n- Chamado de Deus (Atos 5:3-4)\n- Possui atributos divinos: onipresença (Salmo 139:7), onisciência (1 Coríntios 2:10-11)\n- Participou da criação (Gênesis 1:2)" },
      { id: "4.2", title: "Os Dons e o Batismo no Espírito", content: "### Batismo no Espírito Santo\nExperiência distinta da conversão, revestimento de poder para o serviço.\n- **Atos 1:8** — *\"Recebereis poder ao descer sobre vós o Espírito Santo\"*\n- **Atos 2:4** — *\"Todos foram cheios do Espírito Santo e começaram a falar em outras línguas\"*\n\n### Dons Espirituais (1 Coríntios 12:4-11)\n- **Revelação:** Palavra de sabedoria, palavra de conhecimento, discernimento\n- **Poder:** Fé, cura, milagres\n- **Comunicação:** Profecia, línguas, interpretação\n\n**1 Coríntios 14:1** — *\"Segui o amor e procurai com zelo os dons espirituais.\"*" },
    ],
  },
  {
    id: 5, title: "Soteriologia (Salvação)", lessons: [
      { id: "5.1", title: "Eleição, Chamado e Regeneração", content: "### Ordo Salutis (Ordem da Salvação)\n1. **Eleição** — Deus escolheu em Cristo antes da fundação do mundo (Efésios 1:4)\n2. **Chamado** — Deus chama eficazmente pelo Evangelho (Romanos 8:30)\n3. **Regeneração** — O novo nascimento pelo Espírito (João 3:3-5; Tito 3:5)\n\n### Graça Preveniente\nDeus age antes mesmo da resposta humana, capacitando a fé.\n- **João 6:44** — *\"Ninguém pode vir a mim se o Pai... não o atrair\"*\n\n### A Fé\n- **Efésios 2:8-9** — *\"Pela graça sois salvos, mediante a fé... dom de Deus\"*" },
      { id: "5.2", title: "Justificação e Santificação", content: "### Justificação\nAto judicial de Deus que declara o pecador justo com base na obra de Cristo.\n- **Romanos 3:24** — *\"Justificados gratuitamente pela sua graça\"*\n- **Romanos 5:1** — *\"Justificados pela fé, temos paz com Deus\"*\n\n### Santificação\nProcesso contínuo de transformação à imagem de Cristo.\n- **Posicional** — Já somos santos em Cristo (1 Coríntios 1:2)\n- **Progressiva** — Crescemos em santidade (2 Coríntios 3:18)\n- **Final** — Seremos plenamente transformados (1 João 3:2)\n\n**Filipenses 2:12-13** — *\"Operai a vossa salvação... pois é Deus quem opera em vós.\"*" },
    ],
  },
  {
    id: 6, title: "Eclesiologia (Igreja)", lessons: [
      { id: "6.1", title: "Natureza e Missão da Igreja", content: "### Definição\nA Igreja (*ekklēsía*) é a assembleia dos chamados por Deus, o Corpo de Cristo na terra.\n\n### Imagens Bíblicas\n- **Corpo de Cristo** (1 Coríntios 12:27)\n- **Templo do Espírito** (1 Coríntios 3:16)\n- **Noiva de Cristo** (Efésios 5:25-27)\n- **Coluna da verdade** (1 Timóteo 3:15)\n\n### Missão\n1. **Adoração** — Glorificar a Deus (Efésios 1:12)\n2. **Edificação** — Crescer em maturidade (Efésios 4:12-13)\n3. **Evangelização** — Fazer discípulos (Mateus 28:19-20)\n4. **Serviço** — Demonstrar o amor de Cristo (Gálatas 5:13)" },
    ],
  },
  {
    id: 7, title: "Escatologia (Últimas Coisas)", lessons: [
      { id: "7.1", title: "A Segunda Vinda e o Milênio", content: "### A Volta de Cristo\nJesus prometeu que voltaria pessoal, visível e gloriosamente.\n- **Atos 1:11** — *\"Esse Jesus... virá do modo como o vistes ir\"*\n- **Mateus 24:30** — *\"Verão o Filho do Homem vindo sobre as nuvens\"*\n\n### Visões sobre o Milênio\n- **Pré-Milenismo** — Cristo volta antes dos 1.000 anos literais\n- **Pós-Milenismo** — Cristo volta após um período de expansão do Evangelho\n- **Amilenismo** — Os 1.000 anos são simbólicos do período atual da Igreja\n\n### Eventos Finais\n- Arrebatamento da Igreja (1 Tessalonicenses 4:16-17)\n- Grande Tribulação (Mateus 24:21)\n- Juízo Final (Apocalipse 20:11-15)\n- Novos Céus e Nova Terra (Apocalipse 21:1)" },
    ],
  },
];

type ChatMsg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/theology-chat`;

const CursoTeologia = () => {
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("theology-completed") || "[]"); } catch { return []; }
  });
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const currentModule = modules[activeModule];
  const currentLesson = currentModule.lessons[activeLesson];

  const toggleComplete = (lessonId: string) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];
    setCompletedLessons(updated);
    localStorage.setItem("theology-completed", JSON.stringify(updated));
  };

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const progress = Math.round((completedLessons.length / totalLessons) * 100);

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    const allMessages = [...chatMessages, userMsg];
    setChatMessages(allMessages);
    setChatInput("");
    setChatLoading(true);

    let assistantSoFar = "";

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: allMessages,
          context: `Módulo atual: ${currentModule.title} — Aula: ${currentLesson.title}`,
        }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(err.error || `Erro ${resp.status}`);
      }

      if (!resp.body) throw new Error("Sem resposta");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) {
              assistantSoFar += c;
              setChatMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant") return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      toast({ title: "Erro", description: e.message, variant: "destructive" });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Curso de <span className="text-gradient-gold">Teologia</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estudo completo e sistemático das doutrinas fundamentais da fé cristã, com suporte de IA para tirar dúvidas.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <div className="h-2 w-48 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-gradient-gold transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-sm text-muted-foreground font-medium">{progress}% concluído</span>
        </div>
      </motion.div>

      <Tabs defaultValue="course" className="max-w-6xl mx-auto">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="course" className="gap-2"><GraduationCap className="h-4 w-4" /> Aulas</TabsTrigger>
          <TabsTrigger value="chat" className="gap-2"><MessageCircle className="h-4 w-4" /> Tirar Dúvidas</TabsTrigger>
        </TabsList>

        {/* ─── Aulas ─── */}
        <TabsContent value="course">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Sidebar de módulos */}
            <Card className="border-border/50 h-fit lg:sticky lg:top-20">
              <CardContent className="p-3">
                <ScrollArea className="max-h-[70vh]">
                  {modules.map((mod, mi) => (
                    <div key={mod.id}>
                      <button
                        onClick={() => setExpandedModule(expandedModule === mi ? null : mi)}
                        className={cn(
                          "w-full flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold transition-colors text-left",
                          activeModule === mi ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 shrink-0" />
                          <span className="truncate">{mod.title}</span>
                        </span>
                        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", expandedModule === mi && "rotate-180")} />
                      </button>
                      {expandedModule === mi && (
                        <div className="ml-4 border-l border-border pl-2 mb-1">
                          {mod.lessons.map((les, li) => (
                            <button
                              key={les.id}
                              onClick={() => { setActiveModule(mi); setActiveLesson(li); }}
                              className={cn(
                                "w-full flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors text-left",
                                activeModule === mi && activeLesson === li ? "bg-accent/60 text-accent-foreground" : "hover:bg-muted/50 text-muted-foreground"
                              )}
                            >
                              {completedLessons.includes(les.id)
                                ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                                : <Lock className="h-3.5 w-3.5 shrink-0 opacity-40" />}
                              <span className="truncate">{les.title}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Conteúdo da aula */}
            <Card className="border-border/50">
              <CardContent className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Badge variant="secondary" className="text-xs">{currentModule.title}</Badge>
                  <ChevronRight className="h-3 w-3" />
                  <span>Aula {activeLesson + 1}</span>
                </div>
                <h2 className="font-serif text-2xl font-bold mb-6">{currentLesson.title}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => toggleComplete(currentLesson.id)}
                    variant={completedLessons.includes(currentLesson.id) ? "default" : "outline"}
                    className={cn("gap-2", completedLessons.includes(currentLesson.id) && "bg-green-600 hover:bg-green-700")}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {completedLessons.includes(currentLesson.id) ? "Concluída" : "Marcar como Concluída"}
                  </Button>

                  {activeLesson < currentModule.lessons.length - 1 && (
                    <Button variant="outline" onClick={() => setActiveLesson(activeLesson + 1)} className="gap-2">
                      Próxima Aula <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  {activeLesson === currentModule.lessons.length - 1 && activeModule < modules.length - 1 && (
                    <Button variant="outline" onClick={() => { setActiveModule(activeModule + 1); setActiveLesson(0); setExpandedModule(activeModule + 1); }} className="gap-2">
                      Próximo Módulo <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── Chat IA ─── */}
        <TabsContent value="chat">
          <Card className="border-border/50 max-w-3xl mx-auto">
            <CardContent className="p-0 flex flex-col" style={{ height: "70vh" }}>
              <div className="border-b border-border px-4 py-3 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-accent" />
                <span className="font-serif font-semibold">Assistente Teológico</span>
                <span className="text-xs text-muted-foreground ml-auto">Tire suas dúvidas sobre teologia</span>
              </div>

              <ScrollArea className="flex-1 px-4 py-4">
                {chatMessages.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm mt-16">
                    <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="font-serif text-base">Faça sua pergunta teológica</p>
                    <p className="mt-1 text-xs">Ex: "O que é a doutrina da Trindade?" ou "Explique Romanos 8:28"</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div key={i} className={cn("mb-4 flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                    <div className={cn("max-w-[85%] rounded-2xl px-4 py-3 text-sm", msg.role === "user" ? "bg-accent text-accent-foreground rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm")}>
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                {chatLoading && chatMessages[chatMessages.length - 1]?.role !== "assistant" && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </ScrollArea>

              <div className="border-t border-border p-3 flex gap-2">
                <Textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Digite sua dúvida teológica..."
                  className="min-h-[44px] max-h-[120px] resize-none"
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                />
                <Button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} size="icon" className="shrink-0 bg-gradient-gold text-background hover:opacity-90">
                  {chatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CursoTeologia;
