import type { ComponentScore } from "../../types/advancedRecommendation";
import { Card } from "../ui";

export default function ComponentSubstitutes({ title, items }: { title: string; items: ComponentScore[] }) {
  if (!items.length) return null;
  return <Card><span className="eyebrow">Substitutos · {title}</span><ul className="tl">{items.map((s) => <li key={s.product.id}><div style={{flex:1}}><b>{s.product.name}</b><span className="muted"> · {s.product.brandName}</span></div><b>{Math.round(s.score * 100)}%</b></li>)}</ul></Card>;
}
