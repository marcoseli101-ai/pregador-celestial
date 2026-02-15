import { useState } from "react";
import { BookOpen, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, Heart, Star, Flame, ScrollText, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBibleBooks, useBibleChapter, type BibleBook } from "@/hooks/useBibleAPI";

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

const BIBLE_STUDIES = [
  {
    title: "A Graça de Deus",
    description: "Estudo sobre a graça imerecida de Deus e como ela transforma vidas.",
    icon: Heart,
    verses: ["Efésios 2:8-9", "Romanos 5:8", "Tito 2:11", "2 Coríntios 12:9"],
    color: "text-red-500",
  },
  {
    title: "Fé e Confiança",
    description: "Aprofunde-se no significado bíblico da fé e como exercitá-la no dia a dia.",
    icon: Star,
    verses: ["Hebreus 11:1", "Romanos 10:17", "Marcos 11:22-24", "Tiago 2:17"],
    color: "text-accent",
  },
  {
    title: "O Espírito Santo",
    description: "Conheça a pessoa e a obra do Espírito Santo na vida do crente.",
    icon: Flame,
    verses: ["Atos 1:8", "João 14:26", "Gálatas 5:22-23", "Romanos 8:26"],
    color: "text-orange-500",
  },
  {
    title: "Oração e Intercessão",
    description: "Princípios bíblicos para uma vida de oração poderosa e eficaz.",
    icon: ScrollText,
    verses: ["Mateus 6:9-13", "Filipenses 4:6-7", "1 Tessalonicenses 5:17", "Tiago 5:16"],
    color: "text-blue-500",
  },
  {
    title: "Salvação em Cristo",
    description: "O plano de redenção de Deus revelado através de Jesus Cristo.",
    icon: Cross,
    verses: ["João 14:6", "Romanos 10:9-10", "Atos 4:12", "Efésios 1:7"],
    color: "text-purple-500",
  },
  {
    title: "Promessas de Deus",
    description: "As grandes promessas da Bíblia para fortalecer sua caminhada espiritual.",
    icon: Sparkles,
    verses: ["Jeremias 29:11", "Isaías 40:31", "Josué 1:9", "Salmos 91:1-2"],
    color: "text-emerald-500",
  },
];

const EstudoBiblico = () => {
  const { books } = useBibleBooks();
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"biblia" | "versiculos" | "estudos">("biblia");

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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB: Estudos Bíblicos */}
      {activeTab === "estudos" && (
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl font-semibold mb-6 text-center">
            Estudos <span className="text-gradient-gold">Temáticos</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BIBLE_STUDIES.map((study) => {
              const Icon = study.icon;
              return (
                <Card key={study.title} className="hover:shadow-celestial hover:border-celestial/30 transition-all">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className={`h-5 w-5 ${study.color}`} />
                      </div>
                      <h3 className="font-serif font-semibold text-sm">{study.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{study.description}</p>
                    <div className="pt-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Passagens-chave</p>
                      <div className="flex flex-wrap gap-1.5">
                        {study.verses.map((verse) => (
                          <span
                            key={verse}
                            className="text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-md"
                          >
                            {verse}
                          </span>
                        ))}
                      </div>
                    </div>
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

export default EstudoBiblico;
