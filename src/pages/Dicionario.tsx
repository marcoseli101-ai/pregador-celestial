import { useState, useEffect } from "react";
import { Search, Volume2, BookOpen, Loader2, Languages, Sparkles, Clock, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DictionaryEntry {
  word: string;
  transliteration: string;
  pronunciation_guide: string;
  language: string;
  strongs_number: string;
  meaning: string;
  usage: string;
  verses: string;
  related_words: { word: string; transliteration: string }[];
}

const HISTORY_KEY = "bible-dict-history";
const MAX_HISTORY = 15;

const getHistory = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch { return []; }
};

const addToHistory = (word: string) => {
  const history = getHistory().filter((w) => w.toLowerCase() !== word.toLowerCase());
  history.unshift(word);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
};

const Dicionario = () => {
  const [search, setSearch] = useState("");
  const [selectedLang, setSelectedLang] = useState<"Todos" | "Hebraico" | "Grego" | "Aramaico">("Todos");
  const [results, setResults] = useState<DictionaryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) {
      toast.error("Digite uma palavra para pesquisar");
      return;
    }

    addToHistory(q);
    setHistory(getHistory());
    setLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const { data, error } = await supabase.functions.invoke("generate-dictionary", {
        body: { word: q, language: selectedLang },
      });

      if (error) throw error;

      if (data?.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        toast.error("Nenhum resultado encontrado");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erro ao buscar palavra");
    } finally {
      setLoading(false);
    }
  };

  const speakWord = (entry: DictionaryEntry) => {
    if (!("speechSynthesis" in window)) {
      toast.error("Seu navegador não suporta síntese de voz");
      return;
    }

    window.speechSynthesis.cancel();
    const id = `${entry.word}-${entry.transliteration}`;
    setSpeakingId(id);

    // Speak the transliteration with pronunciation guide
    const text = `${entry.transliteration}. ${entry.pronunciation_guide}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 0.7;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const searchRelated = (word: string) => {
    setSearch(word);
    setTimeout(() => {
      handleSearchWithWord(word);
    }, 100);
  };

  const handleSearchWithWord = async (word: string) => {
    addToHistory(word);
    setHistory(getHistory());
    setLoading(true);
    setHasSearched(true);
    setResults([]);
    try {
      const { data, error } = await supabase.functions.invoke("generate-dictionary", {
        body: { word, language: selectedLang },
      });
      if (error) throw error;
      if (data?.results && Array.isArray(data.results)) setResults(data.results);
    } catch (e: any) {
      toast.error(e?.message || "Erro ao buscar palavra");
    } finally {
      setLoading(false);
    }
  };

  const removeFromHistory = (word: string) => {
    const updated = getHistory().filter((w) => w !== word);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  };

  const clearHistory = () => {
    localStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  };

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Dicionário <span className="text-gradient-gold">Bíblico com IA</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Pesquise qualquer palavra ou conceito bíblico e receba definições completas em Hebraico, Aramaico e Grego com pronúncia em áudio.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <Sparkles className="h-4 w-4 text-accent" />
          <span className="text-sm text-muted-foreground">
            Powered by IA · Ilimitado · Hebraico · Aramaico · Grego
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-xl mb-6">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: amor, graça, shalom, pneuma, ruach..."
              className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading} className="shrink-0">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-1 hidden sm:inline">Buscar</span>
          </Button>
        </div>
      </div>

      {/* Language Filter */}
      <div className="mx-auto max-w-xl mb-8">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Languages className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground mr-1">Idioma:</span>
          {(["Todos", "Hebraico", "Grego", "Aramaico"] as const).map((lang) => (
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
      </div>

      {/* Search History */}
      {history.length > 0 && !loading && (
        <div className="mx-auto max-w-xl mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-semibold">Pesquisas recentes</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7" onClick={clearHistory}>
              Limpar histórico
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {history.map((word) => (
              <Badge
                key={word}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors group pr-1"
              >
                <span onClick={() => { setSearch(word); handleSearchWithWord(word); }}>{word}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromHistory(word); }}
                  className="ml-1 rounded-full p-0.5 opacity-50 group-hover:opacity-100 hover:bg-destructive/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-16">
          <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Pesquisando nas línguas bíblicas...</p>
          <p className="text-sm text-muted-foreground">A IA está analisando o termo</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !hasSearched && (
        <div className="text-center py-16 text-muted-foreground">
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Digite uma palavra para começar</p>
          <p className="text-sm mt-2">Pesquise em português, hebraico, grego ou aramaico</p>
          <div className="flex flex-wrap gap-2 justify-center mt-6">
            {["Amor", "Graça", "Shalom", "Pneuma", "Ruach", "Logos", "Chesed", "Ágape"].map((suggestion) => (
              <Badge
                key={suggestion}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => {
                  setSearch(suggestion);
                  handleSearchWithWord(suggestion);
                }}
              >
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && hasSearched && results.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Nenhum resultado encontrado.</p>
          <p className="text-sm">Tente outra palavra ou mude o filtro de idioma.</p>
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {results.map((entry, i) => {
            const entryId = `${entry.word}-${entry.transliteration}`;
            const isSpeaking = speakingId === entryId;

            return (
              <Card key={i} className="hover:shadow-celestial transition-all border-border/50">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {entry.language}
                        </Badge>
                        {entry.strongs_number && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {entry.strongs_number}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-3xl font-bold mt-2"
                        dir={entry.language === "Grego" ? "ltr" : "rtl"}
                      >
                        {entry.word}
                      </p>
                      <p className="text-lg font-serif font-semibold text-foreground mt-1">
                        {entry.transliteration}
                      </p>
                      <p className="text-sm text-accent italic">{entry.pronunciation_guide}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-accent hover:text-accent ${isSpeaking ? "animate-pulse" : ""}`}
                      onClick={() => speakWord(entry)}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-foreground">Significado:</p>
                      <p className="text-muted-foreground">{entry.meaning}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Uso nas Escrituras:</p>
                      <p className="text-muted-foreground">{entry.usage}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Referências:</p>
                      <p className="text-muted-foreground">{entry.verses}</p>
                    </div>
                  </div>

                  {/* Related Words */}
                  {entry.related_words && entry.related_words.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Palavras relacionadas:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.related_words.map((rw, j) => (
                          <Badge
                            key={j}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors text-xs"
                            onClick={() => searchRelated(rw.transliteration)}
                          >
                            {rw.transliteration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dicionario;
