export interface ProgressEntry { week: string; score: number }
/* ---- Fase 3: dashboard e evolução ---- */
export interface AthleteStats { technique: number; consistency: number; serve: number; forehand: number; backhand: number }
/** `date` em ISO; diferente de ProgressEntry (rótulo semanal da página /progresso), permite filtrar por período. */
export interface ProgressPoint { date: string; score: number }
export type ActivityKind = "profile" | "analysis" | "progress" | "goal";
export interface Activity { id: string; kind: ActivityKind; label: string; date: string }
export type Period = "7d" | "30d" | "3m" | "6m";
