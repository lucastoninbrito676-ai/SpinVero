import type { AnalysisRecord, MetricKey } from "../types";
import type { EvolutionSignal, MovementSignal } from "../types/advancedRecommendation";

const LABEL: Record<MetricKey, string> = {
  preparation: "preparação", positioning: "posicionamento", trunkRotation: "rotação do tronco", armMovement: "movimento do braço",
  contactPoint: "ponto de contato", weightTransfer: "transferência de peso", recovery: "recuperação",
};
const nowMs = () => Date.now();
const ageFactor = (createdAt: string) => Math.max(0, nowMs() - new Date(createdAt).getTime()) > 90 * 86400000 ? .5 : 1;
const quantityFactor = (n: number) => n === 0 ? 0 : n === 1 ? .4 : n <= 3 ? .7 : 1;
const relevant = (records: AnalysisRecord[]) => records.filter((r) => r.status === "completed").sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export function getMovementSignals(records: AnalysisRecord[]): MovementSignal[] {
  const rs = relevant(records); if (!rs.length) return [];
  const q = quantityFactor(rs.length);
  const map = new Map<string, MovementSignal>();
  for (const r of rs) {
    for (const metric of r.result.movementMetrics) {
      const strength = Math.min(.5, (Math.abs(metric.score - 75) / 25) * q * ageFactor(r.createdAt));
      if (strength < .08) continue;
      const direction = metric.score < 65 ? "increase" : metric.score >= 80 ? "stable" : "improve";
      const key = `${metric.key}-${r.strokeType}`;
      if (!map.has(key)) map.set(key, { metric: metric.key, direction, strength, simulated: r.result.provider.simulated, strokeType: r.strokeType, label: LABEL[metric.key] });
    }
  }
  return [...map.values()].slice(0, 12);
}

export function getEvolutionSignals(records: AnalysisRecord[]): EvolutionSignal[] {
  const rs = relevant(records); const out: EvolutionSignal[] = [];
  const strokes = [...new Set(rs.map((r) => r.strokeType))];
  for (const stroke of strokes) {
    const same = rs.filter((r) => r.strokeType === stroke).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (same.length < 2) continue;
    const prev = same[same.length - 2], last = same[same.length - 1];
    const delta = last.score - prev.score;
    const direction = Math.abs(delta) < 5 ? "stable" : delta > 0 ? "improving" : "declining";
    out.push({ metric: "technique", direction, strength: Math.min(1, Math.abs(delta) / 15) * ageFactor(last.createdAt), simulated: last.result.provider.simulated, strokeType: stroke });
  }
  return out;
}
