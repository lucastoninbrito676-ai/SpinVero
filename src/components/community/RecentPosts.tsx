import { Link } from "react-router-dom";
import { useRecentPosts } from "../../hooks/useCommunity";
import PostSummary from "./PostSummary";
/** Publicações recentes de um usuário (usado em /perfil). */
export default function RecentPosts({ userId, limit = 3 }: { userId: string; limit?: number }) {
  const posts = useRecentPosts(limit, userId);
  return (<section className="mt"><h2>Publicações recentes</h2>
    {posts === null ? <div className="skel" style={{ height: 120 }} />
      : posts.length === 0 ? <p className="muted">Você ainda não publicou. <Link to="/comunidade">Iniciar uma conversa</Link></p>
      : <div className="grid">{posts.map((p) => <PostSummary key={p.id} post={p} showAuthor={false} />)}</div>}</section>);
}
