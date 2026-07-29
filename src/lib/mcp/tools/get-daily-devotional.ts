import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { errorResult, jsonResult, supabaseForUser, unauthenticated } from "../supabase";

export default defineTool({
  name: "get_daily_devotional",
  title: "Devocional do dia",
  description:
    "Retorna o devocional diário publicado no app (versículo, reflexão e oração). Use a data no formato AAAA-MM-DD para dias anteriores.",
  inputSchema: {
    date: z.string().optional().describe("Data no formato AAAA-MM-DD. Padrão: o devocional mais recente."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ date }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    let query = supabaseForUser(ctx)
      .from("devocional_diario")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    if (date) query = query.eq("data", date);
    const { data, error } = await query;
    if (error) return errorResult(error.message);
    if (!data?.length) return errorResult("Nenhum devocional encontrado para essa data.");
    return jsonResult(data[0]);
  },
});