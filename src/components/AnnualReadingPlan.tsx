import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, List, CalendarDays, BookOpen } from "lucide-react";
import { biblicalPlan } from "@/data/biblicalPlan";
import { chronologicalPlan } from "@/data/chronologicalPlan";
import { useAnnualReadingProgress } from "@/hooks/useAnnualReadingProgress";
import { ProgressHeader } from "@/components/ProgressHeader";
import { DayCard } from "@/components/DayCard";
import { DayModal } from "@/components/DayModal";
import type { DayEntry } from "@/data/biblicalPlan";
import { RankingPanel } from "@/components/RankingPanel";

const READ_REFS_KEY = "reading-plan-read-refs";

const MONTHS_PT = [
  "janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro",
];

function getDateLabel(dayOfYear: number): string {
  const d = new Date(new Date().getFullYear(), 0, dayOfYear);
  return `${d.getDate()} de ${MONTHS_PT[d.getMonth()]}`;
}

type FilterType = "all" | "done" | "pending" | "today";
type PlanType = "biblical" | "chronological";
type ViewType = "list" | "calendar";

export default function AnnualReadingPlan() {
  const [planType, setPlanType] = useState<PlanType>("biblical");
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<ViewType>("list");
  const [selectedEntry, setSelectedEntry] = useState<DayEntry | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [justCompleted, setJustCompleted] = useState<number | null>(null);
  const todayRef = useRef<HTMLDivElement>(null);

  const { completedDays, toggleDay, percentage, streak, todayDayNumber } =
    useAnnualReadingProgress(planType);

  const plan = planType === "biblical" ? biblicalPlan : chronologicalPlan;

  const readRefs = useMemo(() => {
    try {
      const raw = localStorage.getItem(READ_REFS_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch { return new Set<string>(); }
  }, [modalOpen]);

  const getDayReadProgress = useCallback((entry: DayEntry) => {
    const count = entry.references.filter(r => readRefs.has(`${entry.day}:${r}`)).length;
    return Math.round((count / entry.references.length) * 100);
  }, [readRefs]);

  const filtered = useMemo(() => {
    let result = plan;
    if (filter === "done") result = result.filter((e) => completedDays.has(e.day));
    if (filter === "pending") result = result.filter((e) => !completedDays.has(e.day));
    if (filter === "today") result = result.filter((e) => e.day === todayDayNumber);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.books.some((b) => b.toLowerCase().includes(q)) ||
          e.references.some((r) => r.toLowerCase().includes(q))
      );
    }
    return result;
  }, [plan, filter, search, completedDays, todayDayNumber]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-day="${todayDayNumber}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
    return () => clearTimeout(timer);
  }, [todayDayNumber]);

  const handleToggle = useCallback(
    (day: number) => {
      const wasCompleted = completedDays.has(day);
      toggleDay(day);
      if (!wasCompleted) {
        setJustCompleted(day);
        setTimeout(() => setJustCompleted(null), 1000);
      }
    },
    [completedDays, toggleDay]
  );

  const openModal = (entry: DayEntry) => {
    setSelectedEntry(entry);
    setModalOpen(true);
  };

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: "all", label: "Todos", count: plan.length },
    { key: "done", label: "Concluídos", count: completedDays.size },
    { key: "pending", label: "Pendentes", count: plan.length - completedDays.size },
    { key: "today", label: "Hoje" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_320px] gap-8">
    <div className="space-y-8 min-w-0">
      {/* Hero header */}
      <div className="text-center space-y-3 pb-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-2">
          <BookOpen className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Plano de Leitura Anual</h1>
        <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
          Leia a Bíblia inteira em 365 dias com acompanhamento diário
        </p>
      </div>

      {/* Plan Selector */}
      <Tabs value={planType} onValueChange={(v) => setPlanType(v as PlanType)}>
        <TabsList className="w-full h-12 rounded-xl bg-muted/50 p-1">
          <TabsTrigger value="biblical" className="flex-1 rounded-lg text-sm font-semibold data-[state=active]:shadow-sm">
            📖 Ordem Bíblica
          </TabsTrigger>
          <TabsTrigger value="chronological" className="flex-1 rounded-lg text-sm font-semibold data-[state=active]:shadow-sm">
            📅 Ordem Cronológica
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Progress */}
      <ProgressHeader
        percentage={percentage}
        completedCount={completedDays.size}
        streak={streak}
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por livro... (ex: Salmos)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border/40 bg-card/60 text-sm"
          />
        </div>
        <div className="flex gap-1.5 bg-muted/30 rounded-xl p-1">
          <Button
            variant={view === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("list")}
            className="h-9 w-9 rounded-lg"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "ghost"}
            size="icon"
            onClick={() => setView("calendar")}
            className="h-9 w-9 rounded-lg"
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card/60 border-border/40 text-muted-foreground hover:border-border hover:bg-muted/40"
            }`}
          >
            {f.label}
            {f.count !== undefined && (
              <span className="ml-1.5 opacity-70">({f.count})</span>
            )}
          </button>
        ))}
      </div>

      {/* Day Cards */}
      <div
        className={
          view === "calendar"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5"
            : "flex flex-col gap-2.5"
        }
      >
        {filtered.map((entry) => (
          <div key={entry.day} ref={entry.day === todayDayNumber ? todayRef : undefined}>
            <DayCard
              day={entry.day}
              dateLabel={getDateLabel(entry.day)}
              references={entry.references}
              period={entry.period}
              isCompleted={completedDays.has(entry.day)}
              isToday={entry.day === todayDayNumber}
              onToggle={() => handleToggle(entry.day)}
              onClick={() => openModal(entry)}
              justCompleted={justCompleted === entry.day}
              readProgress={getDayReadProgress(entry)}
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <p className="text-muted-foreground text-lg">Nenhum dia encontrado.</p>
          <p className="text-muted-foreground/60 text-sm">Tente ajustar os filtros ou a busca.</p>
        </div>
      )}

      {/* Modal */}
      <DayModal
        entry={selectedEntry}
        dateLabel={selectedEntry ? getDateLabel(selectedEntry.day) : ""}
        isCompleted={selectedEntry ? completedDays.has(selectedEntry.day) : false}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onToggle={() => {
          if (selectedEntry) handleToggle(selectedEntry.day);
        }}
      />
    </div>
    <aside className="lg:sticky lg:top-20 lg:self-start">
      <RankingPanel type="reading" planType={planType} />
    </aside>
    </div>
  );
}
