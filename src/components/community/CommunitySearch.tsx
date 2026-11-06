export default function CommunitySearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Buscar na comunidade (título, texto, autor, tag)" aria-label="Buscar na comunidade" />;
}
