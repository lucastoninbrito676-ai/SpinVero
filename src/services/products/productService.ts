import { getPerformance, getSpecRows, getWeight, hardnessBucket, isRacket, CATEGORY_LABEL } from "../../utils/product";
import type { Brand, CatalogFilters, Product, ProductCategory, Racket, SortKey } from "../../types";
import { mockProductRepository, type ProductRepository } from "./productRepository";

/**
 * PRODUCT SERVICE — único ponto que a UI usa para obter e consultar produtos.
 * Funções assíncronas = acesso a dados (repositório). Funções puras (search/filter/sort/related) operam
 * sobre uma lista já carregada; ao migrar para API paginada, elas passam a ser executadas no servidor.
 */
const repository: ProductRepository = mockProductRepository; // trocar por apiProductRepository

export const getProducts = () => repository.getProducts();
export const getBrands = (): Promise<Brand[]> => repository.getBrands();
export const getProductById = (id: string) => repository.getProductById(id);
export const getProductsByCategory = async (c: ProductCategory) => (await getProducts()).filter((p) => p.category === c);
export const getProductsByBrand = async (brandId: string) => (await getProducts()).filter((p) => p.brandId === brandId);
export async function getRelatedProducts(p: Product) { return computeRelated(p, await getProducts()); }
/** Madeira e borrachas de uma raquete montada (relação entre produtos). */
export async function getRacketComponents(r: Racket) {
  const [blade, fh, bh] = await Promise.all([r.components.bladeId, r.components.forehandRubberId, r.components.backhandRubberId].map(getProductById));
  return { blade, forehandRubber: fh, backhandRubber: bh };
}

export const DEFAULT_FILTERS: CatalogFilters = { search: "", category: "", brandId: "", level: "", style: "", price: "", minSpeed: 0, minControl: 0, minSpin: 0, maxWeight: 0, layers: 0, composition: "", hardness: "", thickness: "", favoritesOnly: false };
export const PRICE_RANGES = {
  "0-300": { label: "Até R$300", min: 0, max: 300 }, "300-600": { label: "R$300–600", min: 300, max: 600 },
  "600-1000": { label: "R$600–1.000", min: 600, max: 1000 }, "1000+": { label: "R$1.000+", min: 1000, max: Infinity },
} as const;
export const SORT_LABELS: Record<SortKey, string> = { relevance: "Mais relevantes", "price-asc": "Menor preço", "price-desc": "Maior preço", name: "Nome (A–Z)", rating: "Melhor avaliação", speed: "Maior velocidade", spin: "Maior spin", control: "Maior controle", weight: "Menor peso" };

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const textCache = new WeakMap<Product, string>(); // texto de busca calculado uma vez por produto
function searchText(p: Product): string {
  let t = textCache.get(p);
  if (!t) {
    t = norm([p.name, p.brandName, p.category, CATEGORY_LABEL[p.category], p.description, p.tags.join(" "), getSpecRows(p).map((r) => r.value).join(" ")].join(" "));
    textCache.set(p, t);
  }
  return t;
}
/** Todos os termos precisam aparecer em algum campo (nome, marca, categoria, descrição, tags, especificações). */
export function searchProducts(list: Product[], query: string): Product[] {
  const tokens = norm(query.trim()).split(/\s+/).filter(Boolean);
  return tokens.length ? list.filter((p) => { const t = searchText(p); return tokens.every((k) => t.includes(k)); }) : list;
}
export function filterProducts(list: Product[], f: CatalogFilters, favorites: string[] = []): Product[] {
  const price = f.price ? PRICE_RANGES[f.price] : null;
  return list.filter((p) => {
    const perf = getPerformance(p), w = getWeight(p);
    if (f.category && p.category !== f.category) return false;
    if (f.brandId && p.brandId !== f.brandId) return false;
    if (f.level && !p.recommendation.levels.includes(f.level)) return false;
    if (f.style && !p.recommendation.styles.includes(f.style)) return false;
    if (price && !(p.price >= price.min && p.price < price.max)) return false;
    if ((f.minSpeed && (perf.speed ?? 0) < f.minSpeed) || (f.minControl && (perf.control ?? 0) < f.minControl) || (f.minSpin && (perf.spin ?? 0) < f.minSpin)) return false;
    if (f.maxWeight && (w == null || w > f.maxWeight)) return false;
    if (f.layers || f.composition) {
      if (p.category !== "blade") return false;
      if (f.layers && p.specifications.layers !== f.layers) return false;
      if (f.composition && !p.specifications.composition.includes(f.composition)) return false;
    }
    if (f.hardness || f.thickness) {
      if (p.category !== "rubber") return false;
      if (f.hardness && hardnessBucket(p.specifications.hardness) !== f.hardness) return false;
      if (f.thickness && !p.specifications.thickness.includes(f.thickness)) return false;
    }
    return !f.favoritesOnly || favorites.includes(p.id);
  });
}
/** Itens sem o atributo ordenado (ex.: acessório por velocidade) vão para o fim. */
export function sortProducts(list: Product[], sort: SortKey, fits: Map<string, number> = new Map()): Product[] {
  const desc = (v: (p: Product) => number | undefined) => (a: Product, b: Product) => (v(b) ?? -Infinity) - (v(a) ?? -Infinity);
  const by: Record<SortKey, (a: Product, b: Product) => number> = {
    relevance: (a, b) => (fits.get(b.id) ?? -1) - (fits.get(a.id) ?? -1) || b.reviewCount - a.reviewCount,
    "price-asc": (a, b) => a.price - b.price, "price-desc": (a, b) => b.price - a.price, name: (a, b) => a.name.localeCompare(b.name, "pt-BR"),
    rating: (a, b) => b.rating - a.rating, speed: desc((p) => getPerformance(p).speed), spin: desc((p) => getPerformance(p).spin), control: desc((p) => getPerformance(p).control),
    weight: (a, b) => (getWeight(a) ?? Infinity) - (getWeight(b) ?? Infinity),
  };
  return [...list].sort(by[sort]);
}
export function queryProducts(list: Product[], f: CatalogFilters, sort: SortKey, ctx: { favorites: string[]; fits: Map<string, number> }): Product[] {
  return sortProducts(filterProducts(searchProducts(list, f.search), f, ctx.favorites), sort, ctx.fits);
}

