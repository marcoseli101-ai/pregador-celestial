import React, { useState, useEffect } from "react";
import {
  StickyNote,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Trash2,
  Check,
  Save,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { usePersistedState } from "@/hooks/usePersistedState";
import { Link } from "react-router-dom";

export function FloatingNotepad() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [noteContent, setNoteContent] = usePersistedState<string>(
    "floating-notepad:content",
    ""
  );
  const [copied, setCopied] = useState(false);

  const wordCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const charCount = noteContent.length;

  const handleCopy = () => {
    if (!noteContent.trim()) return;
    navigator.clipboard.writeText(noteContent);
    setCopied(true);
    toast.success("Anotação copiada!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (!noteContent.trim()) return;
    if (window.confirm("Deseja realmente limpar esta anotação rápida?")) {
      setNoteContent("");
      toast.info("Anotação rápida limpa.");
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right, above bottom nav) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-gold text-background font-bold shadow-xl hover:scale-105 active:scale-95 transition-all group border border-amber-400/40"
          title="Abrir Bloco de Notas Rápido"
          aria-label="Bloco de Notas Flutuante"
        >
          <StickyNote className="h-5 w-5 fill-current" />
          <span className="text-xs tracking-tight hidden sm:inline">
            Bloco de Notas
          </span>
          {noteContent.trim() && (
            <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
          )}
        </button>
      )}

      {/* Floating Notepad Window */}
      {isOpen && (
        <div
          className={`fixed z-50 glass-card border border-amber-500/40 shadow-2xl rounded-3xl overflow-hidden flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95 ${
            isExpanded
              ? "inset-4 sm:inset-10"
              : "bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[480px]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-amber-500/10 border-b border-border/80">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-amber-500" />
              <span className="font-serif font-bold text-sm text-foreground">
                Bloco de Notas Rápido
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-bold uppercase tracking-wider">
                Auto-salvo
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Reduzir janela" : "Expandir janela"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
                title="Minimizar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Textarea */}
          <div className="flex-1 p-3 flex flex-col min-h-0 bg-background/50">
            <Textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Digite aqui suas anotações, ideias para pregações ou versículos enquanto pesquisa..."
              className="flex-1 resize-none border-0 shadow-none focus-visible:ring-0 p-3 text-sm sm:text-base leading-relaxed font-sans placeholder:text-muted-foreground/60 bg-transparent"
            />
          </div>

          {/* Footer Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-t border-border/70 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span>{wordCount} palavras</span>
              <span>·</span>
              <span>{charCount} caracteres</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!noteContent.trim()}
                className="h-7 px-2 text-[11px] gap-1 rounded-lg"
                title="Copiar texto"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                Copiar
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={!noteContent.trim()}
                className="h-7 px-2 text-[11px] gap-1 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"
                title="Limpar anotação"
              >
                <Trash2 className="h-3 w-3" />
                Limpar
              </Button>

              <Link to="/notas" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-2.5 text-[11px] gap-1 rounded-lg border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                  title="Ver todas as minhas anotações"
                >
                  <BookOpen className="h-3 w-3" />
                  Minhas Notas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
