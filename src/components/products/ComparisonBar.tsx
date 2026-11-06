import { useLocation } from "react-router-dom";
import { useShortlist } from "../../context/ShortlistContext";
import { MIN_COMPARE } from "../../services/products/comparisonService";
import { Button } from "../ui";
/** Barra fixa e compacta enquanto houver produtos selecionados. */
export default function ComparisonBar() {
  const { compare, clearCompare } = useShortlist();
  const { pathname } = useLocation();
  if (!compare.length || pathname === "/comparar") return null;
  const ready = compare.length >= MIN_COMPARE;
  return (<div className="cmpbar" role="region" aria-label="Comparação de equipamentos">
    <span>Comparando {compare.length} {compare.length === 1 ? "produto" : "produtos"}{!ready && " · escolha mais 1"}</span>
    {ready && <Button to="/comparar">Ver comparação</Button>}
    <button type="button" className="x" aria-label="Limpar comparação" onClick={clearCompare}>✕</button></div>);
}
