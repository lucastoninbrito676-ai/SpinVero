import type { AnalysisRecord, Blade, PlayerProfile, Product, Racket, Rubber } from "../../../types";
import type { AdvancedRecommendation } from "../../../types/advancedRecommendation";
import { getMovementSignals, getEvolutionSignals } from "../../../utils/analysisInsights";
import { searchConfigurations } from "./search";
import { explainConfiguration } from "./explain";
import { buildAlternatives } from "./alternatives";

export interface RecommendationEngineInput {
  products: Product[];
  profile: PlayerProfile & { goal?: string };
  analyses: AnalysisRecord[];
  now?: Date;
}

export function RecommendationEngine(input: RecommendationEngineInput): AdvancedRecommendation {
  const profile = input.profile;
  const blades = input.products.filter((p): p is Blade => p.category === "blade" && p.availability !== "out-of-stock");
  const rubbers = input.products.filter((p): p is Rubber => p.category === "rubber" && p.availability !== "out-of-stock");
  const rackets = input.products.filter((p): p is Racket => p.category === "racket" && p.availability !== "out-of-stock");
  if (!profile.level || !profile.style) return { state: "needs-profile", profile, configuration: null, alternatives: [], substitutes: { blade: [], forehandRubber: [], backhandRubber: [] }, confidence: { score: 20, label: "Baixa", factors: ["Nível ou estilo ausente."] }, movementSignals: [], evolutionSignals: [], minimumConfigurationPrice: null, message: "Complete pelo menos nível e estilo para gerar a configuração." };
  if (blades.length === 0 || rubbers.length < 2) return { state: "insufficient-catalog", profile, configuration: null, alternatives: [], substitutes: { blade: [], forehandRubber: [], backhandRubber: [] }, confidence: { score: 20, label: "Baixa", factors: ["Catálogo insuficiente."] }, movementSignals: [], evolutionSignals: [], minimumConfigurationPrice: null, message: "O catálogo ainda não possui componentes suficientes." };
  const movementSignals = getMovementSignals(input.analyses);
  const evolutionSignals = getEvolutionSignals(input.analyses);
  const result = searchConfigurations(profile, blades, rubbers, movementSignals, evolutionSignals);
  const best = Number.isFinite(profile.budget) ? result.configurations.find((c) => c.totalPrice <= profile.budget) ?? result.configurations[0] : result.configurations[0];
  if (!best) return { state: "insufficient-catalog", profile, configuration: null, alternatives: [], substitutes: result.substitutes, confidence: { score: 25, label: "Baixa", factors: ["Nenhuma combinação válida foi encontrada."] }, movementSignals, evolutionSignals, minimumConfigurationPrice: result.minimumPrice };
  const simulated = movementSignals.some((s) => s.simulated) || evolutionSignals.some((s) => s.simulated);
  const configuration = { ...best, reasons: explainConfiguration(best, profile, simulated) };
  const alternatives = buildAlternatives(result.configurations, rackets, profile, configuration);
  const factors = ["Perfil preenchido", `Catálogo com ${blades.length} madeiras e ${rubbers.length} borrachas`];
  let confidenceScore = 65;
  if (profile.priority && profile.problem && profile.strength) confidenceScore += 10;
  if (input.analyses.length) confidenceScore += Math.min(20, input.analyses.length * 4);
  if (simulated) factors.push("Análise demonstrativa considerada");
  if (result.minimumPrice != null && Number.isFinite(profile.budget) && profile.budget < result.minimumPrice) factors.push("Orçamento abaixo do menor conjunto disponível");
  const state = Number.isFinite(profile.budget) && best.totalPrice > profile.budget ? "no-budget-match" : "ok";
  if (state === "no-budget-match") factors.push(`Menor configuração disponível: R$${result.minimumPrice!.toLocaleString("pt-BR")}`);
  return { state, profile, configuration, alternatives, substitutes: result.substitutes, confidence: { score: Math.min(100, confidenceScore), label: confidenceScore >= 80 ? "Alta" : confidenceScore >= 60 ? "Média" : "Baixa", factors }, movementSignals, evolutionSignals, minimumConfigurationPrice: result.minimumPrice, message: state === "no-budget-match" ? `Nenhuma configuração completa cabe em R$${profile.budget.toLocaleString("pt-BR")}. Mostramos a opção mais próxima.` : undefined };
}
