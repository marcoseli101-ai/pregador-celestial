import { useState, useRef, useCallback, useEffect } from "react";
import { X, Play, Pause, Square, Volume2, Gauge, Mic, Loader2, Download } from "lucide-react";
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
  { id: "alloy", label: "🇧🇷 Alloy — Feminina, suave e natural", category: "Feminina" },
  { id: "nova", label: "🇧🇷 Nova — Feminina, clara e expressiva", category: "Feminina" },
  { id: "shimmer", label: "🇧🇷 Shimmer — Feminina, jovem e dinâmica", category: "Feminina" },
  { id: "fable", label: "🇧🇷 Fable — Feminina, calorosa e narrativa", category: "Feminina" },
  { id: "daniel", label: "🇧🇷 Daniel — Masculina, serena e pastoral", category: "Masculina" },
  { id: "echo", label: "🇧🇷 Echo — Masculina, grave e profunda", category: "Masculina" },
  { id: "onyx", label: "🇧🇷 Onyx — Masculina, profissional e firme", category: "Masculina" },
];

export function AudioPlayerModal({ content, open, onClose }: AudioPlayerModalProps) {
  const [selectedVoice, setSelectedVoice] = useState("daniel");
  const [rate, setRate] = useState(1);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
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
      audioBlobRef.current = audioBlob;
      const url = URL.createObjectURL(audioBlob);

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

  const handleDownload = useCallback(() => {
    if (!audioBlobRef.current) {
      toast.error("Gere o áudio primeiro antes de baixar.");
      return;
    }
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audio-pregacao.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download iniciado!");
  }, []);

  if (!open) return null;

  const rateLabel = rate === 1 ? "Normal" : `${rate.toFixed(2)}x`;
  const selectedVoiceInfo = VOICE_OPTIONS.find(v => v.id === selectedVoice);
  const hasAudio = audioBlobRef.current !== null || playState !== "idle";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            Leitor de Áudio
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Mic className="h-4 w-4 text-muted-foreground" />
              Escolha a Voz
            </label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={playState !== "idle"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma voz" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Vozes Femininas</div>
                {VOICE_OPTIONS.filter(v => v.category === "Feminina").map(v => (
                  <SelectItem key={v.id} value={v.id} className="text-sm">
                    {v.label}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-1">Vozes Masculinas</div>
                {VOICE_OPTIONS.filter(v => v.category === "Masculina").map(v => (
                  <SelectItem key={v.id} value={v.id} className="text-sm">
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVoiceInfo && (
              <p className="text-xs text-muted-foreground italic">
                {selectedVoiceInfo.label.split(" — ")[1]}
              </p>
            )}
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
              <span>Lenta</span>
              <span>Normal</span>
              <span>Rápida</span>
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
          <div className="flex items-center justify-center gap-3 flex-wrap">
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
            {hasAudio && (
              <Button variant="secondary" size="lg" onClick={handleDownload} className="gap-2 min-w-[120px]">
                <Download className="h-5 w-5" />
                Baixar MP3
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
