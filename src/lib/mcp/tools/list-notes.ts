import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "list_notes",
  title: "Listar notas pessoais",
  description: "Lista as notas pessoais do usuário autenticado, opcionalmente filtradas por categoria.",
  inputSchema: {
    category: z.string().optional().describe("Categoria da nota (opcional)."),
    limit: z.number().optional().describe("Número máximo de notas (padrão 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    let query = supabaseForUser(ctx)
      .from("personal_notes")
      .select("id, title, content, category, bible_reference, updated_at")
      .order("updated_at", { ascending: false })
      .limit(max);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    return jsonResult(data ?? []);
  },
});