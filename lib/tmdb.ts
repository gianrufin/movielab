import { MovieSummary } from "./types";
import { findYouTubeTrailer } from "./scrapers/youtube";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p";

export interface CuratedMovie {
  id: number;
  title: string;
  year: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  trailerYouTubeId: string;
  imdbId: string;
  ratings?: {
    imdb: { score: number; displayScore: string; voteCount: string };
    rtCritics: { score: number; displayScore: string };
    rtAudience: { score: number; displayScore: string };
    letterboxd: { score: number; displayScore: string; voteCount: string };
  };
  consensus?: {
    overall_consensus: string;
    praises: string[];
    critiques: string[];
  };
}

export const CURATED_MOVIES: CuratedMovie[] = [
  {
    id: 27205,
    title: "Inception",
    year: "2010",
    overview:
      "Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    posterUrl: `${IMG_BASE}/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg`,
    backdropUrl: `${IMG_BASE}/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg`,
    trailerYouTubeId: "YoHD9XEInc0",
    imdbId: "tt1375666",
    ratings: {
      imdb: { score: 88, displayScore: "8.8/10", voteCount: "2.6M votes" },
      rtCritics: { score: 87, displayScore: "87%" },
      rtAudience: { score: 91, displayScore: "91%" },
      letterboxd: { score: 84, displayScore: "4.2★", voteCount: "2.3M members" },
    },
    consensus: {
      overall_consensus:
        "A mind-bending heist triumph that balances visionary subconscious architecture with grounded emotional stakes.",
      praises: [
        "Christopher Nolan's audacious original concept and direction",
        "Hans Zimmer's iconic, pulse-pounding brass score",
        "Leonardo DiCaprio's emotionally resonant central performance",
      ],
      critiques: [
        "Heavy exposition dialogue throughout the opening act",
        "Complex multi-tiered dream mechanics can require multiple viewings",
      ],
    },
  },
  {
    id: 155,
    title: "The Dark Knight",
    year: "2008",
    overview:
      "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    posterUrl: `${IMG_BASE}/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    backdropUrl: `${IMG_BASE}/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg`,
    trailerYouTubeId: "EXeTwQWrcwY",
    imdbId: "tt0468569",
    ratings: {
      imdb: { score: 90, displayScore: "9.0/10", voteCount: "2.9M votes" },
      rtCritics: { score: 94, displayScore: "94%" },
      rtAudience: { score: 94, displayScore: "94%" },
      letterboxd: { score: 88, displayScore: "4.5★", voteCount: "2.9M members" },
    },
    consensus: {
      overall_consensus:
        "The undisputed gold standard of modern superhero cinema, elevated by Heath Ledger's electrifying, Oscar-winning Joker.",
      praises: [
        "Heath Ledger's chaotic and unforgettable tour-de-force performance",
        "Moral complexity and high-stakes philosophical clashes",
        "Visceral practical stuntwork and striking IMAX photography",
      ],
      critiques: [
        "Dense third act with multiple overlapping climaxes",
        "Batman's gravelly vocal delivery divides some viewers",
      ],
    },
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    year: "2024",
    overview:
      "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, Paul endeavors to prevent a terrible future only he can foresee.",
    posterUrl: `${IMG_BASE}/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg`,
    backdropUrl: `${IMG_BASE}/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg`,
    trailerYouTubeId: "Way9Dexny3w",
    imdbId: "tt15239678",
    ratings: {
      imdb: { score: 85, displayScore: "8.5/10", voteCount: "520K votes" },
      rtCritics: { score: 92, displayScore: "92%" },
      rtAudience: { score: 95, displayScore: "95%" },
      letterboxd: { score: 90, displayScore: "4.5★", voteCount: "1.7M members" },
    },
    consensus: {
      overall_consensus:
        "A monumental sci-fi epic featuring thunderous scale, peerless world-building, and an operatic descent into fanaticism.",
      praises: [
        "Denis Villeneuve's peerless scale and Greig Fraser's cinematography",
        "Timothée Chalamet's gripping transition into a messianic warlord",
        "Immersive, seat-shaking sound design and score",
      ],
      critiques: [
        "Pacing rush in the climactic showdown on Arrakis",
        "Substantial book deviations for Chani and Alia divide purists",
      ],
    },
  },
  {
    id: 447365,
    title: "Guardians of the Galaxy Vol. 3",
    year: "2023",
    overview:
      "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own. A mission that, if not completed successfully, could quite possibly lead to the end of the Guardians as we know them.",
    posterUrl: `${IMG_BASE}/w780/r2J02Z2OpNTctfOSN2Ydgii51I3.jpg`,
    backdropUrl: `${IMG_BASE}/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg`,
    trailerYouTubeId: "u3V5KDHRQvk",
    imdbId: "tt6791350",
    ratings: {
      imdb: { score: 79, displayScore: "7.9/10", voteCount: "420K votes" },
      rtCritics: { score: 82, displayScore: "82%" },
      rtAudience: { score: 94, displayScore: "94%" },
      letterboxd: { score: 80, displayScore: "4.0★", voteCount: "1.2M members" },
    },
    consensus: {
      overall_consensus:
        "An emotionally resonant, surprisingly poignant farewell to Marvel's beloved misfits driven by Rocket's tragic backstory.",
      praises: [
        "Genuinely moving emotional arc for Rocket Raccoon",
        "Inventive single-take hallway action sequence",
        "Satisfying and respectful conclusion for the original team",
      ],
      critiques: [
        "Dark tone and animal experimentation themes felt jarring to some",
        "Adam Warlock subplot felt underutilized",
      ],
    },
  },
  {
    id: 872585,
    title: "Oppenheimer",
    year: "2023",
    overview:
      "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, examining the scientific breakthroughs, political betrayal, and haunting guilt that reshaped human history.",
    posterUrl: `${IMG_BASE}/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg`,
    backdropUrl: `${IMG_BASE}/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg`,
    trailerYouTubeId: "uYPbbksJxIg",
    imdbId: "tt15398776",
    ratings: {
      imdb: { score: 89, displayScore: "8.9/10", voteCount: "780K votes" },
      rtCritics: { score: 93, displayScore: "93%" },
      rtAudience: { score: 91, displayScore: "91%" },
      letterboxd: { score: 88, displayScore: "4.4★", voteCount: "2.1M members" },
    },
    consensus: {
      overall_consensus:
        "A propulsive biographical masterpiece anchored by Cillian Murphy's haunting eyes and Ludwig Göransson's ticking score.",
      praises: [
        "Magnificent performances from Cillian Murphy and Robert Downey Jr.",
        "Unforgettable tension in the Trinity test sequence",
        "Masterful non-linear editing by Jennifer Lame",
      ],
      critiques: [
        "Dense political hearing dialogue can feel dry in the third hour",
        "Female characters receive comparatively limited screen time",
      ],
    },
  },
  {
    id: 157336,
    title: "Interstellar",
    year: "2014",
    overview:
      "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterUrl: `${IMG_BASE}/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg`,
    backdropUrl: `${IMG_BASE}/original/rAiYTsqJJR0nh0vRtBDqoqG0e0g.jpg`,
    trailerYouTubeId: "zSWdZVtXT7E",
    imdbId: "tt0816692",
    ratings: {
      imdb: { score: 87, displayScore: "8.7/10", voteCount: "2.1M votes" },
      rtCritics: { score: 73, displayScore: "73%" },
      rtAudience: { score: 86, displayScore: "86%" },
      letterboxd: { score: 86, displayScore: "4.3★", voteCount: "2.4M members" },
    },
    consensus: {
      overall_consensus:
        "An awe-inspiring sci-fi journey that bridges quantum astrophysics with a deeply emotional father-daughter bond.",
      praises: [
        "Hans Zimmer's transcendent pipe-organ score",
        "Visually jaw-dropping depictions of Gargantua and wormholes",
        "Matthew McConaughey's tearful video-playback scene",
      ],
      critiques: [
        "Climactic 'love transcends dimensions' dialogue felt sentimental to some critics",
        "Audio mix occasionally overpowers dialogue in theaters",
      ],
    },
  },
  {
    id: 496243,
    title: "Parasite",
    year: "2019",
    overview:
      "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    posterUrl: `${IMG_BASE}/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    backdropUrl: `${IMG_BASE}/original/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg`,
    trailerYouTubeId: "5xH0R_uie1U",
    imdbId: "tt6751668",
    ratings: {
      imdb: { score: 85, displayScore: "8.5/10", voteCount: "950K votes" },
      rtCritics: { score: 99, displayScore: "99%" },
      rtAudience: { score: 95, displayScore: "95%" },
      letterboxd: { score: 92, displayScore: "4.6★", voteCount: "3.2M members" },
    },
    consensus: {
      overall_consensus:
        "A razor-sharp social satire and pitch-black thriller that seamlessly shifts tones with peerless directorial control.",
      praises: [
        "Bong Joon-ho's flawless genre transitions and pacing",
        "Incisive, multi-layered critique of modern class divide",
        "Immaculate production design and ensemble acting",
      ],
      critiques: [
        "Unsettling and violent climax may disturb sensitive viewers",
      ],
    },
  },
];

