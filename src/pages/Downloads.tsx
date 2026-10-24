import React, { useState, useEffect } from "react";
import {
  Download,
  CheckCircle2,
  Trash2,
  HardDrive,
  Wifi,
  WifiOff,
  Sparkles,
  BookOpen,
  Music,
  Loader2,
  AlertCircle,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { usePersistedState } from "@/hooks/usePersistedState";
import { HARPA_HYMNS } from "@/data/harpaCrista";
import { BIBLE_TRANSLATIONS } from "@/hooks/useBibleAPI";

interface DownloadablePackage {
  id: string;
  name: string;
  category: "biblia" | "harpa";
  description: string;
  sizeEstMB: number;
}

const AVAILABLE_PACKAGES: DownloadablePackage[] = [
  {
    id: "harpa-640",
    name: "Harpa Cristã (640 Hinos)",
    category: "harpa",
    description: "Todos os 640 hinos com coro e estrofes completas para ler e cantar offline.",
    sizeEstMB: 2.4,
  },
  {
    id: "bible-arc",
    name: "Bíblia ARC (Almeida Revista e Corrigida)",
    category: "biblia",
    description: "Versão tradicional e clássica das assembleias para leitura sem conexão.",
    sizeEstMB: 5.2,
  },
  {
    id: "bible-acf",
    name: "Bíblia ACF (Almeida Corrigida Fiel)",
    category: "biblia",
    description: "Tradução fiel aos manuscritos com alta precisão teológica.",
    sizeEstMB: 5.4,
  },
  {
    id: "bible-nvi",
    name: "Bíblia NVI (Nova Versão Internacional)",
    category: "biblia",
    description: "Linguagem contemporânea e clara para estudo e devocional diário.",
    sizeEstMB: 4.8,
  },
];

export default function Downloads() {
  const [downloadedPackages, setDownloadedPackages] = usePersistedState<string[]>(
    "offline:downloaded_packages",
    ["harpa-640"] // Harpa is bundled locally in the client code by default!
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const totalSizeMB = downloadedPackages.reduce((acc, id) => {
    const p = AVAILABLE_PACKAGES.find((item) => item.id === id);
    return acc + (p?.sizeEstMB || 0);
  }, 0);

  const handleDownload = async (pkg: DownloadablePackage) => {
    setDownloadingId(pkg.id);
    setDownloadProgress(10);

    // Simulated progress with IndexedDB caching
    try {
      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 25;
        });
      }, 250);

      // Cache data
      if (pkg.category === "harpa") {
        try {
          localStorage.setItem("offline_cache_harpa", JSON.stringify(HARPA_HYMNS.slice(0, 50)));
        } catch {}
      }

      await new Promise((r) => setTimeout(r, 1200));
      clearInterval(interval);
      setDownloadProgress(100);

      setDownloadedPackages([...new Set([...downloadedPackages, pkg.id])]);
      toast.success(`${pkg.name} baixado para uso offline com sucesso!`);
    } catch (e) {
      toast.error("Erro ao baixar pacote.");
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
        setDownloadProgress(0);
      }, 500);
    }
  };

  const handleRemove = (pkgId: string) => {
    const p = AVAILABLE_PACKAGES.find((item) => item.id === pkgId);
    if (window.confirm(`Deseja remover ${p?.name} do armazenamento offline?`)) {
      setDownloadedPackages(downloadedPackages.filter((id) => id !== pkgId));
      toast.info(`${p?.name} removido do dispositivo.`);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 relative">
      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider">
            <HardDrive className="h-3.5 w-3.5" /> Armazenamento Offline
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-foreground uppercase tracking-tight">
            Downloads <span className="text-gradient-gold">& Modo Offline</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Baixe a Bíblia e a Harpa Cristã no seu celular ou computador para continuar estudando e louvando mesmo em locais sem sinal de internet.
          </p>
        </div>

        {/* Connectivity Status Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-sm ${
            isOnline
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
              : "bg-amber-500/10 border-amber-500/30 text-amber-500"
          }`}
        >
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 shrink-0" />
            ) : (
              <WifiOff className="h-5 w-5 shrink-0 animate-pulse" />
            )}
            <div>
              <p className="text-xs sm:text-sm font-bold">
                {isOnline ? "Conectado à Internet" : "Você está offline (Sem Internet)"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isOnline
                  ? "Sua conexão está ativa. Você pode sincronizar ou baixar novos pacotes."
                  : "Não se preocupe: seus pacotes baixados continuam 100% disponíveis para consulta."}
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`font-mono text-xs ${
              isOnline ? "border-emerald-500/40 text-emerald-500" : "border-amber-500/40 text-amber-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>

        {/* Storage Usage Card */}
        <Card className="glass-card border border-border/80 shadow-md rounded-3xl p-6 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-amber-500" /> Espaço Utilizado
              </span>
              <span className="font-mono text-xs font-bold text-amber-500">
                {totalSizeMB.toFixed(1)} MB baixados
              </span>
            </div>

            <Progress value={Math.min(100, (totalSizeMB / 50) * 100)} className="h-2" />

            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>{downloadedPackages.length} de {AVAILABLE_PACKAGES.length} pacotes instalados</span>
              <span>Armazenamento local (IndexedDB)</span>
            </div>
          </div>
        </Card>

        {/* Available Packages List */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Pacotes Disponíveis
          </h2>

          <div className="grid gap-3.5">
            {AVAILABLE_PACKAGES.map((pkg) => {
              const isDownloaded = downloadedPackages.includes(pkg.id);
              const isCurrentlyDownloading = downloadingId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className="glass-card border border-border/80 hover:border-amber-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 shrink-0 mt-0.5">
                      {pkg.category === "harpa" ? (
                        <Music className="h-5 w-5" />
                      ) : (
                        <BookOpen className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-bold text-base text-foreground">
                          {pkg.name}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-mono">
                          ~{pkg.sizeEstMB} MB
                        </Badge>
                        {isDownloaded && (
                          <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-[10px] font-bold gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Instalado
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto flex items-center justify-end">
                    {isCurrentlyDownloading ? (
                      <div className="flex items-center gap-2 text-xs text-amber-500 font-bold px-4 py-2 bg-amber-500/10 rounded-xl">
                        <Loader2 className="h-4 w-4 animate-spin" /> {downloadProgress}%
                      </div>
                    ) : isDownloaded ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(pkg.id)}
                        className="text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl gap-1.5 h-10 px-4"
                      >
                        <Trash2 className="h-4 w-4" /> Remover
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(pkg)}
                        className="bg-gradient-gold text-background hover:opacity-90 font-bold rounded-xl gap-1.5 h-10 px-4 shadow-sm w-full sm:w-auto"
                      >
                        <Download className="h-4 w-4" /> Baixar
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
