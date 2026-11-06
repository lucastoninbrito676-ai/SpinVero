import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthError } from "../services/auth/authService";
import { validateLogin, type Errors } from "../utils/validation";
import { Button, Card } from "../components/ui";
import { Field } from "../components/ui/Field";

export default function Login() {
  const { user, login } = useAuth();
  const from = (useLocation().state as { from?: string } | null)?.from ?? "/dashboard";
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors<"email" | "password">>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to={from} replace />; // cobre login recém-feito e quem já estava logado

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const v = validateLogin(form); setErrors(v); setFormError("");
    if (Object.keys(v).length) return;
    setBusy(true);
    try { await login(form); } catch (err) { setFormError(err instanceof AuthError ? err.message : "Não foi possível entrar. Tente novamente."); setBusy(false); }
  };
  return (<div className="auth"><h1 style={{ fontSize: 36 }}>Entrar</h1><Card>
    <form onSubmit={submit} noValidate>
      <Field label="E-mail" name="email" type="email" autoComplete="email" value={form.email} error={errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Field label="Senha" name="password" type="password" autoComplete="current-password" value={form.password} error={errors.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {formError && <p className="err" role="alert">{formError}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Entrando..." : "Entrar"}</Button></form>
    <p className="muted">Ainda não tem conta? <Link to="/cadastro" state={{ from }}>Criar conta</Link></p></Card></div>);
}
