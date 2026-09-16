import { ExternalLink } from "lucide-react";
import { MovieRatings } from "@/lib/types";

function RatingCard({
  label,
  accentColor,
  score,
  subscore,
  votes,
  url,
  available,
}: {
  label: string;
  accentColor: string;
  score: string;
  subscore?: string;
  votes: string | null;
  url: string;
  available: boolean;
}) {
  const Card = (
    <div className="group relative flex flex-col gap-1.5 rounded-card border border-base-700 bg-base-900 px-4 py-4 h-full transition-all duration-200 hover:border-base-600 hover:bg-base-850">
      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-medium tracking-wide text-ink-500"
          style={{ color: accentColor }}
        >
          {label}
        </span>
        {url && (
          <ExternalLink
            size={12}
            className="text-ink-600 group-hover:text-ink-300 transition-colors"
          />
        )}
      </div>
      <span
        className={`font-display text-2xl font-semibold leading-none ${
          available ? "text-ink-100" : "text-ink-500"
        }`}
      >
        {score}
      </span>
      {subscore && <span className="text-xs text-ink-400 leading-none mt-0.5">{subscore}</span>}
      {votes && <span className="text-xs text-ink-500 mt-1">{votes}</span>}
      {!available && !votes && (
        <span className="text-[11px] text-ink-600 mt-1">Click to view source</span>
      )}
    </div>
  );

  if (!url) return Card;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-card"
    >
      {Card}
    </a>
  );
}

export function RatingGrid({ ratings }: { ratings: MovieRatings }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <RatingCard
        label="IMDb"
        accentColor="#F5C518"
        score={ratings.imdb.displayScore}
        votes={ratings.imdb.voteCount}
        url={ratings.imdb.url}
        available={ratings.imdb.available}
      />
      <RatingCard
        label="Rotten Tomatoes"
        accentColor="#FA320A"
        score={ratings.rottenTomatoes.displayScore}
        subscore={
          ratings.rottenTomatoes.audienceScore?.available
            ? `Audience ${ratings.rottenTomatoes.audienceScore.displayScore}`
            : undefined
        }
        votes={ratings.rottenTomatoes.voteCount}
        url={ratings.rottenTomatoes.url}
        available={ratings.rottenTomatoes.available}
      />
      <RatingCard
        label="Letterboxd"
        accentColor="#00E054"
        score={ratings.letterboxd.displayScore}
        votes={ratings.letterboxd.voteCount}
        url={ratings.letterboxd.url}
        available={ratings.letterboxd.available}
      />
    </div>
  );
}

