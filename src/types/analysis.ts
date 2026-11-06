/**
 * MODELO DE ANÁLISE DE MOVIMENTO.
 * `AnalysisResult` é o contrato entre qualquer provedor (mock hoje, visão computacional amanhã) e a interface.
 * Também é a entrada prevista para a futura recomendação (perfil + análise + catálogo): use strokeType,
 * techniqueScore, movementMetrics, strengths, weaknesses e recommendations.
 */
export type StrokeType = "forehand" | "backhand" | "serve" | "push" | "topspin" | "smash";
export type MetricKey = "preparation" | "positioning" | "trunkRotation" | "armMovement" | "contactPoint" | "weightTransfer" | "recovery";
/** good ≥ 80 · attention 65–79 · improve < 65 (ver utils/analysis.ts). */
export type MetricStatus = "good" | "attention" | "improve";
export type AnalysisStatus = "processing" | "completed" | "failed";
export type ProgressStage = "uploading" | "processing" | "analyzing";

export interface TechniqueMetric { key: MetricKey; score: number; status: MetricStatus; explanation: string; feedback: string }
export interface ProviderInfo { id: string; name: string; /** true = valores não vêm do vídeo */ simulated: boolean }
export interface AnalysisResult {
  schemaVersion: 1; provider: ProviderInfo; notice?: string; generatedAt: string;
  strokeType: StrokeType; techniqueScore: number; movementMetrics: TechniqueMetric[];
  strengths: string[]; weaknesses: string[]; recommendations: string[];
}
export interface VideoMeta { name: string; size: number; type: string; durationSec?: number }
/** Registro salvo no histórico: só metadados e resultado — nunca o arquivo de vídeo. */
export interface AnalysisRecord {
  id: string; userId: string; createdAt: string; strokeType: StrokeType; score: number; status: AnalysisStatus;
  video: VideoMeta; thumbnail?: string; result: AnalysisResult;
}
export interface AnalyzeInput { file: File; strokeType: StrokeType; onProgress?: (stage: ProgressStage, percent: number) => void }
