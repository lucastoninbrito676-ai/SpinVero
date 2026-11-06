import type { CommentRecord } from "../../types";
// Comentários FICTÍCIOS: [post, autor, horas atrás, texto].
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const ROWS: [number, string, number, string][] = [
  [1, "camila", 2, "Experimente uma esponja de 2,0 mm no backhand: perde um pouco de potência e ganha controle."], [1, "diego", 1, "Vale conferir também o desgaste da borracha atual."], [1, "thiago", 1, "Eu uso uma de controle e melhorou muito a recepção."],
  [2, "gustavo", 18, "Comece o movimento pelo quadril e acelere só no contato."], [2, "marina", 16, "Multibola lento primeiro, depois aumente a velocidade."],
  [3, "rafael", 28, "Para começar, montada simples resolve. Separar vale quando você souber o que quer."], [3, "fernanda", 26, "Concordo, prefira algo de controle."],
  [4, "bianca", 48, "Pode compartilhar a rotina? Tenho muita dificuldade com saque curto."], [4, "lucas", 47, "Também quero!"],
  [5, "camila", 66, "Rotina fixa antes do saque ajudou muito aqui."], [5, "helena", 64, "Respiração lenta nos pontos decisivos funciona para mim."], [5, "thiago", 60, "Treine pontos com placar apertado nos treinos."],
  [6, "rafael", 90, "Parabéns pela evolução! Gravar treino é ótimo."], [6, "diego", 88, "Quatro vezes por semana é um ritmo excelente."],
  [7, "marina", 110, "Carbono dá velocidade, mas exige técnica. Teste antes se puder."], [7, "gustavo", 105, "Se quer manter controle, olhe madeiras híbridas."],
  [8, "thiago", 140, "A adaptação leva semanas. Comece com treino específico."], [9, "camila", 170, "Mesma experiência aqui, mudou meu forehand."], [9, "rafael", 165, "Ótima dica, vou testar."],
  [10, "gustavo", 200, "Para topspin, eu iria na mais rápida se você já tem boa técnica."], [10, "marina", 195, "Compare as duas lado a lado no comparador do SpinLab."],
  [11, "bianca", 250, "Vou copiar essa rotina!"], [12, "camila", 290, "Excelente! Continue focando no backhand."], [12, "diego", 285, "Parabéns!"],
  [13, "lucas", 330, "Também jogo à noite, posso ir!"], [14, "rafael", 390, "Uso uma que dura bem, mas aplique em camada fina."], [15, "gustavo", 450, "Câmera lenta é o melhor professor."],
  [15, "camila", 445, "Concordo, o ponto de contato é tudo no saque."], [16, "marina", 510, "Mais séries curtas funcionam melhor para mim."], [17, "thiago", 590, "Se a bola escorrega, provavelmente está na hora de trocar."],
  [17, "fernanda", 585, "Limpe a borracha antes de decidir."], [18, "rafael", 690, "Celuloide para jogar sério, plástico para treino em casa."], [19, "marina", 790, "Treine posição e rotação do corpo, ajuda muito."],
  [20, "camila", 880, "Consistência é a base de tudo. Parabéns!"], [20, "bianca", 875, "Que inspiração."],
];
export const seedComments: CommentRecord[] = ROWS.map(([post, author, h, content], i) => ({ id: `c-${String(i + 1).padStart(3, "0")}`, postId: `p-${String(post).padStart(2, "0")}`, authorId: `u-${author}`, content, createdAt: hoursAgo(h) }));
