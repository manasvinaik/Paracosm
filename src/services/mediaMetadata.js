import { supabase } from "../lib/supabaseClient";

const ANILIST_URL = "https://graphql.anilist.co";
const OPEN_LIBRARY_SEARCH_URL = "https://openlibrary.org/search.json";
const OPEN_LIBRARY_CACHE_TTL = 5 * 60 * 1000;
const openLibraryCache = new Map();
let lastOpenLibraryRequestAt = 0;

async function anilistRequest(query, variables = {}) {
  const response = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload.errors?.length) {
    throw new Error(payload.errors?.[0]?.message || `AniList request failed (${response.status}).`);
  }
  return payload.data;
}

const ANIME_SEARCH = `
query ($search: String) {
  Page(page: 1, perPage: 15) {
    media(search: $search, type: ANIME) {
      id
      title { romaji english native }
      description(asHtml: false)
      coverImage { extraLarge large }
      startDate { year }
      episodes
      genres
      studios(isMain: true) { nodes { name } }
      siteUrl
      format
      seasonYear
    }
  }
}`;

const ANIME_DETAILS = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title { romaji english native }
    description(asHtml: false)
    coverImage { extraLarge large }
    startDate { year }
    episodes
    genres
    studios(isMain: true) { nodes { name } }
    siteUrl
    format
    seasonYear
  }
}`;

function mapAnime(media) {
  const title = media.title?.english || media.title?.romaji || media.title?.native || "Untitled anime";
  const studio = media.studios?.nodes?.map((item) => item.name).filter(Boolean).join(", ") || "";
  return {
    id: String(media.id), title, creator: studio,
    description: (media.description || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    image: media.coverImage?.extraLarge || media.coverImage?.large || "",
    year: media.startDate?.year || media.seasonYear || "", category: "Anime",
    sourceUrl: media.siteUrl || `https://anilist.co/anime/${media.id}`,
    metadataSource: "anilist", externalId: String(media.id),
    extra: { episodes: media.episodes || null, genres: media.genres || [], format: media.format || "" },
  };
}

export async function searchAnime(query) {
  if (!query.trim()) return [];
  const data = await anilistRequest(ANIME_SEARCH, { search: query.trim() });
  return (data.Page?.media || []).map(mapAnime);
}

export async function getAnimeDetails(id) {
  const data = await anilistRequest(ANIME_DETAILS, { id: Number(id) });
  if (!data.Media) throw new Error("AniList could not find that anime.");
  return mapAnime(data.Media);
}

