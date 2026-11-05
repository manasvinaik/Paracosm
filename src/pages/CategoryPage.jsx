import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import AppLayout from "../components/AppLayout";
import MediaCard from "../components/MediaCard";
import { useLibrary } from "../context/LibraryContext";

export default function CategoryPage({ title, eyebrow, description, category, symbol, accent }) {
  const [query,setQuery]=useState(""); const [status,setStatus]=useState("All statuses");
  const {items}=useLibrary();
  const filtered=useMemo(()=>items.filter(item=>(item.category===category || (category==="Manga & Manhwa" && ["Manga","Manhwa"].includes(item.category)))&&`${item.title} ${item.creator||""}`.toLowerCase().includes(query.toLowerCase())&&(status==="All statuses"||item.status===status)),[items,query,status,category]);
  return <AppLayout>
    <div className={`category-banner ${accent}`}><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></div><div className="category-banner-symbol">{symbol}</div></div>
    <div className="library-toolbar"><label className="library-search"><Search size={17}/><input placeholder={`Search ${title.toLowerCase()}...`} value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="filter-control"><SlidersHorizontal size={16}/><select value={status} onChange={e=>setStatus(e.target.value)}><option>All statuses</option>{["Completed","Reading","Watching","Playing","Want to read","On hold","Dropped","Rewatch"].map(x=><option key={x}>{x}</option>)}</select></div></div>
    <div className="results-line"><span><strong>{filtered.length}</strong> {category.toUpperCase()} IN YOUR ARCHIVE</span><Link className="subtle-link" to="/media/add"><Plus size={13}/> ADD TO THIS SHELF</Link></div>
    {filtered.length?<div className="media-grid">{filtered.map(item=><MediaCard key={item.id} item={item}/>)}</div>:<div className="empty-state"><span>{symbol}</span><h3>Your shelf is waiting!</h3><p>There aren't any matching entries here yet.</p><Link className="button" to="/media/add">ADD SOMETHING</Link></div>}
  </AppLayout>;
}
