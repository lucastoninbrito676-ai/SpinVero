import type { Hand, PlayerLevel, PlayerStyle } from "./user";

export type PostCategory = "equipment" | "technique" | "training" | "competition" | "questions" | "progress" | "general";
export type CommunitySort = "recent" | "relevant" | "discussed" | "liked";

/** Autor exibido em posts/comentários. É resolvido na leitura (não copiado), para refletir nome/foto/nível atuais. */
export interface AuthorPreview { name: string; avatar?: string; level?: PlayerLevel }
/** Perfil público: só campos não sensíveis (sem e-mail, orçamento, etc.). */
export interface CommunityUser { id: string; name: string; avatar?: string; level?: PlayerLevel; style?: PlayerStyle; hand?: Hand; goal?: string }

/** Formato armazenado (equivale a uma linha da tabela `posts`). */
export interface PostRecord {
  id: string; authorId: string; title?: string; content: string; category: PostCategory; createdAt: string;
  tags: string[]; equipmentIds: string[]; baseLikes: number;
}
/** Formato entregue à interface: registro + autor + contagens calculadas + estado do usuário atual. */
export interface Post {
  id: string; authorId: string; author: AuthorPreview; title?: string; content: string; category: PostCategory; createdAt: string;
  likesCount: number; commentsCount: number; likedByCurrentUser?: boolean; reportedByCurrentUser?: boolean;
  tags: string[]; equipmentIds: string[]; // equipmentIds referenciam Product.id (ProductService)
}
export interface CommentRecord { id: string; postId: string; authorId: string; content: string; createdAt: string }
export interface Comment extends CommentRecord { author: AuthorPreview }

export interface NewPost { authorId: string; title?: string; content: string; category: PostCategory; tags: string[]; equipmentIds: string[] }
export type PostPatch = Partial<Pick<NewPost, "title" | "content" | "category" | "tags" | "equipmentIds">>;
export interface NewComment { postId: string; authorId: string; content: string }
export interface CommunityFilters { search: string; category: PostCategory | ""; tag: string; sort: CommunitySort }
