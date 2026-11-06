import { apiRequest, refreshAccessToken, setAccessToken } from './apiClient';
import type { LoginInput, RegisterInput, User, UserPatch } from '../../types';

export interface AuthService {
  getSession(): Promise<User | null>;
  login(input: LoginInput): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(): Promise<void>;
  updateUser(id: string, patch: UserPatch): Promise<User>;
  getPublicUser(id: string): Promise<User | null>;
}

export class AuthError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

interface ApiUser { id: string; name: string; email: string; avatarUrl: string | null; role?: string; createdAt?: string }
interface AuthResponse { user: ApiUser; accessToken: string }

const mapUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  avatar: user.avatarUrl ?? undefined,
  createdAt: user.createdAt ?? new Date().toISOString(),
});

const toAuthError = (error: unknown): AuthError => {
  if (error instanceof Error) {
    const typed = error as Error & { code?: string };
    return new AuthError(error.message, typed.code);
  }
  return new AuthError('Não foi possível concluir a operação.');
};

export const authService: AuthService = {
  async getSession() {
    const token = await refreshAccessToken();
    if (!token) return null;
    try {
      const data = await apiRequest<{ user: ApiUser }>('/auth/me');
      return mapUser(data.user);
    } catch {
      setAccessToken(null);
      return null;
    }
  },

  async login(input) {
    try {
      const data = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      setAccessToken(data.accessToken);
      return mapUser(data.user);
    } catch (error) {
      throw toAuthError(error);
    }
  },

  async register(input) {
    try {
      const data = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(input),
      });
      setAccessToken(data.accessToken);
      return mapUser(data.user);
    } catch (error) {
      throw toAuthError(error);
    }
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
    }
  },

  async updateUser(id, patch) {
    try {
      const data = await apiRequest<{ user: ApiUser }>(`/auth/me`, {
        method: 'PATCH',
        body: JSON.stringify({ id, name: patch.name, avatarUrl: patch.avatar }),
      });
      return mapUser(data.user);
    } catch (error) {
      throw toAuthError(error);
    }
  },

  async getPublicUser(id) {
    try {
      const data = await apiRequest<{ user: ApiUser }>(`/users/${id}`);
      return mapUser(data.user);
    } catch (error) {
      const typed = error as Error & { status?: number };
      if (typed.status === 404) return null;
      throw toAuthError(error);
    }
  },
};
