import { SORT_LABELS } from "../../services/community/communityService";
import type { CommunityFilters as Filters, CommunitySort, PostCategory } from "../../types";
import { POST_CATEGORIES, POST_CATEGORY_LABEL } from "../../utils/community";
interface Props { filters: Filters; onChange: (patch: Partial<Filters>) => void; popularTags: string[] }
export default function CommunityFilters({ filters: f, onChange, popularTags }: Props) {
  const cats: (PostCategory | "")[] = ["", ...POST_CATEGORIES];
  return (<div>
    <div className="chips" role="group" aria-label="Categoria">{cats.map((c) => <button key={c || "all"} type="button" className={f.category === c ? "on" : ""} aria-pressed={f.category === c} onClick={() => onChange({ category: c })}>{c ? POST_CATEGORY_LABEL[c] : "Todos"}</button>)}</div>
    <div className="row" style={{ alignItems: "center", margin: "0 0 8px" }}>
      <label style={{ fontSize: 14 }}>Ordenar por <select value={f.sort} onChange={(e) => onChange({ sort: e.target.value as CommunitySort })} style={{ width: "auto", marginLeft: 6 }}>{Object.entries(SORT_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
      {f.tag && <button type="button" className="tag taglink" onClick={() => onChange({ tag: "" })} aria-label={`Remover filtro da tag ${f.tag}`}>#{f.tag} ✕</button>}</div>
    {!f.tag && popularTags.length > 0 && <p className="muted" style={{ fontSize: 13 }}>Tags populares: {popularTags.map((t) => <button key={t} type="button" className="tag taglink" onClick={() => onChange({ tag: t })}>#{t}</button>)}</p>}</div>);
}
