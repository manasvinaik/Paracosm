import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email,setEmail]=useState(""); const [sent,setSent]=useState(false); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: `${window.location.origin}/reset-password` });
    setLoading(false);
    if (resetError) setError(resetError.message); else setSent(true);
  }
  return <div className="login-page"><Link to="/login" className="back-home"><ArrowLeft size={15}/> BACK TO LOGIN</Link><div className="login-decoration decoration-left">✦<br/>♡<br/>✧</div><div className="login-card window-frame"><div className="window-titlebar"><span>PARACOSM RECOVERY.EXE</span><div><i/><i/><i/></div></div><div className="login-inner"><div className="login-emblem">✧</div><p className="eyebrow">LOST YOUR SECRET KEY?</p><h1>Find your way<br/><em>back home.</em></h1>
    {sent ? <div className="recovery-success"><Sparkles size={23}/><h3>CHECK YOUR INBOX</h3><p>If an account exists for <strong>{email}</strong>, Supabase will send a password recovery link.</p><Link className="button" to="/login">BACK TO LOGIN <ArrowRight size={15}/></Link></div> : <><p className="login-subtitle">Enter the email address associated with your archive.</p><form onSubmit={handleSubmit}><label className="form-label">EMAIL ADDRESS</label><div className="input-with-icon"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></div>{error && <p className="auth-error">{error}</p>}<button className="button login-submit" type="submit" disabled={loading}>{loading ? "SENDING..." : "SEND RECOVERY LINK"}<ArrowRight size={16}/></button></form></>}
    <div className="auth-switch">Remembered your password? <Link to="/login">Log in</Link></div></div><div className="login-bottom">✦ YOUR PERSONAL ARCHIVE · PARACOSM © 2026 ✦</div></div><div className="login-decoration decoration-right">✧<br/>✦<br/>♡</div></div>;
}
