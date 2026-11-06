import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { GUEST_ID, profileService } from '../services/profile/profileService';
import type { ScoringProfile } from '../services/recommendation/recommendationService';
import type { AthleteProfile, PlayerProfile } from '../types';
import { useAuth } from './AuthContext';

interface ProfileValue {
  profile: PlayerProfile | null;
  athlete: AthleteProfile;
  setProfile: (p: PlayerProfile) => void;
  updateAthlete: (patch: AthleteProfile) => void;
}
const Ctx = createContext<ProfileValue>({ profile: null, athlete: {}, setProfile: () => {}, updateAthlete: () => {} });
const isComplete = (a: AthleteProfile): a is PlayerProfile => !!(a.level && a.style && a.hand && a.priority && a.budget != null && a.strength && a.problem);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const ownerId = user?.id ?? GUEST_ID;
  const [athlete, setAthlete] = useState<AthleteProfile>({});

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    const load = async () => {
      if (user) {
        try {
          const remote = await profileService.loadRemote();
          if (!cancelled) {
            setAthlete(remote);
            profileService.save(ownerId, remote);
          }
          return;
        } catch {
          // Fallback temporário para o cache local se a API estiver indisponível.
        }
      }
      let stored = profileService.load(ownerId);
      if (!stored && ownerId !== GUEST_ID) {
        stored = profileService.load(GUEST_ID);
        if (stored) profileService.save(ownerId, stored);
      }
      if (!cancelled) setAthlete(stored ?? {});
    };
    void load();
    return () => { cancelled = true; };
  }, [ownerId, loading, user]);

  const updateAthlete = useCallback((patch: AthleteProfile) => {
    setAthlete((prev) => {
      const next = { ...prev, ...patch };
      profileService.save(ownerId, next);
      if (user) void profileService.saveRemote(next).catch(() => undefined);
      return next;
    });
  }, [ownerId, user]);
  const setProfile = useCallback((p: PlayerProfile) => updateAthlete(p), [updateAthlete]);

  const value = useMemo(() => ({ profile: isComplete(athlete) ? athlete : null, athlete, setProfile, updateAthlete }), [athlete, setProfile, updateAthlete]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useProfile = () => useContext(Ctx);

export function useScoringProfile(): ScoringProfile | null {
  const { athlete } = useProfile();
  return useMemo(() => (athlete.level && athlete.style
    ? { level: athlete.level, style: athlete.style, priority: athlete.priority ?? 'Equilíbrio', budget: athlete.budget ?? Number.POSITIVE_INFINITY, goal: athlete.goal }
    : null), [athlete]);
}
