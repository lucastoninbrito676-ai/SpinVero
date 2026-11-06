import type { MetricKey, MetricStatus, StrokeType } from "../types";
export const STROKES: StrokeType[] = ["forehand", "backhand", "serve", "push", "topspin", "smash"];
export const STROKE_LABEL: Record<StrokeType, string> = { forehand: "Forehand", backhand: "Backhand", serve: "Saque", push: "Push", topspin: "Topspin", smash: "Smash" };
export const METRIC_KEYS: MetricKey[] = ["preparation", "positioning", "trunkRotation", "armMovement", "contactPoint", "weightTransfer", "recovery"];
export const METRIC_LABEL: Record<MetricKey, string> = { preparation: "Preparação", positioning: "Posicionamento", trunkRotation: "Rotação do tronco", armMovement: "Movimento do braço", contactPoint: "Ponto de contato", weightTransfer: "Transferência de peso", recovery: "Recuperação" };
export const STATUS_LABEL: Record<MetricStatus, string> = { good: "Bom", attention: "Atenção", improve: "Melhorar" };
export const STATUS_CLASS: Record<MetricStatus, string> = { good: "grn", attention: "yel", improve: "red" };
export const statusFor = (score: number): MetricStatus => (score >= 80 ? "good" : score >= 65 ? "attention" : "improve");
export const isStroke = (v: string): v is StrokeType => (STROKES as string[]).includes(v);
