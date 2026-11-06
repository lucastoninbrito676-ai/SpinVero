import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AnalysisError, deleteAnalysis, getAnalysis, listAnalyses, runAnalysis } from "../services/analysis/analysisService";
import type { AnalysisRecord, ProgressStage, StrokeType } from "../types";
import { readVideoInfo, validateVideoFile, type VideoInfo } from "../utils/video";

export type AnalysisFlowStatus = "idle" | "videoSelected" | "processing" | "success" | "error";

/**
 * Fluxo da página /analise: golpe → vídeo → processamento → resultado.
 * O vídeo vive só na memória (File + object URL). O URL é liberado ao trocar/remover o vídeo e ao sair.
 */
export function useAnalysis() {
  const { user } = useAuth();
  const [stroke, setStroke] = useState<StrokeType>("forehand");
  const [status, setStatus] = useState<AnalysisFlowStatus>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [info, setInfo] = useState<VideoInfo | null>(null); // null enquanto a duração/miniatura são lidas
  const [fileError, setFileError] = useState("");
  const [progress, setProgress] = useState<{ stage: ProgressStage; percent: number }>({ stage: "uploading", percent: 0 });
  const [record, setRecord] = useState<AnalysisRecord | null>(null);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState("");
  const alive = useRef(true), token = useRef(0);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (!previewUrl) return; return () => URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const selectFile = async (f: File | undefined) => {
    if (!f) return;
    const problem = await validateVideoFile(f);
    if (problem) { setFileError(problem); return; } // mantém o vídeo anterior, se houver
    const mine = ++token.current;
    setFileError(""); setFile(f); setInfo(null); setRecord(null); setError("");
    const url = URL.createObjectURL(f);
    setPreviewUrl(url); setStatus("videoSelected");
    const meta = await readVideoInfo(url);
    if (alive.current && mine === token.current) setInfo(meta);
  };
  const removeFile = () => { token.current++; setFile(null); setPreviewUrl(null); setInfo(null); setFileError(""); setStatus("idle"); };
  const start = async () => {
    if (!user || !file || !info) return;
    setStatus("processing"); setError(""); setProgress({ stage: "uploading", percent: 0 });
    try {
      const r = await runAnalysis({ userId: user.id, file, strokeType: stroke, thumbnail: info.thumbnail, durationSec: info.durationSec }, (stage, percent) => { if (alive.current) setProgress({ stage, percent }); });
      if (!alive.current) return;
      setRecord(r.record); setSaved(r.saved); setStatus("success");
    } catch (e) {
      if (alive.current) { setError(e instanceof AnalysisError ? e.message : "Não foi possível analisar o vídeo. Tente novamente ou escolha outro arquivo."); setStatus("error"); }
    }
  };
  const reset = () => { removeFile(); setRecord(null); setError(""); };
  return { user, stroke, setStroke, status, file, previewUrl, info, fileError, progress, record, saved, error, selectFile, removeFile, start, reset, backToVideo: () => setStatus("videoSelected") };
}

/** Histórico do usuário. `refreshKey` força recarga (ex.: id da análise recém-criada). */
export function useAnalysisHistory(userId: string | undefined, refreshKey?: string) {
  const [records, setRecords] = useState<AnalysisRecord[] | null>(null);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!userId) { setRecords([]); return; }
    let cancelled = false;
    listAnalyses(userId).then((r) => { if (!cancelled) setRecords(r); }).catch(() => { if (!cancelled) setRecords([]); });
    return () => { cancelled = true; };
  }, [userId, refreshKey, version]);
  const remove = useCallback(async (id: string) => { if (userId) { await deleteAnalysis(id, userId); setVersion((v) => v + 1); } }, [userId]);
  return { records, remove };
}

/** Uma análise do usuário atual (null para análises de outro usuário). */
export function useAnalysisRecord(id: string | undefined) {
  const { user, loading } = useAuth();
  const [state, setState] = useState<{ status: "loading" | "notfound" | "error" } | { status: "ready"; record: AnalysisRecord }>({ status: "loading" });
  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    setState({ status: "loading" });
    (id && user ? getAnalysis(id, user.id) : Promise.resolve(null)).then((r) => { if (!cancelled) setState(r ? { status: "ready", record: r } : { status: "notfound" }); }).catch(() => { if (!cancelled) setState({ status: "error" }); });
    return () => { cancelled = true; };
  }, [id, user, loading]);
  return { state, user, remove: async () => { if (id && user) await deleteAnalysis(id, user.id); } };
}
