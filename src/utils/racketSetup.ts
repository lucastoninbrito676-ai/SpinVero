import type { Blade, RacketSpecs, Rubber } from "../types";
/**
 * BASE DA COMPATIBILIDADE ENTRE PRODUTOS (madeira + 2 borrachas).
 * Hoje só deriva as especificações da raquete montada e lista avisos simples; o verificador completo
 * de combinações pode crescer a partir de `evaluateSetup` sem mudar quem o chama.
 * Pesos/fórmulas são heurísticas do protótipo, não regras oficiais.
 */
export interface SetupEvaluation { specs: RacketSpecs; harmony: number; notes: string[] }
const r1 = (n: number) => Math.round(n * 10) / 10;
export function evaluateSetup(blade: Blade, fh: Rubber, bh: Rubber): SetupEvaluation {
  const avg = (f: (r: Rubber) => number) => (f(fh) + f(bh)) / 2;
  const specs: RacketSpecs = {
    speed: r1(blade.specifications.speed * 0.55 + avg((r) => r.specifications.speed) * 0.45),
    control: r1(blade.specifications.control * 0.5 + avg((r) => r.specifications.control) * 0.5),
    spin: r1(avg((r) => r.specifications.spin)),
    estimatedWeight: blade.specifications.weight + (fh.specifications.weight ?? 45) + (bh.specifications.weight ?? 45),
  };
  const notes: string[] = []; let harmony = 100;
  if (Math.abs(blade.specifications.speed - avg((r) => r.specifications.speed)) > 2.5) { harmony -= 20; notes.push("Grande diferença de velocidade entre madeira e borrachas."); }
  if (specs.estimatedWeight > 195) { harmony -= 15; notes.push("Conjunto pesado."); }
  return { specs, harmony, notes };
}
