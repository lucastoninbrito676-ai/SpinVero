import type { AnalysisRecord, Blade, Product, Rubber, PlayerProfile, Racket } from "../types";

export type RecommendationState = "ok" | "needs-profile" | "insufficient-catalog" | "no-budget-match";
export type ReasonType = "profile" | "style" | "goal" | "movement" | "evolution" | "control" | "speed" | "spin" | "budget" | "compatibility";
export type SignalDirection = "increase" | "decrease" | "improve" | "stable";

export interface MovementSignal {
  metric: string;
  direction: SignalDirection;
  strength: number;
  simulated: boolean;
  strokeType?: AnalysisRecord["strokeType"];
  label?: string;
}
export interface EvolutionSignal {
  metric: string;
  direction: "improving" | "declining" | "stable";
  strength: number;
  simulated: boolean;
  strokeType?: AnalysisRecord["strokeType"];
}
export interface RecommendationReason {
  type: ReasonType;
  text: string;
  simulated?: boolean;
  contribution?: number;
}
export interface ComponentScore {
  product: Blade | Rubber;
  score: number;
  profileFit: number;
  needFit: number;
  technicalFit: number;
  reasons: RecommendationReason[];
}
export interface SetupHarmony {
  score: number;
  notes: string[];
  specs: { speed: number; spin: number; control: number; estimatedWeight: number };
}
export interface RecommendedConfiguration {
  blade: Blade;
  forehandRubber: Rubber;
  backhandRubber: Rubber;
  totalPrice: number;
  score: number;
  harmony: SetupHarmony;
  components: { blade: ComponentScore; forehandRubber: ComponentScore; backhandRubber: ComponentScore };
  reasons: RecommendationReason[];
}
export type AlternativeKind = "control" | "offensive" | "spin" | "economical" | "evolution" | "ready-racket";
export interface RecommendationAlternative {
  kind: AlternativeKind;
  label: string;
  configuration?: RecommendedConfiguration;
  racket?: Racket;
  reason: string;
}
export interface RecommendationConfidence { score: number; label: "Alta" | "Média" | "Baixa"; factors: string[] }
export interface AdvancedRecommendation {
  state: RecommendationState;
  profile: PlayerProfile | null;
  configuration: RecommendedConfiguration | null;
  alternatives: RecommendationAlternative[];
  substitutes: { blade: ComponentScore[]; forehandRubber: ComponentScore[]; backhandRubber: ComponentScore[] };
  confidence: RecommendationConfidence;
  movementSignals: MovementSignal[];
  evolutionSignals: EvolutionSignal[];
  minimumConfigurationPrice: number | null;
  message?: string;
}
