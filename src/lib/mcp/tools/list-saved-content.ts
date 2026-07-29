import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "list_saved_content",
  title: "Listar conteúdos salvos",
  description:
    "Lista os conteúdos salvos pelo pregador (pregações, devocionais, estudos, verbetes do dicionário). Filtre por tipo com content_type.",
  inputSchema: {
    content_type: z
      .string()
      .optional()
      .describe("Filtro opcional de tipo: pregacao, devocional, estudo, dicionario, questionario."),
    limit: z.number().optional().describe("Número máximo de itens (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ content_type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("saved_content")
      .select("id, title, content_type, content, created_at")
      .order("created_at", { ascending: false })
      .limit(max);
    if (content_type) query = query.eq("content_type", content_type);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return jsonResult(data ?? []);
  },
});