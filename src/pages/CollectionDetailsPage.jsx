import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus, X } from "lucide-react";
import AppLayout from "../components/AppLayout";
import MediaCard from "../components/MediaCard";
import PageHeading from "../components/PageHeading";
import { EmptyState } from "../components/PixelUI";
import { supabase } from "../lib/supabaseClient";
import { useLibrary } from "../context/LibraryContext";

export default function CollectionDetailsPage() {
  const { id } = useParams();
  const { items } = useLibrary();
  const [collection, setCollection] = useState(null);
  const [mediaIds, setMediaIds] = useState([]);
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const { data, error: collectionError } = await supabase.from("collections").select("*").eq("id", id).single();
    if (collectionError) { setError(collectionError.message); return; }
    setCollection(data);
    const { data: rows, error: rowsError } = await supabase.from("collection_items").select("media_id").eq("collection_id", id);
    if (rowsError) setError(rowsError.message); else setMediaIds((rows || []).map(x => x.media_id));
  }
  useEffect(() => { load(); }, [id]);
  const collectionMedia = items.filter(item => mediaIds.includes(item.id));
  const available = items.filter(item => !mediaIds.includes(item.id));

  async function addItem(e) {
    e.preventDefault(); if (!selected) return;
    const { data: { user } } = await supabase.auth.getUser();
    const { error: addError } = await supabase.from("collection_items").insert({ user_id: user.id, collection_id: id, media_id: selected });
    if (addError) setError(addError.message); else { setSelected(""); setAdding(false); load(); }
  }
  async function removeItem(mediaId) {
    const { error: removeError } = await supabase.from("collection_items").delete().eq("collection_id", id).eq("media_id", mediaId);
    if (removeError) setError(removeError.message); else load();
  }

  if (error && !collection) return <AppLayout><p className="auth-error">{error}</p><Link to="/collections">Back to collections</Link></AppLayout>;
  if (!collection) return <AppLayout><p className="muted-copy">Loading collection...</p></AppLayout>;
  return <AppLayout><PageHeading eyebrow="YOUR COLLECTION" title={collection.name} description={collection.description || "A shelf for your favourite things."} action={<Link to="/collections" className="text-link"><ArrowLeft size={14}/> ALL COLLECTIONS</Link>}/>
    <div className="section-heading"><div><p className="eyebrow">{collectionMedia.length} ENTRIES</p><h2>On this shelf</h2></div><button className="button button-small" onClick={() => setAdding(v => !v)}><Plus size={14}/> ADD MEDIA</button></div>
    {error && <p className="auth-error">{error}</p>}
    {adding && <form className="library-toolbar" onSubmit={addItem}><select value={selected} onChange={e => setSelected(e.target.value)} required><option value="">Choose an entry...</option>{available.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select><button className="button button-small" type="submit">ADD TO SHELF</button><button className="icon-button" type="button" onClick={() => setAdding(false)} aria-label="Cancel"><X size={15}/></button></form>}
    {collectionMedia.length ? <div className="media-grid">{collectionMedia.map(item => <div key={item.id}><MediaCard item={item}/><button className="text-link" onClick={() => removeItem(item.id)}>REMOVE FROM SHELF</button></div>)}</div> : <EmptyState/>}
  </AppLayout>;
}
