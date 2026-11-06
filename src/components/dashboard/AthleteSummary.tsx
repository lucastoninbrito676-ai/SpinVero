import { Link } from "react-router-dom";
import Avatar from "../profile/Avatar";
import { Badge, Card } from "../ui";
import type { AthleteProfile, User } from "../../types";
/** Lê usuário (AuthContext) e perfil (ProfileContext); não guarda cópia dos dados. */
export default function AthleteSummary({ user, athlete }: { user: User; athlete: AthleteProfile }) {
  const incomplete = !(athlete.level && athlete.style && athlete.hand && athlete.goal);
  return (<Card><div className="summary"><Avatar user={user} size={72} />
    <div style={{ flex: 1, minWidth: 200 }}><h2 style={{ margin: 0 }}>{user.name}</h2>
      <p style={{ margin: "8px 0" }}><Badge>{athlete.level ?? "Nível não definido"}</Badge><Badge>{athlete.style ?? "Estilo não definido"}</Badge><Badge>{athlete.hand ?? "Mão não definida"}</Badge></p>
      <div className="muted">🎯 {athlete.goal ?? "Objetivo não definido"}</div></div>
    {incomplete && <Link className="btn alt" to="/perfil">Completar perfil</Link>}</div></Card>);
}
