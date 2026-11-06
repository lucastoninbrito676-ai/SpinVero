import type { RecommendationReason } from "../../types/advancedRecommendation";
import { Card } from "../ui";
export default function RecommendationReasons({ reasons }: { reasons: RecommendationReason[] }) {
  return <Card><span className="eyebrow">Por que recomendamos?</span><ul>{reasons.map((r, i) => <li key={`${r.type}-${i}`}>{r.text}{r.simulated ? <span className="tag">Demonstrativo</span> : null}</li>)}</ul></Card>;
}
