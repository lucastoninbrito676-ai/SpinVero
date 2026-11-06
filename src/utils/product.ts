import type { HardnessBucket, Product, ProductCategory, Racket } from "../types";

export const CATEGORY_LABEL: Record<ProductCategory, string> = { blade: "Madeira", rubber: "Borracha", racket: "Raquete montada", accessory: "Acessório" };
export const CATEGORY_PLURAL: Record<ProductCategory, string> = { blade: "Madeiras", rubber: "Borrachas", racket: "Raquetes", accessory: "Acessórios" };
export const CATEGORIES: ProductCategory[] = ["racket", "blade", "rubber", "accessory"];
const STIFFNESS = { soft: "Macia", medium: "Média", hard: "Rígida" } as const;
const HANDLE = { flared: "Côncavo", straight: "Reto", anatomic: "Anatômico", conical: "Cônico" } as const;
const BALANCE = { "head-heavy": "Cabeça", even: "Neutro", "handle-heavy": "Cabo" } as const;
const RUBBER_TYPE = { inverted: "Liso (inverted)", "short-pips": "Pinos curtos", "long-pips": "Pinos longos", "anti-spin": "Anti-spin" } as const;
const DISTANCE = { close: "Perto da mesa", mid: "Distância média", far: "Longe da mesa" } as const;
const ACCESSORY = { ball: "Bola", case: "Case", protector: "Proteção", glue: "Cola", towel: "Toalha", net: "Rede", apparel: "Roupa", other: "Outro" } as const;

export const isRacket = (p: Product): p is Racket => p.category === "racket";
export type Performance = Partial<Record<"speed" | "control" | "spin", number>>;
/** Atributos de desempenho que o produto possui (madeira não tem spin; acessório não tem nenhum). */
export function getPerformance(p: Product): Performance {
  switch (p.category) {
    case "blade": return { speed: p.specifications.speed, control: p.specifications.control };
    case "rubber": case "racket": return { speed: p.specifications.speed, spin: p.specifications.spin, control: p.specifications.control };
    default: return {};
  }
}
export const hasPerformance = (p: Product) => Object.keys(getPerformance(p)).length > 0;
export function getWeight(p: Product): number | undefined {
  switch (p.category) { case "blade": return p.specifications.weight; case "rubber": return p.specifications.weight; case "racket": return p.specifications.estimatedWeight; default: return undefined; }
}
/** Faixas de dureza do catálogo: <42 macia, 42–45,9 média, ≥46 dura. */
export const hardnessBucket = (h: number): Exclude<HardnessBucket, ""> => (h < 42 ? "soft" : h < 46 ? "medium" : "hard");
export const HARDNESS_LABEL = { soft: "Macia", medium: "Média", hard: "Dura" } as const;

export interface SpecRow { label: string; value: string; num?: number }
/** Linhas de especificação por categoria: alimentam a página do produto e a comparação. */
export function getSpecRows(p: Product): SpecRow[] {
  switch (p.category) {
    case "blade": { const s = p.specifications; return [
      { label: "Velocidade", value: String(s.speed), num: s.speed }, { label: "Controle", value: String(s.control), num: s.control },
      { label: "Peso", value: `${s.weight} g`, num: s.weight }, { label: "Camadas", value: String(s.layers), num: s.layers },
      { label: "Composição", value: s.composition.join(" + ") }, { label: "Rigidez", value: STIFFNESS[s.stiffness] },
      { label: "Cabo", value: HANDLE[s.handle] }, { label: "Equilíbrio", value: BALANCE[s.balance] }]; }
    case "rubber": { const s = p.specifications; return [
      { label: "Velocidade", value: String(s.speed), num: s.speed }, { label: "Spin", value: String(s.spin), num: s.spin }, { label: "Controle", value: String(s.control), num: s.control },
      { label: "Dureza", value: `${s.hardness}°`, num: s.hardness }, { label: "Espessura", value: s.thickness.join(" / ") },
      { label: "Tipo", value: RUBBER_TYPE[s.type] }, { label: "Distância ideal", value: DISTANCE[s.recommendedDistance] }]; }
    case "racket": { const s = p.specifications; return [
      { label: "Velocidade", value: String(s.speed), num: s.speed }, { label: "Spin", value: String(s.spin), num: s.spin }, { label: "Controle", value: String(s.control), num: s.control },
      { label: "Peso estimado", value: `${s.estimatedWeight} g`, num: s.estimatedWeight }]; }
    default: return [{ label: "Tipo", value: ACCESSORY[p.specifications.type] }, ...(p.specifications.details ? [{ label: "Detalhes", value: p.specifications.details }] : [])];
  }
}
