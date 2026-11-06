import type { PostCategory, PostRecord } from "../../types";
import { products } from "../products";
// Posts FICTÍCIOS. Equipamentos são referenciados por nome e convertidos em Product.id (nada de dados de produto duplicados).
const idOf = (name: string) => products.find((p) => p.name === name)?.id;
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
type Row = [id: number, author: string, cat: PostCategory, hours: number, title: string, content: string, tags: string[], equip: string[], likes: number];
const ROWS: Row[] = [
  [1, "rafael", "equipment", 3, "Qual borracha vocês usam no backhand?", "Jogo com madeira ALC e sinto que o backhand escapa da mesa. Meu orçamento é de até R$300. Alguém usa algo mais macio?", ["backhand", "borracha", "controle"], ["Cinder Control"], 24],
  [2, "camila", "technique", 20, "Como vocês melhoraram o topspin de forehand?", "Estou travada no topspin contra backspin. Percebi que acelero tarde. Alguma dica de exercício de multibola?", ["topspin", "forehand"], [], 41],
  [3, "bianca", "questions", 30, "Primeira raquete: montada ou separar madeira e borracha?", "Comecei há dois meses e jogo duas vezes por semana. Vale já montar a minha?", ["iniciante", "madeira"], ["Vortex Allround"], 17],
  [4, "thiago", "training", 50, "Treino de recepção que mais ajudou vocês", "Fiz três semanas de recepção de saque curto com variação de efeito e o ganho foi grande. Compartilho a rotina se alguém quiser.", ["recepcao", "treino"], [], 33],
  [5, "marina", "competition", 70, "Como vocês controlam o nervosismo em campeonato?", "Nos pontos decisivos meu braço encurta. Estou testando respiração e uma rotina fixa antes do saque.", ["competicao", "mental"], [], 58],
  [6, "lucas", "progress", 96, "Meu primeiro mês treinando 4 vezes por semana", "Saí de errar quase tudo para sustentar trocas de 15 bolas. O que mais ajudou foi gravar meus treinos.", ["evolucao", "iniciante"], [], 29],
  [7, "diego", "questions", 120, "Vale trocar para uma madeira carbono?", "Uso uma madeira all-round há dois anos. Quero mais velocidade sem perder muito controle. Carbono é o caminho?", ["madeira", "carbono"], ["Aurora Carbon"], 21],
  [8, "fernanda", "equipment", 150, "Borracha de pinos longos: vale a pena aprender?", "Jogo defensivo e estou pensando em testar pinos longos no backhand. Quem já usa, como foi a adaptação?", ["pinos", "defesa"], ["Echo Long"], 14],
  [9, "gustavo", "technique", 180, "Rotação de tronco no forehand: o que mudou meu jogo", "Passei a iniciar o movimento pelo quadril e não pelo braço. Ganhei potência sem perder consistência.", ["forehand", "tecnica"], [], 47],
  [10, "helena", "equipment", 210, "Comparando duas raquetes montadas, qual escolher?", "Estou entre duas opções de ataque com topspin. Uma é mais rápida, a outra tem mais controle. Meu estilo é topspin.", ["raquete", "topspin"], ["Aurora Carbon Combo", "Pulsar Fiber Combo"], 19],
  [11, "camila", "competition", 260, "Aquecimento antes do jogo: o que vocês fazem?", "Faço 10 minutos de mobilidade e depois bolas lentas de forehand e backhand. Evita erro nos primeiros pontos.", ["aquecimento", "competicao"], [], 26],
  [12, "rafael", "progress", 300, "Subi de nível no ranking do clube", "Depois de três meses focando no backhand consegui vencer jogadores que antes me superavam.", ["evolucao", "backhand"], [], 38],
  [13, "bianca", "general", 340, "Procuro parceiros de treino em Campinas", "Jogo à noite durante a semana, nível iniciante. Se alguém quiser treinar junto, comenta aqui.", ["treino", "parceiros"], [], 11],
  [14, "thiago", "equipment", 400, "Cola à base d'água: dura bastante?", "Troco de borracha a cada dois meses. Alguém recomenda alguma cola que não descole no meio do jogo?", ["cola", "manutencao"], ["Cola à base d'água 50 ml"], 9],
  [15, "marina", "technique", 460, "Saque com efeito: erros que eu cometia", "Eu errava o ponto de contato da bola. Gravar o saque em câmera lenta mostrou tudo.", ["saque", "tecnica"], [], 52],
  [16, "gustavo", "training", 520, "Multibola de forehand: quantas séries por treino?", "Faço 4 séries de 2 minutos. Estou em dúvida se vale aumentar a duração ou o número de séries.", ["multibola", "forehand"], [], 18],
  [17, "lucas", "questions", 600, "Como saber se minha borracha já está gasta?", "A bola parece escorregar mais. É sinal de troca ou é impressão minha?", ["borracha", "manutencao"], ["Alba Spin"], 13],
  [18, "helena", "general", 700, "Qual o melhor tipo de bola para treino em casa?", "Vou montar um espaço de treino e quero bolas duráveis. Preferem de plástico ou celuloide?", ["bola", "treino"], ["Bola treino 40+ (12 un.)"], 16],
  [19, "diego", "training", 800, "Treino com a esquerda: dica para canhotos", "Como canhoto, sinto falta de material pensado para o meu lado. Compartilhem exercícios de posicionamento.", ["canhoto", "treino"], [], 22],
  [20, "fernanda", "progress", 900, "Minha evolução em consistência neste trimestre", "Aumentei de 8 para 20 bolas seguidas no bloqueio. A regularidade é o que mais valorizo hoje.", ["consistencia", "evolucao"], [], 31],
];
export const seedPosts: PostRecord[] = ROWS.map(([n, author, category, h, title, content, tags, equip, baseLikes]) => ({
  id: `p-${String(n).padStart(2, "0")}`, authorId: `u-${author}`, title, content, category, createdAt: hoursAgo(h), tags,
  equipmentIds: equip.map(idOf).filter((i): i is string => !!i), baseLikes,
}));
