import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Clapperboard, Heart, Sparkles, Star } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Every kind of story", text: "Books, films, fanfiction, shows and all the little things you want to remember." },
  { icon: Star, title: "Your own little notes", text: "Keep ratings, reviews, memories and thoughts alongside every entry." },
  { icon: Sparkles, title: "A space that feels yours", text: "A playful archive with room for your collections, favourites and future themes." }
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      <div className="landing-sparkle sparkle-one">✦</div>
      <div className="landing-sparkle sparkle-two">✧</div>
      <header className="landing-nav">
        <Link to="/" className="landing-brand"><span className="brand-mark">✦</span> PARACOSM</Link>
        <nav><a href="#about">ABOUT</a><a href="#features">FEATURES</a><a href="#how">YOUR ARCHIVE</a></nav>
        <div className="landing-auth-links"><Link to="/login" className="landing-login-link">LOG IN</Link><Link to="/signup" className="button button-small">SIGN UP <ArrowRight size={14}/></Link></div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-star">✦</span> A PERSONAL MEDIA UNIVERSE</p>
            <h1>All your worlds.<br/><em>One little place.</em></h1>
            <p className="hero-description">A home for the stories you've read, the worlds you've visited, the things you've watched and everything you never want to forget.</p>
            <div className="hero-actions">
              <Link to="/signup" className="button">CREATE YOUR ARCHIVE <ArrowRight size={16}/></Link>
              <Link to="/login" className="text-link">ALREADY HAVE AN ACCOUNT? LOG IN</Link>
            </div>
            <div className="hero-footnote"><span className="pixel-heart">♥</span> MADE FOR COLLECTORS OF STORIES</div>
          </div>
          <div className="hero-art">
            <div className="hero-window window-frame">
              <div className="window-titlebar"><span>your little universe.png</span><div><i/><i/><i/></div></div>
              <div className="hero-scene">
                <div className="scene-sun">✦</div>
                <div className="scene-cloud cloud-a">☁</div>
                <div className="scene-cloud cloud-b">☁</div>
                <div className="scene-hill hill-back"/>
                <div className="scene-hill hill-front"/>
                <div className="scene-book">▤</div>
                <div className="scene-stars">✧　✦　⋆　✧</div>
                <div className="scene-caption">a universe made of stories</div>
              </div>
              <div className="window-status"><span>✦ DREAMING...</span><span>100% MAGIC</span></div>
            </div>
            <div className="floating-sticker sticker-book">▤<small>READ</small></div>
            <div className="floating-sticker sticker-heart">♥<small>LOVE</small></div>
            <div className="hero-caption">[ FIG. 01 — YOUR PERSONAL STORY ARCHIVE ]</div>
          </div>
        </section>

        <section className="landing-marquee"><span>BOOKS ✦ MOVIES ✦ ANIME ✦ FANFICTION ✦ TV SHOWS ✦ YOUR FAVOURITE THINGS ✦</span></section>

        <section className="features-section" id="features">
          <div className="section-intro"><p className="eyebrow">A PLACE FOR EVERYTHING</p><h2>Your stories deserve<br/>a little home.</h2></div>
          <div className="feature-grid">
            {features.map(({icon: Icon,title,text},i)=><article className="feature-card" key={title}><div className="feature-icon"><Icon size={22}/></div><span className="feature-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="landing-cta" id="about">
          <div><p className="eyebrow">THE ARCHIVE IS WAITING</p><h2>Ready to gather<br/>your little worlds?</h2></div>
          <div className="landing-cta-actions"><Link to="/signup" className="button">SIGN UP <ArrowRight size={16}/></Link><Link to="/login" className="text-link">LOG IN</Link></div>
          <div className="cta-decoration">✧ ✦ ♡ ✦ ✧</div>
        </section>
      </main>
      <footer className="landing-footer"><span>PARACOSM.EXE</span><span>A LITTLE UNIVERSE FOR EVERYTHING YOU LOVE.</span><span>✦ 2026 ✦</span></footer>
    </div>
  );
}
