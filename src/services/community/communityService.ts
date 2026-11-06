import type { Comment, CommunityFilters, CommunitySort, CommunityUser, NewComment, NewPost, Post, PostPatch } from "../../types";
import { POST_CATEGORY_LABEL } from "../../utils/community";
import { mockCommunityRepository, type CommunityRepository } from "./communityRepository";

/**
 * COMMUNITY SERVICE — único ponto que a UI usa para a comunidade.
 * Acesso a dados = repositório (trocável por API). Busca/filtro/ordenação são funções puras sobre a lista
 * carregada; com muitos posts, passam a ser feitas no servidor. Pontos futuros de notificação (comentário,
 * curtida, resposta) são createComment e toggleLike.
 */
const repository: CommunityRepository = mockCommunityRepository; // trocar por ApiCommunityRepository

export const getPosts = (viewerId?: string) => repository.getPosts(viewerId);
export const getPostById = (id: string, viewerId?: string) => repository.getPostById(id, viewerId);
export const createPost = (input: NewPost) => repository.createPost(input);
export const updatePost = (id: string, userId: string, patch: PostPatch) => repository.updatePost(id, userId, patch);
export const deletePost = (id: string, userId: string) => repository.deletePost(id, userId);
export const getComments = (postId: string): Promise<Comment[]> => repository.getComments(postId);
export const createComment = (input: NewComment) => repository.createComment(input);
export const toggleLike = (postId: string, userId: string) => repository.toggleLike(postId, userId);
export const reportPost = (postId: string, userId: string) => repository.reportPost(postId, userId);
export const getUser = (id: string): Promise<CommunityUser | null> => repository.getUser(id);
export const getUserPosts = async (userId: string, viewerId?: string) => sortPosts((await getPosts(viewerId)).filter((p) => p.authorId === userId), "recent");
export const getRecentPosts = async (limit = 3, viewerId?: string) => sortPosts(await getPosts(viewerId), "recent").slice(0, limit);

export const DEFAULT_COMMUNITY_FILTERS: CommunityFilters = { search: "", category: "", tag: "", sort: "recent" };
export const SORT_LABELS: Record<CommunitySort, string> = { recent: "Mais recentes", relevant: "Mais relevantes", discussed: "Mais discutidos", liked: "Mais curtidos" };

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
/** Todos os termos precisam aparecer em título, conteúdo, autor, categoria ou tags. */
export function searchPosts(list: Post[], query: string): Post[] {
  const tokens = norm(query.trim().replace(/#/g, "")).split(/\s+/).filter(Boolean);
  if (!tokens.length) return list;
  return list.filter((p) => { const t = norm([p.title ?? "", p.content, p.author.name, POST_CATEGORY_LABEL[p.category], p.tags.join(" ")].join(" ")); return tokens.every((k) => t.includes(k)); });
}
export const filterPosts = (list: Post[], f: Pick<CommunityFilters, "category" | "tag">) =>
  list.filter((p) => (!f.category || p.category === f.category) && (!f.tag || p.tags.includes(f.tag)));
/** "Relevantes" = curtidas + 2 × comentários + bônus de recência (10 pontos no dia, caindo 1 por dia). */
export function relevanceScore(p: Post, now = Date.now()): number {
  const ageDays = (now - new Date(p.createdAt).getTime()) / 86_400_000;
  return p.likesCount + 2 * p.commentsCount + Math.max(0, 10 - ageDays);
}
export function sortPosts(list: Post[], sort: CommunitySort): Post[] {
  const by: Record<CommunitySort, (a: Post, b: Post) => number> = {
    recent: (a, b) => b.createdAt.localeCompare(a.createdAt), liked: (a, b) => b.likesCount - a.likesCount,
    discussed: (a, b) => b.commentsCount - a.commentsCount, relevant: (a, b) => relevanceScore(b) - relevanceScore(a),
  };
  return [...list].sort(by[sort]);
}
export const queryPosts = (list: Post[], f: CommunityFilters) => sortPosts(filterPosts(searchPosts(list, f.search), f), f.sort);
export function getPopularTags(list: Post[], limit = 8): string[] {
  const count = new Map<string, number>();
  list.forEach((p) => p.tags.forEach((t) => count.set(t, (count.get(t) ?? 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([t]) => t);
}
