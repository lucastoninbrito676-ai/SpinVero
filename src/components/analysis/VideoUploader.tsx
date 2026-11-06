import { useState, type DragEvent } from "react";
import { VIDEO_ACCEPT } from "../../utils/video";
interface Props { onFile: (f: File) => void; error?: string; disabled?: boolean }
export default function VideoUploader({ onFile, error, disabled }: Props) {
  const [drag, setDrag] = useState(false);
  const drop = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f && !disabled) onFile(f); };
  const hidden = { position: "absolute", opacity: 0, width: 1, height: 1 } as const;
  return (<div>
    <label className={`drop ${drag ? "drag" : ""}`} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={drop}>
      <input type="file" accept={VIDEO_ACCEPT} disabled={disabled} aria-label="Enviar vídeo (MP4, MOV ou WebM)" aria-describedby={error ? "video-err" : undefined} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} />
      <div style={{ fontSize: 48 }} aria-hidden="true">🎥</div><h2 style={{ margin: ".2em 0" }}>Envie seu vídeo</h2>
      <div className="muted">Toque ou arraste um arquivo MP4, MOV ou WebM (até 100 MB)</div></label>
    <div className="row"><label className="btn alt" style={{ cursor: "pointer" }}>Gravar agora<input type="file" accept="video/*" capture="environment" disabled={disabled} style={hidden} onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = ""; }} /></label></div>
    {error && <p className="err" id="video-err" role="alert">{error}</p>}</div>);
}
