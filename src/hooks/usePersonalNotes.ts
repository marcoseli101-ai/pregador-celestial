import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  category: string;
  bible_reference: string | null;
  created_at: string;
  updated_at: string;
}

export const NOTE_CATEGORIES = [
  { value: "geral", label: "Geral" },
  { value: "pregacao", label: "Pregação" },
  { value: "estudo", label: "Estudo Bíblico" },
  { value: "devocional", label: "Devocional" },
  { value: "oracao", label: "Oração" },
  { value: "reflexao", label: "Reflexão" },
] as const;

export function usePersonalNotes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<PersonalNote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("personal_notes")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Erro ao carregar notas");
    } else {
      setNotes((data as PersonalNote[]) ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = useCallback(
    async (title: string, content: string, category: string, bibleReference?: string) => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("personal_notes")
        .insert({
          user_id: user.id,
          title: title.trim(),
          content,
          category,
          bible_reference: bibleReference?.trim() || null,
        })
        .select()
        .single();
      if (error) {
        toast.error("Erro ao criar nota");
        return null;
      }
      setNotes((prev) => [data as PersonalNote, ...prev]);
      toast.success("Nota criada!");
      return data as PersonalNote;
    },
    [user]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<Pick<PersonalNote, "title" | "content" | "category" | "bible_reference">>) => {
      const { error } = await supabase
        .from("personal_notes")
        .update(updates)
        .eq("id", id);
      if (error) {
        toast.error("Erro ao atualizar nota");
        return false;
      }
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, ...updates, updated_at: new Date().toISOString() } : n))
      );
      toast.success("Nota atualizada!");
      return true;
    },
    []
  );

  const deleteNote = useCallback(async (id: string) => {
    const { error } = await supabase.from("personal_notes").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir nota");
      return false;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.success("Nota excluída!");
    return true;
  }, []);

  return { notes, loading, createNote, updateNote, deleteNote, refetch: fetchNotes };
}
