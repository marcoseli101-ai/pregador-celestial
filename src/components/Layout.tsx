import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

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
    <div className="relative flex min-h-screen flex-col">
      {/* Fixed background image */}
      <div className="fixed inset-0 -z-20">
        <img
          src={bg}
          alt=""
          className="h-full w-full object-cover"
          loading="eager"
        />
      </div>
      {/* Overlay for readability */}
      <div className="fixed inset-0 -z-10 bg-background/75 backdrop-blur-sm" />

      {/* Golden light effects */}
      <div className="fixed inset-0 -z-[5] pointer-events-none overflow-hidden">
        {/* Central golden radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full opacity-30"
          style={{ background: 'radial-gradient(ellipse at center, hsl(42 60% 55% / 0.5), hsl(42 50% 45% / 0.25) 40%, transparent 70%)' }}
        />
        {/* Top-left golden beam */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full opacity-25 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, hsl(42 55% 60% / 0.6), hsl(42 50% 50% / 0.2) 50%, transparent 70%)' }}
        />
        {/* Bottom-right golden beam */}
        <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, hsl(42 55% 55% / 0.5), hsl(42 45% 50% / 0.15) 50%, transparent 70%)' }}
        />
        {/* Top-right accent */}
        <div className="absolute -top-10 -right-10 w-[400px] h-[400px] rounded-full opacity-15 animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, hsl(38 60% 60% / 0.5), transparent 60%)', animationDelay: '1.5s' }}
        />
        {/* Full-page golden wash */}
        <div className="absolute inset-0 opacity-10"
          style={{ background: 'linear-gradient(170deg, hsl(42 55% 60% / 0.3), hsl(42 50% 50% / 0.15) 50%, hsl(42 45% 55% / 0.2))' }}
        />
      </div>

      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
