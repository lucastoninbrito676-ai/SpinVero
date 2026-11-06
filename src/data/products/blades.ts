import type { Balance, Blade, HandleType, PlayerLevel, PlayerStyle, Stiffness } from "../../types";
import { baseFields, brandOf, pick, price5, rng, score } from "./builders";
// Mock: 30 madeiras geradas a partir de 4 arquétipos (ofensiva, all-round, defensiva, híbrida).
interface Arch { label: string; suffix: [string, string]; composition: [string[], string[]]; speed: number; control: number; weight: number; layers: number[]; stiffness: Stiffness; styles: PlayerStyle[]; levels: PlayerLevel[]; price: number; tags: string[] }
const ARCHS: Arch[] = [
  { label: "ofensiva", suffix: ["Carbon", "ALC"], composition: [["Madeira", "Carbono"], ["Madeira", "ALC"]], speed: 8.6, control: 6.8, weight: 88, layers: [5, 7], stiffness: "hard", styles: ["Ofensivo", "Topspin"], levels: ["Intermediário", "Avançado", "Profissional"], price: 1000, tags: ["potência", "ataque"] },
  { label: "all-round", suffix: ["Allround", "Classic"], composition: [["Madeira"], ["Madeira"]], speed: 6.8, control: 8.3, weight: 84, layers: [5, 5], stiffness: "medium", styles: ["All-round", "Controle"], levels: ["Iniciante", "Intermediário"], price: 380, tags: ["controle", "versátil"] },
  { label: "defensiva", suffix: ["Control", "Cut"], composition: [["Madeira", "Fibra"], ["Madeira"]], speed: 5.3, control: 9.0, weight: 81, layers: [5, 5], stiffness: "soft", styles: ["Defensivo", "Counter/Block"], levels: ["Intermediário", "Avançado"], price: 520, tags: ["defesa", "precisão"] },
  { label: "híbrida", suffix: ["Hybrid", "Fiber"], composition: [["Madeira", "Fibra"], ["Madeira", "Fibra"]], speed: 7.8, control: 7.8, weight: 86, layers: [5, 7], stiffness: "medium", styles: ["Topspin", "Counter/Block", "Ofensivo"], levels: ["Intermediário", "Avançado"], price: 720, tags: ["equilíbrio", "topspin"] },
];
const SERIES = ["Aurora", "Vortex", "Nimbus", "Zenith", "Falcon", "Orion", "Tempest", "Pulsar", "Cobalt", "Ember", "Glacier", "Harbor", "Ignis", "Jaguar", "Kestrel", "Lumen", "Meteor", "Nova", "Onyx", "Phoenix", "Quartz", "Raptor", "Sierra", "Titan", "Umbra", "Vega", "Willow", "Xenon", "Yonder", "Zephyr"];
const HANDLES: HandleType[] = ["flared", "straight", "anatomic", "conical"];
const BALANCES: Balance[] = ["head-heavy", "even", "handle-heavy"];

export const blades: Blade[] = SERIES.map((series, i) => {
  const a = ARCHS[i % 4], v = Math.floor(i / 4) % 2, r = rng(100 + i), layers = a.layers[v];
  const name = `${series} ${a.suffix[v]}`, composition = a.composition[v];
  return {
    ...baseFields(r, "blade", name, brandOf(i * 3 + 1), price5(a.price * (0.75 + r() * 0.6)), `Madeira ${a.label} de ${layers} camadas (${composition.join(" + ").toLowerCase()}). Dados fictícios para demonstração.`, a.tags, { styles: a.styles, levels: a.levels, distance: a.label === "defensiva" ? "far" : "mid" }),
    category: "blade",
    specifications: { speed: score(a.speed + (r() - 0.5) * 1.6), control: score(a.control + (r() - 0.5) * 1.4), weight: Math.round(a.weight + (r() - 0.5) * 6), layers, composition, stiffness: a.stiffness, handle: pick(r, HANDLES), balance: pick(r, BALANCES), headSize: { width: 150 + Math.round(r() * 4), height: 157 + Math.round(r() * 4) } },
  };
});
