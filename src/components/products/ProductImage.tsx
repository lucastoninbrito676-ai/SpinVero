import { useState } from "react";
import type { Product } from "../../types";
export const BRAND_COLOR: Record<string, string> = { butterfly: "#ff5a1f", donic: "#dc2626", tibhar: "#0ea5e9", yasaka: "#7c3aed", stiga: "#2563eb", xiom: "#db2777", andro: "#475569", nittaku: "#ca8a04", dhs: "#0f766e", palio: "#16a34a" };
const WOOD = "#c8955a";
const DOTS = Array.from({ length: 20 }, (_, i) => [64 + (i % 5) * 18, 34 + Math.floor(i / 5) * 16]);

function Art({ p, v }: { p: Product; v: number }) {
  const c = BRAND_COLOR[p.brandId] ?? "#888";
  switch (p.category) {
    case "racket": case "blade":
      return (<g transform={`rotate(${v === 1 ? 25 : -25} 100 60)`}><rect x="92" y="78" width="16" height="40" rx="5" fill="#8a5a2b" />
        <ellipse cx="100" cy="46" rx="40" ry="38" fill={p.category === "blade" ? WOOD : v === 1 ? "#1f2430" : c} />
        {p.category === "blade" ? <path d="M70 30c20 8 40 8 60 0M68 46c22 8 42 8 64 0M72 62c20 8 38 8 56 0" stroke="#a87440" fill="none" /> : <ellipse cx="100" cy="46" rx="30" ry="28" fill="none" stroke="#fff" strokeOpacity=".4" />}</g>);
    case "rubber":
      return (<g><rect x="52" y="22" width="96" height="76" rx="18" fill={c} />{v === 1 ? <rect x="52" y="86" width="96" height="12" rx="6" fill="#f2c14e" /> : <g fill="#fff" fillOpacity=".25">{DOTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />)}</g>}</g>);
    default:
      return p.specifications.type === "ball"
        ? <g><circle cx="100" cy="60" r={v === 2 ? 44 : 30} fill="#fff" stroke="#ddd" /><text x="100" y="66" textAnchor="middle" fontSize={v === 2 ? 20 : 14} fill={c}>★★★</text></g>
        : <g><rect x="60" y="24" width="80" height="72" rx="14" fill={c} /><path d="M60 52H140" stroke="#fff" strokeOpacity=".5" /></g>;
  }
}
/**
 * Mostra a imagem do produto. Com `url` usa <img> (com fallback se falhar); sem `url` desenha uma ilustração.
 * URLs reais ficam nos dados (Product.images), nunca nos componentes.
 */
export default function ProductImage({ product, variant = 0 }: { product: Product; variant?: number }) {
  const [failed, setFailed] = useState(false);
  const img = product.images[variant] ?? product.images[0];
  const box = { width: "100%", borderRadius: 14, background: "var(--bg)", display: "block" } as const;
  if (img?.url && !failed) return <img src={img.url} alt={img.alt} loading="lazy" onError={() => setFailed(true)} style={{ ...box, aspectRatio: "5 / 3", objectFit: "cover" }} />;
  return (<svg viewBox="0 0 200 120" role="img" aria-label={img?.alt ?? product.name} style={box}>
    <g transform={variant === 2 ? "translate(-50 -30) scale(1.5)" : undefined}><Art p={product} v={variant} /></g></svg>);
}
