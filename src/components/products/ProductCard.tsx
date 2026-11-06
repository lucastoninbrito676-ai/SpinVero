import type { Product } from "../../types";
import { useShortlist } from "../../context/ShortlistContext";
import { formatPrice } from "../../utils/format";
import { CATEGORY_LABEL, getPerformance } from "../../utils/product";
import { Badge, Button, Card, ProgressBar } from "../ui";
import ProductImage from "./ProductImage";
import Stars from "./Stars";

interface Props { product: Product; fit?: number; reasons?: string[]; ctaLabel?: string }
/** Recebe um Product e não sabe de onde ele veio (mock, API...). Mostra só os atributos que o produto tem. */
export default function ProductCard({ product: p, fit, reasons, ctaLabel = "Ver detalhes" }: Props) {
  const { isFavorite, isCompared, toggleFavorite, toggleCompare } = useShortlist();
  const fav = isFavorite(p.id), cmp = isCompared(p.id), perf = getPerformance(p), unavailable = p.availability === "out-of-stock";
  return (<Card className="pcard">
    <div className="pimg"><ProductImage product={p} />
      <button type="button" className="heart" aria-pressed={fav} aria-label={fav ? `Remover ${p.name} dos favoritos` : `Favoritar ${p.name}`} onClick={() => toggleFavorite(p)}>{fav ? "♥" : "♡"}</button></div>
    <p style={{ margin: "10px 0 0" }}><Badge>{p.brandName}</Badge><Badge>{CATEGORY_LABEL[p.category]}</Badge>{unavailable && <Badge>Indisponível</Badge>}{p.availability === "low-stock" && <Badge>Poucas unidades</Badge>}</p>
    <h3 style={{ margin: ".3em 0" }}>{p.name}</h3><Stars rating={p.rating} count={p.reviewCount} />
    <div className="price">{formatPrice(p.price)}</div>
    {perf.speed != null && <ProgressBar label="Velocidade" value={perf.speed} />}
    {perf.control != null && <ProgressBar label="Controle" value={perf.control} />}
    {perf.spin != null && <ProgressBar label="Spin" value={perf.spin} />}
    {fit != null && <div className="fit">{fit}% <span className="muted">compatível</span></div>}
    {reasons && <ul className="muted">{reasons.map((r) => <li key={r}>{r}</li>)}</ul>}
    <div className="row" style={{ margin: "8px 0 0" }}><Button to={`/equipamentos/${p.id}`}>{ctaLabel}</Button>
      <Button variant="alt" className={cmp ? "on" : ""} aria-pressed={cmp} onClick={() => toggleCompare(p)}>{cmp ? "✓ Comparando" : "Comparar"}</Button></div></Card>);
}
