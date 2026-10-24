import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  ChevronRight,
  Bookmark,
  Share2,
  Copy,
  Check,
  Printer,
  HelpCircle,
  Lightbulb,
  Clock,
  Send,
  Loader2,
  Layers,
  Users,
  Award,
  Calendar,
  Compass,
  MessageSquare,
  FileText,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EBD_MAGAZINES, EBDMagazine, EBDLesson } from "@/data/escolaBiblicaData";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { shareContent } from "@/lib/share";
import { useToast } from "@/hooks/use-toast";

export default function EscolaBiblica() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<"adultos" | "jovens" | "discipulado">("adultos");
  const [selectedMagazineId, setSelectedMagazineId] = useState<string>(EBD_MAGAZINES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(EBD_MAGAZINES[0].lessons[0].id);
  
  // Teacher notes state
  const [teacherNotes, setTeacherNotes] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // AI Assistance states
  const [aiActiveTab, setAiActiveTab] = useState<"plano" | "dinamica" | "perguntas" | "ilustracao" | "chat">("plano");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState<string>("");
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);

  const activeMagazine: EBDMagazine = EBD_MAGAZINES.find((m) => m.id === selectedMagazineId) || EBD_MAGAZINES[0];
  const activeLesson: EBDLesson = activeMagazine.lessons.find((l) => l.id === selectedLessonId) || activeMagazine.lessons[0];

  // Sync category with magazine
  const handleCategoryChange = (cat: "adultos" | "jovens" | "discipulado") => {
    setSelectedCategory(cat);
    const firstMag = EBD_MAGAZINES.find((m) => m.category === cat) || EBD_MAGAZINES[0];
    setSelectedMagazineId(firstMag.id);
    setSelectedLessonId(firstMag.lessons[0].id);
    setAiContent("");
    setChatMessages([]);
  };

  // Load teacher notes from localStorage
  useEffect(() => {
    const key = `ebd_notes_${activeMagazine.id}_${activeLesson.id}`;
    const saved = localStorage.getItem(key);
    setTeacherNotes(saved || "");
    setAiContent("");
    setChatMessages([]);
  }, [activeMagazine.id, activeLesson.id]);

  const handleSaveNotes = (val: string) => {
    setTeacherNotes(val);
    const key = `ebd_notes_${activeMagazine.id}_${activeLesson.id}`;
    localStorage.setItem(key, val);
  };

  // Call the site's AI for Lesson plan, Dynamics, Debate questions, Homiletic illustrations
  const requestAITool = async (type: "plano" | "dinamica" | "perguntas" | "ilustracao") => {
    setAiActiveTab(type);
    setAiLoading(true);
    setAiContent("");

    let prompt = "";
    if (type === "plano") {
      prompt = `Atue como um Pedagogo Teológico Sênior e Coordenador da Escola Bíblica Dominical (CPAD/CGADB).
Crie um PLANO DE AULA COMPLETO de 45 a 60 minutos para o professor ministrar a seguinte lição da EBD:
- Revista: ${activeMagazine.title} (${activeMagazine.categoryLabel})
- Lição ${activeLesson.number}: ${activeLesson.title}
- Tema: ${activeLesson.theme}
- Texto Áureo: "${activeLesson.textoAureo.verse}" (${activeLesson.textoAureo.reference})
- Verdade Prática: "${activeLesson.verdadePratica}"

ESTRUTURA DO PLANO DE AULA (detalhe minutagem e objetivos):
1. Objetivos da Lição (Geral e Específicos)
2. Cronograma Sugerido de 50 minutos:
   - 0-5 min: Abertura e Oração
   - 5-15 min: Gancho / Quebra-Gelo e Introdução
   - 15-35 min: Explanação dos 3 Tópicos Centrais com participação dos alunos
   - 35-45 min: Aplicação Prática e Verdade Prática
   - 45-50 min: Conclusão, Fixação e Oração Final
3. Dicas Didáticas para o Professor (recursos visuais, mapas ou perguntas-chave)
4. Desafio Semanal para a Classe`;
    } else if (type === "dinamica") {
      prompt = `Atue como um especialista em Didática Cristã e Dinâmicas para Escola Bíblica Dominical.
Crie 2 DINÂMICAS PRÁTICAS E MEMORÁVEIS (quebra-gelo de abertura ou consolidação no fechamento) perfeitamente alinhadas ao tema:
- Lição: "${activeLesson.title}"
- Texto Áureo: "${activeLesson.textoAureo.verse}" (${activeLesson.textoAureo.reference})
- Verdade Prática: "${activeLesson.verdadePratica}"
- Público: ${activeMagazine.categoryLabel}

Para cada dinâmica inclua:
1. Nome da Dinâmica
2. Objetivo Pedagógico/Espiritual
3. Materiais Necessários (simples e acessíveis na igreja)
4. Passo a passo detalhado da execução
5. Conexão Espiritual (a moral bíblica para fechar a dinâmica)`;
    } else if (type === "perguntas") {
      prompt = `Atue como um Mestre em Hermenêutica e Pedagogia Cristã.
Formule 6 PERGUNTAS DE ALTO IMPACTO PARA DEBATE EM CLASSE para a Lição da EBD:
- Lição: "${activeLesson.title}"
- Texto Central: "${activeLesson.textoAureo.verse}" (${activeLesson.textoAureo.reference})
- Verdade Prática: "${activeLesson.verdadePratica}"
- Público: ${activeMagazine.categoryLabel}

Classifique as perguntas em:
- 2 Perguntas de Sondagem e Contextualização
- 2 Perguntas de Confronto Teológico e Reflexão Bíblica
- 2 Perguntas de Aplicação Pessoal no Cotidiano dos Alunos (santidade, família, trabalho e testemunho)
Inclua respostas-guia curtas para orientar o professor.`;
    } else if (type === "ilustracao") {
      prompt = `Atue como um Homileta e Orador Cristão experiente.
Escreva 2 ILUSTRAÇÕES HOMILÉTICAS marcantes, emocionantes e fáceis de contar em sala de aula para a lição:
- Título da Lição: "${activeLesson.title}"
- Tema Central: "${activeLesson.theme}"
- Verdade Prática: "${activeLesson.verdadePratica}"

Para cada ilustração forneça:
1. Título da Ilustração
2. A História / Narrativa (real, histórica ou parábola contemporânea bem estruturada)
3. Aplicação Direta ao Ponto Central da Lição`;
    }

    try {
      const url = `${SUPABASE_URL}/functions/v1/theology-chat`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          context: `EBD - Escola Bíblica Dominical - ${activeMagazine.title}`,
        }),
      });

      if (!response.ok) throw new Error("Erro na resposta da IA");

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let full = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          setAiContent(full);
        }
      } else {
        const data = await response.json();
        setAiContent(data.reply || data.content || "Sem resposta");
      }
    } catch (err: any) {
      setAiContent("Não foi possível conectar ao assistente de IA. Verifique sua conexão e tente novamente.");
    } finally {
      setAiLoading(false);
    }
  };

  // Chat with IA Theos about this lesson
  const handleSendChat = async () => {
    if (!chatQuestion.trim() || aiLoading) return;
    const userMsg = chatQuestion.trim();
    setChatQuestion("");
    setAiActiveTab("chat");

    const updated = [...chatMessages, { role: "user" as const, content: userMsg }];
    setChatMessages(updated);
    setAiLoading(true);

    try {
      const url = `${SUPABASE_URL}/functions/v1/theology-chat`;
      const prompt = `Contexto da Lição da EBD que o usuário está estudando:
- Revista: ${activeMagazine.title}
- Lição ${activeLesson.number}: ${activeLesson.title}
- Texto Áureo: "${activeLesson.textoAureo.verse}" (${activeLesson.textoAureo.reference})
- Verdade Prática: "${activeLesson.verdadePratica}"

Pergunta do Professor/Aluno:
${userMsg}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.role === "user" ? prompt : m.content })),
          context: "Assistente Pedagógico Teológico para Escola Bíblica Dominical",
        }),
      });

      if (!res.ok) throw new Error("Falha no chat");

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";
        setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          setChatMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = { role: "assistant", content: reply };
            return next;
          });
        }
      }
    } catch (e: any) {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erro ao consultar a IA. Tente novamente." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyLesson = () => {
    const text = `📖 ESCOLA BÍBLICA DOMINICAL - ${activeMagazine.title}
Lição ${activeLesson.number}: ${activeLesson.title}

✨ TEXTO ÁUREO:
"${activeLesson.textoAureo.verse}" (${activeLesson.textoAureo.reference})

🎯 VERDADE PRÁTICA:
${activeLesson.verdadePratica}

📖 LEITURA BÍBLICA EM CLASSE:
${activeLesson.leituraBiblica.reference}
${activeLesson.leituraBiblica.text}

📌 INTRODUÇÃO:
${activeLesson.introducao}

---
Estudado em: ${window.location.origin}/ebd`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copiado!", description: "Lição copiada para a área de transferência." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 sm:pb-16">
      {/* Top Header Banner */}
      <div className="relative border-b border-border/40 bg-gradient-to-b from-card/80 to-background/90 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                    Escola Bíblica Dominical
                  </h1>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-500 bg-amber-500/10 text-xs">
                    Com IA
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Lições completas, subsídios exegéticos e ferramentas de apoio ao professor
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLesson}
                className="gap-1.5 text-xs border-border/60 hover:border-amber-500/50"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                Copiar Lição
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void shareContent(`Lição da EBD: ${activeLesson.title}`, "Escola Bíblica")}
                className="gap-1.5 text-xs border-border/60"
              >
                <Share2 className="h-3.5 w-3.5" />
                Compartilhar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-1.5 text-xs border-border/60 hidden sm:flex"
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimir
              </Button>
            </div>
          </div>

          {/* Category Tabs: Adultos | Jovens | Discipulado */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Tabs
              value={selectedCategory}
              onValueChange={(v) => handleCategoryChange(v as "adultos" | "jovens" | "discipulado")}
              className="w-full sm:w-auto"
            >
              <TabsList className="bg-muted/40 border border-border/50 p-1">
                <TabsTrigger value="adultos" className="gap-2 text-xs sm:text-sm data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                  <Users className="h-3.5 w-3.5" />
                  Adultos
                </TabsTrigger>
                <TabsTrigger value="jovens" className="gap-2 text-xs sm:text-sm data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                  <Sparkles className="h-3.5 w-3.5" />
                  Jovens
                </TabsTrigger>
                <TabsTrigger value="discipulado" className="gap-2 text-xs sm:text-sm data-[state=active]:bg-amber-500 data-[state=active]:text-black">
                  <Compass className="h-3.5 w-3.5" />
                  Discipulado
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Current Magazine Label */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-amber-500" />
              <span>{activeMagazine.quarter} / {activeMagazine.year}</span>
              <span className="text-border">•</span>
              <span className="font-medium text-foreground">{activeMagazine.title}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Lessons Sidebar + Content Area */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Lesson Directory (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-amber-500" />
                  Sumário das Lições
                </h3>
                <span className="text-xs text-muted-foreground">{activeMagazine.lessons.length} lições</span>
              </div>

              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {activeMagazine.lessons.map((lesson) => {
                  const isSelected = lesson.id === activeLesson.id;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 ${
                        isSelected
                          ? "bg-amber-500/15 border-amber-500/40 shadow-sm"
                          : "bg-muted/20 hover:bg-muted/40 border-border/40 hover:border-border"
                      }`}
                    >
                      <div
                        className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected
                            ? "bg-amber-500 text-black font-semibold shadow-gold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {lesson.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-500">
                            {lesson.theme}
                          </span>
                        </div>
                        <h4 className={`text-xs sm:text-sm font-medium line-clamp-2 mt-0.5 ${isSelected ? "text-amber-400" : "text-foreground"}`}>
                          {lesson.title}
                        </h4>
                        <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                          {lesson.textoAureo.reference}
                        </p>
                      </div>
                      <ChevronRight className={`h-4 w-4 shrink-0 transition-transform ${isSelected ? "rotate-90 text-amber-500" : "text-muted-foreground/40"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Floating Assistant Card for Teacher */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card/80 to-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-serif font-bold text-foreground">Apoio com IA ao Professor</h4>
                  <p className="text-[11px] text-muted-foreground">Recursos pedagógicos automáticos</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => requestAITool("plano")}
                  disabled={aiLoading}
                  className="text-xs h-9 justify-start gap-1.5 border-border/60 hover:border-amber-500/50 hover:bg-amber-500/10"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Plano 50 min
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => requestAITool("dinamica")}
                  disabled={aiLoading}
                  className="text-xs h-9 justify-start gap-1.5 border-border/60 hover:border-amber-500/50 hover:bg-amber-500/10"
                >
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  2 Dinâmicas
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => requestAITool("perguntas")}
                  disabled={aiLoading}
                  className="text-xs h-9 justify-start gap-1.5 border-border/60 hover:border-amber-500/50 hover:bg-amber-500/10"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-amber-500" />
                  Perguntas Debate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => requestAITool("ilustracao")}
                  disabled={aiLoading}
                  className="text-xs h-9 justify-start gap-1.5 border-border/60 hover:border-amber-500/50 hover:bg-amber-500/10"
                >
                  <BookOpen className="h-3.5 w-3.5 text-amber-500" />
                  2 Ilustrações
                </Button>
              </div>

              {/* Lesson Chat Trigger */}
              <div className="pt-2 border-t border-border/40">
                <div className="flex gap-1.5">
                  <Input
                    placeholder="Tire dúvidas sobre esta lição..."
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                    className="text-xs h-8 bg-muted/30 border-border/60"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendChat}
                    disabled={aiLoading || !chatQuestion.trim()}
                    className="h-8 px-2.5 bg-amber-500 text-black hover:bg-amber-400"
                  >
                    {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Full Lesson Exposition & AI Output (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* AI Generated Modal / Section when triggered */}
            {aiLoading || aiContent || chatMessages.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-amber-500/40 bg-card/90 backdrop-blur-md p-5 shadow-lg relative"
              >
                <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                    <h3 className="font-serif font-bold text-sm text-foreground">
                      {aiActiveTab === "plano" && "Plano de Aula Gerado com IA"}
                      {aiActiveTab === "dinamica" && "Dinâmicas Sugeridas pela IA"}
                      {aiActiveTab === "perguntas" && "Perguntas de Debate em Sala"}
                      {aiActiveTab === "ilustracao" && "Ilustrações Homiléticas"}
                      {aiActiveTab === "chat" && "Chat Teológico da Lição"}
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAiContent("");
                      setChatMessages([]);
                    }}
                    className="h-7 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Fechar
                  </Button>
                </div>

                {aiLoading && (
                  <div className="flex items-center gap-2 text-xs text-amber-500 py-4 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>A IA Theos está desenvolvendo os subsídios pedagógicos...</span>
                  </div>
                )}

                {aiActiveTab === "chat" ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-xl text-xs ${
                          msg.role === "user"
                            ? "bg-amber-500/10 text-amber-300 ml-8 border border-amber-500/20"
                            : "bg-muted/40 text-foreground mr-8 border border-border/40 whitespace-pre-wrap leading-relaxed"
                        }`}
                      >
                        <span className="font-semibold block mb-1 text-[10px] uppercase opacity-70">
                          {msg.role === "user" ? "Você" : "IA Theos"}
                        </span>
                        {msg.content}
                      </div>
                    ))}
                  </div>
                ) : (
                  aiContent && (
                    <div className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto pr-1 font-sans">
                      {aiContent}
                    </div>
                  )
                )}

                {aiContent && (
                  <div className="mt-3 pt-3 border-t border-border/40 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(aiContent);
                        toast({ title: "Copiado!", description: "Conteúdo copiado." });
                      }}
                      className="text-xs h-7 gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      Copiar Conteúdo Gerado
                    </Button>
                  </div>
                )}
              </motion.div>
            ) : null}

            {/* Lesson Header Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-500 mb-1">
                <span>Lição {activeLesson.number}</span>
                <span>•</span>
                <span>{activeLesson.theme}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                {activeLesson.title}
              </h2>
            </div>

            {/* Texto Áureo Card (Golden Verse) */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-card p-5 relative overflow-hidden">
              <div className="absolute top-2 right-3 text-amber-500/10 text-7xl font-serif select-none pointer-events-none">
                “
              </div>
              <div className="relative z-10 space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-black shadow-sm">
                  <Award className="h-3 w-3" />
                  Texto Áureo
                </span>
                <p className="text-base sm:text-lg font-serif italic text-foreground leading-relaxed pt-1">
                  “{activeLesson.textoAureo.verse}”
                </p>
                <p className="text-xs font-bold text-amber-500 text-right">
                  {activeLesson.textoAureo.reference}
                </p>
              </div>
            </div>

            {/* Verdade Prática Card */}
            <div className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-card p-5 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Compass className="h-3 w-3" />
                Verdade Prática
              </span>
              <p className="text-sm sm:text-base font-sans text-foreground/90 leading-relaxed">
                {activeLesson.verdadePratica}
              </p>
            </div>

            {/* Leitura Bíblica em Classe */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-amber-500" />
                  Leitura Bíblica em Classe: {activeLesson.leituraBiblica.reference}
                </span>
              </div>
              <div className="text-xs sm:text-sm text-foreground/90 whitespace-pre-line leading-relaxed font-serif bg-muted/20 p-4 rounded-xl border border-border/40">
                {activeLesson.leituraBiblica.text}
              </div>
            </div>

            {/* Introdução */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Introdução
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed text-justify">
                {activeLesson.introducao}
              </p>
            </div>

            {/* Tópicos da Lição (I, II, III) */}
            <div className="space-y-4">
              {activeLesson.topicos.map((topico, idx) => (
                <div key={idx} className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
                  <h3 className="text-sm sm:text-base font-serif font-bold text-amber-400 border-b border-border/40 pb-2 flex items-center gap-2">
                    <span className="h-6 w-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    {topico.title}
                  </h3>

                  <div className="space-y-3 pl-2 sm:pl-4">
                    {topico.subtopicos.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-1">
                        <h4 className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                          <span className="text-amber-500 text-xs">•</span>
                          {sub.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify pl-3">
                          {sub.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Conclusão */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                Conclusão
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed text-justify">
                {activeLesson.conclusao}
              </p>
            </div>

            {/* Perguntas de Fixação da Revista */}
            {activeLesson.perguntasFixacao?.length > 0 && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  Questionário de Fixação
                </h3>
                <div className="space-y-2">
                  {activeLesson.perguntasFixacao.map((p, i) => (
                    <div key={i} className="p-3 rounded-xl bg-muted/20 border border-border/40 text-xs text-foreground/90 flex gap-2">
                      <span className="font-bold text-amber-500">{i + 1}.</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloco de Anotações do Professor (Persistente no Navegador) */}
            <div className="rounded-2xl border border-amber-500/30 bg-card/80 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-500" />
                  <h3 className="font-serif font-bold text-sm text-foreground">
                    Anotações Pessoais do Professor
                  </h3>
                </div>
                <span className="text-[10px] text-muted-foreground">Salvo automaticamente</span>
              </div>
              <Textarea
                placeholder="Escreva aqui suas observações, perguntas que pretende fazer à sua classe, exemplos locais ou lembretes para o domingo..."
                value={teacherNotes}
                onChange={(e) => handleSaveNotes(e.target.value)}
                className="text-xs sm:text-sm min-h-[120px] bg-muted/20 border-border/60"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
