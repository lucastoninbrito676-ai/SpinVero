export const HeroArt = () => (<div className="stage"><svg viewBox="0 0 360 300" role="img" aria-label="Raquete, bola e trajetória com dados de análise">
  <rect x="20" y="215" width="320" height="10" rx="5" fill="#2dd4bf" opacity=".5" /><path d="M60 190C120 40 230 30 300 205" fill="none" stroke="#ff7a45" strokeWidth="3" strokeDasharray="6 8" /><circle cx="300" cy="205" r="10" fill="#fff" />
  <g transform="rotate(-30 90 190)"><rect x="82" y="205" width="16" height="60" rx="6" fill="#8a5a2b" /><ellipse cx="90" cy="165" rx="52" ry="48" fill="#ff5a1f" /><ellipse cx="90" cy="165" rx="38" ry="34" fill="none" stroke="#fff" strokeOpacity=".35" /></g></svg>
  <span className="chip" style={{ top: 18, right: 18 }}>Spin<b>9.2</b></span><span className="chip" style={{ bottom: 70, left: 18 }}>Velocidade da bola<b>68 km/h</b></span><span className="chip" style={{ top: 90, left: 18 }}>Confiança<b>82%</b></span></div>);
const POINTS = [[80, 62], [122, 62], [60, 90], [142, 80], [46, 114], [166, 72], [88, 122], [112, 122], [80, 162], [126, 162], [70, 204], [136, 204]];
/** Silhueta ilustrativa com pontos de pose; será substituída pelo overlay real do modelo. */
export const PoseFigure = () => (<svg viewBox="0 0 220 230" role="img" aria-label="Silhueta com pontos de pose estimation (ilustrativa)">
  <path d="M100 42V60M80 62H122M80 62L60 90L46 114M122 62L142 80L166 72M80 62L88 122M122 62L112 122M88 122H112M88 122L80 162L70 204M112 122L126 162L136 204" stroke="#2dd4bf" strokeWidth="3" strokeLinecap="round" fill="none" />
  <g fill="#ff7a45"><circle cx="100" cy="30" r="13" />{POINTS.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />)}</g></svg>);