async function tmdbRequest(body) {
  const { data, error } = await supabase.functions.invoke("tmdb-metadata", { body });
  if (error) throw new Error(error.message || "Could not reach the TMDB metadata function.");
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function searchTmdb(query, mediaType) {
  if (!query.trim()) return [];
  const data = await tmdbRequest({ action: "search", query: query.trim(), mediaType });
  return data.results || [];
}

export async function getTmdbDetails(id, mediaType) {
  return tmdbRequest({ action: "details", id: Number(id), mediaType });
}

// Open Library Search API. Cache repeated searches and keep requests at or below
// the documented one-request-per-second default for unidentified clients.
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mapOpenLibraryBook(book) {
  const workKey = book.key || "";
  const olid = workKey.split("/").filter(Boolean).pop() || "";
  const title = book.title || "Untitled book";
  const authors = Array.isArray(book.author_name) ? book.author_name : [];
  const coverId = book.cover_i;
  const isbn = Array.isArray(book.isbn) ? book.isbn[0] : "";
  const image = coverId
    ? `https://covers.openlibrary.org/b/id/${encodeURIComponent(coverId)}-L.jpg?default=false`
    : isbn
      ? `https://covers.openlibrary.org/b/isbn/${encodeURIComponent(isbn)}-L.jpg?default=false`
      : "";

  return {
    id: olid || isbn || `${title}-${authors[0] || "unknown"}`,
    title,
    creator: authors.join(", "),
    description: typeof book.description === "string"
      ? book.description
      : book.description?.value || "",
    image,
    year: book.first_publish_year || "",
    category: "Books",
    sourceUrl: workKey ? `https://openlibrary.org${workKey}` : "https://openlibrary.org/",
    metadataSource: "open-library",
    externalId: olid,
    extra: {
      openLibraryKey: workKey,
      coverId: coverId || null,
      isbn: isbn || null,
      publishers: book.publisher || [],
      editionCount: book.edition_count || null,
      subjects: book.subject || [],
      authorKeys: book.author_key || [],
    },
  };
}

export async function searchOpenLibrary(query) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return [];

  const cacheKey = trimmedQuery.toLowerCase();
  const cached = openLibraryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < OPEN_LIBRARY_CACHE_TTL) {
    return cached.results;
  }

  const elapsed = Date.now() - lastOpenLibraryRequestAt;
  if (elapsed < 1000) await wait(1000 - elapsed);

  const params = new URLSearchParams({
    q: trimmedQuery,
    fields: "key,title,author_name,first_publish_year,cover_i,isbn,publisher,edition_count,subject,author_key,description",
    limit: "15",
  });

  let response;
  try {
    lastOpenLibraryRequestAt = Date.now();
    response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`, {
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error("Could not reach Open Library. Check your internet connection and try again.");
  }

  if (!response.ok) {
    throw new Error(`Open Library search failed (${response.status}). Please try again shortly.`);
  }

  const payload = await response.json().catch(() => null);
  if (!payload || !Array.isArray(payload.docs)) {
    throw new Error("Open Library returned an unexpected search response.");
  }

  const results = payload.docs.map(mapOpenLibraryBook);
  openLibraryCache.set(cacheKey, { timestamp: Date.now(), results });
  return results;
}

export async function getOpenLibraryDetails(result) {
  if (!result) throw new Error("No book was selected.");
  // Search results already include the work metadata and cover identifier.
  return { ...result, category: "Books" };
}

async function comickSourceRequest(path, body) {
  let response;
  try {
    response = await fetch(`/api/comick-source${path.replace(/^\/api/, "")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error("Could not reach the manga catalogue API. Check your internet connection or the API host.");
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload?.error || payload?.message || payload?.details;
    throw new Error(detail ? `Manga API error (${response.status}): ${detail}` : `Manga API request failed (${response.status}). Try another source.`);
  }
  return payload;
}

function mapComickSourceResult(item, source = "mangaread", category = "Manga & Manhwa") {
  const id = item.id || item.slug || item.url;
  const title = item.title || item.name || "Untitled manga";
  return {
    id: String(id || title), title,
    creator: item.author || item.authors || item.artist || item.artists || "",
    description: item.description || item.synopsis || item.summary || "",
    image: item.coverImage || item.cover || item.thumbnail || item.thumb || "",
    year: item.year || item.releaseYear || "", category,
    sourceUrl: item.url || "", metadataSource: "comick-source-api",
    externalId: `${source}:${String(id || "")}`,
    extra: {
      source, sourceName: item.source || source,
      latestChapter: item.latestChapter ?? null,
      lastUpdated: item.lastUpdated || "",
      providerRating: item.rating ?? null,
    },
  };
}

export async function searchComickSource(query, source = "mangaread", category = "Manga & Manhwa") {
  if (!query.trim()) return [];
  const payload = await comickSourceRequest("/api/search", { query: query.trim(), source });
  const results = Array.isArray(payload) ? payload : payload.results || payload.data?.results || [];
  if (!Array.isArray(results)) throw new Error("The manga API returned an unexpected search response.");
  return results
    .map((item) => mapComickSourceResult(item, item.sourceId || source, category))
    .filter((item) => item.title && item.title !== "Untitled manga" && item.sourceUrl);
}

export async function getComickSourceDetails(result, category = "Manga & Manhwa") {
  if (!result?.sourceUrl) throw new Error("This manga result does not include a source URL.");
  return { ...result, category };
}
