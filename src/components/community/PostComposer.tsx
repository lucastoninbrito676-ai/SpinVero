import { useState, type FormEvent } from "react";
import { useCatalog } from "../../hooks/useCatalog";
import type { NewPost, PostCategory } from "../../types";
import { LIMITS, parseTags, POST_CATEGORIES, POST_CATEGORY_LABEL, validatePost } from "../../utils/community";
import { CATEGORIES, CATEGORY_PLURAL } from "../../utils/product";
import type { Errors } from "../../utils/validation";
import { Button, Card } from "../ui";
import { Field, TextAreaField } from "../ui/Field";

interface Props { onSubmit: (input: Omit<NewPost, "authorId">) => Promise<unknown> }
export default function PostComposer({ onSubmit }: Props) {
  const { products } = useCatalog();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ title: "", content: "", category: "" as PostCategory | "", tags: "", equipmentId: "" });
  const [errors, setErrors] = useState<Errors<"title" | "content" | "category" | "tags">>({});
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const tags = parseTags(f.tags), v = validatePost({ title: f.title, content: f.content, category: f.category, tags });
    setErrors(v); setFormError(""); setDone(false);
    if (Object.keys(v).length) return;
    setBusy(true);
    try {
      await onSubmit({ title: f.title.trim() || undefined, content: f.content, category: f.category as PostCategory, tags, equipmentIds: f.equipmentId ? [f.equipmentId] : [] });
      setF({ title: "", content: "", category: "", tags: "", equipmentId: "" }); setOpen(false); setDone(true);
    } catch { setFormError("Não foi possível publicar. Tente novamente."); } finally { setBusy(false); }
  };
  if (!open) return (<div className="mb">{done && <p className="note" role="status">Publicação criada. Ela aparece no topo do feed.</p>}<Button onClick={() => { setOpen(true); setDone(false); }}>✏️ Criar publicação</Button></div>);
  return (<Card className="mb"><form onSubmit={submit} noValidate aria-label="Nova publicação">
    <Field label="Título (opcional)" name="title" maxLength={LIMITS.title + 20} value={f.title} error={errors.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
    <div className="field"><label htmlFor="category">Categoria</label>
      <select id="category" value={f.category} aria-invalid={!!errors.category} onChange={(e) => setF({ ...f, category: e.target.value as PostCategory | "" })}><option value="">Escolha uma categoria</option>{POST_CATEGORIES.map((c) => <option key={c} value={c}>{POST_CATEGORY_LABEL[c]}</option>)}</select>
      {errors.category && <p className="err" role="alert">{errors.category}</p>}</div>
    <TextAreaField id="content" label="Conteúdo" rows={5} max={LIMITS.content} value={f.content} error={errors.content} onChange={(e) => setF({ ...f, content: e.target.value })} />
    <Field label="Tags (separadas por espaço ou vírgula)" name="tags" placeholder="#backhand #borracha" value={f.tags} error={errors.tags} onChange={(e) => setF({ ...f, tags: e.target.value })} />
    <div className="field"><label htmlFor="equipment">Equipamento relacionado (opcional)</label>
      <select id="equipment" value={f.equipmentId} disabled={!products} onChange={(e) => setF({ ...f, equipmentId: e.target.value })}><option value="">Nenhum</option>
        {CATEGORIES.map((c) => <optgroup key={c} label={CATEGORY_PLURAL[c]}>{(products ?? []).filter((p) => p.category === c).map((p) => <option key={p.id} value={p.id}>{p.brandName} {p.name}</option>)}</optgroup>)}</select></div>
    {formError && <p className="err" role="alert">{formError}</p>}
    <div className="row" style={{ marginBottom: 0 }}><Button type="submit" disabled={busy}>{busy ? "Publicando..." : "Publicar"}</Button><Button type="button" variant="alt" onClick={() => setOpen(false)}>Cancelar</Button></div></form></Card>);
}
