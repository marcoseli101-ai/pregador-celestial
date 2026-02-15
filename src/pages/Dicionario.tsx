import { Languages, Search, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const words = [
  { word: "שָׁלוֹם", transliteration: "Shalom", language: "Hebraico", meaning: "Paz, completude, bem-estar", application: "Expressa a paz plena que vem de Deus, não apenas ausência de conflito, mas integridade total.", verses: "Isaías 26:3, João 14:27" },
  { word: "רוּחַ", transliteration: "Ruach", language: "Hebraico", meaning: "Espírito, vento, sopro", application: "O Espírito de Deus que traz vida e poder. O mesmo sopro que criou o mundo habita em nós.", verses: "Gênesis 1:2, Ezequiel 37:9" },
  { word: "ἀγάπη", transliteration: "Agapē", language: "Grego", meaning: "Amor incondicional, amor divino", application: "O amor sacrificial de Deus que não depende de merecimento. É a essência do caráter divino.", verses: "1 Coríntios 13:4-8, 1 João 4:8" },
  { word: "אֱלֹהִים", transliteration: "Elohim", language: "Hebraico", meaning: "Deus (plural majestático)", application: "Nome que revela a grandeza e poder supremo de Deus. O plural sugere a plenitude da divindade.", verses: "Gênesis 1:1, Salmo 19:1" },
  { word: "χάρις", transliteration: "Charis", language: "Grego", meaning: "Graça, favor imerecido", application: "O favor divino concedido ao homem sem merecimento. É pela graça que somos salvos.", verses: "Efésios 2:8-9, Romanos 3:24" },
  { word: "יְהוָה", transliteration: "Yahweh", language: "Hebraico", meaning: "O Eterno, Eu Sou o que Sou", application: "O nome pessoal de Deus revelado a Moisés. Expressa Sua eternidade e auto-existência.", verses: "Êxodo 3:14, Salmo 83:18" },
];

const Dicionario = () => (
  <div className="container py-12">
    <div className="mb-8 text-center">
      <h1 className="font-serif text-4xl font-bold mb-2">Dicionário <span className="text-gradient-gold">Bíblico</span></h1>
      <p className="text-muted-foreground">Palavras em hebraico e grego com significado teológico, pronúncia e aplicação espiritual.</p>
    </div>

    <div className="mx-auto max-w-xl mb-10">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar palavra (hebraico, grego ou português)..." className="w-full rounded-lg border border-input bg-background px-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <Button className="bg-gradient-gold text-background">Buscar</Button>
      </div>
    </div>

    <div className="grid gap-5 md:grid-cols-2 max-w-5xl mx-auto">
      {words.map((w) => (
        <Card key={w.transliteration} className="hover:shadow-celestial transition-all border-border/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">{w.language}</span>
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
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Dicionario;
