import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";
import { ReadingProgressBar } from "./ReadingProgressBar";
import { AppTourProvider } from "./tour/AppTourProvider";

import bgSpiritualLight from "@/assets/bg-spiritual-light.jpg";
import bgBibleWarm from "@/assets/bg-bible-warm.jpg";
import bibleLandscape from "@/assets/bible-landscape.jpg";
import bibleCross from "@/assets/bible-cross.jpg";

const bgMap: Record<string, string> = {
  "/": bgSpiritualLight,
  "/estudo-biblico": bgBibleWarm,
  "/biblioteca": bibleCross,
  "/gerador-pregacoes": bgSpiritualLight,
  "/devocional": bibleLandscape,
  "/dicionario": bgBibleWarm,
  "/curso-teologia": bgSpiritualLight,
  "/questionarios": bibleCross,
  "/login": bgBibleWarm,
};

export function Layout() {
  const { pathname } = useLocation();
  const bg = bgMap[pathname] || bgSpiritualLight;

  return (
    <AppTourProvider>
      <div className="relative flex min-h-screen flex-col">
        {/* Continuous Reading Progress Indicator on top */}
        <ReadingProgressBar />

        {/* Fixed background image */}
        <div className="fixed inset-0 -z-20">
          <img
            src={bg}
            alt=""
            className="h-full w-full object-cover opacity-90 dark:opacity-40"
            loading="eager"
          />
        </div>

        {/* Golden & Indigo celestial light mesh */}
        <div className="fixed inset-0 -z-[15] pointer-events-none overflow-hidden">
          {/* Central golden radial glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full opacity-35 dark:opacity-45"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 158, 11, 0.25), rgba(79, 70, 229, 0.1) 45%, transparent 70%)",
            }}
          />
          {/* Top-left golden beam */}
          <div
            className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-30 animate-pulse"
            style={{
              background:
                "radial-gradient(circle, rgba(245, 158, 11, 0.35), transparent 65%)",
            }}
          />
          {/* Bottom-right indigo beam */}
          <div
            className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full opacity-25"
            style={{
              background:
                "radial-gradient(circle, rgba(99, 102, 241, 0.25), transparent 60%)",
            }}
          />
        </div>

        {/* Adaptive backdrop readability overlay */}
        <div className="fixed inset-0 -z-10 bg-background/80 dark:bg-[#0B0F17]/85 backdrop-blur-[3px]" />

        <Header />
        <main className="flex-1 pb-16 lg:pb-0">
          <Outlet />
        </main>
        <Footer />
        <BottomNav />
      </div>
    </AppTourProvider>
  );
}

