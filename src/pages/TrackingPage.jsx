import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import MediaCard from "../components/MediaCard";
import { useLibrary } from "../context/LibraryContext";

const tabs=["Currently consuming","Completed","On hold","Dropped","Want to read"];
export default function TrackingPage(){const{items}=useLibrary();const[active,setActive]=useState("Currently consuming");const filtered=useMemo(()=>items.filter(x=>{if(active==="Currently consuming")return ["Reading","Watching","Playing","Rewatch"].includes(x.status);return x.status===active;}),[items,active]);return <AppLayout><PageHeading eyebrow="YOUR JOURNEY SO FAR" title="Progress tracker" description="Keep an eye on the stories you're in the middle of and the ones you've finished."/><div className="tab-row">{tabs.map(t=><button key={t} className={active===t?"active":""} onClick={()=>setActive(t)}>{t}</button>)}</div>{filtered.length?<div className="media-grid">{filtered.map(item=><MediaCard key={item.id} item={item}/>)}</div>:<div className="empty-state"><span>☁</span><h3>No entries in this shelf yet.</h3><p>When you update a media status, it will show up here.</p><Link to="/library" className="button">BROWSE LIBRARY</Link></div>}</AppLayout>}
