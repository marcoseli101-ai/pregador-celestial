import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "save_content",
  title: "Salvar conteúdo",
  description:
    "Salva um conteúdo (pregação, devocional, estudo, verbete) na Área do Pregador do usuário autenticado.",
  inputSchema: {
    title: z.string().describe("Título do conteúdo."),
    content: z.string().describe("Texto completo do conteúdo, em markdown."),
    content_type: z
      .string()
      .optional()
      .describe("Tipo: pregacao, devocional, estudo, dicionario, questionario. Padrão: pregacao."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, content, content_type }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const { data, error } = await supabaseForUser(ctx)
      .from("saved_content")
      .insert({
        user_id: ctx.getUserId()!,
        title,
        content,
        content_type: content_type ?? "pregacao",
      })
      .select("id, title, content_type, created_at")
      .single();
    if (error) return errorResult(error.message);
    return jsonResult(data);
  },
});