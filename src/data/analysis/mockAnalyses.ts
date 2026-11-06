import type { MetricKey, StrokeType } from "../../types";
/**
 * CONTEÚDO DO PROVEDOR SIMULADO. Nada aqui é calculado a partir de vídeo: são pontuações-base por golpe
 * (na ordem de METRIC_KEYS) e textos de exemplo. Os valores finais variam de forma determinística
 * conforme o arquivo escolhido, só para a demonstração parecer viva.
 */
export const RESULT_NOTICE = "Resultado simulado — visão computacional ainda não conectada.";
// preparação, posicionamento, rotação do tronco, braço, contato, transferência de peso, recuperação
export const BASE_SCORES: Record<StrokeType, number[]> = {
  forehand: [84, 76, 80, 82, 78, 74, 70], backhand: [74, 72, 68, 70, 66, 68, 72], serve: [80, 78, 70, 76, 72, 66, 64],
  push: [78, 80, 64, 72, 76, 70, 74], topspin: [76, 72, 78, 74, 70, 72, 68], smash: [72, 70, 82, 80, 68, 78, 62],
};
interface MetricCopy { strength: string; weakness: string; step: string; explanation: [string, string, string]; feedback: [string, string, string] }
/** explanation/feedback: [bom, atenção, melhorar] */
export const METRIC_COPY: Record<MetricKey, MetricCopy> = {
  preparation: { strength: "Boa preparação", weakness: "Preparação do movimento", step: "Treine a preparação com shadow play, em câmera lenta.",
    explanation: ["A preparação aparece organizada e com tempo antes do contato.", "A preparação é razoável, mas varia entre repetições.", "A preparação parece tardia ou curta."],
    feedback: ["Mantenha esse padrão ao aumentar a velocidade.", "Padronize a posição inicial do braço e do corpo.", "Antecipe a preparação assim que a bola sai da mesa adversária."] },
  positioning: { strength: "Bom posicionamento", weakness: "Posicionamento antes do golpe", step: "Faça exercícios de deslocamento e retorno à base.",
    explanation: ["O corpo chega bem posicionado em relação à bola.", "O posicionamento é adequado na maior parte das repetições.", "O corpo parece chegar perto demais ou longe demais da bola."],
    feedback: ["Continue chegando cedo à bola.", "Ajuste a distância dos pés antes do golpe.", "Dê passos curtos para ajustar a distância antes de bater."] },
  trunkRotation: { strength: "Boa rotação do tronco", weakness: "Rotação do tronco", step: "Pratique a rotação do tronco antes de acelerar o braço.",
    explanation: ["A rotação do tronco contribui bem para a potência.", "Há rotação, mas pouco aproveitada na aceleração.", "A rotação do tronco parece limitada."],
    feedback: ["Mantenha a rotação à medida que ganha velocidade.", "Inicie a rotação do tronco um pouco antes do braço.", "Gire o quadril e o tronco para iniciar o golpe, não só o braço."] },
  armMovement: { strength: "Movimento do braço fluido", weakness: "Trajetória do braço", step: "Repita o golpe com foco na trajetória do braço, sem tensão.",
    explanation: ["A trajetória do braço é fluida e consistente.", "A trajetória é boa, com pequena tensão no ombro.", "A trajetória do braço parece irregular."],
    feedback: ["Mantenha o braço relaxado até o contato.", "Relaxe o ombro e mantenha o cotovelo em posição estável.", "Reduza o movimento do pulso e priorize uma trajetória mais curta."] },
  contactPoint: { strength: "Bom ponto de contato", weakness: "Momento do contato", step: "Treine o contato um pouco mais à frente do corpo com multibola.",
    explanation: ["O contato acontece em boa posição em relação ao corpo.", "Bom ponto de contato, mas existe espaço para realizá-lo um pouco mais à frente do corpo.", "O contato parece ocorrer atrasado ou muito junto ao corpo."],
    feedback: ["Mantenha o contato à frente e na altura certa.", "Tente tocar a bola um pouco mais à frente do corpo.", "Procure bater a bola antes que ela passe do corpo."] },
  weightTransfer: { strength: "Boa transferência de peso", weakness: "Transferência de peso", step: "Pratique o apoio nas pernas e a transferência de peso com passos curtos.",
    explanation: ["O peso passa bem de uma perna para a outra durante o golpe.", "A transferência de peso existe, mas é parcial.", "O peso parece ficar parado em uma das pernas."],
    feedback: ["Continue usando as pernas para gerar força.", "Empurre o chão com a perna de trás ao iniciar o golpe.", "Flexione os joelhos e transfira o peso para a frente no golpe."] },
  recovery: { strength: "Boa recuperação", weakness: "Recuperação para a posição base", step: "Trabalhe a recuperação para a posição base logo após cada golpe.",
    explanation: ["A volta à posição base é rápida.", "A recuperação é boa, mas atrasa em algumas sequências.", "A volta à posição base parece lenta."],
    feedback: ["Mantenha a postura equilibrada ao finalizar.", "Termine o golpe já pensando na próxima bola.", "Encurte a finalização e volte para a base imediatamente."] },
};
