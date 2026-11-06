import { storage } from '../../lib/storage';
import type { AthleteProfile } from '../../types';
import { apiRequest } from '../auth/apiClient';

export const GUEST_ID = 'guest';
const key = (ownerId: string) => `spinlab:profile:${ownerId}`;

const enumMap = {
  level: { 'Iniciante': 'INICIANTE', 'Intermediário': 'INTERMEDIARIO', 'Avançado': 'AVANCADO', 'Profissional': 'PROFISSIONAL' },
  style: { 'Ofensivo': 'OFENSIVO', 'Defensivo': 'DEFENSIVO', 'All-round': 'ALL_ROUND', 'Counter/Block': 'COUNTER_BLOCK', 'Topspin': 'TOPSPIN', 'Controle': 'CONTROLE' },
  hand: { 'Direita': 'DIREITA', 'Esquerda': 'ESQUERDA' },
  priority: { 'Velocidade': 'VELOCIDADE', 'Controle': 'CONTROLE', 'Spin': 'SPIN', 'Equilíbrio': 'EQUILIBRIO' },
} as const;

const reverse = <T extends Record<string, string>>(map: T, value: string | null | undefined) => {
  const found = Object.entries(map).find(([, apiValue]) => apiValue === value);
  return found?.[0];
};

const toApi = (profile: AthleteProfile) => ({
  level: profile.level ? enumMap.level[profile.level] : undefined,
  style: profile.style ? enumMap.style[profile.style] : undefined,
  hand: profile.hand ? enumMap.hand[profile.hand] : undefined,
  priority: profile.priority ? enumMap.priority[profile.priority] : undefined,
  budget: profile.budget,
  strength: profile.strength,
  problem: profile.problem,
  goal: profile.goal,
});

const fromApi = (profile: Record<string, unknown> | null | undefined): AthleteProfile => {
  if (!profile) return {};
  return {
    level: reverse(enumMap.level, profile.level as string) as AthleteProfile['level'],
    style: reverse(enumMap.style, profile.style as string) as AthleteProfile['style'],
    hand: reverse(enumMap.hand, profile.hand as string) as AthleteProfile['hand'],
    priority: reverse(enumMap.priority, profile.priority as string) as AthleteProfile['priority'],
    budget: profile.budget == null ? undefined : Number(profile.budget),
    strength: profile.strength as string | undefined,
    problem: profile.problem as string | undefined,
    goal: profile.goal as string | undefined,
  };
};

export const profileService = {
  load: (ownerId: string) => storage.get<AthleteProfile>(key(ownerId)),
  save: (ownerId: string, profile: AthleteProfile) => storage.set(key(ownerId), profile),
  async loadRemote(): Promise<AthleteProfile> {
    const data = await apiRequest<{ profile: Record<string, unknown> | null }>('/profile');
    const profile = fromApi(data.profile);
    return profile;
  },
  async saveRemote(profile: AthleteProfile): Promise<AthleteProfile> {
    const data = await apiRequest<{ profile: Record<string, unknown> }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(toApi(profile)),
    });
    return fromApi(data.profile);
  },
};
