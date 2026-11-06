import { Card } from "../ui";
interface Props { strengths: string[]; weaknesses: string[]; recommendations: string[] }
export default function TechniqueFeedback({ strengths, weaknesses, recommendations }: Props) {
  return (<><h2>Principais pontos</h2><div className="grid">
    <Card><b>Pontos positivos</b>{strengths.length ? <ul>{strengths.map((s) => <li key={s}>✓ {s}</li>)}</ul> : <p className="muted">Nenhum ponto de destaque nesta análise.</p>}</Card>
    <Card><b>A melhorar</b>{weaknesses.length ? <ul>{weaknesses.map((s) => <li key={s}>• {s}</li>)}</ul> : <p className="muted">Nenhum ponto crítico identificado.</p>}</Card></div>
    <h2>Próximos passos</h2><Card><ol style={{ margin: 0, paddingLeft: 20 }}>{recommendations.map((r) => <li key={r}>{r}</li>)}</ol></Card></>);
}
