import type { StrokeType } from "../../types";
import { STROKE_LABEL, STROKES } from "../../utils/analysis";
export default function AnalysisSelector({ value, onChange, disabled }: { value: StrokeType; onChange: (s: StrokeType) => void; disabled?: boolean }) {
  return (<div className="chips" role="radiogroup" aria-label="Golpe a analisar">
    {STROKES.map((s) => <button key={s} type="button" role="radio" aria-checked={s === value} className={s === value ? "on" : ""} disabled={disabled} onClick={() => onChange(s)}>{STROKE_LABEL[s]}</button>)}</div>);
}
