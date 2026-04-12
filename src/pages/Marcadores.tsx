import { useState } from "react";
import { Bookmark, Trash2, Search, Loader2, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useVerseBookmarks } from "@/hooks/useVerseBookmarks";
import { Link } from "react-router-dom";

const colorMap: Record<string, string> = {
  yellow: "bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-200",
  green: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-200",
  blue: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200",
  pink: "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-200",
  purple: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-200",
};

const Marcadores = () => {
  const { allBookmarks, loading, removeBookmark, refetch } = useVerseBookmarks();
  const [search, setSearch] = useState("");

  // Group by book
  const filtered = allBookmarks.filter((b) => {
    const q = search.toLowerCase();
    return !q || b.book.toLowerCase().includes(q) || b.verse_text.toLowerCase().includes(q) || (b.note?.toLowerCase().includes(q) ?? false);
  });

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, b) => {
    const key = b.book;
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  const handleRemove = async (id: string) => {
    await removeBookmark(id);
  };

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Marcadores de <span className="text-gradient-gold">Versículos</span>
        </h1>
        <p className="text-muted-foreground">Seus versículos favoritos organizados por livro.</p>
      </div>

      <div className="mx-auto max-w-xl mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nos marcadores..."
            className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-20">
          <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground font-medium">
            {allBookmarks.length === 0 ? "Nenhum marcador ainda" : "Nenhum marcador encontrado"}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {allBookmarks.length === 0
              ? "Clique no ícone de marcador ao lado de um versículo para salvá-lo."
              : "Tente outro termo de busca."}
          </p>
          <Button asChild variant="outline" className="mt-4 gap-1.5">
            <Link to="/estudo-biblico">
              <BookOpen className="h-4 w-4" /> Ir ao Estudo Bíblico
            </Link>
          </Button>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-8">
          {Object.entries(grouped).map(([book, items]) => (
            <div key={book}>
              <h2 className="font-serif text-xl font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-accent" />
                {book}
                <Badge variant="secondary" className="text-xs">{items.length}</Badge>
              </h2>
              <div className="space-y-2">
                {items.sort((a, b) => a.chapter - b.chapter || a.verse_number - b.verse_number).map((bm) => (
                  <Card key={bm.id} className={`border ${colorMap[bm.color] || colorMap.yellow} group`}>
                    <CardContent className="p-4 flex items-start gap-3">
                      <Bookmark className="h-5 w-5 shrink-0 mt-0.5 fill-current" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {book} {bm.chapter}:{bm.verse_number}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{bm.verse_text}</p>
                        {bm.note && (
                          <p className="text-xs mt-2 opacity-80 italic">📝 {bm.note}</p>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleRemove(bm.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marcadores;
