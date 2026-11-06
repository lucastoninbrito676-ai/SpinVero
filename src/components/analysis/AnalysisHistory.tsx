import type { AnalysisRecord } from "../../types";
import { STROKE_LABEL } from "../../utils/analysis";
import { formatDateTime } from "../../utils/format";
import EmptyState from "../ui/EmptyState";
import { Button, Card } from "../ui";
interface Props { records: AnalysisRecord[]; limit?: number; showCta?: boolean }
/** Lista de análises salvas (página /analise e dashboard). */
export default function AnalysisHistory({ records, limit, showCta }: Props) {
  if (!records.length) return <EmptyState title="Nenhuma análise ainda." text="Envie um vídeo para criar seu primeiro registro.">{showCta && <Button to="/analise">Fazer uma análise</Button>}</EmptyState>;
  return (<div className="grid">{records.slice(0, limit).map((r) => <Card key={r.id}>
    <div className="hist">{r.thumbnail ? <img className="thumb" src={r.thumbnail} alt="Miniatura do vídeo analisado" /> : <div className="thumb" role="img" aria-label="Sem miniatura" style={{ display: "grid", placeItems: "center" }}>🎥</div>}
      <div><b>{STROKE_LABEL[r.strokeType]}</b><div className="score" style={{ fontSize: 26 }}>{r.score}<span className="muted">/100</span></div><div className="muted" style={{ fontSize: 13 }}>{formatDateTime(r.createdAt)}</div></div></div>
    <span className="tag">{r.result.provider.simulated ? "Demonstrativa" : "Concluída"}</span>
    <div className="row" style={{ margin: "8px 0 0" }}><Button variant="alt" to={`/analise/${r.id}`} aria-label={`Ver análise de ${STROKE_LABEL[r.strokeType]} de ${formatDateTime(r.createdAt)}`}>Ver análise →</Button></div></Card>)}</div>);
}
