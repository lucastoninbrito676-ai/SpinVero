import type { LoginInput, RegisterInput } from "../types";
export const MIN_PASSWORD = 8;
export type Errors<K extends string> = Partial<Record<K, string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLogin(v: LoginInput): Errors<keyof LoginInput> {
  const e: Errors<keyof LoginInput> = {};
  if (!v.email.trim()) e.email = "Informe seu e-mail."; else if (!EMAIL.test(v.email.trim())) e.email = "Informe um e-mail válido.";
  if (!v.password) e.password = "Informe sua senha.";
  return e;
}
export function validateRegister(v: RegisterInput & { confirm: string }): Errors<keyof RegisterInput | "confirm"> {
  const e: Errors<keyof RegisterInput | "confirm"> = {};
  if (!v.name.trim()) e.name = "Informe seu nome.";
  if (!v.email.trim()) e.email = "Informe seu e-mail."; else if (!EMAIL.test(v.email.trim())) e.email = "Informe um e-mail válido.";
  if (v.password.length < MIN_PASSWORD) e.password = `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`;
  if (v.confirm !== v.password) e.confirm = "As senhas não coincidem.";
  return e;
}
