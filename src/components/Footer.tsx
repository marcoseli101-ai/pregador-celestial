import { Link } from "react-router-dom";
import { BookOpen, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold">
                <BookOpen className="h-4 w-4 text-background" />
              </div>
              <span className="font-serif text-lg font-bold">Pregador Pro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Preparando pregadores cheios da Palavra e do Espírito para transformar vidas.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold">Ferramentas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/gerador-pregacoes" className="hover:text-foreground transition-colors">Gerador de Pregações</Link></li>
              <li><Link to="/estudo-biblico" className="hover:text-foreground transition-colors">Estudo Bíblico</Link></li>
              <li><Link to="/multimidia" className="hover:text-foreground transition-colors">Multimídia</Link></li>
              <li><Link to="/dicionario" className="hover:text-foreground transition-colors">Dicionário Bíblico</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold">Conteúdo</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/biblioteca" className="hover:text-foreground transition-colors">Biblioteca de Mensagens</Link></li>
              <li><Link to="/devocional" className="hover:text-foreground transition-colors">Devocional Diário</Link></li>
              <li><Link to="/questionarios" className="hover:text-foreground transition-colors">Questionários</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-serif text-sm font-semibold">Acesso</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="hover:text-foreground transition-colors">Área do Pregador</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Entrar / Cadastrar</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 Pregador Bíblico Pro. Todos os direitos reservados.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Feito com <Heart className="h-3 w-3 text-accent" /> para a glória de Deus
          </p>
        </div>
      </div>
    </footer>
  );
}
