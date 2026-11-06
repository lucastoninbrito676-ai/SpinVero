import { Link } from "react-router-dom";
import type { Post } from "../../types";
import { excerpt, POST_CATEGORY_LABEL } from "../../utils/community";
import { formatDate, relativeDay } from "../../utils/format";
import Avatar from "../profile/Avatar";
import { Badge, Button, Card } from "../ui";
import RelatedEquipment from "./RelatedEquipment";

interface Props {
  post: Post; currentUserId?: string; full?: boolean;
  onLike: (id: string) => void; onDelete?: (id: string) => void; onReport?: (id: string) => void; onTagClick?: (tag: string) => void;
}
export default function PostCard({ post: p, currentUserId, full, onLike, onDelete, onReport, onTagClick }: Props) {
  const own = !!currentUserId && p.authorId === currentUserId;
  const postUrl = `/comunidade/post/${p.id}`;
  const confirmDelete = () => { if (window.confirm("Excluir esta publicação? Os comentários também serão removidos.")) onDelete?.(p.id); };
  return (<Card className="mb"><article>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}><Avatar user={p.author} size={40} />
      <div style={{ minWidth: 0 }}><Link to={`/perfil/${p.authorId}`}><b>{p.author.name}</b></Link> <span className="muted">· {p.author.level ?? "Atleta"} · <time dateTime={p.createdAt} title={formatDate(p.createdAt)}>{relativeDay(p.createdAt)}</time></span>
        <div><Badge>{POST_CATEGORY_LABEL[p.category]}</Badge></div></div></div>
    {p.title && <h3>{full ? p.title : <Link to={postUrl}>{p.title}</Link>}</h3>}
    <p className="muted" style={{ whiteSpace: "pre-line" }}>{full ? p.content : excerpt(p.content)}</p>
    {p.tags.length > 0 && <p>{p.tags.map((t) => onTagClick ? <button key={t} type="button" className="tag taglink" onClick={() => onTagClick(t)}>#{t}</button> : <span key={t} className="tag">#{t}</span>)}</p>}
    <RelatedEquipment ids={p.equipmentIds} />
    <div className="post-actions">
      <Button variant="alt" aria-pressed={!!p.likedByCurrentUser} aria-label={`${p.likedByCurrentUser ? "Descurtir" : "Curtir"} (${p.likesCount} curtidas)`} onClick={() => onLike(p.id)}>{p.likedByCurrentUser ? "❤️" : "🤍"} {p.likesCount}</Button>
      <Button variant="alt" to={postUrl} aria-label={`Comentar (${p.commentsCount} comentários)`}>💬 {p.commentsCount}</Button>
      {!full && <Link to={postUrl} className="muted">Ver discussão</Link>}
      {own && onDelete && <Button variant="alt" onClick={confirmDelete}>Excluir minha publicação</Button>}
      {!own && onReport && (p.reportedByCurrentUser ? <span className="muted">Denúncia registrada</span> : <Button variant="alt" onClick={() => onReport(p.id)}>Denunciar</Button>)}
    </div></article></Card>);
}
