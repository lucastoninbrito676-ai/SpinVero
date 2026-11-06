import { useState, type FormEvent } from "react";
import { GOALS, HANDS, LEVELS, STYLES } from "../../data/options";
import type { AthleteProfile, Hand, PlayerLevel, PlayerStyle, User } from "../../types";
import { Button } from "../ui";
import { Field, SelectField } from "../ui/Field";
import Avatar from "./Avatar";

const MAX_AVATAR_BYTES = 300 * 1024; // limite pequeno: a imagem vai para o localStorage como data URL
export interface ProfileValues { name: string; avatar?: string; athlete: AthleteProfile }
interface Props { user: User; athlete: AthleteProfile; onSave: (v: ProfileValues) => Promise<void>; onCancel: () => void }

export default function ProfileForm({ user, athlete, onSave, onCancel }: Props) {
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [level, setLevel] = useState(athlete.level ?? "");
  const [style, setStyle] = useState(athlete.style ?? "");
  const [hand, setHand] = useState(athlete.hand ?? "");
  const [goal, setGoal] = useState(athlete.goal ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const pickAvatar = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Escolha um arquivo de imagem.");
    if (file.size > MAX_AVATAR_BYTES) return setError("A foto deve ter no máximo 300 KB.");
    const reader = new FileReader();
    reader.onload = () => { setAvatar(String(reader.result)); setError(""); };
    reader.readAsDataURL(file);
  };
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Informe seu nome.");
    setSaving(true);
    try {
      // "" vira undefined: campo não definido.
      await onSave({ name: name.trim(), avatar, athlete: { level: (level || undefined) as PlayerLevel | undefined, style: (style || undefined) as PlayerStyle | undefined, hand: (hand || undefined) as Hand | undefined, goal: goal || undefined } });
    } finally { setSaving(false); }
  };
  return (<form onSubmit={submit} noValidate className="fade">
    <div className="row" style={{ alignItems: "center", margin: "0 0 16px" }}><Avatar user={{ name, avatar }} size={72} />
      <label className="btn alt" style={{ cursor: "pointer" }}>Trocar foto<input type="file" accept="image/*" style={{ position: "absolute", opacity: 0, width: 1, height: 1 }} onChange={(e) => pickAvatar(e.target.files?.[0])} /></label>
      {avatar && <Button type="button" variant="alt" onClick={() => setAvatar(undefined)}>Remover foto</Button>}</div>
    <Field label="Nome" name="name" value={name} onChange={(e) => setName(e.target.value)} />
    <SelectField label="Nível" value={level} options={LEVELS} onChange={setLevel} />
    <SelectField label="Estilo de jogo" value={style} options={STYLES} onChange={setStyle} />
    <SelectField label="Mão dominante" value={hand} options={HANDS} onChange={setHand} />
    <SelectField label="Objetivo principal" value={goal} options={GOALS} onChange={setGoal} />
    {error && <p className="err" role="alert">{error}</p>}
    <div className="row"><Button type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</Button><Button type="button" variant="alt" onClick={onCancel}>Cancelar</Button></div></form>);
}
