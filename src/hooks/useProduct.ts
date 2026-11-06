import { useEffect, useState } from "react";
import { getProductById, getRacketComponents, getRelatedProducts } from "../services/products/productService";
import type { Product } from "../types";
type Components = Awaited<ReturnType<typeof getRacketComponents>>;
type State = { status: "loading" | "notfound" | "error" } | { status: "ready"; product: Product; related: Awaited<ReturnType<typeof getRelatedProducts>>; components?: Components };
/** Produto por id + relacionados (e componentes, se for raquete montada), tudo via ProductService. */
export function useProduct(id: string | undefined): State {
  const [state, setState] = useState<State>({ status: "loading" });
  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    (async () => {
      const product = id ? await getProductById(id) : null;
      if (!product) return cancelled ? undefined : setState({ status: "notfound" });
      const [related, components] = await Promise.all([getRelatedProducts(product), product.category === "racket" ? getRacketComponents(product) : Promise.resolve(undefined)]);
      if (!cancelled) setState({ status: "ready", product, related, components });
    })().catch(() => { if (!cancelled) setState({ status: "error" }); });
    return () => { cancelled = true; };
  }, [id]);
  return state;
}
