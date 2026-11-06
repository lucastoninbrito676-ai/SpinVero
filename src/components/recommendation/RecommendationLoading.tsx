import { Card } from "../ui";
export default function RecommendationLoading() { return <div className="grid"><Card><div className="skel" style={{height:120}} /><p className="muted">Calculando madeira, FH, BH e compatibilidade...</p></Card><Card><div className="skel" style={{height:120}} /><p className="muted">Cruzando seu perfil com o catálogo...</p></Card></div>; }
