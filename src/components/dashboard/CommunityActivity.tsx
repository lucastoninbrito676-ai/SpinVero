import { useCommunityActivity } from "../../hooks/useCommunity";
import PostSummary from "../community/PostSummary";
import { Button, Card } from "../ui";
/** Bloco discreto: números do usuário e, se ele ainda não publicou, discussões recentes. */
export default function CommunityActivity({ userId }: { userId: string }) {
  const a = useCommunityActivity(userId);
  if (!a) return <div className="skel" style={{ height: 140 }} />;
  const list = a.mine.length ? a.mine.slice(0, 2) : a.recent.slice(0, 2);
  return (<Card><span className="eyebrow">Atividade da comunidade</span>
    <p className="muted" style={{ margin: "6px 0" }}>{a.mine.length} {a.mine.length === 1 ? "publicação sua" : "publicações suas"} · {a.commentsReceived} {a.commentsReceived === 1 ? "comentário recebido" : "comentários recebidos"}</p>
    <div className="grid" style={{ margin: "12px 0" }}>{list.map((p) => <PostSummary key={p.id} post={p} showAuthor={!a.mine.length} />)}</div>
    <Button variant="alt" to="/comunidade">Ir para a comunidade</Button></Card>);
}
