import type { RecommendationAlternative } from "../../types/advancedRecommendation";
import { Button, Card } from "../ui";
export default function RecommendationAlternatives({ alternatives }: { alternatives: RecommendationAlternative[] }) {
  if (!alternatives.length) return null;
  return <><h2>Alternativas</h2><div className="grid">{alternatives.map((a) => <Card key={a.kind}><span className="eyebrow">{a.label}</span>{a.configuration ? <><h3>{a.configuration.blade.name}</h3><p className="muted">FH: {a.configuration.forehandRubber.name}<br/>BH: {a.configuration.backhandRubber.name}</p><div className="price">R$ {a.configuration.totalPrice.toLocaleString("pt-BR")}</div><b>{a.configuration.score}%</b></> : a.racket ? <><h3>{a.racket.name}</h3><p className="muted">{a.racket.brandName}</p><div className="price">R$ {a.racket.price.toLocaleString("pt-BR")}</div></> : null}<p className="muted">{a.reason}</p>{a.configuration && <Button variant="alt" to={`/equipamentos/${a.configuration.blade.id}`}>Explorar</Button>}{a.racket && <Button variant="alt" to={`/equipamentos/${a.racket.id}`}>Ver raquete</Button>}</Card>)}</div></>;
}
