import { MovieSummary } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

function tmdbHeaders() {
  return {
    Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    accept: "application/json",
  };
}

export async function searchMovies(query: string): Promise<MovieSummary[]> {
  const res = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
    { headers: tmdbHeaders(), next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error(`TMDB search failed: ${res.status}`);
  const data = await res.json();

  return (data.results ?? []).slice(0, 8).map((r: any) => ({
    id: r.id,
    title: r.title,
    year: r.release_date ? r.release_date.slice(0, 4) : "—",
    posterUrl: r.poster_path ? `${IMG_BASE}/w500${r.poster_path}` : null,
  }));
}

export async function getMovieMetadata(tmdbId: number) {
  const [detailRes, videosRes, externalIdsRes] = await Promise.all([
    fetch(`${TMDB_BASE}/movie/${tmdbId}`, { headers: tmdbHeaders() }),
    fetch(`${TMDB_BASE}/movie/${tmdbId}/videos`, { headers: tmdbHeaders() }),
    fetch(`${TMDB_BASE}/movie/${tmdbId}/external_ids`, { headers: tmdbHeaders() }),
  ]);

  if (!detailRes.ok) throw new Error(`TMDB detail failed: ${detailRes.status}`);

  const detail = await detailRes.json();
  const videos = videosRes.ok ? await videosRes.json() : { results: [] };
  const externalIds = externalIdsRes.ok ? await externalIdsRes.json() : {};

  const trailer = (videos.results ?? []).find(
    (v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official
  ) ?? (videos.results ?? []).find((v: any) => v.site === "YouTube" && v.type === "Trailer");

  return {
    id: detail.id,
    title: detail.title,
    year: detail.release_date ? detail.release_date.slice(0, 4) : "—",
    overview: detail.overview,
    posterUrl: detail.poster_path ? `${IMG_BASE}/w780${detail.poster_path}` : null,
    backdropUrl: detail.backdrop_path ? `${IMG_BASE}/original${detail.backdrop_path}` : null,
    trailerYouTubeId: trailer?.key ?? null,
    imdbId: externalIds.imdb_id ?? null, // bridges us to OMDb + IMDb URLs
  };
}
