import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  BookOpen,
  Sparkles,
  FileText,
  GraduationCap,
  Languages,
  HelpCircle,
  Calendar,
  BookMarked,
  StickyNote,
  Bookmark,
  ShieldCheck,
  Search,
  Zap,
} from "lucide-react";

interface GlobalSearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_ITEMS = [
  {
    category: "Estudo Bíblico",
    items: [
      { title: "Bíblia Sagrada", description: "Leitura, comparação e comentários", path: "/estudo-biblico", icon: BookOpen },
      { title: "Plano de Leitura Anual", description: "Acompanhe sua leitura bíblica diária", path: "/plano-leitura", icon: BookMarked },
      { title: "Dicionário Hebraico/Grego", description: "Léxico com significado e pronúncia", path: "/dicionario", icon: Languages },
      { title: "Marcadores de Versículos", description: "Versículos salvos e destacados", path: "/marcadores", icon: Bookmark },
    ],
  },
  {
    category: "Pregação & Homilética",
    items: [
      { title: "Gerador de Esboços", description: "Estruturas de sermão e mensagens com IA", path: "/gerador-pregacoes", icon: Sparkles },
      { title: "Biblioteca de Mensagens", description: "Pregações organizadas por temas e livros", path: "/biblioteca", icon: FileText },
      { title: "Área do Pregador", description: "Seus sermões salvos e histórico", path: "/area-pregador", icon: GraduationCap },
      { title: "Notas Pessoais", description: "Rascunhos e anotações ministeriais", path: "/notas", icon: StickyNote },
    ],
  },
  {
    category: "Academia & Crescimento",
    items: [
      { title: "Curso de Teologia", description: "Teologia sistemática interativa com IA", path: "/curso-teologia", icon: GraduationCap },
      { title: "Questionários Bíblicos", description: "Testes e desafios de conhecimento", path: "/questionarios", icon: HelpCircle },
      { title: "Devocional Diário", description: "Reflexão, oração e versículo do dia", path: "/devocional", icon: Calendar },
    ],
  },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleSelect = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-xl glass-card border-border/80 shadow-2xl">
        <Command className="bg-transparent">
          <div className="flex items-center px-3 border-b border-border/50">
            <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
            <CommandInput
              placeholder="Digite o nome de uma ferramenta, livro ou assunto..."
              className="h-12 text-sm bg-transparent border-none focus:ring-0 focus-visible:ring-0"
            />
          </div>
          <CommandList className="max-h-[350px] p-2 overflow-y-auto">
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </CommandEmpty>

            {SEARCH_ITEMS.map((group) => (
              <CommandGroup key={group.category} heading={group.category} className="text-xs font-semibold text-muted-foreground">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={item.path}
                      onSelect={() => handleSelect(item.path)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-accent/15 data-[selected=true]:bg-accent/20 transition-colors"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-foreground text-sm">{item.title}</span>
                        <span className="text-xs text-muted-foreground truncate">{item.description}</span>
                      </div>
                      <Zap className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};
