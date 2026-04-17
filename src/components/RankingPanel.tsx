import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type ReadingRow = { user_id: string; name: string; avatar_url: string | null; days_completed: number };
type QuizRow = { user_id: string; name: string; avatar_url: string | null; total_points: number; total_correct: number };

interface Props {
  type: "reading" | "quiz";
  planType?: "biblical" | "chronological";
}

export function RankingPanel({ type, planType = "biblical" }: Props) {
  const { user } = useAuth();
  const [rows, setRows] = useState<(ReadingRow | QuizRow)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = type === "reading"
        ? await supabase.rpc("get_reading_ranking", { _plan_type: planType })
        : await supabase.rpc("get_quiz_ranking");
      if (!cancelled) {
        if (!error && data) setRows(data as any);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [type, planType]);

  const getMedal = (i: number) => {
    if (i === 0) return <Trophy className="h-4 w-4 text-accent" />;
    if (i === 1) return <Medal className="h-4 w-4 text-muted-foreground" />;
    if (i === 2) return <Award className="h-4 w-4 text-accent/70" />;
    return <span className="text-xs font-bold text-muted-foreground w-4 text-center">{i + 1}</span>;
  };

  return (
    <Card className="shadow-celestial">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-lg flex items-center gap-2">
          <Trophy className="h-5 w-5 text-accent" />
          Ranking {type === "reading" ? "de Leitura" : "de Questionários"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Seja o primeiro a aparecer aqui!
          </p>
        ) : (
          rows.slice(0, 10).map((r, i) => {
            const isMe = user?.id === r.user_id;
            const score = type === "reading"
              ? `${(r as ReadingRow).days_completed} dias`
              : `${(r as QuizRow).total_points} pts`;
            return (
              <div
                key={r.user_id}
                className={cn(
                  "flex items-center gap-2.5 p-2 rounded-lg transition-colors",
                  isMe ? "bg-accent/10 border border-accent/30" : "hover:bg-muted/40"
                )}
              >
                <div className="w-5 flex justify-center">{getMedal(i)}</div>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={r.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">
                    {r.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-1 text-sm font-medium truncate">
                  {r.name}{isMe && <span className="text-xs text-accent ml-1">(você)</span>}
                </span>
                <span className="text-xs font-bold text-accent">{score}</span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
