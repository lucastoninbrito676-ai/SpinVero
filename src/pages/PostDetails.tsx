import { Link, useNavigate, useParams } from "react-router-dom";
import { usePost } from "../hooks/useCommunity";
import CommentList from "../components/community/CommentList";
import PostCard from "../components/community/PostCard";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const s = usePost(id);
  if (s.status === "loading") return <div className="skel" aria-busy="true" aria-label="Carregando publicação" />;
  if (s.status !== "ready" || !s.post) return (<EmptyState title={s.status === "error" ? "Não foi possível carregar a publicação." : "Publicação não encontrada."} text="Ela pode ter sido removida ou o endereço está incorreto."><Button to="/comunidade">Voltar para a comunidade</Button></EmptyState>);
  return (<>
    <nav aria-label="Navegação" className="crumbs"><Link to="/comunidade">← Voltar para a comunidade</Link></nav>
    <div className="mt"><PostCard full post={s.post} currentUserId={s.user?.id} onLike={s.toggleLike} onReport={s.report} onDelete={async () => { await s.remove(); navigate("/comunidade"); }} /></div>
    <CommentList comments={s.comments} canComment={!!s.user} onSubmit={s.addComment} /></>);
}
