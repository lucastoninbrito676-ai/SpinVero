import type { Blade, PlayerProfile, Rubber } from "../../../types";
import type { EvolutionSignal, MovementSignal } from "../../../types/advancedRecommendation";
import { GOAL_FOCUS, PRIORITY_TARGETS, PROBLEM_ADJUSTMENTS, SPEED_CAP, STRENGTH_BONUS, STYLE_TARGETS } from "../../../data/recommendation/rules";

type ProfileWithGoal = PlayerProfile & { goal?: string };
export interface PlayerNeeds { speed: number; control: number; spin: number; hardness: number; forehandBias: number; backhandControl: number; }
const clamp = (n: number, min = 1, max = 10) => Math.max(min, Math.min(max, n));
export function buildNeeds(profile: ProfileWithGoal, signals: MovementSignal[], evolution: EvolutionSignal[] = []): PlayerNeeds {
  const base = STYLE_TARGETS[profile.style] ?? STYLE_TARGETS["All-round"];
  const priority = PRIORITY_TARGETS[profile.priority ?? "Equilíbrio"];
  const p = PROBLEM_ADJUSTMENTS[profile.problem ?? ""] ?? {};
  const s = STRENGTH_BONUS[profile.strength ?? ""] ?? {};
  let speed = base.speed * .55 + priority.speed * .45;
  let control = base.control * .55 + priority.control * .45;
  let spin = base.spin * .55 + priority.spin * .45;
  speed += p.speed ?? 0; control += p.control ?? 0; spin += p.spin ?? 0;
  speed += s.speed ?? 0; control += s.control ?? 0; spin += s.spin ?? 0;
  if (profile.goal && GOAL_FOCUS[profile.goal]) {
    const attr = GOAL_FOCUS[profile.goal];
    if (attr === "speed") speed += .7; if (attr === "control") control += .7; if (attr === "spin") spin += .7;
  }
  speed = Math.min(speed, SPEED_CAP[profile.level]);
  let forehandBias = profile.style === "Ofensivo" || profile.style === "Topspin" ? 1.05 : 1;
  let backhandControl = profile.problem === "Erros no backhand" || profile.style === "Counter/Block" || profile.style === "Defensivo" ? 1.2 : 1;
  for (const signal of signals) {
    const f = signal.strength;
    if (signal.metric === "contactPoint" || signal.metric === "armMovement") {
      if (signal.direction === "increase") control += f * .5;
    }
    if (signal.metric === "weightTransfer" || signal.metric === "trunkRotation") {
      if (signal.direction === "increase") control += f * .3;
    }
    if (signal.metric === "recovery" && signal.direction === "increase") backhandControl += f * .1;
  }
  for (const trend of evolution) {
    if (trend.direction === "declining") control += trend.strength * .6;
    if (trend.direction === "improving") { speed += trend.strength * .2; spin += trend.strength * .25; }
  }
  const hardness = clamp(45 + (speed - control) * 1.2 + (p.hardness ?? 0), 36, 51);
  return { speed: clamp(speed), control: clamp(control), spin: clamp(spin), hardness, forehandBias, backhandControl };
}

export function componentTarget(product: Blade | Rubber, needs: PlayerNeeds, side: "blade" | "forehand" | "backhand") {
  const speed = product.specifications.speed;
  const control = product.specifications.control;
  const spin = product.category === "rubber" ? product.specifications.spin : undefined;
  let targetSpeed = needs.speed, targetControl = needs.control, targetSpin = needs.spin;
  if (side === "backhand") { targetSpeed -= 1; targetControl = Math.min(10, targetControl + needs.backhandControl - 1); targetSpin -= .2; }
  if (side === "forehand") targetSpeed += (needs.forehandBias - 1) * 2;
  const matches = [1 - Math.abs(speed - targetSpeed) / 10, 1 - Math.abs(control - targetControl) / 10];
  if (spin != null) matches.push(1 - Math.abs(spin - targetSpin) / 10);
  return Math.max(0, Math.min(1, matches.reduce((a, b) => a + b, 0) / matches.length));
}
