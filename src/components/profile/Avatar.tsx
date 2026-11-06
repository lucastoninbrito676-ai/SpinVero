import type { User } from "../../types";
export default function Avatar({ user, size = 56 }: { user: Pick<User, "name" | "avatar">; size?: number }) {
  const box = { width: size, height: size, borderRadius: "50%", flexShrink: 0 } as const;
  if (user.avatar) return <img src={user.avatar} alt={`Foto de ${user.name}`} style={{ ...box, objectFit: "cover" }} />;
  const initials = user.name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return <span className="av" style={{ ...box, margin: 0, fontSize: size / 2.6 }} aria-label={`Avatar de ${user.name}`}>{initials}</span>;
}
