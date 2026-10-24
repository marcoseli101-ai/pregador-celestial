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
  Copy,
  Check,
  FileText,
  Loader2,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "@/integrations/supabase/client";
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

function buildContextualAnalysis(
  title: string,
  bookName: string,
  chapter: number,
  verseStart: number,
  verseEnd: number
): EpigraphAnalysis {
  const normTitle = title.toLowerCase();
  const rangeRef = `${bookName} ${chapter}:${verseStart}${verseEnd > verseStart ? `-${verseEnd}` : ""}`;

  // Especialização: Romanos 5 (Adão e Cristo)
  if (bookName.includes("Rom") && (normTitle.includes("adão") || normTitle.includes("cristo") || chapter === 5)) {
    return {
      contexto: `A perícope situa-se no coração da teologia soteriológica de Paulo na Epístola aos Romanos (capítulo 5). O apóstolo estabelece o paralelismo tipológico e a antítese radical entre a imputação do pecado herdado em Adão e a superabundância da justiça comunicada pela graça mediante Jesus Cristo. Cultural e teologicamente, confronta a autojustiça humana demonstrando que nenhuma obra da lei pode anular o veredito da queda, exceto a justificação pelo sangue do Cordeiro.`,
      localCenario: `A carta foi redigida pelo apóstolo Paulo por volta de 57 d.C., provavelmente na cidade portuária de Corinto, destinada aos crentes da igreja em Roma (composta por judeus e gentios convertidos), que necessitavam de fundamentos doutrinários inabaláveis sobre a soberania da graça salvadora.`,
      personagens: `Adão (cabeça federal e representante da humanidade caída, através de quem o pecado e a morte entraram no cosmos); Jesus Cristo (o 'Último Adão', mediador da Aliança Eterna e cabeça da nova criação redimida); e a humanidade justificada por meio da fé.`,
      objetivo: `Provar a absoluta suficiência, superioridade e eficácia da justificação em Cristo Jesus sobre os efeitos devastadores da transgressão de Adão, assegurando que 'onde abundou o pecado, superabundou a graça'.`,
      cristologia: `Jesus Cristo é revelado como o Segundo Adão e Cabeça Federal da raça redimida. Ao passo que a desobediência do primeiro homem trouxe condenação e morte a muitos, o ato supremo de obediência e sacrifício vicário de Cristo conquistou a graça eterna, a reconciliação com o Pai e a ressurreição.`,
      licoesPraticas: [
        "Nossa segurança de salvação não repousa em méritos próprios, mas na fidelidade inabalável da obra consumada de Cristo.",
        "O poder da graça de Deus é infinitamente mais poderoso para restaurar do que o pecado foi para destruir.",
        "Fomos chamados a reinar em vida por meio da abundância da graça e do dom gratuito da justiça.",
        "A reconciliação com o Pai nos garante paz real, gozo nas tribulações e gloriosa esperança.",
      ],
    };
  }

  // Especialização: Levítico (Leis de expiação e sacrifícios)
  if (bookName.includes("Lev") || normTitle.includes("oferta") || normTitle.includes("pecado") || normTitle.includes("sacerdote")) {
    return {
      contexto: `O capítulo apresenta as leis e rituais de expiação (sacrifício pelo pecado) em conformidade com a aliança outorgada por Deus a Moisés no Sinai. A ênfase é a santidade absoluta de Deus e a gravidade de cada desvio ético ou moral diante do Senhor, exigindo uma oferenda vicária para a restauração da plena comunhão comunitária.`,
      localCenario: `O texto se passa no Tabernáculo (Santuário) de Israel durante a peregrinação no deserto, especificamente no pátio onde se localizava o altar de holocaustos perante o véu do Santo dos Santos.`,
      personagens: `O Sumo Sacerdote (ou sacerdote ungido como mediador cúltico); a congregação dos filhos de Israel; os príncipes tribais e cada cidadão que trazia a sua oferta voluntária em confissão.`,
      objetivo: `Estabelecer normas claras, sistemáticas e ordenadas de expiação pelos pecados, enfatizando que sem derramamento de sangue não há remissão, e ressaltando a necessidade indispensável de arrependimento e mediação.`,
      cristologia: `O novilho sem mácula e o sangue aspergido perante o véu prefiguram o sacrifício perfeito de Jesus Cristo na cruz do Calvário, o Cordeiro sem mancha cujo sangue não apenas cobre temporariamente, mas purifica para todo o sempre os nossos pecados.`,
      licoesPraticas: [
        "A santidade de Deus requer zelo, pureza moral e reverência de todos os Seus servos.",
        "A responsabilidade espiritual começa nos líderes e sacerdotes do povo de Deus.",
        "Temos livre acesso ao Santo dos Santos porque o véu foi rasgado por Cristo uma vez por todas.",
        "A confissão e o quebrantamento genuínos são o caminho bíblico para a restauração da comunhão.",
      ],
    };
  }

  // Padrão Geral Robusto
  return {
    contexto: `A perícope "${title}" localiza-se em ${rangeRef}. Historicamente e teologicamente, esta passagem aborda a aliança viva entre Deus e o Seu povo, tratando da fidelidade às Escrituras, consagração moral e os desdobramentos espirituais dos atos humanos à luz da soberania divina. No contexto mais amplo de ${bookName}, serve como alicerce fundamental para o amadurecimento e instrução dos crentes.`,
    localCenario: `O cenário geográfico e histórico de ${bookName} representa o palco das manifestações da providência e poder de Deus perante o Seu povo eleito e as nações circunvizinhas, revelando a glória do Todo-Poderoso em momentos cruciais da história da salvação.`,
    personagens: `Os agentes centrais incluem o próprio Deus como protagonista soberano, Seus profetas e mensageiros inspirados, os líderes comunitários e cada crente chamado a viver em obediência à Palavra revelada.`,
    objetivo: `O objetivo teológico principal da perícope "${title}" é comunicar verdades eternas de fé, retidão e santidade, desafiando o ouvinte e leitor a alinhar seus pensamentos, conduta e coração com a perfeita vontade de Deus.`,
    cristologia: `Como toda a Escritura converge para o Filho de Deus, esta passagem aponta para Jesus Cristo — na Sua soberania, no Seu sacrifício redentor ou na Sua vitória gloriosa como Mediador supremo da Nova Aliança.`,
    licoesPraticas: [
      `Viver os princípios expostos em ${bookName} como bússola para o discernimento cotidiano.`,
      "Reconhecer a fidelidade graciosa de Deus mesmo em meio às provações terrenas.",
      "Cultivar uma vida sincera de oração, santificação e consagração ao Espírito Santo.",
      "Compartilhar as boas-novas de salvação e esperança viva com nossa geração.",
    ],
  };
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

  // Always generate immediate contextual analysis when opened!
  useEffect(() => {
    if (!open || !title) return;

    let isMounted = true;
    const baseAnalysis = buildContextualAnalysis(title, bookName, chapter, verseStart, verseEnd);
    setAnalysis(baseAnalysis);

    // Asynchronously try to enrich with AI if credentials exist
    async function enrichWithAI() {
      try {
        const token = await getAuthToken();
        const res = await fetch(`${SUPABASE_URL}/functions/v1/theology-chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_PUBLISHABLE_KEY,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            messages: [
              {
                role: "user",
                content: `Realize uma análise exegética da epígrafe "${title}" (${rangeRef}). Formato JSON com: contexto, localCenario, personagens, objetivo, cristologia, licoesPraticas (array).`,
              },
            ],
            context: "Estudo bíblico de epígrafe exegético",
          }),
        });

        if (res.ok) {
          const rawText = await res.text();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch && isMounted) {
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              setAnalysis({
                contexto: parsed.contexto || baseAnalysis.contexto,
                localCenario: parsed.localCenario || baseAnalysis.localCenario,
                personagens: parsed.personagens || baseAnalysis.personagens,
                objetivo: parsed.objetivo || baseAnalysis.objetivo,
                cristologia: parsed.cristologia || baseAnalysis.cristologia,
                licoesPraticas: Array.isArray(parsed.licoesPraticas) && parsed.licoesPraticas.length
                  ? parsed.licoesPraticas
                  : baseAnalysis.licoesPraticas,
              });
            } catch {
              // keep baseAnalysis
            }
          }
        }
      } catch {
        // keep baseAnalysis
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    enrichWithAI();

    return () => {
      isMounted = false;
    };
  }, [open, title, rangeRef, bookName, chapter, verseStart, verseEnd]);

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
    } else {
      navigate(`/gerador-pregacoes?tema=${encodeURIComponent(title)}&texto=${encodeURIComponent(rangeRef)}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-[100]">
        <DialogHeader className="border-b border-border/40 pb-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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

        {analysis ? (
          <div className="space-y-6 pt-4 text-sm leading-relaxed">
            {/* 1. Contexto */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <BookOpen className="h-4 w-4" /> Contexto
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm text-justify leading-relaxed">
                {analysis.contexto}
              </p>
            </div>

            {/* 2. Local e Cenário */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Local e Cenário
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm text-justify leading-relaxed">
                {analysis.localCenario}
              </p>
            </div>

            {/* 3. Personagens */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Users className="h-4 w-4" /> Personagens
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm text-justify leading-relaxed">
                {analysis.personagens}
              </p>
            </div>

            {/* 4. Objetivo */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Target className="h-4 w-4" /> Objetivo
              </h4>
              <p className="text-foreground/90 bg-muted/30 p-3.5 rounded-2xl border border-border/50 text-xs sm:text-sm text-justify leading-relaxed">
                {analysis.objetivo}
              </p>
            </div>

            {/* 5. Cristologia / Tipologia */}
            <div className="space-y-1.5">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Cross className="h-4 w-4" /> Conexão com Cristo (Cristologia)
              </h4>
              <p className="text-foreground/90 bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/25 text-xs sm:text-sm text-justify leading-relaxed">
                {analysis.cristologia}
              </p>
            </div>

            {/* 6. Lições Práticas */}
            <div className="space-y-2">
              <h4 className="font-serif text-base font-bold text-amber-500 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Lições Práticas
              </h4>
              <div className="space-y-2">
                {analysis.licoesPraticas.map((licao, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-muted/20 border border-border/40 text-xs sm:text-sm"
                  >
                    <span className="h-5 w-5 rounded-md bg-amber-500/20 text-amber-500 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-foreground/90 leading-relaxed">{licao}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyStudy}
                  className="gap-1.5 text-xs rounded-xl border-border/60 hover:border-amber-500/50"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                  Copiar Estudo
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSendToSermon}
                  className="gap-1.5 text-xs rounded-xl border-border/60 hover:border-amber-500/50"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-500" />
                  Gerar Esboço
                </Button>
              </div>

              <Button
                size="sm"
                onClick={handleAskAI}
                className="gap-1.5 text-xs rounded-xl bg-gradient-gold text-background font-bold shadow-md hover:opacity-90"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Aprofundar com IA Theos
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            <p className="text-sm font-semibold text-foreground">
              Carregando estudo teológico da perícope...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
