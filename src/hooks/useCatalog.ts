import { useEffect, useState } from "react";
import { getBrands, getProducts } from "../services/products/productService";
import type { Brand, Product } from "../types";
let cache: { products: Product[]; brands: Brand[] } | null = null; // evita nova "chamada" a cada navegação
export function useCatalog() {
  const [data, setData] = useState(cache);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    Promise.all([getProducts(), getBrands()]).then(([products, brands]) => { cache = { products, brands }; if (!cancelled) setData(cache); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, []);
  return { products: data?.products ?? null, brands: data?.brands ?? [], loading: !data && !error, error };
}
