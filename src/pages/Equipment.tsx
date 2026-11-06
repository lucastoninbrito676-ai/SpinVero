import { useMemo, useState } from "react";
import { useCatalog } from "../hooks/useCatalog";
import { useScoringProfile } from "../context/ProfileContext";
import { useShortlist } from "../context/ShortlistContext";
import { DEFAULT_FILTERS, getFilterOptions, queryProducts } from "../services/products/productService";
import { scoreProduct } from "../services/recommendation/recommendationService";
import { hasPerformance } from "../utils/product";
import type { CatalogFilters, SortKey } from "../types";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/products/ProductFilters";
import ProductSkeleton from "../components/products/ProductSkeleton";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui";

export default function Equipment() {
  const { products, loading, error } = useCatalog();
  const scoring = useScoringProfile();
  const { favorites } = useShortlist();
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("relevance");
  const options = useMemo(() => getFilterOptions(products ?? []), [products]);
  // Compatibilidade calculada uma vez por produto/perfil; alimenta ordenação por relevância e os cards.
  const fits = useMemo(() => new Map((products ?? []).filter((p) => scoring && hasPerformance(p)).map((p) => [p.id, scoreProduct(p, scoring!).fit])), [products, scoring]);
  const results = useMemo(() => (products ? queryProducts(products, filters, sort, { favorites, fits }) : []), [products, filters, sort, favorites, fits]);
  const clear = () => { setFilters(DEFAULT_FILTERS); setSort("relevance"); };

  return (<><h1>Equipamentos</h1><p className="sub">Encontre o equipamento ideal para seu jogo.</p>
    <p className="note">Catálogo de demonstração: nomes de modelos e especificações são fictícios e não representam produtos oficiais das marcas.</p>
    <div className="mt"><ProductFilters filters={filters} onChange={(patch) => setFilters({ ...filters, ...patch })} sort={sort} onSort={setSort} options={options} favoritesCount={favorites.length} onClear={clear} /></div>
    {error && <p className="note" role="alert">Não foi possível carregar o catálogo. Tente atualizar a página.</p>}
    {loading && <div className="mt"><ProductSkeleton /></div>}
    {products && <>
      <p className="muted" role="status" aria-live="polite" style={{ margin: "16px 0 8px" }}>{results.length} {results.length === 1 ? "equipamento encontrado" : "equipamentos encontrados"}</p>
      {results.length === 0
        ? <EmptyState title="Nenhum equipamento encontrado." text={filters.favoritesOnly && !favorites.length ? "Você ainda não favoritou nenhum equipamento." : "Tente alterar os filtros ou realizar uma nova busca."}><Button onClick={clear}>Limpar filtros</Button></EmptyState>
        : <div className="grid">{results.map((p) => <ProductCard key={p.id} product={p} fit={fits.get(p.id)} />)}</div>}</>}</>);
}
