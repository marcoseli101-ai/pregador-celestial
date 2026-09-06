import { useState, useRef, useEffect } from "react";
import {
  GitCompare, MessageCircleQuestion, Link2, Palette, Tags, StickyNote, Copy,
  X, Loader2, Check, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// ============================================================
// Traduções disponíveis para comparação (importado do bible-engine)
// ============================================================
const TRANSLATIONS = [
  { code: "ARC", label: "Almeida Revista e Corrigida" },
  { code: "ACF", label: "Almeida Corrigida Fiel" },
  { code: "ARA", label: "Almeida Revista e Atualizada" },
  { code: "AA", label: "Almeida Revisada Imprensa Bíblica" },
  { code: "NAA", label: "Nova Almeida Atualizada" },
  { code: "NVI", label: "Nova Versão Internacional" },
  { code: "NVT", label: "Nova Versão Transformadora" },
  { code: "NTLH", label: "Nova Tradução na Linguagem de Hoje" },
  { code: "KJA", label: "King James Atualizada" },
  { code: "AME", label: "Ave Maria" },
  { code: "KJV", label: "King James Version (inglês)" },
  { code: "BBE", label: "Bible in Basic English" },
  { code: "RVR", label: "Reina Valera (espanhol)" },
];

const HIGHLIGHT_COLORS = [
  { name: "yellow", bg: "bg-yellow-300", label: "Amarelo" },
  { name: "green", bg: "bg-green-300", label: "Verde" },
  { name: "blue", bg: "bg-blue-300", label: "Azul" },
  { name: "orange", bg: "bg-orange-300", label: "Laranja" },
  { name: "red", bg: "bg-red-300", label: "Vermelho" },
  { name: "pink", bg: "bg-pink-300", label: "Rosa" },
  { name: "purple", bg: "bg-purple-300", label: "Roxo" },
];

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bible-verse-tools`;

interface VerseToolsMenuProps {
  bookName: string;
  bookSlug: string;
  chapter: number;
  verseNumber: number;
  verseText: string;
  translationCode?: string;
  onClose: () => void;
}

type ActiveTool = null | "compare" | "explain" | "cross_references" | "suggest_themes" | "highlight" | "annotate";

export function VerseToolsMenu({
  bookName,
  bookSlug,
  chapter,
  verseNumber,
  verseText,
  translationCode = "ARC",
  onClose,
}: VerseToolsMenuProps) {
  const { user } = useAuth();
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  async function callEdgeFunction(action: string, extra: Record<string, any> = {}) {
    setLoading(true);
    setResult(null);
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token;
      const res = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({
          action,
          book: bookSlug,
          bookLabel: bookName,
          chapter,
          verse: verseNumber,
          translationCode,
          ...extra,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(err.error || `Erro ${res.status}`);
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      toast.error(err.message || "Erro ao processar");
    } finally {
      setLoading(false);
    }
  }

  function handleToolClick(tool: ActiveTool) {
    if (activeTool === tool) {
      setActiveTool(null);
      setResult(null);
      return;
    }
    setActiveTool(tool);
    setResult(null);

    if (tool === "explain") callEdgeFunction("explain");
    if (tool === "cross_references") callEdgeFunction("cross_references");
    if (tool === "suggest_themes") callEdgeFunction("suggest_themes");
  }

  async function handleCompareWith(code: string) {
    await callEdgeFunction("compare", { compareWith: [code] });
  }

  async function handleCompareAll() {
    await callEdgeFunction("compare", { compareAll: true });
  }

  async function handleHighlight(color: string) {
    if (!user) { toast.error("Faça login para marcar versículos"); return; }
    try {
      const { error } = await supabase.from("bible_user_highlights").upsert(
        {
          user_id: user.id,
          book: bookSlug,
          chapter,
          verse: verseNumber,
          translation_code: translationCode,
          color,
        },
        { onConflict: "user_id,book,chapter,verse,translation_code" }
      );
      if (error) throw error;
      toast.success(`Versículo marcado com ${HIGHLIGHT_COLORS.find(c => c.name === color)?.label || color}`);
      setActiveTool(null);
    } catch (err: any) {
      toast.error(err.message || "Erro ao marcar");
    }
  }

  async function handleRemoveHighlight() {
    if (!user) return;
    try {
      await supabase.from("bible_user_highlights")
        .delete()
        .eq("user_id", user.id)
        .eq("book", bookSlug)
        .eq("chapter", chapter)
        .eq("verse", verseNumber)
        .eq("translation_code", translationCode);
      toast.success("Marcação removida");
      setActiveTool(null);
    } catch {
      toast.error("Erro ao remover marcação");
    }
  }

  async function handleSaveNote() {
    if (!user) { toast.error("Faça login para anotar"); return; }
    if (!noteText.trim()) { toast.error("Escreva algo antes de salvar"); return; }
    try {
      const { error } = await supabase.from("bible_user_notes").upsert(
        {
          user_id: user.id,
          book: bookSlug,
          chapter,
          verse: verseNumber,
          translation_code: translationCode,
          note_text: noteText.trim(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book,chapter,verse,translation_code" }
      );
      if (error) throw error;
      toast.success("Anotação salva!");
      setActiveTool(null);
      setNoteText("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  }

  function handleCopy() {
    const text = `${bookName} ${chapter}:${verseNumber}\n${verseText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Versículo copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  const toolButtons = [
    { key: "compare" as const, label: "Comparar", icon: GitCompare },
    { key: "explain" as const, label: "Me Explica", icon: MessageCircleQuestion },
    { key: "cross_references" as const, label: "Referências", icon: Link2 },
    { key: "highlight" as const, label: "Marcar", icon: Palette },
    { key: "suggest_themes" as const, label: "Temas", icon: Tags },
    { key: "annotate" as const, label: "Anotar", icon: StickyNote },
  ];

  return (
    <div ref={menuRef} className="mt-2 mb-3 animate-in fade-in slide-in-from-top-2 duration-200">
      <Card className="border-accent/30 shadow-lg">
        <CardContent className="p-3 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-accent">
              {bookName} {chapter}:{verseNumber}
            </span>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tool buttons */}
          <div className="flex flex-wrap gap-1.5">
            {toolButtons.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                size="sm"
                variant={activeTool === key ? "default" : "outline"}
                className={`gap-1 text-xs h-7 px-2.5 ${activeTool === key ? "bg-accent text-accent-foreground" : ""}`}
                onClick={() => handleToolClick(key)}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              className="gap-1 text-xs h-7 px-2.5"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-center gap-2 py-3 justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-accent" />
              <span className="text-sm text-muted-foreground">Processando...</span>
            </div>
          )}

          {/* Compare: translation chips */}
          {activeTool === "compare" && !loading && !result && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Selecione uma tradução para comparar:</p>
              <div className="flex flex-wrap gap-1.5">
                {TRANSLATIONS.filter(t => t.code !== translationCode).map(t => (
                  <button
                    key={t.code}
                    onClick={() => handleCompareWith(t.code)}
                    className="rounded-full border border-border px-2.5 py-1 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    title={t.label}
                  >
                    {t.code}
                  </button>
                ))}
                <button
                  onClick={handleCompareAll}
                  className="rounded-full border-2 border-accent/50 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Todas
                </button>
              </div>
            </div>
          )}

          {/* Compare result */}
          {activeTool === "compare" && result?.versions && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.versions.map((v: any, i: number) => (
                <div key={i} className="rounded-lg bg-muted/50 p-2.5">
                  <span className="text-[10px] font-bold text-accent uppercase">{v.translationCode}</span>
                  <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{v.text || "—"}</p>
                </div>
              ))}
            </div>
          )}

          {/* Explain result */}
          {activeTool === "explain" && result?.formatted && (
            <div className="max-h-80 overflow-y-auto text-sm space-y-2 leading-relaxed">
              {result.formatted.split("\n").map((line: string, i: number) => {
                if (!line.trim()) return <br key={i} />;
                if (["Resumo", "Contexto Imediato", "Observações Linguísticas", "Referências Cruzadas", "Aplicação Prática", "Fontes para Estudo"].some(t => line.startsWith(t))) {
                  return <h4 key={i} className="font-semibold text-accent mt-2">{line}</h4>;
                }
                if (line.startsWith("Análise Exegética")) {
                  return <h3 key={i} className="font-bold text-sm">{line}</h3>;
                }
                return <p key={i} className="text-foreground/90">{line}</p>;
              })}
            </div>
          )}

          {/* Cross references result */}
          {activeTool === "cross_references" && result?.references && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {result.references.map((ref: any, i: number) => (
                <div key={i} className="rounded-lg bg-muted/50 p-2.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-accent">{ref.refLabel}</span>
                    <Badge variant="outline" className="text-[9px]">{ref.relationType}</Badge>
                  </div>
                  <p className="text-xs text-foreground/80">{ref.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Themes result */}
          {activeTool === "suggest_themes" && result?.themes && (
            <div className="flex flex-wrap gap-2">
              {result.themes.map((t: any, i: number) => (
                <div key={i} className="rounded-lg bg-muted/50 p-2.5 flex-1 min-w-[140px]">
                  <span className="text-xs font-bold text-accent">{t.theme}</span>
                  <p className="text-[11px] text-foreground/70 mt-0.5">{t.reason}</p>
                </div>
              ))}
            </div>
          )}

          {/* Highlight colors */}
          {activeTool === "highlight" && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Escolha uma cor:</p>
              <div className="flex gap-2 flex-wrap">
                {HIGHLIGHT_COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => handleHighlight(c.name)}
                    className={`h-7 w-7 rounded-full ${c.bg} border-2 border-transparent hover:border-foreground/50 transition-all hover:scale-110`}
                    title={c.label}
                  />
                ))}
                <button
                  onClick={handleRemoveHighlight}
                  className="h-7 px-2 rounded-full border border-destructive/50 text-destructive text-[10px] font-medium hover:bg-destructive/10 transition-colors"
                >
                  Remover
                </button>
              </div>
            </div>
          )}

          {/* Annotate */}
          {activeTool === "annotate" && (
            <div className="space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Escreva sua anotação sobre este versículo..."
                className="w-full rounded-lg border border-input bg-background p-2.5 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                autoFocus
              />
              <Button size="sm" className="w-full gap-1" onClick={handleSaveNote}>
                <Check className="h-3.5 w-3.5" /> Salvar Anotação
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
