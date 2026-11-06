import type { Period } from "../../types";
const OPTIONS: [Period, string][] = [["7d", "7 dias"], ["30d", "30 dias"], ["3m", "3 meses"], ["6m", "6 meses"]];
export default function PeriodFilter({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return (<div className="chips" role="group" aria-label="Período" style={{ margin: 0 }}>
    {OPTIONS.map(([p, label]) => <button key={p} type="button" className={p === value ? "on" : ""} aria-pressed={p === value} onClick={() => onChange(p)}>{label}</button>)}</div>);
}
