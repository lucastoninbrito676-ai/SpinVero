import type { ReactNode } from "react";
export default function EmptyState({ title, text, children }: { title: string; text: string; children?: ReactNode }) {
  return <div className="card" style={{ textAlign: "center", padding: 40 }} role="status"><h3>{title}</h3><p className="muted">{text}</p>{children}</div>;
}
