import { athleteStats, dailyScores, goalProgressPercent, recentActivities } from "../data/dashboard/dashboard";
import type { Activity, AthleteStats, Period, ProgressPoint } from "../types";

/**
 * MOCK assíncrono: cada função imita uma chamada de API (retorna Promise).
 * Quando houver backend, troque só o corpo; hooks e componentes continuam iguais.
 * No futuro, as análises de vídeo alimentarão estas mesmas estruturas.
 */
const latency = () => new Promise<void>((r) => setTimeout(r, 250));
// window = dias cobertos; step = espaçamento entre pontos exibidos
const PERIODS: Record<Period, { window: number; step: number }> = { "7d": { window: 7, step: 1 }, "30d": { window: 30, step: 5 }, "3m": { window: 90, step: 14 }, "6m": { window: 180, step: 30 } };

export async function getAthleteStats(): Promise<AthleteStats> { await latency(); return athleteStats; }
export async function getGoalProgress(): Promise<number> { await latency(); return goalProgressPercent; }
export async function getRecentActivities(): Promise<Activity[]> { await latency(); return recentActivities; }
/** Pontos em ordem cronológica; o último é sempre "hoje". */
export async function getProgressHistory(period: Period): Promise<ProgressPoint[]> {
  await latency();
  const { window, step } = PERIODS[period];
  const points: ProgressPoint[] = [];
  for (let d = Math.floor(window / step) * step; d >= 0; d -= step) points.push(dailyScores[d]);
  return points;
}
