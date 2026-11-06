import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { axisLabel, evolutionPercent } from "../utils/format";
import { Button, Card } from "../components/ui";
import ProgressChart from "../components/ui/ProgressChart";
import AthleteSummary from "../components/dashboard/AthleteSummary";
import StatsCard from "../components/dashboard/StatsCard";
import PeriodFilter from "../components/dashboard/PeriodFilter";
import SkillProgress from "../components/dashboard/SkillProgress";
import GoalCard from "../components/dashboard/GoalCard";
import LatestAnalyses from "../components/dashboard/LatestAnalyses";
import RecommendedGear from "../components/dashboard/RecommendedGear";
import RecommendedSetupCard from "../components/dashboard/RecommendedSetupCard";
import CommunityActivity from "../components/dashboard/CommunityActivity";
import ActivityTimeline from "../components/dashboard/ActivityTimeline";
import type { Period } from "../types";

const SHORTCUTS: [string, string, string][] = [["/perfil", "Perfil", "Edite seus dados e seu objetivo."], ["/raquete-ideal", "Raquete ideal", "Descubra equipamentos para o seu jogo."], ["/equipamentos", "Equipamentos", "Explore o catálogo."], ["/analise", "Análise", "Envie um vídeo do seu movimento."], ["/progresso", "Progresso", "Veja sua evolução."], ["/comunidade", "Comunidade", "Converse com outros jogadores."]];
const PERIOD_TEXT: Record<Period, string> = { "7d": "nos últimos 7 dias", "30d": "nos últimos 30 dias", "3m": "nos últimos 3 meses", "6m": "nos últimos 6 meses" };

export default function Dashboard() {
  const { user } = useAuth();
  const { athlete } = useProfile();
  const [period, setPeriod] = useState<Period>("6m");
  const { overview, progress, error, retry } = useDashboardData(period);
  if (!user) return null; // ProtectedRoute garante o usuário

  const evolution = progress ? evolutionPercent(progress) : null;
  return (<>
    <h1>Olá, {user.name.split(" ")[0]} 👋</h1>
    <p className="sub">Como você está jogando e como está evoluindo.</p>
    <div className="mt"><AthleteSummary user={user} athlete={athlete} /></div>
    <p className="note mt">Dados de desempenho de demonstração: ainda não vêm de análises reais.</p>

    {error && <p className="note" role="alert">Não foi possível carregar os dados. <button className="btn alt" onClick={retry}>Tentar novamente</button></p>}
    {!overview && !error && <p className="note">Carregando...</p>}

    {overview && <>
      <div className="grid mt">
        <StatsCard title="Técnica" value={`${overview.stats.technique}/100`} description="Avaliação técnica geral" progress={overview.stats.technique} />
        <StatsCard title="Consistência" value={`${overview.stats.consistency}/100`} description="Regularidade dos golpes" progress={overview.stats.consistency} />
        <StatsCard title="Saque" value={`${overview.stats.serve}/100`} description="Qualidade e variação do saque" progress={overview.stats.serve} />
        <StatsCard title="Evolução" value={evolution == null ? "…" : `${evolution >= 0 ? "+" : ""}${evolution}%`} description={`Variação ${PERIOD_TEXT[period]}`} />
      </div>
      <div className="dash mt">
        <Card><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}><h3 style={{ margin: 0 }}>Evolução do desempenho</h3><PeriodFilter value={period} onChange={setPeriod} /></div>
          {progress ? <ProgressChart values={progress.map((p) => p.score)} labels={progress.map((p) => axisLabel(p.date, period))} /> : <p className="muted">Carregando gráfico...</p>}</Card>
        <GoalCard goal={athlete.goal} progress={overview.goalProgress} />
      </div>
      <div className="dash mt"><SkillProgress stats={overview.stats} /><ActivityTimeline items={overview.activities} /></div>
      <div className="dash mt"><RecommendedGear /><RecommendedSetupCard /></div>
      <div className="mt"><CommunityActivity userId={user.id} /></div>
      <LatestAnalyses userId={user.id} />
    </>}

    <h2>Atalhos</h2><div className="grid">{SHORTCUTS.map(([to, t, d]) => <Card key={to}><h3>{t}</h3><p className="muted">{d}</p><Button variant="alt" to={to}>Abrir</Button></Card>)}</div>
    <p className="muted" style={{ marginTop: 24 }}>Quer um panorama mais completo? Veja <Link to="/progresso">Progresso</Link>.</p></>);
}
