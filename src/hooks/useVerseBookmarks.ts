import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface VerseBookmark {
  id: string;
  book: string;
  chapter: number;
  verse_number: number;
  verse_text: string;
  color: string;
  note: string | null;
  created_at: string;
}

const COLORS = ["yellow", "green", "blue", "pink", "purple"] as const;
export type BookmarkColor = (typeof COLORS)[number];
export { COLORS as BOOKMARK_COLORS };

export function useVerseBookmarks(book?: string, chapter?: number) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<VerseBookmark[]>([]);
  const [allBookmarks, setAllBookmarks] = useState<VerseBookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookmarks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    let query = supabase
      .from("verse_bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (book && chapter) {
      query = query.eq("book", book).eq("chapter", chapter);
    }

    const { data, error } = await query;
    if (error) {
      console.error(error);
    } else {
      if (book && chapter) {
        setBookmarks((data as VerseBookmark[]) ?? []);
      } else {
        setAllBookmarks((data as VerseBookmark[]) ?? []);
      }
    }
    setLoading(false);
  }, [user, book, chapter]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const isBookmarked = useCallback(
    (verseNum: number) => bookmarks.some((b) => b.verse_number === verseNum),
    [bookmarks]
  );

  const getBookmark = useCallback(
    (verseNum: number) => bookmarks.find((b) => b.verse_number === verseNum),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (verseNum: number, verseText: string, color: BookmarkColor = "yellow") => {
      if (!user || !book || !chapter) return;
      const existing = bookmarks.find((b) => b.verse_number === verseNum);
      if (existing) {
        const { error } = await supabase.from("verse_bookmarks").delete().eq("id", existing.id);
        if (error) {
          toast.error("Erro ao remover marcador");
        } else {
          setBookmarks((prev) => prev.filter((b) => b.id !== existing.id));
          toast.success("Marcador removido");
        }
      } else {
        const { data, error } = await supabase
          .from("verse_bookmarks")
          .insert({
            user_id: user.id,
            book,
            chapter,
            verse_number: verseNum,
            verse_text: verseText,
            color,
          })
          .select()
          .single();
        if (error) {
          toast.error("Erro ao salvar marcador");
        } else {
          setBookmarks((prev) => [data as VerseBookmark, ...prev]);
          toast.success("Versículo marcado!");
        }
      }
    },
    [user, book, chapter, bookmarks]
  );

  const removeBookmark = useCallback(async (id: string) => {
    const { error } = await supabase.from("verse_bookmarks").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao remover marcador");
    } else {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      setAllBookmarks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Marcador removido");
    }
  }, []);

  return {
    bookmarks,
    allBookmarks,
    loading,
    isBookmarked,
    getBookmark,
    toggleBookmark,
    removeBookmark,
    refetch: fetchBookmarks,
  };
}
