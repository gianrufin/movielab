export interface MovieSummary {
  id: number; // TMDB id
  title: string;
  year: string;
  posterUrl: string | null;
  director?: string | null;
  directors?: string[];
  leadCast?: string[];
}

export interface SearchRefinements {
  years: string[];
  directors: string[];
  cast: string[];
  hasMultipleSameTitle: boolean;
}

export interface SearchFilters {
  year?: string;
  director?: string;
  cast?: string;
}

export interface SearchResultPayload {
  results: MovieSummary[];
  refinements: SearchRefinements;
  detectedFilters?: {
    year?: string;
    person?: string;
  };
}

export interface RatingSource {
  available: boolean;
  score: number | null; // normalized 0-100 for internal use
  displayScore: string; // e.g. "8.4/10", "92%", "4.2★"
  voteCount: string | null; // e.g. "1.2M votes", "340 reviews"
  url: string;
}

export interface MovieRatings {
  imdb: RatingSource;
  rottenTomatoes: RatingSource & { audienceScore?: RatingSource };
  letterboxd: RatingSource;
}

export interface ReviewSnippet {
  source: "imdb" | "rottenTomatoes" | "letterboxd";
  text: string;
}

export interface Consensus {
  overall_consensus: string;
  loved_summary?: string;
  disliked_summary?: string;
  praises: string[];
  critiques: string[];
}

export interface WatchProvider {
  id: number;
  name: string;
  logoUrl: string | null;
}

export interface WatchProviders {
  stream: WatchProvider[];
  buy: WatchProvider[];
  rent: WatchProvider[];
  link?: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface Director {
  id: number;
  name: string;
  profileUrl?: string | null;
}

export interface MovieDetail {
  id: number;
  title: string;
  year: string;
  runtime?: string | null;
  overview: string;
  genres?: string[];
  directors?: Director[];
  cast?: CastMember[];
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerYouTubeId: string | null;
  ratings: MovieRatings;
  consensus: Consensus | null;
  watchProviders?: WatchProviders | null;
}

export interface PersonMovieCredit {
  id: number;
  title: string;
  year: string;
  releaseDate: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  overview?: string;
  voteAverage?: number | null;
  roles: string[]; // e.g. ["Director", "Producer"] or ["Cast: Verity Crawford"]
  departments: string[]; // e.g. ["Directing", "Editing", "Sound", "Production", "Writing", "Acting"]
}

export interface PersonDetail {
  id: number;
  name: string;
  biography?: string | null;
  birthday?: string | null;
  placeOfBirth?: string | null;
  profileUrl: string | null;
  knownForDepartment: string;
  latestMovie: PersonMovieCredit | null;
  latestMovieTrailerId: string | null;
  movies: PersonMovieCredit[]; // in chronological order: latest first, oldest last
}
