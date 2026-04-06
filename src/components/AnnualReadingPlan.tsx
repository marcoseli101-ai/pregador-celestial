import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, List, CalendarDays } from "lucide-react";
import { biblicalPlan } from "@/data/biblicalPlan";
import { chronologicalPlan } from "@/data/chronologicalPlan";
import { useAnnualReadingProgress } from "@/hooks/useAnnualReadingProgress";
import { ProgressHeader } from "@/components/ProgressHeader";
import { DayCard } from "@/components/DayCard";
import { DayModal } from "@/components/DayModal";
import type { DayEntry } from "@/data/biblicalPlan";

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

  // Scroll to today on mount
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

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Todos" },
    { key: "done", label: "Concluídos" },
    { key: "pending", label: "Pendentes" },
    { key: "today", label: "Hoje" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Plano de Leitura Anual</h1>
        <p className="text-muted-foreground text-sm">Leia a Bíblia inteira em 365 dias</p>
      </div>

      {/* Plan Selector */}
      <Tabs value={planType} onValueChange={(v) => setPlanType(v as PlanType)}>
        <TabsList className="w-full">
          <TabsTrigger value="biblical" className="flex-1">Ordem Bíblica</TabsTrigger>
          <TabsTrigger value="chronological" className="flex-1">Ordem Cronológica</TabsTrigger>
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por livro... (ex: Salmos)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="icon"
            onClick={() => setView("calendar")}
          >
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <Badge
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </Badge>
        ))}
      </div>

      {/* Day Cards */}
      <div
        className={
          view === "calendar"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2"
            : "flex flex-col gap-2"
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
            />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-8">Nenhum dia encontrado.</p>
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
  );
}
