import { seedComments, seedPosts, seedUsers } from "../../data/community";
import { storage } from "../../lib/storage";
import { STORAGE_KEYS as K } from "../../lib/storageKeys";
import type { AuthorPreview, Comment, CommentRecord, CommunityUser, NewComment, NewPost, Post, PostPatch, PostRecord } from "../../types";
import { authService } from "../auth/authService";
import { profileService } from "../profile/profileService";

/**
 * FONTE DE DADOS DA COMUNIDADE.
 * Mock/local: posts e comentários semente + o que o usuário cria (localStorage). Curtidas ficam por usuário.
 * ⚠️ As verificações de permissão abaixo (só o autor exclui/edita) são SIMULAÇÃO: no navegador qualquer um
 * pode alterar o localStorage. Com backend, elas precisam ser validadas no servidor.
 * Para trocar por API: implemente CommunityRepository (ex.: ApiCommunityRepository) e altere uma linha em communityService.ts.
 */
export class CommunityError extends Error {}
export interface CommunityRepository {
  getPosts(viewerId?: string): Promise<Post[]>;
  getPostById(id: string, viewerId?: string): Promise<Post | null>;
  createPost(input: NewPost): Promise<Post>;
  updatePost(id: string, userId: string, patch: PostPatch): Promise<Post>;
  deletePost(id: string, userId: string): Promise<void>;
  getComments(postId: string): Promise<Comment[]>;
  createComment(input: NewComment): Promise<Comment>;
  toggleLike(postId: string, userId: string): Promise<{ liked: boolean; likesCount: number }>;
  reportPost(postId: string, userId: string): Promise<void>;
  getUser(id: string): Promise<CommunityUser | null>;
}

type LikesMap = Record<string, string[]>; // userId -> postIds curtidos
interface Report { postId: string; userId: string; at: string }
const latency = () => new Promise<void>((r) => setTimeout(r, 200));
const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const localPosts = () => storage.get<PostRecord[]>(K.communityPosts) ?? [];
const localComments = () => storage.get<CommentRecord[]>(K.communityComments) ?? [];
const likesMap = () => storage.get<LikesMap>(K.communityLikes) ?? {};
const reports = () => storage.get<Report[]>(K.communityReports) ?? [];
const allPosts = () => [...localPosts(), ...seedPosts];
const allComments = () => [...seedComments, ...localComments()];
const countLikes = (rec: PostRecord, map: LikesMap) => rec.baseLikes + Object.values(map).filter((ids) => ids.includes(rec.id)).length;

/** Usuário público: semente, ou conta real (authService + perfil salvo). Só campos não sensíveis. */
async function resolveUser(id: string): Promise<CommunityUser | null> {
  const seed = seedUsers.find((u) => u.id === id);
  if (seed) return seed;
  const user = await authService.getPublicUser(id);
  if (!user) return null;
  const p = profileService.load(id);
  return { id, name: user.name, avatar: user.avatar, level: p?.level, style: p?.style, hand: p?.hand, goal: p?.goal };
}
async function authorsOf(ids: string[]): Promise<Map<string, AuthorPreview>> {
  const out = new Map<string, AuthorPreview>();
  await Promise.all([...new Set(ids)].map(async (id) => { const u = await resolveUser(id); out.set(id, u ? { name: u.name, avatar: u.avatar, level: u.level } : { name: "Usuário removido" }); }));
  return out;
}
function toPost(rec: PostRecord, authors: Map<string, AuthorPreview>, viewerId?: string): Post {
  const map = likesMap(), { baseLikes: _b, ...rest } = rec;
  return { ...rest, author: authors.get(rec.authorId) ?? { name: "Usuário removido" }, likesCount: countLikes(rec, map),
    commentsCount: allComments().filter((c) => c.postId === rec.id).length,
    likedByCurrentUser: viewerId ? (map[viewerId] ?? []).includes(rec.id) : false,
    reportedByCurrentUser: viewerId ? reports().some((r) => r.postId === rec.id && r.userId === viewerId) : false };
}
async function hydrate(recs: PostRecord[], viewerId?: string): Promise<Post[]> {
  const authors = await authorsOf(recs.map((r) => r.authorId));
  return recs.map((r) => toPost(r, authors, viewerId));
}
function ownLocalPost(id: string, userId: string): PostRecord {
  const rec = localPosts().find((p) => p.id === id);
  if (!rec) throw new CommunityError("Esta publicação não pode ser alterada.");
  if (rec.authorId !== userId) throw new CommunityError("Você só pode alterar suas próprias publicações.");
  return rec;
}

export const mockCommunityRepository: CommunityRepository = {
  async getPosts(viewerId) { await latency(); return hydrate(allPosts(), viewerId); },
  async getPostById(id, viewerId) { await latency(); const rec = allPosts().find((p) => p.id === id); return rec ? (await hydrate([rec], viewerId))[0] : null; },
  async createPost(input) {
    await latency();
    const rec: PostRecord = { id: newId("p"), authorId: input.authorId, title: input.title?.trim() || undefined, content: input.content.trim(), category: input.category, createdAt: new Date().toISOString(), tags: input.tags, equipmentIds: input.equipmentIds, baseLikes: 0 };
    storage.set(K.communityPosts, [rec, ...localPosts()]);
    return (await hydrate([rec], input.authorId))[0];
  },
  async updatePost(id, userId, patch) {
    await latency();
    const rec = { ...ownLocalPost(id, userId), ...patch };
    storage.set(K.communityPosts, localPosts().map((p) => (p.id === id ? rec : p)));
    return (await hydrate([rec], userId))[0];
  },
  async deletePost(id, userId) {
    await latency(); ownLocalPost(id, userId);
    storage.set(K.communityPosts, localPosts().filter((p) => p.id !== id));
    storage.set(K.communityComments, localComments().filter((c) => c.postId !== id));
  },
  async getComments(postId) {
    await latency();
    const recs = allComments().filter((c) => c.postId === postId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const authors = await authorsOf(recs.map((c) => c.authorId));
    return recs.map((c) => ({ ...c, author: authors.get(c.authorId) ?? { name: "Usuário removido" } }));
  },
  async createComment(input) {
    await latency();
    const rec: CommentRecord = { id: newId("c"), postId: input.postId, authorId: input.authorId, content: input.content.trim(), createdAt: new Date().toISOString() };
    storage.set(K.communityComments, [...localComments(), rec]);
    return { ...rec, author: (await authorsOf([rec.authorId])).get(rec.authorId)! };
  },
  async toggleLike(postId, userId) {
    await latency();
    const rec = allPosts().find((p) => p.id === postId);
    if (!rec) throw new CommunityError("Publicação não encontrada.");
    const map = likesMap(), mine = map[userId] ?? [], liked = !mine.includes(postId); // um like por usuário por post
    map[userId] = liked ? [...mine, postId] : mine.filter((i) => i !== postId);
    storage.set(K.communityLikes, map);
    return { liked, likesCount: countLikes(rec, map) };
  },
  async reportPost(postId, userId) {
    await latency();
    if (!reports().some((r) => r.postId === postId && r.userId === userId)) storage.set(K.communityReports, [...reports(), { postId, userId, at: new Date().toISOString() }]);
  },
  async getUser(id) { await latency(); return resolveUser(id); },
};
