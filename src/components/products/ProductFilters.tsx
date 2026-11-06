import type { ReactNode } from "react";
import { LEVELS, STYLES } from "../../data/options";
import { PRICE_RANGES, SORT_LABELS, type FilterOptions } from "../../services/products/productService";
import type { CatalogFilters, HardnessBucket, PlayerLevel, PlayerStyle, PriceKey, ProductCategory, SortKey } from "../../types";
import { CATEGORIES, CATEGORY_PLURAL, HARDNESS_LABEL } from "../../utils/product";
import { Button } from "../ui";

function Sel({ label, value, onChange, children }: { label: string; value: string | number; onChange: (v: string) => void; children: ReactNode }) {
  return <label>{label}<select value={value} onChange={(e) => onChange(e.target.value)}>{children}</select></label>;
}
const minOptions = [0, 7, 8, 9].map((n) => <option key={n} value={n}>{n ? `${n}+` : "Qualquer"}</option>);
interface Props { filters: CatalogFilters; onChange: (patch: Partial<CatalogFilters>) => void; sort: SortKey; onSort: (s: SortKey) => void; options: FilterOptions; favoritesCount: number; onClear: () => void }

/** Filtros dinâmicos: marcas e opções vêm do catálogo; só aparecem os filtros que fazem sentido para a categoria. */
export default function ProductFilters({ filters: f, onChange, sort, onSort, options, favoritesCount, onClear }: Props) {
  const cat = f.category, perf = cat !== "accessory", spin = perf && cat !== "blade";
  return (<div className="card">
    <div className="field"><label htmlFor="search">Buscar equipamento</label><input id="search" type="search" placeholder="Nome, marca, categoria ou característica..." value={f.search} onChange={(e) => onChange({ search: e.target.value })} /></div>
    <div className="filters">
      <Sel label="Categoria" value={cat} onChange={(v) => onChange({ category: v as ProductCategory | "", layers: 0, composition: "", hardness: "", thickness: "", minSpin: v === "blade" || v === "accessory" ? 0 : f.minSpin })}>
        <option value="">Todas</option>{CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_PLURAL[c]}</option>)}</Sel>
      <Sel label="Marca" value={f.brandId} onChange={(v) => onChange({ brandId: v })}><option value="">Todas</option>{options.brands.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.count})</option>)}</Sel>
      <Sel label="Nível" value={f.level} onChange={(v) => onChange({ level: v as PlayerLevel | "" })}><option value="">Todos</option>{LEVELS.map((l) => <option key={l}>{l}</option>)}</Sel>
      <Sel label="Estilo de jogo" value={f.style} onChange={(v) => onChange({ style: v as PlayerStyle | "" })}><option value="">Todos</option>{STYLES.map((s) => <option key={s}>{s}</option>)}</Sel>
      <Sel label="Preço" value={f.price} onChange={(v) => onChange({ price: v as PriceKey })}><option value="">Todos</option>{Object.entries(PRICE_RANGES).map(([k, r]) => <option key={k} value={k}>{r.label}</option>)}</Sel>
      <Sel label="Ordenar" value={sort} onChange={(v) => onSort(v as SortKey)}>{Object.entries(SORT_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Sel></div>
    {perf && <details style={{ marginTop: 12 }}><summary>Mais filtros (características)</summary><div className="filters" style={{ marginTop: 10 }}>
      <Sel label="Velocidade mínima" value={f.minSpeed} onChange={(v) => onChange({ minSpeed: Number(v) })}>{minOptions}</Sel>
      <Sel label="Controle mínimo" value={f.minControl} onChange={(v) => onChange({ minControl: Number(v) })}>{minOptions}</Sel>
      {spin && <Sel label="Spin mínimo" value={f.minSpin} onChange={(v) => onChange({ minSpin: Number(v) })}>{minOptions}</Sel>}
      <Sel label="Peso máximo" value={f.maxWeight} onChange={(v) => onChange({ maxWeight: Number(v) })}><option value={0}>Qualquer</option>{[50, 85, 88, 90, 190].map((w) => <option key={w} value={w}>{w} g</option>)}</Sel>
      {cat === "blade" && <>
        <Sel label="Camadas" value={f.layers} onChange={(v) => onChange({ layers: Number(v) })}><option value={0}>Qualquer</option>{options.layers.map((l) => <option key={l} value={l}>{l}</option>)}</Sel>
        <Sel label="Composição" value={f.composition} onChange={(v) => onChange({ composition: v })}><option value="">Qualquer</option>{options.compositions.map((c) => <option key={c}>{c}</option>)}</Sel></>}
      {cat === "rubber" && <>
        <Sel label="Dureza" value={f.hardness} onChange={(v) => onChange({ hardness: v as HardnessBucket })}><option value="">Qualquer</option>{Object.entries(HARDNESS_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</Sel>
        <Sel label="Espessura" value={f.thickness} onChange={(v) => onChange({ thickness: v })}><option value="">Qualquer</option>{options.thicknesses.map((t) => <option key={t}>{t}</option>)}</Sel></>}
    </div></details>}
    <div className="row" style={{ marginBottom: 0 }}>
      <Button variant="alt" className={f.favoritesOnly ? "on" : ""} aria-pressed={f.favoritesOnly} onClick={() => onChange({ favoritesOnly: !f.favoritesOnly })}>♥ Meus favoritos ({favoritesCount})</Button>
      <Button variant="alt" onClick={onClear}>Limpar filtros</Button></div></div>);
}
