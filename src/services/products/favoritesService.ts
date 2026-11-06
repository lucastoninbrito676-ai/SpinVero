import { storage } from "../../lib/storage";
import { STORAGE_KEYS } from "../../lib/storageKeys";
// Ids de produto agora são strings; valores antigos (numéricos, de antes da Fase 5) são descartados.
export const favoritesService = {
  load: () => (storage.get<unknown[]>(STORAGE_KEYS.favorites) ?? []).filter((i): i is string => typeof i === "string"),
  save: (ids: string[]) => storage.set(STORAGE_KEYS.favorites, ids),
};
