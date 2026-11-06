import type { Racket } from "../../types";
import { evaluateSetup } from "../../utils/racketSetup";
import { baseFields, price5, rng } from "./builders";
import { blades } from "./blades";
import { rubbers } from "./rubbers";
// Mock: 12 raquetes montadas = 1 madeira + 2 borrachas do próprio catálogo (ids em `components`).
// Preferência de borrachas por arquétipo de madeira: [forehand, backhand] (índices de RUBBER_ARCHS).
const PAIRING: [number, number][] = [[1, 0], [3, 2], [2, 4], [0, 3]];
const byArch = (a: number) => rubbers.filter((_, j) => (j + Math.floor(j / 25)) % 5 === a);

export const rackets: Racket[] = Array.from({ length: 12 }, (_, i) => {
  const bi = (i * 7) % blades.length, blade = blades[bi], [fa, ba] = PAIRING[bi % 4];
  const fh = byArch(fa)[i % 10], bh = byArch(ba)[(i + 3) % 10], { specs } = evaluateSetup(blade, fh, bh), r = rng(900 + i);
  const levels = blade.recommendation.levels.filter((l) => fh.recommendation.levels.includes(l) || bh.recommendation.levels.includes(l));
  return {
    ...baseFields(r, "racket", `${blade.name} Combo`, { id: blade.brandId, name: blade.brandName, description: "" }, price5((blade.price + fh.price + bh.price) * 0.9),
      `Raquete montada com ${blade.name}, ${fh.name} (forehand) e ${bh.name} (backhand). Dados fictícios para demonstração.`, ["montada", ...blade.tags.slice(0, 1)],
      { styles: blade.recommendation.styles, levels: levels.length ? levels : blade.recommendation.levels, distance: blade.recommendation.distance }),
    category: "racket", specifications: specs, components: { bladeId: blade.id, forehandRubberId: fh.id, backhandRubberId: bh.id },
  };
});
