import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function ResetPasswordPage() {
  const navigate = useNavigate(); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e) {
    e.preventDefault(); setError("");
    if (password.length < 6) return setError("Your password needs at least 6 characters.");
    if (password !== confirm) return setError("Those passwords don't match.");
    setLoading(true); const { error: updateError } = await supabase.auth.updateUser({ password }); setLoading(false);
    if (updateError) setError(updateError.message); else navigate("/dashboard", { replace: true });
  }
  return <div className="login-page"><Link to="/login" className="back-home"><ArrowLeft size={15}/> BACK TO LOGIN</Link><div className="login-card window-frame"><div className="window-titlebar"><span>PARACOSM RESET.EXE</span><div><i/><i/><i/></div></div><div className="login-inner"><div className="login-emblem">✦</div><p className="eyebrow">A FRESH START</p><h1>Choose a new<br/><em>secret key.</em></h1><form onSubmit={submit}><label className="form-label">NEW PASSWORD</label><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={6} autoComplete="new-password" required/></div><label className="form-label">CONFIRM PASSWORD</label><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} autoComplete="new-password" required/></div>{error && <p className="auth-error">{error}</p>}<button className="button login-submit" disabled={loading}>{loading ? "UPDATING..." : "UPDATE PASSWORD"}<ArrowRight size={16}/></button></form></div><div className="login-bottom">✦ YOUR PERSONAL ARCHIVE · PARACOSM © 2026 ✦</div></div></div>;
}
