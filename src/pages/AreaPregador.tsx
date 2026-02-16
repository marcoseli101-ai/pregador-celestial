import { useState, useEffect, useCallback } from "react";
import { Trash2, Loader2, FileText, BookOpen, Sparkles, Search, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ContentActions } from "@/components/ContentActions";
import { Link } from "react-router-dom";

interface SavedItem {
  id: string;
  title: string;
  content: string;
  content_type: string;
  created_at: string;
}

const typeLabels: Record<string, { label: string; icon: typeof FileText }> = {
  pregacao: { label: "Pregação", icon: Sparkles },
  devocional: { label: "Devocional", icon: BookOpen },
  estudo: { label: "Estudo Bíblico", icon: BookOpen },
  biblioteca: { label: "Biblioteca", icon: FileText },
  dicionario: { label: "Dicionário", icon: FileText },
  questionario: { label: "Questionário", icon: FileText },
  geral: { label: "Geral", icon: FileText },
};

const AreaPregador = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("saved_content")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (filter !== "todos") {
      query = query.eq("content_type", filter);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
      toast.error("Erro ao carregar conteúdos.");
    } else {
      setItems(data ?? []);
    }
    setLoading(false);
  }, [user, filter]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("saved_content").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir.");
    } else {
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Conteúdo excluído.");
    }
  };

  const filteredItems = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
  });

  const categories = ["todos", ...Object.keys(typeLabels)];

  if (!user) {
    return (
      <div className="container py-12">
        <div className="mx-auto max-w-lg text-center space-y-6">
          <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground" />
          <h1 className="font-serif text-3xl font-bold">Área do Pregador</h1>
          <p className="text-muted-foreground">Faça login para acessar seus conteúdos salvos.</p>
          <Link to="/login">
            <Button className="bg-gradient-gold text-background hover:opacity-90">Entrar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">
          Área do <span className="text-gradient-gold">Pregador</span>
        </h1>
        <p className="text-muted-foreground">
          Todos os seus conteúdos salvos — pregações, devocionais, estudos e mais.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-xl mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar nos conteúdos salvos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all cursor-pointer ${
              filter === cat
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border hover:bg-muted"
            }`}
          >
            {cat === "todos" ? "Todos" : typeLabels[cat]?.label || cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-10 text-center space-y-4">
            <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="font-serif text-xl font-semibold">Nenhum conteúdo salvo</h2>
            <p className="text-sm text-muted-foreground">
              Use os botões de "Salvar" em qualquer página para guardar conteúdos aqui.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 max-w-5xl mx-auto">
          {filteredItems.map((item) => {
            const meta = typeLabels[item.content_type] || typeLabels.geral;
            const Icon = meta.icon;
            const isExpanded = expandedId === item.id;
            const preview = item.content.replace(/[#*_]/g, "").slice(0, 150).trim();

            return (
              <Card
                key={item.id}
                className="hover:shadow-celestial hover:border-celestial/30 transition-all"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-gold">
                        <Icon className="h-4 w-4 text-background" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                          {meta.label}
                        </span>
                        <h3 className="font-serif text-sm font-semibold truncate">{item.title}</h3>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {isExpanded ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm mb-3 max-h-96 overflow-y-auto">
                      {item.content}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mb-3">{preview}...</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? "Recolher" : "Ver completo"}
                    </button>
                    <div className="flex items-center gap-1">
                      <ContentActions
                        content={item.content}
                        title={item.title}
                        contentType={item.content_type}
                        compact
                        hideSave
                      />
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-2">
                    {new Date(item.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Credit */}
      <div className="mt-12 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Produzido por <span className="font-semibold text-foreground">Marcos Silva</span>
        </p>
      </div>
    </div>
  );
};

export default AreaPregador;
