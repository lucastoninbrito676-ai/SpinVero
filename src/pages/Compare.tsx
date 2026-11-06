import { Link } from "react-router-dom";
import { useCatalog } from "../hooks/useCatalog";
import { useScoringProfile } from "../context/ProfileContext";
import { useShortlist } from "../context/ShortlistContext";
import { MIN_COMPARE } from "../services/products/comparisonService";
import { scoreProduct } from "../services/recommendation/recommendationService";
import { formatPrice } from "../utils/format";
import { CATEGORY_PLURAL, getSpecRows, hasPerformance } from "../utils/product";
import type { Product } from "../types";
import ProductImage from "../components/products/ProductImage";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui";

interface Row { label: string; cell: (p: Product) => string; num?: (p: Product) => number | undefined }
export default function Compare() {
  const { products, loading } = useCatalog();
  const { compare, removeCompare, clearCompare } = useShortlist();
  const scoring = useScoringProfile();
  if (loading) return <div className="skel" aria-busy="true" />;
  const found = compare.map((id) => products?.find((p) => p.id === id)).filter((p): p is Product => !!p);
  const items = found.filter((p) => p.category === found[0].category); // só categoria igual à do primeiro item
  if (items.length < MIN_COMPARE) return (<EmptyState title="Selecione ao menos 2 equipamentos." text="Use o botão Comparar nos cards do catálogo para escolher de 2 a 3 produtos da mesma categoria."><Button to="/equipamentos">Ir para equipamentos</Button></EmptyState>);

  // Linhas de especificação vêm do próprio modelo da categoria; as demais são comuns.
  const spec = (label: string) => (p: Product) => getSpecRows(p).find((r) => r.label === label);
  const rows: Row[] = [
    { label: "Preço", cell: (p) => formatPrice(p.price), num: (p) => p.price },
    { label: "Avaliação", cell: (p) => `${p.rating.toFixed(1)} (${p.reviewCount})`, num: (p) => p.rating },
    ...getSpecRows(items[0]).map((r) => ({ label: r.label, cell: (p: Product) => spec(r.label)(p)?.value ?? "—", num: (p: Product) => spec(r.label)(p)?.num })),
    ...(scoring ? [{ label: "Compatibilidade", cell: (p: Product) => (hasPerformance(p) ? `${scoreProduct(p, scoring).fit}%` : "—"), num: (p: Product) => (hasPerformance(p) ? scoreProduct(p, scoring).fit : undefined) }] : []),
    { label: "Nível", cell: (p) => (p.recommendation.levels.length === 4 ? "Todos" : p.recommendation.levels.join(", ")) },
    { label: "Estilo", cell: (p) => p.recommendation.styles.join(", ") || "—" },
  ];
  return (<div className="cmp" style={{ ["--n" as string]: items.length }}>
    <h1>Comparar {CATEGORY_PLURAL[items[0].category].toLowerCase()}</h1>
    <p className="muted">O destaque marca o maior valor de cada linha com diferença; não indica o melhor para você.</p>
    <div className="cmp-row"><b aria-hidden="true" />{items.map((p) => <div key={p.id} className="cell"><ProductImage product={p} /><Link to={`/equipamentos/${p.id}`}><b>{p.name}</b></Link><div className="muted">{p.brandName}</div>
      <button type="button" className="btn alt" onClick={() => removeCompare(p.id)} aria-label={`Remover ${p.name} da comparação`}>Remover</button></div>)}</div>
    {rows.map((r) => {
      const nums = items.map((p) => r.num?.(p)), defined = nums.filter((n): n is number => n != null);
      const differs = defined.length > 1 && new Set(defined).size > 1, max = Math.max(...defined);
      return (<div key={r.label} className={`cmp-row ${differs ? "diff" : ""}`}><b>{r.label}</b>
        {items.map((p, i) => <div key={p.id} className={`cell ${differs && nums[i] === max ? "max" : ""}`}><small>{p.brandName} {p.name}</small>{r.cell(p)}</div>)}</div>);
    })}
    <div className="row"><Button variant="alt" onClick={clearCompare}>Limpar comparação</Button><Button variant="alt" to="/equipamentos">Voltar ao catálogo</Button></div></div>);
}
