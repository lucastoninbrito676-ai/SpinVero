import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { comparisonService, MAX_COMPARE, type CompareItem } from "../services/products/comparisonService";
import { CATEGORY_PLURAL } from "../utils/product";
import { favoritesService } from "../services/products/favoritesService";
import type { Product } from "../types";

interface ShortlistValue {
  favorites: string[]; compare: string[];
  isFavorite: (id: string) => boolean; isCompared: (id: string) => boolean;
  toggleFavorite: (p: Product) => void; toggleCompare: (p: Product) => void;
  removeCompare: (id: string) => void; clearCompare: () => void;
}
const noop = () => {};
const Ctx = createContext<ShortlistValue>({ favorites: [], compare: [], isFavorite: () => false, isCompared: () => false, toggleFavorite: noop, toggleCompare: noop, removeCompare: noop, clearCompare: noop });

/** Favoritos e comparação (persistidos) + aviso visual das ações. Pode virar por-usuário trocando os services. */
export function ShortlistProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(favoritesService.load);
  const [compare, setCompare] = useState<CompareItem[]>(comparisonService.load);
  const [message, setMessage] = useState("");
  const timer = useRef<number>();
  const notify = useCallback((m: string) => { setMessage(m); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setMessage(""), 2500); }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const toggleFavorite = useCallback((p: Product) => {
    const has = favorites.includes(p.id), next = has ? favorites.filter((i) => i !== p.id) : [...favorites, p.id];
    setFavorites(next); favoritesService.save(next);
    notify(has ? `${p.name} removido dos favoritos.` : `${p.name} adicionado aos favoritos.`);
  }, [favorites, notify]);
  const saveCompare = (next: CompareItem[]) => { setCompare(next); comparisonService.save(next); };
  const toggleCompare = useCallback((p: Product) => {
    if (compare.some((i) => i.id === p.id)) { saveCompare(compare.filter((i) => i.id !== p.id)); notify(`${p.name} removido da comparação.`); return; }
    if (compare.length && compare[0].category !== p.category) { notify(`Só é possível comparar itens da mesma categoria (${CATEGORY_PLURAL[compare[0].category].toLowerCase()} neste momento).`); return; }
    if (compare.length >= MAX_COMPARE) { notify(`Você pode comparar até ${MAX_COMPARE} equipamentos.`); return; }
    saveCompare([...compare, { id: p.id, category: p.category }]); notify(`${p.name} adicionado à comparação.`);
  }, [compare, notify]);
  const removeCompare = useCallback((id: string) => saveCompare(compare.filter((i) => i.id !== id)), [compare]);
  const clearCompare = useCallback(() => saveCompare([]), []);

  const compareIds = useMemo(() => compare.map((i) => i.id), [compare]);
  const value = useMemo(() => ({ favorites, compare: compareIds, isFavorite: (id: string) => favorites.includes(id), isCompared: (id: string) => compareIds.includes(id), toggleFavorite, toggleCompare, removeCompare, clearCompare }), [favorites, compareIds, toggleFavorite, toggleCompare, removeCompare, clearCompare]);
  return <Ctx.Provider value={value}>{children}{message && <div className="toast" role="status">{message}</div>}</Ctx.Provider>;
}
export const useShortlist = () => useContext(Ctx);
