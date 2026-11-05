import { useMemo, useState } from "react";
import { ImagePlus, Search, Sparkles, LoaderCircle, ArrowDownToLine } from "lucide-react";
import { PixelButton } from "./PixelUI";
import { normalizeImageUrl } from "../lib/imageUrl";
import { getAnimeDetails, getTmdbDetails, searchAnime, searchTmdb, getComickSourceDetails, searchComickSource, searchOpenLibrary, getOpenLibraryDetails } from "../services/mediaMetadata";
import { useLibrary } from "../context/LibraryContext";

const blank = { title: "", creator: "", category: "Books", status: "Want to read", rating: "0", year: "", image: "", description: "", sourceUrl: "", metadataSource: "", externalId: "" };
const statusOptions = ["Want to read", "Want to watch", "Want to play", "Reading", "Watching", "Playing", "Completed", "On hold", "Dropped", "Rewatch"];

export default function MediaForm({ initialValues = blank, onSubmit, submitLabel = "SAVE TO ARCHIVE" }) {
  const { shelves = [] } = useLibrary();
  const categoryOptions = [...new Set([...shelves.map(category => category.name), initialValues.category].filter(Boolean))];
  const [form, setForm] = useState({ ...blank, ...initialValues });
  const [mode, setMode] = useState("manual");
  const [query, setQuery] = useState("");
  const [mangaSource, setMangaSource] = useState("mangaread");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectingId, setSelectingId] = useState("");
  const [searchError, setSearchError] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const provider = useMemo(() => form.category === "Books" ? "open-library" : form.category === "Anime" ? "anilist" : ["Movies", "TV Shows"].includes(form.category) ? "tmdb" : /manga|manhwa|comic/i.test(form.category) ? "manga-api" : "none", [form.category]);
  const providerLabel = provider === "open-library" ? "Open Library" : provider === "anilist" ? "AniList" : provider === "tmdb" ? "TMDB" : "Manga catalogue";
  const change = (key, value) => setForm(current => ({ ...current, [key]: value }));

  async function runSearch(e) {
    e?.preventDefault();
    if (!query.trim()) { setSearchError("Enter a title to search."); return; }
    if (provider === "none") { setSearchError("Online search is available for Books, Movies, TV Shows, Anime and Manga & Manhwa. Choose one of those categories first."); return; }
    setSearching(true); setSearchError(""); setResults([]);
    try {
      const found = provider === "open-library" ? await searchOpenLibrary(query) : provider === "anilist" ? await searchAnime(query) : provider === "manga-api" ? await searchComickSource(query, mangaSource, form.category) : await searchTmdb(query, form.category === "Movies" ? "movie" : "tv");
      setResults(found);
      if (!found.length) setSearchError("No matches found. Try another title or use manual entry.");
    } catch (err) { setSearchError(err.message || `Unable to search ${providerLabel}.`); }
    finally { setSearching(false); }
  }

  async function selectResult(result) {
    setSelectingId(result.id); setSearchError("");
    try {
      const details = provider === "open-library"
        ? await getOpenLibraryDetails(result)
        : provider === "anilist"
          ? await getAnimeDetails(result.id)
          : provider === "manga-api"
            ? await getComickSourceDetails(result, form.category)
            : await getTmdbDetails(result.id, form.category === "Movies" ? "movie" : "tv");
      setForm(current => ({ ...current, ...details, rating: current.rating || "0", status: current.status === "Want to read" && ["Movies", "TV Shows", "Anime"].includes(details.category) ? "Want to watch" : current.status }));
      setMode("manual");
      setResults([]);
      setQuery("");
    } catch (err) { setSearchError(err.message || "Could not load the selected title."); }
    finally { setSelectingId(""); }
  }

  async function submit(e) {
    e.preventDefault(); setError(""); setSaving(true);
    try {
      const image = normalizeImageUrl(form.image);
      await onSubmit({ ...form, image, rating: Number(form.rating), year: form.year || "" });
    } catch (err) { setError(err.message || "Unable to save this entry."); }
    finally { setSaving(false); }
  }

  return <div className="media-form-wrap">
    <div className="form-mode-tabs">
      <button className={mode === "manual" ? "selected" : ""} type="button" onClick={() => setMode("manual")}><ImagePlus size={15}/> MANUAL ENTRY</button>
      <button className={mode === "online" ? "selected" : ""} type="button" onClick={() => setMode("online")}><Sparkles size={15}/> SEARCH ONLINE</button>
    </div>

    {mode === "online" && <section className="metadata-search-panel">
      <div className="metadata-search-intro"><Sparkles size={17}/><span><strong>Find your next addition</strong><small>Search {provider === "none" ? "Open Library, TMDB, AniList or the manga catalogue" : providerLabel} and import its details into your archive.</small></span></div>
      <label className="field">MEDIA CATEGORY
        <select value={form.category} onChange={e => { change("category", e.target.value); setResults([]); setSearchError(""); }}>
          {categoryOptions.map(x => <option key={x}>{x}</option>)}
        </select>
      </label>
      {provider === "none" ? <p className="metadata-hint">Choose <b>Books</b>, <b>Movies</b>, <b>TV Shows</b>, <b>Anime</b> or <b>Manga &amp; Manhwa</b> to search online. Other categories can still be added manually.</p> : <>
        {provider === "manga-api" && <label className="field">MANGA SOURCE
          <select value={mangaSource} onChange={e => { setMangaSource(e.target.value); setResults([]); setSearchError(""); }}>
            <option value="mangaread">MangaRead (recommended)</option>
            <option value="mangakatana">MangaKatana</option>
            <option value="mgeko">Mgeko</option>
            <option value="weebcentral">WeebCentral</option>
            <option value="webtoon">WEBTOON</option>
            <option value="manhuaplus">ManhuaPlus</option>
            <option value="comix">Comix</option>
            <option value="bato">Bato</option>
          </select>
        </label>}
        <form className="metadata-search-form" onSubmit={runSearch}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${providerLabel} for a title...`} aria-label="Search media title" />
          <PixelButton type="submit" disabled={searching}>{searching ? <LoaderCircle size={14} className="spin-icon"/> : <Search size={14}/>} {searching ? "SEARCHING" : "SEARCH"}</PixelButton>
        </form>
        <p className="metadata-hint">{provider === "open-library" ? "Book metadata and cover images provided by Open Library." : provider === "tmdb" ? "Movie and TV metadata provided by TMDB." : provider === "anilist" ? "Anime metadata provided by AniList. No API key is required for public search." : "Manga and manhwa search powered by the selected catalogue source. MangaRead is the verified default."}</p>
      </>}
      {searchError && <p className="metadata-error">{searchError}</p>}
      {results.length > 0 && <div className="metadata-results" aria-live="polite">{results.map(result => <button className="metadata-result" type="button" key={`${provider}-${result.id}`} onClick={() => selectResult(result)} disabled={Boolean(selectingId)}>
        {result.image ? <img src={result.image} alt="" onError={e => { e.currentTarget.style.visibility = "hidden"; }}/> : <span className="metadata-result-placeholder">✦</span>}
        <span className="metadata-result-copy"><strong>{result.title}</strong><small>{result.year || "Year unavailable"}{result.creator ? ` · ${result.creator}` : ""}{result.extra?.latestChapter != null ? ` · Latest: Ch. ${result.extra.latestChapter}` : ""}{result.extra?.providerRating != null ? ` · ★ ${result.extra.providerRating}` : ""}</small></span>
        <span className="metadata-import-label">{selectingId === result.id ? "LOADING..." : <><ArrowDownToLine size={13}/> IMPORT</>}</span>
      </button>)}</div>}
    </section>}

    <form className="stacked-form" onSubmit={submit}><div className="form-grid">
      <label className="field full">TITLE *<input required value={form.title} onChange={e => change("title", e.target.value)} placeholder="What are we adding?"/></label>
      <label className="field">CATEGORY<select value={form.category} onChange={e => change("category", e.target.value)}>{categoryOptions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="field">CREATOR / AUTHOR<input value={form.creator} onChange={e => change("creator", e.target.value)} placeholder="Who made it?"/></label>
      <label className="field">STATUS<select value={form.status} onChange={e => change("status", e.target.value)}>{statusOptions.map(x => <option key={x}>{x}</option>)}</select></label>
      <label className="field">YEAR<input type="number" min="0" max="9999" value={form.year} onChange={e => change("year", e.target.value)} placeholder="2026"/></label>
      <label className="field">YOUR RATING<select value={form.rating} onChange={e => change("rating", e.target.value)}>{["0","0.5","1","1.5","2","2.5","3","3.5","4","4.5","5"].map(x => <option key={x} value={x}>{x === "0" ? "Not rated" : `${x} / 5 stars`}</option>)}</select></label>
      <label className="field full">COVER IMAGE URL<input type="url" value={form.image} onChange={e => change("image", e.target.value)} placeholder="https://example.com/cover.jpg"/><small className="field-hint">A cover URL is filled automatically when available. You can replace it.</small></label>
      {form.image && /^https?:\/\//i.test(form.image) && <div className="image-url-preview"><img src={form.image} alt="Cover preview" onError={e => { e.currentTarget.style.display = "none"; }}/><span>Cover preview</span></div>}
      <label className="field full">DESCRIPTION<textarea rows="4" value={form.description} onChange={e => change("description", e.target.value)} placeholder="A little about this media..."/></label>
      <label className="field full">ORIGINAL LINK<input type="url" value={form.sourceUrl} onChange={e => change("sourceUrl", e.target.value)} placeholder="https://..."/></label>
      {form.metadataSource && <div className="metadata-source-note">Metadata imported from <b>{form.metadataSource === "tmdb" ? "TMDB" : form.metadataSource === "comick-source-api" ? "Manga catalogue API" : form.metadataSource === "open-library" ? "Open Library" : "AniList"}</b> · ID {form.externalId}</div>}
    </div>{error && <p className="auth-error">{error}</p>}<div className="form-actions"><PixelButton type="submit" disabled={saving}>{saving ? "SAVING..." : submitLabel}</PixelButton><span>* Required field</span></div></form>
  </div>;
}
