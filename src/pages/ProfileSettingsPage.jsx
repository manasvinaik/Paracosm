import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { PixelButton } from "../components/PixelUI";
import { supabase } from "../lib/supabaseClient";
import { UserRound } from "lucide-react";
import { normalizeImageUrl } from "../lib/imageUrl";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ display_name: "", username: "", bio: "", avatar_url: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let alive = true;
    async function loadProfile() {
      setLoading(true); setError("");
      const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
      if (authError) { if (alive) { setError(authError.message); setLoading(false); } return; }
      if (!currentUser) { if (alive) { setError("Please sign in again to edit your profile."); setLoading(false); } return; }
      const { data, error: profileError } = await supabase.from("profiles").select("id, username, display_name, bio, avatar_url").eq("id", currentUser.id).maybeSingle();
      if (!alive) return;
      if (profileError) setError(profileError.message);
      setUser(currentUser);
      setProfile({
        display_name: data?.display_name ?? currentUser.user_metadata?.display_name ?? "",
        username: data?.username ?? "",
        bio: data?.bio ?? "",
        avatar_url: data?.avatar_url ?? "",
      });
      setLoading(false);
    }
    loadProfile();
    return () => { alive = false; };
  }, []);

  function change(field, value) {
    setProfile(current => ({ ...current, [field]: value }));
    setSuccess("");
  }

  async function saveProfile(e) {
    e.preventDefault(); setSaving(true); setError(""); setSuccess("");
    try {
      if (!user) throw new Error("No signed-in user was found.");
      const avatarUrl = normalizeImageUrl(profile.avatar_url);
      const username = profile.username.trim().replace(/^@/, "");
      const displayName = profile.display_name.trim();
      if (username && !/^[a-zA-Z0-9_.-]{3,24}$/.test(username)) throw new Error("Username must be 3–24 characters and use only letters, numbers, dots, underscores or hyphens.");
      const { data: updatedProfile, error: updateError } = await supabase.from("profiles").update({
        username: username || null,
        display_name: displayName || null,
        bio: profile.bio.trim() || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id).select("id").maybeSingle();
      if (updateError) throw updateError;
      if (!updatedProfile) throw new Error("Your profile record was not found. Please sign out and sign back in, then try again.");
      await supabase.auth.updateUser({ data: { display_name: displayName } });
      setProfile(current => ({ ...current, username }));
      setSuccess("✦ Your profile has been saved to Paracosm.");
    } catch (err) { setError(err.message || "Couldn't save your profile."); }
    finally { setSaving(false); }
  }

  const initial = (profile.display_name || profile.username || user?.email || "P").charAt(0).toUpperCase();

  return <AppLayout>
    <PageHeading eyebrow="THE PERSON BEHIND THE ARCHIVE" title="Profile settings" description="Your name and the little details attached to your Paracosm account." />
    <section className="form-main-panel">
      {loading ? <p className="muted-copy">Loading your profile...</p> : <form className="stacked-form" onSubmit={saveProfile}>
        <div className="profile-avatar-large" aria-label="Profile image preview">{profile.avatar_url ? <img src={profile.avatar_url} alt="Profile preview" onError={e => { e.currentTarget.parentElement.textContent = initial; }} /> : initial}</div>
        <p className="muted-copy">Signed in as {user?.email}</p>
        <div className="form-grid">
          <label className="field">DISPLAY NAME<input value={profile.display_name} onChange={e => change("display_name", e.target.value)} placeholder="How should we address you?" maxLength={60} /></label>
          <label className="field">USERNAME<input value={profile.username} onChange={e => change("username", e.target.value)} placeholder="your-username" maxLength={24} /></label>
          <label className="field full">BIO<textarea rows="4" value={profile.bio} onChange={e => change("bio", e.target.value)} placeholder="A reader, watcher, collector of little worlds..." maxLength={300} /></label>
<<<<<<< HEAD
          <label className="field full">AVATAR IMAGE URL <input type="url" value={profile.avatar_url} onChange={e => change("avatar_url", e.target.value)} placeholder="https://example.com/avatar.webp" /><small className="field-hint">Use a direct public JPG, PNG, GIF or WebP image URL. Animated GIF avatars are supported. Leave blank to use your initial.</small></label>
=======
          <label className="field full">AVATAR IMAGE URL <input type="url" value={profile.avatar_url} onChange={e => change("avatar_url", e.target.value)} placeholder="https://example.com/avatar.png" /><small className="field-hint">Use a direct public image link ending in .jpg, .jpeg or .png. Leave blank to use your initial.</small></label>
>>>>>>> 5d050b94f5e6a0cde40183f9a3973b17b4bc73e2
        </div>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="inline-success">{success}</p>}
        <PixelButton type="submit" disabled={saving}>{saving ? "SAVING..." : "SAVE PROFILE"}</PixelButton>
      </form>}
    </section>
  </AppLayout>;
}
