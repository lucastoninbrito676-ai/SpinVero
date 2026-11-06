import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthError } from "../services/auth/authService";
import { MIN_PASSWORD, validateRegister, type Errors } from "../utils/validation";
import { Button, Card } from "../components/ui";
import { Field } from "../components/ui/Field";

export default function Register() {
  const { user, register } = useAuth();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/dashboard";
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Errors<"name" | "email" | "password" | "confirm">>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={from} replace />;

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validateRegister(form); setErrors(v); setFormError("");
    if (Object.keys(v).length) return;
    setBusy(true);
    try { await register({ name: form.name, email: form.email, password: form.password }); } catch (err) { setFormError(err instanceof AuthError ? err.message : "Não foi possível criar a conta. Tente novamente."); setBusy(false); }
  };
  return (<div className="auth"><h1 style={{ fontSize: 36 }}>Criar conta</h1><Card>
    <form onSubmit={submit} noValidate>
      <Field label="Nome" name="name" autoComplete="name" value={form.name} error={errors.name} onChange={set("name")} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={set("email")} />
      <Field label={`Senha (mínimo ${MIN_PASSWORD} caracteres)`} name="password" type="password" autoComplete="new-password" value={form.password} error={errors.password} onChange={set("password")} />
      <Field label="Confirmar senha" name="confirm" type="password" autoComplete="new-password" value={form.confirm} error={errors.confirm} onChange={set("confirm")} />
      {formError && <p className="err" role="alert">{formError}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Criando..." : "Criar conta"}</Button></form>
    <p className="note">Sua conta será criada com segurança no servidor.</p>
    <p className="muted">Já tem conta? <Link to="/login" state={{ from }}>Entrar</Link></p></Card></div>);
}
