import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "create_note",
  title: "Criar nota pessoal",
  description: "Cria uma nota pessoal de estudo para o usuário autenticado.",
  inputSchema: {
    title: z.string().describe("Título da nota."),
    content: z.string().describe("Conteúdo da nota."),
    category: z.string().optional().describe("Categoria da nota (opcional)."),
    bible_reference: z.string().optional().describe("Referência bíblica relacionada, ex.: João 3:16."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ title, content, category, bible_reference }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const insert: Record<string, unknown> = {
      user_id: ctx.getUserId()!,
      title,
      content,
      bible_reference: bible_reference ?? null,
    };
    if (category) insert.category = category;
    const { data, error } = await supabaseForUser(ctx)
      .from("personal_notes")
      .insert(insert as never)
      .select("id, title, category, bible_reference, created_at")
      .single();
    if (error) return errorResult(error.message);
    return jsonResult(data);
  },
});