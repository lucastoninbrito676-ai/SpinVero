import type { PlayerLevel, PlayerStyle, Priority } from "../../types";
import type { AlternativeKind } from "../../types/advancedRecommendation";

export const GOAL_FOCUS: Record<string, "speed" | "control" | "spin"> = {
  "Ter mais controle": "control", "Ter mais potência": "speed", "Ter mais spin": "spin",
  "Melhorar minha técnica": "control", "Competir em torneios": "speed",
};
export const SPEED_CAP: Record<PlayerLevel, number> = { Iniciante: 6.5, Intermediário: 8, Avançado: 10, Profissional: 10 };
export const COMPONENT_WEIGHTS: Record<string, { blade: number; forehand: number; backhand: number }> = {
  Ofensivo: { blade: .30, forehand: .40, backhand: .30 },
  Topspin: { blade: .30, forehand: .40, backhand: .30 },
  Defensivo: { blade: .30, forehand: .30, backhand: .40 },
  "Counter/Block": { blade: .30, forehand: .30, backhand: .40 },
  "All-round": { blade: .34, forehand: .33, backhand: .33 },
  Controle: { blade: .34, forehand: .33, backhand: .33 },
};
export const COMPONENT_SCORE_WEIGHTS = {
  blade: { profile: .35, need: .35, technical: .30 },
  rubber: { profile: .30, need: .35, technical: .35 },
} as const;
export const FINAL_WEIGHTS = { components: .45, harmony: .25, technical: .15, budget: .15 } as const;
export const ALTERNATIVE_ORDER: AlternativeKind[] = ["control", "offensive", "spin", "economical", "evolution", "ready-racket"];
export const PRIORITY_TARGETS: Record<Priority, { speed: number; control: number; spin: number }> = {
  Velocidade: { speed: 9, control: 6.5, spin: 7 }, Controle: { speed: 6.5, control: 9, spin: 7 },
  Spin: { speed: 7.5, control: 7, spin: 9 }, Equilíbrio: { speed: 7.5, control: 7.5, spin: 7.5 },
};
export const STYLE_TARGETS: Record<PlayerStyle, { speed: number; control: number; spin: number }> = {
  Ofensivo: { speed: 8.8, control: 6.8, spin: 8.5 }, Topspin: { speed: 8, control: 7.2, spin: 9 },
  Defensivo: { speed: 5.5, control: 9, spin: 6.5 }, "Counter/Block": { speed: 6.8, control: 9, spin: 7 },
  "All-round": { speed: 7, control: 8, spin: 7.5 }, Controle: { speed: 6.2, control: 9.2, spin: 6.8 },
};
export const PROBLEM_ADJUSTMENTS: Record<string, { speed?: number; control?: number; spin?: number; hardness?: number }> = {
  "Falta de potência": { speed: 1, spin: .3 }, "Falta de controle": { control: 1, speed: -.5 },
  "Falta de spin": { spin: 1, speed: .2 }, "Erros no backhand": { control: 1.2, speed: -.6, hardness: -.8 },
  Recepção: { control: 1, speed: -.4, hardness: -.5 },
};
export const STRENGTH_BONUS: Record<string, { speed?: number; spin?: number; control?: number }> = {
  Forehand: { speed: .4, spin: .5 }, Backhand: { control: .3, spin: .3 }, Saque: { spin: .5 }, Recepção: { control: .5 }, Bloqueio: { control: .6 }, Topspin: { spin: .6, speed: .3 },
};
