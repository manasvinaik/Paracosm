import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit3, ExternalLink, Heart, Save, Trash2 } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useLibrary } from "../context/LibraryContext";
import { supabase } from "../lib/supabaseClient";

export default function MediaDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, deleteMedia, loading } = useLibrary();
  const item = items.find((x) => String(x.id) === String(id));

  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState(null);
  const [noteLoading, setNoteLoading] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [noteMessage, setNoteMessage] = useState("");
  const [noteError, setNoteError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNote() {
      if (!item?.id) return;
      setNoteLoading(true);
      setNoteError("");
      setNoteMessage("");

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        if (active) {
          setNoteError("Please log in to access your notes.");
          setNoteLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("media_notes")
        .select("id, content")
        .eq("media_id", item.id)
        .eq("user_id", user.id)
        .eq("note_type", "personal")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!active) return;
      if (error) setNoteError(error.message);
      else {
        setNote(data?.content || "");
        setNoteId(data?.id || null);
      }
      setNoteLoading(false);
    }

    loadNote();
    return () => { active = false; };
  }, [item?.id]);

  async function saveNote() {
    setNoteSaving(true);
    setNoteError("");
    setNoteMessage("");

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Please log in to save your notes.");

      if (noteId) {
        const { error } = await supabase
          .from("media_notes")
          .update({ content: note, updated_at: new Date().toISOString() })
          .eq("id", noteId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else if (note.trim()) {
        const { data, error } = await supabase
          .from("media_notes")
          .insert({
            user_id: user.id,
            media_id: item.id,
            content: note,
            note_type: "personal",
            is_spoiler: false,
          })
          .select("id")
          .single();
        if (error) throw error;
        setNoteId(data.id);
      }

      setNoteMessage("Your notes have been saved to your archive.");
    } catch (error) {
      setNoteError(error.message || "Couldn't save your notes. Please try again.");
    } finally {
      setNoteSaving(false);
    }
  }

  if (loading) return <AppLayout><p className="muted-copy">Loading entry...</p></AppLayout>;
  if (!item) return <AppLayout><div className="empty-state"><span>☁</span><h3>We couldn't find this entry.</h3><Link className="button" to="/library">BACK TO LIBRARY</Link></div></AppLayout>;

  async function remove() {
    if (!window.confirm(`Permanently remove "${item.title}" from your archive?`)) return;
    try {
      await deleteMedia(item.id);
      navigate("/library");
    } catch (err) {
      window.alert(err.message);
    }
  }

  return (
    <AppLayout>
      <div className="detail-back">
        <Link to="/library"><ArrowLeft size={15}/> BACK TO ARCHIVE</Link>
        <div>
          <Link className="button button-small" to={`/media/${item.id}/edit`}><Edit3 size={14}/> EDIT ENTRY</Link>
          <button className="icon-button" onClick={remove} title="Delete"><Trash2 size={16}/></button>
        </div>
      </div>

      <section className="media-detail-hero">
        <div className="detail-cover">
          <img src={item.image || "https://placehold.co/500x700/e8d8e8/6f587d?text=PARACOSM"} alt={item.title}/>
        </div>
        <div className="detail-main">
          <p className="eyebrow">{item.category.toUpperCase()} · {item.year || "YEAR NOT SET"}</p>
          <h1>{item.title}</h1>
          <p className="detail-creator">by {item.creator || "Creator not specified"}</p>
          <div className="detail-rating">
            {item.rating > 0 ? <><span>{"★".repeat(Math.floor(item.rating))}{"☆".repeat(5 - Math.floor(item.rating))}</span><b>{item.rating}/5</b></> : <span className="not-rated">NOT RATED YET</span>}
          </div>
          <span className="status-pill">{item.status}</span>
          <p className="detail-description">{item.description || "No description added yet."}</p>
          {item.sourceUrl && <a className="subtle-link" href={item.sourceUrl} target="_blank" rel="noreferrer">OPEN ORIGINAL SOURCE <ExternalLink size={13}/></a>}
        </div>
      </section>

      <div className="detail-content-grid">
        <section className="pixel-panel personal-notes-panel">
          <div className="pixel-panel-heading">
            <div><p className="eyebrow">YOUR ARCHIVE</p><h2>About this entry</h2></div>
          </div>
          <p className="notes-hint">A little space for your thoughts, favourite moments, quotes and memories.</p>
          <div className="notebook-wrap">
            <textarea
              className="notebook-editor"
              value={note}
              onChange={(e) => { setNote(e.target.value); setNoteMessage(""); }}
              placeholder="Dear diary...\n\nWhat did you think about this one?"
              aria-label={`Personal notes about ${item.title}`}
              disabled={noteLoading}
              spellCheck="true"
            />
          </div>
          {noteError && <p className="auth-error notes-feedback">{noteError}</p>}
          {noteMessage && <p className="auth-success notes-feedback">{noteMessage}</p>}
          <button className="button notes-save-button" onClick={saveNote} disabled={noteLoading || noteSaving}>
            <Save size={15}/>{noteSaving ? "SAVING NOTES..." : "SAVE MY NOTES"}
          </button>
        </section>

        <section className="pixel-panel">
          <div className="pixel-panel-heading"><div><p className="eyebrow">FILED UNDER</p><h2>Entry details</h2></div></div>
          <dl className="detail-list">
            <div><dt>Category</dt><dd>{item.category}</dd></div>
            <div><dt>Status</dt><dd>{item.status}</dd></div>
            <div><dt>Year</dt><dd>{item.year || "Not specified"}</dd></div>
            <div><dt>Rating</dt><dd>{item.rating || "Not rated"}</dd></div>
          </dl>
          <div className="detail-favourite"><Heart size={16}/> A little piece of your universe</div>
        </section>
      </div>
    </AppLayout>
  );
}
