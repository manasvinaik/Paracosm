import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { LayoutDashboard, Library, Settings, Sparkles, Layers3, BarChart3, Clock3, LogOut, Plus, X, Pencil, Trash2, Check } from "lucide-react";
import { useLibrary } from "../context/LibraryContext";

export default function Sidebar() {
  const navigate = useNavigate();
  const { shelves = [], createCategory, updateCategory, deleteCategory } = useLibrary();
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  async function logout() { await supabase.auth.signOut(); navigate("/login", { replace: true }); }
  async function handleAddCategory(e) {
    e.preventDefault(); setCategoryError(""); setSavingCategory(true);
    try { const created = await createCategory(newName); setNewName(""); setAdding(false); navigate(`/library/category/${encodeURIComponent(created.name)}`); }
    catch (err) { setCategoryError(err.message || "Couldn't create shelf."); }
    finally { setSavingCategory(false); }
  }
  async function handleRename(e, shelf) {
    e.preventDefault(); setCategoryError(""); setSavingCategory(true);
    try { const updated = await updateCategory(shelf.id, editName); setEditingId(null); setEditName(""); navigate(`/library/category/${encodeURIComponent(updated.name)}`); }
    catch (err) { setCategoryError(err.message || "Couldn't rename shelf."); }
    finally { setSavingCategory(false); }
  }
  async function handleDelete(shelf) {
    if (!window.confirm(`Delete the “${shelf.name}” shelf? Its entries will be moved to another shelf.`)) return;
    setCategoryError("");
    try { await deleteCategory(shelf.id); if (location.pathname.includes(encodeURIComponent(shelf.name))) navigate("/dashboard"); }
    catch (err) { setCategoryError(err.message || "Couldn't delete shelf."); }
  }

  return <aside className="sidebar">
    <NavLink to="/dashboard" className="brand-lockup"><span className="brand-mark">✦</span><span><strong>PARACOSM</strong><small>YOUR LITTLE UNIVERSE</small></span></NavLink>
    <div className="sidebar-navigation">
      <div className="sidebar-group"><div className="sidebar-label">YOUR SPACE</div><nav className="side-nav">
        <NavLink to="/dashboard" className={({isActive})=>`side-link ${isActive?"active":""}`}><LayoutDashboard size={16}/><span>Dashboard</span></NavLink>
        <NavLink to="/library" end className={({isActive})=>`side-link ${isActive?"active":""}`}><Library size={16}/><span>All media</span></NavLink>
      </nav></div>
      <div className="sidebar-group"><div className="sidebar-custom-heading"><div className="sidebar-label">YOUR SHELVES</div><button type="button" className="sidebar-add-category" onClick={()=>{setAdding(v=>!v);setCategoryError("");}} aria-label="Add shelf">{adding?<X size={14}/>:<Plus size={14}/>}</button></div>
        <nav className="side-nav shelf-nav">{shelves.map(shelf=><div className="shelf-nav-row" key={shelf.id}>
          {editingId===shelf.id ? <form className="shelf-inline-edit" onSubmit={e=>handleRename(e,shelf)}><input autoFocus value={editName} onChange={e=>setEditName(e.target.value)} maxLength={40}/><button type="submit" disabled={savingCategory||!editName.trim()} aria-label="Save shelf name"><Check size={13}/></button><button type="button" onClick={()=>{setEditingId(null);setCategoryError("");}} aria-label="Cancel"><X size={13}/></button></form> : <>
            <NavLink to={`/library/category/${encodeURIComponent(shelf.name)}`} className={({isActive})=>`side-link shelf-link ${isActive?"active":""}`}><span className="custom-category-icon">{shelf.icon||"✦"}</span><span>{shelf.name}</span></NavLink>
            <span className="shelf-actions"><button type="button" title={`Rename ${shelf.name}`} aria-label={`Rename ${shelf.name}`} onClick={()=>{setEditingId(shelf.id);setEditName(shelf.name);setCategoryError("");}}><Pencil size={12}/></button><button type="button" title={`Delete ${shelf.name}`} aria-label={`Delete ${shelf.name}`} onClick={()=>handleDelete(shelf)}><Trash2 size={12}/></button></span>
          </>}
        </div>)}</nav>
        {adding&&<form className="sidebar-category-form" onSubmit={handleAddCategory}><input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} maxLength={40} placeholder="Shelf name" aria-label="New shelf name"/><button type="submit" disabled={savingCategory||!newName.trim()}>{savingCategory?"...":"ADD"}</button></form>}
        {categoryError&&<p className="sidebar-category-error">{categoryError}</p>}
      </div>
      <div className="sidebar-group"><div className="sidebar-label">ORGANISE</div><nav className="side-nav"><NavLink to="/collections" className="side-link"><Layers3 size={16}/><span>Collections</span></NavLink><NavLink to="/tracking" className="side-link"><Clock3 size={16}/><span>Progress tracker</span></NavLink></nav></div>
      <div className="sidebar-group"><div className="sidebar-label">YOUR INSIGHTS</div><nav className="side-nav"><NavLink to="/statistics" className="side-link"><BarChart3 size={16}/><span>Statistics</span></NavLink><NavLink to="/activity" className="side-link"><Sparkles size={16}/><span>Activity</span></NavLink></nav></div>
    </div>
    <div className="sidebar-bottom"><div className="sidebar-note"><Sparkles size={17}/><strong>A universe of your own</strong><p>Every story you love has a place here.</p></div><NavLink to="/settings" className="side-link sidebar-action"><Settings size={17}/><span>Settings</span></NavLink><button type="button" className="side-link sidebar-action logout-link" onClick={logout}><LogOut size={17}/><span>Log out</span></button></div>
  </aside>;
}
