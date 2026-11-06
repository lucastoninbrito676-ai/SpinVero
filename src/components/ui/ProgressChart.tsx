interface Props { values: number[]; labels?: string[] }
/** Gráfico de linha em SVG puro (sem biblioteca). Escala fixa de 50 a 100; `labels` opcionais no eixo X. */
export default function ProgressChart({ values, labels }: Props) {
  const w = 300, h = labels ? 150 : 120, pad = labels ? 28 : 12;
  const x = (i: number) => 20 + (i * (w - 40)) / Math.max(values.length - 1, 1);
  const y = (v: number) => h - pad - ((Math.min(Math.max(v, 50), 100) - 50) / 50) * (h - pad - 22);
  return (<svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%" }} role="img" aria-label={`Evolução: de ${values[0]} a ${values[values.length - 1]}`}>
    <polyline key={values.join()} points={values.map((v, i) => `${x(i)},${y(v)}`).join(" ")} fill="none" stroke="var(--acc)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" style={{ animation: "draw 1.2s both" }} />
    {values.map((v, i) => <g key={i}><circle cx={x(i)} cy={y(v)} r="4" fill="var(--acc)" /><text x={x(i)} y={y(v) - 9} fontSize="10" textAnchor="middle" fill="var(--mute)">{v}</text>
      {labels && <text x={x(i)} y={h - 8} fontSize="10" textAnchor="middle" fill="var(--mute)">{labels[i]}</text>}</g>)}</svg>);
}
