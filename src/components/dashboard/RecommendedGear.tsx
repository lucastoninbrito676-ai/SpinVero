import { useMemo } from "react";
import { useCatalog } from "../../hooks/useCatalog";
import { useScoringProfile } from "../../context/ProfileContext";
import { getRecommendations } from "../../services/recommendation/recommendationService";
import { isRacket } from "../../utils/product";
import { Button, Card } from "../ui";
export default function RecommendedGear() {
  const scoring = useScoringProfile();
  const { products } = useCatalog();
  const top = useMemo(() => (scoring && products ? getRecommendations(scoring, products.filter(isRacket))[0] : null), [scoring, products]);
  return (<Card><span className="eyebrow">Equipamento recomendado</span>
    {top ? <><h3 style={{ margin: ".3em 0" }}>{top.product.brandName} {top.product.name}</h3><div className="fit">{top.fit}% <span className="muted">compatível</span></div><Button variant="alt" to={`/equipamentos/${top.product.id}`}>Ver recomendação</Button></>
      : <><p className="muted">Defina nível e estilo no perfil para ver uma recomendação.</p><Button variant="alt" to="/raquete-ideal">Descobrir minha raquete</Button></>}</Card>);
}
