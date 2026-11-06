import type { Breakdown } from "../../types";
const ROWS: [keyof Breakdown, string][] = [["style", "Estilo"], ["level", "Nível"], ["goal", "Objetivo"], ["speed", "Velocidade"], ["control", "Controle"], ["spin", "Spin"]];
/** Mostra apenas os critérios aplicáveis ao produto (madeira, por exemplo, não tem spin). */
export default function CompatibilityScore({ breakdown }: { breakdown: Breakdown }) {
  return (<div>{ROWS.filter(([k]) => breakdown[k] != null).map(([k, label]) => <div key={k}><div className="lbl"><span>{label}</span><span>{breakdown[k]}%</span></div><div className="bar"><i style={{ width: `${breakdown[k]}%` }} /></div></div>)}</div>);
}
