import type { RecommendedConfiguration, RecommendationReason } from "../../../types/advancedRecommendation";
import type { PlayerProfile } from "../../../types";
import { SIMULATED_NOTICE } from "../../../data/recommendation/copy";
import { REASON_COPY } from "../../../data/recommendation/copy";

export function explainConfiguration(config: RecommendedConfiguration, profile: PlayerProfile & { goal?: string }, simulated: boolean): RecommendationReason[] {
  const reasons: RecommendationReason[] = [
    { type: "profile", text: REASON_COPY.profile(profile.level) },
    { type: "style", text: REASON_COPY.style(profile.style) },
  ];
  if (profile.goal) reasons.push({ type: "goal", text: REASON_COPY.goal(profile.goal) });
  if (config.harmony.score >= 80) reasons.push({ type: "compatibility", text: `Os três componentes têm boa harmonia técnica (${config.harmony.score}%).` });
  else if (config.harmony.notes[0]) reasons.push({ type: "compatibility", text: config.harmony.notes[0] });
  if (config.harmony.specs.control >= 8) reasons.push({ type: "control", text: "O conjunto mantém um nível alto de controle." });
  if (config.harmony.specs.speed >= 8) reasons.push({ type: "speed", text: "O conjunto entrega velocidade suficiente para uma proposta mais ofensiva." });
  if (config.harmony.specs.spin >= 8) reasons.push({ type: "spin", text: "As borrachas oferecem bom potencial de spin." });
  if (Number.isFinite(profile.budget) && config.totalPrice <= profile.budget) reasons.push({ type: "budget", text: `O conjunto fica dentro do orçamento de R$${profile.budget.toLocaleString("pt-BR")}.` });
  reasons.push(...config.reasons.filter((r) => !reasons.some((x) => x.text === r.text)).slice(0, 3));
  if (simulated) reasons.push({ type: "movement", text: SIMULATED_NOTICE, simulated: true });
  return reasons.slice(0, 9);
}
