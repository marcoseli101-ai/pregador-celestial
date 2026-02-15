import { FileText, Mic, Presentation, Video, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tools = [
  { icon: FileText, title: "Gerador de PDF", desc: "Crie esboços e estudos bíblicos formatados em PDF prontos para impressão.", cta: "Gerar PDF" },
  { icon: Mic, title: "Sermão em Áudio", desc: "Converta seus sermões em áudio com voz natural usando inteligência artificial.", cta: "Gerar Áudio" },
  { icon: Presentation, title: "Slides para Culto", desc: "Gere apresentações automáticas com versículos e tópicos para projeção.", cta: "Gerar Slides" },
  { icon: Video, title: "Vídeos Curtos", desc: "Crie vídeos curtos com mensagens bíblicas para redes sociais e grupos.", cta: "Gerar Vídeo" },
];

const Multimidia = () => (
  <div className="container py-12">
    <div className="mb-8 text-center">
      <h1 className="font-serif text-4xl font-bold mb-2">Gerador de Conteúdo <span className="text-gradient-gold">Multimídia</span></h1>
      <p className="text-muted-foreground">Crie materiais profissionais para seu ministério: PDF, áudio, slides e vídeos.</p>
    </div>

    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
      {tools.map((t) => (
        <Card key={t.title} className="hover:shadow-celestial transition-all border-border/50">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-gold shadow-gold">
              <t.icon className="h-8 w-8 text-background" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">{t.title}</h3>
            <p className="text-sm text-muted-foreground mb-5">{t.desc}</p>
            <Button className="bg-gradient-gold text-background hover:opacity-90 gap-2">
              <Download className="h-4 w-4" /> {t.cta}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default Multimidia;
