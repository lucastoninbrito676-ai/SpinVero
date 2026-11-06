import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFeed } from "../hooks/useCommunity";
import { DEFAULT_COMMUNITY_FILTERS, getPopularTags, queryPosts } from "../services/community/communityService";
import type { CommunityFilters as Filters } from "../types";
import CommunityFilters from "../components/community/CommunityFilters";
import CommunitySearch from "../components/community/CommunitySearch";
import PostCard from "../components/community/PostCard";
import PostComposer from "../components/community/PostComposer";
import EmptyState from "../components/ui/EmptyState";
import { Button } from "../components/ui";

export default function Community() {
  const feed = useFeed();
  const [filters, setFilters] = useState<Filters>(DEFAULT_COMMUNITY_FILTERS);
  const results = useMemo(() => (feed.posts ? queryPosts(feed.posts, filters) : []), [feed.posts, filters]);
  const tags = useMemo(() => getPopularTags(feed.posts ?? []), [feed.posts]);
  const clear = () => setFilters(DEFAULT_COMMUNITY_FILTERS);

  return (<><h1>Comunidade</h1><p className="sub">Converse com outros jogadores sobre equipamentos, técnica e treino.</p>
    <p className="note">Comunidade de demonstração: posts e usuários são fictícios e o que você publica fica salvo apenas neste navegador.</p>
    <div className="mt">{feed.user
      ? <PostComposer onSubmit={feed.create} />
      : <div className="note mb">Para publicar, curtir e comentar, <Link to="/login" state={{ from: "/comunidade" }}>entre</Link> ou <Link to="/cadastro" state={{ from: "/comunidade" }}>crie sua conta</Link>.</div>}</div>
    <CommunitySearch value={filters.search} onChange={(search) => setFilters({ ...filters, search })} />
    <div className="mt"><CommunityFilters filters={filters} onChange={(patch) => setFilters({ ...filters, ...patch })} popularTags={tags} /></div>
    {feed.error && <p className="note" role="alert">Não foi possível carregar a comunidade. <Button variant="alt" onClick={feed.reload}>Tentar novamente</Button></p>}
    {feed.loading && <div aria-busy="true" aria-label="Carregando publicações"><div className="skel mb" /><div className="skel mb" /></div>}
    {feed.posts && <>
      <p className="muted" role="status" aria-live="polite">{results.length} {results.length === 1 ? "discussão" : "discussões"}</p>
      {results.length === 0
        ? (feed.posts.length === 0
          ? <EmptyState title="Nenhuma discussão ainda." text="Seja o primeiro a iniciar uma conversa." />
          : <EmptyState title="Nenhuma discussão encontrada." text="Tente outra busca ou remova os filtros."><Button onClick={clear}>Limpar filtros</Button></EmptyState>)
        : results.map((p) => <PostCard key={p.id} post={p} currentUserId={feed.user?.id} onLike={feed.toggleLike} onDelete={feed.remove} onReport={feed.report} onTagClick={(tag) => setFilters({ ...filters, tag })} />)}</>}</>);
}
