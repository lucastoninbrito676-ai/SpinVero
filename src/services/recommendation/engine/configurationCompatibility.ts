import type { Blade, Rubber } from "../../../types";
import type { SetupHarmony } from "../../../types/advancedRecommendation";
import { evaluateSetup } from "../../../utils/racketSetup";
import type { PlayerNeeds } from "./needs";

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
export function evaluateConfiguration(blade: Blade, fh: Rubber, bh: Rubber, needs: PlayerNeeds): SetupHarmony {
  const base = evaluateSetup(blade, fh, bh);
  let score = base.harmony;
  const notes = [...base.notes];
  const avgRubberSpeed = (fh.specifications.speed + bh.specifications.speed) / 2;
  const speedGap = Math.abs(blade.specifications.speed - avgRubberSpeed);
  if (speedGap > 2) { score -= Math.min(18, (speedGap - 2) * 8); notes.push("Velocidade da madeira e das borrachas está relativamente distante."); }
  const avgHardness = (fh.specifications.hardness + bh.specifications.hardness) / 2;
  const stiffnessPenalty = blade.specifications.stiffness === "hard" && avgHardness >= 48 ? 7 : blade.specifications.stiffness === "soft" && avgHardness <= 38 ? 4 : 0;
  if (stiffnessPenalty) { score -= stiffnessPenalty; notes.push("A combinação rigidez × dureza pede mais adaptação técnica."); }
  const weight = base.specs.estimatedWeight;
  if (weight > 185) { score -= Math.min(10, (weight - 185) * .4); notes.push("Peso total acima da faixa mais confortável do catálogo."); }
  const asym = Math.abs(fh.specifications.speed - bh.specifications.speed);
  if (asym > 2.5 && needs.control < 8) { score -= 5; notes.push("Diferença grande de velocidade entre FH e BH."); }
  if (needs.control >= 8 && bh.specifications.control < fh.specifications.control - 1.5) { score -= 5; notes.push("O BH poderia oferecer mais controle para o perfil atual."); }
  if ((needs.speed >= 8 || needs.spin >= 8.5) && fh.specifications.type !== "inverted") { score -= 5; notes.push("O tipo de borracha do FH é menos alinhado à necessidade ofensiva calculada."); }
  return { score: clamp(score), notes, specs: base.specs };
}
