import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function LoginPage() {
  const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (loginError) throw loginError;
      if (!data.session) throw new Error("No session was created. Please try again.");
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) { setError(err.message === "Invalid login credentials" ? "Incorrect email or password. Please try again." : err.message); }
    finally { setLoading(false); }
  }
  return <div className="login-page"><Link to="/" className="back-home"><ArrowLeft size={15}/> BACK TO HOME</Link><div className="login-decoration decoration-left">✦<br/>♡<br/>✧</div>
    <div className="login-card window-frame"><div className="window-titlebar"><span>PARACOSM LOGIN.EXE</span><div><i/><i/><i/></div></div><div className="login-inner"><div className="login-emblem">✦</div><p className="eyebrow">WELCOME BACK, TRAVELLER</p><h1>Enter your<br/><em>little universe.</em></h1><p className="login-subtitle">Your stories have been waiting for you.</p>
      <form onSubmit={handleSubmit}><label className="form-label">EMAIL ADDRESS</label><div className="input-with-icon"><Mail size={17}/><input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></div><label className="form-label">PASSWORD</label><div className="input-with-icon"><LockKeyhole size={17}/><input type="password" placeholder="Your secret key..." value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></div><div className="login-form-options"><Link to="/forgot-password">Forgot password?</Link></div>{error && <p className="auth-error">{error}</p>}<button className="button login-submit" type="submit" disabled={loading}>{loading ? "ENTERING ARCHIVE..." : "ENTER ARCHIVE"}{!loading && <ArrowRight size={16}/>}</button></form>
      <div className="auth-switch">New to Paracosm? <Link to="/signup">Create an account</Link></div></div><div className="login-bottom">✦ YOUR PERSONAL ARCHIVE · PARACOSM © 2026 ✦</div></div><div className="login-decoration decoration-right">✧<br/>✦<br/>♡</div></div>;
}
