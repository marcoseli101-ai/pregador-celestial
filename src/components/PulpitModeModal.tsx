import React, { useState, useEffect } from "react";
import {
  Maximize2,
  Minimize2,
  X,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Type,
  Sliders,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SermonContentRenderer } from "./SermonContentRenderer";

interface PulpitModeModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export const PulpitModeModal: React.FC<PulpitModeModalProps> = ({
  open,
  onClose,
  title,
  content,
}) => {
  const [fontSize, setFontSize] = useState<number>(24);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Preaching Stopwatch
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open && isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [open, isTimerRunning]);

  // Reset timer on open
  useEffect(() => {
    if (open) {
      setSecondsElapsed(0);
      setIsTimerRunning(true);
    }
  }, [open]);

  // Format Elapsed Time
  const formatTimer = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col pulpit-mode select-text overflow-hidden animate-in fade-in duration-200">
      {/* Top Preacher Status Bar */}
      <header className="h-16 px-4 sm:px-8 border-b border-white/15 bg-neutral-950/90 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-serif font-bold text-amber-400 text-sm sm:text-base uppercase tracking-wider">
              Modo Púlpito
            </span>
          </div>

          <div className="hidden sm:block text-xs text-neutral-400 truncate max-w-md">
            {title}
          </div>
        </div>

        {/* Central Live Clock & Preaching Timer */}
        <div className="flex items-center gap-4 bg-neutral-900 px-4 py-1.5 rounded-full border border-neutral-800">
          {/* Real Clock */}
          <div className="flex items-center gap-1.5 text-neutral-400 font-mono text-xs sm:text-sm">
            <Clock className="h-3.5 w-3.5 text-neutral-500" />
            <span>{currentTime}</span>
          </div>

          <div className="h-4 w-px bg-neutral-700" />

          {/* Preaching Stopwatch */}
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">
              {formatTimer(secondsElapsed)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-neutral-400 hover:text-white"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              title={isTimerRunning ? "Pausar Cronômetro" : "Iniciar Cronômetro"}
            >
              {isTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 text-amber-400" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-neutral-400 hover:text-white"
              onClick={() => setSecondsElapsed(0)}
              title="Zerar Cronômetro"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Font Controls & Exit */}
        <div className="flex items-center gap-2">
          {/* Font Size Adjusters */}
          <div className="flex items-center gap-1 bg-neutral-900 rounded-lg p-1 border border-neutral-800">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-bold text-neutral-300 hover:text-white"
              onClick={() => setFontSize((prev) => Math.max(18, prev - 2))}
              title="Diminuir Fonte"
            >
              A-
            </Button>
            <span className="text-xs font-mono text-neutral-400 px-1">{fontSize}px</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-bold text-neutral-300 hover:text-white"
              onClick={() => setFontSize((prev) => Math.min(38, prev + 2))}
              title="Aumentar Fonte"
            >
              A+
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800"
            onClick={onClose}
            title="Sair do Modo Púlpito (Esc)"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Sermon Fullscreen Content */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center border-b border-neutral-800 pb-6 mb-8">
            <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-400 mb-3 tracking-wide">
              {title}
            </h1>
            <p className="text-neutral-500 text-xs sm:text-sm uppercase tracking-widest">
              Esboço Homilético de Exposição Bíblica
            </p>
          </div>

          <SermonContentRenderer
            content={content}
            fontSize={fontSize}
            className="text-neutral-100 selection:bg-amber-500 selection:text-black"
          />
        </div>
      </main>
    </div>
  );
};
