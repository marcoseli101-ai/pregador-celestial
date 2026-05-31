import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Registro do Service Worker (PWA)
// Evita registrar dentro do preview da Lovable / iframes para não cachear builds em desenvolvimento.
const isInIframe = (() => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost =
  typeof window !== "undefined" &&
  (window.location.hostname.includes("lovableproject.com") ||
    window.location.hostname.includes("lovable.app") &&
      window.location.hostname.includes("id-preview"));

if ("serviceWorker" in navigator) {
  if (isInIframe || isPreviewHost) {
    // Limpa qualquer SW previamente registrado neste contexto
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
  } else if (import.meta.env.PROD) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* falha silenciosa */
      });
    });
  }
}
