export default function Stars({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating);
  return (<div className="muted" style={{ fontSize: 13 }} aria-label={`Avaliação ${rating} de 5${count != null ? `, ${count} avaliações` : ""}`}>
    <span className="stars" aria-hidden="true">{"★".repeat(full)}{"☆".repeat(5 - full)}</span> {rating.toFixed(1)}{count != null && ` (${count})`}</div>);
}
