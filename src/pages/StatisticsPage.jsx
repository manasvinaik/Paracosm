import { BookOpen, Heart, Sparkles, Star } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { useLibrary } from "../context/LibraryContext";

export default function StatisticsPage() {
  const { items, loading, customCategories = [] } = useLibrary();
  const cats = [...["Books", "Movies", "TV Shows", "Fanfictions", "Anime", "Manga & Manhwa", "Webnovels", "Board Games", "Articles", "Other"], ...customCategories.map(x => x.name)];
  const max = Math.max(1, ...cats.map(c => items.filter(x => x.category === c || (c === "Manga & Manhwa" && ["Manga", "Manhwa"].includes(x.category))).length));
  const rated = items.filter(x => Number(x.rating) > 0);
  const avg = rated.length ? (rated.reduce((s, x) => s + Number(x.rating), 0) / rated.length).toFixed(1) : "—";
  const favourites = items.filter(x => Number(x.rating) >= 4.5).length;
  return <AppLayout><PageHeading eyebrow="A FEW NUMBERS, A LOT OF FEELINGS" title="Your archive in numbers" description="A snapshot calculated from your own library."/>
    {loading ? <p className="muted-copy">Calculating your archive...</p> : <>
      <div className="stats-grid"><div className="stat-card stat-mint"><BookOpen/><span>TOTAL ENTRIES</span><strong>{items.length}</strong><small>things you've collected</small></div><div className="stat-card stat-pink"><Heart/><span>FAVOURITES</span><strong>{favourites}</strong><small>rated 4.5 stars or higher</small></div><div className="stat-card stat-yellow"><Star/><span>AVERAGE RATING</span><strong>{avg}</strong><small>out of five stars</small></div><div className="stat-card stat-blue"><Sparkles/><span>RATED ENTRIES</span><strong>{rated.length}</strong><small>you've left a rating for</small></div></div>
      <div className="statistics-grid"><section className="pixel-panel"><div className="pixel-panel-heading"><div><p className="eyebrow">YOUR COLLECTION MIX</p><h2>Entries by category</h2></div></div><div className="bar-chart">{cats.map(c => { const count = items.filter(x => x.category === c || (c === "Manga & Manhwa" && ["Manga", "Manhwa"].includes(x.category))).length; return <div className="bar-row" key={c}><span>{c}</span><div className="bar-track"><i style={{ width: `${count / max * 100}%` }}/></div><b>{count}</b></div>; })}</div></section>
      <section className="pixel-panel"><div className="pixel-panel-heading"><div><p className="eyebrow">LITTLE MILESTONES</p><h2>Your archive pulse</h2></div></div><div className="milestone"><span>✦</span><div><strong>{items.length} entries collected</strong><small>Every entry has a place.</small></div></div><div className="milestone"><span>♡</span><div><strong>{rated.length} ratings left</strong><small>Your taste, documented.</small></div></div><div className="milestone"><span>▤</span><div><strong>{cats.filter(c => items.some(x => x.category === c || (c === "Manga & Manhwa" && ["Manga", "Manhwa"].includes(x.category)))).length} categories used</strong><small>Your archive, your mix.</small></div></div></section></div>
    </>}
  </AppLayout>;
}
