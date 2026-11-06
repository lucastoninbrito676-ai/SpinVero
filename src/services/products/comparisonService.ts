import { storage } from "../../lib/storage";
import { STORAGE_KEYS } from "../../lib/storageKeys";
import type { ProductCategory } from "../../types";
export const MAX_COMPARE = 3;
export const MIN_COMPARE = 2;
/** A categoria é guardada junto para impedir comparações sem sentido (ex.: borracha × case). */
export interface CompareItem { id: string; category: ProductCategory }
export const comparisonService = {
  load: (): CompareItem[] => {
    const items = (storage.get<unknown[]>(STORAGE_KEYS.comparison) ?? []).filter((i): i is CompareItem => typeof i === "object" && i !== null && typeof (i as CompareItem).id === "string");
    return items.filter((i) => i.category === items[0]?.category).slice(0, MAX_COMPARE);
  },
  save: (items: CompareItem[]) => storage.set(STORAGE_KEYS.comparison, items),
};
