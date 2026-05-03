import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

/**
 * useState com persistência automática em localStorage.
 * Restaura o valor anterior ao montar e sincroniza qualquer alteração.
 *
 * Uso: const [v, setV] = usePersistedState("chave", valorInicial);
 */
export function usePersistedState<T>(
  key: string,
  initial: T | (() => T)
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return typeof initial === "function" ? (initial as () => T)() : initial;
    }
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      /* ignore */
    }
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });

  const firstRun = useRef(true);
  useEffect(() => {
    // Skip the initial sync to avoid overwriting with default when hydration matches
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota or serialization error – ignore */
    }
  }, [key, value]);

  return [value, setValue];
}

/** Remove uma chave persistida (útil ao “limpar” explicitamente um formulário). */
export function clearPersistedState(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}