import React, { useState } from "react";
import {
  Copy,
  Check,
  BookOpen,
  Quote,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Music,
  GraduationCap,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BibleVerseLink } from "@/components/BibleVerseLink";
import { toast } from "sonner";

interface SermonContentRendererProps {
  content: string;
  title?: string;
  fontSize?: number;
  className?: string;
}

// Regex to detect Strong concordance numbers
const STRONG_REGEX = /\b(Strong\s*#?[HG]\d{1,5}|#(?:H|G)\d{1,5}|\b[HG]\d{3,5}\b)/gi;

/**
 * Text formatter that injects Strong badges and Harpa badges
 */
export const RichSermonText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  // Split lines to keep formatting
  const lines = text.split("\n");

  return (
    <div className="space-y-2">
      {lines.map((line, lIdx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={lIdx} className="h-2" />;

        // Harpa Cristã highlight line
        if (/Harpa\s*Crist[ãa]/i.test(trimmed)) {
          return (
            <div
              key={lIdx}
              className="my-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-300"
            >
              <Music className="h-4 w-4 mt-0.5 shrink-0 text-amber-400" />
              <div className="text-sm font-medium leading-relaxed">
                <BibleVerseLink text={trimmed} />
              </div>
            </div>
          );
        }

        // CPAD Authors citation highlight
        if (/(?:Eurico\s*Bergst[ée]n|Myer\s*Pearlman|Antonio\s*Gilberto|CPAD)/i.test(trimmed)) {
          return (
            <div
              key={lIdx}
              className="my-1.5 p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-2 text-foreground/90 text-sm"
            >
              <GraduationCap className="h-4 w-4 mt-0.5 shrink-0 text-purple-400" />
              <div className="flex-1 leading-relaxed">
                <BibleVerseLink text={trimmed} />
              </div>
            </div>
          );
        }

        // Parse Strong Badges in line
        const parts = trimmed.split(STRONG_REGEX);
        const testStrong = new RegExp(STRONG_REGEX.source, "i");

        return (
          <p key={lIdx} className="leading-relaxed">
            {parts.map((part, pIdx) => {
              if (testStrong.test(part)) {
                const formattedBadge = part.startsWith("#")
                  ? `Strong ${part}`
                  : part.toLowerCase().startsWith("strong")
                  ? part
                  : `Strong #${part}`;
                return (
                  <span key={pIdx} className="badge-strong mx-1 shadow-sm">
                    {formattedBadge}
                  </span>
                );
              }
              return <BibleVerseLink key={pIdx} text={part} />;
            })}
          </p>
        );
      })}
    </div>
  );
};

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

  // Split content into major blocks (Roman numerals, headings, or markdown sections)
  const rawSections = content.split(
    /(?=\n#{1,3}\s|\n(?:\d+\.|\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.)\s|\n\*\*(?:INTRODUÇÃO|TÓPICO|APLICAÇÃO|CONCLUSÃO|APARATO|APELO))/i
  );

  return (
    <div className={`space-y-6 font-reading ${className}`} style={{ fontSize: `${fontSize}px` }}>
      {rawSections.map((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // Categorize section types
        const isHeader = /^#{1,3}\s|^(?:TÍTULO|TEMA):/i.test(trimmed);
        const isScriptureBox =
          /^(?:TEXTO\s*(?:B[ÁA]SICO|CENTRAL)|PASSAGEM|LEITURA|VERS[ÍI]CULO)/i.test(trimmed) ||
          trimmed.startsWith(">");
        const isLexiconBox =
          /(?:APARATO\s*L[ÉE]XICO|ORIGINAL\s*(?:GREGO|HEBRAICO)|AN[ÁA]LISE\s*L[ÉE]XICA)/i.test(trimmed);
        const isTopic =
          /^(?:#{2,3}\s)?(?:\d+\.|\b(?:I|II|III|IV|V|VI|VII|VIII|IX|X)\.|\*\*(?:TÓPICO|PONTO|\d+\.))/i.test(
            trimmed
          );
        const isConclusionOrAppeal =
          /(?:CONCLUSÃO|APELO|LITURGIA\s*PASTORAL|ORAÇÃO\s*PASTORAL|CONSIDERAÇÕES\s*FINAIS)/i.test(
            trimmed
          );

        // Clean raw markdown heading tags
        const cleanedLines = trimmed
          .replace(/^#{1,4}\s+/gm, "")
          .split("\n");

        const firstLine = cleanedLines[0]?.replace(/^\*\*|\*\*$/g, "").trim();
        const bodyLines = cleanedLines.slice(1).join("\n").trim();
        const isCollapsed = collapsedSections[idx] || false;

        // 1. Scripture Quote Box
        if (isScriptureBox) {
          return (
            <div
              key={idx}
              className="relative p-5 sm:p-6 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-amber-500 font-serif font-bold text-base tracking-wide">
                  <Quote className="h-4 w-4" />
                  <span>Texto Central das Escrituras (ARC)</span>
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
              <div className="text-foreground/95 italic leading-relaxed text-base sm:text-lg">
                <RichSermonText text={cleanedLines.join("\n")} />
              </div>
            </div>
          );
        }

        // 2. Lexical & Strong Apparatus
        if (isLexiconBox) {
          return (
            <div
              key={idx}
              className="rounded-2xl glass-card border border-amber-500/30 p-5 sm:p-6 shadow-md transition-all bg-gradient-to-br from-amber-500/5 to-transparent"
            >
              <div className="flex items-center justify-between gap-3 border-b border-amber-500/20 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 font-serif font-bold text-xs shrink-0">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-400">
                    {firstLine || "Aparato Léxico e Teológico Original"}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-amber-400 hover:bg-amber-500/20 rounded-lg"
                  onClick={() => handleCopySection(trimmed, idx)}
                  title="Copiar aparato original"
                >
                  {copiedSection === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="text-foreground/90 space-y-2">
                <RichSermonText text={bodyLines || firstLine} />
              </div>
            </div>
          );
        }

        // 3. Main Topic Card
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
                <div className="prose-editorial text-foreground/90 leading-relaxed space-y-3">
                  <RichSermonText text={bodyLines} />
                </div>
              )}
            </div>
          );
        }

        // 4. Conclusion, Appeal & Harpa Cristã
        if (isConclusionOrAppeal) {
          return (
            <div
              key={idx}
              className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-5 sm:p-6 transition-all shadow-md"
            >
              <div className="flex items-center justify-between mb-3 border-b border-amber-500/20 pb-2">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-amber-400 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-500 animate-pulse" />
                  {firstLine}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-amber-400 hover:bg-amber-500/20"
                  onClick={() => handleCopySection(trimmed, idx)}
                  title="Copiar ministração e apelo"
                >
                  {copiedSection === idx ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <div className="text-foreground/95 leading-relaxed space-y-3">
                <RichSermonText text={bodyLines || firstLine} />
              </div>
            </div>
          );
        }

        // 5. Generic text block / Introduction / Headers
        return (
          <div key={idx} className="p-2 sm:p-4 leading-relaxed text-foreground/90">
            <RichSermonText text={cleanedLines.join("\n")} />
          </div>
        );
      })}
    </div>
  );
};
