import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { Modal, PixelButton } from "../components/PixelUI";
import { supabase } from "../lib/supabaseClient";

export default function CollectionsPage() {
  const [collections, setCollections] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCollections() {
    setLoading(true); setError("");
    const { data, error: queryError } = await supabase.from("collections").select("*, collection_items(count)").order("created_at", { ascending: false });
    if (queryError) setError(queryError.message);
    else setCollections((data || []).map(c => ({ ...c, count: c.collection_items?.[0]?.count || 0 })));
    setLoading(false);
  }
  useEffect(() => { loadCollections(); }, []);

  async function create(e) {
    e.preventDefault(); setSaving(true); setError("");
    const { data: { user } } = await supabase.auth.getUser();
    const { error: insertError } = await supabase.from("collections").insert({ user_id: user.id, name: name.trim(), description: description.trim() }).select().single();
    setSaving(false);
    if (insertError) { setError(insertError.message); return; }
    setName(""); setDescription(""); setOpen(false); loadCollections();
  }

  return <AppLayout><PageHeading eyebrow="SORTED WITH LOVE" title="Collections & shelves" description="Gather entries from different corners of your archive into little themed shelves." action={<PixelButton onClick={() => setOpen(true)}><Plus size={15}/> NEW COLLECTION</PixelButton>}/>
    {error && <p className="auth-error">{error}</p>}
    {loading ? <p className="muted-copy">Loading your collections...</p> : collections.length ? <div className="collection-grid">{collections.map((c, i) => <Link to={`/collections/${c.id}`} className={`collection-card collection-${["mint", "pink", "yellow", "lilac", "blue"][i % 5]}`} key={c.id}><div className="collection-art"><span>{["☁", "♡", "▤", "✦", "✧"][i % 5]}</span><i>✦</i></div><div className="collection-info"><div><h3>{c.name}</h3><p>{c.description}</p></div><div className="collection-meta"><span>{c.count} ENTRIES</span><ArrowUpRight size={16}/></div></div></Link>)}</div> : <div className="empty-state"><span>▤</span><h3>No collections yet.</h3><p>Create your first shelf to group your favourite entries.</p><button className="button" onClick={() => setOpen(true)}>CREATE A COLLECTION</button></div>}
    {open && <Modal title="CREATE A NEW SHELF" onClose={() => setOpen(false)}><form className="stacked-form" onSubmit={create}><label className="field">COLLECTION NAME *<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Rainy day favourites"/></label><label className="field">DESCRIPTION<textarea rows="3" value={description} onChange={e => setDescription(e.target.value)} placeholder="What belongs on this shelf?"/></label>{error && <p className="auth-error">{error}</p>}<PixelButton type="submit" disabled={saving}>{saving ? "CREATING..." : "CREATE COLLECTION"}</PixelButton></form></Modal>}
  </AppLayout>;
}
