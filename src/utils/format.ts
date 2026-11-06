import type { Period, ProgressPoint } from "../types";
export const formatDate = (iso: string) => new Date(iso).toLocaleDateString("pt-BR");
export function relativeDay(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "Hoje";
  if (days === 1) return "Ontem";
  if (days < 7) return `${days} dias atrás`;
  const weeks = Math.floor(days / 7);
  return weeks === 1 ? "1 semana atrás" : `${weeks} semanas atrás`;
}
/** Rótulo do eixo X: mês no período longo, dia/mês nos demais. */
export function axisLabel(iso: string, period: Period): string {
  const d = new Date(iso);
  return period === "6m" ? d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "") : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}
/** Variação percentual entre o primeiro e o último ponto. */
export function evolutionPercent(points: ProgressPoint[]): number {
  if (points.length < 2 || points[0].score === 0) return 0;
  return Math.round(((points[points.length - 1].score - points[0].score) / points[0].score) * 100);
}
export const formatPrice = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const formatDateTime = (iso: string) => new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}
export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60), s = Math.round(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
