import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listSavedContent from "./tools/list-saved-content";
import saveContent from "./tools/save-content";
import listNotes from "./tools/list-notes";
import createNote from "./tools/create-note";
import getDailyDevotional from "./tools/get-daily-devotional";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "pregador-celestial",
  title: "Pregador Celestial",
  version: "0.1.0",
  instructions:
    "Ferramentas do Pregador Celestial. Permitem ler e salvar conteúdos da Área do Pregador (pregações, devocionais, estudos, verbetes), gerenciar notas pessoais de estudo bíblico e consultar o devocional diário. Todas as operações são feitas na conta do usuário autenticado.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listSavedContent, saveContent, listNotes, createNote, getDailyDevotional],
});