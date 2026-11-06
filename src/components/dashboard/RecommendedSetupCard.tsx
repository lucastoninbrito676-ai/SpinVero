import { useAdvancedRecommendations } from "../../hooks/useAdvancedRecommendations";
import { Button, Card } from "../ui";

export default function RecommendedSetupCard() {
  const { result, loading } = useAdvancedRecommendations();
  return <Card>
    <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",flexWrap:"wrap"}}>
      <span className="eyebrow">Configuração ideal</span>
      {result?.confidence && <span className="tag">Confiança {result.confidence.label}</span>}
    </div>
    {loading ? <p className="muted">Calculando sua configuração...</p> : result?.configuration ? <>
      {result.state === "no-budget-match" && <p className="note">Nenhum conjunto completo cabe no orçamento atual. Mostramos a opção mais próxima.</p>}
      <h3>{result.configuration.blade.name}</h3>
      <p className="muted">FH: {result.configuration.forehandRubber.name}<br/>BH: {result.configuration.backhandRubber.name}</p>
      <div className="summary"><div><div className="fit">{result.configuration.score}%</div><span className="muted">compatibilidade</span></div><div><b>R$ {result.configuration.totalPrice.toLocaleString("pt-BR")}</b><br/><span className="muted">{result.configuration.harmony.specs.estimatedWeight} g estimados</span></div></div>
      <Button variant="alt" to="/configuracao-ideal">Ver configuração completa</Button>
    </> : <><p className="muted">Complete seu nível e estilo para descobrir madeira + FH + BH.</p><Button variant="alt" to="/configuracao-ideal">Descobrir configuração</Button></>}
  </Card>;
}
