import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Loader2,
  Trash2,
  BookOpen,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Share2,
  BookmarkPlus,
  Languages,
  HelpCircle,
  GraduationCap,
  FileText,
  Lightbulb,
  ShieldCheck,
  Scroll,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
import { getAuthToken } from "@/lib/auth-helpers";
import { shareContent } from "@/lib/share";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface BiblicalAIChatModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  initialMessage?: string;
  initialContext?: string;
}

interface QuickTool {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  promptPrefix: string;
  placeholder: string;
}

const QUICK_TOOLS: QuickTool[] = [
  {
    id: "exegese",
    label: "Exegese Bíblica",
    icon: BookOpen,
    promptPrefix: "Por favor, realize uma exegese aprofundada desta passagem bíblica, detalhando contexto histórico, autor, destinatários, significado literal e aplicação:",
    placeholder: "Ex: Romanos 8:28 ou João 1:1...",
  },
  {
    id: "esboco",
    label: "Estruturar Esboço",
    icon: FileText,
    promptPrefix: "Estruture um esboço bíblico homilético completo para pregação com Tema, Texto-base, Introdução, 3 tópicos expositivos com referências cruzadas e Conclusão com apelo pastoral sobre:",
    placeholder: "Ex: O poder da oração na adversidade...",
  },
  {
    id: "original",
    label: "Grego & Hebraico",
    icon: Languages,
    promptPrefix: "Analise os termos e raízes nos idiomas originais (Hebraico no AT / Grego Koiné no NT) para a seguinte passagem ou termo bíblico:",
    placeholder: "Ex: Ágape em 1 Coríntios 13 ou Shalom...",
  },
  {
    id: "ilustracao",
    label: "Ilustração Homilética",
    icon: Lightbulb,
    promptPrefix: "Sugira uma ilustração pastoral profunda, comovente e de fácil compreensão para transmitir o seguinte tema em um sermão:",
    placeholder: "Ex: Perdão, fidelidade de Deus no deserto...",
  },
  {
    id: "doutrina",
    label: "Dúvida Teológica",
    icon: HelpCircle,
    promptPrefix: "Esclareça sob a luz da sã doutrina bíblica e com referências das Escrituras a seguinte dúvida teológica:",
    placeholder: "Ex: Diferença entre justificação e santificação...",
  },
  {
    id: "ebd",
    label: "Subsídio para EBD",
    icon: GraduationCap,
    promptPrefix: "Elabore um subsídio didático para aula da Escola Bíblica Dominical (EBD) com Texto Áureo, Verdade Prática, 3 tópicos comentados e 3 perguntas para debate em classe sobre:",
    placeholder: "Ex: O Fruto do Espírito na vida cristã...",
  },
];

const STARTER_QUESTIONS = [
  "Qual o contexto histórico e mensagem central de Romanos 8?",
  "Estruture um sermão expositivo sobre o Salmo 23",
  "Significado e raiz da palavra Ágape no grego do NT",
  "Referências bíblicas e tipos sobre a Armadura de Deus (Efésios 6)",
  "Como preparar um plano de aula sobre a Parábola do Filho Pródigo?",
  "Diferença entre graça comum e graça salvadora nas Escrituras",
];

