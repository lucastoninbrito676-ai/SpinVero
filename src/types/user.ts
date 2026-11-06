export type PlayerLevel = "Iniciante" | "Intermediário" | "Avançado" | "Profissional";
export type PlayerStyle = "Ofensivo" | "Defensivo" | "All-round" | "Counter/Block" | "Topspin" | "Controle";
export type Hand = "Direita" | "Esquerda";
export type Priority = "Velocidade" | "Controle" | "Spin" | "Equilíbrio";
export interface PlayerProfile {
  level: PlayerLevel; style: PlayerStyle; hand: Hand;
  priority: Priority; budget: number; strength: string; problem: string;
}
/* ---- Fase 2: usuários e autenticação ---- */
export interface User { id: string; name: string; email: string; avatar?: string; createdAt: string }
export interface LoginInput { email: string; password: string }
export interface RegisterInput { name: string; email: string; password: string }
export type UserPatch = Partial<Pick<User, "name" | "avatar">>;
/** Perfil do atleta: os campos do questionário (PlayerProfile) mais o objetivo. Parcial até o usuário preenchê-lo. */
export type AthleteProfile = Partial<PlayerProfile> & { goal?: string };
