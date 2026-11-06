import type { Blade, Rubber } from "../../types";
import ProductImage from "../products/ProductImage";
import { Badge, Button, Card, ProgressBar } from "../ui";
import type { ComponentScore } from "../../types/advancedRecommendation";

export default function SetupComponentCard({ title, item, score }: { title: string; item: Blade | Rubber; score: ComponentScore }) {
  return <Card>
    <span className="eyebrow">{title}</span>
    <div className="setup-component">
      <ProductImage product={item} />
      <div><div className="muted">{item.brandName}</div><h3>{item.name}</h3><div className="price">R$ {item.price.toLocaleString("pt-BR")}</div></div>
    </div>
    <ProgressBar label="Compatibilidade" value={Math.round(score.score * 100)} max={100} />
    <p className="muted">{score.reasons[1]?.text ?? score.reasons[0]?.text}</p>
    <Button variant="alt" to={`/equipamentos/${item.id}`}>Ver produto</Button>
  </Card>;
}
