import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import MediaForm from "../components/MediaForm";
import { useLibrary } from "../context/LibraryContext";

export default function EditMediaPage() {
  const { id } = useParams(); const navigate = useNavigate();
  const { items, updateMedia, loading } = useLibrary();
  const item = items.find(x => String(x.id) === String(id));
  if (loading) return <AppLayout><p className="muted-copy">Loading entry...</p></AppLayout>;
  if (!item) return <AppLayout><div className="empty-state"><h3>Entry not found.</h3><Link to="/library">Return to library</Link></div></AppLayout>;
  async function save(changes) { const updated = await updateMedia(id, changes); navigate(`/media/${updated.id}`); }
  return <AppLayout><PageHeading eyebrow="MAKE IT YOURS" title="Edit entry" description={`Update the details for ${item.title}.`} action={<Link className="text-link" to={`/media/${id}`}><ArrowLeft size={14}/> CANCEL</Link>}/><div className="form-main-panel"><MediaForm initialValues={item} onSubmit={save} submitLabel="SAVE CHANGES"/></div></AppLayout>;
}
