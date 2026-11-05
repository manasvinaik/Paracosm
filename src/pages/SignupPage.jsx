import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [confirm,setConfirm]=useState("");
  const [error,setError]=useState(""); const [message,setMessage]=useState(""); const [loading,setLoading]=useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setMessage("");
    if (password.length < 6) return setError("Your password needs at least 6 characters.");
    if (password !== confirm) return setError("Those passwords don't match yet.");
    setLoading(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({ email: email.trim().toLowerCase(), password, options: { data: { display_name: name.trim() }, emailRedirectTo: `${window.location.origin}/login` } });
      if (signupError) throw signupError;
      if (data.session) navigate("/dashboard", { replace: true });
      else setMessage("Your account has been created! Check your email for the verification link, then log in.");
    } catch (err) { setError(err.message || "Unable to create your account."); }
    finally { setLoading(false); }
  }
  return <div className="login-page"><Link to="/" className="back-home"><ArrowLeft size={15}/> BACK TO HOME</Link><div className="login-decoration decoration-left">✦<br/>♡<br/>✧</div>
    <div className="login-card window-frame"><div className="window-titlebar"><span>PARACOSM SIGNUP.EXE</span><div><i/><i/><i/></div></div><div className="login-inner"><div className="login-emblem">✦</div><p className="eyebrow">A NEW WORLD AWAITS</p><h1>Create your<br/><em>little universe.</em></h1><p className="login-subtitle">Let's make a home for everything you love.</p>
      <form onSubmit={handleSubmit}><label className="form-label">DISPLAY NAME</label><div className="input-with-icon"><UserRound size={17}/><input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" autoComplete="name" required/></div><label className="form-label">EMAIL ADDRESS</label><div className="input-with-icon"><Mail size={17}/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required/></div><label className="form-label">PASSWORD</label><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 6 characters" autoComplete="new-password" minLength={6} required/></div><label className="form-label">CONFIRM PASSWORD</label><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Type it once more" autoComplete="new-password" required/></div>{error && <p className="auth-error">{error}</p>}{message && <p className="auth-success">{message}</p>}<button className="button login-submit" type="submit" disabled={loading}>{loading ? "CREATING ACCOUNT..." : "CREATE MY ARCHIVE"}{!loading && <ArrowRight size={16}/>}</button></form>
      <div className="auth-switch">Already have an archive? <Link to="/login">Log in</Link></div></div><div className="login-bottom">✦ YOUR PERSONAL ARCHIVE · PARACOSM © 2026 ✦</div></div><div className="login-decoration decoration-right">✧<br/>✦<br/>♡</div></div>;
}
