import type { PlayerProfile, Racket } from "../../../types";
import type { RecommendedConfiguration, RecommendationAlternative, AlternativeKind } from "../../../types/advancedRecommendation";

export function buildAlternatives(configs: RecommendedConfiguration[], rackets: Racket[], _profile: PlayerProfile, best: RecommendedConfiguration | null): RecommendationAlternative[] {
  if (!best) return [];
  const target: Record<AlternativeKind, (c: RecommendedConfiguration) => number> = {
    control: (c) => c.harmony.specs.control,
    offensive: (c) => c.harmony.specs.speed + c.harmony.specs.spin,
    spin: (c) => c.harmony.specs.spin,
    economical: (c) => -c.totalPrice,
    evolution: (c) => c.harmony.specs.control + c.harmony.specs.spin,
    "ready-racket": () => -Infinity,
  };
  const labels: Record<AlternativeKind, string> = { control: "Mais controle", offensive: "Mais ofensiva", spin: "Mais spin", economical: "Mais econômica", evolution: "Melhor para evolução", "ready-racket": "Raquete pronta" };
  const result: RecommendationAlternative[] = [];
  for (const kind of ["control", "offensive", "spin", "economical", "evolution"] as AlternativeKind[]) {
    const pool = configs.filter((c) => c.blade.id !== best.blade.id || c.forehandRubber.id !== best.forehandRubber.id || c.backhandRubber.id !== best.backhandRubber.id);
    const sorted = [...pool].sort((a, b) => target[kind](b) - target[kind](a));
    const chosen = sorted[0];
    if (chosen && (chosen.totalPrice !== best.totalPrice || chosen.score !== best.score)) result.push({ kind, label: labels[kind], configuration: chosen, reason: `Alternativa ${labels[kind].toLowerCase()} sem abandonar a lógica do seu perfil.` });
  }
  const ready = [...rackets].sort((a, b) => {
    const aScore = a.specifications.control + a.specifications.spin + a.specifications.speed;
    const bScore = b.specifications.control + b.specifications.spin + b.specifications.speed;
    return bScore - aScore;
  })[0];
  if (ready) result.push({ kind: "ready-racket", label: labels["ready-racket"], racket: ready, reason: "Uma opção pronta quando você prefere praticidade." });
  return result.slice(0, 4);
}
