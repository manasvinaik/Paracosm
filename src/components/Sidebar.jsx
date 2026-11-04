import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { BookOpen, Clapperboard, Tv, Heart, LayoutDashboard, Library, Settings, Sparkles, Layers3, BarChart3, Clock3, LogOut } from "lucide-react";

const groups = [
  { title: "YOUR SPACE", links: [
    { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { label: "All media", to: "/library", icon: Library, end: true },
  ]},
  { title: "YOUR SHELVES", links: [
    { label: "Books", to: "/library/books", icon: BookOpen },
    { label: "Movies", to: "/library/movies", icon: Clapperboard },
    { label: "TV shows", to: "/library/tv-shows", icon: Tv },
    { label: "Fanfictions", to: "/library/fanfictions", icon: Heart },
  ]},
  { title: "ORGANISE", links: [
    { label: "Collections", to: "/collections", icon: Layers3 },
    { label: "Progress tracker", to: "/tracking", icon: Clock3 },
  ]},
  { title: "YOUR INSIGHTS", links: [
    { label: "Statistics", to: "/statistics", icon: BarChart3 },
    { label: "Activity", to: "/activity", icon: Sparkles },
  ]}
];

export default function Sidebar() {
  const navigate = useNavigate();
  async function logout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand-lockup">
        <span className="brand-mark">✦</span>
        <span><strong>PARACOSM</strong><small>YOUR LITTLE UNIVERSE</small></span>
      </NavLink>
      <div className="sidebar-navigation">
        {groups.map(group => <div className="sidebar-group" key={group.title}>
          <div className="sidebar-label">{group.title}</div>
          <nav className="side-nav">
            {group.links.map(({ label, to, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}>
                <Icon size={16} strokeWidth={2.1}/><span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>)}
      </div>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><Sparkles size={17}/><strong>A universe of your own</strong><p>Every story you love has a place here.</p></div>
        <NavLink to="/settings" className={({ isActive }) => `side-link sidebar-action ${isActive ? "active" : ""}`}><Settings size={17}/><span>Settings</span></NavLink>
        <button type="button" className="side-link sidebar-action logout-link" onClick={logout}><LogOut size={17}/><span>Log out</span></button>
      </div>
    </aside>
  );
}
