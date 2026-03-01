import { useState, useEffect, useRef, useCallback } from "react";
import { X, Play, Pause, Square, Volume2, Gauge, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AudioPlayerModalProps {
  content: string;
  open: boolean;
  onClose: () => void;
}

type PlayState = "idle" | "playing" | "paused";

export function AudioPlayerModal({ content, open, onClose }: AudioPlayerModalProps) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [playState, setPlayState] = useState<PlayState>("idle");
  const [progress, setProgress] = useState(0);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const chunksRef = useRef<string[]>([]);
  const currentChunkRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const getSynth = useCallback(() => {
    if (!synthRef.current && typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return synthRef.current;
  }, []);

  // Load voices
  useEffect(() => {
    const synth = getSynth();
    if (!synth) return;

    const loadVoices = () => {
      const v = synth.getVoices();
      const ptVoices = v.filter(voice => voice.lang.startsWith("pt"));
      const allVoices = ptVoices.length > 0 ? ptVoices : v;
      setVoices(allVoices);
      if (allVoices.length > 0 && !selectedVoiceURI) {
        setSelectedVoiceURI(allVoices[0].voiceURI);
      }
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);
    return () => synth.removeEventListener("voiceschanged", loadVoices);
  }, [getSynth, selectedVoiceURI]);

  // Clean up on close
  useEffect(() => {
    if (!open) {
      handleStop();
    }
  }, [open]);

  // Progress tracker
  useEffect(() => {
    if (playState === "playing") {
      intervalRef.current = setInterval(() => {
        const total = chunksRef.current.length;
        if (total > 0) {
          setProgress(Math.round((currentChunkRef.current / total) * 100));
        }
      }, 300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playState]);

  const cleanText = (text: string) => text.replace(/[#*_]/g, "").trim();

  const splitIntoChunks = (text: string): string[] => {
    const chunks: string[] = [];
    let remaining = text;
    while (remaining.length > 0) {
      if (remaining.length <= 200) {
        chunks.push(remaining);
        break;
      }
      let splitAt = remaining.lastIndexOf(".", 200);
      if (splitAt === -1 || splitAt < 50) splitAt = remaining.lastIndexOf(" ", 200);
      if (splitAt === -1) splitAt = 200;
      chunks.push(remaining.slice(0, splitAt + 1));
      remaining = remaining.slice(splitAt + 1).trim();
    }
    return chunks;
  };

  const speakFrom = useCallback((chunkIndex: number) => {
    const synth = getSynth();
    if (!synth) return;

    const chunks = chunksRef.current;
    if (chunkIndex >= chunks.length) {
      setPlayState("idle");
      setProgress(100);
      return;
    }

    const voice = voices.find(v => v.voiceURI === selectedVoiceURI) || voices[0];
    const utterance = new SpeechSynthesisUtterance(chunks[chunkIndex]);
    utterance.lang = "pt-BR";
    utterance.rate = rate;
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      currentChunkRef.current = chunkIndex + 1;
      speakFrom(chunkIndex + 1);
    };
    utterance.onerror = () => {
      setPlayState("idle");
    };

    synth.speak(utterance);
  }, [getSynth, voices, selectedVoiceURI, rate]);

  const handlePlay = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;

    if (playState === "paused") {
      synth.resume();
      setPlayState("playing");
      return;
    }

    // Start fresh
    synth.cancel();
    const clean = cleanText(content);
    const chunks = splitIntoChunks(clean);
    chunksRef.current = chunks;
    currentChunkRef.current = 0;
    setProgress(0);
    setPlayState("playing");
    speakFrom(0);
  }, [getSynth, content, playState, speakFrom]);

  const handlePause = useCallback(() => {
    const synth = getSynth();
    if (!synth) return;
    synth.pause();
    setPlayState("paused");
  }, [getSynth]);

  const handleStop = useCallback(() => {
    const synth = getSynth();
    if (synth) synth.cancel();
    setPlayState("idle");
    setProgress(0);
    currentChunkRef.current = 0;
  }, [getSynth]);

  if (!open) return null;

  const rateLabel = rate === 1 ? "Normal" : `${rate.toFixed(2)}x`;

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

        <div className="p-6 space-y-6">
          {/* Voice Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Mic className="h-4 w-4 text-muted-foreground" />
              Voz
            </label>
            <Select value={selectedVoiceURI} onValueChange={setSelectedVoiceURI} disabled={playState !== "idle"}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma voz" />
              </SelectTrigger>
              <SelectContent>
                {voices.map(v => (
                  <SelectItem key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
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
              min={0.5}
              max={2}
              step={0.05}
              disabled={playState !== "idle"}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.5x</span>
              <span>1x</span>
              <span>2x</span>
            </div>
          </div>

          {/* Progress Bar */}
          {playState !== "idle" && (
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
            {playState === "playing" ? (
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
            {playState !== "idle" && (
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
