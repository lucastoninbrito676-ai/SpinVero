import { Button, Card } from "../ui";
interface Props { goal?: string; progress: number }
/** O texto vem do perfil; o percentual é mock até existir um sistema de metas. */
export default function GoalCard({ goal, progress }: Props) {
  return (<Card><h3 style={{ marginTop: 0 }}>🎯 Meu objetivo</h3>
    {goal ? <><p><b>{goal}</b></p><div className="lbl"><span>Progresso</span><span>{progress}%</span></div><div className="bar"><i style={{ width: `${progress}%` }} /></div><p className="muted" style={{ fontSize: 13 }}>{progress}% concluído</p></>
      : <p className="muted">Você ainda não definiu um objetivo.</p>}
    <Button variant="alt" to="/perfil">{goal ? "Editar objetivo" : "Definir objetivo"}</Button></Card>);
}
