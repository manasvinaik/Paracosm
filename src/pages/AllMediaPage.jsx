import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import AppLayout from "../components/AppLayout";
import MediaCard from "../components/MediaCard";
import PageHeading from "../components/PageHeading";
import { useLibrary } from "../context/LibraryContext";

export default function AllMediaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query,setQuery]=useState(searchParams.get("q") || ""); const [filter,setFilter]=useState("All");
  useEffect(() => { setQuery(searchParams.get("q") || ""); }, [searchParams]);
  const {items}=useLibrary();
  const filtered=useMemo(()=>items.filter(item=>`${item.title} ${item.creator||""}`.toLowerCase().includes(query.toLowerCase())&&(filter==="All"||item.category===filter)),[items,query,filter]);
  return <AppLayout>
    <PageHeading eyebrow="THE WHOLE COLLECTION" title="All media" description="Every book, screen, story and little obsession in one place." action={<Link to="/media/add" className="button button-small"><Plus size={15}/> ADD MEDIA</Link>}/>
    <div className="library-toolbar"><label className="library-search"><Search size={17}/><input placeholder="Search your archive..." value={query} onChange={e=>{ setQuery(e.target.value); const next = new URLSearchParams(searchParams); if (e.target.value.trim()) next.set("q", e.target.value); else next.delete("q"); setSearchParams(next, { replace: true }); }}/></label><div className="filter-control"><SlidersHorizontal size={16}/><select value={filter} onChange={e=>setFilter(e.target.value)}><option>All</option>{["Books","Movies","TV Shows","Fanfictions","Anime","Manga","Manhwa","Webnovels","Articles","Board Games","Other"].map(x=><option key={x}>{x}</option>)}</select></div></div>
    <div className="results-line"><span>SHOWING <strong>{filtered.length}</strong> ENTRIES</span><span>✦ YOUR PERSONAL ARCHIVE</span></div>
    {filtered.length?<div className="media-grid">{filtered.map(item=><MediaCard key={item.id} item={item}/>)}</div>:<div className="empty-state"><span>☁</span><h3>No stories found!</h3><p>Try another title or add something new to your archive.</p><Link to="/media/add" className="button">ADD MEDIA</Link></div>}
  </AppLayout>;
}
