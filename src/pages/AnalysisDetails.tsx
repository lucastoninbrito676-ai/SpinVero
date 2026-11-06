import { Link, useNavigate, useParams } from "react-router-dom";
import { useAnalysisRecord } from "../hooks/useAnalysis";
import AnalysisResultView from "../components/analysis/AnalysisResultView";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui";
import { formatDateTime, formatDuration, formatFileSize } from "../utils/format";

export default function AnalysisDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, remove } = useAnalysisRecord(id);
  if (state.status === "loading") return <div className="skel" aria-busy="true" aria-label="Carregando análise" />;
  if (state.status !== "ready") return (<EmptyState title={state.status === "error" ? "Não foi possível carregar a análise." : "Análise não encontrada."} text="Ela pode ter sido excluída ou pertencer a outra conta."><Button to="/analise">Voltar para análises</Button></EmptyState>);
  const { record: r } = state;
  const del = async () => { if (window.confirm("Excluir esta análise do histórico?")) { await remove(); navigate("/analise"); } };
  return (<><Link to="/analise" className="crumbs">← Análises</Link>
    <AnalysisResultView result={r.result}>
      <p className="muted">{formatDateTime(r.createdAt)} · {r.video.name} · {formatFileSize(r.video.size)}{r.video.durationSec != null && ` · ${formatDuration(r.video.durationSec)}`}</p>
      <p className="muted" style={{ fontSize: 13 }}>O vídeo não é armazenado: apenas os dados e o resultado desta análise.</p></AnalysisResultView>
    <div className="row"><Button to="/analise">Nova análise</Button><Button variant="alt" onClick={del}>Excluir análise</Button></div></>);
}
