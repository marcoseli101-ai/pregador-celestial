import { Calendar, BookOpen, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Devocional = () => {
  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Devocional <span className="text-gradient-gold">Diário</span></h1>
        <p className="text-muted-foreground">Versículo do dia, reflexão espiritual e oração.</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-center gap-2 mb-6 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span className="capitalize">{today}</span>
        </div>

        <Card className="shadow-celestial border-gold/20 overflow-hidden">
          <div className="h-2 bg-gradient-gold" />
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-3 text-accent" />
              <p className="text-xs font-semibold text-accent uppercase tracking-widest">Versículo do Dia</p>
              <blockquote className="mt-4 text-xl font-serif italic leading-relaxed">
                "Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.
                Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas."
              </blockquote>
              <p className="mt-3 text-sm font-semibold text-muted-foreground">— Provérbios 3:5-6</p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-2 flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent" /> Reflexão
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Este versículo nos convida a depositar toda a nossa confiança em Deus, não nas nossas próprias capacidades ou entendimento limitado.
                Em cada decisão, em cada caminho, devemos reconhecer a soberania de Deus e permitir que Ele dirija os nossos passos.
                A promessa é clara: quando confiamos no Senhor de todo o coração, Ele endireita as nossas veredas.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold mb-2">🙏 Oração do Dia</h3>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Senhor Deus, eu confio em Ti de todo o meu coração. Ajuda-me a não me apoiar no meu próprio entendimento,
                mas a Te reconhecer em todos os meus caminhos. Dirige os meus passos hoje e sempre. Em nome de Jesus, amém."
              </p>
            </div>

            <Button className="w-full bg-gradient-gold text-background hover:opacity-90">
              Compartilhar Devocional
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Devocional;
