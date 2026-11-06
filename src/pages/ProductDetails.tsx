import { Link, useParams } from "react-router-dom";
import { useProduct } from "../hooks/useProduct";
import { useScoringProfile } from "../context/ProfileContext";
import { useShortlist } from "../context/ShortlistContext";
import { scoreProduct } from "../services/recommendation/recommendationService";
import { formatPrice } from "../utils/format";
import { CATEGORY_LABEL, getPerformance, getSpecRows, hasPerformance } from "../utils/product";
import type { Product } from "../types";
import ProductCard from "../components/products/ProductCard";
import ProductGallery from "../components/products/ProductGallery";
import Stars from "../components/products/Stars";
import CompatibilityScore from "../components/recommendation/CompatibilityScore";
import EmptyState from "../components/ui/EmptyState";
import { Badge, Button, Card, ProgressBar } from "../components/ui";

const AVAILABILITY = { "in-stock": "Disponível", "low-stock": "Poucas unidades", "out-of-stock": "Indisponível" } as const;
const Related = ({ title, items }: { title: string; items: Product[] }) => items.length ? <><h2>{title}</h2><div className="grid">{items.map((s) => <ProductCard key={s.id} product={s} />)}</div></> : null;

export default function ProductDetails() {
  const { id } = useParams();
  const state = useProduct(id);
  const scoring = useScoringProfile();
  const { isFavorite, isCompared, toggleFavorite, toggleCompare } = useShortlist();

  if (state.status === "loading") return <div className="skel" aria-busy="true" aria-label="Carregando equipamento" />;
  if (state.status !== "ready") return (<EmptyState title={state.status === "error" ? "Não foi possível carregar o equipamento." : "Equipamento não encontrado."} text="Talvez ele tenha sido removido ou o endereço esteja incorreto."><Button to="/equipamentos">Voltar para equipamentos</Button></EmptyState>);

  const { product: p, related, components } = state;
  const perf = getPerformance(p), rec = scoring && hasPerformance(p) ? scoreProduct(p, scoring) : null;
  const fav = isFavorite(p.id), cmp = isCompared(p.id);
  return (<>
    <nav aria-label="Navegação" className="crumbs"><Link to="/equipamentos">← Voltar</Link> · <Link to="/equipamentos">Equipamentos</Link> / {p.name}</nav>
    <div className="split" style={{ marginTop: 16, alignItems: "start" }}><ProductGallery product={p} />
      <div><span className="eyebrow">{p.brandName} · {CATEGORY_LABEL[p.category]}</span><h1 style={{ margin: ".1em 0" }}>{p.name}</h1><Stars rating={p.rating} count={p.reviewCount} />
        <div className="num">{formatPrice(p.price)}</div>
        <p><Badge>{AVAILABILITY[p.availability]}</Badge></p><p className="muted">{p.description}</p>
        {perf.speed != null && <ProgressBar label="Velocidade" value={perf.speed} />}{perf.control != null && <ProgressBar label="Controle" value={perf.control} />}{perf.spin != null && <ProgressBar label="Spin" value={perf.spin} />}
        {p.recommendation.styles.length > 0 && <><b>Indicado para:</b><ul>{p.recommendation.levels.length < 4 && <li>✓ Jogadores {p.recommendation.levels.join(", ").toLowerCase()}</li>}{p.recommendation.styles.map((s) => <li key={s}>✓ Estilo {s.toLowerCase()}</li>)}</ul></>}
        <p>{p.tags.map((t) => <span key={t} className="tag">{t}</span>)}</p>
        <div className="row"><Button variant="alt" aria-pressed={fav} onClick={() => toggleFavorite(p)}>{fav ? "♥ Favoritado" : "♡ Favoritar"}</Button>
          <Button variant="alt" className={cmp ? "on" : ""} aria-pressed={cmp} onClick={() => toggleCompare(p)}>{cmp ? "✓ Na comparação" : "Adicionar à comparação"}</Button></div></div></div>
    <Card className="mt"><b>Especificações</b><dl className="specs">{getSpecRows(p).map((r) => <div key={r.label}><dt>{r.label}</dt><dd>{r.value}</dd></div>)}</dl>
      <p className="muted" style={{ fontSize: 13 }}>Fonte dos dados: {p.source.name}{p.source.url && <> — <a href={p.source.url} rel="noreferrer noopener">link</a></>}.</p></Card>
    {p.category === "racket" && components && <Card className="mt"><b>Componentes</b><ul>
      {([["Madeira", components.blade], ["Borracha de forehand", components.forehandRubber], ["Borracha de backhand", components.backhandRubber]] as const).map(([label, c]) => <li key={label}>{label}: {c ? <Link to={`/equipamentos/${c.id}`}>{c.name}</Link> : "indisponível"}</li>)}</ul></Card>}
    <Card className="mt"><b>Compatibilidade com seu perfil</b>
      {rec ? <><div className="fit">{rec.fit}%</div><p>{rec.summary}</p><ul>{rec.reasons.map((r) => <li key={r}>✓ {r}</li>)}</ul><CompatibilityScore breakdown={rec.breakdown} /></>
        : hasPerformance(p) ? <p className="muted">Defina nível e estilo no <Link to="/perfil">perfil</Link> ou faça o <Link to="/raquete-ideal">questionário</Link> para ver a compatibilidade.</p>
        : <p className="muted">Compatibilidade não se aplica a acessórios.</p>}</Card>
    <Related title="Produtos semelhantes" items={related.similar} /><Related title={`Mais da ${p.brandName}`} items={related.sameBrand} /></>);
}
