import { Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function MediaCard({ item }) {
  const cover = item.image || "https://placehold.co/500x700/e8d8e8/6f587d?text=PARACOSM";
  return <article className="media-card"><Link to={`/media/${item.id}`} className="media-card-link" aria-label={`View ${item.title}`}>
    <div className="media-cover-wrap"><img src={cover} alt={`${item.title} cover`} className="media-cover" loading="lazy" onError={e => { e.currentTarget.src = "https://placehold.co/500x700/e8d8e8/6f587d?text=PARACOSM"; }}/><span className="cover-category">{item.category}</span></div>
    <div className="media-card-info"><div className="media-card-title-row"><h3>{item.title}</h3>{item.rating > 0 && <span className="mini-rating"><Star size={12} fill="currentColor"/> {item.rating}</span>}</div><p>{item.creator}</p><div className="media-card-bottom"><span className={`status-pill ${String(item.status).toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span><span className="media-year">{item.year}</span></div></div>
  </Link></article>;
}
