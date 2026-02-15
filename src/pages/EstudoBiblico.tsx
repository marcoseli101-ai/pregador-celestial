import { useState } from "react";
import { BookOpen, Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBibleBooks, useBibleChapter, type BibleBook } from "@/hooks/useBibleAPI";

const testamentLabel: Record<string, string> = {
  VT: "Antigo Testamento",
  NT: "Novo Testamento",
};

const EstudoBiblico = () => {
  const { books } = useBibleBooks();
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
              <Button variant="outline" size="sm" onClick={() => setSelectedChapter(selectedChapter)}>
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

  // === BOOK LIST VIEW ===
  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Estudo Bíblico <span className="text-gradient-gold">Avançado</span>
        </h1>
        <p className="text-muted-foreground">Navegue pela Bíblia completa — livros, capítulos e versículos.</p>
      </div>

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
    </div>
  );
};

export default EstudoBiblico;
