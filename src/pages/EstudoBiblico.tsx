import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAuthToken } from "@/lib/auth-helpers";
import { BookOpen, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, Heart, Star, Flame, ScrollText, Cross, ChevronDown, Filter, BrainCircuit, CheckCircle2, Lightbulb, Bookmark } from "lucide-react";
import { ContentActions } from "@/components/ContentActions";
import { VerseToolsMenu } from "@/components/VerseToolsMenu";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBibleBooks, useBibleChapter, useBibleVerses, BIBLE_TRANSLATIONS, type BibleBook } from "@/hooks/useBibleAPI";
import { COMPLETE_BIBLE_STUDIES, type BibleStudy } from "@/data/bibleStudies";
import { THEMATIC_STUDIES, type ThematicStudy, type ThematicSection } from "@/data/thematicStudies";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useVerseBookmarks } from "@/hooks/useVerseBookmarks";
import { usePersistedState } from "@/hooks/usePersistedState";
import { SUPABASE_URL } from "@/integrations/supabase/client";

const COMMENTARY_URL = `${SUPABASE_URL}/functions/v1/generate-bible-commentary`;

async function streamCommentary({
  book, theme, description, onDelta, onDone, onError,
}: {
  book: string; theme: string; description: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const token = await getAuthToken();
  const resp = await fetch(COMMENTARY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ book, theme, description }),
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
    onError(data.error || `Erro ${resp.status}`);
    return;
  }
  if (!resp.body) { onError("Sem resposta"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "" || !line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const p = JSON.parse(json);
        const c = p.choices?.[0]?.delta?.content as string | undefined;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }
  onDone();
}
const testamentLabel: Record<string, string> = {
  VT: "Antigo Testamento",
  NT: "Novo Testamento",
};

