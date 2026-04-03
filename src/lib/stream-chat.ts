import { getAuthToken } from "./auth-helpers";

const GENERATE_SERMON_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-sermon`;

type SSECallbacks = {
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (msg: string) => void;
};

async function parseSSEStream(resp: Response, { onDelta, onDone, onError }: SSECallbacks) {
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({ error: "Erro desconhecido" }));
    onError(data.error || `Erro ${resp.status}`);
    return;
  }
  if (!resp.body) { onError("Sem resposta"); return; }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") { streamDone = true; break; }
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore */ }
    }
  }

  onDone();
}

export async function streamSermon({
  tema, publico, tempo, nivel, estrutura, ocasiao, tom, referencias, onDelta, onDone, onError,
}: {
  tema: string; publico: string; tempo: string; nivel: string;
  estrutura?: string; ocasiao?: string; tom?: string; referencias?: string;
} & SSECallbacks) {
  const token = await getAuthToken();
  const resp = await fetch(GENERATE_SERMON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tema, publico, tempo, nivel, estrutura, ocasiao, tom, referencias }),
  });
  await parseSSEStream(resp, { onDelta, onDone, onError });
}

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function streamSermonChat({
  messages, onDelta, onDone, onError,
}: {
  messages: ChatMessage[];
} & SSECallbacks) {
  const token = await getAuthToken();
  const resp = await fetch(GENERATE_SERMON_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mode: "chat", messages }),
  });
  await parseSSEStream(resp, { onDelta, onDone, onError });
}
