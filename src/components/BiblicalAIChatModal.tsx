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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTER_QUESTIONS = [
  "Qual o contexto histórico e mensagem central de Romanos 8?",
  "Me explique a Parábola do Filho Pródigo e seus tipos",
  "Significado da palavra Ágape no grego bíblico",
  "Referências bíblicas sobre a Armadura de Deus (Efésios 6)",
  "Como preparar uma introdução impactante sobre Salmo 23?",
];

interface BiblicalAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BiblicalAIChatModal({ isOpen, onClose }: BiblicalAIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Graça e Paz! Sou seu **Assistente Teológico e Bíblico**. Como posso auxiliar seu estudo, exegese ou preparação de mensagem hoje?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg: Message = { role: "user", content: q };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const url = `${SUPABASE_URL}/functions/v1/theology-chat`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          context: "Assistente de IA Bíblico e Exegético para Pregadores e Estudantes da Bíblia",
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}`);
      }

      // Check if response is stream
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantReply = "";

        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantReply += chunk;

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
          { role: "assistant", content: json.reply || json.content || "Sem resposta." },
        ]);
      }
    } catch (e: any) {
      console.error("AI Chat error:", e);
      toast.error("Erro ao comunicar com a IA. Tente novamente.");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Desculpe, ocorreu uma oscilação na conexão com o assistente teológico. Por favor, tente enviar sua pergunta novamente.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyMessage = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    toast.success("Resposta copiada!");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Conversa reiniciada. Em qual tema bíblico ou sermão posso te ajudar agora?",
      },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl h-[88vh] max-h-[780px] glass-card border border-amber-500/40 shadow-2xl rounded-3xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Header with Celestial Branding */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-amber-500/15 via-background to-indigo-500/15 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-gold shadow-md text-background">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-black text-base sm:text-lg text-foreground">
                  Assistente <span className="text-gradient-gold">Teológico</span>
                </h3>
                <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px] font-bold uppercase tracking-wider">
                  Teologia & Exegese
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Tire dúvidas, pesquise contextos históricos e estruture mensagens
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
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
              onClick={onClose}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
              title="Fechar"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-background/50">
          {messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                className={`flex gap-3 items-start ${isUser ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-xl shrink-0 mt-1 ${
                    isUser
                      ? "bg-amber-500 text-background font-bold text-xs"
                      : "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-sm relative group ${
                    isUser
                      ? "bg-gradient-gold text-background font-medium rounded-tr-xs"
                      : "glass-card border border-border/80 text-foreground/95 rounded-tl-xs prose prose-invert prose-sm max-w-none"
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>

                      {m.content && (
                        <div className="flex justify-end pt-2 border-t border-border/40 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleCopyMessage(m.content, idx)}
                            className="text-[11px] text-muted-foreground hover:text-amber-500 flex items-center gap-1"
                          >
                            {copiedIdx === idx ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            Copiar
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
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
              </div>
              <div className="glass-card px-4 py-2.5 rounded-2xl text-xs text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-amber-500 animate-pulse" />
                Examinando as escrituras e preparando resposta...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Questions (shown when conversation is new) */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-border/40 bg-muted/20">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Sugestões de Perguntas Rápidas:
            </span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {STARTER_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-full text-xs font-medium glass-card border border-border/70 hover:border-amber-500/50 hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 whitespace-nowrap transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-muted/40 border-t border-border/70">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Digite sua dúvida teológica, passagem bíblica ou tema..."
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
