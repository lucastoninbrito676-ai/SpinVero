import { useState, type CSSProperties, type MouseEvent } from "react";
import type { Product } from "../../types";
import ProductImage from "./ProductImage";
/** Galeria com miniaturas e zoom simples (clique alterna; o ponto ampliado segue o mouse). */
export default function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const move = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (<div>
    <button type="button" className={`zoomwrap ${zoom ? "on" : ""}`} aria-label={zoom ? "Reduzir imagem" : "Ampliar imagem"} onClick={() => setZoom(!zoom)} onMouseMove={move} style={{ "--o": origin } as CSSProperties}>
      <ProductImage product={product} variant={active} /></button>
    <div className="gal">{product.images.map((_, v) => <button key={v} type="button" aria-pressed={v === active} aria-label={`Ver imagem ${v + 1}`} onClick={() => { setActive(v); setZoom(false); }}><ProductImage product={product} variant={v} /></button>)}</div></div>);
}
