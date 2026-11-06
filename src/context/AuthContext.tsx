import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authService } from "../services/auth/authService";
import type { LoginInput, RegisterInput, User, UserPatch } from "../types";

interface AuthValue {
  user: User | null; isAuthenticated: boolean; loading: boolean;
  login: (i: LoginInput) => Promise<void>; register: (i: RegisterInput) => Promise<void>;
  logout: () => Promise<void>; updateUser: (p: UserPatch) => Promise<void>;
}
const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // true até a sessão salva ser verificada
  useEffect(() => { authService.getSession().then(setUser).finally(() => setLoading(false)); }, []);

  const login = useCallback(async (i: LoginInput) => setUser(await authService.login(i)), []);
  const register = useCallback(async (i: RegisterInput) => setUser(await authService.register(i)), []);
  const logout = useCallback(async () => { await authService.logout(); setUser(null); }, []);
  const updateUser = useCallback(async (p: UserPatch) => { if (user) setUser(await authService.updateUser(user.id, p)); }, [user]);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, loading, login, register, logout, updateUser }), [user, loading, login, register, logout, updateUser]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return v;
}
