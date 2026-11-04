import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyRound, LogOut, ShieldCheck } from "lucide-react";
import AppLayout from "../components/AppLayout";
import PageHeading from "../components/PageHeading";
import { supabase } from "../lib/supabaseClient";
import { PixelButton } from "../components/PixelUI";

export default function AccountSettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data, error: authError }) => {
      if (authError) setError(authError.message);
      setUser(data.user || null);
      setLoading(false);
    });
  }, []);

  async function changePassword(e) {
    e.preventDefault(); setError(""); setSuccess("");
    if (password.length < 6) return setError("Use at least 6 characters for your new password.");
    if (password !== confirm) return setError("Your passwords don't match.");
    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) setError(updateError.message);
    else { setPassword(""); setConfirm(""); setSuccess("Your password has been updated."); }
  }

  async function logout() {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) { setError(signOutError.message); return; }
    navigate("/login", { replace: true });
  }

  return <AppLayout>
    <PageHeading eyebrow="A NOTE ABOUT PRIVACY" title="Account & privacy" description="Your real Paracosm account, sign-in details and security controls." />
    {loading ? <p className="muted-copy">Loading account details...</p> : <>
      <div className="privacy-card"><span><ShieldCheck size={25}/></span><h2>Your archive is private by default.</h2><p>Your media, notes and collections are associated with your signed-in account. Database Row Level Security policies control access to your private records.</p><div className="privacy-status"><i/> SUPABASE AUTHENTICATION ACTIVE</div>
        <dl className="detail-list"><div><dt>Email address</dt><dd>{user?.email || "Not available"}</dd></div><div><dt>Account created</dt><dd>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</dd></div><div><dt>Email confirmed</dt><dd>{user?.email_confirmed_at ? new Date(user.email_confirmed_at).toLocaleDateString() : "Awaiting verification"}</dd></div><div><dt>User ID</dt><dd className="account-id">{user?.id || "—"}</dd></div></dl>
      </div>
      <form className="pixel-panel settings-panel" onSubmit={changePassword}>
        <div className="pixel-panel-heading"><div><p className="eyebrow">ACCOUNT SECURITY</p><h2><KeyRound size={19}/> Change password</h2></div></div>
        <label className="field">NEW PASSWORD<input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" required minLength={6}/></label>
        <label className="field">CONFIRM NEW PASSWORD<input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Enter it again" required/></label>
        <PixelButton type="submit" disabled={saving}>{saving ? "UPDATING..." : "UPDATE PASSWORD"}</PixelButton>
      </form>
      {error && <p className="auth-error">{error}</p>}{success && <p className="inline-success">✦ {success}</p>}
      <div className="pixel-panel settings-panel"><div className="pixel-panel-heading"><div><p className="eyebrow">LEAVING THE ARCHIVE?</p><h2>Sign out</h2></div></div><p className="muted-copy">This ends your current session on this device. Your saved library and notes remain in your account.</p><button type="button" className="button button-secondary" onClick={logout}><LogOut size={15}/> LOG OUT</button></div>
    </>}
  </AppLayout>;
}
