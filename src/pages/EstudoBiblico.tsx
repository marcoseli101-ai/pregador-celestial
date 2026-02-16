import { useState, useCallback, useRef } from "react";
import { BookOpen, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, Heart, Star, Flame, ScrollText, Cross, ChevronDown, Filter, BrainCircuit } from "lucide-react";
import { ContentActions } from "@/components/ContentActions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useBibleBooks, useBibleChapter, useBibleVerses, type BibleBook } from "@/hooks/useBibleAPI";
import { COMPLETE_BIBLE_STUDIES, type BibleStudy } from "@/data/bibleStudies";

const COMMENTARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-bible-commentary`;

async function streamCommentary({
  book, theme, description, onDelta, onDone, onError,
}: {
  book: string; theme: string; description: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
}) {
  const resp = await fetch(COMMENTARY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
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
  const { books } = useBibleBooks();
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"biblia" | "versiculos" | "estudos">("biblia");
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null);
  const [studyFilter, setStudyFilter] = useState<"all" | "VT" | "NT">("all");
  const [studySearch, setStudySearch] = useState("");
  const { results: verseResults, loading: versesLoading, fetchAll: fetchVerses } = useBibleVerses([]);

  // AI commentary state
  const [commentaries, setCommentaries] = useState<Record<string, string>>({});
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
    selectedBook?.abbrev.en ?? null,
    selectedChapter
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

  // === CHAPTER READING VIEW ===
  if (selectedBook && selectedChapter) {
    return (
      <div className="container py-8 max-w-3xl">
        <Button variant="ghost" onClick={handleBack} className="mb-4 gap-1">
          <ChevronLeft className="h-4 w-4" /> Voltar aos capítulos
        </Button>

        <div className="mb-6 text-center">
          <h1 className="font-serif text-3xl font-bold">
            {selectedBook.name} <span className="text-gradient-gold">{selectedChapter}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedBook.author} · {selectedBook.group}</p>
        </div>

        {chapterLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : chapterError ? (
          <Card className="mb-6 border-destructive/30">
            <CardContent className="p-6 text-center space-y-3">
              <AlertCircle className="h-8 w-8 mx-auto text-destructive" />
              <p className="text-sm text-muted-foreground">{chapterError}</p>
              <Button variant="outline" size="sm" onClick={() => { setSelectedChapter(null); setTimeout(() => setSelectedChapter(selectedChapter), 50); }}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardContent className="p-6 space-y-3">
                {(chapterData?.verses ?? []).map((v) => (
                  <p key={v.number} className="leading-relaxed text-sm">
                    <span className="font-bold text-accent mr-1.5">{v.number}</span>
                    {v.text}
                  </p>
                ))}
                {chapterData?.verses?.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">Nenhum versículo encontrado.</p>
                )}
                {chapterData?.verses && chapterData.verses.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <ContentActions
                      content={chapterData.verses.map(v => `${v.number} ${v.text}`).join("\n")}
                      title={`${selectedBook.name} ${selectedChapter}`}
                      contentType="estudo"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => goToChapter(-1)} disabled={selectedChapter <= 1} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>
              <Button variant="outline" onClick={() => goToChapter(1)} disabled={selectedChapter >= selectedBook.chapters} className="gap-1">
                Próximo <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  // === CHAPTER SELECTION VIEW ===
  if (selectedBook) {
    const chapters = Array.from({ length: selectedBook.chapters }, (_, i) => i + 1);
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
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-w-3xl mx-auto">
          {chapters.map((ch) => (
            <Button
              key={ch}
              variant="outline"
              className="h-12 text-sm font-semibold hover:bg-accent hover:text-accent-foreground transition-all"
              onClick={() => setSelectedChapter(ch)}
            >
              {ch}
            </Button>
          ))}
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
      <div className="flex justify-center gap-2 mb-8">
        {([
          { key: "biblia" as const, label: "Bíblia", icon: BookOpen },
          { key: "versiculos" as const, label: "Versículos", icon: Sparkles },
          { key: "estudos" as const, label: "Estudos Bíblicos", icon: ScrollText },
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
        <>
          <div className="mx-auto max-w-xl mb-10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar livro..."
                className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {Object.entries(groupedBooks).map(([testament, tBooks]) => (
            <div key={testament} className="mb-8">
              <h2 className="font-serif text-xl font-semibold mb-4 text-muted-foreground">
                {testamentLabel[testament] ?? testament}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {tBooks.map((b) => (
                  <Card
                    key={b.abbrev.pt}
                    className="cursor-pointer hover:shadow-celestial hover:border-celestial/30 transition-all hover:-translate-y-0.5"
                    onClick={() => setSelectedBook(b)}
                  >
                    <CardContent className="p-3 text-center">
                      <BookOpen className="h-4 w-4 mx-auto mb-1 text-accent" />
                      <p className="text-xs font-medium truncate">{b.name}</p>
                      <p className="text-[10px] text-muted-foreground">{b.chapters} cap.</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </>
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
                        <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">Comentário Teológico (IA)</h5>
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
