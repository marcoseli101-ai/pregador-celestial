import { useState, useRef, useCallback, useEffect } from "react";
import { X, Play, Pause, Square, Volume2, Loader2, Download, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AudioPlayerModalProps {
  content: string;
  open: boolean;
  onClose: () => void;
}

type PlayState = "idle" | "playing" | "paused" | "loading";

export function AudioPlayerModal({ content, open, onClose }: AudioPlayerModalProps) {
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const [minimized, setMinimized] = useState(false);
  const [useBrowserFallback, setUseBrowserFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!open) {
      handleStop();
      setMinimized(false);
    }
  }, [open]);

  const cleanText = (text: string) => text.replace(/[#*_`]/g, "").replace(/\n{2,}/g, ". ").trim();

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(Math.round((audioRef.current.currentTime / audioRef.current.duration) * 100));
      }
    }, 200);
  };

  const playWithBrowser = useCallback((text: string) => {
    return new Promise<void>((resolve, reject) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.lang = "pt-BR";
      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find(v => v.lang.startsWith("pt"));
      if (ptVoice) utterance.voice = ptVoice;
      utteranceRef.current = utterance;

      utterance.onend = () => { setPlayState("idle"); setProgress(100); stopProgressTracking(); resolve(); };
      utterance.onerror = (e) => { if (e.error !== "canceled") reject(new Error(e.error)); };

      const estimatedDuration = text.length / 15;
      const startTime = Date.now();
      stopProgressTracking();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setProgress(Math.min(99, Math.round((elapsed / estimatedDuration) * 100)));
      }, 300);

      window.speechSynthesis.speak(utterance);
    });
  }, []);

  const playWithMultiVozes = useCallback(async (text: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text, voice: "alloy" }),
      }
    );

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      if (errorData?.fallback) {
        toast.info("Serviço de voz indisponível. Usando voz do navegador.");
        setUseBrowserFallback(true);
        await playWithBrowser(text);
        return;
      }
      throw new Error(errorData?.error || "Erro desconhecido do serviço de voz");
    }

    if (!response.ok) throw new Error(`TTS error: ${response.status}`);

    const audioBlob = await response.blob();
    audioBlobRef.current = audioBlob;
    const url = URL.createObjectURL(audioBlob);

    if (audioRef.current) {
      audioRef.current.pause();
      URL.revokeObjectURL(audioRef.current.src);
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => { setPlayState("idle"); setProgress(100); stopProgressTracking(); };
    audio.onerror = () => { setPlayState("idle"); toast.error("Erro ao reproduzir áudio"); stopProgressTracking(); };
    await audio.play();
    startProgressTracking();
  }, [playWithBrowser]);

  const handlePlay = useCallback(async () => {
    if (playState === "paused") {
      if (useBrowserFallback) { window.speechSynthesis.resume(); setPlayState("playing"); return; }
      if (audioRef.current) { audioRef.current.play(); setPlayState("playing"); startProgressTracking(); return; }
    }

    setPlayState("loading");
    try {
      const cleanedText = cleanText(content);
      await playWithMultiVozes(cleanedText);
      setPlayState("playing");
    } catch (err) {
      console.error("TTS error:", err);
      toast.info("Usando voz do navegador como alternativa.");
      setUseBrowserFallback(true);
      try {
        setPlayState("playing");
        await playWithBrowser(cleanText(content));
      } catch {
        setPlayState("idle");
        toast.error("Erro ao gerar áudio.");
      }
    }
  }, [content, playState, useBrowserFallback, playWithBrowser, playWithMultiVozes]);

  const handlePause = useCallback(() => {
    if (useBrowserFallback) window.speechSynthesis.pause();
    else if (audioRef.current) { audioRef.current.pause(); stopProgressTracking(); }
    setPlayState("paused");
  }, [useBrowserFallback]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      URL.revokeObjectURL(audioRef.current.src);
      audioRef.current = null;
    }
    setPlayState("idle");
    setProgress(0);
    setUseBrowserFallback(false);
    stopProgressTracking();
  }, []);

  const handleDownload = useCallback(() => {
    if (useBrowserFallback) { toast.info("Download não disponível para voz do navegador."); return; }
    if (!audioBlobRef.current) { toast.error("Gere o áudio primeiro."); return; }
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio-pregacao.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download iniciado!");
  }, [useBrowserFallback]);

  if (!open) return null;

  const hasAudio = !useBrowserFallback && (audioBlobRef.current !== null || playState !== "idle");
  const isActive = playState === "playing" || playState === "paused" || playState === "loading";

  // Minimized floating player
  if (minimized) {
    return (
      <div className="fixed bottom-4 right-4 z-[100] flex items-center gap-2 bg-card border border-border rounded-full shadow-2xl px-4 py-2 min-w-[220px]">
        <Volume2 className="h-4 w-4 text-primary shrink-0" />
        {/* Mini progress */}
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        {/* Controls */}
        {playState === "loading" ? (
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
        ) : playState === "playing" ? (
          <button onClick={handlePause} className="text-foreground hover:text-primary transition-colors">
            <Pause className="h-4 w-4" />
          </button>
        ) : (
          <button onClick={handlePlay} className="text-foreground hover:text-primary transition-colors">
            <Play className="h-4 w-4" />
          </button>
        )}
        {isActive && (
          <button onClick={handleStop} className="text-destructive hover:text-destructive/80 transition-colors">
            <Square className="h-4 w-4" />
          </button>
        )}
        <button onClick={() => setMinimized(false)} className="text-muted-foreground hover:text-foreground transition-colors">
          <Maximize2 className="h-4 w-4" />
        </button>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Full modal
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" /> Leitor de Áudio
          </h2>
          <div className="flex items-center gap-1">
            {isActive && (
              <button onClick={() => setMinimized(true)} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Minimizar">
                <Minimize2 className="h-4 w-4" />
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <p className="text-sm text-muted-foreground text-center">
            {useBrowserFallback
              ? "🖥️ Usando voz do navegador"
              : "🎙️ MultiVozes AI — Voz natural de alta qualidade"}
          </p>

          {/* Progress */}
          {(playState !== "idle" && playState !== "loading") && (
            <div className="space-y-1">
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground text-center">{progress}% concluído</p>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {playState === "loading" ? (
              <Button variant="default" size="lg" disabled className="gap-2 min-w-[120px]">
                <Loader2 className="h-5 w-5 animate-spin" /> Gerando...
              </Button>
            ) : playState === "playing" ? (
              <Button variant="outline" size="lg" onClick={handlePause} className="gap-2 min-w-[120px]">
                <Pause className="h-5 w-5" /> Pausar
              </Button>
            ) : (
              <Button variant="default" size="lg" onClick={handlePlay} className="gap-2 min-w-[120px]">
                <Play className="h-5 w-5" /> {playState === "paused" ? "Retomar" : "Ouvir"}
              </Button>
            )}
            {(playState === "playing" || playState === "paused") && (
              <Button variant="destructive" size="lg" onClick={handleStop} className="gap-2 min-w-[120px]">
                <Square className="h-5 w-5" /> Parar
              </Button>
            )}
            {hasAudio && (
              <Button variant="secondary" size="lg" onClick={handleDownload} className="gap-2 min-w-[120px]">
                <Download className="h-5 w-5" /> Baixar MP3
              </Button>
            )}
          </div>

          {isActive && (
            <p className="text-xs text-center text-muted-foreground">
              💡 Clique em <Minimize2 className="h-3 w-3 inline" /> para minimizar e acompanhar o texto
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
