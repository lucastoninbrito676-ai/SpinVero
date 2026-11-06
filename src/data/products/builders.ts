import type { Brand, DataSource, ImageAsset, ProductCategory, RecommendationData } from "../../types";
import { brands } from "./brands";
/**
 * ATENÇÃO — DADOS FICTÍCIOS. Nomes de modelos e especificações são inventados e determinísticos
 * (gerados por semente). As marcas são reais, mas NENHUM produto aqui é um produto oficial dessas marcas.
 * Para cadastrar um produto real, use source { type: "manufacturer" | "retailer", name, url } com dados verificados.
 */
export const MOCK_SOURCE: DataSource = { type: "mock", name: "Dados fictícios do SpinLab (não oficiais)" };
export { rng } from "../../utils/random";
export const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const r1 = (n: number) => Math.round(n * 10) / 10;
export const score = (n: number) => Math.min(10, Math.max(1, r1(n)));
export const pick = <T,>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];
export const brandOf = (i: number): Brand => brands[i % brands.length];
export const price5 = (n: number) => Math.round(n / 5) * 5;

/** Campos comuns a todo produto. */
export function baseFields(r: () => number, category: ProductCategory, name: string, brand: Brand, price: number, description: string, tags: string[], recommendation: RecommendationData) {
  const x = r();
  const images: ImageAsset[] = ["vista frontal", "vista lateral", "detalhe"].map((v) => ({ alt: `${brand.name} ${name} — ${v}` }));
  return {
    id: `${category}-${brand.id}-${slug(name)}`, name, brandId: brand.id, brandName: brand.name, description, images, price,
    availability: x < 0.08 ? ("out-of-stock" as const) : x < 0.2 ? ("low-stock" as const) : ("in-stock" as const),
    rating: r1(3.8 + r() * 1.1), reviewCount: 10 + Math.floor(r() * 390), tags, source: MOCK_SOURCE, recommendation,
  };
}
