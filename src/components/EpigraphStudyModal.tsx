import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  BookOpen,
  MapPin,
  Users,
  Target,
  Cross,
  CheckCircle2,
  Copy,
  Check,
  FileText,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { SUPABASE_URL } from "@/integrations/supabase/client";
import { getAuthToken } from "@/lib/auth-helpers";

interface EpigraphStudyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookName: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
  title: string;
  passageText?: string;
  onOpenAIChat?: (initialQuery: string) => void;
}

interface EpigraphAnalysis {
  contexto: string;
  localCenario: string;
  personagens: string;
  objetivo: string;
  cristologia: string;
  licoesPraticas: string[];
}

export const EpigraphStudyModal: React.FC<EpigraphStudyModalProps> = ({
  open,
  onOpenChange,
  bookName,
  chapter,
  verseStart,
  verseEnd,
  title,
  passageText = "",
  onOpenAIChat,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<EpigraphAnalysis | null>(null);
  const [copied, setCopied] = useState(false);

  const rangeRef = `${bookName} ${chapter}:${verseStart}${verseEnd > verseStart ? `-${verseEnd}` : ""}`;

  // Generate or load study whenever the modal opens with a new epigraph
  useEffect(() => {
    if (!open || !title) return;

    let isMounted = true;
    setLoading(true);

    async function fetchOrGenerateStudy() {
      // 1. Fallback structured knowledge
      const fallbackAnalysis: EpigraphAnalysis = {
        contexto: `A seção "${title}" situa-se no livro de ${bookName}, capítulo ${chapter}. Historicamente e teologicamente, esta perícope estabelece princípios vitais para o povo de Deus, tratando da relação de santidade, consagração e obediência à aliança divina. Culturamente, reflete os costumes, práticas e revelações progressivas da dispensação bíblica.`,
        localCenario: `O relato e os ensinamentos desta perícope estão ambientados nos cenários sagrados de ${bookName} (o Tabernáculo no deserto, os montes de Israel, o Templo de Jerusalém ou as congregações do Novo Testamento), lugar onde Deus manifestava Sua glória e comunhão com os Seus servos.`,
        personagens: `Os principais personagens e agentes desta perícope incluem os servos do Senhor, líderes ministeriais, mediadores da aliança e todo o povo congregado, ressaltando o senso de responsabilidade individual e coletiva diante do Todo-Poderoso.`,
        objetivo: `O objetivo fundamental desta perícope é revelar o caráter santo e misericordioso de Deus, estabelecendo diretrizes claras para a adoração, a confissão, a retidão moral e a restauração espiritual dos crentes.`,
        cristologia: `Cristologicamente, esta passagem aponta tipologicamente para Jesus Cristo — o Cordeiro de Deus, o Sumo Sacerdote perfeito e o Mediador de uma Nova e Superior Aliança, na qual temos pleno perdão e acesso ao Trono da Graça.`,
        licoesPraticas: [
          "A santidade de Deus exige sinceridade e quebrantamento em nosso culto diário.",
          "O perdão e a comunhão com Deus são dádivas da Sua infinita graça soberana.",
          "Nenhuma transgressão está além do alcance redentor do sacrifício de Cristo.",
          "O crente é chamado a viver como testemunha viva da justiça e do amor divino.",
        ],
      };

      try {
        const token = await getAuthToken();
        const res = await fetch(`${SUPABASE_URL}/functions/v1/theology-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Realize uma análise exegética e homilética da epígrafe bíblica "${title}" da passagem ${rangeRef}.
Responda EXCLUSIVAMENTE em formato JSON com as chaves:
{
  "contexto": "texto sobre o contexto histórico e teológico",
  "localCenario": "descrição do local físico, geográfico e cenário sagrado",
  "personagens": "principais personagens envolvidos e seus papéis",
  "objetivo": "objetivo central da instrução ou narrativa",
  "cristologia": "conexão tipológica e revelação de Jesus Cristo",
  "licoesPraticas": ["lição 1", "lição 2", "lição 3", "lição 4"]
}`,
              },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawReply = data.choices?.[0]?.message?.content || data.reply || "";
          const jsonMatch = rawReply.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (isMounted) {
              setAnalysis({
                contexto: parsed.contexto || fallbackAnalysis.contexto,
                localCenario: parsed.localCenario || fallbackAnalysis.localCenario,
                personagens: parsed.personagens || fallbackAnalysis.personagens,
                objetivo: parsed.objetivo || fallbackAnalysis.objetivo,
                cristologia: parsed.cristologia || fallbackAnalysis.cristologia,
                licoesPraticas: Array.isArray(parsed.licoesPraticas) && parsed.licoesPraticas.length
                  ? parsed.licoesPraticas
                  : fallbackAnalysis.licoesPraticas,
              });
              setLoading(false);
              return;
            }
          }
        }
      } catch (e) {
        console.warn("Using contextual theological fallback for epigraph:", e);
      }

      if (isMounted) {
        setAnalysis(fallbackAnalysis);
        setLoading(false);
      }
    }

    fetchOrGenerateStudy();

    return () => {
      isMounted = false;
    };
  }, [open, title, rangeRef, bookName, chapter]);

  const handleCopyStudy = () => {
    if (!analysis) return;
    const text = `📖 ESTUDO DA EPÍGRAFE: ${title}
Referência: ${rangeRef}

🏛️ CONTEXTO
${analysis.contexto}

📍 LOCAL E CENÁRIO
${analysis.localCenario}

👥 PERSONAGENS
${analysis.personagens}

🎯 OBJETIVO
${analysis.objetivo}

✝️ CONEXÃO COM CRISTO (CRISTOLOGIA)
${analysis.cristologia}

✨ LIÇÕES PRÁTICAS
${analysis.licoesPraticas.map((l, i) => `${i + 1}. ${l}`).join("\n")}

— Gerado via pregador.site`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Estudo copiado para a área de transferência!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToSermon = () => {
    onOpenChange(false);
    navigate(`/gerador-pregacoes?tema=${encodeURIComponent(title)}&texto=${encodeURIComponent(rangeRef)}`);
  };

  const handleAskAI = () => {
    onOpenChange(false);
    if (onOpenAIChat) {
      onOpenAIChat(`Poderia me explicar a fundo os mistérios teológicos e aplicações da perícope "${title}" (${rangeRef})?`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/25">
              <Sparkles className="h-3 w-3" /> Estudo da Epígrafe
            </span>
            <Badge variant="outline" className="border-border text-muted-foreground font-mono text-[10px]">
              {rangeRef}
            </Badge>
          </div>
          <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-foreground leading-snug">
            {title}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-semibold text-foreground">
              Estruturando exegese e contexto teológico...
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Consultando léxicos, tipologia cristológica e cenários históricos da perícope.
            </p>
          </div>
        ) : analysis ? (
          <div className="space-y-6 pt-4 text-sm leading-relaxed">
            {/* 1. Contexto */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Contexto
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm">
                {analysis.contexto}
              </p>
            </div>

            {/* 2. Local e Cenário */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Local e Cenário
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm">
                {analysis.localCenario}
              </p>
            </div>

            {/* 3. Personagens */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Users className="h-4 w-4" /> Personagens
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm">
                {analysis.personagens}
              </p>
            </div>

            {/* 4. Objetivo */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Target className="h-4 w-4" /> Objetivo
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm">
                {analysis.objetivo}
              </p>
            </div>

            {/* 5. Cristologia & Tipologia */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Cross className="h-4 w-4" /> Conexão com Cristo (Cristologia)
              </h4>
              <p className="text-foreground/90 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/25 text-xs sm:text-sm italic">
                {analysis.cristologia}
              </p>
            </div>

            {/* 6. Lições Práticas */}
            <div className="space-y-2">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Lições e Aplicação para a Igreja
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {analysis.licoesPraticas.map((licao, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/40 border border-border/50 text-xs sm:text-sm"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-foreground/90">{licao}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-border/50">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyStudy}
                className="gap-1.5 text-xs rounded-xl"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copiado!" : "Copiar Estudo"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleSendToSermon}
                className="gap-1.5 text-xs rounded-xl border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
              >
                <FileText className="h-3.5 w-3.5" /> Transformar em Esboço
              </Button>

              {onOpenAIChat && (
                <Button
                  size="sm"
                  onClick={handleAskAI}
                  className="bg-gradient-gold text-background font-bold gap-1.5 text-xs rounded-xl shadow-gold ml-auto"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> Tirar Dúvidas com IA Theos
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
