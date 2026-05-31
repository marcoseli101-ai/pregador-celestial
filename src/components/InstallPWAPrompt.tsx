import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_DAYS = 7;

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as any).standalone === true
  );
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasRecentlyDismissed() {
  try {
    const ts = localStorage.getItem(DISMISS_KEY);
    if (!ts) return false;
    const elapsed = Date.now() - Number(ts);
    return elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function InstallPWAPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasRecentlyDismissed()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installed = () => {
      setShow(false);
      setShowIOS(false);
      setDeferred(null);
    };
    window.addEventListener("appinstalled", installed);

    // iOS fallback (não dispara beforeinstallprompt)
    if (isIOS() && !isStandalone()) {
      const t = setTimeout(() => setShowIOS(true), 3000);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", handler);
        window.removeEventListener("appinstalled", installed);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
    setShow(false);
    setShowIOS(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
  };

  if (!show && !showIOS) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-xl border border-border bg-background/95 p-3 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-4 sm:mx-0">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-gold">
          <Download className="h-5 w-5 text-background" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            Instalar o Pregador Pro no seu celular
          </p>
          {showIOS ? (
            <p className="mt-1 text-xs text-muted-foreground">
              No Safari, toque em <Share className="inline h-3 w-3" /> Compartilhar e depois em{" "}
              <span className="font-medium">"Adicionar à Tela de Início"</span>.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Acesse rapidamente seus estudos e sermões direto da tela inicial.
            </p>
          )}
          {!showIOS && (
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                className="bg-gradient-gold text-background hover:opacity-90"
                onClick={install}
              >
                Instalar
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                Agora não
              </Button>
            </div>
          )}
        </div>
        <button
          aria-label="Fechar"
          onClick={dismiss}
          className="rounded-md p-1 text-muted-foreground hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}