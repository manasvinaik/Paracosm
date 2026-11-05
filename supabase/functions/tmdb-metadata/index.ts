import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normalize(item: any, mediaType: "movie" | "tv", details = false) {
  const title = mediaType === "movie" ? item.title : item.name;
  const date = mediaType === "movie" ? item.release_date : item.first_air_date;
  let creator = "";
  if (details && mediaType === "movie") {
    creator = item.credits?.crew?.find((person: any) => person.job === "Director")?.name || "";
  } else if (details && mediaType === "tv") {
    creator = (item.created_by || []).map((person: any) => person.name).filter(Boolean).join(", ");
  }
  return {
    id: String(item.id),
    title: title || "Untitled",
    creator,
    description: item.overview || "",
    image: item.poster_path ? `${IMAGE_BASE}${item.poster_path}` : "",
    year: date ? Number(date.slice(0, 4)) || "" : "",
    category: mediaType === "movie" ? "Movies" : "TV Shows",
    sourceUrl: `https://www.themoviedb.org/${mediaType}/${item.id}`,
    metadataSource: "tmdb",
    externalId: String(item.id),
    extra: {
      genres: (item.genres || []).map((genre: any) => genre.name),
      runtime: item.runtime || null,
      numberOfSeasons: item.number_of_seasons || null,
      numberOfEpisodes: item.number_of_episodes || null,
    },
  };
}

serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed." }, 405);

  try {
    const apiKey = Deno.env.get("TMDB_API_KEY");
    if (!apiKey) return json({ error: "TMDB_API_KEY is not configured in Supabase Function Secrets." }, 500);

    const body = await request.json();
    const mediaType = body.mediaType;
    if (mediaType !== "movie" && mediaType !== "tv") return json({ error: "mediaType must be movie or tv." }, 400);

    let endpoint: string;
    let isDetails = false;
    if (body.action === "search") {
      const query = String(body.query || "").trim();
      if (!query) return json({ results: [] });
      endpoint = `/search/${mediaType}?query=${encodeURIComponent(query)}&include_adult=false&page=1`;
    } else if (body.action === "details") {
      const id = Number(body.id);
      if (!Number.isInteger(id) || id <= 0) return json({ error: "A valid TMDB ID is required." }, 400);
      endpoint = `/${mediaType}/${id}${mediaType === "movie" ? "?append_to_response=credits" : "?append_to_response=credits"}`;
      isDetails = true;
    } else {
      return json({ error: "Unknown action." }, 400);
    }

    const response = await fetch(`${TMDB_BASE}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${encodeURIComponent(apiKey)}`);
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return json({ error: payload.status_message || `TMDB request failed (${response.status}).` }, response.status);

    if (isDetails) return json(normalize(payload, mediaType, true));
    return json({ results: (payload.results || []).map((item: any) => normalize(item, mediaType)) });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unexpected TMDB error." }, 500);
  }
});