/** Opções de filtro derivadas do catálogo (nada de marcas/espessuras fixas na UI). */
export interface FilterOptions { brands: { id: string; name: string; count: number }[]; compositions: string[]; layers: number[]; thicknesses: string[] }
export function getFilterOptions(list: Product[]): FilterOptions {
  const brandMap = new Map<string, { id: string; name: string; count: number }>();
  const comps = new Set<string>(), layers = new Set<number>(), thick = new Set<string>();
  for (const p of list) {
    const b = brandMap.get(p.brandId) ?? { id: p.brandId, name: p.brandName, count: 0 }; b.count++; brandMap.set(p.brandId, b);
    if (p.category === "blade") { p.specifications.composition.forEach((c) => comps.add(c)); layers.add(p.specifications.layers); }
    if (p.category === "rubber") p.specifications.thickness.forEach((t) => thick.add(t));
  }
  return { brands: [...brandMap.values()].sort((a, b) => a.name.localeCompare(b.name)), compositions: [...comps].sort(), layers: [...layers].sort((a, b) => a - b), thicknesses: [...thick].sort() };
}

/** Relacionados: "similares" (mesma categoria, desempenho e estilo próximos) e "da mesma marca". */
export function computeRelated(p: Product, all: Product[], limit = 4) {
  const perf = getPerformance(p), keys = Object.keys(perf) as (keyof typeof perf)[];
  const distance = (o: Product) => { const q = getPerformance(o); return keys.reduce((s, k) => s + Math.abs((perf[k] ?? 0) - (q[k] ?? 0)), 0); };
  const sharedStyles = (o: Product) => o.recommendation.styles.filter((s) => p.recommendation.styles.includes(s)).length;
  const same = all.filter((o) => o.id !== p.id && o.category === p.category);
  const similar = [...same].sort((a, b) => (distance(a) - sharedStyles(a)) - (distance(b) - sharedStyles(b))).slice(0, limit);
  const sameBrand = same.filter((o) => o.brandId === p.brandId && !similar.includes(o)).slice(0, limit);
  return { similar, sameBrand };
}
export { isRacket };
