import { useEffect, useState } from "react";
import { Search, Plus, Menu } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Topbar({ onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState({ display_name: "", username: "", avatar_url: "" });

  useEffect(() => {
    let active = true;
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { if (active) setProfile({ display_name: "", username: "", avatar_url: "" }); return; }
      const { data } = await supabase.from("profiles").select("display_name, username, avatar_url").eq("id", user.id).maybeSingle();
      if (active) setProfile({
        display_name: data?.display_name || user.user_metadata?.display_name || "",
        username: data?.username || "",
        avatar_url: data?.avatar_url || "",
        email: user.email || "",
      });
    }
    loadProfile();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => { loadProfile(); });
    return () => { active = false; subscription.unsubscribe(); };
  }, [location.pathname]);

  function searchArchive(e) {
    e.preventDefault();
    const value = query.trim();
    navigate(value ? `/library?q=${encodeURIComponent(value)}` : "/library");
  }

  const label = profile.display_name || profile.username || profile.email || "Profile";
  const initial = label.charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <button className="mobile-menu icon-button" onClick={onMenuClick} aria-label="Open menu"><Menu size={19}/></button>
      <div className="breadcrumb"><span>MY SPACE</span><b>/</b><strong>ARCHIVE DESKTOP</strong></div>
      <div className="topbar-actions">
        <form className="top-search" onSubmit={searchArchive} role="search">
          <Search size={16}/>
          <input aria-label="Search your archive" placeholder="Find something lovely..." value={query} onChange={e => setQuery(e.target.value)} />
          <button className="top-search-submit" type="submit" aria-label="Search">↵</button>
        </form>
        <Link to="/media/add" className="button button-small"><Plus size={15}/> Add media</Link>
        <Link to="/settings/profile" className="avatar" aria-label="Profile settings" title={label}>
          {profile.avatar_url ? <img src={profile.avatar_url} alt="" onError={e => { e.currentTarget.style.display = "none"; }} /> : initial}
          {profile.avatar_url && <span className="avatar-fallback">{initial}</span>}
        </Link>
      </div>
    </header>
  );
}
