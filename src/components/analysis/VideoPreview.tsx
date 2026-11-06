import { useState } from "react";
import { formatDuration, formatFileSize } from "../../utils/format";
import { Button, Card } from "../ui";
interface Props { url: string; file: File; durationSec?: number; readingInfo?: boolean; onRemove: () => void; disabled?: boolean }
export default function VideoPreview({ url, file, durationSec, readingInfo, onRemove, disabled }: Props) {
  const [failed, setFailed] = useState(false);
  return (<Card>
    {failed ? <p className="note">Não foi possível exibir a prévia (o navegador pode não suportar este codec). O arquivo ainda pode ser enviado para a análise.</p>
      : <video src={url} controls playsInline preload="metadata" onError={() => setFailed(true)} aria-label={`Prévia do vídeo ${file.name}`} style={{ width: "100%", maxHeight: 360, background: "#000" }} />}
    <p style={{ margin: "10px 0 0" }}><b style={{ overflowWrap: "anywhere" }}>{file.name}</b></p>
    <div className="muted">{formatFileSize(file.size)} · {readingInfo ? "lendo duração..." : durationSec != null ? formatDuration(durationSec) : "duração indisponível"}</div>
    <div className="row" style={{ marginBottom: 0 }}><Button variant="alt" onClick={onRemove} disabled={disabled}>Remover / trocar vídeo</Button></div></Card>);
}
