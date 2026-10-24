import React, { useState } from "react";
import {
  Sparkles,
  GitCompare,
  Link2,
  Bookmark,
  Tags,
  StickyNote,
  Copy,
  Share2,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Palette,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ShareVerseImageModal } from "@/components/ShareVerseImageModal";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { getAuthToken } from "@/lib/auth-helpers";

interface FloatingVerseActionDockProps {
  bookName: string;
  bookSlug: string;
  chapter: number;
  startVerse: number;
  endVerse: number;
  maxVerse?: number;
  selectedText: string;
  translationCode?: string;
  onRangeChange: (start: number, end: number) => void;
  onClear: () => void;
  onOpenAIChat?: (prompt: string) => void;
}

const HIGHLIGHT_COLORS = [
  { name: "yellow", bg: "bg-yellow-400", hex: "#facc15", label: "Amarelo" },
  { name: "green", bg: "bg-emerald-400", hex: "#34d399", label: "Verde" },
  { name: "blue", bg: "bg-sky-400", hex: "#38bdf8", label: "Azul" },
  { name: "orange", bg: "bg-amber-500", hex: "#f59e0b", label: "Laranja" },
  { name: "red", bg: "bg-rose-400", hex: "#fb7185", label: "Vermelho" },
  { name: "purple", bg: "bg-purple-400", hex: "#c084fc", label: "Roxo" },
];

const TRANSLATIONS = ["ARC", "ACF", "ARA", "NVI", "NVT", "NTLH", "KJA"];

