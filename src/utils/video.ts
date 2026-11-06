/**
 * VALIDAÇÃO E LEITURA DE VÍDEO (somente no navegador).
 * ⚠️ Esta validação melhora a experiência, mas NÃO é segurança: quando houver servidor, tipo, tamanho e
 * conteúdo do arquivo precisam ser revalidados lá (e o vídeo, tratado como entrada não confiável).
 */
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100 MB
export const VIDEO_ACCEPT = ".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm";
const ALLOWED_MIME = ["video/mp4", "video/quicktime", "video/webm"];
type Container = "isobmff" | "webm";
const EXT_CONTAINER: Record<string, Container> = { mp4: "isobmff", mov: "isobmff", webm: "webm" };

/** Identifica o contêiner pelos primeiros bytes (assinatura), não pelo nome. */
export async function sniffContainer(file: Blob): Promise<Container | null> {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (b.length >= 12 && String.fromCharCode(b[4], b[5], b[6], b[7]) === "ftyp") return "isobmff"; // MP4 e MOV
  if (b.length >= 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return "webm";
  return null;
}
/** Devolve a mensagem de erro, ou null se o arquivo é aceitável. */
export async function validateVideoFile(file: File | null | undefined): Promise<string | null> {
  if (!file) return "Nenhum arquivo selecionado.";
  if (file.size === 0) return "O arquivo está vazio.";
  if (file.size > MAX_VIDEO_BYTES) return `O vídeo é grande demais. O limite é ${MAX_VIDEO_BYTES / 1024 / 1024} MB.`;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(ext in EXT_CONTAINER)) return "Formato não suportado. Envie um vídeo MP4, MOV ou WebM.";
  if (file.type && !ALLOWED_MIME.includes(file.type)) return "O tipo do arquivo não é um vídeo MP4, MOV ou WebM.";
  if ((await sniffContainer(file)) !== EXT_CONTAINER[ext]) return "O conteúdo do arquivo não corresponde a um vídeo válido deste formato.";
  return null;
}

export interface VideoInfo { durationSec?: number; thumbnail?: string }
/** Lê duração e gera uma miniatura pequena (JPEG ~160 px). Sempre resolve; campos ausentes = indisponível. */
export function readVideoInfo(objectUrl: string, timeoutMs = 5000): Promise<VideoInfo> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const info: VideoInfo = {};
    let done = false;
    const finish = () => { if (done) return; done = true; clearTimeout(timer); video.removeAttribute("src"); video.load(); resolve(info); };
    const timer = setTimeout(finish, timeoutMs);
    video.muted = true; video.preload = "metadata"; video.playsInline = true;
    video.onerror = finish; // codec não suportado pelo navegador (ex.: alguns .mov)
    video.onloadedmetadata = () => {
      if (Number.isFinite(video.duration)) info.durationSec = video.duration;
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    };
    video.onseeked = () => {
      try {
        const w = 160, h = Math.round((w * video.videoHeight) / video.videoWidth) || 90;
        const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(video, 0, 0, w, h);
        info.thumbnail = canvas.toDataURL("image/jpeg", 0.6);
      } catch { /* miniatura é opcional */ }
      finish();
    };
    video.src = objectUrl;
  });
}
