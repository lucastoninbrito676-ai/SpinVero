import { Link } from "react-router-dom";
import type { Comment } from "../../types";
import { formatDate, relativeDay } from "../../utils/format";
import Avatar from "../profile/Avatar";
export default function CommentItem({ comment: c }: { comment: Comment }) {
  return (<li className="cm"><Avatar user={c.author} size={32} />
    <div style={{ minWidth: 0 }}><Link to={`/perfil/${c.authorId}`}><b>{c.author.name}</b></Link> <span className="muted" style={{ fontSize: 13 }}>· {c.author.level ?? "Atleta"} · <time dateTime={c.createdAt} title={formatDate(c.createdAt)}>{relativeDay(c.createdAt)}</time></span>
      <p style={{ margin: "4px 0 0", whiteSpace: "pre-line" }}>{c.content}</p></div></li>);
}
