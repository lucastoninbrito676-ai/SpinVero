import type { CommunityUser } from "../../types";
import Avatar from "../profile/Avatar";
import { Badge, Card } from "../ui";
/** Cabeçalho do perfil público: só dados não sensíveis. */
export default function UserMiniProfile({ user, postsCount }: { user: CommunityUser; postsCount: number }) {
  return (<Card><div className="summary"><Avatar user={user} size={72} />
    <div style={{ flex: 1, minWidth: 200 }}><h1 style={{ margin: 0, fontSize: 30 }}>{user.name}</h1>
      <p style={{ margin: "8px 0" }}><Badge>{user.level ?? "Nível não informado"}</Badge>{user.style && <Badge>{user.style}</Badge>}{user.hand && <Badge>{user.hand}</Badge>}</p>
      {user.goal && <div className="muted">🎯 {user.goal}</div>}<div className="muted">{postsCount} {postsCount === 1 ? "publicação" : "publicações"}</div></div></div></Card>);
}
