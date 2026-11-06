import type { AnalysisRecord, ProgressStage, StrokeType } from "../../types";
import { mockAnalysisProvider, type AnalysisProvider } from "./analysisProvider";
import { localAnalysisRepository, type AnalysisRepository } from "./analysisRepository";

/**
 * ANALYSIS SERVICE — fluxo: UI → useAnalysis → analysisService → AnalysisProvider (+ AnalysisRepository).
 * Troque `provider` por um RealAnalysisProvider para usar visão computacional, e `repository` por uma API
 * para guardar o histórico no servidor.
 */
const provider: AnalysisProvider = mockAnalysisProvider;
const repository: AnalysisRepository = localAnalysisRepository;

export class AnalysisError extends Error {}
export interface RunInput { userId: string; file: File; strokeType: StrokeType; thumbnail?: string; durationSec?: number }

/** Executa a análise e registra no histórico do usuário. `saved=false` → resultado ok, mas não persistido. */
export async function runAnalysis(input: RunInput, onProgress?: (stage: ProgressStage, percent: number) => void): Promise<{ record: AnalysisRecord; saved: boolean }> {
  if (!input.userId) throw new AnalysisError("Entre na sua conta para analisar vídeos.");
  const result = await provider.analyze({ file: input.file, strokeType: input.strokeType, onProgress });
  const record: AnalysisRecord = {
    id: `a-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, userId: input.userId, createdAt: new Date().toISOString(),
    strokeType: input.strokeType, score: result.techniqueScore, status: "completed",
    video: { name: input.file.name, size: input.file.size, type: input.file.type, durationSec: input.durationSec }, thumbnail: input.thumbnail, result,
  };
  return { record, saved: await repository.save(record) };
}
export const listAnalyses = (userId: string) => repository.list(userId);
export const getAnalysis = (id: string, userId: string) => repository.get(id, userId);
export const deleteAnalysis = (id: string, userId: string) => repository.remove(id, userId);
