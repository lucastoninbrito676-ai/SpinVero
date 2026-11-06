import type { ProgressStage } from "../../types";
import { Card } from "../ui";
const TEXT: Record<ProgressStage, string> = { uploading: "Preparando o vídeo...", processing: "Processando o vídeo...", analyzing: "Analisando seu movimento..." };
export default function AnalysisProgress({ stage, percent }: { stage: ProgressStage; percent: number }) {
  return (<Card><div role="status" aria-live="polite"><b>{TEXT[stage]}</b></div>
    <div className="prog" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso da análise" style={{ margin: "12px 0" }}><i style={{ width: `${percent}%` }} /></div>
    <p className="muted" style={{ margin: 0, fontSize: 13 }}>Etapas simuladas: nesta versão o vídeo não é enviado a nenhum servidor.</p></Card>);
}
