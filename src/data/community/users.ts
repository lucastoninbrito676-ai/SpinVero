import type { CommunityUser } from "../../types";
// Usuários FICTÍCIOS da comunidade (nenhum dado pessoal real). Usuários reais vêm do authService.
export const seedUsers: CommunityUser[] = [
  { id: "u-rafael", name: "Rafael Moura", level: "Intermediário", style: "Ofensivo", hand: "Direita", goal: "Ter mais spin" },
  { id: "u-camila", name: "Camila Souza", level: "Avançado", style: "Topspin", hand: "Direita", goal: "Competir em torneios" },
  { id: "u-diego", name: "Diego Prado", level: "Intermediário", style: "All-round", hand: "Esquerda", goal: "Melhorar minha técnica" },
  { id: "u-bianca", name: "Bianca Lima", level: "Iniciante", style: "Controle", hand: "Direita", goal: "Jogar por diversão e saúde" },
  { id: "u-thiago", name: "Thiago Alves", level: "Avançado", style: "Counter/Block", hand: "Direita", goal: "Ter mais controle" },
  { id: "u-marina", name: "Marina Costa", level: "Profissional", style: "Ofensivo", hand: "Esquerda", goal: "Competir em torneios" },
  { id: "u-lucas", name: "Lucas Pereira", level: "Iniciante", style: "All-round", hand: "Direita", goal: "Melhorar minha técnica" },
  { id: "u-fernanda", name: "Fernanda Rocha", level: "Intermediário", style: "Defensivo", hand: "Direita", goal: "Ter mais controle" },
  { id: "u-gustavo", name: "Gustavo Nunes", level: "Avançado", style: "Ofensivo", hand: "Direita", goal: "Ter mais potência" },
  { id: "u-helena", name: "Helena Martins", level: "Intermediário", style: "Topspin", hand: "Esquerda", goal: "Escolher o equipamento ideal" },
];
