import { Card, ProgressBar } from "../ui";
import type { AthleteStats } from "../../types";
const SKILLS: [keyof AthleteStats, string][] = [["forehand", "Forehand"], ["backhand", "Backhand"], ["serve", "Saque"], ["consistency", "Consistência"], ["technique", "Técnica"]];
export default function SkillProgress({ stats }: { stats: AthleteStats }) {
  return (<Card><h3 style={{ marginTop: 0 }}>Desempenho técnico</h3>{SKILLS.map(([k, label]) => <ProgressBar key={k} label={label} value={stats[k]} max={100} />)}</Card>);
}
