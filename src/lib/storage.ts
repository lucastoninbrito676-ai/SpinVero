/** Único ponto de acesso ao localStorage. Falhas (modo privado, cota) não derrubam a aplicação. */
export const storage = {
  get<T>(key: string): T | null {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; }
  },
  set(key: string, value: unknown): void {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sem persistência disponível */ }
  },
  remove(key: string): void {
    try { localStorage.removeItem(key); } catch { /* idem */ }
  },
};
