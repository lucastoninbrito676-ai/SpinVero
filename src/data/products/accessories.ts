import type { Accessory, AccessoryType } from "../../types";
import { baseFields, brandOf, price5, rng } from "./builders";
// Mock: 24 acessórios. Acessórios não têm velocidade/spin/controle.
const LEVELS = ["Iniciante", "Intermediário", "Avançado", "Profissional"] as const;
const ROWS: [AccessoryType, string, number, string][] = [
  ["ball", "Bola treino 40+ (12 un.)", 70, "Plástico, para treino"], ["ball", "Bola 3 estrelas (6 un.)", 95, "Competição"], ["ball", "Bola 1 estrela (24 un.)", 85, "Multibola"], ["ball", "Bola 2 estrelas (3 un.)", 45, "Treino"],
  ["case", "Capa dupla térmica", 160, "Duas raquetes e bolas"], ["case", "Estojo rígido", 110, "Uma raquete"], ["case", "Mochila esportiva", 240, "Compartimento para raquetes"], ["case", "Capa simples", 60, "Uma raquete"],
  ["protector", "Protetor de borda 12 mm", 35, "Fita adesiva"], ["protector", "Película de proteção (par)", 40, "Para borrachas"], ["protector", "Protetor de borda 9 mm", 30, "Fita adesiva"],
  ["glue", "Cola à base d'água 50 ml", 55, "Troca de borrachas"], ["glue", "Cola à base d'água 100 ml", 90, "Troca de borrachas"], ["glue", "Folha adesiva (par)", 50, "Sem cola líquida"],
  ["towel", "Toalha esportiva", 45, "Algodão"], ["towel", "Toalha de microfibra", 55, "Secagem rápida"],
  ["net", "Rede com suportes", 120, "Instalação por pressão"], ["net", "Rede de treino", 150, "Para multibola"],
  ["apparel", "Camiseta técnica", 130, "Secagem rápida"], ["apparel", "Shorts esportivo", 110, "Tecido leve"], ["apparel", "Tênis de salão", 320, "Solado de borracha"], ["apparel", "Munhequeira (par)", 30, "Algodão"],
  ["other", "Limpador de borracha", 40, "Espuma"], ["other", "Marcador de placar", 50, "Manual"],
];
export const accessories: Accessory[] = ROWS.map(([type, name, price, details], i) => {
  const r = rng(1300 + i);
  return { ...baseFields(r, "accessory", name, brandOf(i * 3), price5(price), `${details}. Dados fictícios para demonstração.`, [type], { styles: [], levels: [...LEVELS] }), category: "accessory", specifications: { type, details } };
});
