import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { Button, Card } from "../components/ui";
import RecentPosts from "../components/community/RecentPosts";
import Avatar from "../components/profile/Avatar";
import ProfileForm, { type ProfileValues } from "../components/profile/ProfileForm";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { athlete, updateAthlete } = useProfile();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  if (!user) return null; // ProtectedRoute garante o usuário

  const save = async (v: ProfileValues) => {
    await updateUser({ name: v.name, avatar: v.avatar });
    updateAthlete({ level: v.athlete.level, style: v.athlete.style, hand: v.athlete.hand, goal: v.athlete.goal });
    setEditing(false); setSaved(true);
  };
  const rows: [string, string | undefined][] = [["Nível", athlete.level], ["Estilo de jogo", athlete.style], ["Mão dominante", athlete.hand], ["Objetivo principal", athlete.goal]];
  return (<div style={{ maxWidth: 640 }}><h1>Perfil</h1>
    {saved && !editing && <p className="note" role="status">Perfil salvo.</p>}
    <Card>{editing
      ? <ProfileForm user={user} athlete={athlete} onSave={save} onCancel={() => setEditing(false)} />
      : <><div className="row" style={{ alignItems: "center", margin: "0 0 16px" }}><Avatar user={user} size={72} /><div><h2 style={{ margin: 0 }}>{user.name}</h2><div className="muted">{user.email}</div></div></div>
        <dl className="issue">{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v ?? <span className="muted">Não definido</span>}</dd></div>)}</dl>
        <div className="row"><Button onClick={() => { setSaved(false); setEditing(true); }}>Editar perfil</Button></div></>}</Card>{!editing && <RecentPosts userId={user.id} />}</div>);
}
