import { useState } from "react";
import { HelpCircle, CheckCircle, XCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentActions } from "@/components/ContentActions";

const questions = [
  {
    question: "Quantos livros tem a Bíblia?",
    options: ["39", "66", "73", "27"],
    correct: 1,
    level: "Fácil",
  },
  {
    question: "Quem escreveu a maior parte dos Salmos?",
    options: ["Moisés", "Salomão", "Davi", "Asafe"],
    correct: 2,
    level: "Fácil",
  },
  {
    question: "Em que livro encontramos os Dez Mandamentos?",
    options: ["Gênesis", "Êxodo", "Levítico", "Deuteronômio"],
    correct: 1,
    level: "Médio",
  },
];

const Questionarios = () => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="container py-12">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold mb-2">Questionários <span className="text-gradient-gold">Bíblicos</span></h1>
        <p className="text-muted-foreground">Teste seus conhecimentos e cresça na Palavra de Deus.</p>
      </div>

      <div className="mx-auto max-w-xl">
        {finished ? (
          <Card className="text-center shadow-celestial">
            <CardContent className="p-10">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-accent" />
              <h2 className="font-serif text-2xl font-bold mb-2">Resultado</h2>
              <p className="text-3xl font-bold text-gradient-gold mb-2">{score}/{questions.length}</p>
              <p className="text-muted-foreground mb-4">
                {score === questions.length ? "Perfeito! Você é um grande conhecedor da Palavra!" : "Continue estudando e crescendo na Palavra!"}
              </p>
              <ContentActions
                content={`Questionário Bíblico\nResultado: ${score}/${questions.length}\n\n${questions.map((q, i) => `${i + 1}. ${q.question}\nResposta: ${q.options[q.correct]}`).join("\n\n")}`}
                title="Resultado do Questionário Bíblico"
                className="justify-center mb-4"
              />
              <Button onClick={restart} className="bg-gradient-gold text-background">Tentar Novamente</Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-celestial">
            <CardHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">{q.level}</span>
                <span className="text-sm text-muted-foreground">{current + 1}/{questions.length}</span>
              </div>
              <CardTitle className="font-serif text-xl mt-2">
                <HelpCircle className="inline h-5 w-5 mr-2 text-accent" />
                {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={cn(
                    "w-full rounded-lg border p-4 text-left text-sm font-medium transition-all",
                    selected === null && "hover:bg-muted cursor-pointer",
                    selected !== null && idx === q.correct && "border-green-500 bg-green-50 dark:bg-green-900/20",
                    selected === idx && idx !== q.correct && "border-red-500 bg-red-50 dark:bg-red-900/20",
                    selected !== null && idx !== q.correct && idx !== selected && "opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    {opt}
                    {selected !== null && idx === q.correct && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {selected === idx && idx !== q.correct && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                </button>
              ))}
              {selected !== null && (
                <Button onClick={next} className="w-full mt-4 bg-gradient-gold text-background">
                  {current + 1 >= questions.length ? "Ver Resultado" : "Próxima Pergunta"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Questionarios;
