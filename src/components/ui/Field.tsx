import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
interface FieldProps extends InputHTMLAttributes<HTMLInputElement> { label: string; error?: string }
export function Field({ label, error, id, ...rest }: FieldProps) {
  const fid = id ?? rest.name;
  return (<div className="field"><label htmlFor={fid}>{label}</label>
    <input id={fid} aria-invalid={!!error} aria-describedby={error ? `${fid}-err` : undefined} {...rest} />
    {error && <p className="err" id={`${fid}-err`} role="alert">{error}</p>}</div>);
}
interface SelectProps { label: string; value: string; options: string[]; onChange: (v: string) => void }
export function SelectField({ label, value, options, onChange }: SelectProps) {
  return (<div className="field"><label>{label}<select value={value} onChange={(e) => onChange(e.target.value)}>
    <option value="">Não definido</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}</select></label></div>);
}
interface AreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { label: string; id: string; error?: string; max?: number }
/** Campo de texto longo com contador opcional de caracteres. */
export function TextAreaField({ label, id, error, max, value, ...rest }: AreaProps) {
  return (<div className="field"><label htmlFor={id}>{label}</label>
    <textarea id={id} value={value} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
    {max != null && <div className="muted" style={{ fontSize: 12, textAlign: "right" }}>{String(value ?? "").length}/{max}</div>}
    {error && <p className="err" id={`${id}-err`} role="alert">{error}</p>}</div>);
}
