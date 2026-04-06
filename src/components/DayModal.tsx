import { useState, useEffect, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { translateRefToEn } from "@/hooks/useBibleAPI";
import type { DayEntry } from "@/data/biblicalPlan";

const ABBREV_TO_PT: Record<string, string> = {
  "Gn": "Gênesis", "Ex": "Êxodo", "Lv": "Levítico", "Nm": "Números",
  "Dt": "Deuteronômio", "Js": "Josué", "Jz": "Juízes", "Rt": "Rute",
  "1Sm": "1 Samuel", "1 Sm": "1 Samuel", "2Sm": "2 Samuel", "2 Sm": "2 Samuel",
  "1Rs": "1 Reis", "1 Rs": "1 Reis", "2Rs": "2 Reis", "2 Rs": "2 Reis",
  "1Cr": "1 Crônicas", "1 Cr": "1 Crônicas", "2Cr": "2 Crônicas", "2 Cr": "2 Crônicas",
  "Ed": "Esdras", "Ne": "Neemias", "Et": "Ester", "Jó": "Jó",
  "Sl": "Salmos", "Pv": "Provérbios", "Ec": "Eclesiastes", "Ct": "Cantares",
  "Is": "Isaías", "Jr": "Jeremias", "Lm": "Lamentações", "Ez": "Ezequiel",
  "Dn": "Daniel", "Os": "Oséias", "Jl": "Joel", "Am": "Amós",
  "Ob": "Obadias", "Jn": "Jonas", "Mq": "Miquéias", "Na": "Naum",
  "Hc": "Habacuque", "Sf": "Sofonias", "Ag": "Ageu", "Zc": "Zacarias",
  "Ml": "Malaquias", "Mt": "Mateus", "Mc": "Marcos", "Lc": "Lucas",
  "Jo": "João", "At": "Atos", "Rm": "Romanos",
  "1Co": "1 Coríntios", "1 Co": "1 Coríntios", "2Co": "2 Coríntios", "2 Co": "2 Coríntios",
  "Gl": "Gálatas", "Ef": "Efésios", "Fp": "Filipenses", "Cl": "Colossenses",
  "1Ts": "1 Tessalonicenses", "1 Ts": "1 Tessalonicenses",
  "2Ts": "2 Tessalonicenses", "2 Ts": "2 Tessalonicenses",
  "1Tm": "1 Timóteo", "1 Tm": "1 Timóteo", "2Tm": "2 Timóteo", "2 Tm": "2 Timóteo",
  "Tt": "Tito", "Fm": "Filemom", "Hb": "Hebreus", "Tg": "Tiago",
  "1Pe": "1 Pedro", "1 Pe": "1 Pedro", "2Pe": "2 Pedro", "2 Pe": "2 Pedro",
  "1Jo": "1 João", "1 Jo": "1 João", "2Jo": "2 João", "2 Jo": "2 João",
  "3Jo": "3 João", "3 Jo": "3 João", "Jd": "Judas", "Ap": "Apocalipse",
};

function expandRef(abbrevRef: string): string {
  const match = abbrevRef.match(/^(.+?)\s+(\d.*)$/u);
  if (!match) return abbrevRef;
  const abbr = match[1].trim();
  const rest = match[2];
  const fullName = ABBREV_TO_PT[abbr];
  return fullName ? `${fullName} ${rest}` : abbrevRef;
}

interface Verse { number: number; text: string; }
interface RefData { verses: Verse[]; loading: boolean; error: string | null; }

interface DayModalProps {
  entry: DayEntry | null;
  dateLabel: string;
  isCompleted: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onToggle: () => void;
}

const READ_REFS_KEY = "reading-plan-read-refs";

function loadReadRefs(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_REFS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}

function saveReadRefs(refs: Set<string>) {
  localStorage.setItem(READ_REFS_KEY, JSON.stringify([...refs]));
}

export function DayModal({ entry, dateLabel, isCompleted, open, onOpenChange, onToggle }: DayModalProps) {
  const [activeRefIndex, setActiveRefIndex] = useState(0);
  const [refData, setRefData] = useState<Record<string, RefData>>({});
  const [readRefs, setReadRefs] = useState<Set<string>>(loadReadRefs);

  useEffect(() => {
    setActiveRefIndex(0);
    setRefData({});
    fetchedRefsRef.current = new Set();
  }, [entry?.day]);

  useEffect(() => { saveReadRefs(readRefs); }, [readRefs]);

  const fetchedRefsRef = useRef<Set<string>>(new Set());

  const fetchRef = useCallback(async (ref: string) => {
    if (fetchedRefsRef.current.has(ref)) return;
    fetchedRefsRef.current.add(ref);
    setRefData(prev => ({ ...prev, [ref]: { verses: [], loading: true, error: null } }));
    try {
      const fullRef = expandRef(ref);
      const enRef = translateRefToEn(fullRef);
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(enRef)}?translation=almeida`);
      if (!res.ok) throw new Error("Falha ao carregar");
      const json = await res.json();
      const verses: Verse[] = (json.verses || []).map((v: { verse: number; text: string }) => ({
        number: v.verse, text: v.text,
      }));
      setRefData(prev => ({ ...prev, [ref]: { verses, loading: false, error: null } }));
    } catch (e) {
      fetchedRefsRef.current.delete(ref);
      setRefData(prev => ({
        ...prev,
        [ref]: { verses: [], loading: false, error: e instanceof Error ? e.message : "Erro" },
      }));
    }
  }, []);

  useEffect(() => {
    if (!entry || !open) return;
    const ref = entry.references[activeRefIndex];
    if (ref) fetchRef(ref);
  }, [entry, activeRefIndex, open, fetchRef]);

  const markRefRead = useCallback((ref: string, dayNum: number) => {
    const key = `${dayNum}:${ref}`;
    setReadRefs(prev => { const next = new Set(prev); next.add(key); return next; });
  }, []);

  if (!entry) return null;

  const refs = entry.references;
  const activeRef = refs[activeRefIndex];
  const currentData = refData[activeRef];
  const readCount = refs.filter(r => readRefs.has(`${entry.day}:${r}`)).length;
  const dayProgress = Math.round((readCount / refs.length) * 100);
  const isActiveRead = readRefs.has(`${entry.day}:${activeRef}`);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 rounded-2xl border-border/40 overflow-hidden">
        {/* Header */}
        <div className="p-5 pb-4 border-b border-border/30 space-y-3 bg-card/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-xl tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-primary" />
              </div>
              <span>Dia {entry.day}</span>
              <span className="text-muted-foreground font-normal text-base">— {dateLabel}</span>
            </DialogTitle>
            <DialogDescription className="sr-only">Leituras do dia {entry.day}</DialogDescription>
          </DialogHeader>

          {entry.period && (
            <Badge variant="outline" className="w-fit text-xs font-medium opacity-70">{entry.period}</Badge>
          )}

          {/* Progress */}
          <div className="space-y-2 bg-muted/30 rounded-xl p-3">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>{readCount} de {refs.length} leituras concluídas</span>
              <span className="text-primary font-bold">{dayProgress}%</span>
            </div>
            <Progress value={dayProgress} className="h-2" />
          </div>

          {/* Reference tabs */}
          <div className="flex gap-2 flex-wrap">
            {refs.map((ref, i) => {
              const isRead = readRefs.has(`${entry.day}:${ref}`);
              return (
                <button
                  key={ref}
                  onClick={() => setActiveRefIndex(i)}
                  className={`text-xs px-3 py-2 rounded-lg border transition-all flex items-center gap-1.5 font-medium ${
                    i === activeRefIndex
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : isRead
                      ? "bg-emerald-950/30 border-emerald-600/40 text-emerald-400"
                      : "bg-muted/40 border-border/40 text-muted-foreground hover:border-border hover:bg-muted/60"
                  }`}
                >
                  {isRead && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {expandRef(ref)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bible text */}
        <div
          className="flex-1 min-h-0 max-h-[50vh] overflow-y-auto"
          style={{ scrollbarGutter: "stable" }}
        >
          <div className="p-6 space-y-0.5">
            {currentData?.loading && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
                <span className="text-sm">Carregando {expandRef(activeRef)}...</span>
              </div>
            )}

            {currentData?.error && (
              <div className="text-center py-16 space-y-3">
                <p className="text-destructive font-medium">Não foi possível carregar o texto.</p>
                <Button variant="outline" size="sm" onClick={() => {
                  setRefData(prev => { const next = { ...prev }; delete next[activeRef]; return next; });
                  fetchRef(activeRef);
                }}>
                  Tentar novamente
                </Button>
              </div>
            )}

            {currentData?.verses.map((verse) => (
              <p
                key={verse.number}
                className="text-[15px] leading-[1.9] text-foreground/90"
                style={{
                  fontFamily: "'Inter', 'Georgia', serif",
                  letterSpacing: "0.015em",
                  wordSpacing: "0.05em",
                }}
              >
                <sup className="text-xs font-bold text-primary/70 mr-1.5 select-none">{verse.number}</sup>
                {verse.text}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 pt-3 border-t border-border/30 bg-card/90 backdrop-blur-sm flex flex-col gap-2.5">
          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              disabled={activeRefIndex === 0}
              onClick={() => setActiveRefIndex(i => i - 1)}
              className="text-xs"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-xs text-muted-foreground font-medium tabular-nums">
              {activeRefIndex + 1} / {refs.length}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={activeRefIndex === refs.length - 1}
              onClick={() => setActiveRefIndex(i => i + 1)}
              className="text-xs"
            >
              Próximo
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={isActiveRead ? "outline" : "secondary"}
              size="sm"
              className={`flex-1 text-xs font-semibold ${isActiveRead ? "border-emerald-600/50 text-emerald-400" : ""}`}
              onClick={() => {
                markRefRead(activeRef, entry.day);
                if (!isActiveRead && activeRefIndex < refs.length - 1) {
                  setActiveRefIndex(i => i + 1);
                }
              }}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              {isActiveRead ? "Leitura concluída ✓" : "Marcar como lido"}
            </Button>
            <Button
              onClick={onToggle}
              variant={isCompleted ? "outline" : "default"}
              size="sm"
              className={`flex-1 text-xs font-semibold ${isCompleted ? "border-emerald-600/50 text-emerald-400" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {isCompleted ? "Dia concluído ✓" : "Concluir dia"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
