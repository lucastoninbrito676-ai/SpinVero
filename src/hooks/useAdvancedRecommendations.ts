import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { getAdvancedRecommendation } from "../services/recommendation/advancedRecommendationService";
import type { AdvancedRecommendation } from "../types/advancedRecommendation";
import type { PlayerProfile } from "../types";

export function useAdvancedRecommendations() {
  const { user } = useAuth();
  const { athlete } = useProfile();
  const [result, setResult] = useState<AdvancedRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(() => {
    if (!athlete.level || !athlete.style) { setResult({ state: "needs-profile", profile: null, configuration: null, alternatives: [], substitutes: { blade: [], forehandRubber: [], backhandRubber: [] }, confidence: { score: 20, label: "Baixa", factors: ["Nível ou estilo ausente."] }, movementSignals: [], evolutionSignals: [], minimumConfigurationPrice: null }); setLoading(false); return; }
    setLoading(true); setError(false);
    getAdvancedRecommendation(athlete as PlayerProfile & { goal?: string }, user?.id).then(setResult).catch(() => setError(true)).finally(() => setLoading(false));
  }, [athlete, user?.id]);
  useEffect(() => { load(); }, [load]);
  return { result, loading, error, retry: load };
}
