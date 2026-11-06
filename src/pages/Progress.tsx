import { areaScores, progressHistory } from "../data/analysis/progress";
import { Card, ScoreCard } from "../components/ui";
import ProgressChart from "../components/ui/ProgressChart";
export default function Progress() {
  const scores = progressHistory.map((e) => e.score), last = scores[scores.length - 1], gain = last - scores[0];
  return (<><h1>Progresso</h1><p className="sub">Dados fictícios de exemplo.</p>
    <div className="grid" style={{ margin: "20px 0" }}><ScoreCard label="Última análise" value={last} /><ScoreCard label="Melhor score" value={Math.max(...scores)} /><ScoreCard label="Evolução total (pts)" value={gain} /><ScoreCard label="Análises" value={scores.length} /></div>
    <Card><h3>Score geral por semana</h3><ProgressChart values={scores} /><p className="note">Seu score geral subiu {gain} pontos desde a primeira análise.</p></Card>
    <h2>Por área</h2><div className="grid">{Object.entries(areaScores).map(([k, v]) => <ScoreCard key={k} label={k} value={v} />)}</div></>);
}
