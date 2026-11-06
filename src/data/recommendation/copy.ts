export const REASON_COPY = {
  profile: (level: string) => `Adequada ao nível ${level.toLowerCase()}.`,
  style: (style: string) => `A configuração conversa com seu estilo ${style.toLowerCase()}.`,
  goal: (goal: string) => `Ajuda a priorizar seu objetivo de ${goal.toLowerCase()}.`,
  movement: (text: string) => text,
  evolution: (text: string) => text,
  control: (text: string) => text,
  speed: (text: string) => text,
  spin: (text: string) => text,
  budget: (text: string) => text,
  compatibility: (text: string) => text,
};
export const SIMULATED_NOTICE = "Análise demonstrativa considerada.";
