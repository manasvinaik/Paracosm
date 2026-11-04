import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { PixelButton } from "./PixelUI";
import { normalizeImageUrl } from "../lib/imageUrl";

const blank = { title: "", creator: "", category: "Books", status: "Want to read", rating: "0", year: "", image: "", description: "", sourceUrl: "" };
const categoryOptions = ["Books", "Movies", "TV Shows", "Fanfictions", "Anime", "Manga", "Manhwa", "Webnovels", "Articles", "Board Games", "Other"];
const statusOptions = ["Want to read", "Reading", "Watching", "Playing", "Completed", "On hold", "Dropped", "Rewatch"];

export default function MediaForm({ initialValues = blank, onSubmit, submitLabel = "SAVE TO ARCHIVE" }) {
  const [form, setForm] = useState({ ...blank, ...initialValues });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));
  async function submit(e) {
    e.preventDefault(); setError(""); setSaving(true);
    try { const image = normalizeImageUrl(form.image); await onSubmit({ ...form, image, rating: Number(form.rating), year: form.year || "" }); }
    catch (err) { setError(err.message || "Unable to save this entry."); }
    finally { setSaving(false); }
  }
  return <div className="media-form-wrap">
    <div className="form-mode-tabs"><button className="selected" type="button"><ImagePlus size={15}/> MANUAL ENTRY</button></div>
    <form className="stacked-form" onSubmit={submit}><div className="form-grid">
      <label className="field full">TITLE *<input required value={form.title} onChange={e => change("title", e.target.value)} placeholder="What are we adding?"/></label>
      <label className="field">CATEGORY<select value={form.category} onChange={e => change("category", e.target.value)}>{categoryOptions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="field">CREATOR / AUTHOR<input value={form.creator} onChange={e => change("creator", e.target.value)} placeholder="Who made it?"/></label>
      <label className="field">STATUS<select value={form.status} onChange={e => change("status", e.target.value)}>{statusOptions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="field">YEAR<input type="number" min="0" max="9999" value={form.year} onChange={e => change("year", e.target.value)} placeholder="2026"/></label>
      <label className="field">YOUR RATING<select value={form.rating} onChange={e => change("rating", e.target.value)}>{["0","0.5","1","1.5","2","2.5","3","3.5","4","4.5","5"].map(x => <option key={x} value={x}>{x === "0" ? "Not rated" : `${x} / 5 stars`}</option>)}</select></label>
      <label className="field full">COVER IMAGE URL<input type="url" value={form.image} onChange={e => change("image", e.target.value)} placeholder="https://example.com/cover.jpg"/><small className="field-hint">Use a direct public image link ending in .jpg, .jpeg or .png.</small></label>
      {form.image && /^https?:\/\//i.test(form.image) && <div className="image-url-preview"><img src={form.image} alt="Cover preview" onError={e => { e.currentTarget.style.display = "none"; }} /><span>Cover preview</span></div>}
      <label className="field full">DESCRIPTION<textarea rows="4" value={form.description} onChange={e => change("description", e.target.value)} placeholder="A little about this media..."/></label>
      <label className="field full">ORIGINAL LINK<input type="url" value={form.sourceUrl} onChange={e => change("sourceUrl", e.target.value)} placeholder="https://..."/></label>
    </div>{error && <p className="auth-error">{error}</p>}<div className="form-actions"><PixelButton type="submit" disabled={saving}>{saving ? "SAVING..." : submitLabel}</PixelButton><span>* Required field</span></div></form>
  </div>;
}
