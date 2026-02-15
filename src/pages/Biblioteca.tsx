import { Link, useSearchParams } from "react-router-dom";
import { FileText, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const categories = [
  "Todos", "Avivamento", "Fé", "Santidade", "Salvação", "Arrependimento",
  "Espírito Santo", "Escatologia", "Cruzada", "Páscoa", "Natal", "Oração", "Graça"
];

const sermons = [
  { title: "O Fogo do Avivamento", theme: "Avivamento", verse: "Atos 2:1-4", excerpt: "Uma mensagem poderosa sobre o derramamento do Espírito Santo nos últimos dias." },
  { title: "A Fé que Move Montanhas", theme: "Fé", verse: "Mateus 17:20", excerpt: "Estudo sobre a fé inabalável que transforma impossíveis em realidade." },
  { title: "Santidade: O Caminho Estreito", theme: "Santidade", verse: "1 Pedro 1:15-16", excerpt: "Reflexão profunda sobre a santificação na vida cristã moderna." },
  { title: "A Cruz e a Salvação", theme: "Salvação", verse: "João 3:16", excerpt: "O plano redentor de Deus para a humanidade revelado na cruz." },
  { title: "Volta ao Primeiro Amor", theme: "Arrependimento", verse: "Apocalipse 2:4-5", excerpt: "Chamado ao arrependimento e retorno à presença de Deus." },
  { title: "O Consolador Prometido", theme: "Espírito Santo", verse: "João 14:16-17", excerpt: "O papel do Espírito Santo na vida do crente e da igreja." },
];

const Biblioteca = () => {
  const [searchParams] = useSearchParams();
  const activeTema = searchParams.get("tema") || "todos";

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Biblioteca de <span className="text-gradient-gold">Mensagens</span></h1>
        <p className="text-muted-foreground">Pregações organizadas por temas com texto base, esboço e aplicação prática.</p>
      </div>

      <div className="mx-auto max-w-xl mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar por tema ou título..." className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((c) => (
          <Link key={c} to={c === "Todos" ? "/biblioteca" : `/biblioteca?tema=${c.toLowerCase()}`}>
            <span className={cn(
              "inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-all cursor-pointer",
              activeTema === c.toLowerCase() || (c === "Todos" && activeTema === "todos")
                ? "bg-accent text-accent-foreground border-accent"
                : "border-border hover:bg-muted"
            )}>
              {c}
            </span>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sermons.map((s) => (
          <Card key={s.title} className="cursor-pointer hover:shadow-celestial hover:border-celestial/30 transition-all hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-gold">
                  <FileText className="h-5 w-5 text-background" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-accent uppercase tracking-wider">{s.theme}</span>
                  <h3 className="font-serif text-lg font-semibold mt-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{s.verse}</p>
                  <p className="text-sm text-muted-foreground mt-2">{s.excerpt}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Biblioteca;
