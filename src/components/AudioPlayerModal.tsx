import { useState, useRef, useCallback, useEffect } from "react";
import { X, Play, Pause, Square, Volume2, Gauge, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AudioPlayerModalProps {
  content: string;
  open: boolean;
  onClose: () => void;
}

type PlayState = "idle" | "playing" | "paused" | "loading";

const VOICE_OPTIONS = [
  { id: "sarah", label: "Sarah (Feminina)" },
  { id: "laura", label: "Laura (Feminina)" },
  { id: "alice", label: "Alice (Feminina)" },
  { id: "jessica", label: "Jessica (Feminina)" },
  { id: "lily", label: "Lily (Feminina)" },
  { id: "matilda", label: "Matilda (Feminina)" },
  { id: "roger", label: "Roger (Masculina)" },
  { id: "george", label: "George (Masculina)" },
  { id: "charlie", label: "Charlie (Masculina)" },
  { id: "daniel", label: "Daniel (Masculina)" },
  { id: "liam", label: "Liam (Masculina)" },
  { id: "brian", label: "Brian (Masculina)" },
];

export function AudioPlayerModal({ content, open, onClose }: AudioPlayerModalProps) {
  const [selectedVoice, setSelectedVoice] = useState("sarah");
  const [rate, setRate] = useState(1);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      handleStop();
    }
  }, [open]);

  const cleanText = (text: string) => text.replace(/[#*_]/g, "").trim();

  const handlePlay = useCallback(async () => {
    if (playState === "paused" && audioRef.current) {
      audioRef.current.play();
      setPlayState("playing");
      startProgressTracking();
      return;
    }

    setPlayState("loading");

    try {
      const cleanedText = cleanText(content);

      // Use fetch directly for binary audio response
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text: cleanedText, voice: selectedVoice, speed: rate }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || `Request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);

      // Stop previous audio
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onended = () => {
        setPlayState("idle");
        setProgress(100);
        stopProgressTracking();
      };

      audio.onerror = () => {
        setPlayState("idle");
        toast.error("Erro ao reproduzir áudio");
        stopProgressTracking();
      };

      await audio.play();
      setPlayState("playing");
      startProgressTracking();
    } catch (err) {
      console.error("TTS error:", err);
      setPlayState("idle");
      toast.error("Erro ao gerar áudio. Verifique sua conexão.");
    }
  }, [content, playState, selectedVoice, rate]);

  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        const pct = Math.round((audioRef.current.currentTime / audioRef.current.duration) * 100);
        setProgress(pct);
      }
    }, 200);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const handlePause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayState("paused");
      stopProgressTracking();
    }
  }, []);

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setPlayState("idle");
    setProgress(0);
    stopProgressTracking();
  }, []);

  if (!open) return null;

  const rateLabel = rate === 1 ? "Normal" : `${rate.toFixed(2)}x`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Leitor de Áudio (ElevenLabs)
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Mic className="h-4 w-4 text-muted-foreground" />
              Voz
            </label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={playState !== "idle"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma voz" />
              </SelectTrigger>
              <SelectContent>
                {VOICE_OPTIONS.map(v => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              Velocidade: <span className="text-primary font-semibold">{rateLabel}</span>
            </label>
            <Slider
              value={[rate]}
              onValueChange={([v]) => setRate(v)}
              min={0.7}
              max={1.2}
              step={0.05}
              disabled={playState !== "idle"}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.7x</span>
              <span>1x</span>
              <span>1.2x</span>
            </div>
          </div>

          {/* Progress Bar */}
          {(playState !== "idle" && playState !== "loading") && (
            <div className="space-y-1">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">{progress}% concluído</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {playState === "loading" ? (
              <Button variant="default" size="lg" disabled className="gap-2 min-w-[120px]">
                <Loader2 className="h-5 w-5 animate-spin" />
                Gerando...
              </Button>
            ) : playState === "playing" ? (
              <Button variant="outline" size="lg" onClick={handlePause} className="gap-2 min-w-[120px]">
                <Pause className="h-5 w-5" />
                Pausar
              </Button>
            ) : (
              <Button variant="default" size="lg" onClick={handlePlay} className="gap-2 min-w-[120px]">
                <Play className="h-5 w-5" />
                {playState === "paused" ? "Retomar" : "Ouvir"}
              </Button>
            )}
            {(playState === "playing" || playState === "paused") && (
              <Button variant="destructive" size="lg" onClick={handleStop} className="gap-2 min-w-[120px]">
                <Square className="h-5 w-5" />
                Parar
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
