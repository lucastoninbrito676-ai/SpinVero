import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as community from "../services/community/communityService";
import type { Comment, CommunityUser, NewPost, Post, User } from "../types";

/** Ações exigem login: visitantes vão para /login e voltam à página de origem depois. */
function useRequireUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return useCallback((): User | null => { if (user) return user; navigate("/login", { state: { from: pathname } }); return null; }, [user, navigate, pathname]);
}
const flipLike = (p: Post): Post => ({ ...p, likedByCurrentUser: !p.likedByCurrentUser, likesCount: p.likesCount + (p.likedByCurrentUser ? -1 : 1) });

/** Feed completo: carrega, e expõe curtir/publicar/excluir/denunciar com atualização imediata da tela. */
export function useFeed() {
  const { user, loading: authLoading } = useAuth();
  const requireUser = useRequireUser();
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setError(false); community.getPosts(user?.id).then(setPosts).catch(() => setError(true)); }, [user?.id]);
  useEffect(() => { if (!authLoading) load(); }, [authLoading, load]);
  const patch = (id: string, fn: (p: Post) => Post) => setPosts((ps) => ps && ps.map((p) => (p.id === id ? fn(p) : p)));

  const toggleLike = async (id: string) => {
    const u = requireUser(); if (!u) return;
    patch(id, flipLike); // otimista; o resultado do serviço prevalece
    try { const r = await community.toggleLike(id, u.id); patch(id, (p) => ({ ...p, likedByCurrentUser: r.liked, likesCount: r.likesCount })); } catch { load(); }
  };
  const create = async (input: Omit<NewPost, "authorId">) => {
    const u = requireUser(); if (!u) return null;
    const p = await community.createPost({ ...input, authorId: u.id });
    setPosts((ps) => [p, ...(ps ?? [])]);
    return p;
  };
  const remove = async (id: string) => { const u = requireUser(); if (!u) return; await community.deletePost(id, u.id); setPosts((ps) => ps && ps.filter((p) => p.id !== id)); };
  const report = async (id: string) => { const u = requireUser(); if (!u) return; await community.reportPost(id, u.id); patch(id, (p) => ({ ...p, reportedByCurrentUser: true })); };
  return { posts, loading: posts === null && !error, error, reload: load, user, toggleLike, create, remove, report };
}

/** Uma publicação + comentários. */
export function usePost(id: string | undefined) {
  const { user, loading: authLoading } = useAuth();
  const requireUser = useRequireUser();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "notfound" | "error">("loading");
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setStatus("loading");
    (async () => {
      const p = id ? await community.getPostById(id, user?.id) : null;
      if (!p) return cancelled ? undefined : setStatus("notfound");
      const cs = await community.getComments(p.id);
      if (!cancelled) { setPost(p); setComments(cs); setStatus("ready"); }
    })().catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [id, user?.id, authLoading]);

  const toggleLike = async () => {
    const u = requireUser(); if (!u || !post) return;
    setPost(flipLike(post));
    try { const r = await community.toggleLike(post.id, u.id); setPost((p) => p && { ...p, likedByCurrentUser: r.liked, likesCount: r.likesCount }); } catch { setPost(post); }
  };
  const addComment = async (content: string) => {
    const u = requireUser(); if (!u || !post) return;
    const c = await community.createComment({ postId: post.id, authorId: u.id, content });
    setComments((cs) => [...cs, c]); setPost((p) => p && { ...p, commentsCount: p.commentsCount + 1 });
  };
  const remove = async () => { const u = requireUser(); if (u && post) await community.deletePost(post.id, u.id); };
  const report = async () => { const u = requireUser(); if (!u || !post) return; await community.reportPost(post.id, u.id); setPost({ ...post, reportedByCurrentUser: true }); };
  return { status, post, comments, user, toggleLike, addComment, remove, report };
}

/** Perfil público + publicações do usuário. */
export function useUserProfile(id: string | undefined) {
  const { user, loading: authLoading } = useAuth();
  const [state, setState] = useState<{ status: "loading" | "notfound" | "error" } | { status: "ready"; profile: CommunityUser; posts: Post[] }>({ status: "loading" });
  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    setState({ status: "loading" });
    (async () => {
      const profile = id ? await community.getUser(id) : null;
      if (!profile) return cancelled ? undefined : setState({ status: "notfound" });
      const posts = await community.getUserPosts(profile.id, user?.id);
      if (!cancelled) setState({ status: "ready", profile, posts });
    })().catch(() => { if (!cancelled) setState({ status: "error" }); });
    return () => { cancelled = true; };
  }, [id, user?.id, authLoading]);
  return state;
}

/** Posts mais recentes de um usuário (perfil) ou da comunidade toda (Home, dashboard). */
export function useRecentPosts(limit: number, userId?: string) {
  const [posts, setPosts] = useState<Post[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    (userId ? community.getUserPosts(userId) : community.getRecentPosts(limit)).then((p) => { if (!cancelled) setPosts(p.slice(0, limit)); }).catch(() => { if (!cancelled) setPosts([]); });
    return () => { cancelled = true; };
  }, [limit, userId]);
  return posts;
}

/** Resumo para o dashboard: publicações do usuário e comentários recebidos. */
export function useCommunityActivity(userId: string) {
  const [data, setData] = useState<{ mine: Post[]; recent: Post[] } | null>(null);
  useEffect(() => {
    let cancelled = false;
    community.getPosts(userId).then((all) => { if (!cancelled) setData({ mine: community.sortPosts(all.filter((p) => p.authorId === userId), "recent"), recent: community.sortPosts(all, "recent").slice(0, 3) }); }).catch(() => { if (!cancelled) setData({ mine: [], recent: [] }); });
    return () => { cancelled = true; };
  }, [userId]);
  return data && { ...data, commentsReceived: data.mine.reduce((s, p) => s + p.commentsCount, 0) };
}
