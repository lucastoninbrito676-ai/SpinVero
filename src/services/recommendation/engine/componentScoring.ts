import type { Blade, PlayerProfile, Product, Rubber } from "../../../types";
import type { ComponentScore, RecommendationReason } from "../../../types/advancedRecommendation";
import { scoreProduct } from "../recommendationService";
import { COMPONENT_SCORE_WEIGHTS } from "../../../data/recommendation/rules";
import { componentTarget, type PlayerNeeds } from "./needs";
import { hardnessBucket } from "../../../utils/product";

const pct = (n: number) => Math.max(0, Math.min(100, Math.round(n * 100)));
const profileScore = (p: Product, profile: PlayerProfile) => scoreProduct(p, { level: profile.level, style: profile.style, priority: profile.priority, budget: Number.POSITIVE_INFINITY, goal: (profile as PlayerProfile & { goal?: string }).goal }).fit / 100;
function technicalScore(p: Blade | Rubber, needs: PlayerNeeds, side: "blade" | "forehand" | "backhand") {
  let s = componentTarget(p, needs, side);
  if (p.category === "rubber") {
    const desiredHard = needs.hardness;
    s = s * .75 + (1 - Math.min(1, Math.abs(p.specifications.hardness - desiredHard) / 12)) * .25;
    if (side === "backhand" && p.specifications.type === "long-pips" && needs.control >= 8) s += .05;
  } else {
    const rigidityBonus = p.specifications.stiffness === "medium" ? .03 : 0;
    s += rigidityBonus;
  }
  return Math.max(0, Math.min(1, s));
}
export function scoreComponent(p: Blade | Rubber, profile: PlayerProfile, needs: PlayerNeeds, side: "blade" | "forehand" | "backhand", budgetNeutral = true): ComponentScore {
  const weights = p.category === "blade" ? COMPONENT_SCORE_WEIGHTS.blade : COMPONENT_SCORE_WEIGHTS.rubber;
  const profileFit = budgetNeutral ? profileScore(p, profile) : scoreProduct(p, { level: profile.level, style: profile.style, priority: profile.priority, budget: profile.budget, goal: (profile as PlayerProfile & { goal?: string }).goal }).fit / 100;
  const needFit = componentTarget(p, needs, side);
  const technicalFit = technicalScore(p, needs, side);
  const score = profileFit * weights.profile + needFit * weights.need + technicalFit * weights.technical;
  const reasons: RecommendationReason[] = [];
  reasons.push({ type: "profile", text: `Compatibilidade de ${pct(profileFit)}% com seu perfil.`, contribution: profileFit });
  if (needFit >= .75) reasons.push({ type: side === "backhand" ? "control" : "style", text: side === "backhand" ? "Favorece controle e estabilidade no backhand." : "Atende bem às necessidades do seu lado principal." , contribution: needFit });
  if (p.category === "rubber") {
    const hard = hardnessBucket(p.specifications.hardness);
    reasons.push({ type: "compatibility", text: `Dureza ${hard === "soft" ? "mais macia" : hard === "hard" ? "mais dura" : "intermediária"} coerente com a necessidade calculada.`, contribution: technicalFit });
  }
  return { product: p, score, profileFit, needFit, technicalFit, reasons };
}
