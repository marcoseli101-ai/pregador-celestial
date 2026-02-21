import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "bible-reading-progress";

type ProgressData = Record<string, number[]>; // bookName -> array of read chapter numbers

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useReadingProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const markChapterRead = useCallback((bookName: string, chapter: number) => {
    setProgress((prev) => {
      const chapters = prev[bookName] || [];
      if (chapters.includes(chapter)) return prev;
      return { ...prev, [bookName]: [...chapters, chapter].sort((a, b) => a - b) };
    });
  }, []);

  const getBookProgress = useCallback(
    (bookName: string, totalChapters: number) => {
      const read = progress[bookName]?.length || 0;
      return { read, total: totalChapters, percent: totalChapters > 0 ? Math.round((read / totalChapters) * 100) : 0 };
    },
    [progress]
  );

  const isChapterRead = useCallback(
    (bookName: string, chapter: number) => {
      return progress[bookName]?.includes(chapter) || false;
    },
    [progress]
  );

  return { markChapterRead, getBookProgress, isChapterRead };
}
