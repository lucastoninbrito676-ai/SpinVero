import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUserProfile } from "../hooks/useCommunity";
import PostSummary from "../components/community/PostSummary";
import UserMiniProfile from "../components/community/UserMiniProfile";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui";

/** Perfil público (/perfil/:id). O perfil privado do usuário logado continua em /perfil. */
export default function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const s = useUserProfile(id);
  if (s.status === "loading") return <div className="skel" aria-busy="true" aria-label="Carregando perfil" />;
  if (s.status !== "ready") return (<EmptyState title={s.status === "error" ? "Não foi possível carregar o perfil." : "Atleta não encontrado."} text="O perfil pode não existir mais."><Button to="/comunidade">Voltar para a comunidade</Button></EmptyState>);
  return (<><Link to="/comunidade" className="crumbs">← Comunidade</Link>
    <div className="mt"><UserMiniProfile user={s.profile} postsCount={s.posts.length} /></div>
    {user?.id === s.profile.id && <p className="mt"><Link className="btn alt" to="/perfil">Editar meu perfil</Link></p>}
    <h2>Publicações recentes</h2>
    {s.posts.length === 0 ? <EmptyState title="Nenhuma publicação ainda." text={`${s.profile.name} ainda não publicou na comunidade.`} />
      : <div className="grid">{s.posts.slice(0, 6).map((p) => <PostSummary key={p.id} post={p} showAuthor={false} />)}</div>}</>);
}
