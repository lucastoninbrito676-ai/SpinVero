import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { questions } from "../../data/recommendation/quiz";
import { useCatalog } from "../../hooks/useCatalog";
import { getRecommendations, toPlayerProfile } from "../../services/recommendation/recommendationService";
import { useProfile } from "../../context/ProfileContext";
import { isRacket } from "../../utils/product";
import type { QuizAnswers } from "../../types";
import { Badge, Button, Card } from "../ui";
import RecommendationCard from "./RecommendationCard";

/** Estado do questionário é local; ao responder a última pergunta o perfil vai ao ProfileContext. */
export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const { athlete, setProfile } = useProfile();
  const { products } = useCatalog();
  const rackets = useMemo(() => (products ?? []).filter(isRacket), [products]);

  if (step < questions.length) {
    const q = questions[step];
    const answer = (value: string) => {
      const next = { ...answers, [q.key]: value };
      setAnswers(next); setStep(step + 1);
      if (step === questions.length - 1) setProfile(toPlayerProfile(next as QuizAnswers));
    };
    return (<div className="fade" key={step}><div className="muted">PERGUNTA {step + 1} DE {questions.length}</div>
      <div className="prog" role="progressbar" aria-valuenow={step + 1} aria-valuemax={questions.length}><i style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
      <h1 style={{ fontSize: "clamp(28px,5vw,44px)" }}>{q.title}</h1>
      {q.options.map((o) => <button key={o.value} className="opt" onClick={() => answer(o.value)}>{o.label}</button>)}
      {step > 0 && <Button variant="alt" onClick={() => setStep(step - 1)}>Voltar</Button>}</div>);
  }
  if (!products) return <p className="note">Calculando recomendações...</p>;
  const profile = toPlayerProfile(answers as QuizAnswers);
  const ranking = getRecommendations({ ...profile, goal: athlete.goal }, rackets);
  return (<div className="fade"><span className="eyebrow">Seu perfil está pronto</span>
    <div className="row"><Badge>Estilo: {profile.style}</Badge><Badge>Nível: {profile.level}</Badge><Badge>Foco: {profile.priority}</Badge><Badge>Mão: {profile.hand}</Badge>{athlete.goal && <Badge>Objetivo: {athlete.goal}</Badge>}</div>
    <h2>Suas recomendações</h2>
    <RecommendationCard rec={ranking[0]} highlight />
    <p className="note mt">É uma correspondência calculada a partir dos dados do seu perfil, não uma garantia. Compare as opções abaixo.</p>
    <h2>Outras opções</h2>
    <Card><ul className="tl">{ranking.slice(1, 4).map((r) => <li key={r.product.id}><div style={{ flex: 1 }}><Link to={`/equipamentos/${r.product.id}`}><b>{r.product.name}</b></Link> <span className="muted">· {r.product.brandName}</span></div><b>{r.fit}%</b></li>)}</ul></Card>
    <div className="row"><Button variant="alt" onClick={() => { setStep(0); setAnswers({}); }}>Refazer</Button><Button to="/configuracao-ideal">Ver configuração completa</Button><Button variant="alt" to="/equipamentos">Ver catálogo</Button></div></div>);
}