export function BiblicalAIChatModal({
  isOpen,
  open,
  onClose,
  onOpenChange,
  initialMessage,
  initialContext,
}: BiblicalAIChatModalProps) {
  const isVisible = Boolean(isOpen ?? open);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Graça e Paz! Sou seu **Assistente Teológico e Bíblico do Pregador Fiel**.\n\nComo posso auxiliar seu estudo hoje? Você pode solicitar uma **exegese bíblica**, **estruturar um esboço de pregação**, consultar termos no **grego e hebraico**, ou pedir um **subsídio didático para a EBD**.",
    },
  ]);
  const [input, setInput] = useState(initialMessage || "");
  const [selectedTool, setSelectedTool] = useState<QuickTool | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isVisible, messages]);

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  if (!isVisible) return null;

  const handleSend = async (textToSend?: string) => {
    let rawQuery = (textToSend || input).trim();
    if (!rawQuery || loading) return;

    let fullPrompt = rawQuery;
    if (selectedTool && !textToSend) {
      fullPrompt = `${selectedTool.promptPrefix}\n"${rawQuery}"`;
    }

    const userMsg: Message = { role: "user", content: fullPrompt };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setSelectedTool(null);
    setLoading(true);

    try {
      const token = await getAuthToken();
      const url = `${SUPABASE_URL}/functions/v1/theology-chat`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context:
            initialContext ||
            "Assistente Teológico e Ministerial do Pregador Fiel. Responda com profunda fidelidade bíblica, referências escriturísticas, reverência pastoral e clareza expositiva.",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na comunicação (${response.status})`);
      }

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = "";
        let buf = "";

        // Placeholder for streaming reply
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buf += decoder.decode(value, { stream: true });

          // Parse Server Sent Events or direct streaming
          if (buf.includes("data: ")) {
            let idx: number;
            while ((idx = buf.indexOf("\n")) !== -1) {
              let line = buf.slice(0, idx);
              buf = buf.slice(idx + 1);
              if (line.endsWith("\r")) line = line.slice(0, -1);
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (jsonStr === "[DONE]") break;

              try {
                const parsed = JSON.parse(jsonStr);
                const delta =
                  parsed.choices?.[0]?.delta?.content ??
                  parsed.candidates?.[0]?.content?.parts?.[0]?.text ??
                  "";
                if (delta) {
                  assistantReply += delta;
                  setMessages((prev) => {
                    const copy = [...prev];
                    copy[copy.length - 1] = { role: "assistant", content: assistantReply };
                    return copy;
                  });
                }
              } catch {
                buf = line + "\n" + buf;
                break;
              }
            }
          } else {
            // Raw text stream
            assistantReply += buf;
            buf = "";
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = { role: "assistant", content: assistantReply };
              return copy;
            });
          }
        }

        // If assistantReply is empty after loop, check if buf has any plain text
        if (!assistantReply && buf.trim()) {
          try {
            const parsed = JSON.parse(buf);
            assistantReply = parsed.reply || parsed.content || parsed.message || buf;
          } catch {
            assistantReply = buf;
          }
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: "assistant", content: assistantReply };
            return copy;
          });
        }
      } else {
        const json = await response.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: json.reply || json.content || "Sem resposta recebida." },
        ]);
      }
    } catch (e: any) {
      console.error("AI Chat error:", e);
      toast.error("Instabilidade temporária na conexão com a IA.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Irmão(ã), ocorreu uma breve oscilação na conexão com o assistente teológico.\n\nPor gentileza, verifique sua conexão ou tente reenviar sua pergunta. Estamos à disposição para auxiliá-lo no estudo da Palavra.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Resposta copiada para a área de transferência!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleShareMessage = (text: string) => {
    void shareContent(
      `📖 *Estudo do Assistente Teológico — Pregador Fiel*\n\n${text}\n\nVia Pregador Fiel`,
      "Estudo Teológico"
    );
  };

  const handleSaveToNotes = (text: string) => {
    try {
      const key = "pregador:sermoes_offline_v2";
      const existingRaw = localStorage.getItem(key);
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      const newEntry = {
        id: `assistant-${Date.now()}`,
        title: text.slice(0, 45).replace(/[#*]/g, "").trim() || "Estudo Teológico",
        passage: "Estudo Bíblico",
        theme: "Teologia e Exegese",
        date: new Date().toLocaleDateString("pt-BR"),
        fullText: text,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify([newEntry, ...list.slice(0, 99)]));
      toast.success("Salvo na sua Área do Pregador com sucesso!");
    } catch (e) {
      toast.error("Não foi possível salvar localmente.");
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversa reiniciada. Em qual tema bíblico, passagem ou sermão posso te ajudar agora?",
      },
    ]);
    setSelectedTool(null);
  };

  const selectQuickTool = (tool: QuickTool) => {
    if (selectedTool?.id === tool.id) {
      setSelectedTool(null);
    } else {
      setSelectedTool(tool);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full ${
          isFullscreen ? "max-w-[96vw] h-[95vh]" : "max-w-3xl h-[88vh] max-h-[790px]"
        } glass-card border border-amber-500/40 shadow-2xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col relative transition-all duration-300 animate-in zoom-in-95`}
      >
        {/* Header with Pregador Fiel Branding */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-gradient-to-r from-amber-500/15 via-background to-amber-600/10 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-gold shadow-md text-background shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-sm sm:text-base text-foreground tracking-wide">
                  ASSISTENTE <span className="text-gradient-gold font-extrabold">TEOLÓGICO</span>
                </h3>
                <Badge className="bg-amber-500/15 text-amber-500 border-amber-500/30 text-[10px] font-bold uppercase tracking-wider hidden xs:inline-flex">
                  Pregador Fiel
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                Exegese, estrutura de sermões, léxico original e subsídios para EBD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hidden sm:inline-flex"
              title={isFullscreen ? "Restaurar tamanho" : "Maximizar"}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClearHistory}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-red-500"
              title="Limpar conversa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Specialized Functional Tools Selector Pills */}
        <div className="px-3 sm:px-5 py-2.5 bg-background/70 border-b border-border/60 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 hidden md:inline">
            Ferramentas:
          </span>
          {QUICK_TOOLS.map((tool) => {
            const Icon = tool.icon;
            const isSelected = selectedTool?.id === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => selectQuickTool(tool)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-amber-500 text-background border-amber-400 font-bold shadow-md shadow-amber-500/20"
                    : "glass-card border-border/70 hover:border-amber-500/50 hover:bg-amber-500/10 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? "text-background" : "text-amber-500"}`} />
                <span>{tool.label}</span>
              </button>
            );
          })}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5 bg-background/40">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-2.5 sm:gap-3.5 items-start ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 mt-1 ${
                    isUser
                      ? "bg-gradient-gold text-background font-bold text-xs shadow-md"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-sm relative group ${
                    isUser
                      ? "bg-gradient-gold text-background font-medium rounded-tr-xs"
                      : "glass-card border border-border/80 text-foreground/95 rounded-tl-xs prose prose-invert prose-sm max-w-none"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>

                      {m.content && (
                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2.5 border-t border-border/40 mt-3 opacity-90 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(m.content, idx)}
                            className="text-[11px] text-muted-foreground hover:text-amber-500 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-accent/20 transition-colors"
                            title="Copiar"
                          >
                            {copiedIdx === idx ? (
                              <Check className="h-3 w-3 text-emerald-400" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            Copiar
                          </button>
                          <button
                            onClick={() => handleSaveToNotes(m.content)}
                            className="text-[11px] text-muted-foreground hover:text-amber-500 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-accent/20 transition-colors"
                            title="Salvar na Área do Pregador"
                          >
                            <BookmarkPlus className="h-3 w-3" />
                            Salvar
                          </button>
                          <button
                            onClick={() => handleShareMessage(m.content)}
                            className="text-[11px] text-muted-foreground hover:text-amber-500 flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-accent/20 transition-colors"
                            title="Compartilhar no WhatsApp"
                          >
                            <Share2 className="h-3 w-3" />
                            WhatsApp
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              </div>
              <div className="glass-card px-4 py-2.5 rounded-2xl text-xs text-muted-foreground flex items-center gap-2 border border-amber-500/20">
                <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                Consultando as Escrituras e estruturando resposta teológica...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Questions (shown when conversation is new) */}
        {messages.length <= 2 && (
          <div className="px-3 sm:px-5 py-2.5 border-t border-border/50 bg-muted/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Sugestões Rápidas de Estudo:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-3 py-1 rounded-full text-xs font-medium glass-card border border-border/70 hover:border-amber-500/50 hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 whitespace-nowrap transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Tool Badge Indicator */}
        {selectedTool && (
          <div className="px-4 py-1.5 bg-amber-500/10 border-t border-amber-500/30 flex items-center justify-between text-xs text-amber-500 font-medium">
            <span className="flex items-center gap-1.5">
              <selectedTool.icon className="h-3.5 w-3.5" />
              Modo Ativo: <strong>{selectedTool.label}</strong>
            </span>
            <button
              onClick={() => setSelectedTool(null)}
              className="text-[11px] underline hover:text-foreground"
            >
              Cancelar modo
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-card/80 border-t border-border/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              ref={inputRef}
              type="text"
              placeholder={
                selectedTool
                  ? selectedTool.placeholder
                  : "Digite sua dúvida teológica, versículo ou tema..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 h-12 rounded-2xl glass-card border border-border/80 px-4 text-sm focus-visible:ring-amber-500/50 shadow-sm"
            />
            <Button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-12 px-5 rounded-2xl bg-gradient-gold text-background font-bold shadow-md hover:opacity-90 transition-all shrink-0 gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="hidden sm:inline">Enviar</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
