import { useAnalysisHistory } from "../../hooks/useAnalysis";
import AnalysisHistory from "../analysis/AnalysisHistory";
export default function LatestAnalyses({ userId }: { userId: string }) {
  const { records } = useAnalysisHistory(userId);
  return (<><h2>Últimas análises</h2>{records === null ? <div className="skel" style={{ height: 120 }} /> : <AnalysisHistory records={records} limit={4} showCta />}</>);
}
