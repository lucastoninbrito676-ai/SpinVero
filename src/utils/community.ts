import type { PostCategory } from "../types";
import type { Errors } from "./validation";

export const POST_CATEGORIES: PostCategory[] = ["equipment", "technique", "training", "competition", "questions", "progress", "general"];
export const POST_CATEGORY_LABEL: Record<PostCategory, string> = { equipment: "Equipamentos", technique: "Técnica", training: "Treino", competition: "Competição", questions: "Dúvidas", progress: "Evolução", general: "Geral" };
export const LIMITS = { title: 120, content: 2000, comment: 1000, tags: 5, tagLength: 24 } as const;

/** "#Backhand, controle  #Borracha" → ["backhand","controle","borracha"] (minúsculas, sem repetição, sem acento). */
export function parseTags(raw: string): string[] {
  const tags = raw.split(/[\s,]+/).map((t) => t.replace(/^#+/, "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9_-]/g, "")).filter(Boolean);
  return [...new Set(tags)];
}
export function validatePost(v: { title: string; content: string; category: PostCategory | ""; tags: string[] }): Errors<"title" | "content" | "category" | "tags"> {
  const e: Errors<"title" | "content" | "category" | "tags"> = {};
  if (!v.content.trim()) e.content = "Escreva algo antes de publicar.";
  else if (v.content.length > LIMITS.content) e.content = `O texto pode ter no máximo ${LIMITS.content} caracteres.`;
  if (v.title.length > LIMITS.title) e.title = `O título pode ter no máximo ${LIMITS.title} caracteres.`;
  if (!v.category) e.category = "Escolha uma categoria.";
  if (v.tags.length > LIMITS.tags) e.tags = `Use no máximo ${LIMITS.tags} tags.`;
  else if (v.tags.some((t) => t.length > LIMITS.tagLength)) e.tags = `Cada tag pode ter no máximo ${LIMITS.tagLength} caracteres.`;
  return e;
}
export function validateComment(text: string): string | undefined {
  if (!text.trim()) return "Escreva um comentário antes de enviar.";
  if (text.length > LIMITS.comment) return `O comentário pode ter no máximo ${LIMITS.comment} caracteres.`;
}
export const excerpt = (s: string, n = 280) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);
