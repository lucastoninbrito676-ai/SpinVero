import { Link } from "react-router-dom";
import { useRecentPosts } from "../hooks/useCommunity";
import PostSummary from "../components/community/PostSummary";
import { areaScores, progressHistory } from "../data/analysis/progress";
import { useMemo } from "react";
import { useCatalog } from "../hooks/useCatalog";
import { getRecommendations, type ScoringProfile } from "../services/recommendation/recommendationService";
import { isRacket } from "../utils/product";
import { Button, Card, ProgressBar, ScoreCard } from "../components/ui";
import ProductCard from "../components/products/ProductCard";
import ProgressChart from "../components/ui/ProgressChart";
import { HeroArt, PoseFigure } from "../components/ui/Illustrations";

const DEMO: ScoringProfile = { level: "Intermediário", style: "Topspin", priority: "Spin", budget: 1000 };
const steps = [["01", "Descubra seu perfil", "Responda ao questionário e veja quais equipamentos combinam com você.", "Compatibilidade", 9.4], ["02", "Analise seu jogo", "Envie um vídeo e receba pontos de atenção com nível de confiança.", "Confiança", 8.2], ["03", "Evolua com dados", "Compare análises ao longo das semanas.", "Evolução", 8.1]] as const;
const poseBars: [string, number][] = [["Postura", 82], ["Posicionamento", 74], ["Forehand", 88], ["Backhand", 67]];

export default function Home() {
  const { products } = useCatalog();
  const posts = useRecentPosts(3);
  const top = useMemo(() => (products ? getRecommendations(DEMO, products.filter(isRacket)).slice(0, 3) : []), [products]);
  const first = progressHistory[0].score, last = progressHistory[progressHistory.length - 1].score;
  return (<>
    <section className="hero"><div><span className="eyebrow">Plataforma para jogadores de tênis de mesa</span><h1>Entenda seu jogo.<br />Escolha melhor.<br />Evolua.</h1>
      <p className="sub">Dados da sua técnica e do seu equipamento, em um só lugar.</p>
      <div className="row"><Button to="/raquete-ideal">Encontrar minha raquete</Button><Button variant="alt" to="/analise">Analisar meu movimento</Button></div></div><HeroArt /></section>
    <section className="sec"><span className="eyebrow">01 — Como o SpinLab funciona</span><div className="grid" style={{ marginTop: 14 }}>
      {steps.map(([n, t, d, l, v]) => <Card key={n}><div className="num">{n}</div><h3>{t}</h3><p className="muted">{d}</p><ProgressBar label={l} value={v} /></Card>)}</div></section>
    <section className="sec split"><div><span className="eyebrow">02 — Seu jogo em dados</span><h2 className="big">Um painel para entender o que muda de treino para treino.</h2><p className="sub">Exemplo ilustrativo com dados fictícios.</p></div>
      <div><div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))" }}>{Object.entries(areaScores).map(([k, v]) => <ScoreCard key={k} label={k} value={v} />)}</div>
        <Card className="mt"><ProgressChart values={progressHistory.map((e) => e.score)} /></Card></div></section>
    <section className="sec"><span className="eyebrow">03 — Encontre sua raquete</span><h2 className="big">Não existe a melhor raquete.<br />Existe a melhor raquete para o seu jogo.</h2>
      {!products && <div className="grid"><div className="skel" /><div className="skel" /><div className="skel" /></div>}
      <div className="grid">{top.map((r) => <ProductCard key={r.product.id} product={r.product} fit={r.fit} ctaLabel="Ver recomendação" />)}</div></section>
    <section className="sec split"><div className="stage" style={{ maxWidth: 340, margin: "auto" }}><PoseFigure /></div>
      <div><span className="eyebrow">04 — Analise seu movimento</span><h2 className="big">Descubra o que pode estar limitando seu jogo.</h2>
        {poseBars.map(([k, v]) => <div key={k}><div className="lbl"><span>{k}</span><span>{v}%</span></div><div className="bar"><i style={{ width: `${v}%` }} /></div></div>)}
        <Button to="/analise">Analisar meu movimento</Button></div></section>
    <Card className="sec"><div style={{ textAlign: "center" }}><span className="eyebrow">05 — Evolução</span><div className="row" style={{ justifyContent: "center", alignItems: "center", gap: 28 }}>
      <div><div className="muted">Primeira análise</div><div className="num" style={{ color: "var(--mute)" }}>{first}</div></div><div style={{ fontSize: 32 }}>→</div><div><div className="muted">Agora</div><div className="num">{last}</div></div><div className="fit">+{last - first} pontos</div></div></div></Card>
    <section className="sec"><span className="eyebrow">06 — Comunidade</span><div className="grid" style={{ marginTop: 14 }}>
      {posts === null ? <div className="skel" /> : posts.map((p) => <PostSummary key={p.id} post={p} />)}</div>
      <div className="row"><Link className="btn alt" to="/comunidade">Entrar na conversa</Link></div></section></>);
}
