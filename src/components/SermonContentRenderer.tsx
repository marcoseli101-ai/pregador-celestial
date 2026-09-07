import React, { useState } from "react";
import { Copy, Check, BookOpen, Quote, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BibleVerseLink } from "@/components/BibleVerseLink";
import { toast } from "sonner";

interface SermonContentRendererProps {
  content: string;
  title?: string;
  fontSize?: number;
  className?: string;
}

export const SermonContentRenderer: React.FC<SermonContentRendererProps> = ({
  content,
  title,
  fontSize = 18,
  className = "",
}) => {
  const [copiedSection, setCopiedSection] = useState<number | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({});

  const handleCopySection = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(index);
    toast.success("Seção copiada!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleCollapse = (index: number) => {
    setCollapsedSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  if (!content) return null;

  // Split content into major blocks
  const rawSections = content.split(/(?=\n#{1,3}\s|\n(?:\d+\.|\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.)\s|\n\*\*(?:INTRODUÇÃO|TÓPICO|APLICAÇÃO|CONCLUSÃO|ILUSTRAÇÃO))/i);

  return (
    <div className={`space-y-6 font-reading ${className}`} style={{ fontSize: `${fontSize}px` }}>
      {rawSections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Check if section is a main title or intro/topic
        const isHeader = /^#{1,3}\s|^(?:TÍTULO|TEMA):/i.test(trimmed);
        const isScriptureBox = /^(?:TEXTO\s*B[ÁA]SICO|PASSAGEM|LEITURA|VERS[ÍI]CULO)/i.test(trimmed) || trimmed.startsWith(">");
        const isTopic = /^(?:#{2,3}\s)?(?:\d+\.|\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.|\*\*(?:TÓPICO|PONTO))/i.test(trimmed);
        const isApplication = /^(?:#{2,3}\s)?(?:\*\*)?(?:APLICAÇÃO|APLICAÇÕES|COMO APLICAR)/i.test(trimmed);
        const isConclusion = /^(?:#{2,3}\s)?(?:\*\*)?(?:CONCLUSÃO|APELO|CONSIDERAÇÕES FINAIS)/i.test(trimmed);

        // Clean raw markdown heading tags and leading asterisks for clean display
        const cleanedLines = trimmed
          .replace(/^#{1,4}\s+/gm, "")
          .split("\n");

        const firstLine = cleanedLines[0]?.replace(/^\*\*|\*\*$/g, "").trim();
        const bodyLines = cleanedLines.slice(1).join("\n").trim();
        const isCollapsed = collapsedSections[idx] || false;

        if (isScriptureBox) {
          return (
            <div
              key={idx}
              className="relative p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-500 font-serif font-bold text-base tracking-wide">
                  <Quote className="h-4 w-4" />
                  <span>Texto Bíblico Base</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-amber-500/80 hover:text-amber-500 hover:bg-amber-500/20"
                  onClick={() => handleCopySection(trimmed, idx)}
                  title="Copiar texto bíblico"
                >
                  {copiedSection === idx ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="text-foreground/90 italic leading-relaxed">
                <BibleVerseLink text={cleanedLines.join("\n")} />
              </div>
            </div>
          );
        }

        if (isTopic) {
          return (
            <div
              key={idx}
              className="group/sec rounded-2xl glass-card border border-border/80 p-5 sm:p-6 transition-all duration-200 hover:border-amber-500/40 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 border-b border-border/40 pb-3 mb-4">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-500 font-serif font-bold text-xs shrink-0">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-foreground truncate">
                    {firstLine}
                  </h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                    onClick={() => handleCopySection(trimmed, idx)}
                    title="Copiar este tópico"
                  >
                    {copiedSection === idx ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                    onClick={() => toggleCollapse(idx)}
                    title={isCollapsed ? "Expandir" : "Recolher"}
                  >
                    {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {!isCollapsed && bodyLines && (
                <div className="prose-editorial text-foreground/90 whitespace-pre-wrap leading-relaxed space-y-2">
                  <BibleVerseLink text={bodyLines} />
                </div>
              )}
            </div>
          );
        }

        if (isApplication || isConclusion) {
          return (
            <div
              key={idx}
              className="rounded-2xl bg-indigo-500/10 border border-indigo-500/30 p-5 sm:p-6 transition-all shadow-sm"
            >
              <div className="flex items-center justify-between mb-3 border-b border-indigo-500/20 pb-2">
                <h3 className="font-serif font-bold text-lg text-indigo-400 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  {firstLine}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-indigo-400 hover:bg-indigo-500/20"
                  onClick={() => handleCopySection(trimmed, idx)}
                  title="Copiar aplicação/conclusão"
                >
                  {copiedSection === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                <BibleVerseLink text={bodyLines || firstLine} />
              </div>
            </div>
          );
        }

        // Generic text block / Introduction
        return (
          <div key={idx} className="p-2 sm:p-4 whitespace-pre-wrap leading-relaxed text-foreground/90">
            <BibleVerseLink text={cleanedLines.join("\n")} />
          </div>
        );
      })}
    </div>
  );
};