const FEATURED_VERSES = [
  { ref: "João 3:16", text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", theme: "Amor de Deus" },
  { ref: "Salmos 23:1", text: "O Senhor é o meu pastor; nada me faltará.", theme: "Confiança" },
  { ref: "Filipenses 4:13", text: "Posso todas as coisas naquele que me fortalece.", theme: "Força" },
  { ref: "Romanos 8:28", text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.", theme: "Propósito" },
  { ref: "Isaías 41:10", text: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.", theme: "Proteção" },
  { ref: "Provérbios 3:5-6", text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.", theme: "Sabedoria" },
];

const STUDY_GROUPS_VT = ["Pentateuco", "Históricos", "Poéticos", "Profetas Maiores", "Profetas Menores"];
const STUDY_GROUPS_NT = ["Evangelhos", "Históricos", "Cartas Paulinas", "Cartas Gerais", "Profético"];

const EstudoBiblico = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { books } = useBibleBooks();
  const { markChapterRead, getBookProgress, isChapterRead } = useReadingProgress();
  const [selectedBook, setSelectedBook] = usePersistedState<BibleBook | null>("estudo:selectedBook", null);
  const [selectedChapter, setSelectedChapter] = usePersistedState<number | null>("estudo:selectedChapter", null);
  const [selectedTranslation, setSelectedTranslation] = usePersistedState<string>("estudo:selectedTranslation", "ARC");
  const { isBookmarked, toggleBookmark, getBookmark } = useVerseBookmarks(selectedBook?.name, selectedChapter ?? undefined);
  const [highlightVerse, setHighlightVerse] = useState<number | null>(null);
  const [selectedVerseRange, setSelectedVerseRange] = useState<{ start: number; end: number } | null>(null);
  const [searchQuery, setSearchQuery] = usePersistedState<string>("estudo:searchQuery", "");
  const [activeTab, setActiveTab] = usePersistedState<"biblia" | "versiculos" | "estudos" | "tematicos">("estudo:activeTab", "biblia");
  const [expandedStudy, setExpandedStudy] = usePersistedState<string | null>("estudo:expandedStudy", null);
  const [studyFilter, setStudyFilter] = usePersistedState<"all" | "VT" | "NT">("estudo:studyFilter", "all");
  const [studySearch, setStudySearch] = usePersistedState<string>("estudo:studySearch", "");
  const [expandedThematic, setExpandedThematic] = usePersistedState<string | null>("estudo:expandedThematic", null);
  const [expandedSection, setExpandedSection] = usePersistedState<string | null>("estudo:expandedSection", null);
  const { results: verseResults, loading: versesLoading, fetchAll: fetchVerses } = useBibleVerses([]);

  // Handle URL params for deep-linking from verse clicks
  useEffect(() => {
    const livro = searchParams.get("livro");
    const capitulo = searchParams.get("capitulo");
    const versiculo = searchParams.get("versiculo");
    if (livro && books.length > 0) {
      const book = books.find(b => b.name === livro);
      if (book) {
        setSelectedBook(book);
        setActiveTab("biblia");
        if (capitulo) {
          const ch = parseInt(capitulo, 10);
          if (ch >= 1 && ch <= book.chapters) {
            setSelectedChapter(ch);
          }
        }
        if (versiculo) {
          setHighlightVerse(parseInt(versiculo, 10));
        }
        // Clear params after navigating
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, books, setSearchParams]);

  // AI commentary state
  const [commentaries, setCommentaries] = usePersistedState<Record<string, string>>("estudo:commentaries", {});
  const [commentaryLoading, setCommentaryLoading] = useState<Record<string, boolean>>({});
  const [commentaryError, setCommentaryError] = useState<Record<string, string>>({});
  const commentaryRequestedRef = useRef<Set<string>>(new Set());

  const generateCommentary = useCallback((study: BibleStudy) => {
    if (commentaries[study.book] || commentaryLoading[study.book] || commentaryRequestedRef.current.has(study.book)) return;
    commentaryRequestedRef.current.add(study.book);
    setCommentaryLoading((p) => ({ ...p, [study.book]: true }));
    setCommentaryError((p) => ({ ...p, [study.book]: "" }));
    let accumulated = "";
    streamCommentary({
      book: study.book,
      theme: study.theme,
      description: study.description,
      onDelta: (text) => {
        accumulated += text;
        setCommentaries((p) => ({ ...p, [study.book]: accumulated }));
      },
      onDone: () => setCommentaryLoading((p) => ({ ...p, [study.book]: false })),
      onError: (msg) => {
        setCommentaryError((p) => ({ ...p, [study.book]: msg }));
        setCommentaryLoading((p) => ({ ...p, [study.book]: false }));
        commentaryRequestedRef.current.delete(study.book);
      },
    });
  }, [commentaries, commentaryLoading]);
  const filteredStudies = COMPLETE_BIBLE_STUDIES.filter((s) => {
    const matchTestament = studyFilter === "all" || s.testament === studyFilter;
    const q = studySearch.toLowerCase();
    const matchSearch = !q || s.book.toLowerCase().includes(q) || s.title.toLowerCase().includes(q) || s.theme.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    return matchTestament && matchSearch;
  });

  const { data: chapterData, loading: chapterLoading, error: chapterError } = useBibleChapter(
    selectedBook?.name ?? null,
    selectedChapter,
    selectedTranslation
  );

  const filteredBooks = searchQuery
    ? books.filter((b) => b.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : books;

  const groupedBooks = filteredBooks.reduce<Record<string, BibleBook[]>>((acc, book) => {
    const key = book.testament;
    if (!acc[key]) acc[key] = [];
    acc[key].push(book);
    return acc;
  }, {});

  const handleBack = () => {
    if (selectedChapter) {
      setSelectedChapter(null);
    } else if (selectedBook) {
      setSelectedBook(null);
    }
  };

  const goToChapter = (dir: number) => {
    if (!selectedChapter || !selectedBook) return;
    const next = selectedChapter + dir;
    if (next >= 1 && next <= selectedBook.chapters) {
      setSelectedChapter(next);
    }
  };

  // Mark chapter as read when viewing
  useEffect(() => {
    if (selectedBook && selectedChapter && chapterData?.verses?.length) {
      markChapterRead(selectedBook.name, selectedChapter);
    }
  }, [selectedBook, selectedChapter, chapterData, markChapterRead]);

  // Auto-scroll to highlighted verse
  useEffect(() => {
    if (highlightVerse && chapterData?.verses?.length) {
      setTimeout(() => {
        const el = document.getElementById(`verse-${highlightVerse}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Clear highlight after 5 seconds
          setTimeout(() => setHighlightVerse(null), 5000);
        }
      }, 300);
    }
  }, [highlightVerse, chapterData]);

  // === CHAPTER READING VIEW (PULPIT READING MODE) ===
  if (selectedBook && selectedChapter) {
    const bookProg = getBookProgress(selectedBook.name, selectedBook.chapters);
    return (
      <div className="relative min-h-[90vh] py-6 sm:py-10 px-4 sm:px-6">
        {/* Floating Left Vertical Quick Dock (as shown in tablet mockup) */}
        <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-3 p-2.5 rounded-2xl glass-card border border-amber-500/20 shadow-2xl backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-xl h-10 w-10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400"
            title="Voltar aos capítulos / livros"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
          <div className="w-5 h-px bg-border/60 my-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("versiculos")}
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/15"
            title="Versículos em destaque"
          >
            <Sparkles className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setActiveTab("estudos")}
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/15"
            title="Estudos e Comentários Teológicos"
          >
            <ScrollText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="rounded-xl h-10 w-10 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/15"
            title="Alternar Tema Escuro / Claro"
          >
            <Star className="h-4 w-4" />
          </Button>
        </aside>

        {/* Central Sacred Reading Container */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Bar with Back Link and Floating Version Selector */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="gap-1.5 text-xs sm:text-sm text-muted-foreground hover:text-foreground rounded-full px-3"
            >
              <ChevronLeft className="h-4 w-4" /> Voltar aos capítulos
            </Button>

            {/* Floating Golden Version Selector */}
            <div className="flex items-center gap-1.5" data-tour="bible-version-selector">
              <Select value={selectedTranslation} onValueChange={setSelectedTranslation}>
                <SelectTrigger className="w-[180px] sm:w-[230px] h-9 text-xs font-semibold glass-card-gold rounded-full border-amber-500/40 text-foreground shadow-sm">
                  <SelectValue placeholder="Selecione a versão" />
                </SelectTrigger>
                <SelectContent className="glass-card border border-border/80 shadow-2xl rounded-2xl">
                  {BIBLE_TRANSLATIONS.map((t) => (
                    <SelectItem key={t.code} value={t.code} className="text-xs rounded-xl py-2 cursor-pointer">
                      <span className="font-bold text-amber-500 mr-2">{t.code}</span>
                      <span className="text-muted-foreground text-[11px]">{t.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chapter Title & Sacred Header */}
          <div className="text-center pt-2 pb-4 border-b border-border/40">
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold uppercase tracking-widest text-foreground mb-2">
              {selectedBook.name} <span className="text-gradient-gold">{selectedChapter}</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider mb-4">
              {selectedBook.name} · {selectedBook.group}
            </p>

            {/* Reading Progress with Gold Bar */}
            <div className="max-w-xs mx-auto">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5 font-medium">
                <span>Progresso do livro</span>
                <span className="text-amber-500 font-semibold">{bookProg.read}/{bookProg.total} capítulos ({bookProg.percent}%)</span>
              </div>
              <div className="h-1.5 w-full bg-muted/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all duration-500"
                  style={{ width: `${bookProg.percent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sacred Reading Card */}
          {chapterLoading ? (
            <div className="glass-card p-16 rounded-3xl text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500 mx-auto" />
              <p className="font-serif text-base text-muted-foreground">Carregando sagradas escrituras...</p>
            </div>
          ) : chapterError ? (
            <Card className="glass-card border-destructive/30 rounded-3xl p-8 text-center space-y-3">
              <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
              <p className="text-sm text-muted-foreground">{chapterError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSelectedChapter(null); setTimeout(() => setSelectedChapter(selectedChapter), 50); }}
                className="rounded-xl"
              >
                Tentar novamente
              </Button>
            </Card>
          ) : (
            <>
              <div className="glass-card watermark-cross-bg border border-border/80 shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 space-y-5">
                {/* Dica de seleção de múltiplos versículos se houver seleção ativa */}
                {selectedVerseRange && (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 animate-in fade-in duration-150 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>
                        Trecho selecionado: <strong>{selectedBook.name} {selectedChapter}:{selectedVerseRange.start}{selectedVerseRange.end > selectedVerseRange.start ? `-${selectedVerseRange.end}` : ""}</strong> (toque em outro versículo para estender o intervalo)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVerseRange(null)}
                      className="h-6 px-2 text-[11px] text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 rounded-lg"
                    >
                      Limpar seleção
                    </Button>
                  </div>
                )}

                {(chapterData?.verses ?? []).map((v, vIdx) => {
                  const isHighlighted = highlightVerse === v.number;
                  const isInRange = Boolean(
                    selectedVerseRange &&
                    v.number >= selectedVerseRange.start &&
                    v.number <= selectedVerseRange.end
                  );
                  const isRangeStart = Boolean(selectedVerseRange && v.number === selectedVerseRange.start);
                  const isRangeEnd = Boolean(selectedVerseRange && v.number === selectedVerseRange.end);
                  const isMultiVerse = Boolean(
                    selectedVerseRange && selectedVerseRange.end > selectedVerseRange.start
                  );

                  const selectedVersesList = (chapterData?.verses ?? []).filter(
                    (item) =>
                      selectedVerseRange &&
                      item.number >= selectedVerseRange.start &&
                      item.number <= selectedVerseRange.end
                  );
                  const selectedRangeText = selectedVersesList
                    .map((item) => `${item.number}. ${item.text}`)
                    .join("\n");

                  const handleVerseClick = () => {
                    if (!selectedVerseRange) {
                      setSelectedVerseRange({ start: v.number, end: v.number });
                      return;
                    }

                    // Se clicar exatamente no único versículo selecionado, fecha
                    if (selectedVerseRange.start === v.number && selectedVerseRange.end === v.number) {
                      setSelectedVerseRange(null);
                      return;
                    }

                    // Estender ou ajustar o intervalo
                    if (v.number > selectedVerseRange.start) {
                      setSelectedVerseRange({ start: selectedVerseRange.start, end: v.number });
                    } else if (v.number < selectedVerseRange.start) {
                      setSelectedVerseRange({ start: v.number, end: selectedVerseRange.end });
                    } else {
                      setSelectedVerseRange({ start: v.number, end: v.number });
                    }
                  };

                  return (
                    <div key={v.number} data-tour={vIdx === 0 ? "bible-verse-item" : undefined}>
                      <p
                        id={`verse-${v.number}`}
                        className={`transition-all duration-150 group/verse flex items-start gap-3 cursor-pointer select-text font-reading text-lg sm:text-[20px] leading-[1.95] ${
                          isHighlighted
                            ? "bg-amber-500/20 border-l-4 border-amber-500 px-5 py-4 shadow-sm text-foreground rounded-2xl"
                            : isInRange
                            ? isMultiVerse
                              ? `bg-amber-500/15 border-l-4 border-amber-500 px-5 py-2.5 text-foreground ${
                                  isRangeStart ? "rounded-t-2xl pt-3.5" : ""
                                } ${isRangeEnd ? "rounded-b-2xl pb-3.5" : ""}`
                              : "bg-amber-500/15 border-l-4 border-amber-500 px-5 py-3 text-foreground rounded-2xl shadow-sm"
                            : isBookmarked(v.number)
                            ? "bg-amber-500/10 border-l-2 border-amber-400 px-4 py-2 rounded-2xl"
                            : "px-3 py-1.5 hover:bg-accent/10 text-foreground/90 hover:text-foreground rounded-2xl"
                        }`}
                        onClick={handleVerseClick}
                      >
                        <span
                          className={`font-mono font-bold text-xs sm:text-sm mt-1.5 shrink-0 ${
                            isHighlighted || isInRange ? "text-amber-500 font-black" : "text-amber-500/80"
                          }`}
                        >
                          {v.number}
                        </span>
                        <span className={`flex-1 ${isHighlighted || isInRange ? "font-medium" : ""}`}>
                          {v.text}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(v.number, v.text);
                          }}
                          className={`shrink-0 p-1.5 rounded-lg transition-all ${
                            isBookmarked(v.number)
                              ? "text-amber-400 opacity-100"
                              : "text-muted-foreground/30 opacity-0 group-hover/verse:opacity-100 hover:text-amber-400"
                          }`}
                          title={isBookmarked(v.number) ? "Remover marcador" : "Marcar versículo"}
                        >
                          <Bookmark className={`h-4 w-4 ${isBookmarked(v.number) ? "fill-current" : ""}`} />
                        </button>
                      </p>

                      {/* Menu de ferramentas abre abaixo do último versículo do intervalo selecionado */}
                      {isRangeEnd && selectedBook && selectedVerseRange && (
                        <div className="my-3">
                          <VerseToolsMenu
                            bookName={selectedBook.name}
                            bookSlug={selectedBook.name
                              .normalize("NFD")
                              .replace(/[\u0300-\u036f]/g, "")
                              .toLowerCase()
                              .replace(/\s+/g, "-")}
                            chapter={selectedChapter!}
                            verseNumber={selectedVerseRange.start}
                            verseEnd={selectedVerseRange.end > selectedVerseRange.start ? selectedVerseRange.end : undefined}
                            verseText={selectedRangeText}
                            versesList={selectedVersesList}
                            translationCode={selectedTranslation}
                            onClose={() => setSelectedVerseRange(null)}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                {chapterData?.verses?.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">Nenhum versículo encontrado.</p>
                )}
                {chapterData?.verses && chapterData.verses.length > 0 && (
                  <div className="pt-6 border-t border-border/50">
                    <ContentActions
                      content={chapterData.verses.map(v => `${v.number} ${v.text}`).join("\n")}
                      title={`${selectedBook.name} ${selectedChapter}`}
                      contentType="estudo"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Pagination */}
              <div className="flex justify-between items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => goToChapter(-1)}
                  disabled={selectedChapter <= 1}
                  className="gap-2 rounded-2xl text-xs sm:text-sm px-5 py-5 glass-card"
                >
                  <ChevronLeft className="h-4 w-4" /> Capítulo Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToChapter(1)}
                  disabled={selectedChapter >= selectedBook.chapters}
                  className="gap-2 rounded-2xl text-xs sm:text-sm px-5 py-5 glass-card"
                >
                  Próximo Capítulo <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // === CHAPTER SELECTION VIEW ===
  if (selectedBook) {
    const chapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);
    const bookProg = getBookProgress(selectedBook.name, selectedBook.chapters);
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-4 gap-1">
          <ChevronLeft className="h-4 w-4" /> Voltar aos livros
        </Button>

        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold">{selectedBook.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {selectedBook.chapters} capítulos · {selectedBook.author} · {selectedBook.group}
          </p>
          <div className="mt-3 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso de leitura</span>
              <span>{bookProg.read}/{bookProg.total} ({bookProg.percent}%)</span>
            </div>
            <Progress value={bookProg.percent} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-w-3xl mx-auto">
          {chapters.map((ch) => {
            const read = isChapterRead(selectedBook.name, ch);
            return (
              <Button
                key={ch}
                variant={read ? "default" : "outline"}
                className={`h-12 text-sm font-semibold transition-all ${read ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
                onClick={() => setSelectedChapter(ch)}
              >
                {read && <CheckCircle2 className="h-3 w-3 mr-0.5" />}
                {ch}
              </Button>
            );
          })}
        </div>
      </div>
    );
  }

  // === MAIN VIEW WITH TABS ===
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Estudo Bíblico <span className="text-gradient-gold">Avançado</span>
        </h1>
        <p className="text-muted-foreground">Navegue pela Bíblia, explore versículos e aprofunde-se em estudos temáticos.</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8" data-tour="bible-tabs">
        {([
          { key: "biblia" as const, label: "Bíblia", icon: BookOpen },
          { key: "versiculos" as const, label: "Versículos", icon: Sparkles },
          { key: "estudos" as const, label: "Estudos Bíblicos", icon: ScrollText },
          { key: "tematicos" as const, label: "Estudos Temáticos", icon: Lightbulb },
        ]).map(({ key, label, icon: Icon }) => (
          <Button
            key={key}
            variant={activeTab === key ? "default" : "outline"}
            className={activeTab === key ? "bg-gradient-gold text-background" : ""}
            onClick={() => setActiveTab(key)}
          >
            <Icon className="h-4 w-4 mr-1.5" />
            {label}
          </Button>
        ))}
      </div>

      {/* TAB: Bíblia */}
      {activeTab === "biblia" && (
        <div data-tour="bible-books-grid" className="space-y-8">
          {/* Search bar */}
          <div className="mx-auto max-w-xl">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livro por nome (ex: Gênesis, Salmos, Romanos)..."
                className="w-full rounded-2xl border border-input bg-card/80 px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all"
              />
            </div>
          </div>

          {Object.entries(groupedBooks).map(([testament, tBooks]) => (
            <div key={testament} className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                <h2 className="font-serif text-xl font-bold text-foreground">
                  {testamentLabel[testament] ?? testament}
                </h2>
                <Badge variant="outline" className="text-xs font-semibold text-amber-500 border-amber-500/30">
                  {tBooks.length} Livros
                </Badge>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {(tBooks as BibleBook[]).map((b) => {
                  const prog = getBookProgress(b.name, b.chapters);
                  return (
                    <Card
                      key={b.abbrev.pt}
                      className="group/book cursor-pointer glass-card border border-border/70 hover:border-amber-500/50 hover:shadow-gold transition-all duration-200 hover:-translate-y-1 rounded-2xl overflow-hidden"
                      onClick={() => setSelectedBook(b)}
                    >
                      <CardContent className="p-3.5 flex flex-col justify-between h-full min-h-[95px] text-center">
                        <div>
                          <div className="flex justify-center mb-1">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground group-hover/book:text-amber-500 transition-colors">
                              {b.abbrev.pt}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-foreground truncate group-hover/book:text-amber-500 transition-colors">
                            {b.name}
                          </p>
                        </div>

                        <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>{b.chapters} cap.</span>
                          {prog.read > 0 && (
                            <span className="text-[10px] font-semibold text-amber-500">
                              {prog.percent}%
                            </span>
                          )}
                        </div>

                        {prog.read > 0 && (
                          <div className="mt-1">
                            <Progress value={prog.percent} className="h-1 bg-muted" />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB: Versículos em Destaque */}
      {activeTab === "versiculos" && (
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-6 text-center">
            Versículos <span className="text-gradient-gold">em Destaque</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURED_VERSES.map((v) => (
              <Card key={v.ref} className="hover:shadow-celestial transition-all">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold bg-accent/10 text-accent px-2.5 py-1 rounded-full">{v.theme}</span>
                    <span className="text-xs text-muted-foreground font-medium">{v.ref}</span>
                  </div>
                  <p className="text-sm leading-relaxed italic text-foreground/90">"{v.text}"</p>
                  <ContentActions content={`${v.ref}\n${v.text}`} title={`Versículo - ${v.ref}`} contentType="estudo" compact />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Estudos Bíblicos Completos */}
      {activeTab === "estudos" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-2 text-center">
            Estudos de <span className="text-gradient-gold">Toda a Bíblia</span>
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-6">66 livros · Antigo e Novo Testamento</p>

          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              size="sm"
              variant={studyFilter === "all" ? "default" : "outline"}
              className={studyFilter === "all" ? "bg-gradient-gold text-background" : ""}
              onClick={() => setStudyFilter("all")}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={studyFilter === "VT" ? "default" : "outline"}
              className={studyFilter === "VT" ? "bg-gradient-gold text-background" : ""}
              onClick={() => setStudyFilter("VT")}
            >
              Antigo Testamento
            </Button>
            <Button
              size="sm"
              variant={studyFilter === "NT" ? "default" : "outline"}
              className={studyFilter === "NT" ? "bg-gradient-gold text-background" : ""}
              onClick={() => setStudyFilter("NT")}
            >
              Novo Testamento
            </Button>
          </div>

          {/* Search studies */}
          <div className="mx-auto max-w-xl mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={studySearch}
                onChange={(e) => setStudySearch(e.target.value)}
                placeholder="Buscar estudo por livro, tema ou palavra-chave..."
                className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Studies grouped by category */}
          {(studyFilter === "all" || studyFilter === "VT" ? STUDY_GROUPS_VT : []).map((group) => {
            const studies = filteredStudies.filter((s) => s.testament === "VT" && s.group === group);
            if (studies.length === 0) return null;
            return (
              <StudyGroup
                key={group}
                groupName={group}
                testament="Antigo Testamento"
                studies={studies}
                expandedStudy={expandedStudy}
                setExpandedStudy={setExpandedStudy}
                fetchVerses={fetchVerses}
                versesLoading={versesLoading}
                verseResults={verseResults}
                commentaries={commentaries}
                commentaryLoading={commentaryLoading}
                commentaryError={commentaryError}
                generateCommentary={generateCommentary}
              />
            );
          })}
          {(studyFilter === "all" || studyFilter === "NT" ? STUDY_GROUPS_NT : []).map((group) => {
            const studies = filteredStudies.filter((s) => s.testament === "NT" && s.group === group);
            if (studies.length === 0) return null;
            return (
              <StudyGroup
                key={group}
                groupName={group}
                testament="Novo Testamento"
                studies={studies}
                expandedStudy={expandedStudy}
                setExpandedStudy={setExpandedStudy}
                fetchVerses={fetchVerses}
                versesLoading={versesLoading}
                verseResults={verseResults}
                commentaries={commentaries}
                commentaryLoading={commentaryLoading}
                commentaryError={commentaryError}
                generateCommentary={generateCommentary}
              />
            );
          })}

          {filteredStudies.length === 0 && (
            <p className="text-center text-muted-foreground py-10">Nenhum estudo encontrado para "{studySearch}"</p>
          )}
        </div>
      )}

      {/* TAB: Estudos Temáticos */}
      {activeTab === "tematicos" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-2 text-center">
            Estudos <span className="text-gradient-gold">Temáticos</span>
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Análises transversais de temas que percorrem toda a Bíblia
          </p>

          <div className="space-y-4">
            {THEMATIC_STUDIES.map((study) => {
              const Icon = study.icon;
              const isExpanded = expandedThematic === study.id;
              return (
                <Card
                  key={study.id}
                  className={`transition-all cursor-pointer ${isExpanded ? "shadow-celestial border-celestial/30" : "hover:shadow-celestial hover:border-celestial/30"}`}
                  onClick={() => setExpandedThematic(isExpanded ? null : study.id)}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0">
                          <Icon className="h-5 w-5 text-background" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-serif font-semibold text-sm">{study.title}</h4>
                            <Badge variant="outline" className="text-[10px]">{study.theme}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                            {study.sections.length} seções de estudo
                          </p>
                        </div>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </div>

                    {!isExpanded && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{study.description}</p>
                    )}

                    {isExpanded && (
                      <div className="pt-3 border-t border-border space-y-5" onClick={(e) => e.stopPropagation()}>
                        <p className="text-sm text-foreground/90 leading-relaxed">{study.description}</p>

                        {study.sections.map((section, idx) => {
                          const sectionKey = `${study.id}-${idx}`;
                          const isSectionOpen = expandedSection === sectionKey;
                          return (
                            <div key={idx} className="rounded-lg border border-border overflow-hidden">
                              <button
                                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors text-left"
                                onClick={() => setExpandedSection(isSectionOpen ? null : sectionKey)}
                              >
                                <h5 className="font-serif font-semibold text-sm">{section.heading}</h5>
                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isSectionOpen ? "rotate-180" : ""}`} />
                              </button>

                              {isSectionOpen && (
                                <div className="px-4 pb-4 space-y-4">
                                  <p className="text-sm text-foreground/90 leading-relaxed">{section.content}</p>

                                  <div>
                                    <h6 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Referências Bíblicas</h6>
                                    <div className="space-y-1.5">
                                      {section.verses.map((verse, vi) => (
                                        <p key={vi} className="text-sm text-foreground/80 leading-relaxed pl-3 border-l-2 border-accent/30">
                                          {verse}
                                        </p>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="rounded-lg bg-accent/10 border border-accent/20 p-4">
                                    <h6 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Simbolismo e Significado</h6>
                                    <p className="text-sm text-foreground/90 leading-relaxed">{section.symbolism}</p>
                                  </div>

                                  <ContentActions
                                    content={`${section.heading}\n\n${section.content}\n\nReferências:\n${section.verses.join("\n")}\n\nSimbolismo:\n${section.symbolism}`}
                                    title={`${study.title} - ${section.heading}`}
                                    contentType="estudo"
                                    compact
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}

                        {/* Full study content actions */}
                        <ContentActions
                          content={study.sections.map(s => `## ${s.heading}\n\n${s.content}\n\nReferências:\n${s.verses.join("\n")}\n\nSimbolismo:\n${s.symbolism}`).join("\n\n---\n\n")}
                          title={study.title}
                          contentType="estudo"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Study Group Component
function StudyGroup({
  groupName, testament, studies, expandedStudy, setExpandedStudy, fetchVerses, versesLoading, verseResults,
  commentaries, commentaryLoading, commentaryError, generateCommentary,
}: {
  groupName: string;
  testament: string;
  studies: BibleStudy[];
  expandedStudy: string | null;
  setExpandedStudy: (v: string | null) => void;
  fetchVerses: (refs: string[]) => void;
  versesLoading: boolean;
  verseResults: Record<string, { reference: string; text: string }>;
  commentaries: Record<string, string>;
  commentaryLoading: Record<string, boolean>;
  commentaryError: Record<string, string>;
  generateCommentary: (study: BibleStudy) => void;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-serif text-lg font-semibold">{groupName}</h3>
        <Badge variant="secondary" className="text-xs">{studies.length} livros</Badge>
      </div>
      <div className="space-y-3">
        {studies.map((study) => {
          const Icon = study.icon;
          const isExpanded = expandedStudy === study.book;

          const handleToggle = () => {
            if (isExpanded) {
              setExpandedStudy(null);
            } else {
              setExpandedStudy(study.book);
              fetchVerses(study.keyVerses);
            }
          };

          return (
            <Card
              key={study.book}
              className={`transition-all cursor-pointer ${isExpanded ? "shadow-celestial border-celestial/30" : "hover:shadow-celestial hover:border-celestial/30"}`}
              onClick={handleToggle}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-gold flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-background" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-serif font-semibold text-sm">{study.book}</h4>
                        <Badge variant="outline" className="text-[10px]">{study.theme}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{study.title}</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>

                {!isExpanded && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{study.description}</p>
                )}

                {isExpanded && (
                  <div className="pt-3 border-t border-border space-y-5" onClick={(e) => e.stopPropagation()}>
                    <p className="text-sm text-foreground/90 leading-relaxed">{study.description}</p>

                    {/* Outline */}
                    <div>
                      <h5 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Esboço do Livro</h5>
                      <ol className="space-y-1.5">
                        {study.outline.map((item, i) => (
                          <li key={i} className="text-sm text-foreground/80 flex gap-2">
                            <span className="text-accent font-bold shrink-0">{i + 1}.</span>
                            {item}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Key Verses */}
                    <div>
                      <h5 className="text-xs font-semibold text-accent uppercase tracking-wider mb-2">Versículos-Chave</h5>
                      {versesLoading ? (
                        <div className="flex items-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin text-accent mr-2" />
                          <span className="text-sm text-muted-foreground">Carregando versículos...</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {study.keyVerses.map((ref) => {
                            const result = verseResults[ref];
                            return (
                              <div key={ref} className="rounded-lg bg-muted/50 p-3">
                                <p className="text-xs font-semibold text-accent mb-1">{ref}</p>
                                <p className="text-sm leading-relaxed text-foreground/90 italic">
                                  "{result?.text || "Carregando..."}"
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Application */}
                    <div className="rounded-lg bg-accent/10 border border-accent/20 p-4">
                      <h5 className="text-xs font-semibold text-accent uppercase tracking-wider mb-1">Aplicação Prática</h5>
                      <p className="text-sm text-foreground/90 leading-relaxed">{study.application}</p>
                    </div>

                    {/* Content actions for the study */}
                    <ContentActions
                      content={`${study.book} - ${study.title}\n\n${study.description}\n\nEsboço:\n${study.outline.map((o, i) => `${i + 1}. ${o}`).join("\n")}\n\nAplicação:\n${study.application}${commentaries[study.book] ? `\n\nComentário Teológico:\n${commentaries[study.book]}` : ""}`}
                      title={`Estudo: ${study.book}`}
                      contentType="estudo"
                    />

                    {/* AI Theological Commentary */}
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="h-4 w-4 text-primary" />
                        <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">Comentário Teológico</h5>
                      </div>
                      {!commentaries[study.book] && !commentaryLoading[study.book] && !commentaryError[study.book] && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => generateCommentary(study)}
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Gerar Comentário Teológico
                        </Button>
                      )}
                      {commentaryLoading[study.book] && !commentaries[study.book] && (
                        <div className="flex items-center gap-2 py-2">
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">Gerando comentário...</span>
                        </div>
                      )}
                      {commentaryError[study.book] && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-destructive">{commentaryError[study.book]}</span>
                          <Button size="sm" variant="ghost" onClick={() => generateCommentary(study)}>Tentar novamente</Button>
                        </div>
                      )}
                      {commentaries[study.book] && (
                        <div className="prose prose-sm max-w-none text-foreground/90">
                          {commentaries[study.book].split("\n").map((line, i) => {
                            if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-semibold mt-3 mb-1">{line.slice(4)}</h4>;
                            if (line.startsWith("## ")) return <h3 key={i} className="text-sm font-bold mt-3 mb-1">{line.slice(3)}</h3>;
                            if (line.startsWith("# ")) return <h3 key={i} className="text-base font-bold mt-3 mb-1">{line.slice(2)}</h3>;
                            if (line.startsWith("- ")) return <li key={i} className="text-sm ml-4 list-disc">{line.slice(2)}</li>;
                            if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="text-sm font-semibold">{line.slice(2, -2)}</p>;
                            if (!line.trim()) return <br key={i} />;
                            return <p key={i} className="text-sm leading-relaxed">{line}</p>;
                          })}
                          {commentaryLoading[study.book] && (
                            <span className="inline-block w-2 h-4 bg-primary/50 animate-pulse ml-0.5" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default EstudoBiblico;
