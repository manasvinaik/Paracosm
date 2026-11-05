import { Clock3, Plus, Star } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { useLibrary } from "../context/LibraryContext";

export default function ActivityPage() {
  const { items, loading } = useLibrary();
  const recent = items.slice(0, 12);
  return <AppLayout><PageHeading eyebrow="A TRAIL OF LITTLE DISCOVERIES" title="Activity timeline" description="A record of the things you've added to your Paracosm archive."/>
    {loading ? <p className="muted-copy">Loading your activity...</p> : recent.length ? <div className="timeline">{recent.map((item, i) => <div className="timeline-item" key={item.id}><div className="timeline-marker">{i === 0 ? <Plus size={14}/> : <Clock3 size={14}/>}</div><div className="timeline-content"><small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : "ADDED TO YOUR ARCHIVE"}</small><strong>{item.title}</strong><p>{item.category} · {item.creator || "Creator not specified"}</p></div><span className="timeline-rating">{item.rating > 0 ? <><Star size={12} fill="currentColor"/> {item.rating}</> : "—"}</span></div>)}</div> : <div className="empty-state"><span>✧</span><h3>Your timeline is empty.</h3><p>New entries you add will appear here.</p></div>}
  </AppLayout>;
}
