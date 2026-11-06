import { Link } from "react-router-dom";
import { useAdvancedRecommendations } from "../hooks/useAdvancedRecommendations";
import RecommendationAlternatives from "../components/recommendation/RecommendationAlternatives";
import RecommendedSetup from "../components/recommendation/RecommendedSetup";
import RecommendationLoading from "../components/recommendation/RecommendationLoading";
import { Button, Card } from "../components/ui";
import ComponentSubstitutes from "../components/recommendation/ComponentSubstitutes";

export default function IdealSetup() {
  const { result, loading, error, retry } = useAdvancedRecommendations();
  return <div className="fade"><span className="eyebrow">Recomendação avançada</span><h1 className="big">Sua configuração ideal</h1><p className="sub">Madeira + FH + BH escolhidos em conjunto para equilibrar seu perfil, necessidades técnicas, orçamento e evolução.</p>
    {loading && <RecommendationLoading />}
    {!loading && !error && result?.configuration && <div className="recommendation-status">
      <span className="tag">Perfil analisado</span>
      <span className="tag">Catálogo consultado</span>
      {result.movementSignals.length > 0 ? <span className="tag">Movimento considerado</span> : <span className="tag">Sem análise de movimento</span>}
      {result.state === "no-budget-match" && <span className="tag">Orçamento abaixo do ideal</span>}
    </div>}
    {error && <Card><p role="alert">Não foi possível calcular a recomendação.</p><Button onClick={retry}>Tentar novamente</Button></Card>}
    {!loading && !error && result?.state === "needs-profile" && <Card><h2>Complete seu perfil</h2><p>Precisamos pelo menos do seu nível e estilo para montar a configuração.</p><div className="row"><Button to="/raquete-ideal">Fazer questionário</Button><Button variant="alt" to="/perfil">Abrir perfil</Button></div></Card>}
    {!loading && !error && result?.state === "insufficient-catalog" && <Card><h2>Catálogo insuficiente</h2><p>{result.message ?? "Não há componentes suficientes para montar um conjunto completo."}</p><Button variant="alt" to="/equipamentos">Ver catálogo</Button></Card>}
    {!loading && !error && result?.configuration && <>
      {result.state === "no-budget-match" && <p className="note" role="status">{result.message} Menor conjunto encontrado: R$ {result.minimumConfigurationPrice?.toLocaleString("pt-BR") ?? "—"}.</p>}
      <RecommendedSetup configuration={result.configuration} />
      <div className="mt"><Card><span className="eyebrow">Confiança da recomendação</span><h3>{result.confidence.label} · {result.confidence.score}%</h3><ul>{result.confidence.factors.map((f) => <li key={f}>{f}</li>)}</ul>{result.movementSignals.some((s) => s.simulated) && <p className="note">Análise demonstrativa considerada. Ela não representa uma avaliação real por visão computacional.</p>}</Card></div>
      <RecommendationAlternatives alternatives={result.alternatives} />
      <h2>Substitutos por componente</h2><div className="grid"><ComponentSubstitutes title="Madeira" items={result.substitutes.blade} /><ComponentSubstitutes title="FH" items={result.substitutes.forehandRubber} /><ComponentSubstitutes title="BH" items={result.substitutes.backhandRubber} /></div>
      <h2>Quer ajustar?</h2><div className="row"><Button to="/raquete-ideal">Refazer questionário</Button><Button variant="alt" to="/equipamentos">Explorar catálogo</Button></div>
      <p className="muted">A recomendação é uma heurística baseada nos dados disponíveis no catálogo e no seu perfil; não substitui orientação de um treinador.</p>
    </>}
    {!loading && !error && result?.state === "no-budget-match" && !result.configuration && <Card><p>Nenhuma configuração foi encontrada.</p><Link to="/equipamentos">Ver catálogo</Link></Card>}
  </div>;
}
