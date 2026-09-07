import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Copy,
  Check,
  BookOpen,
  Quote,
  Sparkles,
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
 * Text node processor: detects Strong numbers & Bible verses in raw text
 */
function renderFormattedText(nodeContent: React.ReactNode): React.ReactNode {
  if (typeof nodeContent !== "string") {
    if (React.isValidElement(nodeContent) && nodeContent.props && (nodeContent.props as any).children) {
      return React.cloneElement(nodeContent, {
        ...(nodeContent.props as any),
        children: React.Children.map((nodeContent.props as any).children, renderFormattedText),
      });
    }
    return nodeContent;
  }

  // Split string by Strong numbers
  const testStrong = new RegExp(STRONG_REGEX.source, "i");
  const parts = nodeContent.split(STRONG_REGEX);

  return parts.map((part, pIdx) => {
    if (testStrong.test(part)) {
      const formattedBadge = part.startsWith("#")
        ? `Strong ${part}`
        : part.toLowerCase().startsWith("strong")
        ? part
        : `Strong #${part}`;

      return (
        <span
          key={pIdx}
          className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-xs border border-amber-500/30 inline-flex items-center gap-1 mx-1 shadow-sm font-semibold select-all"
        >
          {formattedBadge}
        </span>
      );
    }
    return <BibleVerseLink key={pIdx} text={part} />;
  });
}

export const SermonContentRenderer: React.FC<SermonContentRendererProps> = ({
  content,
  title,
  fontSize = 18,
  className = "",
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    toast.success("Copiado para a área de transferência!");
    setTimeout(() => setCopiedSection(null), 2000);
  };

  if (!content) return null;

  return (
    <div
      className={`font-reading space-y-4 leading-relaxed text-slate-800 dark:text-slate-100 ${className}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // H1: Main Sermon Title
          h1: ({ children }) => (
            <div className="border-b-2 border-amber-500/40 pb-4 mb-6 mt-2 flex items-start justify-between gap-3 flex-wrap">
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                {children}
              </h1>
            </div>
          ),

          // H2: Major Homiletical Divisions (I. INTRODUÇÃO, II. APARATO, III. CORPO, IV. CONCLUSÃO)
          h2: ({ children }) => {
            const headingText = String(children || "");
            const isLexicon = /APARATO|L[ÉE]XICO|ORIGINAL/i.test(headingText);
            const isConcl = /CONCLUSÃO|APELO|LITURGIA/i.test(headingText);

            return (
              <div
                className={`mt-8 mb-4 p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 ${
                  isLexicon
                    ? "bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/40 text-amber-700 dark:text-amber-300"
                    : isConcl
                    ? "bg-amber-500/15 dark:bg-amber-500/25 border-amber-500/40 text-amber-700 dark:text-amber-300"
                    : "bg-amber-500/5 dark:bg-white/10 border-amber-500/30 text-amber-800 dark:text-amber-300"
                }`}
              >
                <h2 className="font-serif text-lg sm:text-xl font-bold flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  {isLexicon ? (
                    <GraduationCap className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  ) : isConcl ? (
                    <Flame className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
                  ) : (
                    <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  )}
                  <span>{children}</span>
                </h2>
              </div>
            );
          },

          // H3: Sub-points & divisions
          h3: ({ children }) => (
            <h3 className="font-serif text-base sm:text-lg font-bold text-amber-700 dark:text-amber-400 mt-5 mb-2.5 flex items-center gap-2 border-b border-amber-500/20 pb-1.5">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{children}</span>
            </h3>
          ),

          // H4: Sub-headings
          h4: ({ children }) => (
            <h4 className="font-serif text-sm sm:text-base font-bold text-amber-800 dark:text-amber-300 mt-3 mb-1.5">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => {
            const textContent = React.Children.toArray(children).join("");

            // Harpa Cristã special container
            if (/Harpa\s*Crist[ãa]/i.test(textContent)) {
              return (
                <div className="my-3 p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 dark:border-amber-500/40 flex items-start gap-2.5 text-amber-900 dark:text-amber-200 shadow-sm">
                  <Music className="h-4 w-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div className="text-sm font-medium leading-relaxed">
                    {React.Children.map(children, renderFormattedText)}
                  </div>
                </div>
              );
            }

            // CPAD Citation special container
            if (/(?:Eurico\s*Bergst[ée]n|Myer\s*Pearlman|Antonio\s*Gilberto)/i.test(textContent)) {
              return (
                <div className="my-2.5 p-3 rounded-xl bg-purple-500/10 dark:bg-purple-950/50 border border-purple-500/30 dark:border-purple-500/40 flex items-start gap-2 text-purple-950 dark:text-purple-200 text-sm shadow-sm">
                  <GraduationCap className="h-4 w-4 mt-0.5 shrink-0 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1 leading-relaxed text-slate-800 dark:text-slate-100 font-medium">
                    {React.Children.map(children, renderFormattedText)}
                  </div>
                </div>
              );
            }

            return (
              <p className="my-2.5 leading-relaxed prose-editorial text-slate-800 dark:text-slate-100 font-normal">
                {React.Children.map(children, renderFormattedText)}
              </p>
            );
          },

          // Bold Text: Convert **negrito** into highlighted amber strong
          strong: ({ children }) => (
            <strong className="text-amber-700 dark:text-amber-400 font-bold">{children}</strong>
          ),

          // Dividers: Convert --- into elegant amber separator
          hr: () => <hr className="border-amber-500/20 my-6" />,

          // Blockquote: Scripture quotes & highlighted passages
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-amber-500 pl-4 py-2 my-4 italic bg-amber-500/10 rounded-r-lg text-slate-800 dark:text-slate-100 shadow-sm">
              <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-serif font-bold text-xs uppercase tracking-wider mb-1 not-italic">
                <Quote className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                <span>Citação das Escrituras (ARC)</span>
              </div>
              <div className="leading-relaxed">
                {React.Children.map(children, renderFormattedText)}
              </div>
            </blockquote>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc pl-6 space-y-2 my-3 text-slate-800 dark:text-slate-100 leading-relaxed">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="list-decimal pl-6 space-y-2 my-3 text-slate-800 dark:text-slate-100 leading-relaxed">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="leading-relaxed pl-1 text-slate-800 dark:text-slate-100">
              {React.Children.map(children, renderFormattedText)}
            </li>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-border/60">
              <table className="w-full text-sm border-collapse text-slate-800 dark:text-slate-100">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold p-2.5 text-left border border-border/40">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 border border-border/40 text-slate-800 dark:text-slate-100">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default SermonContentRenderer;

