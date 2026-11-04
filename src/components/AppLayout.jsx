import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="app-shell">
      {menuOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />}
      <div className={`sidebar-wrap ${menuOpen ? "sidebar-open" : ""}`}><Sidebar /></div>
      <div className="app-main">
        <Topbar onMenuClick={() => setMenuOpen(!menuOpen)} />
        <main className="main-content">{children}</main>
        <footer className="app-footer"><span>✦ MADE OF STORIES & STARDUST ✦</span><span>PARACOSM © 2026</span></footer>
      </div>
    </div>
  );
}
