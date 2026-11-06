import type { TechniqueMetric as Metric } from "../../types";
import { METRIC_LABEL, STATUS_CLASS, STATUS_LABEL } from "../../utils/analysis";
import { Card } from "../ui";
export default function TechniqueMetric({ metric: m }: { metric: Metric }) {
  return (<Card className={`sev ${STATUS_CLASS[m.status]}`}><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><b>{METRIC_LABEL[m.key]}</b><span className="tag">{STATUS_LABEL[m.status]}</span></div>
    <div className="score">{m.score}<span className="muted">/100</span></div><div className="bar"><i style={{ width: `${m.score}%` }} /></div>
    <p className="muted" style={{ margin: "6px 0" }}>{m.explanation}</p><p style={{ margin: 0 }}><b>Dica:</b> {m.feedback}</p></Card>);
}
