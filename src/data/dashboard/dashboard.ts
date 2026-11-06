import type { Activity, AthleteStats, ProgressPoint } from "../../types";
// Dados fictícios. Datas relativas a "hoje" para que filtros e rótulos sempre pareçam atuais.
const DAY = 86_400_000;
export const daysAgoISO = (d: number) => new Date(Date.now() - d * DAY).toISOString();

export const athleteStats: AthleteStats = { technique: 78, consistency: 72, serve: 69, forehand: 82, backhand: 74 };
/** Índice = dias atrás. Tendência de alta (≈61 → 78 em 6 meses) com oscilação determinística. */
export const dailyScores: ProgressPoint[] = Array.from({ length: 181 }, (_, d) => ({ date: daysAgoISO(d), score: Math.round(78 - d * 0.095 + Math.sin(d / 4) * 1.5) }));
export const goalProgressPercent = 68;
export const recentActivities: Activity[] = [
  { id: "t1", kind: "profile", label: "Atualizou seu perfil", date: daysAgoISO(0) },
  { id: "t2", kind: "analysis", label: "Nova análise adicionada", date: daysAgoISO(1) },
  { id: "t3", kind: "progress", label: "Evolução atualizada", date: daysAgoISO(3) },
  { id: "t4", kind: "goal", label: "Objetivo definido", date: daysAgoISO(7) },
];
