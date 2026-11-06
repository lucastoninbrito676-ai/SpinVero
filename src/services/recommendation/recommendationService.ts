import type { Breakdown, PlayerLevel, PlayerProfile, Priority, Product, QuizAnswers, Recommendation } from "../../types";
import { CATEGORY_LABEL, getPerformance, hasPerformance, type Performance } from "../../utils/product";

/**
 * RECOMENDAÇÃO: perfil do atleta (ScoringProfile) × dados do produto (utils/product) → pontuação.
 * Cada critério gera um "match" de 0 a 1. fit = 100 × Σ(peso × match) / Σ(pesos dos critérios aplicáveis):
 * critério que não se aplica (madeira não tem spin; objetivo sem atributo; orçamento não informado) sai da conta
 * em vez de valer zero. Ajuste os pesos aqui; devem somar 1.
 */
export const recommendationWeights = { style: 0.25, level: 0.15, goal: 0.15, speed: 0.1, control: 0.1, spin: 0.1, budget: 0.15 } as const;
type Criterion = keyof typeof recommendationWeights;
type Attr = keyof Performance;
const LEVELS: PlayerLevel[] = ["Iniciante", "Intermediário", "Avançado", "Profissional"];
const ATTRS: Attr[] = ["speed", "control", "spin"];
const PRIORITY_ATTR: Record<Priority, Attr | null> = { Velocidade: "speed", Controle: "control", Spin: "spin", Equilíbrio: null };
/** Objetivo do perfil → atributo que ele valoriza. Objetivos sem atributo não entram no cálculo. */
const GOAL_FOCUS: Record<string, Attr> = { "Ter mais controle": "control", "Ter mais potência": "speed", "Ter mais spin": "spin", "Melhorar minha técnica": "control", "Competir em torneios": "speed" };
/** Velocidade que faz sentido por nível: iniciantes ganham mais com equipamentos controláveis. */
const SPEED_CAP: Record<PlayerLevel, number> = { Iniciante: 6.5, Intermediário: 8, Avançado: 10, Profissional: 10 };
const LABEL: Record<Attr, string> = { speed: "velocidade", control: "controle", spin: "spin" };
const NOUN: Record<string, string> = { blade: "Esta madeira", rubber: "Esta borracha", racket: "Esta raquete" };

export type ScoringProfile = Pick<PlayerProfile, "level" | "style" | "priority" | "budget"> & { goal?: string };

/** Valor ideal (0–10) de cada atributo conforme prioridade e nível. */
export function attributeTargets(u: ScoringProfile): Record<Attr, number> {
  const t: Record<Attr, number> = u.priority === "Equilíbrio" ? { speed: 7.5, control: 7.5, spin: 7.5 } : { speed: 7, control: 7, spin: 7 };
  const focus = PRIORITY_ATTR[u.priority];
  if (focus) t[focus] = 9;
  t.speed = Math.min(t.speed, SPEED_CAP[u.level]);
  return t;
}
const pct = (x: number) => Math.round(Math.max(0, Math.min(1, x)) * 100);
const joinPt = (a: string[]) => (a.length > 1 ? `${a.slice(0, -1).join(", ")} e ${a[a.length - 1]}` : a[0]);

export function scoreProduct(p: Product, u: ScoringProfile): Recommendation {
  const perf = getPerformance(p), targets = attributeTargets(u), goalAttr = u.goal ? GOAL_FOCUS[u.goal] : undefined;
  const idx = LEVELS.indexOf(u.level), reco = p.recommendation;
  const match: Record<Criterion, number | null> = {
    style: reco.styles.includes(u.style) ? 1 : 0.4,
    level: reco.levels.includes(u.level) ? 1 : reco.levels.some((l) => Math.abs(LEVELS.indexOf(l) - idx) === 1) ? 0.5 : 0,
    goal: goalAttr && perf[goalAttr] != null ? 1 - Math.abs(perf[goalAttr]! - 9) / 10 : null,
    speed: null, control: null, spin: null,
    budget: Number.isFinite(u.budget) ? (p.price <= u.budget ? 1 : Math.max(0, 1 - (p.price - u.budget) / u.budget)) : null,
  };
  for (const a of ATTRS) match[a] = perf[a] != null ? 1 - Math.abs(perf[a]! - targets[a]) / 10 : null;
  let num = 0, den = 0;
  for (const k of Object.keys(recommendationWeights) as Criterion[]) { const m = match[k]; if (m != null) { num += recommendationWeights[k] * m; den += recommendationWeights[k]; } }

  // Explicação gerada a partir dos dados do produto e do perfil.
  const reasons: string[] = [], highlights: string[] = [];
  const strong = ATTRS.filter((a) => targets[a] === 9 && (perf[a] ?? 0) >= 8.5);
  if (match.style === 1) { reasons.push(`Combina com seu estilo ${u.style.toLowerCase()}.`); highlights.push(`é indicada para o estilo ${u.style.toLowerCase()}`); }
  if (match.level === 1) { reasons.push(`Indicada para jogadores de nível ${u.level.toLowerCase()}.`); highlights.push(`atende ao nível ${u.level.toLowerCase()}`); }
  else if (match.level === 0.5) reasons.push("Nível ligeiramente diferente do seu — pode exigir adaptação.");
  for (const a of strong) { reasons.push(`Alto potencial de ${LABEL[a]}.`); highlights.unshift(`oferece alto potencial de ${LABEL[a]}`); }
  if (goalAttr && !strong.includes(goalAttr) && (perf[goalAttr] ?? 0) >= 8) { reasons.push(`Atende ao seu objetivo: ${u.goal!.toLowerCase()}.`); highlights.push(`apoia seu objetivo de ${u.goal!.toLowerCase()}`); }
  if (u.level === "Iniciante" && (perf.speed ?? 10) <= 7) reasons.push("Velocidade moderada, adequada para quem está começando.");
  if (match.budget != null) reasons.push(match.budget === 1 ? "Cabe no seu orçamento." : `Fica R$${Math.round(p.price - u.budget)} acima do seu orçamento.`);
  const noun = NOUN[p.category] ?? `Este produto (${CATEGORY_LABEL[p.category].toLowerCase()})`;
  const summary = highlights.length ? `${noun} combina com seu perfil porque ${joinPt(highlights.slice(0, 3))}.` : `${noun} tem compatibilidade parcial com seu perfil.`;

  const breakdown: Breakdown = { style: pct(match.style!), level: pct(match.level!) };
  if (match.goal != null) breakdown.goal = pct(match.goal);
  for (const a of ATTRS) if (match[a] != null) breakdown[a] = pct(match[a]!);
  return { product: p, fit: den ? Math.round((100 * num) / den) : 0, summary, reasons, breakdown };
}
export const calculateCompatibility = (p: Product, u: ScoringProfile) => scoreProduct(p, u).fit;
/** Ordena por compatibilidade; produtos sem desempenho (acessórios) ficam de fora. */
export const getRecommendations = (profile: ScoringProfile, products: Product[]): Recommendation[] =>
  products.filter(hasPerformance).map((p) => scoreProduct(p, profile)).sort((a, b) => b.fit - a.fit);
/** Converte as respostas do questionário (texto) em um perfil tipado. */
export const toPlayerProfile = (a: QuizAnswers): PlayerProfile => ({
  level: a.level as PlayerLevel, style: a.style as PlayerProfile["style"], hand: a.hand as PlayerProfile["hand"],
  priority: a.priority as Priority, budget: Number(a.budget), strength: a.strength, problem: a.problem,
});
