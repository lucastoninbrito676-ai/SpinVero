/** Chaves de localStorage da Fase 4. Para vincular a um usuário no futuro, sufixar com o id. */
export const STORAGE_KEYS = { favorites: "spinlab:favorites", comparison: "spinlab:comparison",
  // Comunidade (mock/local): posts e comentários criados aqui, curtidas por usuário e denúncias.
  communityPosts: "spinlab.community.posts", communityComments: "spinlab.community.comments", communityLikes: "spinlab.community.likes", communityReports: "spinlab.community.reports",
  // Histórico de análises de movimento (metadados + resultado; nunca o vídeo).
  analysisHistory: "spinlab.analysis.history" } as const;
