import type { Product } from "./products";
export type QuestionKey = "level" | "style" | "hand" | "priority" | "budget" | "strength" | "problem";
export type QuizAnswers = Record<QuestionKey, string>;
/** Compatibilidade (0–100) por critério; alimenta a visualização "Por que combina". */
export interface Breakdown { style: number; level: number; goal?: number; speed?: number; control?: number; spin?: number }
export interface Recommendation { product: Product; fit: number; summary: string; reasons: string[]; breakdown: Breakdown }
