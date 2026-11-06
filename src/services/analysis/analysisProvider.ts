import { BASE_SCORES, METRIC_COPY, RESULT_NOTICE } from "../../data/analysis/mockAnalyses";
import type { AnalysisResult, AnalyzeInput, ProgressStage, TechniqueMetric } from "../../types";
import { METRIC_KEYS, STROKE_LABEL, statusFor } from "../../utils/analysis";
import { hashString, rng } from "../../utils/random";

/**
 * PROVEDOR DE ANÁLISE — o que a interface espera de qualquer motor de análise.
 * Para conectar visão computacional: crie um `RealAnalysisProvider` que envie `file` ao serviço
 * (upload → pose estimation → análise biomecânica), reporte progresso via `onProgress` e devolva um
 * AnalysisResult com `provider.simulated: false`; depois troque a constante em analysisService.ts.
 * UI, hook e histórico não mudam.
 */
export interface AnalysisProvider { id: string; name: string; simulated: boolean; analyze(input: AnalyzeInput): Promise<AnalysisResult> }

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const STAGES: ProgressStage[] = ["uploading", "processing", "analyzing"];
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** MOCK: simula as etapas e devolve um resultado demonstrativo. Não lê o conteúdo do vídeo. */
export const mockAnalysisProvider: AnalysisProvider = {
  id: "mock", name: "Análise demonstrativa", simulated: true,
  async analyze({ file, strokeType, onProgress }) {
    for (let s = 0; s < STAGES.length; s++) for (let t = 1; t <= 3; t++) { await wait(220); onProgress?.(STAGES[s], Math.round(((s * 3 + t) / 9) * 100)); }
    const r = rng(hashString(`${file.name}|${file.size}|${strokeType}`)); // mesmo arquivo + golpe → mesmo resultado
    const metrics: TechniqueMetric[] = METRIC_KEYS.map((key, i) => {
      const score = clamp(Math.round(BASE_SCORES[strokeType][i] + (r() - 0.5) * 16), 40, 98), status = statusFor(score);
      const idx = status === "good" ? 0 : status === "attention" ? 1 : 2;
      return { key, score, status, explanation: METRIC_COPY[key].explanation[idx], feedback: METRIC_COPY[key].feedback[idx] };
    });
    const ranked = [...metrics].sort((a, b) => b.score - a.score);
    const weakest = ranked.filter((m) => m.status !== "good").slice(-3).reverse(); // só o que realmente pode melhorar
    return {
      schemaVersion: 1, provider: { id: this.id, name: this.name, simulated: true }, notice: RESULT_NOTICE, generatedAt: new Date().toISOString(),
      strokeType, techniqueScore: Math.round(metrics.reduce((s, m) => s + m.score, 0) / metrics.length), movementMetrics: metrics,
      strengths: ranked.filter((m) => m.score >= 75).slice(0, 2).map((m) => METRIC_COPY[m.key].strength),
      weaknesses: weakest.slice(0, 2).map((m) => METRIC_COPY[m.key].weakness),
      recommendations: [...weakest.map((m) => METRIC_COPY[m.key].step), `Repita a análise de ${STROKE_LABEL[strokeType].toLowerCase()} após alguns treinos para comparar a evolução.`],
    };
  },
};
