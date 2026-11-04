import { useNavigate } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import MediaForm from "../components/MediaForm";
import { useLibrary } from "../context/LibraryContext";

export default function AddMediaPage() {
  const navigate = useNavigate(); const { addMedia } = useLibrary();
  async function save(entry) { const item = await addMedia(entry); navigate(`/media/${item.id}`); }
  return <AppLayout><PageHeading eyebrow="A NEW LITTLE DISCOVERY" title="Add to your archive" description="Give this story, film or favourite thing a home." action={<button className="text-link" onClick={() => navigate(-1)}><ArrowLeft size={14}/> GO BACK</button>}/>
    <div className="add-page-layout"><div className="form-main-panel"><MediaForm onSubmit={save}/></div><aside className="form-aside"><div className="pixel-tip"><Sparkles size={19}/><h3>A LITTLE TIP</h3><p>You can add anything to Paracosm. If it doesn't fit a category yet, choose Other.</p></div><div className="form-aside-art">▤<span>✦</span><small>NEW STORY<br/>UNLOCKED</small></div></aside></div>
  </AppLayout>;
}
