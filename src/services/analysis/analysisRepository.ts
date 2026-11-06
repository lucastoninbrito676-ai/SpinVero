import { storage } from "../../lib/storage";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import type { AnalysisRecord } from "../../types";

/**
 * HISTÓRICO DE ANÁLISES (fonte única de verdade). Guarda apenas metadados, miniatura pequena e resultado;
 * o vídeo nunca vai para o localStorage. ⚠️ Mock local: a checagem de dono (userId) é simulação e precisa
 * existir no servidor quando houver backend. Para trocar por API, implemente esta interface.
 */
export interface AnalysisRepository {
  list(userId: string): Promise<AnalysisRecord[]>;
  get(id: string, userId: string): Promise<AnalysisRecord | null>;
  /** Devolve false se não foi possível persistir (armazenamento cheio/indisponível). */
  save(record: AnalysisRecord): Promise<boolean>;
  remove(id: string, userId: string): Promise<void>;
}
const MAX_PER_USER = 30; // limita o uso do localStorage
const all = () => storage.get<AnalysisRecord[]>(STORAGE_KEYS.analysisHistory) ?? [];

export const localAnalysisRepository: AnalysisRepository = {
  async list(userId) { return all().filter((r) => r.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)); },
  async get(id, userId) { return all().find((r) => r.id === id && r.userId === userId) ?? null; },
  async save(record) {
    const others = all().filter((r) => r.userId !== record.userId);
    const mine = [record, ...all().filter((r) => r.userId === record.userId)].slice(0, MAX_PER_USER);
    storage.set(STORAGE_KEYS.analysisHistory, [...mine, ...others]);
    return all().some((r) => r.id === record.id); // confirma que gravou
  },
  async remove(id, userId) { storage.set(STORAGE_KEYS.analysisHistory, all().filter((r) => !(r.id === id && r.userId === userId))); },
};
