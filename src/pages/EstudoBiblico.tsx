import { BookOpen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const books = [
  "Gênesis", "Êxodo", "Levítico", "Números", "Deuteronômio", "Josué", "Juízes", "Rute",
  "1 Samuel", "2 Samuel", "1 Reis", "2 Reis", "1 Crônicas", "2 Crônicas", "Esdras", "Neemias",
  "Ester", "Jó", "Salmos", "Provérbios", "Eclesiastes", "Cantares", "Isaías", "Jeremias",
  "Lamentações", "Ezequiel", "Daniel", "Oséias", "Joel", "Amós", "Obadias", "Jonas",
  "Miquéias", "Naum", "Habacuque", "Sofonias", "Ageu", "Zacarias", "Malaquias",
  "Mateus", "Marcos", "Lucas", "João", "Atos", "Romanos", "1 Coríntios", "2 Coríntios",
  "Gálatas", "Efésios", "Filipenses", "Colossenses", "1 Tessalonicenses", "2 Tessalonicenses",
  "1 Timóteo", "2 Timóteo", "Tito", "Filemom", "Hebreus", "Tiago", "1 Pedro", "2 Pedro",
  "1 João", "2 João", "3 João", "Judas", "Apocalipse"
];

const EstudoBiblico = () => (
  <div className="container py-12">
    <div className="mb-8 text-center">
      <h1 className="font-serif text-4xl font-bold mb-2">Estudo Bíblico <span className="text-gradient-gold">Avançado</span></h1>
      <p className="text-muted-foreground">Navegue pela Bíblia completa com busca, comparação e comentários teológicos.</p>
    </div>

    <div className="mx-auto max-w-xl mb-10">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar versículo, palavra ou referência..."
            className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button className="bg-gradient-gold text-background">Buscar</Button>
      </div>
    </div>

    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
      {books.map((b) => (
        <Card key={b} className="cursor-pointer hover:shadow-celestial hover:border-celestial/30 transition-all hover:-translate-y-0.5">
          <CardContent className="p-3 text-center">
            <BookOpen className="h-4 w-4 mx-auto mb-1 text-accent" />
            <p className="text-xs font-medium truncate">{b}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default EstudoBiblico;
