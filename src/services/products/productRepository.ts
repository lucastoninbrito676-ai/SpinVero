import { brands, products } from "../../data/products";
import type { Brand, Product } from "../../types";

/**
 * FONTE DE DADOS DO CATÁLOGO.
 * Para trocar mock por API: crie `apiProductRepository` implementando esta interface (fetch para
 * /products, /products/:id, /brands) e altere UMA linha em productService.ts. UI e hooks não mudam.
 * Com milhares de produtos, adicione aqui um método `queryProducts(filters, sort, page)` e faça o
 * filtro/ordenação no servidor.
 */
export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | null>;
  getBrands(): Promise<Brand[]>;
}
const latency = () => new Promise<void>((r) => setTimeout(r, 300)); // imita rede
export const mockProductRepository: ProductRepository = {
  async getProducts() { await latency(); return products; },
  async getProductById(id) { await latency(); return products.find((p) => p.id === id) ?? null; },
  async getBrands() { await latency(); return brands; },
};
