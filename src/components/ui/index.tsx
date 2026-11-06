import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "alt"; to?: string };
export function Button({ variant = "primary", to, className = "", ...rest }: BtnProps) {
  const cls = `btn ${variant === "alt" ? "alt" : ""} ${className}`;
  return to ? <Link to={to} className={cls} onClick={rest.onClick as never} aria-label={rest["aria-label"]}>{rest.children}</Link> : <button className={cls} {...rest} />;
}
export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => <div className={`card ${className}`}>{children}</div>;
export const Badge = ({ children }: { children: ReactNode }) => <span className="tag">{children}</span>;
export function ProgressBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  return <><div className="lbl"><span>{label}</span><span>{value}/{max}</span></div><div className="bar"><i style={{ width: `${(value / max) * 100}%` }} /></div></>;
}
export const ScoreCard = ({ label, value }: { label: string; value: number }) => (
  <Card><div className="muted">{label}</div><div className="score">{value}<span className="muted">/100</span></div><div className="bar"><i style={{ width: `${value}%` }} /></div></Card>);
