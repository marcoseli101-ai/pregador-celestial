import { useState, useRef, useCallback, useEffect } from "react";
import { X, Play, Pause, Square, Volume2, Mic, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface AudioPlayerModalProps {
  content: string;
  open: boolean;
  onClose: () => void;
}

type PlayState = "idle" | "playing" | "paused" | "loading";
type TTSEngine = "multivozes" | "browser";

const MULTIVOZES_VOICES = [
  { id: "alloy", label: "🎙️ Alloy — Voz padrão, natural", category: "Padrão" },
];

const BROWSER_VOICES = [
  { id: "browser-female", label: "🖥️ Voz Feminina — Padrão do sistema", category: "Feminina" },
  { id: "browser-male", label: "🖥️ Voz Masculina — Padrão do sistema", category: "Masculina" },
];

export function AudioPlayerModal({ content, open, onClose }: AudioPlayerModalProps) {
  const [engine, setEngine] = useState<TTSEngine>("multivozes");
  const [selectedVoice, setSelectedVoice] = useState("alloy");
  const [rate, setRate] = useState(1);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobRef = useRef<Blob | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!open) handleStop();
  }, [open]);

  useEffect(() => {
    setSelectedVoice(engine === "multivozes" ? "alloy" : "browser-male");
  }, [engine]);

  const voiceOptions = engine === "multivozes" ? MULTIVOZES_VOICES : BROWSER_VOICES;
  const cleanText = (text: string) => text.replace(/[#*_`]/g, "").replace(/\n{2,}/g, ". ").trim();

  const getBrowserVoice = (voiceId: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    const isFemale = voiceId.includes("female");
    const ptVoices = voices.filter(v => v.lang.startsWith("pt"));
    if (ptVoices.length > 0) return isFemale ? ptVoices[0] : ptVoices[Math.min(1, ptVoices.length - 1)];
    return voices.length > 0 ? voices[isFemale ? 0 : Math.min(1, voices.length - 1)] : null;
  };

  const playWithBrowser = useCallback((text: string) => {
    return new Promise<void>((resolve, reject) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = "pt-BR";
      const voice = getBrowserVoice(selectedVoice);
      if (voice) utterance.voice = voice;
      utteranceRef.current = utterance;

      utterance.onend = () => { setPlayState("idle"); setProgress(100); stopProgressTracking(); resolve(); };
      utterance.onerror = (e) => { if (e.error !== "canceled") reject(new Error(e.error)); };

      const estimatedDuration = (text.length / 15) / rate;
      const startTime = Date.now();
      stopProgressTracking();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        setProgress(Math.min(99, Math.round((elapsed / estimatedDuration) * 100)));
      }, 300);

      window.speechSynthesis.speak(utterance);
    });
  }, [rate, selectedVoice]);

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
        body: JSON.stringify({ text, voice: selectedVoice }),
      }
    );

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      if (errorData?.fallback) {
        console.warn("MultiVozes TTS fallback triggered, switching to browser TTS");
        toast.info("Serviço de voz indisponível. Usando voz do navegador.");
        setEngine("browser");
        setSelectedVoice("browser-male");
        await playWithBrowser(text);
        return;
      }
      throw new Error(errorData?.error || "Erro desconhecido do serviço de voz");
    }

    if (!response.ok) {
      throw new Error(`TTS error: ${response.status}`);
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

    audio.onended = () => { setPlayState("idle"); setProgress(100); stopProgressTracking(); };
    audio.onerror = () => { setPlayState("idle"); toast.error("Erro ao reproduzir áudio"); stopProgressTracking(); };

    await audio.play();
    startProgressTracking();
  }, [selectedVoice, rate, playWithBrowser]);

  const handlePlay = useCallback(async () => {
    if (playState === "paused") {
      if (engine === "browser") { window.speechSynthesis.resume(); setPlayState("playing"); return; }
      if (audioRef.current) { audioRef.current.play(); setPlayState("playing"); startProgressTracking(); return; }
    }

    setPlayState("loading");
    try {
      const cleanedText = cleanText(content);
      if (engine === "browser") {
        setPlayState("playing");
        await playWithBrowser(cleanedText);
      } else {
        await playWithMultiVozes(cleanedText);
        setPlayState("playing");
      }
    } catch (err) {
      console.error("TTS error:", err);
      setPlayState("idle");
      toast.error(engine === "multivozes"
        ? "Erro no serviço de voz. Tente o motor 'Navegador'."
        : "Erro ao gerar áudio.");
    }
  }, [content, playState, engine, playWithBrowser, playWithMultiVozes]);

  const startProgressTracking = () => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (audioRef.current && audioRef.current.duration) {
        setProgress(Math.round((audioRef.current.currentTime / audioRef.current.duration) * 100));
      }
    }, 200);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) { clearInterval(progressIntervalRef.current); progressIntervalRef.current = null; }
  };

  const handlePause = useCallback(() => {
    if (engine === "browser") window.speechSynthesis.pause();
    else if (audioRef.current) { audioRef.current.pause(); stopProgressTracking(); }
    setPlayState("paused");
  }, [engine]);

  const handleStop = useCallback(() => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; URL.revokeObjectURL(audioRef.current.src); audioRef.current = null; }
    setPlayState("idle");
    setProgress(0);
    stopProgressTracking();
  }, []);

  const handleDownload = useCallback(() => {
    if (engine === "browser") { toast.info("Download não disponível para o motor Navegador. Use MultiVozes."); return; }
    if (!audioBlobRef.current) { toast.error("Gere o áudio primeiro antes de baixar."); return; }
    const url = URL.createObjectURL(audioBlobRef.current);
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio-pregacao.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Download iniciado!");
  }, [engine]);

  if (!open) return null;

  const selectedVoiceInfo = voiceOptions.find(v => v.id === selectedVoice);
  const hasAudio = engine === "multivozes" && (audioBlobRef.current !== null || playState !== "idle");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" /> Leitor de Áudio
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Engine */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Motor de Áudio</label>
            <div className="flex gap-2">
              <Button variant={engine === "multivozes" ? "default" : "outline"} size="sm" onClick={() => { if (playState === "idle") setEngine("multivozes"); }} disabled={playState !== "idle"} className="flex-1">
                🎙️ MultiVozes AI
              </Button>
              <Button variant={engine === "browser" ? "default" : "outline"} size="sm" onClick={() => { if (playState === "idle") setEngine("browser"); }} disabled={playState !== "idle"} className="flex-1">
                🖥️ Navegador
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {engine === "multivozes" ? "Voz de alta qualidade via MultiVozes AI com download." : "Gratuito e offline. Usa as vozes do seu dispositivo."}
            </p>
          </div>

          {/* Voice */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Mic className="h-4 w-4 text-muted-foreground" /> Escolha a Voz
            </label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={playState !== "idle"}>
              <SelectTrigger className="w-full"><SelectValue placeholder="Selecione uma voz" /></SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {voiceOptions.map(v => (
                  <SelectItem key={v.id} value={v.id} className="text-sm">{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedVoiceInfo && <p className="text-xs text-muted-foreground italic">{selectedVoiceInfo.label.split(" — ")[1]}</p>}
          </div>

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
              <Button variant="default" size="lg" disabled className="gap-2 min-w-[120px]"><Loader2 className="h-5 w-5 animate-spin" /> Gerando...</Button>
            ) : playState === "playing" ? (
              <Button variant="outline" size="lg" onClick={handlePause} className="gap-2 min-w-[120px]"><Pause className="h-5 w-5" /> Pausar</Button>
            ) : (
              <Button variant="default" size="lg" onClick={handlePlay} className="gap-2 min-w-[120px]"><Play className="h-5 w-5" /> {playState === "paused" ? "Retomar" : "Ouvir"}</Button>
            )}
            {(playState === "playing" || playState === "paused") && (
              <Button variant="destructive" size="lg" onClick={handleStop} className="gap-2 min-w-[120px]"><Square className="h-5 w-5" /> Parar</Button>
            )}
            {hasAudio && (
              <Button variant="secondary" size="lg" onClick={handleDownload} className="gap-2 min-w-[120px]"><Download className="h-5 w-5" /> Baixar MP3</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
