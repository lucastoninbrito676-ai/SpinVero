import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import type { Comment } from "../../types";
import { LIMITS, validateComment } from "../../utils/community";
import { Button } from "../ui";
import { TextAreaField } from "../ui/Field";
import CommentItem from "./CommentItem";

interface Props { comments: Comment[]; canComment: boolean; onSubmit: (content: string) => Promise<void> }
export default function CommentList({ comments, canComment, onSubmit }: Props) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = validateComment(text); setError(err);
    if (err) return;
    setBusy(true);
    try { await onSubmit(text); setText(""); } catch { setError("Não foi possível comentar. Tente novamente."); } finally { setBusy(false); }
  };
  return (<section aria-label="Comentários"><h2>💬 {comments.length} {comments.length === 1 ? "comentário" : "comentários"}</h2>
    {comments.length === 0 ? <p className="muted">Nenhum comentário ainda. Seja o primeiro a comentar.</p> : <ul className="tl">{comments.map((c) => <CommentItem key={c.id} comment={c} />)}</ul>}
    {canComment
      ? <form onSubmit={submit} noValidate><TextAreaField id="comment" label="Escreva um comentário" rows={3} max={LIMITS.comment} value={text} error={error} onChange={(e) => setText(e.target.value)} /><Button type="submit" disabled={busy}>{busy ? "Enviando..." : "Comentar"}</Button></form>
      : <p className="note"><Link to="/login" state={{ from: window.location.pathname }}>Entre</Link> para comentar.</p>}</section>);
}
