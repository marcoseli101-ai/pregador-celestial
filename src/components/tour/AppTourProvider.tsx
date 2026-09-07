import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DEPLOY_VERSION,
  FULL_APP_TOUR_STEPS,
  WHATS_NEW_TOUR_STEPS,
} from "@/config/featuresTour";
import { WhatsNewModal } from "./WhatsNewModal";
import { SpotlightTour } from "./SpotlightTour";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, HelpCircle, BookOpen, ScrollText, Lightbulb, X, Check } from "lucide-react";

interface AppTourContextType {
  startFullTour: () => void;
  startWhatsNewTour: () => void;
  openWhatsNewModal: () => void;
  openTourMenu: () => void;
}

const AppTourContext = createContext<AppTourContextType | null>(null);

export function useAppTour() {
  const context = useContext(AppTourContext);
  if (!context) {
    throw new Error("useAppTour must be used within an AppTourProvider");
  }
  return context;
}

export function AppTourProvider({ children }: { children: React.ReactNode }) {
  const [tourMode, setTourMode] = useState<"full" | "whats-new" | null>(null);
  const [whatsNewModalOpen, setWhatsNewModalOpen] = useState(false);
  const [menuDialogOpen, setMenuDialogOpen] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const hasSeenFullTour = localStorage.getItem("app_has_seen_full_tour");
    const lastDeployVersion = localStorage.getItem("app_last_deploy_version");

    const timer = setTimeout(() => {
      if (!hasSeenFullTour) {
        // FLUXO 1: Novo Usuário -> Inicia o Tutorial Geral
        setTourMode("full");
      } else if (lastDeployVersion !== DEPLOY_VERSION) {
        // FLUXO 2: Usuário Antigo -> Abre o Modal com as Novidades de Hoje
        setWhatsNewModalOpen(true);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleCompleteTour = () => {
    if (tourMode === "full") {
      localStorage.setItem("app_has_seen_full_tour", "true");
    }
    localStorage.setItem("app_last_deploy_version", DEPLOY_VERSION);
    setTourMode(null);
  };

  const handleSkipTour = () => {
    if (tourMode === "full") {
      localStorage.setItem("app_has_seen_full_tour", "true");
    }
    localStorage.setItem("app_last_deploy_version", DEPLOY_VERSION);
    setTourMode(null);
  };

  const handleCloseWhatsNewModal = () => {
    localStorage.setItem("app_last_deploy_version", DEPLOY_VERSION);
    setWhatsNewModalOpen(false);
  };

  const startFullTour = () => {
    setWhatsNewModalOpen(false);
    setMenuDialogOpen(false);
    setTourMode("full");
  };

  const startWhatsNewTour = () => {
    setWhatsNewModalOpen(false);
    setMenuDialogOpen(false);
    setTourMode("whats-new");
  };

  const openWhatsNewModal = () => {
    setMenuDialogOpen(false);
    setWhatsNewModalOpen(true);
  };

  const openTourMenu = () => {
    setMenuDialogOpen(true);
  };

  return (
    <AppTourContext.Provider
      value={{
        startFullTour,
        startWhatsNewTour,
        openWhatsNewModal,
        openTourMenu,
      }}
    >
      {children}

      {/* Modal de Novidades (Fluxo 2) */}
      <WhatsNewModal
        open={whatsNewModalOpen}
        onClose={handleCloseWhatsNewModal}
        onStartTour={startWhatsNewTour}
        onStartFullTour={startFullTour}
      />

      {/* Tour Interativo com Foco / Spotlight */}
      <SpotlightTour
        steps={tourMode === "full" ? FULL_APP_TOUR_STEPS : WHATS_NEW_TOUR_STEPS}
        active={tourMode !== null}
        onComplete={handleCompleteTour}
        onSkip={handleSkipTour}
      />

      {/* Menu / Diálogo de Ajuda e Tutoriais (Acessível a qualquer momento) */}
      <Dialog open={menuDialogOpen} onOpenChange={setMenuDialogOpen}>
        <DialogContent className="max-w-md p-6 border-accent/40 shadow-2xl bg-card/95 backdrop-blur-xl">
          <DialogHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-gold text-background shadow">
                <Lightbulb className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold font-serif">
                Central de Tours & Tutoriais
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground">
              Escolha uma opção para conhecer ou rever os recursos do Pregador Pro:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-3">
            <button
              onClick={startWhatsNewTour}
              className="w-full text-left rounded-xl border border-accent/30 bg-accent/10 hover:bg-accent/20 p-4 transition-all space-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-accent flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Novidades do Deploy de Hoje
                </span>
                <span className="text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-bold">
                  Novo
                </span>
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Tour rápido com foco nas 13 versões da Bíblia, ferramentas exegéticas de versículo e novo motor homilético.
              </p>
            </button>

            <button
              onClick={startFullTour}
              className="w-full text-left rounded-xl border border-border bg-muted/40 hover:bg-muted/80 p-4 transition-all space-y-1 group"
            >
              <span className="text-sm font-bold text-foreground flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-accent" /> Tutorial Completo da Plataforma
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Conheça a visão geral de todas as áreas, menus e recursos do sistema.
              </p>
            </button>

            <button
              onClick={openWhatsNewModal}
              className="w-full text-left rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/60 p-3.5 transition-all text-xs text-foreground/90 font-medium flex items-center justify-between"
            >
              <span>📋 Ver lista completa de melhorias em texto</span>
              <span className="text-accent">Abrir &rarr;</span>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Botão Flutuante Discreto para Abrir Tour & Novidades */}
      <div className="fixed bottom-5 right-5 z-40">
        <Button
          onClick={openTourMenu}
          size="sm"
          className="rounded-full shadow-lg bg-card/90 hover:bg-card border border-accent/50 text-foreground text-xs font-semibold px-3 py-2 h-9 backdrop-blur-md gap-1.5 hover:shadow-accent/20 transition-all animate-in fade-in"
          title="Novidades & Tutorial"
        >
          <Lightbulb className="h-4 w-4 text-accent animate-pulse" />
          <span className="hidden sm:inline">Novidades & Tour</span>
        </Button>
      </div>
    </AppTourContext.Provider>
  );
}
