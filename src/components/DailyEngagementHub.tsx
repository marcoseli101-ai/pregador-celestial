import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Music,
  Share2,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Flame,
  FileEdit,
  Volume2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { biblicalPlan } from "@/data/biblicalPlan";
import { getHymnOfTheDay } from "@/data/harpaCrista";
import { ShareVerseImageModal } from "@/components/ShareVerseImageModal";
import { useDailyDevotional } from "@/hooks/useDailyDevotional";
import { toast } from "sonner";

export const DailyEngagementHub: React.FC = () => {
  const { devotional } = useDailyDevotional();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Calculate day of the year (1 - 365)
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.min(365, Math.max(1, Math.floor(diff / oneDay)));

  // Today's reading plan entry
  const todayPlan = biblicalPlan.find((p) => p.day === dayOfYear) || biblicalPlan[0];

  // Local storage checklist for today's readings
  const storageKey = `daily-reading-check:${now.getFullYear()}:${dayOfYear}`;
  const [checkedRefs, setCheckedRefs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleRefCheck = (ref: string) => {
    setCheckedRefs((prev) => {
      const next = prev.includes(ref) ? prev.filter((r) => r !== ref) : [...prev, ref];
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      if (!prev.includes(ref)) {
        toast.success(`Leitura concluída: ${ref}! Glória a Deus! 🙌`);
      }
      return next;
    });
  };

  const totalRefs = todayPlan?.references.length || 1;
  const completedRefs = checkedRefs.length;
  const percentCompleted = Math.round((completedRefs / totalRefs) * 100);

  // Hymn of the day
  const dailyHymn = getHymnOfTheDay();

  // Active drafts count
  const [draftCount, setDraftCount] = useState<number>(0);
  useEffect(() => {
    try {
      const localSermons = localStorage.getItem("pregador:sermoes_offline_v2");
      const list = localSermons ? JSON.parse(localSermons) : [];
      setDraftCount(Array.isArray(list) ? list.length : 0);
    } catch {
      setDraftCount(0);
    }
  }, []);

  // Verse of the Day details
  const verseText =
    devotional?.versiculo_base_texto ||
    "Lâmpada para os meus pés é a tua palavra e luz para o meu caminho.";
  const verseRef = devotional?.versiculo_base || "Salmos 119:105";
  const verseVersion = "ACF"; // Almeida Corrigida Fiel

  return (
    <section className="py-12 relative overflow-hidden bg-gradient-to-b from-background via-amber-500/[0.02] to-background">
      <div className="container px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-500 text-xs font-semibold mb-2">
              <Sparkles className="h-3.5 w-3.5" /> Centro de Edificação Diária
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Seu Encontro Diário com a <span className="text-gradient-gold">Palavra</span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Versículo com imagem para compartilhar, plano de leitura guiado e hino de adoração.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-accent/10 px-3 py-1.5 rounded-xl border border-border/60 self-start sm:self-auto">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
            <span>
              {now.toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
            <span className="text-amber-500 font-bold">• Dia {dayOfYear}/365</span>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ========================================================
              CARD 1: VERSÍCULO DO DIA & COMPARTILHAR IMAGEM
             ======================================================== */}
          <Card className="glass-card border-amber-500/30 rounded-3xl overflow-hidden shadow-lg hover:border-amber-500/50 transition-all flex flex-col justify-between">
            <div className="h-1.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Versículo do Dia
                  </span>
                  <Badge variant="outline" className="border-amber-500/40 text-amber-500 font-mono text-[10px] px-2">
                    Versão: {verseVersion}
                  </Badge>
                </div>

                <blockquote className="font-serif text-base sm:text-lg italic text-foreground leading-relaxed my-3">
                  “{verseText}”
                </blockquote>

                <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5 mt-2">
                  <span className="w-4 h-px bg-amber-400/60" /> {verseRef}
                </p>

                {devotional?.titulo && (
                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 bg-accent/10 p-2.5 rounded-xl border border-border/50">
                    <span className="font-semibold text-foreground">Reflexão:</span> {devotional.titulo}
                  </p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => setShareModalOpen(true)}
                  className="flex-1 bg-gradient-gold text-background font-semibold text-xs h-10 rounded-xl shadow-gold gap-1.5 hover:opacity-95"
                >
                  <Share2 className="h-3.5 w-3.5" /> Gerar Imagem
                </Button>
                <Link to="/devocional" className="flex-1">
                  <Button
                    variant="outline"
                    className="w-full text-xs h-10 rounded-xl border-border/80 hover:bg-accent/10 gap-1.5"
                  >
                    Ler Devocional <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ========================================================
              CARD 2: PLANO DE LEITURA ANUAL (LEITURA DO DIA)
             ======================================================== */}
          <Card className="glass-card border-border/80 rounded-3xl overflow-hidden shadow-lg hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> Leitura do Dia
                  </span>
                  <span className="text-xs font-mono font-bold text-foreground bg-emerald-500/10 px-2 py-0.5 rounded-md text-emerald-400">
                    Dia {dayOfYear} de 365
                  </span>
                </div>

                <div className="space-y-1.5 my-3">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progresso de hoje</span>
                    <span className="font-bold text-foreground">
                      {completedRefs} de {totalRefs} ({percentCompleted}%)
                    </span>
                  </div>
                  <Progress value={percentCompleted} className="h-2 bg-accent/20" />
                </div>

                {/* References Checklist */}
                <div className="space-y-2 mt-4">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Capítulos para Hoje:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {todayPlan.references.map((ref) => {
                      const isChecked = checkedRefs.includes(ref);
                      return (
                        <div
                          key={ref}
                          onClick={() => toggleRefCheck(ref)}
                          className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all select-none ${
                            isChecked
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                              : "bg-background/60 border-border/60 hover:bg-accent/10 text-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isChecked ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                            )}
                            <span className={`text-xs font-semibold ${isChecked ? "line-through opacity-80" : ""}`}>
                              {ref}
                            </span>
                          </div>
                          <Link
                            to={`/estudo-biblico?busca=${encodeURIComponent(ref)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-muted-foreground hover:text-amber-500 flex items-center gap-1"
                            title="Ler na Bíblia"
                          >
                            Ler <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/plano-leitura">
                  <Button
                    variant="outline"
                    className="w-full text-xs h-10 rounded-xl border-border/80 hover:bg-emerald-500/10 hover:text-emerald-400 gap-1.5"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Abrir Plano Completo (365 Dias)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* ========================================================
              CARD 3: HINO DO DIA (HARPA CRISTÃ)
             ======================================================== */}
          <Card className="glass-card border-border/80 rounded-3xl overflow-hidden shadow-lg hover:border-amber-500/30 transition-all flex flex-col justify-between">
            <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600" />
            <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                    <Music className="h-3.5 w-3.5" /> Hino do Dia
                  </span>
                  <Badge variant="outline" className="border-indigo-500/40 text-indigo-400 font-mono text-[10px] px-2">
                    Harpa Cristã #{dailyHymn.number}
                  </Badge>
                </div>

                <h3 className="font-serif text-lg font-bold text-foreground mt-2 line-clamp-1">
                  {dailyHymn.title}
                </h3>

                <div className="my-3 p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-muted-foreground italic leading-relaxed">
                  {dailyHymn.chorus ? (
                    <>
                      <span className="font-sans font-bold text-indigo-300 not-italic block mb-1">Coro:</span>
                      "{dailyHymn.chorus.slice(0, 160)}..."
                    </>
                  ) : (
                    <>"{dailyHymn.stanzas[0]?.slice(0, 160)}..."</>
                  )}
                </div>

                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Volume2 className="h-3.5 w-3.5 text-indigo-400" /> Letra completa com cifras e louvor congregacional.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <Link to={`/harpa?hino=${dailyHymn.number}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs h-10 rounded-xl shadow-md gap-1.5 hover:opacity-95">
                    <Music className="h-3.5 w-3.5" /> Cantar Hino #{dailyHymn.number}
                  </Button>
                </Link>
                <Link to="/harpa" className="shrink-0">
                  <Button
                    variant="outline"
                    className="text-xs h-10 rounded-xl border-border/80 hover:bg-accent/10 px-3"
                    title="Ver todos os 640 hinos"
                  >
                    Todos (640)
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Strip for Ongoing Studies / Sermons Preparation */}
        <div className="mt-6 p-4 rounded-2xl glass-card border border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
              <FileEdit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                Estudos e Sermões em Preparação
                {draftCount > 0 && (
                  <Badge className="bg-amber-500 text-background font-mono text-[10px] px-1.5 py-0">
                    {draftCount} salvo{draftCount > 1 ? "s" : ""}
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                Retome suas pesquisas bíblicas, anotações de púlpito e rascunhos de onde parou.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link to="/gerador-pregacoes" className="flex-1 sm:flex-initial">
              <Button size="sm" className="w-full bg-gradient-gold text-background font-semibold text-xs rounded-xl shadow-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Novo Esboço
              </Button>
            </Link>
            <Link to="/area-pregador" className="flex-1 sm:flex-initial">
              <Button size="sm" variant="outline" className="w-full text-xs rounded-xl border-border/80">
                Ver Meus Sermões
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Share Verse Image Modal */}
      <ShareVerseImageModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        defaultVerseText={verseText}
        defaultReference={verseRef}
        defaultVersion={verseVersion}
      />
    </section>
  );
};
