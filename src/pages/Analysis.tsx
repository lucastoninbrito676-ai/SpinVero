import { Link } from "react-router-dom";
import { useAnalysis, useAnalysisHistory } from "../hooks/useAnalysis";
import AnalysisHistory from "../components/analysis/AnalysisHistory";
import AnalysisProgress from "../components/analysis/AnalysisProgress";
import AnalysisResultView from "../components/analysis/AnalysisResultView";
import AnalysisSelector from "../components/analysis/AnalysisSelector";
import VideoPreview from "../components/analysis/VideoPreview";
import VideoUploader from "../components/analysis/VideoUploader";
import { useAuth } from "../context/AuthContext";
import { Button, Card } from "../components/ui";

export default function Analysis() {
  const { loading } = useAuth();
  const a = useAnalysis();
  const history = useAnalysisHistory(a.user?.id, a.record?.id);
  if (loading) return <div className="skel" aria-busy="true" />;

  return (<><h1>Análise de movimento</h1>
    <p className="sub">Escolha o golpe, envie um vídeo e veja uma análise estruturada da sua técnica.</p>
    <p className="note" role="note"><b>Análise demonstrativa.</b> A visão computacional ainda não está conectada: os resultados são simulados e o vídeo não sai do seu dispositivo.</p>
    <div className="grid mt"><Card><b>Antes de gravar</b><ul className="muted"><li>Posicione a câmera de lado, na altura do tronco.</li><li>Deixe o corpo inteiro visível, com espaço para se mover.</li><li>Use boa iluminação.</li><li>Grave de 10 a 30 segundos.</li></ul></Card>
      <Card><b>Privacidade</b><p className="muted">O vídeo fica apenas na memória do navegador durante a análise. Só o resultado é salvo no seu histórico neste dispositivo.</p></Card></div>

    {!a.user ? <Card className="mt"><h3>Entre para analisar</h3><p className="muted">A análise é salva no histórico da sua conta.</p>
      <div className="row" style={{ marginBottom: 0 }}><Link className="btn" to="/login" state={{ from: "/analise" }}>Entrar</Link><Link className="btn alt" to="/cadastro" state={{ from: "/analise" }}>Criar conta</Link></div></Card>
    : <>
      {(a.status === "idle" || a.status === "videoSelected" || a.status === "error") && <>
        <h2>1. Escolha o golpe</h2><AnalysisSelector value={a.stroke} onChange={a.setStroke} />
        <h2>2. Envie o vídeo</h2>
        {a.file && a.previewUrl ? <VideoPreview url={a.previewUrl} file={a.file} durationSec={a.info?.durationSec} readingInfo={!a.info} onRemove={a.removeFile} />
          : <VideoUploader onFile={a.selectFile} error={a.fileError} />}
        {a.file && a.fileError && <p className="err" role="alert">{a.fileError}</p>}
        {a.status === "error" && <p className="note" role="alert">{a.error}</p>}
        {a.file && <div className="row"><Button onClick={a.start} disabled={!a.info}>Analisar vídeo</Button></div>}</>}
      {a.status === "processing" && <div className="mt"><AnalysisProgress stage={a.progress.stage} percent={a.progress.percent} /></div>}
      {a.status === "success" && a.record && <>
        <p className="note" role="status">{a.saved ? "Análise concluída e salva no histórico." : "Análise concluída, mas não foi possível salvá-la no histórico (armazenamento indisponível ou cheio)."}</p>
        <AnalysisResultView result={a.record.result} />
        <div className="row"><Button to={`/analise/${a.record.id}`}>Ver detalhes</Button><Button variant="alt" onClick={a.reset}>Nova análise</Button></div></>}
      <h2>Histórico</h2>
      {history.records === null ? <div className="skel" style={{ height: 120 }} /> : <AnalysisHistory records={history.records} />}</>}</>);
}
