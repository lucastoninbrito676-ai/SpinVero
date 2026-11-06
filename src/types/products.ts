import type { PlayerLevel, PlayerStyle } from "./user";

/**
 * MODELO DE PRODUTO
 * Product = união discriminada por `category`: cada categoria tem suas próprias `specifications`.
 * Para criar uma nova categoria: (1) adicionar o literal em ProductCategory, (2) criar o tipo
 * <Nome>Specs + o tipo do produto e incluí-lo na união Product, (3) tratar a categoria em
 * utils/product.ts (getPerformance, getWeight, getSpecRows, rótulos) e criar data/products/<nome>.ts.
 *
 * ESCALAS (iguais em todo o catálogo)
 *  - speed / spin / control: 1–10 (1 = muito baixo, 10 = extremo); uma casa decimal.
 *  - weight / estimatedWeight: gramas.  - price: reais (BRL), número inteiro.
 *  - hardness (borrachas): graus da escala do catálogo, ~36 (macia) a ~50 (dura).
 *  - thickness: strings "1.8", "2.0", "2.1", "MAX" (milímetros; MAX = esponja máxima).
 *  - rating: 0–5.
 */
export type ProductCategory = "blade" | "rubber" | "racket" | "accessory";
export type Stiffness = "soft" | "medium" | "hard";
export type HandleType = "flared" | "straight" | "anatomic" | "conical";
export type Balance = "head-heavy" | "even" | "handle-heavy";
export type RubberType = "inverted" | "short-pips" | "long-pips" | "anti-spin";
export type Distance = "close" | "mid" | "far";
export type AccessoryType = "ball" | "case" | "protector" | "glue" | "towel" | "net" | "apparel" | "other";
export type Availability = "in-stock" | "low-stock" | "out-of-stock";

/** Origem dos dados. Dados reais devem trazer manufacturer/retailer + url; "mock" = fictício. */
export interface DataSource { type: "mock" | "manufacturer" | "retailer" | "community"; name: string; url?: string }
/** Sem `url`, a interface mostra uma ilustração com o texto `alt`. */
export interface ImageAsset { url?: string; alt: string }
export interface Brand { id: string; name: string; logo?: string; description: string }
/** Dados usados pelo RecommendationService. */
export interface RecommendationData { styles: PlayerStyle[]; levels: PlayerLevel[]; distance?: Distance }

interface ProductBase {
  id: string; name: string;
  brandId: string; brandName: string; // brandName é cópia de exibição; a fonte é Brand
  description: string; images: ImageAsset[]; price: number; availability: Availability;
  rating: number; reviewCount: number; tags: string[]; source: DataSource; recommendation: RecommendationData;
}
export interface BladeSpecs {
  speed: number; control: number; weight: number; layers: number; composition: string[]; stiffness: Stiffness;
  handle: HandleType; balance: Balance; headSize?: { width: number; height: number }; technology?: string;
}
export interface RubberSpecs {
  speed: number; spin: number; control: number; hardness: number; thickness: string[]; type: RubberType;
  weight?: number; sponge?: string; pips?: string; recommendedDistance: Distance;
}
export interface RacketSpecs { speed: number; spin: number; control: number; estimatedWeight: number }
/** Relação entre produtos: ids de outros Products do catálogo. */
export interface RacketComponents { bladeId: string; forehandRubberId: string; backhandRubberId: string }
export interface AccessorySpecs { type: AccessoryType; details?: string }

export type Blade = ProductBase & { category: "blade"; specifications: BladeSpecs };
export type Rubber = ProductBase & { category: "rubber"; specifications: RubberSpecs };
export type Racket = ProductBase & { category: "racket"; specifications: RacketSpecs; components: RacketComponents };
export type Accessory = ProductBase & { category: "accessory"; specifications: AccessorySpecs };
export type Product = Blade | Rubber | Racket | Accessory;

/* ---- Catálogo: filtros e ordenação ---- */
export type PriceKey = "" | "0-300" | "300-600" | "600-1000" | "1000+";
export type SortKey = "relevance" | "price-asc" | "price-desc" | "name" | "rating" | "speed" | "spin" | "control" | "weight";
export type HardnessBucket = "" | "soft" | "medium" | "hard";
export interface CatalogFilters {
  search: string; category: ProductCategory | ""; brandId: string; level: PlayerLevel | ""; style: PlayerStyle | ""; price: PriceKey;
  minSpeed: number; minControl: number; minSpin: number; maxWeight: number;
  layers: number; composition: string; hardness: HardnessBucket; thickness: string; favoritesOnly: boolean;
}
