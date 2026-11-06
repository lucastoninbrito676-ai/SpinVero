import { useShortlist } from "../../context/ShortlistContext";
import type { Recommendation } from "../../types";
import ProductImage from "../products/ProductImage";
import { Badge, Button, Card } from "../ui";
import CompatibilityScore from "./CompatibilityScore";
export default function RecommendationCard({ rec, highlight }: { rec: Recommendation; highlight?: boolean }) {
  const { isFavorite } = useShortlist();
  const p = rec.product;
  return (<Card>{highlight && <span className="eyebrow">🥇 Melhor compatibilidade</span>}
    <div className="split" style={{ margin: "12px 0" }}><ProductImage product={p} />
      <div><div className="muted">{p.brandName}</div><h2 style={{ margin: ".1em 0" }}>{p.name}</h2>{isFavorite(p.id) && <Badge>♥ Favoritado</Badge>}
        <div className="fit">{rec.fit}% <span className="muted">de compatibilidade</span></div></div></div>
    <p>{rec.summary}</p>
    <b>Por que combina:</b><ul>{rec.reasons.map((r) => <li key={r}>✓ {r}</li>)}</ul>
    <CompatibilityScore breakdown={rec.breakdown} />
    <div className="row"><Button to={`/equipamentos/${p.id}`}>Ver produto</Button></div></Card>);
}
