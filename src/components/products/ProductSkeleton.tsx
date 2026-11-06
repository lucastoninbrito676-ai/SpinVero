export default function ProductSkeleton({ count = 6 }: { count?: number }) {
  return <div className="grid" aria-busy="true" aria-label="Carregando equipamentos">{Array.from({ length: count }, (_, i) => <div key={i} className="skel" />)}</div>;
}
