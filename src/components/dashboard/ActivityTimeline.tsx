import { Card } from "../ui";
import { relativeDay } from "../../utils/format";
import type { Activity, ActivityKind } from "../../types";
const ICON: Record<ActivityKind, string> = { profile: "✓", analysis: "🎥", progress: "📈", goal: "🎯" };
export default function ActivityTimeline({ items }: { items: Activity[] }) {
  return (<Card><h3 style={{ marginTop: 0 }}>Atividades recentes</h3><ul className="tl">
    {items.map((a) => <li key={a.id}><span aria-hidden="true">{ICON[a.kind]}</span><div><small>{relativeDay(a.date)}</small>{a.label}</div></li>)}</ul></Card>);
}
