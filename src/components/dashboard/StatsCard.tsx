import { Card } from "../ui";
interface Props { title: string; value: string; description: string; progress?: number }
export default function StatsCard({ title, value, description, progress }: Props) {
  return (<Card><div className="muted">{title}</div><div className="score">{value}</div><div className="muted" style={{ fontSize: 13 }}>{description}</div>
    {progress != null && <div className="bar" style={{ marginTop: 10 }}><i style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }} /></div>}</Card>);
}