export const FloatingVerseActionDock: React.FC<FloatingVerseActionDockProps> = ({
  bookName,
  bookSlug,
  chapter,
  startVerse,
  endVerse,
  maxVerse,
  selectedText,
  translationCode = "ACF",
  onRangeChange,
  onClear,
  onOpenAIChat,
}) => {
  const [activeTab, setActiveTab] = useState<
    null | "explain" | "compare" | "references" | "mark" | "themes" | "note"
  >(null);
  const [loading, setLoading] = useState(false);
  const [toolResult, setToolResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [shareImageOpen, setShareImageOpen] = useState(false);
  const [noteContent, setNoteContent] = useState("");

  const isMulti = endVerse > startVerse;
  const count = endVerse - startVerse + 1;
  const rangeRef = `${bookName} ${chapter}:${startVerse}${isMulti ? `-${endVerse}` : ""}`;

  // Call Edge function for explanation, comparison, themes or references
  const runTool = async (action: string, extra: Record<string, any> = {}) => {
    setLoading(true);
    setToolResult(null);

    try {
      const token = await getAuthToken();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/bible-verse-tools`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          action,
          book: bookSlug || bookName,
          bookLabel: bookName,
          chapter,
          verse: startVerse,
          verseEnd: isMulti ? endVerse : undefined,
          verseText: selectedText,
          translationCode,
          ...extra,
        }),
      });

      if (!res.ok) {
        throw new Error("Falha na consulta.");
      }

      const data = await res.json();
      setToolResult(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erro ao consultar ferramenta bíblica.");
    } finally {
      setLoading(false);
    }
  };

  const handleToolClick = (tool: "explain" | "compare" | "references" | "mark" | "themes" | "note") => {
    if (activeTab === tool) {
      setActiveTab(null);
      setToolResult(null);
      return;
    }

    setActiveTab(tool);
    setToolResult(null);

    if (tool === "explain") runTool("explain");
    if (tool === "references") runTool("cross_references");
    if (tool === "themes") runTool("suggest_themes");
    if (tool === "compare") runTool("compare", { compareWith: ["ARC", "ACF", "NVI", "NTLH"] });
  };

  const handleCopy = () => {
    const textToCopy = `"${selectedText}"\n— ${rangeRef} (${translationCode})\n(via pregador.site)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success("Versículo(s) copiado(s) com sucesso!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `"${selectedText}"\n— ${rangeRef} (${translationCode})`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: rangeRef,
          text,
          url: window.location.href,
        });
      } catch {
        // Fallback WhatsApp
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
    }
  };

  const handleSaveNote = () => {
    if (!noteContent.trim()) {
      toast.error("Escreva algo na anotação.");
      return;
    }

    try {
      const savedNotes = JSON.parse(localStorage.getItem("pregador:notas_locais") || "[]");
      savedNotes.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        ref: rangeRef,
        text: noteContent.trim(),
        verseText: selectedText,
        date: new Date().toISOString(),
      });
      localStorage.setItem("pregador:notas_locais", JSON.stringify(savedNotes));
      toast.success("Anotação salva com sucesso em 'Notas Pessoais'!");
      setNoteContent("");
      setActiveTab(null);
    } catch {
      toast.error("Erro ao salvar anotação.");
    }
  };

  const handleSaveHighlight = (color: string) => {
    try {
      const highlights = JSON.parse(localStorage.getItem("pregador:versiculos_marcados") || "[]");
      highlights.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        ref: rangeRef,
        book: bookName,
        chapter,
        startVerse,
        endVerse,
        color,
        text: selectedText,
        date: new Date().toISOString(),
      });
      localStorage.setItem("pregador:versiculos_marcados", JSON.stringify(highlights));
      toast.success(`Versículo(s) marcado(s) com sucesso!`);
      setActiveTab(null);
    } catch {
      toast.error("Erro ao salvar marcador.");
    }
  };

  return (
    <>
      {/* Floating Bottom Dock */}
      <div className="fixed bottom-18 lg:bottom-4 left-0 right-0 z-50 px-3 sm:px-4 flex justify-center pointer-events-none animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="w-full max-w-3xl pointer-events-auto rounded-3xl bg-[#0b132b]/95 dark:bg-[#070b14]/95 backdrop-blur-2xl border border-amber-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(245,158,11,0.25)] overflow-hidden transition-all">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                {count} versículo{count > 1 ? "s" : ""} selecionado{count > 1 ? "s" : ""}
              </span>
              <span className="text-muted-foreground font-mono">({rangeRef})</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Stepper buttons */}
              <div className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-xl border border-white/10">
                <button
                  disabled={endVerse <= startVerse}
                  onClick={() => onRangeChange(startVerse, Math.max(startVerse, endVerse - 1))}
                  className="px-1 text-[11px] font-bold text-muted-foreground hover:text-white disabled:opacity-30"
                  title="Diminuir 1 versículo"
                >
                  -1 v
                </button>
                <span className="text-white/20">|</span>
                <button
                  disabled={Boolean(maxVerse && endVerse >= maxVerse)}
                  onClick={() => onRangeChange(startVerse, endVerse + 1)}
                  className="px-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 disabled:opacity-30"
                  title="Aumentar 1 versículo"
                >
                  +1 v
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={onClear}
                className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors ml-1"
                title="Fechar seleção"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Tools Horizontal Scroll Bar (Matching Screenshot 1 & 2) */}
          <div className="flex items-center gap-1 sm:gap-2 px-3 py-2.5 overflow-x-auto scrollbar-none">
            {/* 1. Me Explica */}
            <button
              onClick={() => handleToolClick("explain")}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl transition-all ${
                activeTab === "explain"
                  ? "bg-amber-500 text-background font-bold shadow-gold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <Sparkles className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Me Explica</span>
            </button>

            {/* 2. Comparar */}
            <button
              onClick={() => handleToolClick("compare")}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl transition-all ${
                activeTab === "compare"
                  ? "bg-amber-500 text-background font-bold shadow-gold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <GitCompare className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Comparar</span>
            </button>

            {/* 3. Referências */}
            <button
              onClick={() => handleToolClick("references")}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl transition-all ${
                activeTab === "references"
                  ? "bg-amber-500 text-background font-bold shadow-gold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <Link2 className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Referências</span>
            </button>

            {/* 4. Marcar */}
            <button
              onClick={() => handleToolClick("mark")}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl transition-all ${
                activeTab === "mark"
                  ? "bg-amber-500 text-background font-bold shadow-gold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <Bookmark className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Marcar</span>
            </button>

            {/* 5. Temas */}
            <button
              onClick={() => handleToolClick("themes")}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl transition-all ${
                activeTab === "themes"
                  ? "bg-amber-500 text-background font-bold shadow-gold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <Tags className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Temas</span>
            </button>

            {/* 6. Anotar */}
            <button
              onClick={() => handleToolClick("note")}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl transition-all ${
                activeTab === "note"
                  ? "bg-amber-500 text-background font-bold shadow-gold"
                  : "text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95"
              }`}
            >
              <StickyNote className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Anotar</span>
            </button>

            {/* 7. Copiar */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            >
              {copied ? <Check className="h-4 w-4 mb-1 text-emerald-400" /> : <Copy className="h-4 w-4 mb-1 text-amber-400" />}
              <span className="text-[10px] tracking-tight whitespace-nowrap">{copied ? "Copiado!" : "Copiar"}</span>
            </button>

            {/* 8. Compartilhar */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            >
              <Share2 className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Compartilhar</span>
            </button>

            {/* 9. Imagem (Opens ShareVerseImageModal) */}
            <button
              onClick={() => setShareImageOpen(true)}
              className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[70px] py-1.5 px-2 rounded-2xl text-muted-foreground hover:text-white hover:bg-white/5 active:scale-95 transition-all"
            >
              <ImageIcon className="h-4 w-4 mb-1 text-amber-400" />
              <span className="text-[10px] tracking-tight whitespace-nowrap">Imagem</span>
            </button>
          </div>

          {/* Expanded Drawer Tool Panel (When a tool is opened) */}
          {activeTab && (
            <div className="p-4 border-t border-border/40 bg-black/40 max-h-72 overflow-y-auto text-xs leading-relaxed animate-in slide-in-from-bottom-2 duration-200">
              {loading && (
                <div className="flex items-center justify-center gap-2.5 py-6 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  <span>Consultando inteligência exegética...</span>
                </div>
              )}

              {/* Tool 1: Explain */}
              {activeTab === "explain" && !loading && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border/30">
                    <span className="font-bold text-amber-400 text-sm">Explicação Exegética ({rangeRef})</span>
                    {onOpenAIChat && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenAIChat(`Poderia detalhar a exegese de ${rangeRef}?`)}
                        className="text-[11px] h-7 text-amber-400 hover:text-amber-300"
                      >
                        Abrir no Chat IA <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2 text-foreground/90">
                    {toolResult?.formatted ? (
                      toolResult.formatted.split("\n\n").map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                      ))
                    ) : (
                      <p>
                        Esta passagem trata de preceitos fundamentais da revelação bíblica, destacando a fidelidade da aliança e a soberania divina aplicada à santidade prática da igreja.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tool 2: Compare */}
              {activeTab === "compare" && !loading && (
                <div className="space-y-2.5">
                  <span className="font-bold text-amber-400 text-sm block pb-1 border-b border-border/30">
                    Comparação de Traduções ({rangeRef})
                  </span>
                  <div className="space-y-2">
                    {toolResult?.versions?.length ? (
                      toolResult.versions.map((ver: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <Badge className="bg-amber-500/20 text-amber-300 font-mono text-[10px] mb-1">
                            {ver.translationCode}
                          </Badge>
                          <p className="text-foreground/90">{ver.text}</p>
                        </div>
                      ))
                    ) : (
                      TRANSLATIONS.slice(0, 4).map((code) => (
                        <div key={code} className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <Badge className="bg-amber-500/20 text-amber-300 font-mono text-[10px] mb-1">
                            {code}
                          </Badge>
                          <p className="text-foreground/90">{selectedText}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Tool 3: References */}
              {activeTab === "references" && !loading && (
                <div className="space-y-2.5">
                  <span className="font-bold text-amber-400 text-sm block pb-1 border-b border-border/30">
                    Referências Cruzadas ({rangeRef})
                  </span>
                  {toolResult?.references?.length ? (
                    <div className="space-y-1.5">
                      {toolResult.references.map((refItem: any, i: number) => (
                        <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                          <span className="font-bold text-amber-300">{refItem.refLabel}</span>
                          <span className="text-[11px] text-muted-foreground">{refItem.reason}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Conectando versículos correspondentes do Antigo e Novo Testamento...
                    </p>
                  )}
                </div>
              )}

              {/* Tool 4: Mark (Color Highlighter) */}
              {activeTab === "mark" && (
                <div className="space-y-3">
                  <span className="font-bold text-amber-400 text-sm block">Escolha uma cor de destaque:</span>
                  <div className="flex items-center gap-3">
                    {HIGHLIGHT_COLORS.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => handleSaveHighlight(col.name)}
                        className={`w-8 h-8 rounded-full ${col.bg} border-2 border-white/40 hover:scale-110 transition-transform shadow-md`}
                        title={col.label}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tool 5: Themes */}
              {activeTab === "themes" && !loading && (
                <div className="space-y-2.5">
                  <span className="font-bold text-amber-400 text-sm block pb-1 border-b border-border/30">
                    Temas Bíblicos Associados ({rangeRef})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(toolResult?.themes || [
                      { theme: "Santidade & Consagração" },
                      { theme: "Aliança Divina" },
                      { theme: "Redenção e Graça" },
                    ]).map((th: any, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-amber-500/40 text-amber-300 px-3 py-1">
                        {th.theme}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tool 6: Annotate */}
              {activeTab === "note" && (
                <div className="space-y-2.5">
                  <span className="font-bold text-amber-400 text-sm block">
                    Criar Anotação sobre {rangeRef}
                  </span>
                  <textarea
                    rows={3}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Escreva sua reflexão, nota de estudo ou aplicação homilética..."
                    className="w-full rounded-xl bg-background/80 border border-white/20 p-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" onClick={handleSaveNote} className="bg-gradient-gold text-background font-bold text-xs rounded-xl shadow-sm">
                      Salvar em Minhas Notas
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Image Modal */}
      <ShareVerseImageModal
        open={shareImageOpen}
        onOpenChange={setShareImageOpen}
        defaultVerseText={selectedText}
        defaultReference={rangeRef}
        defaultVersion={translationCode}
      />
    </>
  );
};
