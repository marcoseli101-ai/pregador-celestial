import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  Sparkles,
  Calendar,
  Menu,
  FileText,
  GraduationCap,
  Languages,
  HelpCircle,
  BookMarked,
  StickyNote,
  Bookmark,
  ShieldCheck,
  Sun,
  Moon,
  LogOut,
  X,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAppTour } from "@/components/tour/AppTourProvider";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { openLogin } = useLoginPrompt();
  const { isAdmin } = useAdminCheck();
  const { openTourMenu } = useAppTour();

  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  const navItems = [
    { label: "Início", path: "/", icon: Home },
    { label: "Bíblia", path: "/estudo-biblico", icon: BookOpen },
    { label: "Esboços", path: "/gerador-pregacoes", icon: Sparkles },
    { label: "Devocional", path: "/devocional", icon: Calendar },
  ];

  const drawerSections = [
    {
      title: "Estudo Bíblico",
      items: [
        { label: "Bíblia Sagrada", path: "/estudo-biblico", icon: BookOpen },
        { label: "Plano de Leitura Anual", path: "/plano-leitura", icon: BookMarked },
        { label: "Dicionário Hebraico/Grego", path: "/dicionario", icon: Languages },
        { label: "Marcadores de Versículos", path: "/marcadores", icon: Bookmark },
      ],
    },
    {
      title: "Pregação",
      items: [
        { label: "Gerador de Esboços", path: "/gerador-pregacoes", icon: Sparkles },
        { label: "Biblioteca de Mensagens", path: "/biblioteca", icon: FileText },
        { label: "Área do Pregador", path: "/area-pregador", icon: GraduationCap },
        { label: "Notas Pessoais", path: "/notas", icon: StickyNote },
      ],
    },
    {
      title: "Academia & Discipulado",
      items: [
        { label: "Curso de Teologia", path: "/curso-teologia", icon: GraduationCap },
        { label: "Questionários Bíblicos", path: "/questionarios", icon: HelpCircle },
        { label: "Devocional Diário", path: "/devocional", icon: Calendar },
      ],
    },
  ];

  return (
    <>
      {/* Fixed Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-header border-t border-border/60 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-5px_20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] ${
                  active
                    ? "text-amber-500 font-semibold"
                    : "text-muted-foreground hover:text-foreground active:scale-95"
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${active ? "bg-amber-500/15" : ""}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          {/* Drawer Trigger ("Mais") */}
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button
                className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all min-h-[44px] min-w-[44px] ${
                  drawerOpen
                    ? "text-amber-500 font-semibold"
                    : "text-muted-foreground hover:text-foreground active:scale-95"
                }`}
              >
                <div className="p-1 rounded-lg">
                  <Menu className="h-5 w-5" />
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">Mais</span>
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[85vw] max-w-sm glass-card border-l border-border/80 p-0 flex flex-col z-50">
              <SheetHeader className="p-5 border-b border-border/40 text-left">
                <SheetTitle className="font-serif text-lg font-bold flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold text-background font-serif font-black text-sm">
                    P
                  </div>
                  Pregador <span className="text-gradient-gold">Pro</span>
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Tour & Novidades */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setDrawerOpen(false); openTourMenu(); }}
                  className="w-full justify-center gap-2 border-accent/40 bg-accent/10 text-accent font-semibold py-2.5 h-auto rounded-xl"
                >
                  <Lightbulb className="h-4 w-4" /> Ver Novidades & Tutorial
                </Button>

                {/* Categorized Tool Links */}
                {drawerSections.map((sec) => (
                  <div key={sec.title} className="space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                      {sec.title}
                    </p>
                    <div className="space-y-1">
                      {sec.items.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setDrawerOpen(false)}
                            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors min-h-[44px] ${
                              active
                                ? "bg-amber-500/15 text-amber-500 font-semibold"
                                : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4 shrink-0" />
                              <span>{item.label}</span>
                            </div>
                            <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Admin Link if Admin */}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-accent bg-accent/10 font-semibold border border-accent/20 min-h-[44px]"
                  >
                    <ShieldCheck className="h-4 w-4" /> Painel de Controle Admin
                  </Link>
                )}
              </div>

              {/* Bottom Drawer Actions */}
              <div className="p-4 border-t border-border/50 bg-background/50 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="w-full justify-start text-sm px-3 min-h-[44px]"
                >
                  <Sun className="h-4 w-4 mr-2 hidden dark:block text-amber-400" />
                  <Moon className="h-4 w-4 mr-2 block dark:hidden text-indigo-400" />
                  Alternar Tema
                </Button>

                {user ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm text-destructive hover:text-destructive px-3 min-h-[44px]"
                    onClick={() => { signOut(); setDrawerOpen(false); }}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sair da Conta
                  </Button>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 text-sm min-h-[44px]"
                      onClick={() => { setDrawerOpen(false); openLogin(); }}
                    >
                      Entrar
                    </Button>
                    <Button
                      className="flex-1 bg-gradient-gold text-background font-semibold text-sm min-h-[44px]"
                      onClick={() => { setDrawerOpen(false); openLogin(); }}
                    >
                      Cadastrar
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
};
