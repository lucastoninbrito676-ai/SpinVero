import { useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const links: [string, string][] = [["/", "Início"], ["/raquete-ideal", "Raquete ideal"], ["/equipamentos", "Equipamentos"], ["/analise", "Análise"], ["/comunidade", "Comunidade"], ["/progresso", "Progresso"]];
export default function Navbar() {
  const toggle = useRef<HTMLInputElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  // Fecha o menu mobile ao navegar; o menu em si é só CSS (checkbox).
  useEffect(() => { if (toggle.current) toggle.current.checked = false; window.scrollTo(0, 0); }, [pathname]);
  // Navega antes de sair, senão uma rota protegida redirecionaria para /login.
  const signOut = async () => { navigate("/"); await logout(); };
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? "on" : "");
  return (<header>
    <Link className="logo" to="/">Spin<b>Lab</b></Link>
    <input ref={toggle} type="checkbox" id="nt" className="nav-t" aria-label="Menu" />
    <label htmlFor="nt" className="burger">☰ Menu</label>
    <nav>{links.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"} className={cls}>{label}</NavLink>)}
      {!loading && (user
        ? <><NavLink to="/dashboard" className={cls}>Dashboard</NavLink><NavLink to="/perfil" className={cls}>Perfil</NavLink><button onClick={signOut}>Sair</button></>
        : <><NavLink to="/login" className={cls}>Entrar</NavLink><NavLink to="/cadastro" className="cta">Criar conta</NavLink></>)}</nav>
  </header>);
}
