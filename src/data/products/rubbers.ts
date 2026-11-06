import type { Distance, PlayerLevel, PlayerStyle, Rubber, RubberType } from "../../types";
import { baseFields, brandOf, pick, price5, rng, score } from "./builders";
// Mock: 50 borrachas geradas a partir de 5 arquétipos. A ordem dos arquétipos é usada por rackets.ts.
interface Arch { label: string; suffix: string; speed: number; spin: number; control: number; hardness: number; type: RubberType; distance: Distance; styles: PlayerStyle[]; levels: PlayerLevel[]; price: number; tags: string[] }
export const RUBBER_ARCHS: Arch[] = [
  { label: "de spin", suffix: "Spin", speed: 8.3, spin: 9.4, control: 7.4, hardness: 47, type: "inverted", distance: "mid", styles: ["Topspin", "Ofensivo"], levels: ["Intermediário", "Avançado", "Profissional"], price: 400, tags: ["spin", "topspin"] },
  { label: "rápida", suffix: "Speed", speed: 9.0, spin: 8.5, control: 6.6, hardness: 49, type: "inverted", distance: "mid", styles: ["Ofensivo"], levels: ["Avançado", "Profissional"], price: 430, tags: ["velocidade", "ataque"] },
  { label: "de controle", suffix: "Control", speed: 6.8, spin: 7.8, control: 9.0, hardness: 40, type: "inverted", distance: "close", styles: ["Controle", "All-round", "Counter/Block"], levels: ["Iniciante", "Intermediário"], price: 260, tags: ["controle", "macia"] },
  { label: "all-round", suffix: "Allround", speed: 7.4, spin: 8.0, control: 8.2, hardness: 44, type: "inverted", distance: "mid", styles: ["All-round", "Topspin"], levels: ["Iniciante", "Intermediário", "Avançado"], price: 320, tags: ["equilíbrio"] },
  { label: "de pinos longos", suffix: "Long", speed: 4.5, spin: 3.5, control: 9.0, hardness: 36, type: "long-pips", distance: "far", styles: ["Defensivo", "Counter/Block"], levels: ["Intermediário", "Avançado"], price: 220, tags: ["defesa", "pinos"] },
];
const WORDS = ["Alba", "Brisa", "Cinder", "Delta", "Echo", "Fjord", "Gale", "Haze", "Iris", "Jade", "Kilo", "Lynx", "Mirage", "Noble", "Opal", "Prism", "Quill", "Ridge", "Solar", "Terra", "Ultra", "Valor", "Wave", "Xylo", "Zinc"];
const THICK = [["1.8", "2.0"], ["2.0", "2.1", "MAX"], ["1.5", "1.8", "2.0"], ["2.1", "MAX"]];

export const rubbers: Rubber[] = Array.from({ length: 50 }, (_, i) => {
  const ai = (i + Math.floor(i / 25)) % 5, a = RUBBER_ARCHS[ai], r = rng(500 + i), name = `${WORDS[i % 25]} ${a.suffix}`;
  const pips = a.type === "long-pips";
  return {
    ...baseFields(r, "rubber", name, brandOf(i * 7 + 2), price5(a.price * (0.8 + r() * 0.5)), `Borracha ${a.label}${pips ? " com pinos longos" : ""}. Dados fictícios para demonstração.`, a.tags, { styles: a.styles, levels: a.levels, distance: a.distance }),
    category: "rubber",
    specifications: { speed: score(a.speed + (r() - 0.5) * 1.2), spin: score(a.spin + (r() - 0.5) * 1.2), control: score(a.control + (r() - 0.5) * 1.2), hardness: Math.round((a.hardness + (r() - 0.5) * 4) * 2) / 2, thickness: pick(r, THICK), type: a.type, weight: Math.round(40 + r() * 12), sponge: pips ? "Esponja fina" : "Esponja padrão", pips: pips ? "Pinos longos" : undefined, recommendedDistance: a.distance },
  };
});
