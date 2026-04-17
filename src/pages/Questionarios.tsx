import { useState, useCallback } from "react";
import { AnimatedPage, AnimatedSection } from "@/components/AnimatedSection";
import { getAuthToken } from "@/lib/auth-helpers";
import { HelpCircle, CheckCircle, XCircle, Trophy, Loader2, Brain, RotateCcw, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentActions } from "@/components/ContentActions";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { RankingPanel } from "@/components/RankingPanel";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const POINTS_BY_LEVEL: Record<string, number> = { "Fácil": 1, "Médio": 3, "Difícil": 5 };

type Nivel = "Fácil" | "Médio" | "Difícil";

type Question = {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
};

const GENERATE_QUIZ_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quiz`;

const Questionarios = () => {
  const { user } = useAuth();
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const fetchQuestion = useCallback(async (selectedNivel: Nivel, prevQuestions: string[]) => {
    setLoading(true);
    setSelected(null);
    setShowExplanation(false);
    setCurrentQuestion(null);

    try {
      const token = await getAuthToken();
      const resp = await fetch(GENERATE_QUIZ_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nivel: selectedNivel,
          questionsAnswered: prevQuestions.slice(-20).join("; "),
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
        throw new Error(data.error || `Erro ${resp.status}`);
      }

      const question: Question = await resp.json();
      setCurrentQuestion(question);
    } catch (e: any) {
      toast.error(e.message || "Erro ao gerar pergunta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  const startGame = (selectedNivel: Nivel) => {
    setNivel(selectedNivel);
    setScore(0);
    setTotal(0);
    setAnsweredQuestions([]);
    fetchQuestion(selectedNivel, []);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || !currentQuestion) return;
    setSelected(idx);
    setTotal((t) => t + 1);
    const isCorrect = idx === currentQuestion.correct;
    if (isCorrect) setScore((s) => s + 1);
    setShowExplanation(true);
    setAnsweredQuestions((prev) => [...prev, currentQuestion.question]);
    if (user && nivel) {
      supabase.from("quiz_scores").insert({
        user_id: user.id,
        nivel,
        correct: isCorrect,
        points: isCorrect ? (POINTS_BY_LEVEL[nivel] ?? 1) : 0,
      }).then(() => {});
    }
  };

  const nextQuestion = () => {
    if (!nivel) return;
    fetchQuestion(nivel, answeredQuestions);
  };

  const backToMenu = () => {
    setNivel(null);
    setCurrentQuestion(null);
    setSelected(null);
    setScore(0);
    setTotal(0);
    setAnsweredQuestions([]);
    setShowExplanation(false);
  };

  const nivelConfig: Record<Nivel, { color: string; icon: string; desc: string }> = {
    "Fácil": { color: "border-green-500/50 hover:border-green-500 hover:bg-green-500/5", icon: "🌱", desc: "Perguntas básicas sobre a Bíblia" },
    "Médio": { color: "border-amber-500/50 hover:border-amber-500 hover:bg-amber-500/5", icon: "⚡", desc: "Requer conhecimento intermediário" },
    "Difícil": { color: "border-red-500/50 hover:border-red-500 hover:bg-red-500/5", icon: "🔥", desc: "Para verdadeiros estudiosos" },
  };

  // Menu de seleção de nível
  if (!nivel) {
    return (
      <AnimatedPage className="container py-12">
        <AnimatedSection className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-bold mb-2">
            Questionários <span className="text-gradient-gold">Bíblicos com IA</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Perguntas geradas por inteligência artificial. Ilimitadas e sempre diferentes!
          </p>
        </AnimatedSection>

        <div className="mx-auto max-w-2xl grid gap-4 sm:grid-cols-3">
          {(Object.keys(nivelConfig) as Nivel[]).map((n) => (
            <button
              key={n}
              onClick={() => startGame(n)}
              className={cn(
                "rounded-xl border-2 p-6 text-left transition-all duration-200 cursor-pointer",
                nivelConfig[n].color
              )}
            >
              <span className="text-3xl mb-3 block">{nivelConfig[n].icon}</span>
              <h3 className="font-serif text-lg font-bold mb-1">{n}</h3>
              <p className="text-xs text-muted-foreground">{nivelConfig[n].desc}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Brain className="h-4 w-4" />
            Perguntas geradas por IA — nunca se repetem!
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // Tela do quiz
  return (
    <div className="container py-12">
      <div className="mb-6 text-center">
        <h1 className="font-serif text-3xl font-bold mb-1">
          Questionário <span className="text-gradient-gold">{nivel}</span>
        </h1>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>Pontuação: <strong className="text-foreground">{score}/{total}</strong></span>
          {total > 0 && (
            <span>Acerto: <strong className="text-foreground">{Math.round((score / total) * 100)}%</strong></span>
          )}
        </div>
        {total > 0 && (
          <Progress value={(score / total) * 100} className="mt-3 max-w-xs mx-auto h-2" />
        )}
      </div>

      <div className="mx-auto max-w-xl">
        {loading ? (
          <Card className="shadow-celestial">
            <CardContent className="p-12 text-center">
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-accent" />
              <p className="text-muted-foreground">Gerando pergunta com IA...</p>
            </CardContent>
          </Card>
        ) : currentQuestion ? (
          <Card className="shadow-celestial">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">{nivel}</span>
                <span className="text-sm text-muted-foreground">Pergunta #{total + (selected === null ? 1 : 0)}</span>
              </div>
              <CardTitle className="font-serif text-xl mt-2">
                <HelpCircle className="inline h-5 w-5 mr-2 text-accent" />
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left text-sm font-medium transition-all",
                    selected === null && "hover:bg-muted cursor-pointer",
                    selected !== null && idx === currentQuestion.correct && "border-green-500 bg-green-50 dark:bg-green-900/20",
                    selected === idx && idx !== currentQuestion.correct && "border-red-500 bg-red-50 dark:bg-red-900/20",
                    selected !== null && idx !== currentQuestion.correct && idx !== selected && "opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {selected !== null && idx === currentQuestion.correct && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {selected === idx && idx !== currentQuestion.correct && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                </button>
              ))}

              {showExplanation && currentQuestion.explanation && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-start gap-2">
                    <BookOpen className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                    <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                  </div>
                </div>
              )}

              {selected !== null && (
                <div className="flex gap-2 mt-4">
                  <Button onClick={nextQuestion} className="flex-1 bg-gradient-gold text-background">
                    Próxima Pergunta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-celestial">
            <CardContent className="p-10 text-center">
              <p className="text-muted-foreground mb-4">Erro ao carregar pergunta.</p>
              <Button onClick={() => fetchQuestion(nivel, answeredQuestions)} className="bg-gradient-gold text-background">
                Tentar Novamente
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <Button variant="outline" size="sm" onClick={backToMenu}>
            <RotateCcw className="h-4 w-4 mr-1" /> Trocar Nível
          </Button>
          {total > 0 && (
            <ContentActions
              content={`Questionário Bíblico (${nivel})\nPontuação: ${score}/${total} (${Math.round((score / total) * 100)}%)`}
              title={`Questionário Bíblico - ${nivel}`}
              contentType="questionario"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionarios;
