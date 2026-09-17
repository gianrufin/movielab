export interface MovieSummary {
  id: number; // TMDB id
  title: string;
  year: string;
  posterUrl: string | null;
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

export interface MovieDetail {
  id: number;
  title: string;
  year: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerYouTubeId: string | null;
  ratings: MovieRatings;
  consensus: Consensus | null;
}
