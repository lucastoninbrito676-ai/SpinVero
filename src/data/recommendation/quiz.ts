import type { QuestionKey } from "../../types";
export interface QuizQuestion { key: QuestionKey; title: string; options: { label: string; value: string }[] }
const same = (a: string[]) => a.map((x) => ({ label: x, value: x }));
export const questions: QuizQuestion[] = [
  { key: "level", title: "Qual seu nível?", options: same(["Iniciante", "Intermediário", "Avançado", "Profissional"]) },
  { key: "style", title: "Qual seu estilo?", options: same(["Ofensivo", "Defensivo", "All-round", "Counter/Block", "Topspin", "Controle"]) },
  { key: "hand", title: "Qual sua mão?", options: same(["Direita", "Esquerda"]) },
  { key: "priority", title: "O que você mais valoriza?", options: same(["Velocidade", "Controle", "Spin", "Equilíbrio"]) },
  { key: "budget", title: "Qual seu orçamento?", options: [{ label: "Até R$300", value: "300" }, { label: "R$300–600", value: "600" }, { label: "R$600–1.000", value: "1000" }, { label: "R$1.000+", value: "3000" }] },
  { key: "strength", title: "Qual seu ponto forte?", options: same(["Forehand", "Backhand", "Saque", "Recepção", "Bloqueio", "Topspin"]) },
  { key: "problem", title: "Qual seu principal problema?", options: same(["Falta de potência", "Falta de controle", "Falta de spin", "Erros no backhand", "Recepção"]) },
];
