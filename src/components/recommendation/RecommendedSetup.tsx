import type { RecommendedConfiguration } from "../../types/advancedRecommendation";
import { Badge, Card } from "../ui";
import SetupComponentCard from "./SetupComponentCard";
import SetupCompatibility from "./SetupCompatibility";
import RecommendationReasons from "./RecommendationReasons";

export default function RecommendedSetup({ configuration }: { configuration: RecommendedConfiguration }) {
  return <>
    <Card className="setup-hero"><span className="eyebrow">Configuração recomendada</span><div className="fit">{configuration.score}% <span className="muted">compatibilidade</span></div><div className="row"><Badge>R$ {configuration.totalPrice.toLocaleString("pt-BR")}</Badge><Badge>{configuration.harmony.specs.estimatedWeight} g estimados</Badge><Badge>Vel. {configuration.harmony.specs.speed}</Badge><Badge>Spin {configuration.harmony.specs.spin}</Badge><Badge>Ctrl. {configuration.harmony.specs.control}</Badge><Badge>Harmonia {configuration.harmony.score}%</Badge></div></Card>
    <div className="setup-grid"><SetupComponentCard title="Madeira" item={configuration.blade} score={configuration.components.blade} /><SetupComponentCard title="Borracha FH" item={configuration.forehandRubber} score={configuration.components.forehandRubber} /><SetupComponentCard title="Borracha BH" item={configuration.backhandRubber} score={configuration.components.backhandRubber} /></div>
    <div className="mt"><SetupCompatibility harmony={configuration.harmony} /></div>
    <div className="mt"><RecommendationReasons reasons={configuration.reasons} /></div>
  </>;
}
