import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GeradorPregacoes = () => {
  const [tema, setTema] = useState("");

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Gerador de Pregações <span className="text-gradient-gold">com IA</span></h1>
        <p className="text-muted-foreground">Gere esboços e sermões completos com inteligência artificial e base bíblica sólida.</p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="shadow-celestial border-celestial/20">
          <CardHeader>
            <CardTitle className="font-serif">Configure sua Pregação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Tema da Mensagem</Label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                placeholder="Ex: O poder da fé, A volta de Jesus, Santidade..."
                className="mt-1 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Público-Alvo</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="igreja">Igreja</SelectItem>
                    <SelectItem value="jovens">Jovens</SelectItem>
                    <SelectItem value="cruzada">Cruzada Evangelística</SelectItem>
                    <SelectItem value="congresso">Congresso</SelectItem>
                    <SelectItem value="casais">Casais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Tempo de Pregação</Label>
                <Select>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Nível Espiritual</Label>
              <Select>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="exortacao">Exortação</SelectItem>
                  <SelectItem value="avivamento">Avivamento</SelectItem>
                  <SelectItem value="ensino">Ensino</SelectItem>
                  <SelectItem value="evangelismo">Evangelismo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-gradient-gold text-background hover:opacity-90 gap-2 text-base" size="lg">
              <Sparkles className="h-5 w-5" /> Gerar Pregação
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeradorPregacoes;
