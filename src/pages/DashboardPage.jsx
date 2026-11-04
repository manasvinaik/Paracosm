import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen, Clapperboard, Heart, Plus, Sparkles, Star } from "lucide-react";
import AppLayout from "../components/AppLayout";
import MediaCard from "../components/MediaCard";
import PageHeading from "../components/PageHeading";
import { useLibrary } from "../context/LibraryContext";

const categories = [
  { name: "Books", path: "/library/books", icon: "▤", color: "tile-mint" },
  { name: "Movies", path: "/library/movies", icon: "▣", color: "tile-peach" },
  { name: "TV Shows", path: "/library/tv-shows", icon: "▥", color: "tile-blue" },
  { name: "Fanfictions", path: "/library/fanfictions", icon: "♡", color: "tile-pink" },
  { name: "Anime", path: "/library", icon: "✧", color: "tile-lilac" },
  { name: "Manga", path: "/library", icon: "▧", color: "tile-yellow" },
  { name: "Manhwa", path: "/library", icon: "▦", color: "tile-blue" },
  { name: "Webnovels", path: "/library", icon: "✦", color: "tile-mint" },
  { name: "Articles", path: "/library", icon: "▤", color: "tile-peach" },
  { name: "Board Games", path: "/library", icon: "♟", color: "tile-lilac" },
  { name: "Other", path: "/library", icon: "✧", color: "tile-pink" },
];

export default function DashboardPage() {
  const { items, loading, error } = useLibrary();
  const recent = items.slice(0, 4);
  const completed = items.filter(x => x.status === "Completed").length;
  const inProgress = items.filter(x => ["Reading", "Watching", "Playing", "Rewatch"].includes(x.status)).length;
  const favourites = items.filter(x => Number(x.rating) >= 4.5).length;
  return <AppLayout>
    <PageHeading eyebrow="YOUR ARCHIVE IS OPEN" title="Welcome to your world ✦" description="A little corner of the internet filled with things you love." action={<Link to="/media/add" className="button button-small"><Plus size={15}/> Add something</Link>} />
    <section className="welcome-strip"><div><span className="strip-label">✦ YOUR COLLECTION, YOUR RULES</span><h2>Every story leaves<br/>a little sparkle.</h2><p>Keep collecting the things that make your world feel bigger.</p></div><div className="strip-illustration"><span>✧</span><div className="pixel-stack">▤<br/>▣<br/>▤</div><b>♡</b></div></section>
    {error && <p className="auth-error">Couldn't load your library: {error}</p>}
    <section className="stats-grid">
      <div className="stat-card stat-mint"><div className="stat-icon"><BookOpen size={18}/></div><span>TOTAL ENTRIES</span><strong>{loading ? "…" : items.length}</strong><small>across your little universe</small></div>
      <div className="stat-card stat-blue"><div className="stat-icon"><Star size={18}/></div><span>FAVOURITES</span><strong>{loading ? "…" : favourites}</strong><small>rated 4.5 stars or higher</small></div>
      <div className="stat-card stat-pink"><div className="stat-icon"><Heart size={18}/></div><span>COMPLETED</span><strong>{loading ? "…" : completed}</strong><small>worlds you've explored</small></div>
      <div className="stat-card stat-yellow"><div className="stat-icon"><Clapperboard size={18}/></div><span>IN PROGRESS</span><strong>{loading ? "…" : inProgress}</strong><small>currently on your mind</small></div>
    </section>
    <section className="content-section"><div className="section-heading"><div><p className="eyebrow">YOUR LITTLE SHELVES</p><h2>Browse by category</h2></div><Link to="/library" className="subtle-link">VIEW ALL <ArrowUpRight size={14}/></Link></div>
      <div className="category-grid">{categories.map(c => { const count = items.filter(item => item.category === c.name).length; return <Link to={c.path} className={`category-tile ${c.color}`} key={c.name}><span className="category-symbol">{c.icon}</span><div><strong>{c.name}</strong><small>{count} {count === 1 ? "entry" : "entries"}</small></div><ArrowUpRight size={16}/></Link>; })}</div>
    </section>
    <section className="content-section"><div className="section-heading"><div><p className="eyebrow">FRESHLY FILED</p><h2>Recently added</h2></div><Link to="/library" className="subtle-link">EXPLORE ARCHIVE <ArrowUpRight size={14}/></Link></div>
      {loading ? <p className="muted-copy">Loading your archive...</p> : recent.length ? <div className="media-grid">{recent.map(item => <MediaCard key={item.id} item={item}/>)}</div> : <div className="empty-state"><span>☁</span><h3>Your universe is waiting!</h3><p>You haven't added anything yet. Start with a favourite book, film or story.</p><Link to="/media/add" className="button">ADD YOUR FIRST ENTRY</Link></div>}
    </section>
    <section className="dashboard-bottom"><div className="quote-card"><Sparkles size={18}/><p>"We are all stories in the end."</p><small>— A LITTLE REMINDER</small></div><div className="progress-card"><div className="section-heading"><div><p className="eyebrow">PICK UP WHERE YOU LEFT OFF</p><h2>Currently exploring</h2></div></div>
      {items.filter(x => ["Reading", "Watching", "Playing", "Rewatch"].includes(x.status)).slice(0,3).map(item => <div className="progress-line" key={item.id}><Link to={`/media/${item.id}`}>{item.title}</Link><strong>{item.status}</strong></div>)}
      {!inProgress && <p className="muted-copy">Entries marked Reading, Watching or Playing will appear here.</p>}<Link to="/tracking" className="subtle-link">VIEW YOUR PROGRESS →</Link></div></section>
  </AppLayout>;
}
