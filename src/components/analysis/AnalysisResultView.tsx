import type { ReactNode } from "react";
import type { AnalysisResult } from "../../types";
import { STROKE_LABEL } from "../../utils/analysis";
import TechniqueFeedback from "./TechniqueFeedback";
import TechniqueMetric from "./TechniqueMetric";
import TechniqueScore from "./TechniqueScore";
/** Exibe um AnalysisResult de qualquer provedor; o aviso aparece sempre que `provider.simulated` for true. */
export default function AnalysisResultView({ result: r, children }: { result: AnalysisResult; children?: ReactNode }) {
  return (<section aria-label="Resultado da análise">
    {r.provider.simulated && <p className="note" role="note"><b>Análise demonstrativa.</b> {r.notice} Os valores abaixo não foram calculados a partir do seu vídeo.</p>}
    <h2>Análise de {STROKE_LABEL[r.strokeType].toLowerCase()}</h2>{children}
    <div className="mt"><TechniqueScore value={r.techniqueScore} /></div>
    <h2>Métricas</h2><div className="grid">{r.movementMetrics.map((m) => <TechniqueMetric key={m.key} metric={m} />)}</div>
    <TechniqueFeedback strengths={r.strengths} weaknesses={r.weaknesses} recommendations={r.recommendations} /></section>);
}
