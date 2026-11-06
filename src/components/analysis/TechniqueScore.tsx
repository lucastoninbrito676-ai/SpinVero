import type { CSSProperties } from "react";
export default function TechniqueScore({ value, label = "Nota geral" }: { value: number; label?: string }) {
  return (<div style={{ display: "flex", alignItems: "center", gap: 16 }}><div className="ring" style={{ "--v": value } as CSSProperties} role="img" aria-label={`${label}: ${value} de 100`}><b>{value}</b></div><div className="muted">{label}<br />de 100</div></div>);
}