function getTmdbAuth(): {
  headers: Record<string, string>;
  urlWithAuth: (url: string) => string;
} | null {
  const token = (
    process.env.TMDB_ACCESS_TOKEN ||
    process.env.TMDB_API_KEY ||
    process.env.TMDB_TOKEN
  )?.trim();

  if (!token) return null;

  // TMDB v4 Read Access Tokens are JWTs (typically > 50 characters, start with "ey")
  if (token.startsWith("ey") || token.length > 50) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      urlWithAuth: (url: string) => url,
    };
  }

  // TMDB v3 API Key (typically 32 hex characters)
  return {
    headers: {
      accept: "application/json",
    },
    urlWithAuth: (url: string) => {
      const sep = url.includes("?") ? "&" : "?";
      return `${url}${sep}api_key=${encodeURIComponent(token)}`;
    },
  };
}

function searchCurated(query: string): MovieSummary[] {
  const q = query.toLowerCase().trim();
  return CURATED_MOVIES.filter(
    (m) => m.title.toLowerCase().includes(q) || m.overview.toLowerCase().includes(q)
  ).map((m) => ({
    id: m.id,
    title: m.title,
    year: m.year,
    posterUrl: m.posterUrl,
  }));
}

export async function searchMovies(query: string): Promise<MovieSummary[]> {
  const auth = getTmdbAuth();

  if (!auth) {
    console.info("[tmdb] TMDB credentials not configured. Serving matching results from curated catalog.");
    return searchCurated(query);
  }

  try {
    const url = auth.urlWithAuth(
      `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
    );
    const res = await fetch(url, { headers: auth.headers, next: { revalidate: 3600 } });

    if (res.status === 401 || res.status === 403) {
      console.warn("[tmdb] TMDB authorization failed (401/403). Falling back to curated catalog.");
      return searchCurated(query);
    }

    if (!res.ok) {
      console.warn(`[tmdb] TMDB search returned status ${res.status}. Falling back to curated catalog.`);
      const curated = searchCurated(query);
      if (curated.length > 0) return curated;
      throw new Error(`TMDB search failed: ${res.status}`);
    }

    const data = await res.json();
    const liveResults = (data.results ?? []).slice(0, 8).map((r: any) => ({
      id: r.id,
      title: r.title,
      year: r.release_date ? r.release_date.slice(0, 4) : "—",
      posterUrl: r.poster_path ? `${IMG_BASE}/w500${r.poster_path}` : null,
    }));

    if (liveResults.length === 0) {
      return searchCurated(query);
    }

    return liveResults;
  } catch (err: any) {
    console.warn("[tmdb] searchMovies error caught, falling back to curated:", err.message || err);
    return searchCurated(query);
  }
}

export async function getMovieMetadata(tmdbId: number) {
  const curatedMatch = CURATED_MOVIES.find((m) => m.id === tmdbId);
  const auth = getTmdbAuth();

  if (!auth) {
    if (curatedMatch) {
      return {
        id: curatedMatch.id,
        title: curatedMatch.title,
        year: curatedMatch.year,
        overview: curatedMatch.overview,
        posterUrl: curatedMatch.posterUrl,
        backdropUrl: curatedMatch.backdropUrl,
        trailerYouTubeId: curatedMatch.trailerYouTubeId,
        imdbId: curatedMatch.imdbId,
      };
    }
    console.info(`[tmdb] TMDB credentials not set and movie ${tmdbId} not in curated list.`);
    throw new Error(`TMDB detail not available (no token configured and id ${tmdbId} not in fallback catalog)`);
  }

  try {
    const [detailRes, videosRes, externalIdsRes] = await Promise.all([
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}`), { headers: auth.headers }),
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}/videos`), { headers: auth.headers }),
      fetch(auth.urlWithAuth(`${TMDB_BASE}/movie/${tmdbId}/external_ids`), { headers: auth.headers }),
    ]);

    if (detailRes.status === 401 || detailRes.status === 403) {
      console.warn(`[tmdb] TMDB auth failed (401/403) on detail for ${tmdbId}.`);
      if (curatedMatch) {
        return {
          id: curatedMatch.id,
          title: curatedMatch.title,
          year: curatedMatch.year,
          overview: curatedMatch.overview,
          posterUrl: curatedMatch.posterUrl,
          backdropUrl: curatedMatch.backdropUrl,
          trailerYouTubeId: curatedMatch.trailerYouTubeId,
          imdbId: curatedMatch.imdbId,
        };
      }
      throw new Error(`TMDB detail failed: ${detailRes.status}`);
    }

    if (!detailRes.ok) {
      if (curatedMatch) {
        return {
          id: curatedMatch.id,
          title: curatedMatch.title,
          year: curatedMatch.year,
          overview: curatedMatch.overview,
          posterUrl: curatedMatch.posterUrl,
          backdropUrl: curatedMatch.backdropUrl,
          trailerYouTubeId: curatedMatch.trailerYouTubeId,
          imdbId: curatedMatch.imdbId,
        };
      }
      throw new Error(`TMDB detail failed: ${detailRes.status}`);
    }

    const detail = await detailRes.json();
    const videos = videosRes.ok ? await videosRes.json() : { results: [] };
    const externalIds = externalIdsRes.ok ? await externalIdsRes.json() : {};

    const trailer = (videos.results ?? []).find(
      (v: any) => v.site === "YouTube" && v.type === "Trailer" && v.official
    ) ?? (videos.results ?? []).find((v: any) => v.site === "YouTube" && v.type === "Trailer")
    ?? (videos.results ?? []).find((v: any) => v.site === "YouTube" && (v.type === "Teaser" || v.type === "Clip"));

    const year = detail.release_date ? detail.release_date.slice(0, 4) : "—";
    let trailerYouTubeId = trailer?.key ?? null;
    if (!trailerYouTubeId) {
      try {
        trailerYouTubeId = await findYouTubeTrailer(detail.title, year !== "—" ? year : undefined);
      } catch (e) {
        console.warn("[tmdb] Trailer scraping fallback error:", e);
      }
    }

    return {
      id: detail.id,
      title: detail.title,
      year,
      overview: detail.overview,
      posterUrl: detail.poster_path ? `${IMG_BASE}/w780${detail.poster_path}` : null,
      backdropUrl: detail.backdrop_path ? `${IMG_BASE}/original${detail.backdrop_path}` : null,
      trailerYouTubeId,
      imdbId: externalIds.imdb_id ?? null,
    };
  } catch (err: any) {
    if (curatedMatch) {
      console.warn(`[tmdb] Error fetching tmdb detail for ${tmdbId}, using curated data.`);
      return {
        id: curatedMatch.id,
        title: curatedMatch.title,
        year: curatedMatch.year,
        overview: curatedMatch.overview,
        posterUrl: curatedMatch.posterUrl,
        backdropUrl: curatedMatch.backdropUrl,
        trailerYouTubeId: curatedMatch.trailerYouTubeId,
        imdbId: curatedMatch.imdbId,
      };
    }
    throw err;
  }
}
