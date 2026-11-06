import type { AnalysisRecord, Product } from "../../types";
import { getProducts } from "../products/productService";
import { listAnalyses } from "../analysis/analysisService";
import { RecommendationEngine } from "./engine";
import type { AdvancedRecommendation } from "../../types/advancedRecommendation";
import type { PlayerProfile } from "../../types";

let productsPromise: Promise<Product[]> | null = null;
export const getRecommendationCatalog = () => productsPromise ??= getProducts();
export async function getAdvancedRecommendation(profile: PlayerProfile & { goal?: string }, userId?: string): Promise<AdvancedRecommendation> {
  const [products, analyses] = await Promise.all([getRecommendationCatalog(), userId ? listAnalyses(userId) : Promise.resolve<AnalysisRecord[]>([])]);
  return RecommendationEngine({ products, profile, analyses, now: new Date() });
}
export const clearAdvancedRecommendationCache = () => { productsPromise = null; };
