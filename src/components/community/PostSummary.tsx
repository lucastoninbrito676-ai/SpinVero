import { Link } from "react-router-dom";
import type { Post } from "../../types";
import { excerpt, POST_CATEGORY_LABEL } from "../../utils/community";
import { relativeDay } from "../../utils/format";
import Avatar from "../profile/Avatar";
import { Badge, Card } from "../ui";
/** Versão compacta de um post (Home, perfil, dashboard). */
export default function PostSummary({ post: p, showAuthor = true }: { post: Post; showAuthor?: boolean }) {
  return (<Card>{showAuthor && <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar user={p.author} size={32} /><span><b>{p.author.name}</b> <span className="muted">· {p.author.level ?? "Atleta"}</span></span></div>}
    <p style={{ margin: "8px 0 0" }}><Badge>{POST_CATEGORY_LABEL[p.category]}</Badge> <span className="muted" style={{ fontSize: 13 }}>{relativeDay(p.createdAt)}</span></p>
    <h3 style={{ margin: ".4em 0" }}><Link to={`/comunidade/post/${p.id}`}>{p.title ?? excerpt(p.content, 60)}</Link></h3>
    <div className="muted">♥ {p.likesCount} · 💬 {p.commentsCount}</div></Card>);
}
