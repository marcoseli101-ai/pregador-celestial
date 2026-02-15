import { useState, useCallback } from "react";
import { Calendar, BookOpen, Heart, Loader2, RefreshCw, Share2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Devocional = () => {
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generateDevotional = useCallback(async () => {
    setIsGenerating(true);
    setContent("");
    setHasGenerated(false);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-devotional`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({}),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        toast.error(err.error || "Erro ao gerar devocional");
        setIsGenerating(false);
        return;
      }

      if (!resp.body) throw new Error("Sem resposta");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              accumulated += delta;
              setContent(accumulated);
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      setHasGenerated(true);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao gerar devocional. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Devocional Diário",
          text: content.replace(/[#*_]/g, "").slice(0, 500),
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(content.replace(/[#*_]/g, ""));
      toast.success("Devocional copiado!");
    }
  };

  // Parse markdown sections
  const parseContent = (text: string) => {
    const sections: { type: "verse" | "reflection" | "prayer" | "other"; content: string }[] = [];
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
      } else {
        sections.push({ type: "other", content: part.trim() });
      }
    }
    return sections;
  };

  const sections = content ? parseContent(content) : [];

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Devocional <span className="text-gradient-gold">Diário</span>
        </h1>
        <p className="text-muted-foreground">Versículo do dia, reflexão espiritual e oração gerados por IA.</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="capitalize">{today}</span>
        </div>

        {!content && !isGenerating && (
          <Card className="shadow-celestial border-celestial/20">
            <CardContent className="p-10 text-center space-y-6">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-semibold mb-2">Seu devocional de hoje</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Clique no botão abaixo para gerar um devocional personalizado com versículo,
                  reflexão espiritual e oração, criado pela IA especialmente para hoje.
                </p>
              </div>
              <Button
                onClick={generateDevotional}
                className="bg-gradient-gold text-background hover:opacity-90 gap-2"
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                Gerar Devocional de Hoje
              </Button>
            </CardContent>
          </Card>
        )}

        {isGenerating && !content && (
          <Card className="shadow-celestial border-celestial/20">
            <CardContent className="p-10 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto" />
              <p className="text-sm text-muted-foreground">Preparando seu devocional com unção...</p>
            </CardContent>
          </Card>
        )}

        {content && (
          <Card className="shadow-celestial border-gold/20 overflow-hidden">
            <div className="h-2 bg-gradient-gold" />
            <CardContent className="p-8 space-y-6">

              {/* Verse Section */}
              {sections.find((s) => s.type === "verse") && (
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-3 text-accent" />
                  <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-4">Versículo do Dia</p>
                  <div className="text-lg font-serif italic leading-relaxed whitespace-pre-line">
                    {sections.find((s) => s.type === "verse")!.content}
                  </div>
                </div>
              )}

              {/* Reflection Section */}
              {sections.find((s) => s.type === "reflection") && (
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-accent" /> Reflexão
                  </h3>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {sections.find((s) => s.type === "reflection")!.content}
                  </div>
                </div>
              )}

              {/* Prayer Section */}
              {sections.find((s) => s.type === "prayer") && (
                <div>
                  <h3 className="font-serif text-lg font-semibold mb-3">🙏 Oração do Dia</h3>
                  <p className="text-sm text-muted-foreground italic leading-relaxed whitespace-pre-line">
                    {sections.find((s) => s.type === "prayer")!.content}
                  </p>
                </div>
              )}

              {/* Fallback: raw content if parsing didn't find sections (during streaming) */}
              {sections.length === 0 && (
                <div className="text-sm leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              )}

              {/* Other sections */}
              {sections.filter((s) => s.type === "other").map((s, i) => (
                <div key={i} className="text-sm leading-relaxed whitespace-pre-line">
                  {s.content}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando...
                </div>
              )}

              {hasGenerated && (
                <div className="flex gap-3 pt-2">
                  <Button onClick={handleShare} className="flex-1 bg-gradient-gold text-background hover:opacity-90 gap-2">
                    <Share2 className="h-4 w-4" /> Compartilhar
                  </Button>
                  <Button variant="outline" onClick={generateDevotional} className="gap-2">
                    <RefreshCw className="h-4 w-4" /> Novo Devocional
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Devocional;
