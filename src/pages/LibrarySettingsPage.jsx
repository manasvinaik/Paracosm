import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { PixelButton } from "../components/PixelUI";
import { supabase } from "../lib/supabaseClient";

const defaults = { view: "Grid", sort: "Recently added", showCovers: true };
export default function LibrarySettingsPage() {
  const [preferences, setPreferences] = useState(defaults);
  const [userId, setUserId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let alive = true;
    supabase.auth.getUser().then(({ data }) => {
      const id = data.user?.id;
      if (!alive || !id) return;
      setUserId(id);
      try {
        const stored = localStorage.getItem(`paracosm-library-preferences-${id}`);
        if (stored) setPreferences({ ...defaults, ...JSON.parse(stored) });
      } catch { setPreferences(defaults); }
    });
    return () => { alive = false; };
  }, []);

  function update(key, value) { setPreferences(current => ({ ...current, [key]: value })); setSaved(false); }
  function save(e) {
    e.preventDefault();
    if (!userId) return;
    localStorage.setItem(`paracosm-library-preferences-${userId}`, JSON.stringify(preferences));
    setSaved(true);
  }

  return <AppLayout>
    <PageHeading eyebrow="YOUR ARCHIVE, YOUR RULES" title="Library preferences" description="Choose how your personal archive is displayed on this device." />
    <form className="pixel-panel settings-panel" onSubmit={save}>
      <div className="pixel-panel-heading"><div><p className="eyebrow">DEFAULT DISPLAY</p><h2>Library layout</h2></div></div>
      <label className="field">DEFAULT VIEW<select value={preferences.view} onChange={e => update("view", e.target.value)}><option>Grid</option><option>Compact grid</option><option>List</option></select></label>
      <label className="field">DEFAULT SORTING<select value={preferences.sort} onChange={e => update("sort", e.target.value)}><option>Recently added</option><option>Title A–Z</option><option>Highest rated</option><option>Oldest added</option></select></label>
      <label className="toggle-row"><span><strong>Show cover images</strong><small>Display posters and book covers in your library.</small></span><input type="checkbox" checked={preferences.showCovers} onChange={e => update("showCovers", e.target.checked)} /></label>
      <p className="muted-copy">These preferences are saved separately for your signed-in account on this browser. They don't change your media records.</p>
      <PixelButton type="submit" disabled={!userId}>SAVE PREFERENCES</PixelButton>
      {saved && <p className="inline-success">✦ Your library preferences have been saved.</p>}
    </form>
  </AppLayout>;
}
