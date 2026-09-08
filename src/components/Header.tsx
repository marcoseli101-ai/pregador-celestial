import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  ShieldCheck,
  Search,
  ChevronDown,
  FileText,
  Languages,
  HelpCircle,
  Calendar,
  BookMarked,
  StickyNote,
  Bookmark,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/contexts/LoginPromptContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAppTour } from "@/components/tour/AppTourProvider";
import { GlobalSearchModal } from "@/components/GlobalSearchModal";

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { openLogin } = useLoginPrompt();
  const { isAdmin } = useAdminCheck();
  const { openTourMenu } = useAppTour();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("app_theme", isDark ? "dark" : "light");
  };

  const navCategories = [
    {
      title: "Estudo Bíblico",
      items: [
        { label: "Bíblia Sagrada", path: "/estudo-biblico", desc: "Leitura, versões e comentários", icon: BookOpen },
        { label: "Plano de Leitura", path: "/plano-leitura", desc: "Acompanhamento anual organizado", icon: BookMarked },
        { label: "Dicionário Bíblico", path: "/dicionario", desc: "Léxico Hebraico e Grego", icon: Languages },
        { label: "Marcadores", path: "/marcadores", desc: "Versículos salvos e notas rápidas", icon: Bookmark },
      ],
    },
    {
      title: "Pregação",
      items: [
        { label: "Gerador de Esboços", path: "/gerador-pregacoes", desc: "Estruturação homilética com IA", icon: Sparkles },
        { label: "Biblioteca de Mensagens", path: "/biblioteca", desc: "Sermões temáticos e exegéticos", icon: FileText },
        { label: "Área do Pregador", path: "/area-pregador", desc: "Seus sermões salvos e histórico", icon: GraduationCap },
        { label: "Notas Pessoais", path: "/notas", desc: "Rascunhos e anotações ministeriais", icon: StickyNote },
      ],
    },
    {
      title: "Academia",
      items: [
        { label: "Curso de Teologia", path: "/curso-teologia", desc: "Teologia sistemática interativa", icon: GraduationCap },
        { label: "Questionários", path: "/questionarios", desc: "Testes e desafios bíblicos", icon: HelpCircle },
        { label: "Devocional Diário", path: "/devocional", desc: "Versículo e reflexão diária", icon: Calendar },
      ],
    },
  ];

  const isCategoryActive = (categoryItems: Array<{ path: string }>) => {
    return categoryItems.some((item) => location.pathname === item.path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header shadow-sm transition-all duration-300">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-gold shadow-gold group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="h-5 w-5 text-background" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg font-bold tracking-wide text-foreground flex items-center gap-1">
                Pregador <span className="text-gradient-gold font-extrabold">Pro</span>
              </span>
            </div>
          </Link>

          {/* Desktop Categorized Dropdowns */}
          <nav className="hidden lg:flex items-center gap-1.5" data-tour="main-nav">
            <Link
              to="/"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-foreground",
                location.pathname === "/"
                  ? "bg-amber-500/15 text-amber-500 font-semibold"
                  : "text-muted-foreground"
              )}
            >
              Início
            </Link>

            {navCategories.map((category) => {
              const active = isCategoryActive(category.items);
              return (
                <DropdownMenu key={category.title}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-foreground outline-none",
                        active
                          ? "bg-amber-500/15 text-amber-500 font-semibold"
                          : "text-muted-foreground"
                      )}
                    >
                      {category.title}
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform group-data-[state=open]:rotate-180" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-72 p-2 glass-card border border-border/80 shadow-2xl rounded-2xl animate-in fade-in-80 zoom-in-95"
                  >
                    <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
                      {category.title}
                    </div>
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const itemActive = location.pathname === item.path;
                      return (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link
                            to={item.path}
                            className={cn(
                              "flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors duration-150",
                              itemActive
                                ? "bg-amber-500/15 text-amber-500 font-medium"
                                : "hover:bg-accent/10 text-foreground"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 items-center justify-center rounded-lg shrink-0 mt-0.5",
                                itemActive
                                  ? "bg-amber-500 text-background"
                                  : "bg-accent/10 text-accent"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium leading-snug">{item.label}</span>
                              <span className="text-[11px] text-muted-foreground leading-tight truncate">
                                {item.desc}
                              </span>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>

          {/* Quick Actions (Search, Tour, Theme, Admin, Auth) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Global Search Button */}
            <Button
              variant="outline"
              size="sm"
              data-tour="global-search-btn"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground border-border/70 rounded-full px-3 h-8 bg-background/50 hover:bg-accent/10"
              title="Buscar ferramentas e conteúdos (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Buscar...</span>
              <kbd className="hidden sm:inline-flex items-center rounded border border-border/80 px-1.5 text-[10px] font-mono text-muted-foreground">
                ⌘K
              </kbd>
            </Button>

            {/* Novidades / Tour Button */}
            <Button
              variant="ghost"
              size="sm"
              data-tour="tour-button"
              onClick={openTourMenu}
              className="hidden sm:flex gap-1.5 text-xs text-amber-500 font-semibold hover:bg-amber-500/15 border border-amber-500/30 rounded-full px-3 h-8"
              title="Ver Novidades e Tutorial da Plataforma"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              Novidades
            </Button>

            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex gap-1.5 text-xs text-accent font-semibold hover:bg-accent/15 border border-accent/30 rounded-full px-3 h-8"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin
                </Button>
              </Link>
            )}

            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-8 w-8 hover:bg-accent/15"
              title="Alternar Modo Escuro / Claro"
            >
              <Sun className="h-4 w-4 hidden dark:block text-amber-400" />
              <Moon className="h-4 w-4 block dark:hidden text-indigo-500" />
            </Button>

            {/* Auth Buttons */}
            {user ? (
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="hidden sm:flex gap-1.5 text-xs h-8 rounded-full border-border/70 hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair
              </Button>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openLogin()}
                  className="text-xs h-8 rounded-full px-3"
                >
                  Entrar
                </Button>
                <Button
                  size="sm"
                  onClick={() => openLogin()}
                  className="bg-gradient-gold text-background hover:opacity-90 font-semibold text-xs h-8 rounded-full px-3.5 shadow-gold"
                >
                  Cadastrar
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

