import { useEffect, useState } from "react";
import { getAthleteStats, getGoalProgress, getProgressHistory, getRecentActivities } from "../services/dashboardService";
import type { Activity, AthleteStats, Period, ProgressPoint } from "../types";

interface Overview { stats: AthleteStats; goalProgress: number; activities: Activity[] }
/** Dados fixos carregam uma vez; a série de evolução recarrega quando o período muda. */
export function useDashboardData(period: Period) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [progress, setProgress] = useState<ProgressPoint[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    Promise.all([getAthleteStats(), getGoalProgress(), getRecentActivities()])
      .then(([stats, goalProgress, activities]) => { if (!cancelled) setOverview({ stats, goalProgress, activities }); })
      .catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [attempt]);

  useEffect(() => {
    let cancelled = false;
    setProgress(null);
    getProgressHistory(period).then((p) => { if (!cancelled) setProgress(p); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [period, attempt]);

  return { overview, progress, error, retry: () => setAttempt((n) => n + 1) };
}
