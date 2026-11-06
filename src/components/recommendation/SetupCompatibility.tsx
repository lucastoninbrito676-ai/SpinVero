import type { SetupHarmony } from "../../types/advancedRecommendation";
import { Card } from "../ui";
export default function SetupCompatibility({ harmony }: { harmony: SetupHarmony }) {
  return <Card><div style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",flexWrap:"wrap"}}><div><span className="eyebrow">Harmonia do conjunto</span><h2 style={{margin:".2em 0"}}>{harmony.score}%</h2></div><div style={{minWidth:220,flex:1}}><div className="bar"><i style={{width:`${harmony.score}%`}} /></div><div className="muted">Velocidade {harmony.specs.speed} · Spin {harmony.specs.spin} · Controle {harmony.specs.control} · {harmony.specs.estimatedWeight} g</div></div></div>
    {harmony.notes.length > 0 && <ul className="tl">{harmony.notes.map((n) => <li key={n}>⚠ {n}</li>)}</ul>}
  </Card>;
}
