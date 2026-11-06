import type { Blade, Product, Rubber, PlayerProfile } from "../../../types";
import type { AdvancedRecommendation, ComponentScore, RecommendedConfiguration, RecommendationReason } from "../../../types/advancedRecommendation";
import { COMPONENT_WEIGHTS } from "../../../data/recommendation/rules";
import { scoreComponent } from "./componentScoring";
import { evaluateConfiguration } from "./configurationCompatibility";
import { buildNeeds } from "./needs";
import type { EvolutionSignal, MovementSignal } from "../../../types/advancedRecommendation";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const inStock = (p: Product) => p.availability !== "out-of-stock";
const cheapest = <T extends Product>(xs: T[]) => [...xs].sort((a, b) => a.price - b.price).slice(0, 4);
const topByScore = <T extends Blade | Rubber>(xs: T[], scores: Map<string, ComponentScore>, n: number) => [...xs].sort((a, b) => (scores.get(b.id)?.score ?? 0) - (scores.get(a.id)?.score ?? 0) || a.id.localeCompare(b.id)).slice(0, n);

export function searchConfigurations(profile: PlayerProfile, blades: Blade[], rubbers: Rubber[], signals: MovementSignal[], evolution: EvolutionSignal[] = []): { configurations: RecommendedConfiguration[]; substitutes: AdvancedRecommendation["substitutes"]; minimumPrice: number | null } {
  const needs = buildNeeds(profile, signals, evolution);
  const bladeScores = new Map(blades.map((p) => [p.id, scoreComponent(p, profile as PlayerProfile & { goal?: string }, needs, "blade")]));
  const fhScores = new Map(rubbers.map((p) => [p.id, scoreComponent(p, profile as PlayerProfile & { goal?: string }, needs, "forehand")]));
  const bhScores = new Map(rubbers.map((p) => [p.id, scoreComponent(p, profile as PlayerProfile & { goal?: string }, needs, "backhand")]));
  const candidateBlades = [...new Set([...topByScore(blades, bladeScores, 12), ...cheapest(blades).slice(0, 8)])];
  const candidateFH = [...new Set([...topByScore(rubbers, fhScores, 14), ...cheapest(rubbers).slice(0, 8)])];
  const candidateBH = [...new Set([...topByScore(rubbers, bhScores, 14), ...cheapest(rubbers).slice(0, 8)])];
  const weight = COMPONENT_WEIGHTS[profile.style] ?? COMPONENT_WEIGHTS["All-round"];
  const targetPrice = profile.budget;
  const configs: RecommendedConfiguration[] = [];
  for (const blade of candidateBlades) for (const fh of candidateFH) for (const bh of candidateBH) {
    const cs = { blade: bladeScores.get(blade.id)!, forehandRubber: fhScores.get(fh.id)!, backhandRubber: bhScores.get(bh.id)! };
    const harmony = evaluateConfiguration(blade, fh, bh, needs);
    const componentScore = cs.blade.score * weight.blade + cs.forehandRubber.score * weight.forehand + cs.backhandRubber.score * weight.backhand;
    const technical = (cs.blade.technicalFit + cs.forehandRubber.technicalFit + cs.backhandRubber.technicalFit) / 3;
    const budget = Number.isFinite(targetPrice) ? (blade.price + fh.price + bh.price <= targetPrice ? 1 : Math.max(0, 1 - ((blade.price + fh.price + bh.price) - targetPrice) / Math.max(targetPrice, 1))) : 1;
    const totalPrice = blade.price + fh.price + bh.price;
    const final = Number.isFinite(targetPrice)
      ? componentScore * .45 + harmony.score / 100 * .25 + technical * .15 + budget * .15
      : (componentScore * .45 + harmony.score / 100 * .25 + technical * .15) / .85;
    const reasons: RecommendationReason[] = [...cs.blade.reasons.slice(0, 1), ...cs.forehandRubber.reasons.slice(0, 1), ...cs.backhandRubber.reasons.slice(0, 1)];
    if (harmony.score >= 85) reasons.push({ type: "compatibility", text: `Boa harmonia entre os três componentes (${harmony.score}%).`, contribution: harmony.score / 100 });
    if (Number.isFinite(targetPrice) && totalPrice <= targetPrice) reasons.push({ type: "budget", text: "Configuração dentro do orçamento informado." });
    configs.push({ blade, forehandRubber: fh, backhandRubber: bh, totalPrice, score: clamp(final * 100), harmony, components: cs, reasons });
  }
  configs.sort((a, b) => b.score - a.score || a.totalPrice - b.totalPrice || a.blade.id.localeCompare(b.blade.id));
  const allInStock = configs.filter((c) => inStock(c.blade) && inStock(c.forehandRubber) && inStock(c.backhandRubber));
  const stockBlades = blades.filter(inStock).sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
  const stockRubbers = rubbers.filter(inStock).sort((a, b) => a.price - b.price || a.id.localeCompare(b.id));
  const min = stockBlades.length && stockRubbers.length >= 2
    ? stockBlades[0].price + stockRubbers[0].price + stockRubbers[1].price
    : null;
  const candidates = allInStock.length ? allInStock : configs;
  const substitutes = {
    blade: topByScore(blades, bladeScores, 3).map((p) => bladeScores.get(p.id)!),
    forehandRubber: topByScore(rubbers, fhScores, 3).map((p) => fhScores.get(p.id)!),
    backhandRubber: topByScore(rubbers, bhScores, 3).map((p) => bhScores.get(p.id)!),
  };
  return { configurations: candidates, substitutes, minimumPrice: min };
}
