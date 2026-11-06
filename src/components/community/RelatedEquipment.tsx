import { Link } from "react-router-dom";
import { useCatalog } from "../../hooks/useCatalog";
/** Resolve ids de equipamento via catálogo (ProductService); nenhum dado de produto é copiado para o post. */
export default function RelatedEquipment({ ids }: { ids: string[] }) {
  const { products } = useCatalog();
  const found = ids.map((id) => products?.find((p) => p.id === id)).filter((p) => !!p);
  if (!found.length) return null;
  return <p aria-label="Equipamentos relacionados">{found.map((p) => <Link key={p!.id} className="tag" to={`/equipamentos/${p!.id}`}>🏓 {p!.brandName} {p!.name}</Link>)}</p>;
}
