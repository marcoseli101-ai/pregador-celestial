import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, BookOpen, Sun, Moon, LogOut, ShieldCheck, StickyNote, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

const navItems = [
  { label: "Início", path: "/" },
  { label: "Estudo Bíblico", path: "/estudo-biblico" },
  { label: "Plano de Leitura", path: "/plano-leitura" },
  { label: "Gerador de Pregações", path: "/gerador-pregacoes" },
  { label: "Biblioteca", path: "/biblioteca" },
  { label: "Curso de Teologia", path: "/curso-teologia" },
  { label: "Dicionário", path: "/dicionario" },
  { label: "Questionários", path: "/questionarios" },
  { label: "Devocional", path: "/devocional" },
  { label: "Área do Pregador", path: "/area-pregador" },
  { label: "Notas", path: "/notas" },
  { label: "Marcadores", path: "/marcadores" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdminCheck();

  const toggleTheme = () => {
    setDark(!dark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-gold">
            <BookOpen className="h-5 w-5 text-background" />
          </div>
          <span className="font-serif text-lg font-bold tracking-wide text-foreground">
            Pregador <span className="text-gradient-gold">Pro</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground", location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-1 text-accent">
                <ShieldCheck className="h-4 w-4" /> Admin
              </Button>
            </Link>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="hidden sm:flex">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={signOut} className="hidden sm:flex gap-1">
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          ) : (
            <>
              <Link to="/login"><Button variant="outline" size="sm" className="hidden sm:flex">Entrar</Button></Link>
              <Link to="/login"><Button size="sm" className="hidden sm:flex bg-gradient-gold text-background hover:opacity-90">Cadastrar</Button></Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background p-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent", location.pathname === item.path ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>
                {item.label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent flex items-center gap-1 text-accent", location.pathname === "/admin" ? "bg-accent text-accent-foreground" : "")}>
                <ShieldCheck className="h-4 w-4" /> Painel Admin
              </Link>
            )}
            <div className="mt-3 flex gap-2">
              {user ? (
                <Button variant="outline" className="w-full" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut className="h-4 w-4 mr-1" /> Sair
                </Button>
              ) : (
                <>
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="outline" className="w-full">Entrar</Button></Link>
                  <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}><Button className="w-full bg-gradient-gold text-background">Cadastrar</Button></Link>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={toggleTheme} className="mt-2">
              {dark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              {dark ? "Modo Claro" : "Modo Escuro"}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
