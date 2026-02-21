import { useState, useMemo } from "react";
import { Search, Volume2, Filter, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentActions } from "@/components/ContentActions";
import { Badge } from "@/components/ui/badge";
import { bibleDictionary, categories } from "@/data/bibleDictionary";

const Dicionario = () => {
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState<"Todos" | "Hebraico" | "Grego">("Todos");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return bibleDictionary.filter((w) => {
      const matchLang = selectedLang === "Todos" || w.language === selectedLang;
      const matchCat = selectedCategory === "Todas" || w.category === selectedCategory;
      const matchSearch =
        !q ||
        w.transliteration.toLowerCase().includes(q) ||
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        w.application.toLowerCase().includes(q) ||
        w.verses.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q);
      return matchLang && matchCat && matchSearch;
    });
  }, [search, selectedLang, selectedCategory]);

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Dicionário <span className="text-gradient-gold">Bíblico</span>
        </h1>
        <p className="text-muted-foreground">
          Biblioteca completa de palavras em hebraico e grego com significado teológico, pronúncia e aplicação espiritual.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="text-sm text-muted-foreground">
            {bibleDictionary.length} palavras · {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-xl mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por palavra, significado, referência..."
            className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-5xl mb-8 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground mr-1">Idioma:</span>
          {(["Todos", "Hebraico", "Grego"] as const).map((lang) => (
            <Badge
              key={lang}
              variant={selectedLang === lang ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedLang(lang)}
            >
              {lang}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground mr-1">Categoria:</span>
          <Badge
            variant={selectedCategory === "Todas" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("Todas")}
          >
            Todas
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhuma palavra encontrada.</p>
          <p className="text-sm">Tente outra busca ou remova os filtros.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
          {filtered.map((w, i) => (
            <Card key={`${w.transliteration}-${i}`} className="hover:shadow-celestial transition-all border-border/50">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">{w.language}</span>
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{w.category}</Badge>
                    </div>
                    <p className="text-3xl font-bold mt-1" dir={w.language === "Hebraico" ? "rtl" : "ltr"}>{w.word}</p>
                    <p className="text-lg font-serif font-semibold text-foreground mt-1">{w.transliteration}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-accent hover:text-accent">
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Significado:</span> <span className="text-muted-foreground">{w.meaning}</span></p>
                  <p><span className="font-semibold">Aplicação:</span> <span className="text-muted-foreground">{w.application}</span></p>
                  <p><span className="font-semibold">Referências:</span> <span className="text-muted-foreground">{w.verses}</span></p>
                </div>
                <ContentActions
                  content={`${w.transliteration} (${w.word})\nIdioma: ${w.language}\nCategoria: ${w.category}\nSignificado: ${w.meaning}\nAplicação: ${w.application}\nReferências: ${w.verses}`}
                  title={`Dicionário: ${w.transliteration}`}
                  contentType="dicionario"
                  compact
                  className="mt-3 pt-3 border-t border-border"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dicionario;
